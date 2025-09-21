import { describe, expect, test } from 'vitest';
import { Box } from './Box.js';

describe('Box', () => {
  test('contains value', () => {
    const box = new Box(42);
    expect(box.value).toBe(42);
  });
});
