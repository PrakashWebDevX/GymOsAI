import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/index.js';

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.isOperational ? err.message : ERROR_MESSAGES.INTERNAL_ERROR;

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    console.error('Error:', err.message || err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (_req, _res, next) => {
  next(new AppError('Route not found', HTTP_STATUS.NOT_FOUND));
};
