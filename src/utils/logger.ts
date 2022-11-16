import { createLogger, format, transports } from 'winston';

const { printf } = format;

// Checks if log is an error - has stack info
const logFormat = printf((info) => (info.stack ? `${info.level}: ${info.stack as string}` : `${info.level}: ${info.message as string}`));

const loggerConfig = {
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
};

const logger = createLogger();
logger.add(new transports.Console(loggerConfig));

export default logger;
