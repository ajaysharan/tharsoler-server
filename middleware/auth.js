import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export function authenticate(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return next(new AppError('Sign in required', 401));
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    next(new AppError('Session expired', 401));
  }
}

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Not allowed', 403));
    }
    next();
  };
}

export function signToken(user, remember = false) {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: remember ? env.jwtRemember : env.jwtExpires },
  );
}

export function toPublicUser(user) {
  const j = typeof user.toJSON === 'function' ? user.toJSON() : user;
  return {
    id: j.id,
    name: j.name,
    email: j.email,
    phone: j.phone,
    role: j.role,
    status: j.status,
    avatar: j.avatar,
    lastLogin: j.lastLogin,
  };
}
