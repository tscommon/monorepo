import { describe, expect, it } from 'vitest';
import { CustomKeyResolverCache } from './CustomKeyResolverCache';
import { Task } from './Task';

describe('CustomKeyResolverCache', () => {
  it('maps a key', () => {
    const cache = new CustomKeyResolverCache<number, string>(JSON.stringify);
    const key = 1;
    const value = new Task<number, string>(key);
    expect(cache.set(key, value)).toBe(cache);
    expect(cache.get(key)).toStrictEqual(value);
    expect(cache.delete(key)).toBe(true);
    expect(cache.get(key)).toBeUndefined();
  });
});
