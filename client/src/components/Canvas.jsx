import { useEmailStore } from '../store/useEmailStore';
import CanvasBlock from './CanvasBlock';

export default function Canvas({ draggingId }) {
  const { blocks, selectedId, selectBlock, viewMode, globalSettings } = useEmailStore();

  const emailWidth = viewMode === 'mobile' ? 375 : globalSettings.width;

  return (
    <div
      className="canvas-area"
      style={{ background: globalSettings.backgroundColor || '#f1f5f9' }}
      onClick={() => selectBlock(null)}
    >
      <div className="canvas-scroll">
        <div
          className="canvas-email"
          style={{
            width: emailWidth,
            background: globalSettings.emailAreaColor || '#ffffff',
          }}
        >
          {blocks.length === 0 ? (
            <div className="canvas-empty" style={{ width: emailWidth }}>
              <div className="e-icon">✉</div>
              <h3>Start building your email</h3>
              <p>Click any module on the left to add it here,<br />or import a PDF / image design.</p>
            </div>
          ) : (
            blocks.map(block => (
              <CanvasBlock
                key={block.id}
                block={block}
                isSelected={block.id === selectedId}
                isDragging={block.id === draggingId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
