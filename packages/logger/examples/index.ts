import { Logger, LogLevel } from '../src/index.js';

const logger = new Logger('MyApp', {
  version: 'v1.0.0',
});

Logger.logLevel = LogLevel.DEBUG;

logger.info('Hello, world!');
logger.error('Something went wrong', { error: new Error('An error occurred') });
logger.debug('This message will be logged');
