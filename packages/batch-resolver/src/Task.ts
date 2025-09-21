import { Deferred } from '@tscommon/deferred';

/**
 * Captures a payload and a deferred result for batch processing.
 */
export class Task<Input, Result> extends Deferred<Result> {
  public constructor(
    public readonly input: Input,
    signal?: AbortSignal,
  ) {
    super(signal);
  }
}
