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
  Object.assign(doc, body);
  await doc.save();
  return doc;
}
