import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    lastLogin: Date,
  },
  { timestamps: true },
);

applyJson(userSchema);

export const User = mongoose.model('User', userSchema);
