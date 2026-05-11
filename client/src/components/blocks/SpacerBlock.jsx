export default function SpacerBlock({ props, globalSettings }) {
  const { height, bgColor } = props;
  return (
    <div style={{ backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff', height: height || '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#d1d5db', fontSize: 9, userSelect: 'none', letterSpacing: 1 }}>SPACER · {height}</span>
    </div>
  );
}
