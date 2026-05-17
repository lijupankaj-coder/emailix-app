const nodemailer = require('nodemailer');

function mailConfig(override = {}) {
  const host = override.host || process.env.SMTP_HOST;
  const port = Number(override.port || process.env.SMTP_PORT || 587);
  const user = override.user || process.env.SMTP_USER;
  const pass = override.pass || process.env.SMTP_PASS;
  const from = override.from || process.env.SMTP_FROM;
  const secureRaw = override.secure === undefined ? process.env.SMTP_SECURE : override.secure;
  const secure = String(secureRaw || '').toLowerCase() === 'true' || port === 465;

  return {
    configured: [host, user, pass, from].every(isRealValue) && Boolean(port),
    host,
    port,
    user,
    pass,
    from,
    secure,
  };
}

function isRealValue(value) {
  const raw = String(value || '').trim();
  return Boolean(raw) && !raw.startsWith('PASTE_') && raw !== 'your-smtp-password';
}

function createTransporter(override = {}) {
  const cfg = mailConfig(override);
  if (!cfg.configured) {
    const err = new Error('Add SMTP settings for the sender email before sending.');
    err.code = 'SMTP_NOT_CONFIGURED';
    throw err;
  }

  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });
}

function parseRecipients(value) {
  const raw = Array.isArray(value) ? value.join(',') : String(value || '');
  const seen = new Set();
  return raw
    .split(/[\s,;]+/)
    .map(item => item.trim().toLowerCase())
    .filter(Boolean)
    .filter(item => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

function invalidRecipients(recipients) {
  return recipients.filter(email => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

function fromHeader(fromName, override = {}) {
  const cfg = mailConfig(override);
  const cleanName = String(fromName || '').trim().replace(/"/g, "'");
  return cleanName ? `"${cleanName}" <${cfg.from}>` : cfg.from;
}

module.exports = {
  createTransporter,
  fromHeader,
  invalidRecipients,
  mailConfig,
  parseRecipients,
};
