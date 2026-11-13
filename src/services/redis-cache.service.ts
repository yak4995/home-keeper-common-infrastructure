import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ICacheService } from '@yak4995/home-keeper-core';

@Injectable()
export class RedisCacheService implements ICacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheGateway: Cache,
  ) {}

  private readonly inFlightMap: Map<string, Promise<unknown>> = new Map();

  async getAllKeys(): Promise<string[]> {
    const keys = new Set<string>();

    for (const store of this.cacheGateway.stores) {
      if (!store.iterator) {
        throw new Error('Cache store does not support key iteration');
      }

      for await (const [key] of store.iterator({})) {
        keys.add(key);
      }
    }

    return [...keys];
  }

  async has(key: string): Promise<boolean> {
    const value = await this.cacheGateway.get(key);

    return value !== undefined && value !== null;
  }

  async get<T>(key: string, fetchCallback: () => Promise<T>): Promise<T> {
    const value: T = await this.cacheGateway.get(key);

    if (value !== undefined && value !== null) {
      return value;
    }

    if (this.inFlightMap.has(key)) {
      return this.inFlightMap.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        const externalValue = await fetchCallback();
        await this.cacheGateway.set(key, externalValue);
        return externalValue;
      } finally {
        this.inFlightMap.delete(key);
      }
    })();

    this.inFlightMap.set(key, promise);

    return promise;
  }

  async set<T>(keys: string[], value: T): Promise<T[]> {
    await this.clear(keys);

    await Promise.all(
      keys.map((key: string) => this.cacheGateway.set(key, value)),
    );

    return [value];
  }

  async clear(keys: string[]): Promise<boolean> {
    try {
      await Promise.all(keys.map((key: string) => this.cacheGateway.del(key)));
      return true;
    } catch {
      return false;
    }
  }

  async clearAll(): Promise<boolean> {
    try {
      return await this.cacheGateway.clear();
    } catch {
      return false;
    }
  }
}
