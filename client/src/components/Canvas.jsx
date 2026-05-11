import { useEmailStore } from '../store/useEmailStore';
import CanvasBlock from './CanvasBlock';
import { hasActiveLicense } from '../utils/licenseAccess';

const WATERMARK_TILES = Array.from({ length: 30 }, (_, i) => i);

export default function Canvas({ draggingId }) {
  const { blocks, selectedId, selectBlock, viewMode, globalSettings, licenseKey, licenseInfo } = useEmailStore();

  const emailWidth = viewMode === 'mobile' ? 375 : globalSettings.width;
  const downloadUnlocked = hasActiveLicense(licenseKey, licenseInfo);
  const showWatermark = blocks.length > 0 && !downloadUnlocked;

  return (
    <div
      className="canvas-area"
      style={{ background: globalSettings.backgroundColor || '#f1f5f9' }}
      onClick={() => selectBlock(null)}
    >
      <div className="canvas-scroll">
        <div
          className={`canvas-email ${showWatermark ? 'is-watermarked' : ''}`}
          style={{
            width: emailWidth,
            background: globalSettings.emailAreaColor || '#ffffff',
          }}
        >
          {blocks.length === 0 ? (
            <div className="canvas-empty" style={{ width: emailWidth }}>
              <div className="e-icon">✉</div>
              <h3>Start building your email</h3>
              <p>Click any module on the left to add it here,<br />then preview and download when ready.</p>
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
          {showWatermark && (
            <div className="email-watermark" aria-hidden="true">
              {WATERMARK_TILES.map(i => <span key={i}>EMAILIX PREVIEW - PAID DOWNLOAD REQUIRED</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
