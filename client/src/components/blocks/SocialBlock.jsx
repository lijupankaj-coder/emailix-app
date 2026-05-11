const COLORS = { facebook:'#1877f2', twitter:'#000', instagram:'#e4405f', linkedin:'#0a66c2', youtube:'#ff0000', pinterest:'#bd081c', github:'#24292e', soundcloud:'#ff5500' };
const CHARS  = { facebook:'f', twitter:'𝕏', instagram:'◎', linkedin:'in', youtube:'▶', pinterest:'P', github:'⌥', soundcloud:'☁' };

export default function SocialBlock({ props, globalSettings }) {
  const { align, paddingTop, paddingBottom, paddingLeft, paddingRight, bgColor, iconSize, links = [] } = props;
  const flex = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  const sz = parseInt(iconSize) || 32;

  return (
    <div style={{ backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff', paddingTop, paddingBottom, paddingLeft, paddingRight }}>
      <div style={{ display: 'flex', justifyContent: flex, gap: 10, flexWrap: 'wrap' }}>
        {links.map((l, i) => (
          <a key={i} href={l.href} onClick={e => e.preventDefault()} title={l.label || l.platform}
            style={{ width: sz, height: sz, borderRadius: '50%', backgroundColor: COLORS[l.platform] || '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: sz * 0.38, fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>
            {CHARS[l.platform] || l.platform?.[0]?.toUpperCase() || '?'}
          </a>
        ))}
      </div>
    </div>
  );
}
