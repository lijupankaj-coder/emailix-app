const express = require('express');
const {
  createLicense,
  listLicenses,
  setLicenseStatus,
  validateLicense,
} = require('../services/licenseStore');

const router = express.Router();

function publicLicensePayload(license) {
  return {
    key: license.key,
    email: license.email,
    plan: license.plan,
    status: license.status,
    expiresAt: license.expiresAt,
  };
}

function requireAdmin(req, res, next) {
  const configuredPassword = process.env.ADMIN_PASSWORD || 'Nblx@Admin2026';

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Emailix Admin"');
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const [user, pass] = Buffer.from(encoded, 'base64').toString('utf8').split(':');
  const expectedUser = process.env.ADMIN_USER || 'liju';
  if (user === expectedUser && pass === configuredPassword) return next();

  res.setHeader('WWW-Authenticate', 'Basic realm="Emailix Admin"');
  return res.status(401).json({ error: 'Invalid credentials.' });
}

router.post('/license/activate', (req, res) => {
  const { key, licenseKey } = req.body || {};
  const result = validateLicense(licenseKey || key, { countActivation: true });
  if (!result.valid) return res.status(402).json({ valid: false, error: result.reason });
  return res.json({ valid: true, license: publicLicensePayload(result.license) });
});

router.get('/admin/licenses', requireAdmin, (req, res) => {
  res.json({ licenses: listLicenses() });
});

router.post('/admin/licenses', requireAdmin, (req, res) => {
  const { email, plan } = req.body || {};
  const license = createLicense({ email, plan });
  res.status(201).json({ license });
});

router.patch('/admin/licenses/:key', requireAdmin, (req, res) => {
  const license = setLicenseStatus(req.params.key, req.body?.status);
  if (!license) return res.status(404).json({ error: 'License not found.' });
  res.json({ license });
});

router.requireAdmin = requireAdmin;
router.publicLicensePayload = publicLicensePayload;

module.exports = router;
