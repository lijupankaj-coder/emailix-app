export default function VideoBlock({ props, globalSettings }) {
  const { videoUrl, thumbnailSrc, alt, paddingTop, paddingBottom, paddingLeft, paddingRight, bgColor, description } = props;
  const hasThumb = thumbnailSrc && thumbnailSrc !== 'placeholder';

  return (
    <div style={{ backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff', paddingTop, paddingBottom, paddingLeft, paddingRight }}>
      <div style={{ position: 'relative', width: '100%' }}>
        {hasThumb ? (
          <img src={thumbnailSrc} alt={alt} style={{ width: '100%', display: 'block' }} />
        ) : (
          <div style={{
            width: '100%', height: 220,
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#64748b', fontSize: 13, textAlign: 'center', padding: 20,
            border: '2px dashed #334155',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: '2px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#7C3AED', marginBottom: 12 }}>▶</div>
            {description
              ? <span style={{ fontSize: 12 }}>{description}</span>
              : <span>Video Block<br /><span style={{ fontSize: 11, opacity: 0.6 }}>Add thumbnail URL and video link in Properties →</span></span>
            }
          </div>
        )}
        {/* Play overlay shown on top of thumbnail */}
        {hasThumb && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff' }}>▶</div>
          </div>
        )}
      </div>
    </div>
  );
}
