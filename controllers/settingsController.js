import { AppError, catchAsync, send } from '../utils/AppError.js';
import { getSettings, updateSettings } from '../services/settingsService.js';
import { sendMail } from '../services/mailService.js';

export const get = catchAsync(async (_req, res) => {
  const s = await getSettings();
  return send(res, s.toJSON());
});

export const update = catchAsync(async (req, res) => {
  const s = await updateSettings(req.body || {});
  return send(res, s.toJSON());
});

export const testMail = catchAsync(async (req, res) => {
  const settings = await getSettings();
  const to = req.body?.to || req.user.email;
  const result = await sendMail({
    to,
    subject: `${settings.company || 'THAR SOLAR'} — SMTP test`,
    html: `<p>SMTP is working for <b>${settings.company || 'THAR SOLAR'}</b>.</p><p>You can enable OTP login and auto inquiry emails.</p>`,
  });
  if (result.skipped) {
    throw new AppError('Save SMTP host, user and password first.', 400);
  }
  return send(res, { ok: true });
});
