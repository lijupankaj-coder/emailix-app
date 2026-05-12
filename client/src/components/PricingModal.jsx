import { useState } from 'react';
import axios from 'axios';
import { useEmailStore } from '../store/useEmailStore';

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$29',
    cadence: '/ month',
    note: 'Best for short campaigns and client handoff work.',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$199',
    cadence: '/ year',
    note: 'Best value for regular email production.',
    badge: 'Save $149',
  },
];

function licensePlanLabel(plan) {
  if (plan === 'super_admin') return 'Super Admin';
  return plan;
}

export default function PricingModal({ onClose }) {
  const { licenseKey, licenseInfo, setLicense, clearLicense, showToast } = useEmailStore();
  const [inputKey, setInputKey] = useState(licenseKey || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activate = async (e) => {
    e.preventDefault();
    const key = inputKey.trim();
    if (!key) {
      setError('Enter your Emailix license key.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/license/activate', { licenseKey: key });
      setLicense(key, data.license);
      showToast('Download license activated');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || 'License could not be activated';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="pricing-title">
      <div className="paywall-dialog">
        <div className="paywall-head">
          <div>
            <div className="paywall-kicker">Free builder. Paid downloads.</div>
            <h2 id="pricing-title">Emailix download plans</h2>
          </div>
          <button className="paywall-close" onClick={onClose} aria-label="Close pricing">Close</button>
        </div>

        <div className="plan-grid">
          {PLANS.map(plan => (
            <div className="plan-card" key={plan.id}>
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <h3>{plan.label}</h3>
              <div className="plan-price">
                <span>{plan.price}</span>
                <small>{plan.cadence}</small>
              </div>
              <p>{plan.note}</p>
              <button className="btn-export" onClick={() => showToast('Payment checkout is ready for your payment provider connection', 'error')}>
                Choose {plan.label}
              </button>
            </div>
          ))}
        </div>

        <form className="license-panel" onSubmit={activate}>
          <div>
            <h3>Already paid?</h3>
            <p>Paste your Emailix license key to unlock ZIP downloads on this browser.</p>
          </div>
          <div className="license-row">
            <input
              value={inputKey}
              onChange={e => setInputKey(e.target.value)}
              placeholder="EIX-XXXX-XXXX-XXXX-XXXX"
              autoComplete="off"
              spellCheck="false"
            />
            <button className="btn-save" type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Activate'}
            </button>
          </div>
          {licenseInfo?.plan && (
            <div className="license-note">
              Active {licensePlanLabel(licenseInfo.plan)} license. Downloads remain available
              {licenseInfo.expiresAt ? ` until ${new Date(licenseInfo.expiresAt).toLocaleDateString()}` : ' forever while this key remains active'}.
              <button type="button" className="legal-button" onClick={clearLicense}>Remove key</button>
            </div>
          )}
          {error && <div className="license-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}
