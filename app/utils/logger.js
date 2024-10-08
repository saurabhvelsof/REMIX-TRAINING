import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf, errors, json } = format;

// Custom log format for development
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Determine if we are in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Create a logger instance with different configurations for production and development
const logger = createLogger({
  level: isProduction ? 'warn' : 'debug',  // Set higher logging level for production (e.g., warn), and more verbose for development (e.g., debug)
  format: combine(
    timestamp(),  // Add timestamp to each log
    errors({ stack: true }),  // Capture stack trace for errors
    isProduction ? json() : devFormat  // Use JSON format in production, and pretty print in development
  ),
  transports: [
    new transports.Console({
      format: isProduction ? combine(timestamp(), json()) : combine(timestamp(), devFormat),
    }),  // Log to the console
    new transports.File({ filename: 'logs/error.log', level: 'error' }),  // Only log errors to error.log
    new transports.File({ filename: 'logs/combined.log' })  // Log everything to combined.log
  ]
});

export default logger;
