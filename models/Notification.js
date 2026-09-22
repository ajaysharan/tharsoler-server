import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, default: '' },
    type: { type: String, default: 'info', index: true },
    read: { type: Boolean, default: false, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

applyJson(notificationSchema);

export const Notification = mongoose.model('Notification', notificationSchema);
