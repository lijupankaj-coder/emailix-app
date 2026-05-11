export function hasActiveLicense(licenseKey, licenseInfo) {
  if (!licenseKey || !licenseInfo || licenseInfo.status !== 'active') return false;
  if (!licenseInfo.expiresAt) return true;

  const expiresAt = Date.parse(licenseInfo.expiresAt);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}
