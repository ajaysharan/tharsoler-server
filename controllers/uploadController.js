import { AppError, catchAsync, send } from '../utils/AppError.js';

export const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError('No file', 400);
  return send(res, { url: `/uploads/${req.file.filename}` }, 201);
});
