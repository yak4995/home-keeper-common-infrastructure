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

  intercept(
    context: ExecutionContext,
    call$: CallHandler<any>,
  ): Observable<any> {
    const data = context.switchToRpc().getData();
    const now = Date.now();

    OutputStreamLoggerService.log(`${data}; INPUT: ${JSON.stringify(data)}`);

    return call$
      .handle()
      .pipe(
        tap((data) => {
          OutputStreamLoggerService.log(
            `${data}; OUTPUT: ${JSON.stringify(data)} DURATION: ${
              Date.now() - now
            }ms`,
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
