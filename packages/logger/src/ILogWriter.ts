import type { LogEntry } from './LogEntry';

export interface ILogWriter {
  /**
   * Writes a log entry to the destination. This method is called by the logger.
   * It can be overridden in derived classes to customize the log destination.
   * @param entry The log entry to write.
   */
  write(entry: LogEntry): void;
}
