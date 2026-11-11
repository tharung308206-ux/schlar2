import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, ThemeColor, PaletteId } from '../../types';
import { SCHLAR_PALETTES, DEFAULT_PALETTE_ID } from '../../data/themes';
import {
  Bell,
  Check,
  ChevronDown,
  Globe,
  RotateCcw,
  Smartphone,
  LogOut,
  User,
  ExternalLink,
  School,
  AlertTriangle,
  Palette,
  PlayCircle,
  Search,
  Sliders,
  Sparkles,
  Repeat
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar }) => {
  const {
    currentRole,
    currentPlatform,
    currentPage,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    switchRoleAndNavigate,
    setIsWelcomeScreen,
    resetDemoData,
    setCurrentPlatform,
    selectedChild,
    setSelectedChild,
    theme,
    setTheme,
    activePaletteId,
    themeColors,
    setThemePalette,
    setIsThemeModalOpen,
    resetThemeToDefault,
    setActiveScenarioModal,
    setQuickSearchOpen,
    setCurrentPage,
    toggleMobileSidebar
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filter notifications for active role or all
  const roleNotifications = notifications.filter(
    (n) => n.targetRole === currentRole || n.targetRole === 'all'
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const roleLabels: Record<RoleType, { title: string; subtitle: string; platform: 'web' | 'mobile'; roleGroup: string }> = {
    principal: { title: '1. Admin / Principal', subtitle: 'Dr. Arthur Campbell', platform: 'web', roleGroup: 'Administration' },
    vice_principal: { title: '2. Vice Principal', subtitle: 'Mrs. Evelyn Hayes', platform: 'web', roleGroup: 'Academic Governance' },
    teacher: { title: '3. Teacher (Web Portal)', subtitle: 'Dr. Vikram Sharma', platform: 'web', roleGroup: 'Faculty' },
    teacher_mobile: { title: '3. Teacher (Mobile App)', subtitle: 'Dr. Vikram Sharma', platform: 'mobile', roleGroup: 'Faculty' },
    parent: { title: '4. Parent (Mobile App)', subtitle: 'Ramesh Sharma', platform: 'mobile', roleGroup: 'Family' },
    parent_mobile: { title: '4. Parent (Mobile App)', subtitle: 'Ramesh Sharma', platform: 'mobile', roleGroup: 'Family' },
    accountant: { title: '5. Accountant / Fee Manager', subtitle: 'Alok Saxena', platform: 'web', roleGroup: 'Finance' },
    hr: { title: '6. HR / Staff Manager', subtitle: 'Meera Sen', platform: 'web', roleGroup: 'Personnel' },
    librarian: { title: '7. Librarian', subtitle: 'Nandini Krishnan', platform: 'web', roleGroup: 'Media Center' },
    transport: { title: '8. Transport Manager', subtitle: 'Rajesh Kumar', platform: 'web', roleGroup: 'Logistics' },
    receptionist: { title: '9. Receptionist / Front Office', subtitle: 'Kavita Chawla', platform: 'web', roleGroup: 'Front Desk' },
    exam_coordinator: { title: '10. Exam Coordinator', subtitle: 'Prof. Arvind Deshmukh', platform: 'web', roleGroup: 'Assessment' }
  };

  const currentRoleInfo = roleLabels[currentRole] || {
    title: 'SCHLAR Workspace',
    subtitle: 'Greenfield International',
    platform: 'web',
    roleGroup: 'General'
  };

  const handleRoleSelect = (role: RoleType) => {
    if (role === 'parent') {
      switchRoleAndNavigate('parent_mobile');
    } else {
      switchRoleAndNavigate(role);
    }
    setShowRoleMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 h-16 flex items-center justify-between transition-colors">
        {/* Zone 1: Single text element wordmark + School */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar || toggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden transition-colors"
            aria-label="Toggle navigation drawer"
            title="Open Menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div
            onClick={() => setIsWelcomeScreen(true)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white font-bold text-xs sm:text-sm tracking-tight shadow-md group-hover:opacity-90 transition-opacity">
              SC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-slate-900 tracking-tight">SCHLAR</span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                  Greenfield
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-500 font-normal">
                One connected platform for smarter schools
              </span>
            </div>
          </div>

          {/* Mobile Role Switcher Pill */}
          <button
            onClick={() => setShowRoleMenu(true)}
            className="md:hidden flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
            title="Switch Active Role"
          >
            <span className="w-2 h-2 rounded-full bg-theme-primary"></span>
            <span className="max-w-[85px] truncate">{currentRoleInfo.title.replace(/^\d+\.\s*/, '')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Zone 2: Navigation Links / Fast Switchers */}
        <div className="hidden md:flex items-center gap-2">
          {/* Platform switcher pills */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => {
                if (currentRole === 'teacher_mobile') switchRoleAndNavigate('teacher');
                else if (currentRole === 'parent_mobile') switchRoleAndNavigate('principal');
                else setCurrentPlatform('web');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                currentPlatform === 'web'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Web Platform</span>
            </button>

            <button
              onClick={() => {
                if (currentRole === 'teacher') switchRoleAndNavigate('teacher_mobile');
                else switchRoleAndNavigate('parent_mobile');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                currentPlatform === 'mobile'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mobile App</span>
            </button>
          </div>

          {/* Role selector button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-800 transition-colors shadow-2xs"
              title="Change active role workspace"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-theme-primary"></span>
              <span className="font-semibold text-slate-900">{currentRoleInfo.title}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Child Switcher when Parent Mobile or Parent Web is active */}
          {(currentRole === 'parent_mobile' || currentRole === 'parent') && (
            <div className="flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-lg text-xs">
              <span className="text-[11px] text-slate-600 font-semibold px-2">Child:</span>
              <button
                onClick={() => setSelectedChild('aarav')}
                className={`px-2 py-0.5 rounded-md font-medium text-xs transition-all ${
                  selectedChild === 'aarav'
                    ? 'bg-theme-primary text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Aarav (8A)
              </button>
              <button
                onClick={() => setSelectedChild('ananya')}
                className={`px-2 py-0.5 rounded-md font-medium text-xs transition-all ${
                  selectedChild === 'ananya'
                    ? 'bg-theme-primary text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ananya (5B)
              </button>
            </div>
          )}
        </div>

        {/* Zone 3: Actions (Scenarios, Theme, Search, Notifications, Reset Demo, Profile) */}
        <div className="flex items-center gap-2">
          {/* Scenarios 1-10 Launcher */}
          <button
            onClick={() => setActiveScenarioModal(1)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-theme-primary rounded-lg shadow-2xs hover:opacity-95 transition-all"
            title="Launch Scenarios 1-10 Walkthrough"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Scenarios 1-10</span>
          </button>

          {/* Theme Color Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
              title="SCHLAR Palettes & Theme System"
            >
              <div
                className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-300"
                style={{ backgroundColor: themeColors.primary }}
              />
              <span className="hidden lg:inline text-[11px] font-semibold">
                {activePaletteId === 'palette_7'
                  ? 'Petrol & Copper'
                  : SCHLAR_PALETTES.find((p) => p.id === activePaletteId)?.name || 'Theme'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    SCHLAR Palettes (12)
                  </span>
                  {activePaletteId === DEFAULT_PALETTE_ID && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      DEFAULT
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
                  {SCHLAR_PALETTES.map((p) => {
                    const isSel = activePaletteId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setThemePalette(p.id);
                          setShowThemeMenu(false);
                        }}
                        className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                          isSel
                            ? 'bg-slate-100 text-slate-900 ring-1 ring-theme'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex -space-x-1 shrink-0">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white"
                            style={{ backgroundColor: p.colors.primary }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-white"
                            style={{ backgroundColor: p.colors.accent }}
                          />
                        </div>
                        <span className="truncate text-[11px]">
                          {p.number}. {p.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <button
                    onClick={() => {
                      setShowThemeMenu(false);
                      setIsThemeModalOpen(true);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg text-xs font-bold text-theme-primary bg-theme-light hover:opacity-90 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    Open Custom Theme Editor
                  </button>
                  <button
                    onClick={() => {
                      resetThemeToDefault();
                      setShowThemeMenu(false);
                    }}
                    className="w-full py-1 px-2 rounded-lg text-[10px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Petrol & Copper (Default)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search trigger */}
          <button
            onClick={() => setQuickSearchOpen(true)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors hidden sm:flex items-center justify-center"
            title="Search (Ctrl+K)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Reset Demo Data button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Demo Data"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Reset Demo</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-emerald-700 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {roleNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications for this role.
                    </div>
                  ) : (
                    roleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setShowNotifMenu(false);
                          if (notif.targetModule) {
                            setCurrentPage(notif.targetModule);
                          }
                        }}
                        className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors text-xs ${
                          !notif.read ? 'bg-emerald-50/40 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`font-semibold ${
                              notif.priority === 'urgent' ? 'text-rose-700' : 'text-slate-900'
                            }`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="hidden lg:block text-right">
                <span className="block text-xs font-bold text-slate-900 truncate max-w-[120px]">
                  {currentRoleInfo.subtitle}
                </span>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
                  {currentRoleInfo.title.split('/')[0]}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {currentRoleInfo.subtitle.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentRoleInfo.subtitle}</p>
                  <p className="text-[11px] text-slate-500">Greenfield International School</p>
                </div>

                <button
                  onClick={() => {
                    switchRoleAndNavigate(currentRole, 'profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View Role Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowRoleMenu(true);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Repeat className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Switch Role (10 Roles)</span>
                </button>

                <button
                  onClick={() => {
                    setIsWelcomeScreen(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span>Exit to Welcome Screen</span>
                </button>

                <button
                  onClick={() => {
                    setShowResetConfirm(true);
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                  <span>Reset All Demo Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Reset Demo Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-center text-slate-600 mt-2 leading-relaxed">
              This will restore all students, marks, attendance records, fees, and transactions back to initial factory demo state.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Role Selector Modal (Responsive across all viewports) */}
      {showRoleMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Switch Active Role
                </span>
                <span className="text-xs font-bold text-slate-900">
                  SCHLAR 10 Approved Roles
                </span>
              </div>
              <button
                onClick={() => setShowRoleMenu(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 text-xs transition-colors"
                aria-label="Close role menu"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Administration & Operations
              </div>
              <div className="space-y-0.5">
                {(
                  [
                    'principal',
                    'vice_principal',
                    'accountant',
                    'hr',
                    'librarian',
                    'transport',
                    'receptionist',
                    'exam_coordinator'
                  ] as RoleType[]
                ).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                      currentRole === r
                        ? 'font-bold text-theme-primary bg-theme-light ring-1 ring-theme'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold text-slate-900">{roleLabels[r].title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{roleLabels[r].subtitle}</div>
                    </div>
                    {currentRole === r && <Check className="w-4 h-4 text-theme-primary shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Faculty & Parent Mobile Roles
                </div>
                <div className="space-y-0.5">
                  {(['teacher', 'teacher_mobile', 'parent_mobile'] as RoleType[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors ${
                        currentRole === r
                          ? 'font-bold text-theme-primary bg-theme-light ring-1 ring-theme'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate mr-2 flex items-center gap-2">
                        {roleLabels[r].platform === 'mobile' ? (
                          <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <div className="font-semibold text-slate-900">{roleLabels[r].title}</div>
                          <div className="text-[10px] text-slate-400 truncate">{roleLabels[r].subtitle}</div>
                        </div>
                      </div>
                      {currentRole === r && <Check className="w-4 h-4 text-theme-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
