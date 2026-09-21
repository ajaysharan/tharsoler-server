import { Inquiry, Quote, Project, User, Customer } from '../models/index.js';
import { catchAsync, send } from '../utils/AppError.js';

export const getDashboard = catchAsync(async (_req, res) => {
  const [inquiries, quotes, projects, users, customers] = await Promise.all([
    Inquiry.find(),
    Quote.find(),
    Project.find(),
    User.find(),
    Customer.find(),
  ]);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const byStatus = inquiries.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  const won = inquiries.filter((i) => i.status === 'won').length;
  const pipeline = quotes
    .filter((q) => q.status === 'sent' || q.status === 'draft')
    .reduce((s, q) => s + (q.amount || 0), 0);
  const wonValue = quotes
    .filter((q) => q.status === 'accepted')
    .reduce((s, q) => s + (q.amount || 0), 0);

  const months = [];
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.getMonth();
    const y = d.getFullYear();
    months.push({
      label: d.toLocaleString('en-IN', { month: 'short' }),
      inquiries: inquiries.filter((q) => {
        const dt = new Date(q.createdAt);
        return dt.getMonth() === m && dt.getFullYear() === y;
      }).length,
      won: quotes.filter((q) => {
        const dt = new Date(q.createdAt);
        return q.status === 'accepted' && dt.getMonth() === m && dt.getFullYear() === y;
      }).length,
    });
  }

  return send(res, {
    kpis: {
      inquiries: inquiries.length,
      today: inquiries.filter((i) => new Date(i.createdAt).getTime() >= startOfToday).length,
      conversion: inquiries.length ? Math.round((won / inquiries.length) * 100) : 0,
      pipeline,
      wonValue,
      customers: customers.length,
      activeUsers: users.filter((u) => u.status === 'active').length,
      liveProjects: projects.filter((p) => p.status !== 'commissioned').length,
    },
    byStatus,
    months,
    recent: inquiries
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6)
      .map((r) => r.toJSON()),
    quotes: quotes.slice(0, 5).map((r) => r.toJSON()),
  });
});
