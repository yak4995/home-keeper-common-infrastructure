export interface ICacheService {
  getAllKeys(): Promise<string[]>;
  get<T>(
    key: string,
    fetchCallback: () => Promise<T>,
    ttlInSeconds: number,
  ): Promise<T>;
  set<T>(keys: string[], value: T, ttlInSeconds: number): Promise<T[]>;
  clear(keys: string[]): Promise<boolean>;
  clearAll(): Promise<boolean>;
}
