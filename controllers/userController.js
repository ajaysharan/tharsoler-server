import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AppError, catchAsync, send } from '../utils/AppError.js';
import { uid } from '../utils/uid.js';
import { paginate } from '../utils/paginate.js';
import { logActivity } from '../services/activityService.js';
import { toPublicUser } from '../middleware/auth.js';

export const list = catchAsync(async (req, res) => {
  const result = await paginate(User, req.query, ['name', 'email', 'phone', 'role']);
  return send(res, result);
});

export const create = catchAsync(async (req, res) => {
  const body = req.body || {};
  if (!body.email || !body.name) throw new AppError('Name and email required', 400);

  const exists = await User.findOne({ email: String(body.email).toLowerCase() });
  if (exists) throw new AppError('Email already exists', 400);

  const user = await User.create({
    _id: uid('usr'),
    name: body.name,
    email: String(body.email).toLowerCase(),
    phone: body.phone || '',
    role: body.role || 'staff',
    status: body.status || 'active',
    passwordHash: await bcrypt.hash(body.password || 'Staff@123', 10),
  });

  await logActivity(`Created user: ${user.name}`, 'users');
  return send(res, toPublicUser(user), 201);
});

export const update = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('Not found', 404);

  const body = req.body || {};
  if (body.name) user.name = body.name;
  if (body.email) user.email = String(body.email).toLowerCase();
  if (body.phone !== undefined) user.phone = body.phone;
  if (body.role) user.role = body.role;
  if (body.status) user.status = body.status;
  if (body.password) user.passwordHash = await bcrypt.hash(body.password, 10);

  await user.save();
  return send(res, toPublicUser(user));
});

export const removeMany = catchAsync(async (req, res) => {
  const ids = req.body?.ids || [];
  await User.deleteMany({ _id: { $in: ids } });
  return send(res, { ok: true });
});
