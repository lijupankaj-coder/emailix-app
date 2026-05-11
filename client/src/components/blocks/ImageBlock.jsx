export default function ImageBlock({ props, globalSettings }) {
  const { src, alt, link, width, align, paddingTop, paddingBottom, paddingLeft, paddingRight, bgColor, description } = props;
  const hasImg = src && src !== 'placeholder';
  const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';

  const imgStyle = { width: width || '100%', display: 'block', margin, maxWidth: '100%' };

  const inner = hasImg ? (
    <img src={src} alt={alt} style={imgStyle} />
  ) : (
    <div style={{
      ...imgStyle, height: 200,
      background: 'linear-gradient(135deg, #e8eaf6, #e3f2fd)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: 20,
      border: '2px dashed #d1d5db',
    }}>
      <span style={{ fontSize: 32, marginBottom: 8, opacity: 0.4 }}>⊡</span>
      {description
        ? <span style={{ fontSize: 12 }}>{description}</span>
        : <span>Image Placeholder<br /><span style={{ fontSize: 11, opacity: 0.7 }}>Upload or paste URL in Properties →</span></span>
      }
    </div>
  );

  return (
    <div style={{
      backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff',
      paddingTop, paddingBottom, paddingLeft, paddingRight,
    }}>
      {link && hasImg
        ? <a href={link} onClick={e => e.preventDefault()} target="_blank" rel="noopener noreferrer">{inner}</a>
        : inner
      }
    </div>
  );
}
