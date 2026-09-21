export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}

export function catchAsync(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function send(res, data, status = 200) {
  return res.status(status).json(data);
}
