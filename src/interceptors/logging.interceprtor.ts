import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';

import { OutputStreamLoggerService } from '../services/output-stream-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly appName: string) {}

  intercept<T>(
    context: ExecutionContext,
    call$: CallHandler<T>,
  ): Observable<T> {
    const inputData = context.switchToRpc().getData();
    const { args = [null, null, 'Unknown path'] } = context
      .switchToRpc()
      .getContext();
    const now = Date.now();

    OutputStreamLoggerService.log(
      `PATH: ${args[2]}, INPUT: ${JSON.stringify(inputData)}`,
    );

    return call$
      .handle()
      .pipe(
        tap((outputData) => {
          OutputStreamLoggerService.log(
            `PATH: ${args[2]}, OUTPUT: ${JSON.stringify(
              outputData,
            )}, DURATION: ${Date.now() - now}ms`,
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
