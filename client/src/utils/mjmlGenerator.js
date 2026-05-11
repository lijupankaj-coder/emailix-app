import { isGoogleFont } from './googleFonts';

export function generateMJML(blocks, globalSettings = {}) {
  const {
    width = 600,
    backgroundColor = '#f3f4f6',
    emailAreaColor = '#ffffff',
    fontFamily = 'Inter',
    linkColor = '#7C3AED',
    previewText = '',
  } = globalSettings;

  const fontStack = `${fontFamily}, Arial, sans-serif`;
  const sections = blocks.map(b => blockToMJML(b, { fontStack, emailAreaColor, linkColor, fontFamily })).filter(Boolean).join('\n');

  // Collect all unique Google Fonts used in blocks
  const usedFonts = new Set();
  if (isGoogleFont(fontFamily)) usedFonts.add(fontFamily);
  blocks.forEach(b => {
    const ff = b.props?.fontFamily;
    if (ff && ff !== 'global' && isGoogleFont(ff)) usedFonts.add(ff);
  });

  const fontTags = [...usedFonts].map(f =>
    `    <mj-font name="${f}" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@300;400;500;600;700&display=swap" />`
  ).join('\n');

  return `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="${fontStack}" />
      <mj-text font-size="15px" line-height="1.6" color="#374151" />
      <mj-section background-color="${emailAreaColor}" />
    </mj-attributes>
    ${previewText ? `<mj-preview>${esc(previewText)}</mj-preview>` : ''}
${fontTags}
    <mj-style inline="inline">
      a { color: ${linkColor}; }
      p { margin: 0 0 10px 0; }
      p:last-child { margin-bottom: 0; }
      h1,h2,h3,h4 { margin: 0; line-height: 1.25; }
      img { max-width: 100%; }
    </mj-style>
  </mj-head>
  <mj-body width="${width}px" background-color="${backgroundColor}">
${sections}
  </mj-body>
</mjml>`;
}

function blockToMJML(block, ctx) {
  const p = block.props;
  const bg = p.bgColor || ctx.emailAreaColor;
  const pad = (b) => `${b.paddingTop || '0'} ${b.paddingRight || '0'} ${b.paddingBottom || '0'} ${b.paddingLeft || '0'}`;
  const ff = (f) => f === 'global' ? ctx.fontStack : `${f}, Arial, sans-serif`;

  switch (block.type) {
    case 'logo': {
      const src = p.src && !p.src.startsWith('data:') && p.src !== 'placeholder' ? p.src : 'https://placehold.co/180x60/e8e8e8/aaaaaa?text=Logo';
      const href = p.link ? ` href="${p.link}"` : '';
      return section(bg, pad(p), `<mj-image src="${src}" alt="${esc(p.alt || 'Logo')}" width="${p.logoWidth || '180px'}" align="${p.align || 'center'}"${href} padding="0" />`);
    }
    case 'title':
      return section(bg, pad(p), `<mj-text align="${p.align}" color="${p.color}" font-size="${p.fontSize}" font-weight="${p.fontWeight || '700'}" font-family="${ff(p.fontFamily)}" line-height="1.25" padding="0">${p.content}</mj-text>`);
    case 'text':
      return section(bg, pad(p), `<mj-text align="${p.align}" color="${p.color}" font-size="${p.fontSize}" line-height="${p.lineHeight || '1.6'}" font-family="${ff(p.fontFamily)}" padding="0">${p.content}</mj-text>`);
    case 'image': {
      const src = p.src && !p.src.startsWith('data:') && p.src !== 'placeholder' ? p.src : 'https://placehold.co/600x300/e8e8e8/aaaaaa?text=Image';
      const href = p.link ? ` href="${p.link}"` : '';
      const w = p.width !== '100%' ? ` width="${p.width}"` : '';
      return section(bg, pad(p), `<mj-image src="${src}" alt="${esc(p.alt)}" align="${p.align}"${w}${href} padding="0" />`);
    }
    case 'button': {
      const bg2 = p.blockBgColor || ctx.emailAreaColor;
      return section(bg2, pad(p), `<mj-button href="${p.href}" background-color="${p.bgColor}" color="${p.textColor}" border-radius="${p.borderRadius}" font-size="${p.fontSize}" font-weight="${p.fontWeight || '600'}" inner-padding="${p.btnPaddingV || '12px'} ${p.btnPaddingH || '28px'}" align="${p.align}" font-family="${ctx.fontStack}" padding="0">${esc(p.label)}</mj-button>`);
    }
    case 'divider':
      return section(bg, pad(p), `<mj-divider border-color="${p.color}" border-width="${p.thickness}" padding="0" />`);
    case 'spacer':
      return `    <mj-section background-color="${bg}" padding="0"><mj-column><mj-spacer height="${p.height}" /></mj-column></mj-section>`;
    case 'social': {
      const els = (p.links || []).map(l =>
        `        <mj-social-element name="${l.platform}" href="${l.href}" icon-size="${p.iconSize}" padding="0 6px">${esc(l.label)}</mj-social-element>`
      ).join('\n');
      return section(bg, pad(p), `<mj-social align="${p.align}" padding="0">\n${els}\n      </mj-social>`);
    }
    case 'video': {
      const thumb = p.thumbnailSrc && !p.thumbnailSrc.startsWith('data:') && p.thumbnailSrc !== 'placeholder'
        ? p.thumbnailSrc : 'https://placehold.co/600x338/111827/ffffff?text=Watch+Video';
      const href = p.videoUrl ? ` href="${p.videoUrl}"` : '';
      return section(bg, pad(p), `<mj-image src="${thumb}" alt="${esc(p.alt)}"${href} padding="0" />`);
    }
    case 'columns': {
      const cols = (p.columns || []).map(col => {
        const colBg = col.bgColor ? ` background-color="${col.bgColor}"` : '';
        return `      <mj-column width="${col.width}"${colBg}>
        <mj-text color="${col.color || '#374151'}" font-size="${col.fontSize || '14px'}" padding="10px 8px" line-height="1.5">${col.content || '&nbsp;'}</mj-text>
      </mj-column>`;
      }).join('\n');
      return `    <mj-section background-color="${bg}" padding="${pad(p)}">\n${cols}\n    </mj-section>`;
    }
    default: return '';
  }
}

function section(bg, padding, inner) {
  return `    <mj-section background-color="${bg}" padding="${padding}">
      <mj-column>
        ${inner}
      </mj-column>
    </mj-section>`;
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
