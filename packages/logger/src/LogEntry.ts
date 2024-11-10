import type { LogLabels } from './LogLabels';
import type { LogLevel } from './LogLevel';
import type { LogPayload } from './LogPayload';
import type { LogTimestamp } from './LogTimestamp';

export interface LogEntry {
  /**
   * The severity level of the log entry.
   */
  severity: LogLevel;
  /**
   * The timestamp of the log entry.
   */
  timestamp: LogTimestamp;
  /**
   * The log message.
   */
  message: string;
  /**
   * The context of the log entry.
   */
  context?: string;
  /**
   * A map of key-value pairs that provides additional context to a log entry.
   */
  labels?: LogLabels;
  /**
   * A map of key-value pairs that provides additional data to be logged.
   */
  payload?: LogPayload;
}
