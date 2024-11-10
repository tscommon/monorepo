import { describe, expect, it, vi } from 'vitest';
import { LogTimestamp } from './LogTimestamp';

describe(LogTimestamp.name, () => {
  it('returns current timestamp with insert id', () => {
    vi.setSystemTime(new Date('1970-01-01T00:00:00.123Z'));
    expect(new LogTimestamp()).toEqual({ seconds: 0, nanos: 123_000_000 });
    expect(new LogTimestamp()).toEqual({ seconds: 0, nanos: 123_000_001 });
  });

  it('returns current timestamp without insert id', () => {
    vi.setSystemTime(new Date('1970-01-01T00:00:00.124Z'));
    expect(new LogTimestamp()).toEqual({ seconds: 0, nanos: 124_000_000 });
    vi.setSystemTime(new Date('1970-01-01T00:00:00.125Z'));
    expect(new LogTimestamp()).toEqual({ seconds: 0, nanos: 125_000_000 });
  });

  it('returns timestamp in RFC3339 UTC format', () => {
    vi.setSystemTime(new Date('1970-01-01T00:00:00.126Z'));
    expect(new LogTimestamp().toString()).toBe('1970-01-01T00:00:00.126000000Z');
  });

  it('returns JSON string', () => {
    vi.setSystemTime(new Date('1970-01-01T00:00:00.127Z'));
    expect(JSON.stringify(new LogTimestamp())).toBe('{"seconds":0,"nanos":127000000}');
  });
});
