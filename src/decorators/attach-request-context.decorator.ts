import { SystemOpts } from '@yak4995/home-keeper-core';

import { AsyncContextService } from '../services/async-context.service';

export interface Contextable {
  asyncContextService: AsyncContextService;
}

export function AttachRequestContext() {
  return function (
    target: Contextable,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (payload: object, opts: SystemOpts) {
      const asyncContextService = (this as typeof target).asyncContextService;

      if (!asyncContextService) {
        throw new Error('AsyncContextService is not defined in this class.');
      }

      const trace = opts?.trace || 'system';

      return asyncContextService.run(
        () => originalMethod.apply(this, [payload, opts]),
        {
          trace,
        },
      );
    };

    return descriptor;
  };
}
