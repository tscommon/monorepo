/* eslint-disable @typescript-eslint/no-explicit-any */

export class MutexState {
  constructor(
    public owner?: object,
    public lock?: Promise<unknown>,
  ) {
    Object.seal(this);
  }
}
