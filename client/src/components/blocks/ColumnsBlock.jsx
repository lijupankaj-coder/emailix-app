export default function ColumnsBlock({ props, globalSettings }) {
  const { bgColor, paddingTop, paddingBottom, paddingLeft, paddingRight, columns = [] } = props;

  return (
    <div style={{
      backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff',
      paddingTop, paddingBottom, paddingLeft, paddingRight,
    }}>
      <div style={{ display: 'flex' }}>
        {columns.map((col, i) => (
          <div
            key={i}
            style={{
              width: col.width,
              backgroundColor: col.bgColor || 'transparent',
              padding: '0 8px',
              boxSizing: 'border-box',
              fontSize: col.fontSize || '14px',
              color: col.color || '#374151',
              lineHeight: 1.6,
              fontFamily: globalSettings.fontFamily,
            }}
            dangerouslySetInnerHTML={{ __html: col.content || '<p>&nbsp;</p>' }}
          />
        ))}
      </div>
    </div>
  );
}
