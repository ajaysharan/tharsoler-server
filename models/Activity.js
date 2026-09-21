import mongoose from 'mongoose';
import { applyJson } from './plugins/toJson.js';

const activitySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
    at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

applyJson(activitySchema);

export const Activity = mongoose.model('Activity', activitySchema);
