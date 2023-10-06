import * as dotenv from 'dotenv';

import { Injectable } from '@nestjs/common';

import { IConfigService } from '@yak4995/home-keeper-core';

@Injectable()
export class EnvConfigService implements IConfigService<string> {
  constructor() {
    dotenv.config();
  }

  async getConfigValue(key: string): Promise<string> {
    return process.env[key] ?? null;
  }
}
