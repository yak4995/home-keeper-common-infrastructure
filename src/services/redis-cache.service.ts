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

  getAllKeys(): Promise<string[]> {
    return this.cacheGateway.store.keys();
  }

  async has(key: string): Promise<boolean> {
    const value = await this.cacheGateway.get(key);

    return !!value;
  }

  async get<T>(key: string, fetchCallback: () => Promise<T>): Promise<T> {
    const value: T = await this.cacheGateway.get(key);
    if (value) {
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
    } catch {
      return false;
    }
  }

  async clearAll(): Promise<boolean> {
    try {
      await this.cacheGateway.reset();
      return true;
    } catch {
      return false;
    }
  }
}
