const express = require('express');
const mjml2html = require('mjml');
const { validateLicense } = require('../services/licenseStore');
const {
  createTransporter,
  fromHeader,
  invalidRecipients,
  mailConfig,
  parseRecipients,
} = require('../services/mailer');
const { generateMJML } = require('../utils/mjmlGenerator');

const router = express.Router();

const MAX_RECIPIENTS = Number(process.env.EMAILIX_MAX_SEND_RECIPIENTS || 200);

router.post('/bulk', express.json({ limit: '150mb' }), async (req, res) => {
  const {
    blocks = [],
    globalSettings = {},
    recipients: recipientInput = '',
    subject = '',
    fromName = '',
    replyTo = '',
    licenseKey = '',
    smtp = {},
  } = req.body || {};

  const key = licenseKey || req.headers['x-license-key'];
  const access = validateLicense(key);
  if (!access.valid) {
    return res.status(402).json({
      error: access.reason || 'A paid Emailix license is required to send campaigns.',
    });
  }

  const recipients = parseRecipients(recipientInput);
  if (!recipients.length) return res.status(400).json({ error: 'Add at least one recipient email.' });
  if (recipients.length > MAX_RECIPIENTS) {
    return res.status(400).json({ error: `Send limit is ${MAX_RECIPIENTS} recipients per campaign.` });
  }

  const invalid = invalidRecipients(recipients);
  if (invalid.length) {
    return res.status(400).json({ error: `Invalid recipient email: ${invalid.slice(0, 3).join(', ')}` });
  }

  const cleanSubject = String(subject || globalSettings.subject || '').trim();
  if (!cleanSubject) return res.status(400).json({ error: 'Subject is required before sending.' });
  if (!Array.isArray(blocks) || !blocks.length) return res.status(400).json({ error: 'Add email blocks before sending.' });

  try {
    const smtpOverride = smtp && typeof smtp === 'object' ? {
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      user: smtp.user,
      pass: smtp.pass,
      from: smtp.from,
    } : {};
    const transporter = createTransporter(smtpOverride);
    const mjml = generateMJML(prepareBlocksForEmail(blocks), globalSettings);
    const compiled = mjml2html(mjml, { validationLevel: 'soft', minify: false });
    const html = compiled.html;
    const text = textFallback(blocks);
    const failures = [];
    let sent = 0;

    for (const to of recipients) {
      try {
        await transporter.sendMail({
          from: fromHeader(fromName, smtpOverride),
          to,
          replyTo: replyTo || undefined,
          subject: cleanSubject,
          html,
          text,
        });
        sent += 1;
      } catch (err) {
        failures.push({ email: to, error: err.message });
      }
    }

    return res.json({
      sent,
      failed: failures.length,
      total: recipients.length,
      failures: failures.slice(0, 10),
      warnings: compiled.errors?.map(e => e.message) || [],
    });
  } catch (err) {
    console.error('Bulk send error:', err.message);
    const status = err.code === 'SMTP_NOT_CONFIGURED' ? 503 : 500;
    return res.status(status).json({ error: err.message });
  }
});

router.get('/status', (req, res) => {
  const cfg = mailConfig();
  res.json({
    configured: cfg.configured,
    from: cfg.configured ? cfg.from : '',
    maxRecipients: MAX_RECIPIENTS,
  });
});

function prepareBlocksForEmail(blocks) {
  return JSON.parse(JSON.stringify(blocks)).map(block => {
    const props = block.props || {};
    ['src', 'thumbnailSrc'].forEach(key => {
      if (typeof props[key] === 'string' && props[key].startsWith('data:')) {
        props[key] = '';
      }
    });
    return { ...block, props };
  });
}

function textFallback(blocks) {
  const parts = blocks
    .map(block => {
      const props = block.props || {};
      if (block.type === 'title' || block.type === 'text') return stripHtml(props.content);
      if (block.type === 'button') return [props.label, props.href].filter(Boolean).join(': ');
      return '';
    })
    .filter(Boolean);
  return parts.join('\n\n') || 'This email is best viewed in an HTML email client.';
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

module.exports = router;
