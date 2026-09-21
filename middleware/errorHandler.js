import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

export function notFound(_req, _res, next) {
  next(new AppError('Route not found', 404));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (env.nodeEnv !== 'production') {
    console.error(err);
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: message, details: err.errors });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate value already exists' });
  }

  res.status(status).json({
    error: status === 500 && env.nodeEnv === 'production' ? 'Something went wrong' : message,
  });
}
