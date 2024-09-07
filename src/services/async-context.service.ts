import { AsyncLocalStorage } from 'async_hooks';

import { Injectable } from '@nestjs/common';

import { SystemOpts } from '@yak4995/home-keeper-core';

@Injectable()
export class AsyncContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<SystemOpts>();

  run<T>(callback: () => T, opts: SystemOpts): T {
    return this.asyncLocalStorage.run(opts, callback);
  }

  getSystemOpts(): SystemOpts | undefined {
    return this.asyncLocalStorage.getStore();
  }
}
