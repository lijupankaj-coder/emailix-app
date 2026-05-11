import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEmailStore } from '../store/useEmailStore';
import BlockRenderer from './blocks/BlockRenderer';

export default function CanvasBlock({ block, isSelected, isDragging }) {
  const { selectBlock, removeBlock, duplicateBlock, moveBlock } = useEmailStore();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`block-wrap ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={e => { e.stopPropagation(); selectBlock(block.id); }}
    >
      {/* Drag handle */}
      <div className="blk-drag-handle" {...attributes} {...listeners} onClick={e => e.stopPropagation()}>
        ⠿
      </div>

      {/* Inline edit hint (shown on selected text blocks) */}
      {isSelected && ['title','text','button'].includes(block.type) && (
        <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', background: 'rgba(59,130,246,0.85)', color: '#fff', fontSize: 10, padding: '2px 8px', borderRadius: 10, pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 5 }}>
          double-click to edit
        </div>
      )}

      {/* Action toolbar (top-right corner) */}
      <div className="blk-toolbar">
        <button className="blk-btn" onClick={e => { e.stopPropagation(); moveBlock(block.id, 'up'); }} title="Move up">↑</button>
        <button className="blk-btn" onClick={e => { e.stopPropagation(); moveBlock(block.id, 'down'); }} title="Move down">↓</button>
        <button className="blk-btn" onClick={e => { e.stopPropagation(); duplicateBlock(block.id); }} title="Duplicate">⎘</button>
        <button className="blk-btn del" onClick={e => { e.stopPropagation(); removeBlock(block.id); }} title="Delete">✕</button>
      </div>

      <BlockRenderer block={block} />
    </div>
  );
}
