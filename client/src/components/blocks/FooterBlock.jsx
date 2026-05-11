export default function FooterBlock({ props }) {
  const { content, bgColor, textColor, fontSize, padding, align, links = [] } = props;

  return (
    <div style={{ backgroundColor: bgColor, padding, textAlign: align }}>
      <div
        style={{ color: textColor, fontSize, lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {links.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {links.map((link, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: textColor, opacity: 0.5, margin: '0 8px' }}>|</span>}
              <a
                href={link.href}
                onClick={e => e.preventDefault()}
                style={{ color: textColor, fontSize, textDecoration: 'underline' }}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
