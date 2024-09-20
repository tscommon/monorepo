export class BatchItem<T> {
  public constructor(
    public readonly batchIndex: number,
    public readonly itemIndex: number,
    public readonly item: T,
  ) {
    Object.freeze(this);
  }
}
