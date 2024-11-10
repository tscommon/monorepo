/**
 * Represents a timestamp for a log entry.
 * The timestamp is a Unix epoch time with nanosecond precision.
 * The timestamp is generated when the `LogTimestamp` object is created.
 * The timestamp is immutable.
 * The timestamp is represented as a string in the format `YYYY-MM-DDTHH:MM:SS.NNNNNNNNNZ`.
 */
export class LogTimestamp {
  /**
   * A unique identifier for the log entry within the same millisecond.
   */
  private static insertId = 0;

  /**
   * The timestamp of the last log entry.
   */
  private static lastTimestamp = 0;

  /**
   * The number of seconds since the Unix epoch.
   */
  public readonly seconds: number;

  /**
   * The number of nanoseconds since the Unix epoch.
   */
  public readonly nanos: number;

  /**
   * Creates a new timestamp for a log entry.
   */
  public constructor() {
    const now = Date.now();
    if (now === LogTimestamp.lastTimestamp) {
      LogTimestamp.insertId = ++LogTimestamp.insertId % 1_000_000;
    } else {
      LogTimestamp.lastTimestamp = now;
      LogTimestamp.insertId = 0;
    }
    this.seconds = Math.trunc(now / 1000);
    this.nanos = (now % 1000) * 1_000_000 + LogTimestamp.insertId;
    Object.freeze(this);
  }

  /**
   * Returns a string representation of the timestamp in RFC3339 UTC "Zulu" format.
   *
   * **Example:**
   *
   * ```typescript
   * const timestamp = new LogTimestamp();
   * console.log(timestamp.toString());
   * // Output: 2021-07-29T23:27:47.000000000Z
   * ```
   */
  public toString(): string {
    const yearSinceEpoch = Math.trunc(this.seconds / 31536000) + 1970;
    const monthSinceEpoch = Math.trunc((this.seconds % 31536000) / 2628000) + 1;
    const daySinceEpoch = Math.trunc((this.seconds % 2628000) / 86400) + 1;
    const hourSinceEpoch = Math.trunc((this.seconds % 86400) / 3600);
    const minuteSinceEpoch = Math.trunc((this.seconds % 3600) / 60);
    const secondSinceEpoch = this.seconds % 60;
    const year = yearSinceEpoch.toString().padStart(4, '0');
    const month = monthSinceEpoch.toString().padStart(2, '0');
    const day = daySinceEpoch.toString().padStart(2, '0');
    const hour = hourSinceEpoch.toString().padStart(2, '0');
    const minute = minuteSinceEpoch.toString().padStart(2, '0');
    const second = secondSinceEpoch.toString().padStart(2, '0');
    const nanos = this.nanos.toString().padStart(9, '0');
    return `${year}-${month}-${day}T${hour}:${minute}:${second}.${nanos}Z`;
  }

  /**
   * Returns a JSON representation of the timestamp.
   */
  public toJSON(): {
    seconds: number;
    nanos: number;
  } {
    return {
      seconds: this.seconds,
      nanos: this.nanos,
    };
  }
}
