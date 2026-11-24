import { Redis } from 'ioredis';
import { Mutex } from 'redis-semaphore';

import { entityLockContext } from './entity-lock-context';

export {
  getEntityLockTokens,
  runWithEntityLockTokens,
  type EntityLockTokens,
} from './entity-lock-context';

export type ReleaseEntityLock = () => Promise<void>;

let client: Redis | undefined;

function getRedis(): Redis {
  if (!client) {
    client = new Redis({
      host: process.env.cacheUrl,
      port: Number(process.env.cachePort),
      maxRetriesPerRequest: 1,
    });
    // Operations reject their promises on connection failure; handle the accompanying Redis error event.
    client.on('error', () => {});
  }

  return client;
}

export async function lockEntity(
  entityName: string,
  id: string,
): Promise<ReleaseEntityLock> {
  const key = `homekeeper-entity-lock:${entityName}:${id}`;
  const context = entityLockContext.getStore();
  const inherited = context?.get(key);

  // A nested saga RPC adopts the parent's identifier instead of waiting on its own parent.
  const lock = new Mutex(
    getRedis(),
    key,
    inherited ? { identifier: inherited, acquiredExternally: true } : undefined,
  );

  await lock.acquire();

  context?.set(key, lock.identifier);

  return async () => {
    // Nested calls stop their refresh without deleting the parent's mutex.
    if (inherited) {
      lock.stopRefresh();
    } else {
      await lock.release();
      context?.delete(key);
    }
  };
}

export async function lockEntities(
  entityName: string,
  ids: string[],
): Promise<ReleaseEntityLock> {
  const releases: ReleaseEntityLock[] = [];

  // Attempt every release even when another Redis release fails.
  const release = async () => {
    const results = await Promise.allSettled(
      [...releases].reverse().map((unlock) => unlock()),
    );

    const errors = results
      .filter((result) => result.status === 'rejected')
      .map((result) => result.reason);

    if (errors.length) {
      throw new AggregateError(errors, 'Failed to release entity locks');
    }
  };

  try {
    // Sorting and deduplication avoid opposite-order locking across multi-account operations.
    for (const id of [...new Set(ids)].sort()) {
      releases.push(await lockEntity(entityName, id));
    }
  } catch (error) {
    await release();
    throw error;
  }

  return release;
}

// Close the shared Redis connection during application shutdown.
export async function closeEntityMutex(): Promise<void> {
  if (client) {
    await client.quit();
    client = undefined;
  }
}
