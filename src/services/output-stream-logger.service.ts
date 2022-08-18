import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OutputStreamLoggerService extends Logger {
  constructor() {
    super();
  }

  public static log(message: string, context?: string): void {
    console.log(
      JSON.stringify({
        datetime:
          new Date().toLocaleDateString('ua-UA') +
          ' ' +
          new Date().toLocaleTimeString('ua-UA'),
        message,
        context,
        environment: `${process.env.DEBUG_MODE === '1' ? 'DEV' : 'PROD'}`,
      }) + '\n',
    );
  }

  public static error(message: string, trace?: string, context?: string): void {
    console.log(
      JSON.stringify({
        datetime:
          new Date().toLocaleDateString('ua-UA') +
          ' ' +
          new Date().toLocaleTimeString('ua-UA'),
        message,
        trace,
        context,
        environment: `${process.env.DEBUG_MODE === '1' ? 'DEV' : 'PROD'}`,
      }) + '\n',
    );
  }
}
