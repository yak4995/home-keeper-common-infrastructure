import { AsyncLocalStorage } from 'node:async_hooks';

export type EntityLockTokens = Record<string, string>;

export const entityLockContext = new AsyncLocalStorage<Map<string, string>>();

// Pass lock identifiers through internal RPCs so nested saga steps do not acquire their parent's lock again.
export function getEntityLockTokens(): EntityLockTokens {
  return Object.fromEntries(entityLockContext.getStore() ?? []);
}

// Isolate the ownership identifiers for one incoming RPC while callback handles that request.
export function runWithEntityLockTokens<T>(
  tokens: EntityLockTokens,
  callback: () => T,
): T {
  return entityLockContext.run(new Map(Object.entries(tokens)), callback);
}
