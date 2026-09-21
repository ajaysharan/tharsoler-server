import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const notificationSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, default: '' },
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false },
    userId: { type: String, required: true, index: true },
  },
  { timestamps: true },
);

applyJson(notificationSchema);

export const Notification = mongoose.model('Notification', notificationSchema);
