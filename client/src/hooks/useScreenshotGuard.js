import { useEffect } from 'react';

export default function useScreenshotGuard(showToast) {
  useEffect(() => {
    let timer;

    const warn = (message = 'Screenshots, printing, and copying are disabled for Emailix previews.') => {
      document.body.classList.add('screenshot-warning');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => document.body.classList.remove('screenshot-warning'), 1600);
      showToast?.(message, 'error');
    };

    const blockShortcut = (event) => {
      const key = String(event.key || '').toLowerCase();
      const blocked =
        key === 'printscreen' ||
        ((event.metaKey || event.ctrlKey) && key === 'p') ||
        ((event.metaKey || event.ctrlKey) && event.shiftKey && ['3', '4', '5', 's'].includes(key));

      if (blocked) {
        event.preventDefault();
        event.stopPropagation();
        warn();
      }
    };

    const blockContext = (event) => {
      event.preventDefault();
      warn('Right-click capture and save actions are disabled.');
    };

    const blockCopy = (event) => {
      const target = event.target;
      const editable = target?.closest?.('input, textarea, [contenteditable="true"]');
      if (editable) return;
      event.preventDefault();
      warn('Copying from the builder canvas is disabled.');
    };

    const blockPrint = (event) => {
      event.preventDefault();
      warn();
    };

    window.addEventListener('keydown', blockShortcut, true);
    window.addEventListener('keyup', blockShortcut, true);
    window.addEventListener('beforeprint', blockPrint);
    document.addEventListener('contextmenu', blockContext, true);
    document.addEventListener('copy', blockCopy, true);
    document.addEventListener('cut', blockCopy, true);
    document.addEventListener('dragstart', blockContext, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', blockShortcut, true);
      window.removeEventListener('keyup', blockShortcut, true);
      window.removeEventListener('beforeprint', blockPrint);
      document.removeEventListener('contextmenu', blockContext, true);
      document.removeEventListener('copy', blockCopy, true);
      document.removeEventListener('cut', blockCopy, true);
      document.removeEventListener('dragstart', blockContext, true);
    };
  }, [showToast]);
}
