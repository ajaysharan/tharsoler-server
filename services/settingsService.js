import {
  Settings,
  DEFAULT_OTP_HTML,
  DEFAULT_OTP_SUBJECT,
  DEFAULT_THANKYOU_HTML,
  DEFAULT_THANKYOU_SUBJECT,
  DEFAULT_INQUIRY_HTML,
  DEFAULT_INQUIRY_SUBJECT,
} from '../models/Settings.js';

const TEMPLATE_DEFAULTS = {
  smtpFromName: 'THAR SOLAR',
  otpExpiresMinutes: 10,
  otpSubject: DEFAULT_OTP_SUBJECT,
  otpHtml: DEFAULT_OTP_HTML,
  inquirySubject: DEFAULT_INQUIRY_SUBJECT,
  inquiryHtml: DEFAULT_INQUIRY_HTML,
  thankYouSubject: DEFAULT_THANKYOU_SUBJECT,
  thankYouHtml: DEFAULT_THANKYOU_HTML,
};

const SETTINGS_KEY = 'main';
const DEFAULT_LABELS = ['Primary', 'Alternate', 'WhatsApp'];

/** Normalize to exactly 3 slots; sync primary `phone` from first filled number */
export function normalizePhones(input, fallbackPhone = '') {
  const raw = Array.isArray(input) ? input : [];
  const slots = [0, 1, 2].map((i) => {
    const row = raw[i] || {};
    const number = String(
      row.number != null && row.number !== ''
        ? row.number
        : typeof row === 'string'
          ? row
          : '',
    ).trim();
    const label = String(row.label || DEFAULT_LABELS[i] || '').trim();
    return { label: label || DEFAULT_LABELS[i], number };
  });

  if (!slots.some((s) => s.number) && fallbackPhone) {
    slots[0].number = String(fallbackPhone).trim();
  }

  const primary = slots.find((s) => s.number)?.number || fallbackPhone || '';
  return { phones: slots, phone: primary };
}

const SETTINGS_KEY_EXPORT = SETTINGS_KEY;

export async function getSettings() {
  let doc = await Settings.findOne({ key: SETTINGS_KEY }).select('+smtpPass');
  if (!doc) {
    doc = await Settings.create({ key: SETTINGS_KEY });
    return doc;
  }

  let dirty = false;
  for (const [key, value] of Object.entries(TEMPLATE_DEFAULTS)) {
    if (doc[key] == null || doc[key] === '') {
      doc[key] = value;
      dirty = true;
    }
  }

  const filled = (doc.phones || []).filter((p) => p && String(p.number || '').trim());
  if (!filled.length && doc.phone) {
    const { phones, phone } = normalizePhones([], doc.phone);
    doc.phones = phones;
    doc.phone = phone;
    dirty = true;
  } else if (doc.phones) {
    const { phones, phone } = normalizePhones(doc.phones, doc.phone);
    const changed =
      JSON.stringify(doc.phones.map((p) => ({ label: p.label, number: p.number }))) !==
      JSON.stringify(phones);
    if (changed || doc.phone !== phone) {
      doc.phones = phones;
      doc.phone = phone;
      dirty = true;
    }
  }

  if (dirty) await doc.save();
  return doc;
}

export async function updateSettings(patch) {
  const doc = await getSettings();
  const body = { ...patch };
  if (!body.smtpPass || body.smtpPass === '********') delete body.smtpPass;
  delete body.id;
  delete body._id;
  delete body.key;
  delete body.smtpConfigured;

  if (body.phones || body.phone !== undefined) {
    const { phones, phone } = normalizePhones(body.phones ?? doc.phones, body.phone ?? doc.phone);
    body.phones = phones;
    body.phone = phone;
  }

  Object.assign(doc, body);
  await doc.save();
  return doc;
}

export { SETTINGS_KEY_EXPORT as SETTINGS_KEY };
