import { bench, describe } from 'vitest';
import { Deque } from './Deque.js';

const ops = 10_000;

describe('Deque vs Array', () => {
  describe('push', () => {
    bench('Array#push', () => {
      const arr: number[] = [];
      for (let i = 0; i < ops; i++) {
        arr.push(i);
      }
    });

    bench('Deque#push', () => {
      const deque = new Deque<number>();
      for (let i = 0; i < ops; i++) {
        deque.push(i);
      }
    });
  });

  describe('unshift', () => {
    bench('Array#unshift', () => {
      const arr: number[] = [];
      for (let i = 0; i < ops; i++) {
        arr.unshift(i);
      }
    });

    bench('Deque#unshift', () => {
      const deque = new Deque<number>();
      for (let i = 0; i < ops; i++) {
        deque.unshift(i);
      }
    });
  });

  describe('shift', () => {
    const arr: number[] = [];
    const deque = new Deque<number>();

    for (let i = 0; i < ops; i++) {
      arr.push(i);
      deque.push(i);
    }

    bench('Array#shift', () => {
      for (let i = 0; i < ops; i++) {
        arr.shift();
      }
    });

    bench('Deque#shift', () => {
      for (let i = 0; i < ops; i++) {
        deque.shift();
      }
    });
  });

  describe('pop', () => {
    const arr: number[] = [];
    const deque = new Deque<number>();

    for (let i = 0; i < ops; i++) {
      arr.push(i);
      deque.push(i);
    }

    bench('Array#pop', () => {
      for (let i = 0; i < ops; i++) {
        arr.pop();
      }
    });

    bench('Deque#pop', () => {
      for (let i = 0; i < ops; i++) {
        deque.pop();
      }
    });
  });
});
