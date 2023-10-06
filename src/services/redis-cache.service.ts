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

  async get<T>(key: string, fetchCallback: () => Promise<T>): Promise<T> {
    const value: T = await this.cacheGateway.get(key);
    if (value) {
      return value;
    } else {
      const externalValue = await fetchCallback();
      if (externalValue) {
        await this.cacheGateway.set(key, externalValue);
        return externalValue;
      }
    }
  }

  async set<T>(keys: string[], value: T): Promise<T[]> {
    await this.clear(keys);
    await Promise.all(
      keys.map(
        (key: string): Promise<void> => this.cacheGateway.set(key, value),
      ),
    );
    return [value];
  }

  async clear(keys: string[]): Promise<boolean> {
    try {
      await Promise.all(
        keys.map((key: string): Promise<void> => this.cacheGateway.del(key)),
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
