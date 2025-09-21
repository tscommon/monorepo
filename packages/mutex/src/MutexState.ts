export class MutexState {
  public constructor(
    public owner?: object,
    public queue?: Promise<unknown>,
  ) {}
}
