import type { ILogger } from './ILogger';
import type { ILogWriter } from './ILogWriter';
import type { LogLabels } from './LogLabels';
import { LogLevel } from './LogLevel';
import type { LogPayload } from './LogPayload';
import { LogTimestamp } from './LogTimestamp';
import { LogWriter } from './LogWriter';

export class Logger implements ILogger {
  /**
   * The default context for loggers.
   */
  public static context?: string;

  /**
   * The default labels for loggers.
   */
  public static labels?: LogLabels;

  /**
   * The minimum severity level to log.
   */
  public static logLevel: LogLevel = LogLevel.INFO;

  /**
   * The writer to use for logging.
   */
  public static writer: ILogWriter = new LogWriter(5);

  /**
   * The default logger instance.
   */
  public static instance: ILogger = new Logger();

  /**
   * The log entry has no assigned severity level.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.default('The server is running.');
   * Logger.default('The server is running.', { port: 3000 });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static default(message: string, payload?: LogPayload): void {
    this.instance.default(message, payload);
  }

  /**
   * Debug or trace information.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.debug('The server is running.');
   * Logger.debug('The server is running.', { port: 3000 });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static debug(message: string, payload?: LogPayload): void {
    this.instance.debug(message, payload);
  }

  /**
   * Routine information, such as ongoing status or performance.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.info('The server is running.');
   * Logger.info('The server is running.', { port: 3000 });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static info(message: string, payload?: LogPayload): void {
    this.instance.info(message, payload);
  }

  /**
   * Normal but significant events, such as start up, shut down, or a configuration change.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.notice('The server is running.');
   * Logger.notice('The server is running.', { port: 3000 });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static notice(message: string, payload?: LogPayload): void {
    this.instance.notice(message, payload);
  }

  /**
   * Warning events might cause problems.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.warning('Unauthorized access.', { status: 401 });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static warning(message: string, payload?: LogPayload): void {
    this.instance.warning(message, payload);
  }

  /**
   * Error events are likely to cause problems.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.error('An error occurred.', { status: 500, error: new Error('Something went wrong.') });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static error(message: string, payload?: LogPayload): void {
    this.instance.error(message, payload);
  }

  /**
   * Critical events cause more severe problems or outages.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.critical('An error occurred.', { status: 500, error: new Error('Something went wrong.') });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static critical(message: string, payload?: LogPayload): void {
    this.instance.critical(message, payload);
  }

  /**
   * A person must take an action immediately.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.alert('An error occurred.', { status: 500, error: new Error('Something went wrong.') });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static alert(message: string, payload?: LogPayload): void {
    this.instance.alert(message, payload);
  }

  /**
   * One or more systems are unusable.
   *
   * **Example:**
   *
   * ```typescript
   * Logger.emergency('An error occurred.', { status: 500, error: new Error('Something went wrong.') });
   * ```
   *
   * @param message The log message.
   * @param payload A map of key-value pairs that provides additional data to be logged.
   */
  public static emergency(message: string, payload?: LogPayload): void {
    this.instance.emergency(message, payload);
  }

  /**
   * The context for this logger instance.
   */
  public context?: string;

  /**
   * The labels for this logger instance.
   */
  public labels?: LogLabels;

  /**
   * The minimum severity level to log for this logger instance.
   */
  public logLevel?: LogLevel;

  /**
   * A string tag that identifies this object as a logger.
   */
  public get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }

  public constructor(context?: string, labels?: LogLabels) {
    this.context = context;
    this.labels = labels;
    if (new.target === Logger) {
      Object.freeze(this);
    }
  }

  /**
   * Writes a log entry.
   */
  protected write(severity: LogLevel, message: string, payload?: LogPayload): void {
    if (severity >= (this.logLevel ?? Logger.logLevel)) {
      Logger.writer.write({
        timestamp: new LogTimestamp(),
        severity,
        message,
        context: this.context ?? Logger.context,
        labels: (this.labels ?? Logger.labels) ? { ...Logger.labels, ...this.labels } : undefined,
        payload,
      });
    }
  }

  public default(message: string, payload?: LogPayload): void {
    this.write(LogLevel.DEFAULT, message, payload);
  }

  public debug(message: string, payload?: LogPayload): void {
    this.write(LogLevel.DEBUG, message, payload);
  }

  public info(message: string, payload?: LogPayload): void {
    this.write(LogLevel.INFO, message, payload);
  }

  public notice(message: string, payload?: LogPayload): void {
    this.write(LogLevel.NOTICE, message, payload);
  }

  public warning(message: string, payload?: LogPayload): void {
    this.write(LogLevel.WARNING, message, payload);
  }

  public error(message: string, payload?: LogPayload): void {
    this.write(LogLevel.ERROR, message, payload);
  }

  public critical(message: string, payload?: LogPayload): void {
    this.write(LogLevel.CRITICAL, message, payload);
  }

  public alert(message: string, payload?: LogPayload): void {
    this.write(LogLevel.ALERT, message, payload);
  }

  public emergency(message: string, payload?: LogPayload): void {
    this.write(LogLevel.EMERGENCY, message, payload);
  }
}
