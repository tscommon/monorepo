import type { LogLabels } from './LogLabels.js';
import type { LogLevel } from './LogLevel.js';
import type { LogPayload } from './LogPayload.js';
import type { LogTimestamp } from './LogTimestamp.js';

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
