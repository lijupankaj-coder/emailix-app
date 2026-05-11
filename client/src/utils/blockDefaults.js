export function createBlock(type) {
  const id = crypto.randomUUID().slice(0, 10);
  const defaults = {
    logo: {
      src: '',
      alt: 'Company Logo',
      link: '',
      logoWidth: '180px',
      align: 'center',
      bgColor: '#ffffff',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      description: '',
    },
    title: {
      content: 'Your Heading Here',
      fontFamily: 'global',
      color: '#1f2937',
      fontSize: '28px',
      fontWeight: '700',
      align: 'left',
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      bgColor: '',
    },
    text: {
      content: '<p>Add your text content here. You can use <strong>bold</strong>, <em>italic</em>, and <a href="#">links</a>.</p>',
      fontFamily: 'global',
      color: '#374151',
      fontSize: '15px',
      lineHeight: '1.6',
      align: 'left',
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '16px',
      paddingRight: '16px',
      bgColor: '',
    },
    image: {
      src: '',
      alt: '',
      link: '',
      width: '100%',
      align: 'center',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      bgColor: '',
      description: '',
    },
    button: {
      label: 'Click Here',
      href: '#',
      bgColor: '#7C3AED',
      textColor: '#ffffff',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      align: 'center',
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      btnPaddingV: '12px',
      btnPaddingH: '28px',
      blockBgColor: '',
    },
    divider: {
      color: '#e5e7eb',
      thickness: '1px',
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingLeft: '16px',
      paddingRight: '16px',
      bgColor: '',
    },
    spacer: {
      height: '32px',
      bgColor: '',
    },
    social: {
      align: 'center',
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: '16px',
      paddingRight: '16px',
      bgColor: '',
      iconSize: '32px',
      links: [
        { platform: 'facebook', href: '#', label: 'Facebook' },
        { platform: 'twitter', href: '#', label: 'Twitter' },
        { platform: 'instagram', href: '#', label: 'Instagram' },
        { platform: 'linkedin', href: '#', label: 'LinkedIn' },
      ],
    },
    video: {
      videoUrl: '',
      thumbnailSrc: '',
      alt: 'Watch Video',
      paddingTop: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      paddingRight: '0px',
      bgColor: '',
      description: '',
    },
    columns: {
      bgColor: '',
      paddingTop: '16px',
      paddingBottom: '16px',
      paddingLeft: '8px',
      paddingRight: '8px',
      columns: [
        { width: '50%', content: '<p><strong>Column 1</strong><br/>Add your content here.</p>', color: '#374151', fontSize: '14px' },
        { width: '50%', content: '<p><strong>Column 2</strong><br/>Add your content here.</p>', color: '#374151', fontSize: '14px' },
      ],
    },
  };
  return { id, type, props: { ...(defaults[type] || {}) } };
}

export const CONTENT_MODULES = [
  { type: 'logo',    label: 'Logo',    icon: '◈' },
  { type: 'title',   label: 'Title',   icon: 'T' },
  { type: 'text',    label: 'Text',    icon: '≡' },
  { type: 'image',   label: 'Image',   icon: '⊡' },
  { type: 'button',  label: 'Button',  icon: '↗' },
  { type: 'divider', label: 'Divider', icon: '—' },
  { type: 'spacer',  label: 'Spacer',  icon: '↕' },
  { type: 'social',  label: 'Social',  icon: '◎' },
  { type: 'video',   label: 'Video',   icon: '▶' },
];

export const PREBUILT_ROWS = [
  {
    id: 'logo-header',
    label: 'Logo Header',
    preview: 'logo-header',
    blocks: () => [createBlock('logo')],
  },
  {
    id: 'full-image',
    label: 'Full Image',
    preview: 'image',
    blocks: () => [createBlock('image')],
  },
  {
    id: 'title-text-btn',
    label: 'Title + Text + Button',
    preview: 'title-text-btn',
    blocks: () => {
      const t = createBlock('title'); t.props.align = 'center';
      const tx = createBlock('text'); tx.props.align = 'center';
      const b = createBlock('button');
      return [t, tx, b];
    },
  },
  {
    id: 'title-text',
    label: 'Title + Text',
    preview: 'title-text',
    blocks: () => {
      const t = createBlock('title'); t.props.align = 'center';
      const tx = createBlock('text'); tx.props.align = 'center';
      return [t, tx];
    },
  },
  {
    id: '2col-text',
    label: '2 Column Text',
    preview: '2col',
    blocks: () => [createBlock('columns')],
  },
  {
    id: '3col-text',
    label: '3 Column Text',
    preview: '3col',
    blocks: () => {
      const c = createBlock('columns');
      c.props.columns = [
        { width: '33%', content: '<p><strong>Col 1</strong><br/>Your content.</p>', color: '#374151', fontSize: '14px' },
        { width: '33%', content: '<p><strong>Col 2</strong><br/>Your content.</p>', color: '#374151', fontSize: '14px' },
        { width: '34%', content: '<p><strong>Col 3</strong><br/>Your content.</p>', color: '#374151', fontSize: '14px' },
      ];
      return [c];
    },
  },
  {
    id: 'img-text-btn',
    label: 'Image + Text + Button',
    preview: 'img-text',
    blocks: () => {
      const c = createBlock('columns');
      c.props.columns = [
        { width: '40%', content: '<div style="background:#e8eaf6;height:160px;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:13px;">Image</div>' },
        { width: '60%', content: '<p><strong style="font-size:16px">Your Heading</strong></p><p style="margin-top:8px;color:#6b7280">Your description text goes here.</p><p style="margin-top:16px"><a href="#" style="background:#7C3AED;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;font-weight:600;display:inline-block">Learn More</a></p>', color: '#374151', fontSize: '14px' },
      ];
      return [c];
    },
  },
  {
    id: 'text-img',
    label: 'Text + Image',
    preview: 'text-img',
    blocks: () => {
      const c = createBlock('columns');
      c.props.columns = [
        { width: '60%', content: '<p><strong style="font-size:16px">Your Heading</strong></p><p style="margin-top:8px;color:#6b7280">Your description text goes here alongside the image.</p>', color: '#374151', fontSize: '14px' },
        { width: '40%', content: '<div style="background:#e8eaf6;height:160px;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:13px;">Image</div>' },
      ];
      return [c];
    },
  },
];

export const STARTER_TEMPLATES = [
  { label: 'Blank', key: 'blank' },
  { label: 'Newsletter', key: 'newsletter' },
  { label: 'Promo', key: 'promo' },
  { label: 'Announcement', key: 'announcement' },
];

export function getStarterTemplate(key) {
  const make = (type) => createBlock(type);
  const templates = {
    blank: { blocks: [], settings: {} },
    newsletter: {
      settings: { backgroundColor: '#f3f4f6' },
      blocks: (() => {
        const logo = make('logo');
        const t = make('title'); t.props.content = 'Monthly Newsletter'; t.props.align = 'center';
        const tx = make('text'); tx.props.content = '<p style="text-align:center">Welcome to this month\'s edition. Here\'s what\'s new.</p>';
        const d = make('divider');
        const s = make('social');
        return [logo, t, tx, d, s];
      })(),
    },
    promo: {
      settings: { backgroundColor: '#f0f0f0' },
      blocks: (() => {
        const t = make('title'); t.props.content = '🎉 Special Offer — 30% Off'; t.props.align = 'center'; t.props.fontSize = '32px';
        const tx = make('text'); tx.props.content = '<p style="text-align:center">Use code <strong>SAVE30</strong> at checkout. This weekend only!</p>';
        const b = make('button'); b.props.label = 'Shop Now';
        return [t, tx, b];
      })(),
    },
    announcement: {
      settings: {},
      blocks: (() => {
        const logo = make('logo');
        const t = make('title'); t.props.content = 'Big News — We\'ve Launched!'; t.props.align = 'center';
        const img = make('image'); img.props.description = 'Launch banner';
        const tx = make('text'); tx.props.content = '<p style="text-align:center">We\'re excited to share something we\'ve been building for months.</p>';
        const b = make('button'); b.props.label = 'Read More';
        return [logo, t, img, tx, b];
      })(),
    },
  };
  return templates[key] || templates.blank;
}
