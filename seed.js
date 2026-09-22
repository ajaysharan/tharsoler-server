import bcrypt from 'bcryptjs';
import { BRANDS, SERVICES } from './data/catalog.js';
import { buildSeed } from './data/buildSeed.js';
import { env } from './config/env.js';
import { slugify } from './utils/slug.js';
import {
  User,
  Inquiry,
  Customer,
  Quote,
  Project,
  Product,
  Service,
  Brand,
  Banner,
  Activity,
  Settings,
  Notification,
  Otp,
} from './models/index.js';

async function clearAll() {
  await Promise.all([
    User.deleteMany({}),
    Inquiry.deleteMany({}),
    Customer.deleteMany({}),
    Quote.deleteMany({}),
    Project.deleteMany({}),
    Product.deleteMany({}),
    Service.deleteMany({}),
    Brand.deleteMany({}),
    Banner.deleteMany({}),
    Activity.deleteMany({}),
    Notification.deleteMany({}),
    Otp.deleteMany({}),
    Settings.deleteMany({}),
  ]);
}

export async function seedDatabase({ force = false } = {}) {
  const count = await User.countDocuments();
  if (count > 0 && !force) return false;
  if (force) await clearAll();

  const seed = buildSeed();
  const adminPassword = env.adminPassword;
  const userByKey = new Map();

  for (const u of seed.users) {
    const password = u.email === env.adminEmail ? adminPassword : u.password || 'Staff@123';
    const doc = await User.create({
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      status: u.status,
      lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
      createdAt: u.createdAt ? new Date(u.createdAt) : undefined,
      passwordHash: await bcrypt.hash(password, 10),
    });
    userByKey.set(u.key, doc._id);
  }

  const inquiryIds = [];
  for (const row of seed.inquiries) {
    const { key: _key, assignedKey, ...data } = row;
    const doc = await Inquiry.create({
      ...data,
      assignedTo: assignedKey ? userByKey.get(assignedKey) || null : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    });
    inquiryIds.push({ key: row.key, id: doc._id, row });
  }

  const inquiryByKey = new Map(inquiryIds.map((x) => [x.key, x.id]));

  for (const c of seed.customers) {
    const { inquiryKey, ...data } = c;
    await Customer.create({
      ...data,
      inquiryId: inquiryKey ? inquiryByKey.get(inquiryKey) || null : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    });
  }

  for (const q of seed.quotes) {
    const { assignedKey, ...data } = q;
    await Quote.create({
      ...data,
      assignedTo: assignedKey ? userByKey.get(assignedKey) || null : null,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      validTill: data.validTill ? new Date(data.validTill) : undefined,
    });
  }

  for (const p of seed.projects) {
    const { managerKey, ...data } = p;
    await Project.create({
      ...data,
      managerId: managerKey ? userByKey.get(managerKey) || null : null,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
    });
  }

  const brandDocs = await Brand.insertMany(
    BRANDS.map((b, i) => ({
      slug: slugify(b.name),
      name: b.name,
      logo: b.logo,
      active: true,
      sort: i,
    })),
  );
  const brandByName = new Map(brandDocs.map((b) => [b.name.toLowerCase(), b._id]));

  await Product.insertMany(
    seed.products.map((p) => ({
      ...p,
      slug: p.slug || slugify(p.name),
      brandId: brandByName.get(String(p.brand || '').toLowerCase()) || null,
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined,
    })),
  );

  await Service.insertMany(
    SERVICES.map((s, i) => {
      const { id, ...rest } = s;
      return {
        ...rest,
        slug: id || slugify(s.title),
        active: true,
        sort: i,
      };
    }),
  );

  await Activity.insertMany(
    seed.activity.map((a) => ({
      text: a.text,
      type: a.type,
      at: a.at ? new Date(a.at) : new Date(),
    })),
  );

  await Banner.create({
    eyebrow: 'Since 2006 · Badi Khatu, Nagaur',
    title: 'Clean power for homes, farms & industry',
    desc: 'Rooftop and commercial solar engineered for Rajasthan heat — clean install, lasting savings, local after-sales support.',
    hindi: 'आज की समझदारी... कल की बचत',
    ctaLabel: 'Get Free Quote',
    ctaLink: '/quote',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
    video: 'https://videos.pexels.com/video-files/2800468/2800468-sd_640_360_30fps.mp4',
    caption: 'Live solar energy in action',
    active: true,
    sort: 0,
  });

  await Settings.create({
    key: 'main',
    ...seed.settings,
    smtpHost: '',
    smtpPort: 587,
    smtpSecure: false,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: seed.settings.email,
    otpLogin: false,
    mailAdminOnInquiry: true,
    mailThankYouCustomer: true,
  });

  return true;
}

/** @deprecated use seedDatabase */
export async function seedIfEmpty() {
  return seedDatabase({ force: false });
}
