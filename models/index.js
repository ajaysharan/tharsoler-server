export { User } from './User.js';
export { Inquiry } from './Inquiry.js';
export { Customer } from './Customer.js';
export { Quote } from './Quote.js';
export { Project } from './Project.js';
export { Product } from './Product.js';
export { Service } from './Service.js';
export { Brand } from './Brand.js';
export { Banner } from './Banner.js';
export { Activity } from './Activity.js';
export { Notification } from './Notification.js';
export { Otp } from './Otp.js';
export { Settings } from './Settings.js';

import { Inquiry } from './Inquiry.js';
import { Customer } from './Customer.js';
import { Quote } from './Quote.js';
import { Project } from './Project.js';
import { Product } from './Product.js';
import { Service } from './Service.js';
import { Brand } from './Brand.js';
import { Banner } from './Banner.js';
import { Activity } from './Activity.js';
import { User } from './User.js';
import { RESOURCES } from '../config/resources.js';

export const MODEL_MAP = {
  inquiries: Inquiry,
  customers: Customer,
  quotes: Quote,
  projects: Project,
  products: Product,
  services: Service,
  brands: Brand,
  banners: Banner,
  activity: Activity,
  users: User,
};

export function getResource(key) {
  const model = MODEL_MAP[key];
  const meta = RESOURCES[key];
  if (!model || !meta) return null;
  return { model, ...meta };
}
