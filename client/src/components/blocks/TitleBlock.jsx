import { useState, useRef, useEffect } from 'react';
import { useEmailStore } from '../../store/useEmailStore';

export default function TitleBlock({ props, globalSettings, blockId }) {
  const { updateBlock } = useEmailStore();
  const { content, fontFamily, color, fontSize, fontWeight, align, paddingTop, paddingBottom, paddingLeft, paddingRight, bgColor } = props;
  const font = fontFamily === 'global' ? globalSettings.fontFamily : fontFamily;
  const [editing, setEditing] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (editing && ref.current) {
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
    if (ref.current) updateBlock(blockId, { content: ref.current.innerText });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { commit(); }
  };

  return (
    <div style={{
      backgroundColor: bgColor || globalSettings.emailAreaColor || '#ffffff',
      paddingTop, paddingBottom, paddingLeft, paddingRight,
    }}>
      <div
        ref={ref}
        contentEditable={editing}
        suppressContentEditableWarning
        onDoubleClick={() => setEditing(true)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        style={{
          color: color || '#1f2937',
          fontSize: fontSize || '28px',
          fontWeight: fontWeight || '700',
          textAlign: align || 'left',
          fontFamily: font,
          lineHeight: 1.25,
          outline: editing ? '2px solid #7C3AED' : 'none',
          borderRadius: 2,
          cursor: editing ? 'text' : 'default',
          minHeight: '1em',
          whiteSpace: 'pre-wrap',
        }}
      >
        {content || 'Your heading here...'}
      </div>
    </div>
  );
}
