import type { CacheModuleOptions } from '@nestjs/cache-manager';
import { EnvConfigService } from './env-config.service';

/** All HomeKeeper services share one namespace for cross-service invalidation. */
export async function createRedisCacheOptions(
  config: EnvConfigService,
): Promise<CacheModuleOptions> {
  const host = String(await config.getConfigValue('cacheUrl'));
  const port = Number(await config.getConfigValue('cachePort'));
  // cache-manager-redis-store used seconds; cache-manager/Keyv use milliseconds.
  const ttlSeconds = Number(await config.getConfigValue('cacheTTL'));

  if (
    !host ||
    host === 'null' ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error('cacheUrl and a valid cachePort are required');
  }

  if (!Number.isFinite(ttlSeconds) || ttlSeconds < 0) {
    throw new Error('cacheTTL must be a non-negative number of seconds');
  }

  const { createKeyv } = await import('@keyv/redis');

  const store = createKeyv(`redis://${host}:${port}`, {
    namespace: 'homekeeper',
    throwOnConnectError: true,
    throwOnErrors: true,
  });

  return { stores: [store], ttl: ttlSeconds * 1000 };
}
