export default function LogoBlock({ props, globalSettings }) {
  const { src, alt, link, logoWidth, align, bgColor, paddingTop, paddingBottom, paddingLeft, paddingRight, description } = props;
  const hasImg = src && !src.startsWith('data:0') && src !== 'placeholder' && src !== '';

  const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';
  const style = { width: logoWidth || '180px', height: 'auto', display: 'block', margin };

  const inner = hasImg ? (
    <img src={src} alt={alt || 'Logo'} style={style} />
  ) : (
    <div style={{
      ...style,
      height: 56,
      background: '#f3f4f6',
      border: '1px dashed #d1d5db',
      borderRadius: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: 12,
    }}>
      {description || 'Logo — upload in Properties →'}
    </div>
  );

  return (
    <div style={{
      backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff',
      paddingTop, paddingBottom, paddingLeft, paddingRight,
    }}>
      {link ? <a href={link} onClick={e => e.preventDefault()}>{inner}</a> : inner}
    </div>
  );
}
