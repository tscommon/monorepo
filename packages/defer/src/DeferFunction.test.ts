import { describe, expect, test } from 'vitest';
import { DeferFunction } from './DeferFunction';

describe('getDeferFunction', () => {
  test('defers a sync function', () => {
    const stack: string[] = [];
    function main(): void {
      using defer = new DeferFunction();
      stack.push('start');
      defer(() => stack.push('a'));
      defer(() => stack.push('b'));
      stack.push('end');
    }
    main();
    expect(stack.join(' -> ')).toBe('start -> end -> b -> a');
  });

  test('defers an async function', async () => {
    function nextTick<T>(fn: () => T): Promise<void> {
      return new Promise<void>((resolve) => {
        process.nextTick(() => {
          fn();
          resolve();
        });
      });
    }
    const stack: string[] = [];
    async function main(): Promise<void> {
      await using defer = new DeferFunction();
      stack.push('start');
      defer(nextTick, () => stack.push('a'));
      defer(nextTick, () => stack.push('b'));
      stack.push('end');
    }
    await main();
    expect(stack.join(' -> ')).toBe('start -> end -> b -> a');
  });
});
