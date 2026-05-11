import { useEffect, useRef, useState } from 'react';

export default function PreviewModal({ html, onClose, onExport }) {
  const iframeRef = useRef();
  const [mode, setMode] = useState('desktop');

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(html); doc.close();
    const style = doc.createElement('style');
    style.textContent = 'html,body,*{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}';
    doc.head?.appendChild(style);

    const blockCapture = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const blockShortcut = (event) => {
      const key = String(event.key || '').toLowerCase();
      const blocked =
        key === 'printscreen' ||
        ((event.metaKey || event.ctrlKey) && key === 'p') ||
        ((event.metaKey || event.ctrlKey) && event.shiftKey && ['3', '4', '5', 's'].includes(key));
      if (blocked) blockCapture(event);
    };
    const view = doc.defaultView;
    doc.addEventListener('contextmenu', blockCapture, true);
    doc.addEventListener('copy', blockCapture, true);
    doc.addEventListener('cut', blockCapture, true);
    doc.addEventListener('dragstart', blockCapture, true);
    view?.addEventListener('keydown', blockShortcut, true);
    view?.addEventListener('keyup', blockShortcut, true);
    return () => {
      doc.removeEventListener('contextmenu', blockCapture, true);
      doc.removeEventListener('copy', blockCapture, true);
      doc.removeEventListener('cut', blockCapture, true);
      doc.removeEventListener('dragstart', blockCapture, true);
      view?.removeEventListener('keydown', blockShortcut, true);
      view?.removeEventListener('keyup', blockShortcut, true);
    };
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
          <button className="btn-export" onClick={onExport}>Download ZIP</button>
          <button onClick={onClose} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: 12 }}>Close</button>
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
