export default function DividerBlock({ props, globalSettings }) {
  const { color, thickness, paddingTop, paddingBottom, paddingLeft, paddingRight, bgColor } = props;
  return (
    <div style={{ backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff', paddingTop, paddingBottom, paddingLeft, paddingRight }}>
      <hr style={{ border: 'none', borderTop: `${thickness || '1px'} solid ${color || '#e5e7eb'}`, margin: 0 }} />
    </div>
  );
}
