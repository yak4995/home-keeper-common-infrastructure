// import { inspect } from 'node:util';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OutputStreamLoggerService extends Logger {
  private static readonly environment: string =
    process.env?.environment ?? 'production';

  constructor() {
    super();
  }

  public static log(message: string, trace?: string, context?: string): void {
    console.log(
      /*inspect*/ JSON.stringify(
        {
          message,
          trace,
          context,
          environment: OutputStreamLoggerService.environment,
        },
        // { depth: Infinity, maxArrayLength: 10, maxStringLength: Infinity },
      ),
    );
  }

  public static error(
    message: string,
    stack?: string,
    trace?: string,
    context?: string,
  ): void {
    console.log(
      /*inspect*/ JSON.stringify(
        {
          message,
          trace,
          stack,
          context,
          environment: OutputStreamLoggerService.environment,
        },
        // { depth: Infinity, maxArrayLength: 10, maxStringLength: Infinity },
      ),
    );
  }
}
