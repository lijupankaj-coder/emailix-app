export default function HeroBlock({ props }) {
  const { bgColor, bgImage, title, subtitle, titleColor, subtitleColor, align, titleSize, subtitleSize, padding } = props;

  const style = {
    backgroundColor: bgColor,
    backgroundImage: bgImage && bgImage !== 'placeholder' ? `url(${bgImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding,
    textAlign: align,
  };

  return (
    <div style={style}>
      <h1 style={{ color: titleColor, fontSize: titleSize, fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ color: subtitleColor, fontSize: subtitleSize, marginTop: 15, marginBottom: 0, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
