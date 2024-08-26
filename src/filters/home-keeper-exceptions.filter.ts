import { Observable, throwError } from 'rxjs';

import { Catch, ExceptionFilter } from '@nestjs/common';

import { OutputStreamLoggerService } from '../services/output-stream-logger.service';
import { TraceableError } from '../errors/traceable.error';

// in all main.ts-s, except api-gateway
@Catch()
export class HomeKeeperExceptionsFilter implements ExceptionFilter {
  constructor(private readonly serviceName: string) {}

  catch(exception: TraceableError | string): Observable<never> {
    if (exception instanceof Error && exception?.message && exception?.stack) {
      const rawErrorSrc = exception.stack.split(/\n\s*at/)[1];
      const errorSrc = rawErrorSrc.slice(0, rawErrorSrc.indexOf(' ('));
      exception.message += ' FROM: ' + this.serviceName + ', file: ' + errorSrc;
    } else {
      if (typeof exception === 'string') {
        exception = exception.replace(
          ' FROM: ',
          ' FROM: ' + this.serviceName + ' FROM: ',
        );
      }
    }

    OutputStreamLoggerService.error(
      exception instanceof Error ? exception.message : exception,
      exception instanceof Error ? exception?.stack : null,
      exception instanceof TraceableError ? exception?.trace : null,
      'HomeKeeperExceptionsFilter.catch',
    );

    return throwError(
      () =>
        '' +
        (exception instanceof Error
          ? exception?.message
          : typeof exception === 'string'
          ? exception
          : ''),
    );
  }
}
