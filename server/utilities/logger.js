const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger instance with the defined format and transports
const logger = createLogger({
  level: 'info', // Set default log level
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: './logs/combined.log' }) // Log to file
  ],
});

// Add error transport to log only errors to a separate file
logger.add(new transports.File({ filename: './logs/errors.log', level: 'error' }));

module.exports = logger;
