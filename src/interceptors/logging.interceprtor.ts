import { Observable, tap, catchError } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { SystemOpts } from '@yak4995/home-keeper-core';

import { OutputStreamLoggerService } from '../services/output-stream-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly appName: string) {}

  intercept<T>(
    context: ExecutionContext,
    call$: CallHandler<T>,
  ): Observable<T> {
    const { trace, ...inputData } = context
      .switchToRpc()
      .getData<object & SystemOpts>();
    const { args = [null, null, 'Unknown path'] } = context
      .switchToRpc()
      .getContext<{ args: string | null }>();
    const now = Date.now();

    OutputStreamLoggerService.log(
      `PATH: ${args[2]}, INPUT: ${JSON.stringify(inputData)}`,
      trace,
    );

    return call$
      .handle()
      .pipe(
        tap((outputData) => {
          OutputStreamLoggerService.log(
            `PATH: ${args[2]}, OUTPUT: ${JSON.stringify(
              outputData,
            )}, DURATION: ${Date.now() - now}ms`,
            trace,
          );
        }),
      )
      .pipe(
        catchError((error) => {
          throw error;
        }),
      );
  }
}
