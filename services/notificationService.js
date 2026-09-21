import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { uid } from '../utils/uid.js';

export async function notifyAdmins(title, body, type = 'info') {
  const admins = await User.find({
    role: { $in: ['admin', 'manager'] },
    status: 'active',
  });
  if (!admins.length) return;
  await Notification.insertMany(
    admins.map((u) => ({
      _id: uid('ntf'),
      title,
      body,
      type,
      userId: u._id,
      read: false,
    })),
  );
}

export async function listForUser(userId, limit = 20) {
  const [data, unread] = await Promise.all([
    Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit),
    Notification.countDocuments({ userId, read: false }),
  ]);
  return {
    data: data.map((r) => r.toJSON()),
    unread,
  };
}

export async function markAllRead(userId) {
  await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
}
