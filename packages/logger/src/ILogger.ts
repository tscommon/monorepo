import type { LogPayload } from './LogPayload';

export interface ILogger {
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
  default(message: string, payload?: LogPayload): void;

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
  debug(message: string, payload?: LogPayload): void;

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
  info(message: string, payload?: LogPayload): void;

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
  notice(message: string, payload?: LogPayload): void;

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
  warning(message: string, payload?: LogPayload): void;

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
  error(message: string, payload?: LogPayload): void;

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
  critical(message: string, payload?: LogPayload): void;

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
  alert(message: string, payload?: LogPayload): void;

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
  emergency(message: string, payload?: LogPayload): void;
}
