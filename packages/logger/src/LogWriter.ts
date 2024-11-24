import type { ILogWriter } from './ILogWriter';
import type { LogEntry } from './LogEntry';
import { LogLevel } from './LogLevel';

export class LogWriter implements ILogWriter {
  /**
   * Initializes a new instance.
   * @param maxDepth The maximum depth of the data to collect. Default is `3`.
   */
  public constructor(protected readonly maxDepth = 3) {
    if (new.target === LogWriter) {
      Object.freeze(this);
    }
  }

  /**
   * A string tag that identifies this object as a log writer.
   */
  public get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }

  /**
   * Writes a log entry to the console. This method is called by the logger.
   * It can be overridden in derived classes to customize the log destination.
   * The default implementation writes the log entry to the console.
   * @param entry The log entry to write.
   */
  public write(entry: LogEntry): void {
    const channel = entry.severity < LogLevel.ERROR ? 'log' : 'error';
    console[channel](this.serialize(entry));
  }

  /**
   * Serializes a log entry to a string.
   * This method is called by the {@link LogWriter.write} method.
   * It can be overridden in derived classes to customize the serialization.
   * The default implementation returns a JSON string.
   * You can override this method to format the log entry differently.
   *
   * **Example:**
   *
   * ```typescript
   * class MyLogWriter extends LogWriter {
   *   protected override serialize(entry: LogEntry): string {
   *     const log = this.transform(entry);
   *     return `${log.timestamp} [${log.severity}] ${log.message}`;
   *   }
   * }
   * ```
   * @param entry The log entry to serialize.
   */
  protected serialize(entry: LogEntry): string {
    return JSON.stringify(this.transform(entry));
  }

  /**
   * Transforms a log entry into a plain object.
   * This method is called by the {@link serialize} method.
   * It can be overridden in derived classes to customize the transformation.
   * The default implementation returns a plain object with the log entry properties.
   */
  protected transform(entry: LogEntry): Record<string, unknown> {
    return {
      severity: LogLevel[entry.severity].toUpperCase(),
      timestamp: entry.timestamp,
      context: entry.context,
      message: entry.message,
      payload: this.collect(entry.payload, 0, []),
      labels: entry.labels,
    } as const;
  }

  /**
   * Collects data recursively and truncates it if it exceeds the maximum depth.
   * This method is called by the {@link transform} method.
   * It can be overridden in derived classes to customize the data collection.
   * The default implementation returns a JSON-serializable object.
   * @param data The data to collect.
   * @param depth The current depth of the recursion.
   * @param path The path to the current data.
   */
  protected collect(data: unknown, depth: number, path: (number | string)[]): unknown {
    switch (typeof data) {
      case 'bigint':
        return data.toString();
      case 'symbol':
        return data.toString();
      case 'function':
        return data.toString();
      case 'number':
        if (Number.isFinite(data)) {
          return data;
        }
        return data.toString();
      case 'object':
        if (data === null) {
          return null;
        }
        if (depth >= this.maxDepth) {
          return '[[Truncated]]';
        }
        switch (data.constructor) {
          case Date:
            return (data as Date).toISOString();
          case RegExp:
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            return data.toString();
          case Array: {
            const array = new Array<unknown>((data as unknown[]).length);
            for (let i = 0; i < array.length; ++i) {
              const element = (data as unknown[])[i];
              array[i] = this.collect(element, depth + 1, [...path, i]);
            }
            return array;
          }
          case Set: {
            let index = 0;
            const array = new Array<unknown>((data as Set<unknown>).size);
            (data as Set<unknown>).forEach((value) => {
              array[index++] = this.collect(value, depth + 1, [...path, index]);
            });
            return array;
          }
          case Map: {
            const map = Object.create(null) as Record<string, unknown>;
            (data as Map<unknown, unknown>).forEach((value, key) => {
              map[String(key)] = this.collect(value, depth + 1, [...path, String(key)]);
            });
            return map;
          }
          default: {
            const map = Object.create(null) as Record<string, unknown>;
            Object.getOwnPropertyNames(data).forEach((key) => {
              const value = (data as Record<string, unknown>)[key];
              map[key] = this.collect(value, depth + 1, [...path, key]);
            });
            return map;
          }
        }
      default:
        return data;
    }
  }
}
