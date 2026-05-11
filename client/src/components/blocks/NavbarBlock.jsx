export default function NavbarBlock({ props }) {
  const { bgColor, padding, logoSrc, logoAlt, logoWidth, links = [], linkColor, fontSize } = props;

  return (
    <div style={{ backgroundColor: bgColor, padding, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
      {logoSrc && logoSrc !== 'placeholder' ? (
        <img src={logoSrc} alt={logoAlt} style={{ width: logoWidth, height: 'auto', display: 'block' }} />
      ) : (
        <div style={{ width: logoWidth, height: 36, background: '#e8e8e8', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#aaa' }}>
          Logo
        </div>
      )}
      <nav style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {links.map((link, i) => (
          <a key={i} href={link.href} style={{ color: linkColor, fontSize, textDecoration: 'none', fontWeight: 500 }}
             onClick={e => e.preventDefault()}>
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
