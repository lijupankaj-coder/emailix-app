import { create } from 'zustand';
import { createBlock } from '../utils/blockDefaults';

const DRAFT_KEY = 'emailix-draft';
const APIKEY_KEY = 'emailix-apikey';

export const useEmailStore = create((set, get) => ({
  blocks: [],
  selectedId: null,
  isConverting: false,
  toast: null,
  viewMode: 'desktop',
  apiKey: localStorage.getItem(APIKEY_KEY) || '',
  globalSettings: {
    width: 600,
    alignment: 'center',
    backgroundColor: '#f3f4f6',
    emailAreaColor: '#ffffff',
    fontFamily: 'Inter',
    linkColor: '#7C3AED',
    previewText: '',
    subject: '',
  },

  addBlock: (type) => {
    const block = createBlock(type);
    set(state => {
      const blocks = [...state.blocks];
      const idx = blocks.findIndex(b => b.id === state.selectedId);
      idx >= 0 ? blocks.splice(idx + 1, 0, block) : blocks.push(block);
      return { blocks, selectedId: block.id };
    });
  },

  addBlocks: (newBlocks) => {
    set(state => {
      const blocks = [...state.blocks];
      const idx = blocks.findIndex(b => b.id === state.selectedId);
      const stamped = newBlocks.map(b => b.id ? b : { ...b, id: crypto.randomUUID().slice(0, 10) });
      idx >= 0 ? blocks.splice(idx + 1, 0, ...stamped) : blocks.push(...stamped);
      return { blocks, selectedId: stamped[stamped.length - 1].id };
    });
  },

  removeBlock: (id) => set(state => ({
    blocks: state.blocks.filter(b => b.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId,
  })),

  duplicateBlock: (id) => {
    set(state => {
      const idx = state.blocks.findIndex(b => b.id === id);
      if (idx === -1) return {};
      const src = state.blocks[idx];
      const copy = { ...src, id: crypto.randomUUID().slice(0, 10), props: JSON.parse(JSON.stringify(src.props)) };
      const blocks = [...state.blocks];
      blocks.splice(idx + 1, 0, copy);
      return { blocks, selectedId: copy.id };
    });
  },

  updateBlock: (id, props) => set(state => ({
    blocks: state.blocks.map(b => b.id === id ? { ...b, props: { ...b.props, ...props } } : b),
  })),

  moveBlock: (id, dir) => {
    set(state => {
      const blocks = [...state.blocks];
      const i = blocks.findIndex(b => b.id === id);
      const j = dir === 'up' ? i - 1 : i + 1;
      if (j < 0 || j >= blocks.length) return {};
      [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
      return { blocks };
    });
  },

  reorderBlocks: (blocks) => set({ blocks }),
  selectBlock: (id) => set({ selectedId: id }),
  setBlocks: (blocks) => set({ blocks, selectedId: null }),
  clearCanvas: () => set({ blocks: [], selectedId: null }),

  updateGlobalSettings: (s) => set(state => ({ globalSettings: { ...state.globalSettings, ...s } })),
  setViewMode: (v) => set({ viewMode: v }),
  setConverting: (v) => set({ isConverting: v }),

  setApiKey: (key) => {
    localStorage.setItem(APIKEY_KEY, key);
    set({ apiKey: key });
  },

  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3500);
  },

  saveDraft: () => {
    const { blocks, globalSettings } = get();
    try {
      // Strip base64 images from draft to keep it small (just clear src)
      const stripped = blocks.map(b => {
        const p = { ...b.props };
        ['src', 'thumbnailSrc'].forEach(k => {
          if (p[k]?.startsWith('data:')) p[k] = '';
        });
        return { ...b, props: p };
      });
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ blocks: stripped, globalSettings }));
      get().showToast('Draft saved');
    } catch {
      get().showToast('Draft too large to save', 'error');
    }
  },

  loadDraft: () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return false;
      const draft = JSON.parse(raw);
      if (draft?.blocks) {
        set({ blocks: draft.blocks, globalSettings: draft.globalSettings || get().globalSettings, selectedId: null });
        return true;
      }
    } catch { /* ignore */ }
    return false;
  },
}));
