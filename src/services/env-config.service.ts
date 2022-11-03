import * as dotenv from 'dotenv';

import { Injectable } from '@nestjs/common';

import { IConfigService } from '@yak4995/home-keeper-core';

@Injectable()
export class EnvConfigService implements IConfigService {
  constructor() {
    dotenv.config();
  }

  getConfigValue(key: string): Promise<any> {
    return Promise.resolve(process.env[key] ?? null);
  }
}
