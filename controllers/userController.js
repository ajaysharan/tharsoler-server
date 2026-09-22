import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { AppError, catchAsync, send } from '../utils/AppError.js';
import { paginate, sanitizeWriteBody } from '../utils/paginate.js';
import { toOidList, isOid } from '../utils/oid.js';
import { logActivity } from '../services/activityService.js';
import { toPublicUser } from '../middleware/auth.js';

export const list = catchAsync(async (req, res) => {
  const result = await paginate(User, req.query, ['name', 'email', 'phone', 'role']);
  return send(res, result);
});

export const create = catchAsync(async (req, res) => {
  const body = sanitizeWriteBody(req.body || {});
  if (!body.email || !body.name) throw new AppError('Name and email required', 400);

  const exists = await User.findOne({ email: String(body.email).toLowerCase() }).lean();
  if (exists) throw new AppError('Email already exists', 400);

  const user = await User.create({
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
  if (!isOid(req.params.id)) throw new AppError('Invalid id', 400);
  const user = await User.findById(req.params.id).select('+passwordHash');
  if (!user) throw new AppError('Not found', 404);

  const body = sanitizeWriteBody(req.body || {});
  if (body.name) user.name = body.name;
  if (body.email) user.email = String(body.email).toLowerCase();
  if (body.phone !== undefined) user.phone = body.phone;
  if (body.role) user.role = body.role;
  if (body.status) user.status = body.status;
  if (body.avatar !== undefined) user.avatar = body.avatar;
  if (body.password) user.passwordHash = await bcrypt.hash(body.password, 10);

  await user.save();
  return send(res, toPublicUser(user));
});

export const removeMany = catchAsync(async (req, res) => {
  const ids = toOidList(req.body?.ids || []);
  if (!ids.length) throw new AppError('No valid ids', 400);
  await User.deleteMany({ _id: { $in: ids } });
  return send(res, { ok: true, deleted: ids.length });
});
