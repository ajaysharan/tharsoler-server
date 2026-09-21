import { AppError, catchAsync, send as respond } from '../utils/AppError.js';
import { sendMail } from '../services/mailService.js';
import { logActivity } from '../services/activityService.js';

/** Admin → customer email (uses SMTP from Settings) */
export const compose = catchAsync(async (req, res) => {
  const { to, subject, message, html } = req.body || {};
  if (!to || !subject || !(message || html)) {
    throw new AppError('To, subject and message are required', 400);
  }

  const bodyHtml =
    html ||
    `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#0d1838;white-space:pre-wrap">${String(message)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</div>`;

  const result = await sendMail({ to, subject, html: bodyHtml });
  if (result.skipped) {
    throw new AppError('SMTP not configured. Go to Settings → Email / SMTP first.', 400);
  }

  await logActivity(`Email sent to ${to}: ${subject}`, 'mail');
  return respond(res, { ok: true });
});
