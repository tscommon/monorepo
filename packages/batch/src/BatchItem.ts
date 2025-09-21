/**
 * Represents an item in a batch, containing its index and value.
 */
export class BatchItem<T> {
  public constructor(
    public readonly index: number,
    public readonly value: T,
  ) {}
}
