import { Logger, LogWriter, type LogEntry } from '../src';

export class GoogleCloudLogWriter extends LogWriter {
  #logs: LogEntry[] = [];
  #isScheduled = false;

  public override write(entry: LogEntry): void {
    this.#logs.push(entry);
    if (!this.#isScheduled) {
      // Buffer logs and write them at the end of the event loop.
      // highlight-next-line
      setImmediate(() => {
        this.#logs.forEach((log) => super.write(log));
        this.#isScheduled = false;
        this.#logs = [];
      });
      this.#isScheduled = true;
    }
  }

  protected override serialize(entry: LogEntry): string {
    const log = this.transform(entry);
    // Enables error reporting in Google Cloud Logging.
    // highlight-next-line
    log.stack_trace = entry.payload?.error instanceof Error ? entry.payload.error.stack : undefined;
    return JSON.stringify(log);
  }
}

// Sets logging writer to the custom one.
// highlight-next-line
Logger.writer = new GoogleCloudLogWriter();

const logger = new Logger();

logger.info('Hello, world!');
logger.error('Something went wrong.', { error: new Error('An error occurred.') });

// Output:
// {
//   "severity": "INFO",
//   "timestamp": {
//     "seconds": 1731239034,
//     "nanos": 992000000
//   },
//   "message": "Hello, world!"
// }
// {
//   "severity": "ERROR",
//   "timestamp": {
//     "seconds": 1731239034,
//     "nanos": 992000001
//   },
//   "message": "Something went wrong.",
//   "payload": {
//     "error": {
//       "stack": "Error: An error occurred. [[stack]]",
//       "message": "An error occurred."
//     }
//   },
//   "stack_trace": "Error: An error occurred. [[stack]]"
// }
