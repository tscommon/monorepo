import { Logger, LogLevel } from '../src';

const logger = new Logger();

// Sets the log level to INFO.
// highlight-next-line
Logger.logLevel = LogLevel.INFO;

logger.info('Hello, world!');
logger.error('Something went wrong.', { error: new Error('An error occurred.') });
logger.debug('This message will not be logged.');

// Output:
// {
//   "severity": "INFO",
//   "timestamp": {
//     "seconds": 1731238664,
//     "nanos": 513000000
//   },
//   "message": "Hello, world!"
// }
// {
//   "severity": "ERROR",
//   "timestamp": {
//     "seconds": 1731238664,
//     "nanos": 513000000
//   },
//   "message": "Something went wrong.",
//   "payload": {
//     "error": {
//       "stack": "Error: An error occurred. [[Stack]]",
//       "message": "An error occurred."
//     }
//   }
// }
