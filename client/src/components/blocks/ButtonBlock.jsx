import { useState, useRef, useEffect } from 'react';
import { useEmailStore } from '../../store/useEmailStore';

export default function ButtonBlock({ props, globalSettings, blockId }) {
  const { updateBlock } = useEmailStore();
  const { label, href, bgColor, textColor, borderRadius, fontSize, fontWeight, align, paddingTop, paddingBottom, paddingLeft, paddingRight, blockBgColor, btnPaddingV, btnPaddingH } = props;
  const flex = align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start';
  const [editing, setEditing] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }, [editing]);

  const commit = () => {
    if (ref.current) updateBlock(blockId, { label: ref.current.innerText });
    setEditing(false);
  };

  return (
    <div style={{
      backgroundColor: blockBgColor || globalSettings.emailAreaColor || '#ffffff',
      paddingTop, paddingBottom, paddingLeft, paddingRight,
      display: 'flex', justifyContent: flex,
    }}>
      <span
        ref={ref}
        contentEditable={editing}
        suppressContentEditableWarning
        onDoubleClick={() => setEditing(true)}
        onBlur={commit}
        onKeyDown={e => e.key === 'Escape' && commit()}
        style={{
          display: 'inline-block',
          backgroundColor: bgColor || '#7C3AED',
          color: textColor || '#ffffff',
          padding: `${btnPaddingV || '12px'} ${btnPaddingH || '28px'}`,
          borderRadius: borderRadius || '6px',
          fontSize: fontSize || '14px',
          fontWeight: fontWeight || '600',
          textDecoration: 'none',
          fontFamily: globalSettings.fontFamily,
          lineHeight: 1,
          cursor: editing ? 'text' : 'pointer',
          outline: editing ? '2px solid rgba(255,255,255,0.6)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label || 'Click Here'}
      </span>
    </div>
  );
}
