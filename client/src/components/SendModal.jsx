import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const SMTP_KEY = 'emailix-smtp-settings';

export default function SendModal({
  blocks,
  globalSettings,
  licenseKey,
  onClose,
  onRequireLicense,
  showToast,
}) {
  const savedSmtp = loadSmtpSettings();
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState(globalSettings.subject || '');
  const [fromName, setFromName] = useState(savedSmtp.fromName || 'Emailix');
  const [replyTo, setReplyTo] = useState('');
  const [sending, setSending] = useState(false);
  const [smtpStatus, setSmtpStatus] = useState({ loading: true, configured: false, from: '', maxRecipients: 200 });
  const [smtpSettings, setSmtpSettings] = useState({
    host: savedSmtp.host || '',
    port: savedSmtp.port || '587',
    secure: savedSmtp.secure || false,
    user: savedSmtp.user || '',
    pass: savedSmtp.pass || '',
    from: savedSmtp.from || '',
  });
  const [saveSmtp, setSaveSmtp] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const recipientCount = useMemo(() => parseRecipients(recipients).length, [recipients]);
  const hasUserSmtp = useMemo(() => {
    return Boolean(
      smtpSettings.host.trim() &&
      smtpSettings.port &&
      smtpSettings.user.trim() &&
      smtpSettings.pass.trim() &&
      smtpSettings.from.trim()
    );
  }, [smtpSettings]);
  const effectiveConfigured = hasUserSmtp || smtpStatus.configured;
  const effectiveFrom = smtpSettings.from.trim() || smtpStatus.from;

  useEffect(() => {
    let ignore = false;
    axios.get('/api/send/status')
      .then(({ data }) => {
        if (!ignore) setSmtpStatus({ loading: false, ...data });
      })
      .catch(() => {
        if (!ignore) setSmtpStatus({ loading: false, configured: false, from: '', maxRecipients: 200 });
      });
    return () => { ignore = true; };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!licenseKey) {
      onRequireLicense();
      return;
    }
    if (!blocks.length) {
      showToast('Add blocks before sending', 'error');
      return;
    }
    if (!recipientCount) {
      setError('Add at least one recipient email.');
      return;
    }
    if (!subject.trim()) {
      setError('Subject is required.');
      return;
    }
    if (!effectiveConfigured) {
      setError('Add SMTP settings for your sender email before sending.');
      return;
    }
    if (hasUserSmtp && saveSmtp) {
      localStorage.setItem(SMTP_KEY, JSON.stringify({ ...smtpSettings, fromName }));
    }

    setSending(true);
    setError('');
    setResult(null);
    try {
      const { data } = await axios.post('/api/send/bulk', {
        blocks,
        globalSettings,
        recipients,
        subject,
        fromName,
        replyTo,
        licenseKey,
        smtp: hasUserSmtp ? smtpSettings : undefined,
      }, { timeout: 120000 });

      setResult(data);
      if (data.failed) {
        showToast(`Sent ${data.sent}; ${data.failed} failed`, 'error');
      } else {
        showToast(`Sent to ${data.sent} recipients`);
      }
    } catch (err) {
      if (err.response?.status === 402) {
        onRequireLicense();
        showToast('Active Emailix plan required to send emails', 'error');
      }
      if (err.response?.status === 503) {
        setError('Add SMTP settings for your sender email before sending.');
      } else {
        setError(err.response?.data?.error || err.message || 'Send failed');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="paywall-overlay" role="dialog" aria-modal="true" aria-labelledby="send-title">
      <form className="send-dialog" onSubmit={handleSend}>
        <div className="paywall-head">
          <div>
            <div className="paywall-kicker">Paid member campaign send</div>
            <h2 id="send-title">Send email campaign</h2>
          </div>
          <button type="button" className="paywall-close" onClick={onClose}>Close</button>
        </div>

        <div className="send-grid">
          {effectiveConfigured && (
            <div className="send-ready send-field-wide">
              Sending from {effectiveFrom}. Limit: {smtpStatus.maxRecipients} recipients per campaign.
            </div>
          )}

          <div className="send-smtp send-field-wide">
            <div className="send-smtp-head">
              <div>
                <strong>Sender SMTP settings</strong>
                <span>Use the customer&apos;s own verified sender and SMTP provider.</span>
              </div>
              <label className="send-check">
                <input type="checkbox" checked={saveSmtp} onChange={e => setSaveSmtp(e.target.checked)} />
                Save
              </label>
            </div>
            <div className="send-grid send-smtp-grid">
              <label className="send-field">
                <span>SMTP host</span>
                <input value={smtpSettings.host} onChange={e => updateSmtp('host', e.target.value)} placeholder="smtp-relay.brevo.com" />
              </label>
              <label className="send-field">
                <span>Port</span>
                <input value={smtpSettings.port} onChange={e => updateSmtp('port', e.target.value)} placeholder="587" inputMode="numeric" />
              </label>
              <label className="send-field">
                <span>SMTP username</span>
                <input value={smtpSettings.user} onChange={e => updateSmtp('user', e.target.value)} placeholder="SMTP login" autoComplete="username" />
              </label>
              <label className="send-field">
                <span>SMTP password / key</span>
                <input value={smtpSettings.pass} onChange={e => updateSmtp('pass', e.target.value)} placeholder="SMTP key" type="password" autoComplete="current-password" />
              </label>
              <label className="send-field send-field-wide">
                <span>Verified sender email</span>
                <input value={smtpSettings.from} onChange={e => updateSmtp('from', e.target.value)} placeholder="hello@customer-domain.com" type="email" />
              </label>
              <label className="send-check send-field-wide">
                <input type="checkbox" checked={Boolean(smtpSettings.secure)} onChange={e => updateSmtp('secure', e.target.checked)} />
                Use SSL/TLS connection, usually only for port 465
              </label>
            </div>
          </div>

          <label className="send-field send-field-wide">
            <span>Recipients</span>
            <textarea
              value={recipients}
              onChange={e => setRecipients(e.target.value)}
              placeholder="client1@example.com, client2@example.com&#10;client3@example.com"
              rows={8}
            />
            <small>{recipientCount} unique recipient{recipientCount === 1 ? '' : 's'} ready.</small>
          </label>

          <label className="send-field">
            <span>Subject</span>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Campaign subject" />
          </label>

          <label className="send-field">
            <span>From name</span>
            <input value={fromName} onChange={e => setFromName(e.target.value)} placeholder="Your brand name" />
          </label>

          <label className="send-field send-field-wide">
            <span>Reply-to email</span>
            <input value={replyTo} onChange={e => setReplyTo(e.target.value)} placeholder="Optional reply address" type="email" />
          </label>
        </div>

        {error && <div className="send-error">{error}</div>}

        {result && (
          <div className={result.failed ? 'send-result send-result-warn' : 'send-result'}>
            Sent {result.sent} of {result.total} emails.
            {result.failed > 0 && (
              <div className="send-failures">
                {result.failures.map(item => (
                  <div key={item.email}>{item.email}: {item.error}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="send-footer">
          <button type="button" className="btn-save" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-export" disabled={sending || !recipientCount || !effectiveConfigured}>
            {sending ? 'Sending...' : `Send ${recipientCount || ''}`}
          </button>
        </div>
      </form>
    </div>
  );

  function updateSmtp(key, value) {
    setSmtpSettings(prev => ({ ...prev, [key]: value }));
  }
}

function parseRecipients(value) {
  const seen = new Set();
  return String(value || '')
    .split(/[\s,;]+/)
    .map(item => item.trim().toLowerCase())
    .filter(Boolean)
    .filter(item => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });
}

function loadSmtpSettings() {
  try {
    return JSON.parse(localStorage.getItem(SMTP_KEY) || '{}') || {};
  } catch {
    return {};
  }
}
