import { useCallback, useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useEmailStore } from './store/useEmailStore';
import Toolbar from './components/Toolbar';
import BlockPalette from './components/BlockPalette';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import useScreenshotGuard from './hooks/useScreenshotGuard';

export default function App() {
  const { blocks, reorderBlocks, toast, showToast } = useEmailStore();
  const [draggingId, setDraggingId] = useState(null);

  useScreenshotGuard(showToast);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragStart = useCallback(({ active }) => setDraggingId(active.id), []);

  const handleDragEnd = useCallback(({ active, over }) => {
    setDraggingId(null);
    if (!over || active.id === over.id) return;
    const o = blocks.findIndex(b => b.id === active.id);
    const n = blocks.findIndex(b => b.id === over.id);
    if (o !== -1 && n !== -1) reorderBlocks(arrayMove(blocks, o, n));
  }, [blocks, reorderBlocks]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="app">
        <Toolbar />
        <div className="app-body">
          <BlockPalette />
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            <Canvas draggingId={draggingId} />
          </SortableContext>
          <PropertiesPanel />
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {draggingId && (
          <div style={{ background: 'var(--accent)', color: '#fff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, boxShadow: '0 4px 16px rgba(124,58,237,.35)' }}>
            ⠿ moving block
          </div>
        )}
      </DragOverlay>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}
    </DndContext>
  );
}
