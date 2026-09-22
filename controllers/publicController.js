import { Product, Service, Brand, Banner, Inquiry } from '../models/index.js';
import { AppError, catchAsync, send } from '../utils/AppError.js';
import { leanToJson } from '../utils/paginate.js';
import { getSettings } from '../services/settingsService.js';
import { sendMail, buildInquiryAdminMail, buildThankYouMail } from '../services/mailService.js';
import { logActivity } from '../services/activityService.js';
import { notifyAdmins } from '../services/notificationService.js';

export const getSite = catchAsync(async (_req, res) => {
  const [products, services, brands, banners, settings] = await Promise.all([
    Product.find({ active: true }).sort({ name: 1 }).lean(),
    Service.find({ active: true }).sort({ sort: 1 }).lean(),
    Brand.find({ active: true }).sort({ sort: 1 }).lean(),
    Banner.find({ active: true }).sort({ sort: 1 }).lean(),
    getSettings(),
  ]);

  return send(res, {
    products: products.map(leanToJson),
    services: services.map(leanToJson),
    brands: brands.map(leanToJson),
    banners: banners.map(leanToJson),
    settings: {
      company: settings.company,
      unit: settings.unit,
      city: settings.city,
      phone: settings.phone,
      email: settings.email,
    },
  });
});

export const createInquiry = catchAsync(async (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.phone) {
    throw new AppError('Name and phone are required', 400);
  }

  const row = await Inquiry.create({
    name: body.name,
    phone: body.phone,
    email: body.email || '',
    city: body.city || '',
    propertyType: body.propertyType || 'Residential',
    bill: Number(body.bill) || 0,
    capacity: body.capacity || '',
    message: body.message || '',
    status: 'new',
    source: body.source || 'Website',
    assignedTo: null,
    notes: '',
  });

  const settings = await getSettings();
  await logActivity(`Website quote request from ${row.name}`, 'inquiry');
  await notifyAdmins('New inquiry', `${row.name} · ${row.phone} · ${row.city || '—'}`, 'inquiry');

  const jobs = [];
  if (settings.mailAdminOnInquiry && settings.email) {
    const mail = buildInquiryAdminMail(settings, row);
    jobs.push(sendMail({ to: settings.email, subject: mail.subject, html: mail.html }));
  }
  if (settings.mailThankYouCustomer && row.email) {
    const mail = buildThankYouMail(settings, row);
    jobs.push(sendMail({ to: row.email, subject: mail.subject, html: mail.html }));
  }
  Promise.allSettled(jobs).catch(() => {});

  return send(res, row.toJSON(), 201);
});
