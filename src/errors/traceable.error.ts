export class TraceableError extends Error {
  constructor(
    public readonly trace: string,
    message: string,
    stack?: string,
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    }
  }
}
