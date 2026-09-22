import { Activity } from '../models/Activity.js';

export async function logActivity(text, type = 'info') {
  return Activity.create({
    text,
    type,
    at: new Date(),
  });
}
