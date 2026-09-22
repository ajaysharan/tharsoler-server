import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

export async function notifyAdmins(title, body, type = 'info') {
  const admins = await User.find({
    role: { $in: ['admin', 'manager'] },
    status: 'active',
  })
    .select('_id')
    .lean();

  if (!admins.length) return;

  await Notification.insertMany(
    admins.map((u) => ({
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
    Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean(),
    Notification.countDocuments({ userId, read: false }),
  ]);

  return {
    data: data.map((r) => {
      const { _id, __v, ...rest } = r;
      return { ...rest, id: String(_id), userId: String(rest.userId) };
    }),
    unread,
  };
}

export async function markAllRead(userId) {
  await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
}
