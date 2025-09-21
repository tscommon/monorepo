import { bench, describe } from 'vitest';
import { Deque } from './Deque.js';

// A large number of operations to get meaningful benchmark data
const NUM_OPERATIONS = 100_000;

describe('Deque vs. Array Performance', () => {
  // ==========================================================
  // Suite 1: Adding elements to the back
  // ==========================================================
  describe('push: Add to Back', () => {
    bench('Array#push', () => {
      const arr: number[] = [];
      for (let i = 0; i < NUM_OPERATIONS; i++) {
        arr.push(i);
      }
    });

    bench('Deque#push', () => {
      const deque = new Deque<number>();
      for (let i = 0; i < NUM_OPERATIONS; i++) {
        deque.push(i);
      }
    });
  });

  // ==========================================================
  // Suite 2: Adding elements to the front
  // ==========================================================
  describe('unshift: Add to Front', () => {
    bench('Array#unshift', () => {
      const arr: number[] = [];
      for (let i = 0; i < NUM_OPERATIONS; i++) {
        arr.unshift(i);
      }
    });

    bench('Deque#unshift', () => {
      const deque = new Deque<number>();
      for (let i = 0; i < NUM_OPERATIONS; i++) {
        deque.unshift(i);
      }
    });
  });

  // ==========================================================
  // Suite 3: Removing elements from the front
  // ==========================================================
  describe('shift: Remove from Front', () => {
    bench('Array#shift', () => {
      // Setup within the benchmark to be fair
      const arr: number[] = [];
      for (let i = 0; i < NUM_OPERATIONS; i++) arr.push(i);

      for (let i = 0; i < NUM_OPERATIONS; i++) {
        arr.shift();
      }
    });

    bench('Deque#shift', () => {
      // Setup within the benchmark to be fair
      const deque = new Deque<number>();
      for (let i = 0; i < NUM_OPERATIONS; i++) deque.push(i);

      for (let i = 0; i < NUM_OPERATIONS; i++) {
        deque.shift();
      }
    });
  });

  // ==========================================================
  // Suite 4: Removing elements from the back
  // ==========================================================
  describe('pop: Remove from Back', () => {
    bench('Array#pop', () => {
      const arr: number[] = [];
      for (let i = 0; i < NUM_OPERATIONS; i++) arr.push(i);

      for (let i = 0; i < NUM_OPERATIONS; i++) {
        arr.pop();
      }
    });

    bench('Deque#pop', () => {
      const deque = new Deque<number>();
      for (let i = 0; i < NUM_OPERATIONS; i++) deque.push(i);

      for (let i = 0; i < NUM_OPERATIONS; i++) {
        deque.pop();
      }
    });
  });
});
