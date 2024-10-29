import type { ResolverCache } from './ResolverCache';
import type { Task } from './Task';

export class CustomKeyResolverCache<Payload, Result> implements ResolverCache<Payload, Result> {
  #map = new Map<string, Task<Payload, Result>>();
  #getKey: (payload: Payload) => string;

  public constructor(getKey: (payload: Payload) => string) {
    this.#getKey = getKey;
  }

  public get(payload: Payload): Task<Payload, Result> | undefined {
    return this.#map.get(this.#getKey(payload));
  }

  public set(payload: Payload, value: Task<Payload, Result>): ResolverCache<Payload, Result> {
    this.#map.set(this.#getKey(payload), value);
    return this;
  }

  public delete(payload: Payload): boolean {
    return this.#map.delete(this.#getKey(payload));
  }
}
