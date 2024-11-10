import { describe, expect, it, vi } from 'vitest';
import { Logger } from './Logger';
import { LogLevel } from './LogLevel';

const writer = vi.hoisted(() => ({
  write: vi.fn(),
}));

vi.mock('./LogWriter', () => ({
  LogWriter: vi.fn(() => writer),
}));

const timestamp = vi.hoisted(() => ({}));

vi.mock('./LogTimestamp', () => ({
  LogTimestamp: vi.fn(() => timestamp),
}));

Logger.logLevel = LogLevel.DEFAULT;

describe(Logger.name, () => {
  it.each(['default', 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'] as const)(
    'logs %s',
    (level) => {
      expect(Logger[level]('test')).toBeUndefined();
      expect(writer.write).toHaveBeenCalledWith({
        timestamp,
        severity: LogLevel[level.toUpperCase() as keyof typeof LogLevel],
        message: 'test',
        context: undefined,
        labels: undefined,
        payload: undefined,
      });
    },
  );

  it('logs with context', () => {
    const logger = new Logger('test');
    logger.info('test');
    expect(writer.write).toHaveBeenCalledWith({
      timestamp,
      severity: LogLevel.INFO,
      message: 'test',
      context: 'test',
    });
  });

  it('merges labels', () => {
    Logger.labels = { a: 'b' };
    const logger = new Logger(undefined, { c: 'd' });
    logger.info('test');
    expect(writer.write).toHaveBeenCalledWith({
      timestamp,
      severity: LogLevel.INFO,
      message: 'test',
      context: undefined,
      labels: { a: 'b', c: 'd' },
      payload: undefined,
    });
  });

  it('implements toStringTag', () => {
    expect(String(new Logger())).toBe('[object Logger]');
  });
});
