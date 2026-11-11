import { PaletteId, PaletteDefinition, ThemeColors, ThemeConfig } from '../types';

export const SCHLAR_PALETTES: PaletteDefinition[] = [
  {
    id: 'palette_1',
    name: 'Navy & Teal',
    number: 1,
    description: 'Crisp academic clarity with deep ocean tones and warm amber accent.',
    colors: {
      primary: '#17324D',
      secondary: '#2A7886',
      accent: '#E0A458',
      background: '#F2F5F8',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_2',
    name: 'Forest & Champagne',
    number: 2,
    description: 'Prestigious natural greens balanced with elegant champagne gold.',
    colors: {
      primary: '#245747',
      secondary: '#54866A',
      accent: '#D6B878',
      background: '#F3F4EC',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_3',
    name: 'Oxblood & Blush',
    number: 3,
    description: 'Heritage collegiate oxblood paired with soft rosewood and blush.',
    colors: {
      primary: '#702D3A',
      secondary: '#A65C69',
      accent: '#D9A3A7',
      background: '#F8F0F0',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_4',
    name: 'Cobalt & Electric Lime',
    number: 4,
    description: 'High-energy modern tech contrast with electric lime highlights.',
    colors: {
      primary: '#2448A5',
      secondary: '#3C70D6',
      accent: '#C4E83A',
      background: '#F2F5FC',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_5',
    name: 'Terracotta & Sage',
    number: 5,
    description: 'Earthy warmth and calm herbal greens for an approachable campus atmosphere.',
    colors: {
      primary: '#A34F38',
      secondary: '#71866B',
      accent: '#D9A66F',
      background: '#F7F1E9',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_6',
    name: 'Graphite & Ice Lavender',
    number: 6,
    description: 'Modern neutral slate foundation with serene lavender accents.',
    colors: {
      primary: '#343640',
      secondary: '#666A7D',
      accent: '#B8B5E8',
      background: '#F3F3F8',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_7',
    name: 'Petrol & Copper (DEFAULT)',
    number: 7,
    description: 'SCHLAR signature identity — deep petrol teal anchored with rich metallic copper.',
    colors: {
      primary: '#164E55',
      secondary: '#287B7A',
      accent: '#C47D54',
      background: '#F5F0E7',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_8',
    name: 'Indigo & Marigold',
    number: 8,
    description: 'Vibrant intellectual indigo ignited with bright sunlit marigold.',
    colors: {
      primary: '#373B83',
      secondary: '#6266B5',
      accent: '#E9B949',
      background: '#F4F3FA',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_9',
    name: 'Royal Purple & Gold',
    number: 9,
    description: 'Regal academic distinction with velvety purple and luminous warm gold.',
    colors: {
      primary: '#512B81',
      secondary: '#8056A8',
      accent: '#D8B45A',
      background: '#F6F1FA',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_10',
    name: 'Emerald & Coral',
    number: 10,
    description: 'Fresh botanical emerald infused with vibrant coral energy.',
    colors: {
      primary: '#146B58',
      secondary: '#329780',
      accent: '#EF806F',
      background: '#EFF6F2',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_11',
    name: 'Black & Gold',
    number: 11,
    description: 'Sleek luxury monochrome anchored with distinguished championship gold.',
    colors: {
      primary: '#242424',
      secondary: '#454545',
      accent: '#C9A44C',
      background: '#F4F2EC',
      surface: '#FFFFFF'
    }
  },
  {
    id: 'palette_12',
    name: 'Sky & Midnight',
    number: 12,
    description: 'Maritime authority combining deep midnight blue with crisp azure and amber.',
    colors: {
      primary: '#17365D',
      secondary: '#3985B8',
      accent: '#F0B44D',
      background: '#EFF5FA',
      surface: '#FFFFFF'
    }
  }
];

export const DEFAULT_PALETTE_ID: PaletteId = 'palette_7';
export const DEFAULT_THEME_COLORS: ThemeColors = SCHLAR_PALETTES.find(p => p.id === 'palette_7')!.colors;

// Hex color validation
export function isValidHexColor(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex.trim());
}

// Convert hex to rgb
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return { r, g, b };
  } else if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

// Helper to calculate lighter/darker shades
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const num = (c: number) => {
    const val = Math.round(c + (percent / 100) * (percent > 0 ? 255 - c : c));
    return Math.max(0, Math.min(255, val)).toString(16).padStart(2, '0');
  };
  return `#${num(rgb.r)}${num(rgb.g)}${num(rgb.b)}`;
}

// Calculate relative luminance to determine text readability
export function getContrastTextColor(bgColorHex: string): '#FFFFFF' | '#0F172A' {
  const rgb = hexToRgb(bgColorHex);
  if (!rgb) return '#FFFFFF';
  // Luminance formula
  const l = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return l > 0.55 ? '#0F172A' : '#FFFFFF';
}

// Centralized CSS Variable Application
export function applyThemeVariables(colors: ThemeColors) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const rgbP = hexToRgb(colors.primary) || { r: 22, g: 78, b: 85 };
  const rgbS = hexToRgb(colors.secondary) || { r: 40, g: 123, b: 122 };
  const rgbA = hexToRgb(colors.accent) || { r: 196, g: 125, b: 84 };

  const hoverColor = adjustBrightness(colors.primary, -15);
  const darkColor = adjustBrightness(colors.primary, -25);
  const lightColor = `rgba(${rgbP.r}, ${rgbP.g}, ${rgbP.b}, 0.10)`;
  const borderColor = `rgba(${rgbP.r}, ${rgbP.g}, ${rgbP.b}, 0.25)`;
  const ringColor = `rgba(${rgbP.r}, ${rgbP.g}, ${rgbP.b}, 0.25)`;
  const accentLight = `rgba(${rgbA.r}, ${rgbA.g}, ${rgbA.b}, 0.12)`;
  const secondaryLight = `rgba(${rgbS.r}, ${rgbS.g}, ${rgbS.b}, 0.12)`;

  // CSS Tokens
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--surface', colors.surface);

  root.style.setProperty('--primary-hover', hoverColor);
  root.style.setProperty('--primary-dark', darkColor);
  root.style.setProperty('--primary-light', lightColor);
  root.style.setProperty('--primary-border', borderColor);
  root.style.setProperty('--primary-ring', ringColor);
  root.style.setProperty('--accent-light', accentLight);
  root.style.setProperty('--secondary-light', secondaryLight);

  // App body background styling
  document.body.style.backgroundColor = colors.background;
}

// Validate theme colors schema strictly
export function validateThemeColors(input: unknown): { valid: boolean; error?: string; colors?: ThemeColors } {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Theme data must be a valid JSON object.' };
  }
  const obj = input as Record<string, unknown>;
  const required = ['primary', 'secondary', 'accent', 'background', 'surface'];
  for (const key of required) {
    if (typeof obj[key] !== 'string') {
      return { valid: false, error: `Missing or invalid "${key}" color property.` };
    }
    const val = (obj[key] as string).trim();
    if (!isValidHexColor(val)) {
      return { valid: false, error: `Invalid hex code for "${key}": ${val}. Expected format #RRGGBB or #RGB.` };
    }
  }

  return {
    valid: true,
    colors: {
      primary: (obj.primary as string).trim(),
      secondary: (obj.secondary as string).trim(),
      accent: (obj.accent as string).trim(),
      background: (obj.background as string).trim(),
      surface: (obj.surface as string).trim()
    }
  };
}

// Export theme configuration as a clean JSON string
export function exportThemeJSON(name: string, colors: ThemeColors): string {
  const payload = {
    app: 'SCHLAR',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    name,
    colors
  };
  return JSON.stringify(payload, null, 2);
}

// Import theme configuration from JSON string
export function importThemeJSON(jsonString: string): { success: boolean; data?: { name: string; colors: ThemeColors }; error?: string } {
  try {
    // Strictly parse without eval
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'File content must be a valid JSON object.' };
    }

    const themeColors = parsed.colors || parsed;
    const validation = validateThemeColors(themeColors);
    if (!validation.valid || !validation.colors) {
      return { success: false, error: validation.error || 'Failed to validate theme colors.' };
    }

    const themeName = typeof parsed.name === 'string' && parsed.name.trim().length > 0
      ? parsed.name.trim()
      : 'Imported Custom Theme';

    return {
      success: true,
      data: {
        name: themeName,
        colors: validation.colors
      }
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Invalid JSON format.';
    return { success: false, error: `JSON Parse error: ${msg}` };
  }
}

// Backwards-compatible map for components referencing THEME_CONFIGS
export const THEME_CONFIGS: Record<string, ThemeConfig> = (() => {
  const map: Record<string, ThemeConfig> = {};
  
  // Populate all 12 palettes
  SCHLAR_PALETTES.forEach(p => {
    map[p.id] = {
      id: p.id,
      name: p.name,
      number: p.number,
      hex: p.colors.primary,
      secondary: p.colors.secondary,
      accent: p.colors.accent,
      background: p.colors.background,
      surface: p.colors.surface,
      hover: adjustBrightness(p.colors.primary, -15),
      light: adjustBrightness(p.colors.primary, 85),
      border: adjustBrightness(p.colors.primary, 70),
      dark: adjustBrightness(p.colors.primary, -25),
      ring: 'rgba(22, 78, 85, 0.25)'
    };
  });

  // Alias legacy color names so older views don't break
  const legacyAliases: Record<string, PaletteId> = {
    blue: 'palette_1',
    teal: 'palette_7',
    green: 'palette_2',
    red: 'palette_3',
    indigo: 'palette_8',
    purple: 'palette_9',
    amber: 'palette_5',
    slate: 'palette_6'
  };

  Object.entries(legacyAliases).forEach(([legacyKey, paletteId]) => {
    const pal = SCHLAR_PALETTES.find(p => p.id === paletteId);
    if (pal) {
      map[legacyKey] = {
        id: legacyKey,
        name: pal.name,
        hex: pal.colors.primary,
        secondary: pal.colors.secondary,
        accent: pal.colors.accent,
        background: pal.colors.background,
        surface: pal.colors.surface,
        hover: adjustBrightness(pal.colors.primary, -15),
        light: adjustBrightness(pal.colors.primary, 85),
        border: adjustBrightness(pal.colors.primary, 70),
        dark: adjustBrightness(pal.colors.primary, -25),
        ring: 'rgba(22, 78, 85, 0.25)'
      };
    }
  });

  return map;
})();
