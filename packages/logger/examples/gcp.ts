import { Logger, LogWriter, type LogEntry } from '../src/index.js';

export class GoogleCloudLogWriter extends LogWriter {
  static {
    // Set Google Cloud formatter globally
    Logger.writer = new GoogleCloudLogWriter();
  }

  private logs: LogEntry[] = [];

  public override write(entry: LogEntry): void {
    if (this.logs.push(entry) === 1) {
      setImmediate(() => {
        this.logs.forEach((log) => super.write(log));
        this.logs = [];
      });
    }
  }

  protected override serialize(entry: LogEntry): string {
    const log = this.transform(entry);
    if (entry.payload instanceof Error) log.stack_trace = entry.payload.stack;
    return JSON.stringify(log);
  }
}
