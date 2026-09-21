import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Otp } from '../models/Otp.js';
import { AppError, catchAsync, send } from '../utils/AppError.js';
import { uid } from '../utils/uid.js';
import { getSettings } from '../services/settingsService.js';
import { sendMail, buildOtpMail } from '../services/mailService.js';
import { signToken, toPublicUser } from '../middleware/auth.js';

export const login = catchAsync(async (req, res) => {
  const { email, password, remember } = req.body || {};
  const user = await User.findOne({
    email: String(email || '').trim().toLowerCase(),
    status: 'active',
  });

  if (!user || !(await bcrypt.compare(String(password || ''), user.passwordHash || ''))) {
    throw new AppError('Invalid email or password, or account is inactive.', 401);
  }

  const settings = await getSettings();
  if (settings.otpLogin) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const challengeId = uid('otp');
    const mail = buildOtpMail(settings, { code, name: user.name, email: user.email });
    await Otp.create({
      _id: challengeId,
      email: user.email,
      codeHash: await bcrypt.hash(code, 8),
      expiresAt: new Date(Date.now() + mail.expiresMinutes * 60 * 1000),
    });
    const mailed = await sendMail({
      to: user.email,
      subject: mail.subject,
      html: mail.html,
    });
    if (mailed.skipped) console.log(`[otp] ${user.email} → ${code}`);
    return send(res, {
      otpRequired: true,
      challengeId,
      hint: mailed.skipped
        ? 'OTP logged in server console (SMTP not set)'
        : 'OTP sent to email',
    });
  }

  user.lastLogin = new Date();
  await user.save();
  return send(res, { token: signToken(user, remember), user: toPublicUser(user) });
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { challengeId, code, remember } = req.body || {};
  const rec = await Otp.findById(challengeId);
  if (!rec || rec.expiresAt < new Date()) {
    throw new AppError('OTP expired. Sign in again.', 400);
  }
  const ok = await bcrypt.compare(String(code || ''), rec.codeHash);
  if (!ok) throw new AppError('Invalid OTP', 400);

  const user = await User.findOne({ email: rec.email, status: 'active' });
  await Otp.deleteOne({ _id: challengeId });
  if (!user) throw new AppError('Account not found', 401);

  user.lastLogin = new Date();
  await user.save();
  return send(res, { token: signToken(user, remember), user: toPublicUser(user) });
});

export const me = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User missing', 401);
  return send(res, toPublicUser(user));
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('Not found', 404);

  const { name, phone, avatar, password, currentPassword } = req.body || {};
  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  if (password) {
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.passwordHash || ''))) {
      throw new AppError('Current password is incorrect', 400);
    }
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  await user.save();
  return send(res, toPublicUser(user));
});
