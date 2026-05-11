import { useState, useRef, useEffect } from 'react';
import { useEmailStore } from '../../store/useEmailStore';

export default function TextBlock({ props, globalSettings, blockId }) {
  const { updateBlock } = useEmailStore();
  const { content, fontFamily, color, fontSize, lineHeight, align, paddingTop, paddingBottom, paddingLeft, paddingRight, bgColor } = props;
  const font = fontFamily === 'global' ? globalSettings.fontFamily : fontFamily;
  const [editing, setEditing] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.innerHTML = content || '';
      ref.current.focus();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [editing]);

  const commit = () => {
    if (ref.current) updateBlock(blockId, { content: ref.current.innerHTML });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { commit(); }
  };

  const baseStyle = {
    color: color || '#374151',
    fontSize: fontSize || '15px',
    lineHeight: lineHeight || 1.6,
    textAlign: align || 'left',
    fontFamily: font,
    outline: editing ? '2px solid #7C3AED' : 'none',
    borderRadius: 2,
    cursor: editing ? 'text' : 'default',
    minHeight: '1em',
  };

  return (
    <div style={{
      backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff',
      paddingTop, paddingBottom, paddingLeft, paddingRight,
    }}>
      {editing ? (
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onBlur={commit}
          onKeyDown={handleKeyDown}
          style={baseStyle}
        />
      ) : (
        <div
          style={baseStyle}
          onDoubleClick={() => setEditing(true)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
