import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ICacheService } from '@yak4995/home-keeper-core';

@Injectable()
export class RedisCacheService implements ICacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheGateway: Cache,
  ) {}

  getAllKeys(): Promise<string[]> {
    return this.cacheGateway.store.keys();
  }

  async get<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    ttlInSeconds: number,
  ): Promise<T> {
    const value: T = await this.cacheGateway.get(key);
    if (value) {
      return value;
    } else {
      const externalValue = await fetchCallback();
      if (externalValue) {
        await this.cacheGateway.set(key, externalValue, ttlInSeconds);
        return externalValue;
      }
    }
  }

  async set<T>(keys: string[], value: T, ttlInSeconds: number): Promise<T[]> {
    await this.clear(keys);
    return Promise.all(
      keys.map(
        (key: string): Promise<T> =>
          this.cacheGateway.set(key, value, ttlInSeconds),
      ),
    );
  }

  async clear(keys: string[]): Promise<boolean> {
    try {
      await Promise.all(
        keys.map((key: string): Promise<any> => this.cacheGateway.del(key)),
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  async clearAll(): Promise<boolean> {
    try {
      await this.cacheGateway.reset();
      return true;
    } catch (e) {
      return false;
    }
  }
}
