// 150+ popular Google Fonts, grouped by category
export const SYSTEM_FONTS = ['Arial', 'Georgia', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];

export const GOOGLE_FONTS = [
  // Sans-Serif (most popular)
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Nunito',
  'Source Sans 3', 'Ubuntu', 'PT Sans', 'Noto Sans', 'Inter', 'Outfit', 'DM Sans',
  'Figtree', 'Plus Jakarta Sans', 'Barlow', 'Josefin Sans', 'Karla', 'Mulish',
  'Quicksand', 'Rubik', 'Work Sans', 'Exo 2', 'Titillium Web', 'Cabin', 'Hind',
  'Manrope', 'Red Hat Display', 'Jost', 'Nunito Sans', 'Lexend', 'Sora', 'Kanit',
  'Prompt', 'Sarabun', 'Barlow Condensed', 'Asap', 'Fira Sans', 'Muli', 'Oxygen',
  'Catamaran', 'Heebo', 'Varela Round', 'Dosis', 'Overpass', 'Arimo', 'Signika',
  'Questrial', 'Pathway Gothic One', 'Yanone Kaffeesatz', 'Passion One', 'Encode Sans',
  'Maven Pro', 'Overlock', 'Cabin Condensed', 'Alata', 'Be Vietnam Pro', 'Wix Madefor Display',

  // Serif
  'Merriweather', 'Playfair Display', 'Lora', 'PT Serif', 'Libre Baskerville',
  'Cormorant Garamond', 'EB Garamond', 'Crimson Text', 'Source Serif 4', 'Noto Serif',
  'Bitter', 'Cardo', 'Spectral', 'Zilla Slab', 'Arvo', 'Vollkorn', 'Gentium Book Plus',
  'Domine', 'Libre Caslon Text', 'Glegoo', 'Tinos', 'Frank Ruhl Libre', 'Nanum Myeongjo',
  'Rokkitt', 'Gelasio', 'Cambo', 'Alike Angular', 'Amethysta',

  // Display / Headline
  'Oswald', 'Bebas Neue', 'Anton', 'Righteous', 'Abril Fatface', 'Lilita One',
  'Ultra', 'Alfa Slab One', 'Black Han Sans', 'Boogaloo', 'Fredoka One', 'Russo One',
  'Squada One', 'Racing Sans One', 'Bowlby One SC', 'Baloo 2', 'Secular One',
  'Titan One', 'Fugaz One', 'Fjalla One', 'Arvo', 'Black Ops One', 'Press Start 2P',
  'Permanent Marker', 'Archivo Black', 'Teko', 'Rajdhani', 'Saira Condensed',

  // Handwriting / Calligraphy
  'Dancing Script', 'Pacifico', 'Great Vibes', 'Sacramento', 'Caveat', 'Satisfy',
  'Cookie', 'Allura', 'Alex Brush', 'Courgette', 'Kaushan Script', 'Lobster',
  'Lobster Two', 'Petit Formal Script', 'Pinyon Script', 'Ruthie', 'Tangerine',
  'Marck Script', 'Italianno', 'Mr De Haviland', 'Niconne', 'Bilbo Swash Caps',

  // Monospace
  'Roboto Mono', 'Source Code Pro', 'Inconsolata', 'Space Mono', 'IBM Plex Mono',
  'Fira Code', 'Courier Prime', 'JetBrains Mono', 'Nanum Gothic Coding', 'Share Tech Mono',
];

export const ALL_FONTS = [...SYSTEM_FONTS, ...GOOGLE_FONTS];

export function isGoogleFont(name) {
  return GOOGLE_FONTS.includes(name);
}

export function getFontUrl(name) {
  if (!isGoogleFont(name)) return null;
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@300;400;500;600;700&display=swap`;
}
