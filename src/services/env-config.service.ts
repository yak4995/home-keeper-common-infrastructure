import * as dotenv from 'dotenv';

import { Injectable } from '@nestjs/common';

import { IConfigService } from '@yak4995/home-keeper-core';

@Injectable()
export class EnvConfigService implements IConfigService {
  constructor() {
    dotenv.config();
  }

  async getConfigValue<T>(
    key: string,
    outputTypeMapper: (arg: string) => T,
  ): Promise<T> {
    return outputTypeMapper(process.env[key] ?? null);
  }
}
