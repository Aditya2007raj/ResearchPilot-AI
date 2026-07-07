/**
 * Helper to dynamically fetch current active CSS variable property values.
 * Useful when drawing canvas highlights or setting external custom assets.
 */
export function getThemeVariable(variableName) {
  if (typeof window === 'undefined') return '';
  return window.getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

/**
 * Returns Hex value fallback objects if raw CSS variables cannot be accessed.
 * Matches values mapped in themes.js.
 */
export function getThemeColorFallback(theme, colorKey) {
  const fallbacks = {
    dark: {
      bgBase: '#0b0b0c',
      bgSurface: '#161618',
      textPrimary: '#f3f4f6',
      textSecondary: '#9ca3af',
      accentIndigo: '#6366f1',
      accentCyan: '#06b6d4',
      borderSubtle: '#27272a',
    },
    light: {
      bgBase: '#fafafa',
      bgSurface: '#ffffff',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      accentIndigo: '#4f46e5',
      accentCyan: '#0891b2',
      borderSubtle: '#e5e7eb',
    },
  };

  return fallbacks[theme]?.[colorKey] || '';
}
