import { inspect } from 'util';
import { Logger, LogLevel, LogWriter, type LogEntry, type LogLabels, type LogPayload, type LogTimestamp } from '../src';

class DevLogWriter extends LogWriter {
  protected override serialize(entry: LogEntry): string {
    let str = '';
    str += this.printTimestamp(entry.timestamp);
    str += ` [${this.printSeverity(entry.severity)}]`;
    if (entry.context) str += ` (${entry.context})`;
    if (entry.labels) str += ` ${this.printLabels(entry.labels)}`;
    str += ` ${entry.message}`;
    if (entry.payload) str += ` ${this.printPayload(entry.payload)}`;
    return str;
  }

  private printTimestamp(timestamp: LogTimestamp): string {
    return new Date(timestamp.seconds * 1000 + timestamp.nanos / 1_000_000).toLocaleString();
  }

  private printLabels(labels: LogLabels): string {
    return Object.entries(labels)
      .map(([key, value]) => (value ? `${key}: ${value}` : undefined))
      .filter(Boolean)
      .join(', ');
  }

  private printSeverity(severity: LogLevel): string {
    return LogLevel[severity].toUpperCase();
  }

  private printPayload(payload: LogPayload): string {
    return inspect(payload, {
      depth: 5,
      colors: true,
      compact: true,
      breakLength: Infinity,
    });
  }
}

Logger.writer = new DevLogWriter();
