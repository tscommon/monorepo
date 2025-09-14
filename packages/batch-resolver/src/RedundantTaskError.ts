export class RedundantTaskError extends Error {
  public constructor() {
    super('Task was redundant and has been replaced with a new one');
  }
}
