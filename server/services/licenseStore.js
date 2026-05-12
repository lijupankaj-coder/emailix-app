const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const storePath = process.env.LICENSE_STORE_PATH || path.join(__dirname, '../data/licenses.json');

const PLAN_CONFIG = {
  monthly: { price: 29 },
  yearly: { price: 199 },
  super_admin: { price: 0, expiresAt: null },
};

function ensureStore() {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({ licenses: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    return Array.isArray(parsed.licenses) ? parsed : { licenses: [] };
  } catch {
    return { licenses: [] };
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
}

function envLicenses() {
  return (process.env.EMAILIX_LICENSE_KEYS || '')
    .split(',')
    .map(key => key.trim().toUpperCase())
    .filter(Boolean);
}

function generateKey() {
  const raw = crypto.randomBytes(9).toString('hex').toUpperCase();
  return `EIX-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 18)}`;
}

function normalizePlan(plan) {
  const normalized = String(plan || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (normalized === 'super_admin' || normalized === 'lifetime' || normalized === 'forever') return 'super_admin';
  if (normalized === 'yearly') return 'yearly';
  return 'monthly';
}

function expiryForPlan(plan, start = new Date()) {
  if (PLAN_CONFIG[plan]?.expiresAt === null) return null;

  const expires = new Date(start);
  if (plan === 'yearly') expires.setFullYear(expires.getFullYear() + 1);
  else expires.setMonth(expires.getMonth() + 1);
  return expires.toISOString();
}

function normalizeKey(key) {
  return String(key || '').trim().toUpperCase();
}

function listLicenses() {
  return readStore().licenses.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function createLicense({ email = '', plan = 'monthly' }) {
  const cleanPlan = normalizePlan(plan);
  const store = readStore();
  let key = generateKey();
  while (store.licenses.some(license => license.key === key)) key = generateKey();

  const now = new Date();
  const license = {
    key,
    email: String(email || '').trim(),
    plan: cleanPlan,
    price: PLAN_CONFIG[cleanPlan]?.price ?? 29,
    status: 'active',
    createdAt: now.toISOString(),
    expiresAt: expiryForPlan(cleanPlan, now),
    activations: 0,
    lastActivatedAt: null,
  };

  store.licenses.unshift(license);
  writeStore(store);
  return license;
}

function setLicenseStatus(key, status) {
  const store = readStore();
  const normalized = normalizeKey(key);
  const license = store.licenses.find(item => item.key === normalized);
  if (!license) return null;
  license.status = status === 'revoked' ? 'revoked' : 'active';
  writeStore(store);
  return license;
}

function validateLicense(key, { countActivation = false } = {}) {
  const normalized = normalizeKey(key);
  if (!normalized) return { valid: false, reason: 'License key is required.' };

  if (envLicenses().includes(normalized)) {
    return {
      valid: true,
      license: {
        key: normalized,
        email: '',
        plan: 'manual',
        status: 'active',
        expiresAt: null,
        source: 'env',
      },
    };
  }

  const store = readStore();
  const license = store.licenses.find(item => item.key === normalized);
  if (!license) return { valid: false, reason: 'License key was not found.' };
  if (license.status !== 'active') return { valid: false, reason: 'License key is not active.' };
  if (license.expiresAt && new Date(license.expiresAt).getTime() < Date.now()) {
    return { valid: false, reason: 'License key has expired.' };
  }

  if (countActivation) {
    license.activations = Number(license.activations || 0) + 1;
    license.lastActivatedAt = new Date().toISOString();
    writeStore(store);
  }

  return { valid: true, license };
}

module.exports = {
  createLicense,
  listLicenses,
  setLicenseStatus,
  validateLicense,
};
