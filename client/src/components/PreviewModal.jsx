import { useEffect, useRef, useState } from 'react';

export default function PreviewModal({ html, onClose, onExport }) {
  const iframeRef = useRef();
  const [mode, setMode] = useState('desktop');

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(html); doc.close();
  }, [html]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const widths = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <span className="modal-title">Email Preview</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['desktop','tablet','mobile'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 5, background: mode === m ? 'var(--accent)' : 'transparent', color: mode === m ? '#fff' : 'var(--text-muted)', cursor: 'pointer', fontSize: 11 }}>
              {m}
            </button>
          ))}
        </div>
        <div className="modal-actions">
          <button className="btn-export" onClick={onExport}>↓ Export HTML</button>
          <button onClick={onClose} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: 12 }}>✕ Close</button>
        </div>
      </div>
      <div className="modal-body">
        <iframe
          ref={iframeRef}
          title="Preview"
          style={{ width: widths[mode], height: '100%', minHeight: 500, transition: 'width 0.3s' }}
        />
      </div>
    </div>
  );
}
