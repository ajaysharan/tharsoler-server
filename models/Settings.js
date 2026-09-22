import mongoose from 'mongoose';

export const DEFAULT_OTP_SUBJECT = 'Your {{company}} login OTP';
export const DEFAULT_OTP_HTML = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0d1838">
  <h2 style="margin:0 0 12px">{{company}} login code</h2>
  <p>Hi {{name}},</p>
  <p>Your one-time password (OTP) is:</p>
  <p style="font-size:28px;font-weight:700;letter-spacing:4px;color:#ff7f11;margin:16px 0">{{otp}}</p>
  <p>This code expires in <b>{{expiresMinutes}} minutes</b>.</p>
  <p style="color:#64748b;font-size:13px">If you did not try to sign in, ignore this email.</p>
</div>`;

export const DEFAULT_THANKYOU_SUBJECT = 'Thank you — {{company}}';
export const DEFAULT_THANKYOU_HTML = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0d1838">
  <h2 style="margin:0 0 12px">Thank you, {{name}}!</h2>
  <p>We received your solar inquiry at <b>{{company}}</b>.</p>
  <p>Request: <b>{{capacity}}</b> · {{propertyType}} · {{city}}</p>
  <p>Our team will contact you shortly on {{phone}}.</p>
  <p style="margin-top:24px">Warm regards,<br/><b>{{company}}</b><br/>{{companyPhone}}</p>
</div>`;

export const DEFAULT_INQUIRY_SUBJECT = 'New inquiry: {{name}}';
export const DEFAULT_INQUIRY_HTML = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0d1838">
  <h2 style="margin:0 0 12px">New solar inquiry</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px">
    <tr><td style="padding:6px 0;color:#64748b">Name</td><td style="padding:6px 0"><b>{{name}}</b></td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Phone</td><td style="padding:6px 0">{{phone}}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0">{{email}}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">City</td><td style="padding:6px 0">{{city}}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Property</td><td style="padding:6px 0">{{propertyType}}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Bill</td><td style="padding:6px 0">₹{{bill}}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Capacity</td><td style="padding:6px 0">{{capacity}}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b">Message</td><td style="padding:6px 0">{{message}}</td></tr>
  </table>
</div>`;

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main', index: true },
    company: { type: String, default: 'THAR SOLAR' },
    unit: { type: String, default: 'A unit of Ganesh Motor' },
    city: { type: String, default: 'Badi Khatu, Nagaur, Rajasthan' },
    phone: { type: String, default: '+91 93282 22520' },
    email: { type: String, default: 'info@tharsolar.com' },
    gst: { type: String, default: '' },

    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpSecure: { type: Boolean, default: false },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '', select: false },
    smtpFrom: { type: String, default: '' },
    smtpFromName: { type: String, default: 'THAR SOLAR' },

    otpLogin: { type: Boolean, default: false },
    otpExpiresMinutes: { type: Number, default: 10 },
    otpSubject: { type: String, default: DEFAULT_OTP_SUBJECT },
    otpHtml: { type: String, default: DEFAULT_OTP_HTML },

    mailAdminOnInquiry: { type: Boolean, default: true },
    mailThankYouCustomer: { type: Boolean, default: true },
    inquirySubject: { type: String, default: DEFAULT_INQUIRY_SUBJECT },
    inquiryHtml: { type: String, default: DEFAULT_INQUIRY_HTML },
    thankYouSubject: { type: String, default: DEFAULT_THANKYOU_SUBJECT },
    thankYouHtml: { type: String, default: DEFAULT_THANKYOU_HTML },
  },
  { timestamps: true },
);

settingsSchema.set('toJSON', {
  versionKey: false,
  transform(_doc, ret) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    ret.smtpConfigured = Boolean(ret.smtpPass);
    delete ret.smtpPass;
    return ret;
  },
});

export const Settings = mongoose.model('Settings', settingsSchema);
