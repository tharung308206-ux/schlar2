// Client application runtime for edcore_school_management.html
const { THEMES } = require('./themes');
const { ICONS } = require('./icons');
const { INITIAL_DATA } = require('./data');

function getClientScript() {
  return `
  // Local storage key
  const STORAGE_KEY = 'educore_demo_standalone_v3';

  // Master Initial Data embedded
  const INITIAL_STATE = ${JSON.stringify(INITIAL_DATA, null, 2)};
  const THEME_DEFS = ${JSON.stringify(THEMES, null, 2)};

  // State initialization
  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return JSON.parse(JSON.stringify(INITIAL_STATE));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  // Toast notification manager
  function showToast(title, message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const colorClass = type === 'error' ? 'border-rose-500 bg-rose-50 text-rose-900' :
                       type === 'info' ? 'border-sky-500 bg-sky-50 text-sky-900' :
                       'border-emerald-500 bg-emerald-50 text-emerald-900';
    toast.className = 'flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-2 opacity-0 ' + colorClass;
    toast.innerHTML = \`
      <div class="flex-1">
        <h4 class="font-bold text-sm">\${title}</h4>
        <p class="text-xs mt-0.5 opacity-90">\${message}</p>
      </div>
      <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 text-sm font-bold">&times;</button>
    \`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Theme application
  function applyTheme(themeKey) {
    state.theme = themeKey;
    saveState();
    const t = THEME_DEFS[themeKey] || THEME_DEFS.blue;
    document.documentElement.style.setProperty('--primary', t.hex);
    document.documentElement.style.setProperty('--primary-hover', t.hover);
    document.documentElement.style.setProperty('--primary-light', t.light);
    document.documentElement.style.setProperty('--primary-border', t.border);
    document.documentElement.style.setProperty('--primary-dark', t.dark);
    document.documentElement.style.setProperty('--primary-ring', t.ring);
  }

  // Global helper icons
  const ICONS = ${JSON.stringify(ICONS)};
  function icon(name) {
    return ICONS[name] || '';
  }
  `;
}

module.exports = { getClientScript };
