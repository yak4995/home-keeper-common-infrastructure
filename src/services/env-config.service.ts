import * as dotenv from 'dotenv';

import { Injectable } from '@nestjs/common';

import { IConfigService } from '@yak4995/home-keeper-core';

@Injectable()
export class EnvConfigService implements IConfigService {
  constructor() {
    dotenv.config();
  }

  async getConfigValue(key: string): Promise<unknown> {
    return process.env[key] ?? null;
  }
}
