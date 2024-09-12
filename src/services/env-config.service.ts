import * as dotenv from 'dotenv';
import * as _path from 'path';

import { Injectable } from '@nestjs/common';

import { IConfigService } from '@yak4995/home-keeper-core';
import { OutputStreamLoggerService } from './output-stream-logger.service';

@Injectable()
export class EnvConfigService implements IConfigService {
  constructor() {
    const path = _path.resolve(
      process.cwd(),
      `.env${
        ['test'].includes(process.env.environment)
          ? '.' + process.env.environment
          : ''
      }`,
    );
    OutputStreamLoggerService.log(
      `Read envs from path: ${path}`,
      'init',
      'EnvConfigService.constructor',
    );

    dotenv.config({ path });
  }

  async getConfigValue(key: string): Promise<unknown> {
    return process.env[key] ?? null;
  }
}
