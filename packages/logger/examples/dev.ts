import {
  Logger,
  LogLevel,
  LogWriter,
  type LogEntry,
  type LogLabels,
  type LogPayload,
  type LogTimestamp,
} from '../src/index.js';

import { inspect } from 'node:util';

export class DevLogWriter extends LogWriter {
  static {
    // Set your formatter globally
    Logger.writer = new DevLogWriter();
  }

  protected override serialize(entry: LogEntry): string {
    let parts: string[] = [];
    parts.push(this._printTimestamp(entry.timestamp));
    parts.push(`[${this._printSeverity(entry.severity)}]`);
    if (entry.context) parts.push(`(${entry.context})`);
    if (entry.labels) parts.push(this._printLabels(entry.labels));
    parts.push(entry.message);
    if (entry.payload) parts.push(this._printPayload(entry.payload));
    return parts.join(' ');
  }

  protected _printTimestamp(timestamp: LogTimestamp): string {
    return new Date(timestamp.seconds * 1000 + timestamp.nanos / 1_000_000).toLocaleString();
  }

  protected _printLabels(labels: LogLabels): string {
    return Object.entries(labels)
      .map(([key, value]) => (value ? `${key}: ${value}` : undefined))
      .filter(Boolean)
      .join(', ');
  }

  protected _printSeverity(severity: LogLevel): string {
    return LogLevel[severity].toUpperCase();
  }

  private _printPayload(payload: LogPayload): string {
    return inspect(payload, {
      depth: 5,
      colors: true,
      compact: true,
      breakLength: Infinity,
    });
  }
}
