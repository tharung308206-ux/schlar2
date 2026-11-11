// Master build script for generating the complete self-contained edcore_school_management.html
const fs = require('fs');
const path = require('path');
const { THEMES } = require('./themes');
const { ICONS } = require('./icons');
const { INITIAL_DATA } = require('./data');
const { getStyles } = require('./ui_templates');
const { getWelcomeAndRoleSelectScript } = require('./views_welcome');
const { getModalsScript } = require('./views_modals');
const { getActionsScript } = require('./views_actions');
const { getWebViewsScript } = require('./views_web');
const { getMobileViewsScript } = require('./views_mobile');

function buildHTML() {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SCHLAR — Greenfield International School Management</title>
  <meta name="description" content="SCHLAR: One connected platform for smarter schools. Interactive SaaS demo for Greenfield International School with real role-based workflows.">
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Plus Jakarta Sans & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style id="theme-styles">
    ${getStyles('blue')}
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white min-h-screen">
  <!-- Main Application Root -->
  <div id="app" class="min-h-screen flex flex-col"></div>

  <!-- Global Modal Host -->
  <div id="modal-container"></div>

  <!-- Toast Notification Stack -->
  <div id="toast-container" class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto"></div>

  <script>
    // Embedded Initial Data, Themes & Icons
    const INITIAL_STATE = ${JSON.stringify(INITIAL_DATA)};
    const THEME_DEFS = ${JSON.stringify(THEMES)};
    const ICONS = ${JSON.stringify(ICONS)};
    const STORAGE_KEY = 'educore_standalone_v4';

    // Global application state
    let state = loadState();

    function loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.screen) parsed.screen = 'welcome';
          return parsed;
        }
      } catch (e) {
        console.error('Error loading state from localStorage:', e);
      }
      const initial = JSON.parse(JSON.stringify(INITIAL_STATE));
      initial.screen = 'welcome';
      return initial;
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Error saving state to localStorage:', e);
      }
    }

    function resetDemoData() {
      state = JSON.parse(JSON.stringify(INITIAL_DATA));
      state.screen = 'app';
      saveState();
      applyTheme(state.theme || 'blue');
      closeModal();
      showToast('Demo Data Restored', 'All original Greenfield International School records have been reset.');
      renderApp();
    }

    function applyTheme(themeKey) {
      state.theme = themeKey;
      saveState();
      const theme = THEME_DEFS[themeKey] || THEME_DEFS.blue;
      const root = document.documentElement;
      root.style.setProperty('--primary', theme.hex);
      root.style.setProperty('--primary-hover', theme.hover);
      root.style.setProperty('--primary-light', theme.light);
      root.style.setProperty('--primary-border', theme.border);
      root.style.setProperty('--primary-dark', theme.dark);
      root.style.setProperty('--primary-ring', theme.ring);
    }

    function icon(name) {
      return ICONS[name] || '';
    }

    function showToast(title, message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      const colorClass = type === 'error' ? 'border-rose-300 bg-rose-50 text-rose-900 shadow-rose-100' :
                         type === 'info' ? 'border-sky-300 bg-sky-50 text-sky-900 shadow-sky-100' :
                         'border-emerald-300 bg-emerald-50 text-emerald-900 shadow-emerald-100';
      toast.className = 'flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 ' + colorClass;
      toast.innerHTML = \`
        <div class="flex-1">
          <h4 class="font-bold text-sm">\${title}</h4>
          <p class="text-xs mt-0.5 opacity-90">\${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-700 text-lg leading-none font-bold">&times;</button>
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

    function openModal(html) {
      const container = document.getElementById('modal-container');
      container.innerHTML = \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onclick="if(event.target === this) closeModal()">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            \${html}
          </div>
        </div>
      \`;
    }

    function closeModal() {
      const container = document.getElementById('modal-container');
      if (container) container.innerHTML = '';
    }

    // Navigation and screen switching
    function setScreen(screenName) {
      state.screen = screenName;
      saveState();
      renderApp();
    }

    function selectPlatform(platform) {
      state.currentPlatform = platform;
      state.currentRole = platform === 'web' ? 'principal' : 'parent_mobile';
      state.activeTab = 'dashboard';
      state.screen = 'role_select';
      saveState();
      renderApp();
    }

    function selectRole(role) {
      state.currentRole = role;
      state.activeTab = 'dashboard';
      saveState();
      renderApp();
    }

    function switchTheme(themeKey) {
      applyTheme(themeKey);
      renderApp();
    }

    function enterApplication() {
      state.screen = 'app';
      state.activeTab = 'dashboard';
      saveState();
      renderApp();
    }

    function signOut() {
      state.screen = 'welcome';
      saveState();
      renderApp();
      showToast('Signed Out', 'Returned to SCHLAR portal.');
    }

    function switchRole() {
      state.screen = 'role_select';
      saveState();
      renderApp();
    }

    function toggleSidebar() {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      saveState();
      renderApp();
    }

    function setActiveTab(tab) {
      state.activeTab = tab;
      saveState();
      renderApp();
    }

    function selectChild(childId) {
      state.selectedChild = childId;
      saveState();
      renderApp();
      const child = state.children[childId];
      if (child) {
        showToast('Child Profile Switched', 'Now viewing records for ' + child.name + ' (' + child.grade + ')');
      }
    }

    // Inlined Modules
    ${getWelcomeAndRoleSelectScript()}
    ${getModalsScript()}
    ${getActionsScript()}
    ${getWebViewsScript()}
    ${getMobileViewsScript()}

    // Global Root Dispatcher
    function renderApp() {
      const root = document.getElementById('app');
      if (!root) return;

      if (state.screen === 'welcome') {
        root.innerHTML = renderWelcomeScreen();
      } else if (state.screen === 'role_select') {
        root.innerHTML = renderRoleSelectScreen();
      } else if (state.currentPlatform === 'mobile' || state.currentRole === 'teacher_mobile' || state.currentRole === 'parent_mobile' || state.currentRole === 'parent') {
        root.innerHTML = renderMobileApp();
      } else {
        root.innerHTML = renderWebApp();
      }
    }

    // Keyboard shortcuts & DOM Initialization
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openQuickSearchModal();
      }
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      applyTheme(state.theme || 'blue');
      renderApp();
    });

    if (document.readyState !== 'loading') {
      applyTheme(state.theme || 'blue');
      renderApp();
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, '..', 'edcore_school_management.html'), htmlContent, 'utf8');
  console.log('Master self-contained edcore_school_management.html generated successfully.');
}

buildHTML();
