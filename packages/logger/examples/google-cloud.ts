import { Logger, LogWriter, type LogEntry } from '../src';

class GoogleCloudLogWriter extends LogWriter {
  private captureStackTrace(entry: LogEntry): string | undefined {
    return entry.payload?.['error'] instanceof Error ? entry.payload['error'].stack : undefined;
  }

  protected override serialize(entry: LogEntry): string {
    const log = this.transform(entry);
    // Include `stack_trace` in the log entry.
    // highlight-next-line
    log['stack_trace'] = this.captureStackTrace(entry);
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
