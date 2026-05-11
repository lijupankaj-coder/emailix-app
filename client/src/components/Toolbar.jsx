import { useState, useRef } from 'react';
import axios from 'axios';
import { useEmailStore } from '../store/useEmailStore';
import { generateMJML } from '../utils/mjmlGenerator';
import PreviewModal from './PreviewModal';

export default function Toolbar() {
  const {
    blocks, globalSettings, viewMode, apiKey,
    setViewMode, setConverting, setBlocks, saveDraft, showToast,
  } = useEmailStore();

  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const fileRef = useRef();

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!apiKey) {
      showToast('Set your Anthropic API key in Settings (left panel, ⚙ tab)', 'error');
      return;
    }

    setConverting(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await axios.post('/api/convert', form, {
        headers: { 'x-api-key': apiKey },
        timeout: 120000,
      });
      setBlocks(data.blocks);
      showToast(`Imported ${data.blocks.length} blocks from ${file.name}`);
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      showToast(msg, 'error');
    } finally {
      setConverting(false);
    }
  };

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
    try {
      const subject = globalSettings.subject || 'email';
      const res = await axios.post('/api/export/zip', {
        blocks,
        globalSettings,
        subject,
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
      showToast('ZIP downloaded — check README.txt inside');
    } catch (err) {
      showToast('Export failed: ' + err.message, 'error');
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

          {/* Import Design */}
          <button
            className="btn-save"
            onClick={() => fileRef.current?.click()}
            title={apiKey ? 'Import PDF or Image' : 'Set API key in Settings first'}
            style={{ opacity: apiKey ? 1 : 0.5 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Import Design
          </button>
          <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleImport} />

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
            Export Template
          </button>
        </div>
      </header>

      {showPreview && (
        <PreviewModal html={previewHtml} onClose={() => setShowPreview(false)} onExport={handleExportZip} />
      )}
    </>
  );
}
