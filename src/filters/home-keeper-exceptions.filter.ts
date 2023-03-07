import { Observable, throwError } from 'rxjs';
import { Catch, ExceptionFilter } from '@nestjs/common';

import { OutputStreamLoggerService } from '../services/output-stream-logger.service';

@Catch()
export class HomeKeeperExceptionsFilter implements ExceptionFilter {
  constructor(private readonly serviceName: string) {}

  catch(exception: Error | string): Observable<never> {
    if (exception instanceof Error && exception?.message && exception?.stack) {
      const rawErrorSrc = exception.stack.split('at')[1];
      const errorSrc = rawErrorSrc.slice(0, rawErrorSrc.indexOf('\n'));
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
      (exception as Error)?.stack ?? null,
      'HomeKeeperExceptionsFilter.catch',
    );

    return throwError(
      () => '' + ((exception as Error)?.message ?? exception ?? ''),
    );
  }
}
