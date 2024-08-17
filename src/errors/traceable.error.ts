export class TraceableError extends Error {
  constructor(public readonly trace: string, message: string) {
    super(message);
  }
}
