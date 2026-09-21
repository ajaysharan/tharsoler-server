import { catchAsync, send } from '../utils/AppError.js';
import * as notificationService from '../services/notificationService.js';

export const list = catchAsync(async (req, res) => {
  const result = await notificationService.listForUser(req.user.id);
  return send(res, result);
});

export const markRead = catchAsync(async (req, res) => {
  await notificationService.markAllRead(req.user.id);
  return send(res, { ok: true });
});
