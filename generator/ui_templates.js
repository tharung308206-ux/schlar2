// UI Templates for SCHLAR Standalone Single-file Application
const { THEMES } = require('./themes');
const { ICONS } = require('./icons');

function getStyles(activeThemeKey) {
  const theme = THEMES[activeThemeKey] || THEMES.blue;
  return `
    :root {
      --primary: ${theme.hex};
      --primary-hover: ${theme.hover};
      --primary-light: ${theme.light};
      --primary-border: ${theme.border};
      --primary-dark: ${theme.dark};
      --primary-ring: ${theme.ring};
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    /* Theme color utility overrides */
    .bg-theme-primary { background-color: var(--primary) !important; }
    .bg-theme-primary:hover { background-color: var(--primary-hover) !important; }
    .bg-theme-light { background-color: var(--primary-light) !important; }
    .text-theme-primary { color: var(--primary) !important; }
    .text-theme-dark { color: var(--primary-dark) !important; }
    .border-theme-primary { border-color: var(--primary) !important; }
    .border-theme-border { border-color: var(--primary-border) !important; }
    .ring-theme { box-shadow: 0 0 0 3px var(--primary-ring) !important; }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    
    /* Collapsed sidebar tooltips */
    .has-tooltip { position: relative; }
    .has-tooltip .tooltip-text {
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.15s ease-in-out;
      position: absolute;
      left: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%);
      z-index: 50;
      white-space: nowrap;
    }
    .has-tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  `;
}

module.exports = { getStyles };
