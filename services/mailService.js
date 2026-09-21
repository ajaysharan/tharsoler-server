import nodemailer from 'nodemailer';
import { getSettings } from './settingsService.js';
import {
  DEFAULT_OTP_HTML,
  DEFAULT_OTP_SUBJECT,
  DEFAULT_THANKYOU_HTML,
  DEFAULT_THANKYOU_SUBJECT,
  DEFAULT_INQUIRY_HTML,
  DEFAULT_INQUIRY_SUBJECT,
} from '../models/Settings.js';

/** Replace {{token}} placeholders in a string */
export function renderTemplate(template, vars = {}) {
  return String(template || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, key) => {
    const val = vars[key];
    return val == null ? '' : String(val);
  });
}

function fromAddress(settings) {
  const email = settings.smtpFrom || settings.smtpUser || settings.email;
  const name = settings.smtpFromName || settings.company || 'THAR SOLAR';
  if (!email) return name;
  return `"${name.replace(/"/g, '')}" <${email}>`;
}

export async function sendMail({ to, subject, html }) {
  if (!to) return { skipped: true, reason: 'no-recipient' };
  const s = await getSettings();
  if (!s.smtpHost || !s.smtpUser || !s.smtpPass) {
    console.log(`[mail:skipped] ${subject} → ${to}`);
    return { skipped: true, reason: 'smtp-not-configured' };
  }

  const transporter = nodemailer.createTransport({
    host: s.smtpHost,
    port: Number(s.smtpPort) || 587,
    secure: Boolean(s.smtpSecure),
    auth: { user: s.smtpUser, pass: s.smtpPass },
  });

  await transporter.sendMail({
    from: fromAddress(s),
    to,
    subject,
    html,
  });

  return { ok: true };
}

export function buildOtpMail(settings, { code, name, email }) {
  const expiresMinutes = settings.otpExpiresMinutes || 10;
  const vars = {
    otp: code,
    name: name || 'there',
    email: email || '',
    company: settings.company || 'THAR SOLAR',
    expiresMinutes,
  };
  return {
    subject: renderTemplate(settings.otpSubject || DEFAULT_OTP_SUBJECT, vars),
    html: renderTemplate(settings.otpHtml || DEFAULT_OTP_HTML, vars),
    expiresMinutes,
  };
}

export function buildThankYouMail(settings, row) {
  const vars = {
    name: row.name || 'Customer',
    email: row.email || '',
    phone: row.phone || '',
    city: row.city || 'your area',
    propertyType: row.propertyType || '',
    capacity: row.capacity || 'solar system',
    bill: row.bill ?? '',
    message: row.message || '',
    company: settings.company || 'THAR SOLAR',
    companyPhone: settings.phone || '',
    companyEmail: settings.email || '',
  };
  return {
    subject: renderTemplate(settings.thankYouSubject || DEFAULT_THANKYOU_SUBJECT, vars),
    html: renderTemplate(settings.thankYouHtml || DEFAULT_THANKYOU_HTML, vars),
  };
}

export function buildInquiryAdminMail(settings, row) {
  const vars = {
    name: row.name || '',
    email: row.email || '—',
    phone: row.phone || '',
    city: row.city || '—',
    propertyType: row.propertyType || '—',
    capacity: row.capacity || '—',
    bill: row.bill ?? '—',
    message: row.message || '—',
    company: settings.company || 'THAR SOLAR',
  };
  return {
    subject: renderTemplate(settings.inquirySubject || DEFAULT_INQUIRY_SUBJECT, vars),
    html: renderTemplate(settings.inquiryHtml || DEFAULT_INQUIRY_HTML, vars),
  };
}

/** @deprecated use buildInquiryAdminMail */
export function inquiryAdminHtml(row, company) {
  return buildInquiryAdminMail({ company }, row).html;
}

/** @deprecated use buildThankYouMail */
export function thankYouHtml(row, company) {
  return buildThankYouMail({ company }, row).html;
}

/** @deprecated use buildOtpMail */
export function otpHtml(code) {
  return renderTemplate(DEFAULT_OTP_HTML, { otp: code, name: 'there', company: 'THAR SOLAR', expiresMinutes: 10 });
}
