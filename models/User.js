import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff', index: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    passwordHash: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    lastLogin: Date,
  },
  { timestamps: true },
);

userSchema.index({ status: 1, role: 1 });
userSchema.index({ createdAt: -1 });

applyJson(userSchema);

export const User = mongoose.model('User', userSchema);
