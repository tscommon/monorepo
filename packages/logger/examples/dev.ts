import { inspect } from 'node:util';
import { Logger, LogLevel, LogWriter, type LogEntry, type LogLabels, type LogPayload, type LogTimestamp } from '../src';

if (process.env.NODE_ENV === 'development') {
  class DevLogWriter extends LogWriter {
    // Override the serialize method to customize the log format.
    // highlight-next-line
    protected override serialize(entry: LogEntry): string {
      let str: string = '';
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

    private printLabels(labels: LogLabels): string | undefined {
      return Object.entries(labels)
        .filter(([, value]) => typeof value === 'string')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }

    private printSeverity(severity: LogLevel): string {
      return LogLevel[severity].toUpperCase();
    }

    private printPayload(payload: LogPayload): string | undefined {
      return inspect(payload, { depth: 3, colors: true });
    }
  }

  // Sets custom log writer.
  // highlight-next-line
  Logger.writer = new DevLogWriter();
}

const logger = new Logger('app');

logger.info('Server started.', { port: 3000 });
logger.error('Something went wrong.', { error: new Error('An error occurred.') });

// Output
// 01/01/2024, 09:00:00 [INFO] (app) Server started. { port: 3000 }
// 01/01/2024, 09:00:00 [ERROR] (app) Something went wrong. {
//   error: Error: An error occurred.
//       ...
// }
