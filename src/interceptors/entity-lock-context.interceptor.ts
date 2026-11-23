import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  runWithEntityLockTokens,
  type EntityLockTokens,
} from '../services/entity-mutex';

// Establish lock ownership before per-controller interceptors log or bind trusted RPC payloads.
@Injectable()
export class EntityLockContextInterceptor implements NestInterceptor {
  intercept<T>(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const payload = context
      .switchToRpc()
      .getData<{ __entityLocks?: EntityLockTokens }>();

    const tokens = payload.__entityLocks ?? {};

    delete payload.__entityLocks;

    return new Observable<T>((subscriber) =>
      runWithEntityLockTokens(tokens, () =>
        next.handle().subscribe(subscriber),
      ),
    );
  }
}
