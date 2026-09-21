import bcrypt from 'bcryptjs';
import { BRANDS, SERVICES } from './data/catalog.js';
import { buildSeed } from './data/buildSeed.js';
import { env } from './config/env.js';
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
} from './models/index.js';

export async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return false;

  const seed = buildSeed();
  const adminPassword = env.adminPassword;

  try {
    for (const u of seed.users) {
      const password = u.email === env.adminEmail ? adminPassword : u.password || 'Staff@123';
      await User.create({
        _id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        lastLogin: u.lastLogin,
        createdAt: u.createdAt,
        passwordHash: await bcrypt.hash(password, 10),
      });
    }

    await Inquiry.insertMany(seed.inquiries.map(({ id, ...r }) => ({ ...r, _id: id })));
    await Customer.insertMany(seed.customers.map(({ id, ...r }) => ({ ...r, _id: id })));
    await Quote.insertMany(seed.quotes.map(({ id, ...r }) => ({ ...r, _id: id })));
    await Project.insertMany(seed.projects.map(({ id, ...r }) => ({ ...r, _id: id })));
    await Product.insertMany(seed.products.map(({ id, ...r }) => ({ ...r, _id: id })));
    await Activity.insertMany(seed.activity.map(({ id, ...r }) => ({ ...r, _id: id })));

    await Service.insertMany(
      SERVICES.map((s, i) => ({
        ...s,
        _id: s.id,
        active: true,
        sort: i,
      })),
    );

    await Brand.insertMany(
      BRANDS.map((b, i) => ({
        _id: `brand_${i + 1}`,
        name: b.name,
        logo: b.logo,
        active: true,
        sort: i,
      })),
    );

    await Banner.create({
      _id: 'banner_hero',
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
      _id: 'main',
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
  } catch (err) {
    if (err?.code === 11000) {
      console.warn('Seed skipped (data already partially present)');
      return false;
    }
    throw err;
  }

  return true;
}
