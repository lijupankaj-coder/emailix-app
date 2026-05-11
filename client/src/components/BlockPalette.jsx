import { useState } from 'react';
import { useEmailStore } from '../store/useEmailStore';
import { CONTENT_MODULES, PREBUILT_ROWS, STARTER_TEMPLATES, getStarterTemplate } from '../utils/blockDefaults';
import { GOOGLE_FONTS, SYSTEM_FONTS } from '../utils/googleFonts';

// ── Font picker with search ─────────────────────────────────────
function FontPicker({ value, onChange, globalFontName }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const displayLabel = value === 'global'
    ? `Global Font (${globalFontName})`
    : value || 'Select font';

  const allFonts = [
    { group: 'System', fonts: SYSTEM_FONTS },
    { group: 'Google Fonts', fonts: GOOGLE_FONTS },
  ];

  const filtered = search.trim()
    ? [...SYSTEM_FONTS, ...GOOGLE_FONTS].filter(f => f.toLowerCase().includes(search.toLowerCase()))
    : null;

  const pick = (font) => { onChange(font); setOpen(false); setSearch(''); };

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="pf-input pf-select"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        onClick={() => setOpen(v => !v)}
      >
        {displayLabel}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200,
          background: 'var(--input-bg)', border: '1px solid var(--border)',
          borderRadius: 6, marginTop: 2, boxShadow: '0 4px 20px rgba(0,0,0,.5)',
          maxHeight: 240, display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <input
              autoFocus
              className="pf-input"
              style={{ margin: 0, fontSize: 11 }}
              placeholder="Search fonts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {/* Global option */}
            {!search && (
              <div onClick={() => pick('global')} style={{
                padding: '7px 10px', cursor: 'pointer', fontSize: 12,
                color: value === 'global' ? 'var(--accent)' : 'var(--text)',
                background: value === 'global' ? 'var(--accent-bg)' : 'transparent',
                borderBottom: '1px solid var(--border)',
              }}>
                Global Font ({globalFontName})
              </div>
            )}
            {filtered
              ? filtered.map(f => (
                  <div key={f} onClick={() => pick(f)} style={{
                    padding: '7px 10px', cursor: 'pointer', fontSize: 12,
                    color: value === f ? 'var(--accent)' : 'var(--text)',
                    background: value === f ? 'var(--accent-bg)' : 'transparent',
                  }}>{f}</div>
                ))
              : allFonts.map(({ group, fonts }) => (
                  <div key={group}>
                    <div style={{ padding: '5px 10px 3px', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: 0.8 }}>{group}</div>
                    {fonts.map(f => (
                      <div key={f} onClick={() => pick(f)} style={{
                        padding: '6px 10px 6px 18px', cursor: 'pointer', fontSize: 12,
                        color: value === f ? 'var(--accent)' : 'var(--text)',
                        background: value === f ? 'var(--accent-bg)' : 'transparent',
                      }}>{f}</div>
                    ))}
                  </div>
                ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ── Row preview SVGs ────────────────────────────────────────────
function RowPreview({ type }) {
  const svgs = {
    'logo-header': <><rect x="20" y="16" width="30" height="16" rx="2" fill="#4b5563"/></>,
    'image': <><rect x="4" y="4" width="62" height="40" rx="2" fill="#374151" /></>,
    'title-text-btn': (<>
      <rect x="10" y="6" width="50" height="7" rx="2" fill="#4b5563" />
      <rect x="6" y="17" width="58" height="4" rx="1" fill="#374151" />
      <rect x="6" y="24" width="58" height="4" rx="1" fill="#374151" />
      <rect x="20" y="34" width="30" height="9" rx="3" fill="#7C3AED" />
    </>),
    'title-text': (<>
      <rect x="12" y="8" width="46" height="8" rx="2" fill="#4b5563" />
      <rect x="6" y="20" width="58" height="4" rx="1" fill="#374151" />
      <rect x="6" y="28" width="58" height="4" rx="1" fill="#374151" />
      <rect x="10" y="36" width="50" height="4" rx="1" fill="#374151" />
    </>),
    '2col': (<>
      <rect x="4" y="8" width="28" height="32" rx="2" fill="#374151" />
      <rect x="38" y="8" width="28" height="32" rx="2" fill="#374151" />
    </>),
    '3col': (<>
      <rect x="4" y="10" width="17" height="28" rx="2" fill="#374151" />
      <rect x="26" y="10" width="18" height="28" rx="2" fill="#374151" />
      <rect x="49" y="10" width="17" height="28" rx="2" fill="#374151" />
    </>),
    'img-text': (<>
      <rect x="4" y="8" width="24" height="32" rx="2" fill="#4b5563" />
      <rect x="34" y="10" width="32" height="4" rx="1" fill="#374151" />
      <rect x="34" y="18" width="32" height="4" rx="1" fill="#374151" />
      <rect x="34" y="26" width="32" height="4" rx="1" fill="#374151" />
      <rect x="34" y="34" width="18" height="6" rx="2" fill="#7C3AED" />
    </>),
    'text-img': (<>
      <rect x="4" y="10" width="32" height="4" rx="1" fill="#374151" />
      <rect x="4" y="18" width="32" height="4" rx="1" fill="#374151" />
      <rect x="4" y="26" width="24" height="4" rx="1" fill="#374151" />
      <rect x="42" y="8" width="24" height="32" rx="2" fill="#4b5563" />
    </>),
  };
  return (
    <svg viewBox="0 0 70 48" width="70" height="48">
      {svgs[type] || svgs['image']}
    </svg>
  );
}

// ── Color field ─────────────────────────────────────────────────
function ColorRow({ value, onChange }) {
  return (
    <div className="s-color-row">
      <input type="color" className="s-color-swatch" value={value || '#ffffff'} onChange={e => onChange(e.target.value)} />
      <input type="text" className="s-color-text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="#ffffff" />
    </div>
  );
}

// ── Global Settings panel ────────────────────────────────────────
function GlobalSettings() {
  const { globalSettings, updateGlobalSettings: u } = useEmailStore();

  return (
    <div className="settings-body">
      {/* Width slider */}
      <div className="setting-field">
        <div className="setting-label">Content Width</div>
        <div className="width-slider-row">
          <input type="range" className="width-slider" min={480} max={700} step={10}
            value={globalSettings.width} onChange={e => u({ width: Number(e.target.value) })} />
          <span className="width-value">{globalSettings.width}px</span>
        </div>
      </div>

      <div className="setting-field">
        <div className="setting-label">Alignment</div>
        <select className="s-select" value={globalSettings.alignment} onChange={e => u({ alignment: e.target.value })}>
          {['left','center','right'].map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
        </select>
      </div>

      <div className="setting-field">
        <div className="setting-label">Background Color</div>
        <ColorRow value={globalSettings.backgroundColor} onChange={v => u({ backgroundColor: v })} />
      </div>

      <div className="setting-field">
        <div className="setting-label">Email Area Color</div>
        <ColorRow value={globalSettings.emailAreaColor} onChange={v => u({ emailAreaColor: v })} />
      </div>

      <div className="setting-field">
        <div className="setting-label">Global Font Family</div>
        <FontPicker
          value={globalSettings.fontFamily}
          onChange={v => u({ fontFamily: v === 'global' ? 'Inter' : v })}
          globalFontName={globalSettings.fontFamily}
        />
      </div>

      <div className="setting-field">
        <div className="setting-label">Link Color</div>
        <ColorRow value={globalSettings.linkColor} onChange={v => u({ linkColor: v })} />
      </div>

      <div className="setting-field">
        <div className="setting-label">Subject / Preview Text</div>
        <input className="s-input" placeholder="Email subject..." value={globalSettings.subject || ''} onChange={e => u({ subject: e.target.value })} />
        <input className="s-input" style={{ marginTop: 4 }} placeholder="Preview text..." value={globalSettings.previewText || ''} onChange={e => u({ previewText: e.target.value })} />
      </div>
    </div>
  );
}

// ── Main palette ─────────────────────────────────────────────────
export default function BlockPalette() {
  const [activeTab, setActiveTab] = useState('build');
  const { addBlock, addBlocks, setBlocks, blocks, updateGlobalSettings, showToast } = useEmailStore();

  const loadTemplate = (key) => {
    if (blocks.length > 0 && !confirm('Replace canvas with this template?')) return;
    const tpl = getStarterTemplate(key);
    setBlocks(tpl.blocks || []);
    if (tpl.settings) updateGlobalSettings(tpl.settings);
    showToast('Template loaded');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tabs">
        <button className={`sidebar-tab-btn ${activeTab === 'build' ? 'active' : ''}`} onClick={() => setActiveTab('build')} title="Build Email">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        </button>
        <button className={`sidebar-tab-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title="Global Settings">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M4.93 4.93a10 10 0 0 0 14.14 14.14"/>
          </svg>
        </button>
      </div>

      <div className="sidebar-content">
        {activeTab === 'build' ? (
          <>
            <div className="section-label">1. Templates</div>
            <div className="templates-strip">
              {STARTER_TEMPLATES.map(t => (
                <button key={t.key} className="tpl-chip" onClick={() => loadTemplate(t.key)}>{t.label}</button>
              ))}
            </div>

            <div className="section-label">2. Content Modules</div>
            <div className="modules-grid">
              {CONTENT_MODULES.map(({ type, label, icon }) => (
                <button key={type} className="module-card" onClick={() => addBlock(type)} title={`Add ${label}`}>
                  <span className="module-icon">{icon}</span>
                  <span className="module-label">{label}</span>
                </button>
              ))}
            </div>

            <div className="section-label">3. Pre-built Rows</div>
            <div className="rows-list">
              {PREBUILT_ROWS.map(row => (
                <button key={row.id} className="row-card" onClick={() => addBlocks(row.blocks())} title={row.label}>
                  <div className="row-preview"><RowPreview type={row.preview} /></div>
                  <span className="row-label">{row.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="panel-header">Global Settings</div>
            <GlobalSettings />
          </>
        )}
      </div>
    </div>
  );
}

export { FontPicker };
