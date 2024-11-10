import { describe, expect, it, vi } from 'vitest';
import { LogLevel } from './LogLevel';
import { LogTimestamp } from './LogTimestamp';
import { LogWriter } from './LogWriter';

vi.setSystemTime(0);

const writer = new LogWriter(3);

interface Test {
  actual: unknown;
  expected: unknown;
}

const tests: Test[] = [
  {
    actual: BigInt(123),
    expected: '123',
  },
  {
    actual: Symbol('symbol'),
    expected: 'Symbol(symbol)',
  },
  {
    actual: Function,
    expected: 'function Function() { [native code] }',
  },
  {
    actual: Infinity,
    expected: 'Infinity',
  },
  {
    actual: NaN,
    expected: 'NaN',
  },
  {
    actual: new Date('2023-01-01T00:00:00.000Z'),
    expected: '2023-01-01T00:00:00.000Z',
  },
  {
    actual: /test/,
    expected: '/test/',
  },
  {
    actual: new Map([['key', 'value']]),
    expected: { key: 'value' },
  },
  {
    actual: new Set([1, 2, 3]),
    expected: [1, 2, 3],
  },
  {
    actual: new Error('test'),
    expected: {
      message: 'test',
      stack: expect.stringContaining('Error: test'),
    },
  },
  {
    actual: null,
    expected: null,
  },
  {
    actual: new AggregateError([new Error('test')], 'errors'),
    expected: {
      message: 'errors',
      stack: expect.stringContaining('AggregateError:'),
      errors: [
        {
          message: 'test',
          stack: expect.stringContaining('Error: test'),
        },
      ],
    },
  },
  {
    actual: {
      get self(): object {
        return this;
      },
    },
    expected: {
      self: {
        self: {
          self: '[[Truncated]]',
        },
      },
    },
  },
];

describe(LogWriter.name, () => {
  describe('write', () => {
    it('writes log entry', () => {
      const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      writer.write({
        severity: LogLevel.INFO,
        message: 'Hello, world!',
        timestamp: new LogTimestamp(),
      });
      expect(consoleLog).toHaveBeenCalledWith(
        '{"severity":"INFO","timestamp":{"seconds":0,"nanos":1},"message":"Hello, world!"}',
      );
      writer.write({
        severity: LogLevel.ERROR,
        message: 'Hello, world!',
        timestamp: new LogTimestamp(),
      });
      expect(consoleError).toHaveBeenCalledWith(
        '{"severity":"ERROR","timestamp":{"seconds":0,"nanos":2},"message":"Hello, world!"}',
      );
    });
  });

  describe('collect', () => {
    it.each(tests)('collects $actual as $expected', ({ actual, expected }) => {
      expect(writer['collect'](actual, 0, [])).toEqual(expected);
    });
  });

  it('implements toStringTag', () => {
    expect(String(writer)).toBe('[object LogWriter]');
  });
});
