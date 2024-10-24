export class BatchItem<T> {
  public constructor(
    public readonly index: number,
    public readonly value: T,
  ) {
    Object.freeze(this);
  }
}
