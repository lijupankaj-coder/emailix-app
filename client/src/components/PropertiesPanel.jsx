import { useEmailStore } from '../store/useEmailStore';
import { FontPicker } from './BlockPalette';

// ── Shared field primitives ──────────────────────────────────────

function F({ label, children }) {
  return (
    <div className="pf">
      {label && <label className="pf-label">{label}</label>}
      {children}
    </div>
  );
}

function TextIn({ value, onChange, placeholder }) {
  return <input type="text" className="pf-input" value={value || ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} />;
}

function Textarea({ value, onChange, rows = 4 }) {
  return <textarea className="pf-input pf-textarea" rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />;
}

function Select({ value, onChange, options }) {
  return (
    <select className="pf-input pf-select" value={value || ''} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  );
}

function ColorIn({ value, onChange }) {
  return (
    <div className="pf-color-row">
      <input type="color" className="pf-color-swatch" value={value || '#000000'} onChange={e => onChange(e.target.value)} />
      <input type="text" className="pf-color-text" value={value || ''} placeholder="#000000" onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function PaddingGrid({ props, onChange }) {
  const fields = [
    { key: 'paddingTop',    label: 'TOP' },
    { key: 'paddingBottom', label: 'BOTTOM' },
    { key: 'paddingLeft',   label: 'LEFT' },
    { key: 'paddingRight',  label: 'RIGHT' },
  ];
  return (
    <div className="padding-grid">
      {fields.map(f => (
        <div key={f.key} className="padding-cell">
          <span className="padding-cell-label">{f.label}</span>
          <input
            type="text"
            value={props[f.key] || '0px'}
            onChange={e => onChange({ [f.key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}

function ImageUpload({ value, onChange }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <TextIn value={value?.startsWith('data:') ? '' : value} onChange={onChange} placeholder="https://..." />
      <label style={{ display: 'block', marginTop: 6, padding: '7px', border: '1px dashed var(--input-border)', borderRadius: 6, textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 11, transition: 'all 0.15s' }}>
        ↑ Upload image
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </label>
      {value && value !== 'placeholder' && (
        <img src={value} alt="" style={{ width: '100%', marginTop: 6, borderRadius: 4, maxHeight: 80, objectFit: 'cover' }} />
      )}
    </div>
  );
}

function LinkList({ value = [], onChange }) {
  const upd = (i, k, v) => onChange(value.map((x, j) => j === i ? { ...x, [k]: v } : x));
  const rem = (i) => onChange(value.filter((_, j) => j !== i));
  return (
    <div>
      {value.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <input className="pf-input" value={item.label || ''} placeholder="Label" onChange={e => upd(i, 'label', e.target.value)} />
            <input className="pf-input" value={item.href || ''} placeholder="https://..." onChange={e => upd(i, 'href', e.target.value)} />
          </div>
          <button onClick={() => rem(i)} style={{ width: 26, alignSelf: 'center', border: '1px solid var(--border)', borderRadius: 4, background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: 12 }}>✕</button>
        </div>
      ))}
      <button onClick={() => onChange([...value, { label: 'Link', href: '#' }])}
        style={{ width: '100%', padding: '6px', border: '1px dashed var(--border)', borderRadius: 6, background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', marginTop: 2 }}>
        + Add link
      </button>
    </div>
  );
}

function AlignButtons({ value, onChange }) {
  const opts = [
    { v: 'left',   label: 'Left',   svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg> },
    { v: 'center', label: 'Center', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg> },
    { v: 'right',  label: 'Right',  svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg> },
  ];
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {opts.map(o => (
        <button key={o.v} title={o.label} onClick={() => onChange(o.v)} style={{
          flex: 1, padding: '7px 0', border: `1px solid ${value === o.v ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 5, background: value === o.v ? 'var(--accent-bg)' : 'var(--input-bg)',
          color: value === o.v ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.12s',
        }}>{o.svg}</button>
      ))}
    </div>
  );
}

const SOCIAL_PLATFORMS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'pinterest', 'github', 'soundcloud'];

// ── Per-block editors ────────────────────────────────────────────

function LogoProps({ props, update, globalSettings }) {
  return (<>
    <F label="Logo Image"><ImageUpload value={props.src} onChange={v => update({ src: v })} /></F>
    <F label="Alt Text"><TextIn value={props.alt} onChange={v => update({ alt: v })} placeholder="Company Logo" /></F>
    <F label="Logo Width"><TextIn value={props.logoWidth} onChange={v => update({ logoWidth: v })} placeholder="180px" /></F>
    <F label="Link URL"><TextIn value={props.link} onChange={v => update({ link: v })} placeholder="https://..." /></F>
    <F label="Alignment"><AlignButtons value={props.align} onChange={v => update({ align: v })} /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
  </>);
}

function TitleProps({ props, update, globalSettings }) {
  return (<>
    <F label="Text Content"><Textarea value={props.content} onChange={v => update({ content: v })} rows={3} /></F>
    <F label="Font Family">
      <FontPicker value={props.fontFamily} onChange={v => update({ fontFamily: v })} globalFontName={globalSettings?.fontFamily || 'Outfit'} />
    </F>
    <F label="Text Color"><ColorIn value={props.color} onChange={v => update({ color: v })} /></F>
    <F label="Font Size"><TextIn value={props.fontSize} onChange={v => update({ fontSize: v })} placeholder="28px" /></F>
    <F label="Alignment"><AlignButtons value={props.align} onChange={v => update({ align: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
  </>);
}

function TextProps({ props, update, globalSettings }) {
  return (<>
    <F label="HTML Content"><Textarea value={props.content} onChange={v => update({ content: v })} rows={5} /></F>
    <F label="Font Family">
      <FontPicker value={props.fontFamily} onChange={v => update({ fontFamily: v })} globalFontName={globalSettings?.fontFamily || 'Outfit'} />
    </F>
    <F label="Text Color"><ColorIn value={props.color} onChange={v => update({ color: v })} /></F>
    <F label="Font Size"><TextIn value={props.fontSize} onChange={v => update({ fontSize: v })} placeholder="15px" /></F>
    <F label="Line Height"><Select value={props.lineHeight} onChange={v => update({ lineHeight: v })} options={['1.2','1.4','1.5','1.6','1.7','1.8','2.0']} /></F>
    <F label="Alignment"><AlignButtons value={props.align} onChange={v => update({ align: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
  </>);
}

function ImageProps({ props, update }) {
  return (<>
    <F label="Image"><ImageUpload value={props.src} onChange={v => update({ src: v })} /></F>
    <F label="Alt Text"><TextIn value={props.alt} onChange={v => update({ alt: v })} placeholder="Description" /></F>
    <F label="Link URL"><TextIn value={props.link} onChange={v => update({ link: v })} placeholder="https://..." /></F>
    <F label="Width"><TextIn value={props.width} onChange={v => update({ width: v })} placeholder="100%" /></F>
    <F label="Alignment"><AlignButtons value={props.align} onChange={v => update({ align: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
  </>);
}

function ButtonProps({ props, update }) {
  return (<>
    <F label="Button Label"><TextIn value={props.label} onChange={v => update({ label: v })} /></F>
    <F label="Link URL"><TextIn value={props.href} onChange={v => update({ href: v })} placeholder="https://..." /></F>
    <F label="Button Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
    <F label="Text Color"><ColorIn value={props.textColor} onChange={v => update({ textColor: v })} /></F>
    <F label="Border Radius">
      <Select value={props.borderRadius} onChange={v => update({ borderRadius: v })} options={['0px','4px','6px','8px','12px','20px','50px']} />
    </F>
    <F label="Font Size"><TextIn value={props.fontSize} onChange={v => update({ fontSize: v })} placeholder="14px" /></F>
    <F label="Alignment"><AlignButtons value={props.align} onChange={v => update({ align: v })} /></F>
    <F label="Button Padding V"><TextIn value={props.btnPaddingV} onChange={v => update({ btnPaddingV: v })} placeholder="12px" /></F>
    <F label="Button Padding H"><TextIn value={props.btnPaddingH} onChange={v => update({ btnPaddingH: v })} placeholder="28px" /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
    <F label="Section BG Color"><ColorIn value={props.blockBgColor} onChange={v => update({ blockBgColor: v })} /></F>
  </>);
}

function DividerProps({ props, update }) {
  return (<>
    <F label="Color"><ColorIn value={props.color} onChange={v => update({ color: v })} /></F>
    <F label="Thickness"><Select value={props.thickness} onChange={v => update({ thickness: v })} options={['1px','2px','3px','4px']} /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
  </>);
}

function SpacerProps({ props, update }) {
  return (<>
    <F label="Height"><TextIn value={props.height} onChange={v => update({ height: v })} placeholder="32px" /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
  </>);
}

function SocialProps({ props, update }) {
  return (<>
    <F label="Alignment"><AlignButtons value={props.align} onChange={v => update({ align: v })} /></F>
    <F label="Icon Size">
      <Select value={props.iconSize} onChange={v => update({ iconSize: v })} options={['24px','28px','32px','36px','40px','48px']} />
    </F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
    <hr className="props-divider" />
    <div className="props-section-label" style={{ marginBottom: 8 }}>Social Links</div>
    {(props.links || []).map((link, i) => (
      <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <select className="pf-input pf-select" value={link.platform || 'facebook'}
            onChange={e => update({ links: props.links.map((x, j) => j === i ? { ...x, platform: e.target.value } : x) })}>
            {SOCIAL_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input className="pf-input" value={link.href || ''} placeholder="https://..."
            onChange={e => update({ links: props.links.map((x, j) => j === i ? { ...x, href: e.target.value } : x) })} />
        </div>
        <button onClick={() => update({ links: props.links.filter((_, j) => j !== i) })}
          style={{ width: 26, alignSelf: 'center', border: '1px solid var(--border)', borderRadius: 4, background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: 12 }}>✕</button>
      </div>
    ))}
    <button onClick={() => update({ links: [...(props.links || []), { platform: 'twitter', href: '#', label: '' }] })}
      style={{ width: '100%', padding: '6px', border: '1px dashed var(--border)', borderRadius: 6, background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>
      + Add social
    </button>
  </>);
}

function VideoProps({ props, update }) {
  return (<>
    <F label="Video URL"><TextIn value={props.videoUrl} onChange={v => update({ videoUrl: v })} placeholder="https://youtube.com/..." /></F>
    <F label="Thumbnail Image"><ImageUpload value={props.thumbnailSrc} onChange={v => update({ thumbnailSrc: v })} /></F>
    <F label="Alt Text"><TextIn value={props.alt} onChange={v => update({ alt: v })} placeholder="Watch Video" /></F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
  </>);
}

function ColumnsProps({ props, update }) {
  const setCount = (n) => {
    const cur = props.columns || [];
    const cols = Array.from({ length: n }, (_, i) => cur[i] || {
      width: `${Math.round(100 / n)}%`,
      content: `<p><strong>Column ${i + 1}</strong></p>`,
      color: '#374151', fontSize: '14px',
    });
    update({ columns: cols });
  };
  const updCol = (i, k, v) => update({ columns: (props.columns || []).map((c, j) => j === i ? { ...c, [k]: v } : c) });

  return (<>
    <F label="Column Count">
      <div style={{ display: 'flex', gap: 4 }}>
        {[2, 3].map(n => (
          <button key={n} onClick={() => setCount(n)}
            style={{ flex: 1, padding: '6px', border: `1px solid ${(props.columns || []).length === n ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 5, background: (props.columns || []).length === n ? 'rgba(59,130,246,0.15)' : 'var(--input-bg)', color: (props.columns || []).length === n ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>
            {n} Col
          </button>
        ))}
      </div>
    </F>
    <F label="Background Color"><ColorIn value={props.bgColor} onChange={v => update({ bgColor: v })} /></F>
    <hr className="props-divider" />
    <F label="Padding"><PaddingGrid props={props} onChange={update} /></F>
    {(props.columns || []).map((col, i) => (
      <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 8, marginTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-dim)', marginBottom: 8 }}>Column {i + 1}</div>
        <F label="HTML"><textarea className="pf-input pf-textarea" rows={3} value={col.content || ''} onChange={e => updCol(i, 'content', e.target.value)} /></F>
        <F label="Text Color"><ColorIn value={col.color} onChange={v => updCol(i, 'color', v)} /></F>
        <F label="Font Size"><TextIn value={col.fontSize} onChange={v => updCol(i, 'fontSize', v)} placeholder="14px" /></F>
      </div>
    ))}
  </>);
}

// ── Block type → editor + label map ─────────────────────────────
const EDITORS = {
  logo:    { editor: LogoProps,    label: 'Logo Properties' },
  title:   { editor: TitleProps,   label: 'Title Properties' },
  text:    { editor: TextProps,    label: 'Text Properties' },
  image:   { editor: ImageProps,   label: 'Image Properties' },
  button:  { editor: ButtonProps,  label: 'Button Properties' },
  divider: { editor: DividerProps, label: 'Divider Properties' },
  spacer:  { editor: SpacerProps,  label: 'Spacer Properties' },
  social:  { editor: SocialProps,  label: 'Social Properties' },
  video:   { editor: VideoProps,   label: 'Video Properties' },
  columns: { editor: ColumnsProps, label: 'Columns Properties' },
};

// ── Main panel ───────────────────────────────────────────────────
export default function PropertiesPanel() {
  const { blocks, selectedId, updateBlock, selectBlock, globalSettings } = useEmailStore();
  const block = blocks.find(b => b.id === selectedId);

  if (!block) {
    return (
      <div className="props-panel">
        <div className="props-header">
          <span className="props-title">Properties</span>
        </div>
        <div className="props-body">
          <div className="props-empty">
            <div className="icon">↖</div>
            <div style={{ fontSize: 11, lineHeight: 1.5 }}>Select a block on the canvas to edit its properties</div>
          </div>
        </div>
      </div>
    );
  }

  const meta = EDITORS[block.type];
  const Editor = meta?.editor;
  const update = (p) => updateBlock(block.id, p);

  return (
    <div className="props-panel">
      <div className="props-header">
        <span className="props-title">Properties</span>
        <button className="props-close" onClick={() => selectBlock(null)} title="Close">✕</button>
      </div>
      <div className="props-body">
        <div className="props-section-label">{meta?.label?.toUpperCase() || `${block.type.toUpperCase()} PROPERTIES`}</div>
        {Editor ? <Editor props={block.props} update={update} globalSettings={globalSettings} /> : null}
      </div>
    </div>
  );
}
