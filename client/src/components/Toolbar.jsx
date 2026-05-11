import { useState } from 'react';
import axios from 'axios';
import { useEmailStore } from '../store/useEmailStore';
import { generateMJML } from '../utils/mjmlGenerator';
import PreviewModal from './PreviewModal';
import PricingModal from './PricingModal';
import { hasActiveLicense } from '../utils/licenseAccess';

export default function Toolbar() {
  const {
    blocks, globalSettings, viewMode, licenseKey, licenseInfo,
    setViewMode, clearLicense, saveDraft, showToast,
  } = useEmailStore();

  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPricing, setShowPricing] = useState(false);
  const downloadUnlocked = hasActiveLicense(licenseKey, licenseInfo);

  const handlePreview = async () => {
    if (!blocks.length) return showToast('Add blocks first', 'error');
    try {
      const mjml = generateMJML(blocks, globalSettings);
      const { data } = await axios.post('/api/export', { mjml });
      setPreviewHtml(data.html);
      setShowPreview(true);
    } catch (err) {
      showToast('Preview failed: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleExportZip = async () => {
    if (!blocks.length) return showToast('Add blocks first', 'error');
    if (!licenseKey) {
      setShowPricing(true);
      return showToast('Download requires an Emailix plan', 'error');
    }

    try {
      const subject = globalSettings.subject || 'email';
      const res = await axios.post('/api/export/zip', {
        blocks,
        globalSettings,
        subject,
        licenseKey,
      }, {
        responseType: 'blob',
        timeout: 60000,
      });

      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      const safeName = subject.replace(/[^a-z0-9_-]/gi, '_') || 'email';
      a.download = `${safeName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('ZIP downloaded - check README.txt inside');
    } catch (err) {
      if (err.response?.status === 402) {
        setShowPricing(true);
        clearLicense();
        return showToast('Your Emailix license is missing or expired', 'error');
      }
      showToast('Download failed: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <div className="logo-icon">Ei</div>
          <div className="brand-copy">
            <div className="brand-name">Email<span>ix</span></div>
            <div className="brand-sub">Nebulix email studio</div>
          </div>
        </div>

        <div className="header-center">
          <div className="view-toggle">
            <button className={`view-toggle-btn ${viewMode === 'desktop' ? 'active' : ''}`} onClick={() => setViewMode('desktop')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              Desktop
            </button>
            <button className={`view-toggle-btn ${viewMode === 'mobile' ? 'active' : ''}`} onClick={() => setViewMode('mobile')}>
              <svg width="10" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/>
              </svg>
              Mobile
            </button>
          </div>
        </div>

        <div className="header-right">
          <a className="legal-link" href="/privacy.html" target="_blank" rel="noreferrer">Privacy</a>
          <a className="legal-link" href="/terms.html" target="_blank" rel="noreferrer">Terms</a>

          {licenseKey && (
            <button className="license-chip" onClick={() => setShowPricing(true)} title="Manage download license">
              {licenseInfo?.plan ? `${licenseInfo.plan} plan` : 'Licensed'}
            </button>
          )}

          <button
            className="btn-save"
            onClick={() => setShowPricing(true)}
            title="Download plans"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
            Pricing
          </button>

          {/* Preview */}
          <button className="btn-save" onClick={handlePreview}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            Preview
          </button>

          {/* Save Draft */}
          <button className="btn-save" onClick={saveDraft}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/>
            </svg>
            Save Draft
          </button>

          {/* Export ZIP */}
          <button className="btn-export" onClick={handleExportZip}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download ZIP
          </button>
        </div>
      </header>

      {showPreview && (
        <PreviewModal
          html={previewHtml}
          downloadUnlocked={downloadUnlocked}
          onClose={() => setShowPreview(false)}
          onExport={handleExportZip}
        />
      )}
      {showPricing && (
        <PricingModal onClose={() => setShowPricing(false)} />
      )}
    </>
  );
}
