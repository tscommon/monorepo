import { beforeEach, describe, expect, it } from 'vitest';
import { Deque } from './Deque.js';

describe('Deque', () => {
  let deque: Deque<number>;

  describe('Initialization and Empty State', () => {
    it('should initialize with default capacity', () => {
      deque = new Deque<number>();
      expect(deque.length).toBe(0);
      expect(deque.empty).toBe(true);
    });

    it('should throw error for non-positive initial capacity', () => {
      expect(() => new Deque<number>(0)).toThrow(RangeError);
      expect(() => new Deque<number>(-5)).toThrow(RangeError);
    });

    it('should correctly calculate initial capacity to the next power of two', () => {
      // This test indirectly covers the private _nextPowerOfTwo method
      const dequeOf7 = new Deque<number>(7);
      // @ts-expect-error - Accessing private property for testing
      expect(dequeOf7._capacity).toBe(8);

      const dequeOf17 = new Deque<number>(17);
      // @ts-expect-error - Accessing private property for testing
      expect(dequeOf17._capacity).toBe(32);

      const dequeOf16 = new Deque<number>(16);
      // @ts-expect-error - Accessing private property for testing
      expect(dequeOf16._capacity).toBe(16);
    });

    it('should return undefined for all removal/peek operations when empty', () => {
      deque = new Deque<number>();
      expect(deque.pop()).toBe(undefined);
      expect(deque.shift()).toBe(undefined);
      expect(deque.first).toBe(undefined);
      expect(deque.last).toBe(undefined);
    });
  });

  describe('Core Operations', () => {
    beforeEach(() => {
      deque = new Deque<number>();
    });

    it('should push elements and update length', () => {
      expect(deque.push(10)).toBe(1);
      expect(deque.push(20)).toBe(2);
      expect(deque.length).toBe(2);
      expect(deque.last).toBe(20);
    });

    it('should pop elements and update length', () => {
      deque.push(10);
      deque.push(20);
      expect(deque.pop()).toBe(20);
      expect(deque.length).toBe(1);
      expect(deque.last).toBe(10);
    });

    it('should unshift elements and update length', () => {
      expect(deque.unshift(10)).toBe(1);
      expect(deque.unshift(20)).toBe(2);
      expect(deque.length).toBe(2);
      expect(deque.first).toBe(20);
    });

    it('should shift elements and update length', () => {
      deque.push(10);
      deque.push(20);
      expect(deque.shift()).toBe(10);
      expect(deque.length).toBe(1);
      expect(deque.first).toBe(20);
    });

    it('should clear all elements', () => {
      deque.push(1);
      deque.push(2);
      deque.clear();
      expect(deque.length).toBe(0);
      expect(deque.empty).toBe(true);
    });

    it('should be iterable and yield elements in correct order', () => {
      deque.push(10);
      deque.push(20);
      deque.unshift(0); // Deque is [0, 10, 20]
      const result = [...deque];
      expect(result).toEqual([0, 10, 20]);
    });
  });

  describe('Resizing Logic', () => {
    // Use a small capacity to easily trigger resizing
    const initialCapacity = 4;

    beforeEach(() => {
      deque = new Deque<number>(initialCapacity);
    });

    it('should resize when pushing past capacity', () => {
      // Fill the deque
      for (let i = 1; i <= initialCapacity; i++) {
        deque.push(i);
      }
      expect(deque.length).toBe(initialCapacity);

      // This push triggers the resize
      deque.push(5);

      // Verify state after resize
      expect(deque.length).toBe(initialCapacity + 1);
      // @ts-expect-error - Accessing private property for testing
      expect(deque._capacity).toBe(initialCapacity * 2);
      expect(deque.shift()).toBe(1);
      expect(deque.pop()).toBe(5);
    });

    it('should resize when unshifting past capacity', () => {
      // Fill the deque
      for (let i = 1; i <= initialCapacity; i++) {
        deque.unshift(i);
      }
      expect(deque.length).toBe(initialCapacity);

      // This unshift triggers the resize
      deque.unshift(5);

      // Verify state after resize
      expect(deque.length).toBe(initialCapacity + 1);
      // @ts-expect-error - Accessing private property for testing
      expect(deque._capacity).toBe(initialCapacity * 2);
      expect(deque.pop()).toBe(1);
      expect(deque.shift()).toBe(5);
    });
  });

  describe('Shrinking Logic', () => {
    it('should shrink the buffer when pop() reduces length below the threshold', () => {
      // 1. Arrange: Create a deque and force it to grow
      // The default minimum capacity is 16. A push of 17 items will
      // resize the capacity to 32.
      const deque = new Deque<number>(16, true);
      for (let i = 0; i < 17; i++) {
        deque.push(i);
      }
      // @ts-expect-error - Accessing private property for testing
      expect(deque._capacity).toBe(32);

      // The shrink threshold is length < capacity / 4, so length < 8.
      // We will pop until length becomes 7.
      while (deque.length > 8) {
        deque.pop();
      }
      // @ts-expect-error
      expect(deque._capacity).toBe(32); // Should not have shrunk yet

      // 2. Act: Trigger the shrink
      deque.pop(); // Length is now 7, which is less than 8.

      // 3. Assert: Verify the deque has shrunk correctly
      expect(deque.length).toBe(7);
      // @ts-expect-error
      expect(deque._capacity).toBe(16); // Capacity should be halved

      // Verify the remaining data is intact
      expect(deque.last).toBe(6);
      expect(deque.first).toBe(0);
    });

    it('should shrink the buffer when shift() reduces length below the threshold', () => {
      // 1. Arrange: Create a deque and force it to grow to 32
      const deque = new Deque<number>(16, true);
      for (let i = 0; i < 17; i++) {
        deque.push(i);
      }
      // @ts-expect-error
      expect(deque._capacity).toBe(32);

      // The shrink threshold is length < 8. We will shift until length becomes 7.
      while (deque.length > 8) {
        deque.shift();
      }
      // @ts-expect-error
      expect(deque._capacity).toBe(32); // Should not have shrunk yet

      // 2. Act: Trigger the shrink
      deque.shift(); // Length is now 7

      // 3. Assert: Verify the deque has shrunk correctly
      expect(deque.length).toBe(7);
      // @ts-expect-error
      expect(deque._capacity).toBe(16);

      // Verify remaining data (items 9 through 16)
      expect(deque.first).toBe(10); // 17 total items (0-16), shifted off 10 items (0-9)
      expect(deque.last).toBe(16);
    });

    it('should NOT shrink if the autoShrink flag is false', () => {
      // 1. Arrange: Create a deque with autoShrink disabled and grow it to 32
      const deque = new Deque<number>(16, false); // autoShrink is false
      for (let i = 0; i < 17; i++) {
        deque.push(i);
      }
      // @ts-expect-error
      expect(deque._capacity).toBe(32);

      // 2. Act: Pop elements past the shrink threshold
      while (deque.length > 7) {
        deque.pop();
      }

      // 3. Assert: Verify the capacity has NOT changed
      expect(deque.length).toBe(7);
      // @ts-expect-error
      expect(deque._capacity).toBe(32); // Should remain 32
    });

    it('should NOT shrink below the minimum capacity', () => {
      // The MINIMUM_CAPACITY is 16.
      // The shrink threshold is length < 16 / 4, so length < 4.
      const deque = new Deque<number>(16, true);
      for (let i = 0; i < 4; i++) {
        deque.push(i);
      }
      expect(deque.length).toBe(4);
      // @ts-expect-error
      expect(deque._capacity).toBe(16);

      // Act: Pop to cross the threshold (length becomes 3)
      deque.pop();

      // Assert: Verify capacity has not changed
      expect(deque.length).toBe(3);
      // @ts-expect-error
      expect(deque._capacity).toBe(16); // Should not shrink below minimum
    });
  });
});
