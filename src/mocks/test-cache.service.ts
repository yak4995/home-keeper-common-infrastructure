import { ICacheService } from '@yak4995/home-keeper-core';

export class TestCacheService implements ICacheService {
  getAllKeys(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }

  async get<T>(_key: string, fetchCallback: () => Promise<T>): Promise<T> {
    return fetchCallback();
  }

  set<T>(_keys: string[], value: T): Promise<T[]> {
    return Promise.resolve([value]);
  }

  clear(): Promise<boolean> {
    return Promise.resolve(true);
  }

  clearAll(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
