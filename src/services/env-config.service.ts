import { IConfigService } from '@yak4995/home-keeper-core';

export class EnvConfigService implements IConfigService {
  getConfigValue(key: string): Promise<any> {
    return Promise.resolve(process.env[key] ?? null);
  }
}
