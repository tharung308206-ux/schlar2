// Web Role Views and Sidebar for SCHLAR Standalone HTML
function getWebViewsScript() {
  return `
    // Role metadata definitions
    const ROLE_CONFIGS = {
      principal: {
        title: 'Principal / School Admin',
        name: 'Dr. Arthur Campbell',
        avatar: 'AC',
        roleBadge: 'Administrator',
        quickAction: { label: '+ New Student', action: 'openAddStudentModal()' },
        nav: [
          { group: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
          { group: 'PEOPLE', items: [
            { id: 'students', label: 'Students', icon: 'students' },
            { id: 'teachers', label: 'Teachers', icon: 'teachers' },
            { id: 'staff', label: 'Staff Roster', icon: 'users' },
            { id: 'classes', label: 'Classes', icon: 'classes' }
          ]},
          { group: 'ACADEMICS', items: [
            { id: 'attendance', label: 'Attendance', icon: 'attendance' },
            { id: 'timetable', label: 'Timetable', icon: 'timetable' },
            { id: 'exams', label: 'Exams', icon: 'exams' },
            { id: 'assignments', label: 'Assignments', icon: 'assignments' }
          ]},
          { group: 'MANAGEMENT', items: [
            { id: 'notices', label: 'Notices', icon: 'notices' },
            { id: 'finance', label: 'Finance & Fees', icon: 'finance' },
            { id: 'reports', label: 'Reports', icon: 'reports' }
          ]},
          { group: 'SYSTEM', items: [
            { id: 'settings', label: 'Settings', icon: 'settings' },
            { id: 'profile', label: 'My Profile', icon: 'profile' }
          ]}
        ]
      },
      vice_principal: {
        title: 'Vice Principal / Coordinator',
        name: 'Mrs. Evelyn Hayes',
        avatar: 'EH',
        roleBadge: 'Academic Dean',
        quickAction: { label: '+ New Notice', action: 'openNewNoticeModal()' },
        nav: [
          { group: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
          { group: 'ACADEMICS', items: [
            { id: 'classes', label: 'Classes & Sections', icon: 'classes' },
            { id: 'teachers', label: 'Teachers', icon: 'teachers' },
            { id: 'attendance', label: 'Attendance', icon: 'attendance' },
            { id: 'exams', label: 'Exams', icon: 'exams' },
            { id: 'marks', label: 'Marks Moderation', icon: 'marks' },
            { id: 'assignments', label: 'Assignments', icon: 'assignments' },
            { id: 'timetable', label: 'Timetable Matrix', icon: 'timetable' }
          ]},
          { group: 'COMMUNICATION', items: [
            { id: 'notices', label: 'Notices', icon: 'notices' },
            { id: 'reports', label: 'Academic Reports', icon: 'reports' }
          ]},
          { group: 'SYSTEM', items: [
            { id: 'settings', label: 'Settings', icon: 'settings' },
            { id: 'profile', label: 'My Profile', icon: 'profile' }
          ]}
        ]
      },
      teacher: {
        title: 'Teacher (Web Workstation)',
        name: 'Dr. Vikram Sharma',
        avatar: 'VS',
        roleBadge: 'STEM Faculty',
        quickAction: { label: '+ New Assignment', action: 'openCreateAssignmentModal()' },
        nav: [
          { group: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
          { group: 'TEACHING', items: [
            { id: 'my_classes', label: 'My Classes', icon: 'classes' },
            { id: 'students', label: 'Students', icon: 'students' },
            { id: 'attendance', label: 'Roll Call Register', icon: 'attendance' },
            { id: 'marks', label: 'Gradebook Marks', icon: 'marks' },
            { id: 'assignments', label: 'Assignments', icon: 'assignments' }
          ]},
          { group: 'SCHEDULE', items: [
            { id: 'timetable', label: 'My Timetable', icon: 'timetable' },
            { id: 'exams', label: 'Exam Duties', icon: 'exams' },
            { id: 'notices', label: 'Notices', icon: 'notices' }
          ]},
          { group: 'ACCOUNT', items: [
            { id: 'profile', label: 'My Profile', icon: 'profile' }
          ]}
        ]
      },
      accountant: {
        title: 'Accountant / Finance Staff',
        name: 'Alok Saxena',
        avatar: 'AS',
        roleBadge: 'Bursar',
        quickAction: { label: '+ Record Payment', action: 'openRecordPaymentModal()' },
        nav: [
          { group: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
          { group: 'FEES & INFLOWS', items: [
            { id: 'fees', label: 'Students & Fees', icon: 'finance' },
            { id: 'collections', label: 'Record Collection', icon: 'payment' },
            { id: 'receipts', label: 'Official Receipts', icon: 'receipt' },
            { id: 'reports', label: 'Financial Audit', icon: 'reports' }
          ]},
          { group: 'SYSTEM', items: [
            { id: 'settings', label: 'Settings', icon: 'settings' },
            { id: 'profile', label: 'My Profile', icon: 'profile' }
          ]}
        ]
      },
      receptionist: {
        title: 'Receptionist / Front Desk',
        name: 'Kavita Chawla',
        avatar: 'KC',
        roleBadge: 'Front Office',
        quickAction: { label: '+ Add Visitor', action: 'openCheckInVisitorModal()' },
        nav: [
          { group: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
          { group: 'FRONT DESK', items: [
            { id: 'visitors', label: 'Campus Visitors', icon: 'users' },
            { id: 'admissions', label: 'Admissions Pipeline', icon: 'students' },
            { id: 'appointments', label: 'Appointments Log', icon: 'timetable' },
            { id: 'students', label: 'Student Directory', icon: 'students' },
            { id: 'notices', label: 'Campus Notices', icon: 'notices' }
          ]},
          { group: 'ACCOUNT', items: [
            { id: 'profile', label: 'My Profile', icon: 'profile' }
          ]}
        ]
      },
      librarian: {
        title: 'Librarian / Commons',
        name: 'Nandini Krishnan',
        avatar: 'NK',
        roleBadge: 'Media Lead',
        quickAction: { label: '+ Issue Book', action: 'openIssueBookModal()' },
        nav: [
          { group: 'MAIN', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' }] },
          { group: 'CIRCULATION', items: [
            { id: 'books', label: 'Books Catalog', icon: 'book' },
            { id: 'issue_return', label: 'Issue / Return', icon: 'sync' },
            { id: 'fines', label: 'Overdue Fines', icon: 'finance' },
            { id: 'reports', label: 'Library Reports', icon: 'reports' }
          ]},
          { group: 'SYSTEM', items: [
            { id: 'settings', label: 'Settings', icon: 'settings' },
            { id: 'profile', label: 'My Profile', icon: 'profile' }
          ]}
        ]
      }
    };

    // Render Web Shell
    function renderWebApp() {
      const cfg = ROLE_CONFIGS[state.currentRole] || ROLE_CONFIGS.principal;
      const isCollapsed = !!state.sidebarCollapsed;
      const sidebarWidthClass = isCollapsed ? 'w-[72px]' : 'w-[260px]';

      return \`
        <div class="flex h-screen overflow-hidden bg-slate-50 font-sans">
          <!-- Collapsible ChatGPT-style Sidebar -->
          <aside class="\${sidebarWidthClass} bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-all duration-300 shrink-0 select-none z-30">
            <!-- Top brand & toggle -->
            <div class="p-3 border-b border-slate-800/80">
              <div class="flex items-center \${isCollapsed ? 'justify-center' : 'justify-between'} mb-3">
                <div class="flex items-center gap-2.5 overflow-hidden">
                  <div class="w-8 h-8 rounded-xl bg-theme-primary flex items-center justify-center font-extrabold text-white text-xs shrink-0 shadow-md">
                    SC
                  </div>
                  \${!isCollapsed ? \`
                    <div class="leading-tight truncate">
                      <div class="font-extrabold text-white text-sm tracking-tight">SCHLAR</div>
                      <div class="text-[10px] text-slate-400 truncate">Greenfield Int. School</div>
                    </div>
                  \` : ''}
                </div>
                <!-- Collapse / Expand toggle button -->
                <button onclick="toggleSidebar()" title="\${isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}" class="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                  <svg class="w-4 h-4 transform \${isCollapsed ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
                </button>
              </div>

              <!-- Quick Action Button -->
              \${!isCollapsed ? \`
                <button onclick="\${cfg.quickAction.action}" class="w-full py-2 px-3 rounded-xl bg-theme-primary hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98">
                  <span>\${cfg.quickAction.label}</span>
                </button>
              \` : \`
                <div class="has-tooltip flex justify-center">
                  <button onclick="\${cfg.quickAction.action}" class="w-10 h-10 rounded-xl bg-theme-primary text-white flex items-center justify-center font-bold text-base shadow-md">
                    +
                  </button>
                  <span class="tooltip-text px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700">\${cfg.quickAction.label}</span>
                </div>
              \`}

              <!-- Search button -->
              <div class="mt-2">
                \${!isCollapsed ? \`
                  <button onclick="openQuickSearchModal()" class="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-between transition-colors border border-slate-700/60">
                    <div class="flex items-center gap-2">
                      <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      <span>Search...</span>
                    </div>
                    <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">⌘K</span>
                  </button>
                \` : \`
                  <div class="has-tooltip flex justify-center">
                    <button onclick="openQuickSearchModal()" class="w-10 h-10 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </button>
                    <span class="tooltip-text px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700">Quick Search (⌘K)</span>
                  </div>
                \`}
              </div>
            </div>

            <!-- Navigation Links Scroll Area -->
            <div class="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              \${cfg.nav.map(section => \`
                <div>
                  \${!isCollapsed ? \`
                    <div class="px-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">\${section.group}</div>
                  \` : \`
                    <div class="border-t border-slate-800/60 my-2"></div>
                  \`}
                  <div class="space-y-0.5">
                    \${section.items.map(item => {
                      const isActive = state.activeTab === item.id;
                      const activeClass = isActive
                        ? 'bg-theme-primary text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 font-medium';

                      if (isCollapsed) {
                        return \`
                          <div class="has-tooltip flex justify-center">
                            <button onclick="setActiveTab('\${item.id}')" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all \${activeClass}">
                              <span class="w-4 h-4">\${icon(item.icon)}</span>
                            </button>
                            <span class="tooltip-text px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700">\${item.label}</span>
                          </div>
                        \`;
                      }

                      return \`
                        <button onclick="setActiveTab('\${item.id}')" class="w-full py-2 px-3 rounded-xl flex items-center gap-3 text-xs transition-all \${activeClass}">
                          <span class="w-4 h-4 shrink-0 \${isActive ? 'text-white' : 'text-slate-400'}">\${icon(item.icon)}</span>
                          <span class="truncate">\${item.label}</span>
                        </button>
                      \`;
                    }).join('')}
                  </div>
                </div>
              \`).join('')}
            </div>

            <!-- Footer: Role Switcher & Profile -->
            <div class="p-3 border-t border-slate-800/80 bg-slate-950/40">
              \${!isCollapsed ? \`
                <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/60">
                  <div class="flex items-center gap-2 overflow-hidden">
                    <div class="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center shrink-0">
                      \${cfg.avatar}
                    </div>
                    <div class="truncate">
                      <div class="text-xs font-bold text-white truncate">\${cfg.name}</div>
                      <div class="text-[10px] text-slate-400">\${cfg.roleBadge}</div>
                    </div>
                  </div>
                  <button onclick="signOut()" title="Sign Out / Back to Portal" class="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  </button>
                </div>
                <div class="flex items-center gap-1.5">
                  <button onclick="switchRole()" class="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors text-center">
                    Switch Role
                  </button>
                  <button onclick="selectPlatform('mobile')" class="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 transition-colors" title="Mobile Mode">
                    📱 Mobile
                  </button>
                </div>
              \` : \`
                <div class="has-tooltip flex justify-center">
                  <button onclick="switchRole()" class="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center">
                    \${cfg.avatar}
                  </button>
                  <span class="tooltip-text px-2.5 py-1 rounded-md bg-slate-800 text-white text-xs font-semibold shadow-xl border border-slate-700">\${cfg.name} (\${cfg.roleBadge}) · Click to Switch Role</span>
                </div>
              \`}
            </div>
          </aside>

          <!-- Main Right Container (TopBar + Content View) -->
          <div class="flex-1 flex flex-col h-screen overflow-hidden">
            <!-- Top Bar -->
            <header class="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-20">
              <div class="flex items-center gap-3">
                <h2 class="text-base font-bold text-slate-800 capitalize tracking-tight">
                  \${state.activeTab.replace('_', ' ')}
                </h2>
                <span class="text-slate-300">/</span>
                <span class="text-xs text-slate-500 font-medium">Greenfield International School</span>
                <span class="text-[11px] px-2.5 py-0.5 rounded-full bg-theme-light text-theme-primary font-bold border border-theme-border">
                  \${cfg.title}
                </span>
              </div>

              <div class="flex items-center gap-3">
                <!-- Theme Accent Swatch Quick Switcher -->
                <div class="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  \${Object.keys(THEME_DEFS).slice(0, 5).map(tk => \`
                    <button onclick="switchTheme('\${tk}')" title="\${THEME_DEFS[tk].name}" class="w-4 h-4 rounded-full transition-transform hover:scale-125 \${state.theme === tk ? 'ring-2 ring-offset-1 ring-slate-700 scale-110' : ''}" style="background-color: \${THEME_DEFS[tk].hex}"></button>
                  \`).join('')}
                  <button onclick="setActiveTab('settings')" title="More settings" class="text-slate-400 hover:text-slate-700 text-xs px-1 font-bold">⚙</button>
                </div>

                <!-- Notifications Bell -->
                <button onclick="showToast('Campus Notification', 'School Annual Sports Meet registration closes this Friday.');" class="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                </button>

                <!-- Switch Role Quick Dropdown Trigger -->
                <button onclick="switchRole()" class="text-xs px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors">
                  <span>Switch Role</span>
                  <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>

                <!-- Sign Out -->
                <button onclick="signOut()" class="text-xs px-2.5 py-1.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-medium">
                  Exit
                </button>
              </div>
            </header>

            <!-- Main Scrollable Workspace -->
            <main class="flex-1 overflow-y-auto p-6">
              \${renderModuleContent()}
            </main>
          </div>
        </div>
      \`;
    }

    // Dynamic Module Content Dispatcher
    function renderModuleContent() {
      const tab = state.activeTab;
      const role = state.currentRole;

      if (tab === 'settings') return renderSettingsView();
      if (tab === 'profile') return renderProfileView();

      if (role === 'principal') {
        if (tab === 'dashboard') return renderPrincipalDashboard();
        if (tab === 'students') return renderStudentsModule();
        if (tab === 'teachers') return renderTeachersModule();
        if (tab === 'staff') return renderStaffModule();
        if (tab === 'classes') return renderClassesModule();
        if (tab === 'attendance') return renderAttendanceModule();
        if (tab === 'timetable') return renderTimetableModule();
        if (tab === 'exams') return renderExamsModule();
        if (tab === 'assignments') return renderAssignmentsModule();
        if (tab === 'notices') return renderNoticesModule();
        if (tab === 'finance') return renderFinanceModule();
        if (tab === 'reports') return renderReportsModule();
      }

      if (role === 'vice_principal') {
        if (tab === 'dashboard') return renderVicePrincipalDashboard();
        if (tab === 'classes') return renderClassesModule();
        if (tab === 'teachers') return renderTeachersModule();
        if (tab === 'attendance') return renderAttendanceModule();
        if (tab === 'exams') return renderExamsModule();
        if (tab === 'marks') return renderMarksModule();
        if (tab === 'assignments') return renderAssignmentsModule();
        if (tab === 'timetable') return renderTimetableModule();
        if (tab === 'notices') return renderNoticesModule();
        if (tab === 'reports') return renderReportsModule();
      }

      if (role === 'teacher') {
        if (tab === 'dashboard') return renderTeacherDashboard();
        if (tab === 'my_classes') return renderTeacherMyClasses();
        if (tab === 'students') return renderTeacherStudents();
        if (tab === 'attendance') return renderTeacherAttendanceRollCall();
        if (tab === 'marks') return renderMarksModule();
        if (tab === 'assignments') return renderAssignmentsModule();
        if (tab === 'timetable') return renderTimetableModule();
        if (tab === 'exams') return renderExamsModule();
        if (tab === 'notices') return renderNoticesModule();
      }

      if (role === 'accountant') {
        if (tab === 'dashboard') return renderAccountantDashboard();
        if (tab === 'fees') return renderFeesModule();
        if (tab === 'collections') return renderCollectionsModule();
        if (tab === 'receipts') return renderReceiptsModule();
        if (tab === 'reports') return renderFinanceReportsModule();
      }

      if (role === 'receptionist') {
        if (tab === 'dashboard') return renderReceptionistDashboard();
        if (tab === 'visitors') return renderVisitorsModule();
        if (tab === 'admissions') return renderAdmissionsPipelineModule();
        if (tab === 'appointments') return renderAppointmentsModule();
        if (tab === 'students') return renderStudentsModule(true);
        if (tab === 'notices') return renderNoticesModule();
      }

      if (role === 'librarian') {
        if (tab === 'dashboard') return renderLibrarianDashboard();
        if (tab === 'books') return renderBooksModule();
        if (tab === 'issue_return') return renderIssueReturnModule();
        if (tab === 'fines') return renderFinesModule();
        if (tab === 'reports') return renderLibraryReportsModule();
      }

      // Default fallback view
      return renderPrincipalDashboard();
    }

    // -------------------------------------------------------------
    // MODULE VIEWS IMPLEMENTATIONS
    // -------------------------------------------------------------

    // 1. Principal Dashboard
    function renderPrincipalDashboard() {
      const activeCount = state.students.filter(s => s.status === 'Active').length;
      const totalFeesDue = state.fees.reduce((acc, f) => acc + f.pending, 0);

      return \`
        <div class="space-y-6">
          <!-- Institutional Welcome Header -->
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold mb-2 border border-slate-700">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                Campus Live Operational State · AY 2026-2027
              </div>
              <h2 class="text-2xl font-extrabold tracking-tight">Principal Governance Overview</h2>
              <p class="text-xs text-slate-400 mt-1 max-w-xl">
                Dr. Arthur Campbell · Overseeing Greenfield International School across academics, bursar inflows, faculty workload, and compliance.
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button onclick="openAddStudentModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-lg hover:opacity-90 flex items-center gap-2">
                <span>+ Enrol Student</span>
              </button>
              <button onclick="setActiveTab('finance')" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700">
                Ledger Review
              </button>
            </div>
          </div>

          <!-- 8 Primary Institutional KPIs -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Total Students</span>
              <div class="flex items-baseline justify-between mt-1">
                <span class="text-2xl font-extrabold text-slate-800">\${activeCount}</span>
                <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12 new</span>
              </div>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Faculty & Staff</span>
              <div class="flex items-baseline justify-between mt-1">
                <span class="text-2xl font-extrabold text-slate-800">\${state.teachers.length + 38}</span>
                <span class="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">100% On-Duty</span>
              </div>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Today's Attendance</span>
              <div class="flex items-baseline justify-between mt-1">
                <span class="text-2xl font-extrabold text-emerald-600">94.8%</span>
                <span class="text-[11px] font-bold text-slate-400">Target 95%</span>
              </div>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Outstanding Fees</span>
              <div class="flex items-baseline justify-between mt-1">
                <span class="text-2xl font-extrabold text-amber-600">₹\${(totalFeesDue/100000).toFixed(2)}L</span>
                <span class="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">\${state.fees.filter(f=>f.pending>0).length} pending</span>
              </div>
            </div>
          </div>

          <!-- Charts & Operations Matrix -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Attendance & Academic Trends -->
            <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-sm text-slate-800">Weekly Attendance Rate Across Sections</h3>
                  <p class="text-xs text-slate-400">Greenfield Campus Average: 94.6%</p>
                </div>
                <span class="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-1 rounded-lg">High Performance</span>
              </div>

              <!-- SVG Visual Chart Bar -->
              <div class="h-44 flex items-end justify-between gap-3 pt-6 px-4 pb-2 border-b border-slate-100">
                \${[
                  { day: 'Mon', rate: 95 },
                  { day: 'Tue', rate: 96 },
                  { day: 'Wed', rate: 94 },
                  { day: 'Thu', rate: 93 },
                  { day: 'Fri', rate: 97 },
                  { day: 'Today', rate: 95 }
                ].map(item => \`
                  <div class="flex-1 flex flex-col items-center gap-2">
                    <div class="text-[10px] font-bold text-slate-500 font-mono">\${item.rate}%</div>
                    <div class="w-full bg-slate-100 rounded-t-lg h-32 flex items-end">
                      <div class="w-full bg-theme-primary rounded-t-lg transition-all duration-500" style="height: \${(item.rate - 80) * 5}%;"></div>
                    </div>
                    <span class="text-[11px] font-semibold text-slate-500">\${item.day}</span>
                  </div>
                \`).join('')}
              </div>

              <!-- Quick Status List -->
              <div class="grid grid-cols-3 gap-3 pt-2 text-center">
                <div class="p-2.5 bg-slate-50 rounded-xl">
                  <span class="text-[11px] text-slate-400 block">Class 10A Lead</span>
                  <strong class="text-xs font-extrabold text-slate-700">96.2% Attendance</strong>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-xl">
                  <span class="text-[11px] text-slate-400 block">Class 8A Lead</span>
                  <strong class="text-xs font-extrabold text-slate-700">94.8% Attendance</strong>
                </div>
                <div class="p-2.5 bg-slate-50 rounded-xl">
                  <span class="text-[11px] text-slate-400 block">Library Checkouts</span>
                  <strong class="text-xs font-extrabold text-theme-primary">142 Books Active</strong>
                </div>
              </div>
            </div>

            <!-- Important Institutional Alerts & Notices -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 class="font-bold text-sm text-slate-800">Critical School Alerts</h3>
                  <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                </div>
                <div class="space-y-3 mt-4">
                  <div class="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
                    <div class="flex items-center justify-between text-xs font-bold text-amber-900">
                      <span>Term 1 Moderation Due</span>
                      <span class="text-[10px] font-mono">Today 5 PM</span>
                    </div>
                    <p class="text-[11px] text-amber-800 mt-1">Vice Principal moderation portal open for Grade 10 Math marks approval.</p>
                  </div>
                  <div class="p-3 bg-blue-50 rounded-xl border border-blue-200/80">
                    <div class="flex items-center justify-between text-xs font-bold text-blue-900">
                      <span>Campus Tour Inquiries</span>
                      <span class="text-[10px] font-mono">11:00 AM</span>
                    </div>
                    <p class="text-[11px] text-blue-800 mt-1">Receptionist has logged 4 prospective parent admissions tours.</p>
                  </div>
                  <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80">
                    <div class="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>Tuition Inflow Target</span>
                      <span class="text-[10px] font-mono">82% Rec</span>
                    </div>
                    <p class="text-[11px] text-emerald-800 mt-1">Bursar confirmed ₹42.8 Lakhs collected for Q2.</p>
                  </div>
                </div>
              </div>

              <button onclick="setActiveTab('notices')" class="mt-4 w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 text-center transition-colors">
                View All Notices & Circulars →
              </button>
            </div>
          </div>
        </div>
      \`;
    }

    // 2. Students Module
    function renderStudentsModule(readOnly = false) {
      return \`
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Students Enrollment Directory</h3>
              <p class="text-xs text-slate-400">Total active students: \${state.students.length} across Greenfield International School</p>
            </div>
            \${!readOnly ? \`
              <button onclick="openAddStudentModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
                <span>+ Enrol New Student</span>
              </button>
            \` : ''}
          </div>

          <!-- Filters & Search Toolbar -->
          <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2 w-full sm:w-80 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" id="students-table-search" oninput="filterStudentsTable(this.value)" placeholder="Search name, admission #, class..." class="bg-transparent text-xs w-full focus:outline-none text-slate-800">
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select id="students-class-filter" onchange="filterStudentsByClass(this.value)" class="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700">
                <option value="ALL">All Classes</option>
                <option value="Grade 8A">Grade 8A</option>
                <option value="Grade 8B">Grade 8B</option>
                <option value="Grade 9A">Grade 9A</option>
                <option value="Grade 10A">Grade 10A</option>
                <option value="Grade 10B">Grade 10B</option>
                <option value="Grade 11A">Grade 11A</option>
              </select>
            </div>
          </div>

          <!-- Students Data Table -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-700" id="students-table">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Student Name</th>
                    <th class="py-3 px-4">Admission ID</th>
                    <th class="py-3 px-4">Class & Roll</th>
                    <th class="py-3 px-4">Parent Contact</th>
                    <th class="py-3 px-4 text-center">Attendance</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${state.students.map(s => \`
                    <tr class="hover:bg-slate-50/80 transition-colors student-row" data-name="\${s.name.toLowerCase()}" data-class="\${s.className}" data-id="\${s.admissionId.toLowerCase()}">
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2.5">
                          <div class="w-8 h-8 rounded-xl bg-theme-light text-theme-primary font-extrabold flex items-center justify-center text-xs shrink-0">
                            \${s.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <span class="font-bold text-slate-900 block">\${s.name}</span>
                            <span class="text-[10px] text-slate-400">\${s.gender || 'Student'}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-4 font-mono font-medium text-slate-600">\${s.admissionId}</td>
                      <td class="py-3 px-4 font-semibold text-slate-800">\${s.className} <span class="text-slate-400 font-normal">#\${s.rollNo}</span></td>
                      <td class="py-3 px-4">
                        <span class="block font-medium text-slate-800">\${s.parentName}</span>
                        <span class="text-[10px] text-slate-400 font-mono">\${s.parentPhone}</span>
                      </td>
                      <td class="py-3 px-4 text-center">
                        <span class="font-bold \${s.attendanceRate >= 90 ? 'text-emerald-600' : 'text-amber-600'}">\${s.attendanceRate}%</span>
                      </td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}">
                          \${s.status}
                        </span>
                      </td>
                      <td class="py-3 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button onclick="openStudentProfileModal('\${s.id}')" title="View Profile" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900">
                            👁
                          </button>
                          \${!readOnly ? \`
                            <button onclick="openEditStudentModal('\${s.id}')" title="Edit Student" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900">
                              ✏️
                            </button>
                            <button onclick="handleDeleteStudent('\${s.id}')" title="Delete Student" class="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600">
                              🗑️
                            </button>
                          \` : ''}
                        </div>
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    // 3. Teachers Module
    function renderTeachersModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Faculty & Teacher Roster</h3>
              <p class="text-xs text-slate-400">Greenfield International School Academic Teaching Faculty</p>
            </div>
            <button onclick="showToast('Roster Exported', 'Faculty directory exported to CSV.');" class="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700">
              Export Roster
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            \${state.teachers.map(t => \`
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-theme-light text-theme-primary font-bold flex items-center justify-center text-sm">
                      \${t.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-slate-900">\${t.name}</h4>
                      <p class="text-xs text-slate-400">\${t.department}</p>
                    </div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">\${t.status}</span>
                </div>
                <div class="pt-2 border-t border-slate-100 text-xs space-y-1">
                  <div class="flex justify-between"><span class="text-slate-400">Classes:</span> <strong class="text-slate-700">\${t.assignedClasses.join(', ')}</strong></div>
                  <div class="flex justify-between"><span class="text-slate-400">Experience:</span> <strong class="text-slate-700">\${t.experience}</strong></div>
                  <div class="flex justify-between"><span class="text-slate-400">Email:</span> <span class="font-mono text-slate-600">\${t.email}</span></div>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 4. Staff Module
    function renderStaffModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Support & Administrative Staff</h3>
              <p class="text-xs text-slate-400">Campus administration, security, medical, and facilities</p>
            </div>
          </div>
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 text-sm text-slate-600">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-bold text-slate-800 text-sm">Front Office & Reception</h4>
                <p class="text-xs text-slate-400 mt-1">Lead: Kavita Chawla · 3 Assistants</p>
                <div class="mt-3 text-xs text-emerald-600 font-bold">● Active on campus</div>
              </div>
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-bold text-slate-800 text-sm">Bursar & Accounts Treasury</h4>
                <p class="text-xs text-slate-400 mt-1">Lead: Alok Saxena · 2 Cashiers</p>
                <div class="mt-3 text-xs text-emerald-600 font-bold">● Counter Open</div>
              </div>
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-bold text-slate-800 text-sm">Library Media Center</h4>
                <p class="text-xs text-slate-400 mt-1">Lead: Nandini Krishnan · 1 Media Aide</p>
                <div class="mt-3 text-xs text-emerald-600 font-bold">● Circulation Active</div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }

    // 5. Classes Module
    function renderClassesModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Classes & Section Matrix</h3>
              <p class="text-xs text-slate-400">Greenfield International School Academic Divisions</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            \${state.classes.map(c => \`
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="font-bold text-base text-slate-800">\${c.name}</h4>
                  <span class="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-0.5 rounded-full">\${c.room}</span>
                </div>
                <div class="space-y-1 text-xs">
                  <div class="flex justify-between"><span class="text-slate-400">Class Teacher:</span> <strong class="text-slate-700">\${c.teacher}</strong></div>
                  <div class="flex justify-between"><span class="text-slate-400">Enrollment:</span> <strong class="text-slate-700">\${c.studentsCount} Students</strong></div>
                  <div class="flex justify-between"><span class="text-slate-400">Attendance Avg:</span> <strong class="text-emerald-600 font-bold">\${c.attendanceAvg}%</strong></div>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button onclick="setActiveTab('students'); filterStudentsByClass('\${c.name}');" class="text-theme-primary hover:underline font-bold">
                    View Enrolled Students →
                  </button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 6. Attendance Overview
    function renderAttendanceModule() {
      return \`
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Campus Attendance Operations</h3>
              <p class="text-xs text-slate-400">Daily roll call rates and sections monitoring</p>
            </div>
            <button onclick="state.currentRole === 'teacher' ? setActiveTab('attendance') : switchRole()" class="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md">
              Open Interactive Roll Call Register
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Campus Total Enrolled</span>
              <span class="text-2xl font-extrabold text-slate-800 mt-1 block">1,248</span>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Present Today</span>
              <span class="text-2xl font-extrabold text-emerald-600 mt-1 block">1,183</span>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Absent</span>
              <span class="text-2xl font-extrabold text-rose-600 mt-1 block">52</span>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Late Entry</span>
              <span class="text-2xl font-extrabold text-amber-600 mt-1 block">13</span>
            </div>
          </div>
        </div>
      \`;
    }

    // 7. Teacher Attendance Roll Call Register
    function renderTeacherAttendanceRollCall() {
      const presentCount = state.todayRollCall.filter(r => r.status === 'Present').length;
      const absentCount = state.todayRollCall.filter(r => r.status === 'Absent').length;
      const lateCount = state.todayRollCall.filter(r => r.status === 'Late').length;
      const totalCount = state.todayRollCall.length;
      const pct = Math.round((presentCount / totalCount) * 100);

      return \`
        <div class="space-y-4">
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Roll Call Register</div>
              <h3 class="text-xl font-bold">Grade 10A · Physics & Mathematics</h3>
              <p class="text-xs text-slate-400 mt-0.5">Date: Today (\${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <span class="text-xs text-slate-400 block">Class Rate</span>
                <span class="text-lg font-extrabold text-emerald-400">\${pct}%</span>
              </div>
              <button onclick="handleSaveAttendance()" class="px-5 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
                <span>Save Roll Call</span>
              </button>
            </div>
          </div>

          <!-- Quick Stats Pills -->
          <div class="flex items-center gap-3 text-xs font-semibold">
            <span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              Present: \${presentCount}
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              Absent: \${absentCount}
            </span>
            <span class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              Late: \${lateCount}
            </span>
          </div>

          <!-- Interactive Roll Call List -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="divide-y divide-slate-100">
              \${state.todayRollCall.map(r => \`
                <div class="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                      \${r.rollNo}
                    </span>
                    <div>
                      <h4 class="font-bold text-sm text-slate-800">\${r.studentName}</h4>
                      <p class="text-[11px] text-slate-400">Roll #\${r.rollNo} · Grade 10A</p>
                    </div>
                  </div>

                  <!-- 3 Interactive Status Buttons -->
                  <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button onclick="handleToggleAttendance('\${r.studentId}', 'Present')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all \${r.status === 'Present' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                      Present
                    </button>
                    <button onclick="handleToggleAttendance('\${r.studentId}', 'Absent')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all \${r.status === 'Absent' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                      Absent
                    </button>
                    <button onclick="handleToggleAttendance('\${r.studentId}', 'Late')" class="px-3 py-1 rounded-lg text-xs font-bold transition-all \${r.status === 'Late' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}">
                      Late
                    </button>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        </div>
      \`;
    }

    // 8. Timetable Module
    function renderTimetableModule() {
      const schedule = [
        { period: 'Period 1 (08:30 - 09:15)', mon: 'Physics (Grade 10A)', tue: 'Mathematics (Grade 8A)', wed: 'Physics (Grade 10A)', thu: 'STEM Lab', fri: 'Physics (Grade 10A)' },
        { period: 'Period 2 (09:15 - 10:00)', mon: 'Mathematics (Grade 8A)', tue: 'Physics (Grade 10B)', wed: 'Mathematics (Grade 8A)', thu: 'Physics (Grade 10A)', fri: 'Math Problem Clinic' },
        { period: 'Recess (10:00 - 10:20)', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
        { period: 'Period 3 (10:20 - 11:05)', mon: 'Physics Lab', tue: 'Faculty Meeting', wed: 'Physics (Grade 10B)', thu: 'Mathematics (Grade 8A)', fri: 'Elective Physics' },
        { period: 'Period 4 (11:05 - 11:50)', mon: 'Study Hall', tue: 'STEM Lab', wed: 'Staff Mentoring', thu: 'Physics Lab', fri: 'Assembly' }
      ];

      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Academic Timetable Matrix</h3>
              <p class="text-xs text-slate-400">Class schedule and period distribution · AY 2026-2027</p>
            </div>
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700">
              Print Timetable
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Period / Time</th>
                    <th class="py-3 px-4">Monday</th>
                    <th class="py-3 px-4">Tuesday</th>
                    <th class="py-3 px-4">Wednesday</th>
                    <th class="py-3 px-4">Thursday</th>
                    <th class="py-3 px-4">Friday</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${schedule.map(row => \`
                    <tr class="hover:bg-slate-50/60">
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-800">\${row.period}</td>
                      <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-theme-light text-theme-primary font-semibold">\${row.mon}</span></td>
                      <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">\${row.tue}</span></td>
                      <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-theme-light text-theme-primary font-semibold">\${row.wed}</span></td>
                      <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold">\${row.thu}</span></td>
                      <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">\${row.fri}</span></td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    // 9. Exams Module
    function renderExamsModule() {
      const exams = [
        { name: 'Term 1 Mid-Term Assessments', grade: 'Grade 10A & 10B', subject: 'Physics & Mathematics', date: 'Oct 20, 2026', room: 'Hall A', status: 'Upcoming' },
        { name: 'Semester Laboratory Practicals', grade: 'Grade 9A', subject: 'Science & Chemistry', date: 'Oct 24, 2026', room: 'STEM Lab', status: 'Scheduled' },
        { name: 'National Olympiad Qualifier', grade: 'Selected Grades 8-11', subject: 'Mathematics & Computing', date: 'Nov 04, 2026', room: 'Auditorium', status: 'Registration Open' }
      ];

      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Examination Schedule</h3>
              <p class="text-xs text-slate-400">Greenfield International School Academic Assessment Registry</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            \${exams.map(e => \`
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">\${e.status}</span>
                  <span class="text-xs font-mono font-bold text-slate-500">\${e.date}</span>
                </div>
                <h4 class="font-bold text-sm text-slate-900">\${e.name}</h4>
                <div class="text-xs text-slate-600 space-y-1">
                  <div><span class="text-slate-400">Target:</span> \${e.grade}</div>
                  <div><span class="text-slate-400">Subjects:</span> \${e.subject}</div>
                  <div><span class="text-slate-400">Venue:</span> \${e.room}</div>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 10. Assignments Module
    function renderAssignmentsModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Homework & Digital Assignments</h3>
              <p class="text-xs text-slate-400">Active tasks assigned to Greenfield students</p>
            </div>
            <button onclick="openCreateAssignmentModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
              <span>+ Create Assignment</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            \${state.assignments.map(a => \`
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-0.5 rounded-full">\${a.className}</span>
                  <span class="text-xs font-mono font-semibold text-rose-600">Due: \${a.dueDate}</span>
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">\${a.title}</h4>
                  <p class="text-xs text-slate-500 mt-1">\${a.subject} · Assigned by \${a.teacher}</p>
                </div>
                \${a.description ? \`<p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">\${a.description}</p>\` : ''}
                <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span class="text-slate-400">Submissions: <strong class="text-slate-700">\${a.submissions} / \${a.total}</strong></span>
                  <button onclick="handleDeleteAssignment('\${a.id}')" class="text-rose-500 hover:text-rose-700 font-semibold">
                    Delete
                  </button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 11. Notices Module
    function renderNoticesModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Campus Circulars & Notices</h3>
              <p class="text-xs text-slate-400">Official bulletins issued by Greenfield International School Governance</p>
            </div>
          </div>

          <div class="space-y-3">
            \${state.notices.map(n => \`
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">\${n.category}</span>
                  <span class="text-xs font-mono text-slate-400">\${n.date}</span>
                </div>
                <h4 class="font-bold text-base text-slate-900">\${n.title}</h4>
                <p class="text-xs text-slate-600 leading-relaxed">\${n.content}</p>
                <div class="pt-2 text-[11px] text-slate-400 font-medium">Issued by: \${n.author}</div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 12. Finance & Fees Module (Accountant / Bursar Ledger)
    function renderFeesModule() {
      const totalCollected = state.fees.reduce((acc, f) => acc + f.paid, 0);
      const totalPending = state.fees.reduce((acc, f) => acc + f.pending, 0);

      return \`
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Student Tuition & Fee Ledger</h3>
              <p class="text-xs text-slate-400">Greenfield Bursar Department · AY 2026-2027</p>
            </div>
            <button onclick="openRecordPaymentModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
              <span>+ Record Payment</span>
            </button>
          </div>

          <!-- Summary Balance Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Total Fee Receivable</span>
              <span class="text-xl font-extrabold text-slate-800 mt-1 block">₹\${((totalCollected+totalPending)/100000).toFixed(2)}L</span>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Total Collected</span>
              <span class="text-xl font-extrabold text-emerald-600 mt-1 block">₹\${(totalCollected/100000).toFixed(2)}L</span>
            </div>
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span class="text-xs text-slate-400 font-semibold block">Outstanding Pending</span>
              <span class="text-xl font-extrabold text-amber-600 mt-1 block">₹\${(totalPending/100000).toFixed(2)}L</span>
            </div>
          </div>

          <!-- Fee Table -->
          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs text-slate-700">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Student</th>
                    <th class="py-3 px-4">Class</th>
                    <th class="py-3 px-4">Annual Fee</th>
                    <th class="py-3 px-4">Paid</th>
                    <th class="py-3 px-4">Pending</th>
                    <th class="py-3 px-4">Due Date</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${state.fees.map(f => \`
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3.5 px-4 font-bold text-slate-900">\${f.name}</td>
                      <td class="py-3.5 px-4 font-medium">\${f.className}</td>
                      <td class="py-3.5 px-4 font-mono">₹\${f.totalFee.toLocaleString()}</td>
                      <td class="py-3.5 px-4 font-mono text-emerald-600 font-bold">₹\${f.paid.toLocaleString()}</td>
                      <td class="py-3.5 px-4 font-mono font-bold \${f.pending > 0 ? 'text-amber-600' : 'text-slate-400'}">₹\${f.pending.toLocaleString()}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-500">\${f.dueDate}</td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${f.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
                          \${f.status}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        \${f.pending > 0 ? \`
                          <button onclick="openRecordPaymentModal('\${f.studentId}')" class="px-2.5 py-1 rounded-lg bg-theme-primary text-white text-[11px] font-bold shadow-sm hover:opacity-90">
                            Pay Dues
                          </button>
                        \` : \`
                          <span class="text-xs text-emerald-600 font-bold">✓ Cleared</span>
                        \`}
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    // 13. Official Receipts History
    function renderReceiptsModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Official Fee Payment Receipts</h3>
              <p class="text-xs text-slate-400">Greenfield Bursar Treasury Transaction Audit</p>
            </div>
            <button onclick="openRecordPaymentModal()" class="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md">
              + New Payment Receipt
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Receipt No.</th>
                    <th class="py-3 px-4">Student</th>
                    <th class="py-3 px-4">Class</th>
                    <th class="py-3 px-4">Amount Paid</th>
                    <th class="py-3 px-4">Payment Method</th>
                    <th class="py-3 px-4">Date</th>
                    <th class="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${state.payments.map(p => \`
                    <tr class="hover:bg-slate-50">
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-800">\${p.receiptNo}</td>
                      <td class="py-3.5 px-4 font-bold text-slate-900">\${p.studentName}</td>
                      <td class="py-3.5 px-4 font-medium">\${p.className}</td>
                      <td class="py-3.5 px-4 font-mono font-bold text-emerald-600">₹\${p.amount.toLocaleString()}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-600">\${p.method}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-500">\${p.date}</td>
                      <td class="py-3.5 px-4 text-right">
                        <button onclick="openReceiptModal('\${p.receiptNo}')" class="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700">
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    // 14. Visitors Module (Receptionist)
    function renderVisitorsModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Campus Visitor Access Log</h3>
              <p class="text-xs text-slate-400">Greenfield Main Gate Security & Front Desk Log</p>
            </div>
            <button onclick="openCheckInVisitorModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
              <span>+ Check In Visitor</span>
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Badge #</th>
                    <th class="py-3 px-4">Visitor Name</th>
                    <th class="py-3 px-4">Purpose</th>
                    <th class="py-3 px-4">Meeting With</th>
                    <th class="py-3 px-4">Entry Time</th>
                    <th class="py-3 px-4">Exit Time</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${state.visitors.map(v => \`
                    <tr class="hover:bg-slate-50">
                      <td class="py-3.5 px-4 font-mono font-bold text-slate-800">\${v.badgeNo}</td>
                      <td class="py-3.5 px-4">
                        <span class="font-bold text-slate-900 block">\${v.name}</span>
                        <span class="text-[10px] text-slate-400 font-mono">\${v.phone}</span>
                      </td>
                      <td class="py-3.5 px-4 text-slate-700 font-medium">\${v.purpose}</td>
                      <td class="py-3.5 px-4 text-slate-700 font-medium">\${v.personToMeet}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-600">\${v.entryTime}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-500">\${v.exitTime || '—'}</td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${v.status === 'Checked In' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}">
                          \${v.status}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        \${v.status === 'Checked In' ? \`
                          <button onclick="handleCheckOutVisitor('\${v.id}')" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold">
                            Check Out
                          </button>
                        \` : \`
                          <span class="text-slate-400 text-xs">Exited</span>
                        \`}
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    // 15. Books Catalog Module (Librarian)
    function renderBooksModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Library Books Catalog</h3>
              <p class="text-xs text-slate-400">Greenfield Media Commons Circulation Inventory</p>
            </div>
            <button onclick="openIssueBookModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90 flex items-center gap-2">
              <span>+ Issue Book to Student</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            \${state.books.map(b => \`
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">\${b.category}</span>
                  <span class="text-xs font-mono text-slate-400">ISBN: \${b.isbn}</span>
                </div>
                <div>
                  <h4 class="font-bold text-sm text-slate-900">\${b.title}</h4>
                  <p class="text-xs text-slate-500 mt-0.5">Author: \${b.author}</p>
                </div>
                <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span class="text-slate-400">Stock: </span>
                    <strong class="\${b.availableCopies > 0 ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-bold'}">
                      \${b.availableCopies} / \${b.totalCopies} Available
                    </strong>
                  </div>
                  \${b.availableCopies > 0 ? \`
                    <button onclick="openIssueBookModal()" class="px-2.5 py-1 rounded-lg bg-theme-light text-theme-primary font-bold hover:opacity-90">
                      Issue →
                    </button>
                  \` : \`
                    <span class="text-rose-500 font-semibold text-[11px]">Out of Stock</span>
                  \`}
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    // 16. Issue / Return Circulation (Librarian)
    function renderIssueReturnModule() {
      return \`
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-slate-800">Active Book Loans & Returns</h3>
              <p class="text-xs text-slate-400">Greenfield Library Circulation Desk</p>
            </div>
            <button onclick="openIssueBookModal()" class="px-4 py-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md">
              + Issue Book
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th class="py-3 px-4">Book Title</th>
                    <th class="py-3 px-4">Borrowing Student</th>
                    <th class="py-3 px-4">Class</th>
                    <th class="py-3 px-4">Issue Date</th>
                    <th class="py-3 px-4">Due Date</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${state.libraryTransactions.map(tx => \`
                    <tr class="hover:bg-slate-50">
                      <td class="py-3.5 px-4 font-bold text-slate-900">\${tx.bookTitle}</td>
                      <td class="py-3.5 px-4 font-semibold text-slate-800">\${tx.studentName}</td>
                      <td class="py-3.5 px-4 text-slate-600">\${tx.className}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-500">\${tx.issueDate}</td>
                      <td class="py-3.5 px-4 font-mono text-slate-700 font-bold">\${tx.dueDate}</td>
                      <td class="py-3.5 px-4">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${tx.status === 'Issued' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}">
                          \${tx.status}
                        </span>
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        \${tx.status === 'Issued' ? \`
                          <button onclick="handleReturnBook('\${tx.id}')" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm">
                            Return Book
                          </button>
                        \` : \`
                          <span class="text-slate-400 font-medium">Returned on \${tx.returnDate}</span>
                        \`}
                      </td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      \`;
    }

    // 17. Settings View
    function renderSettingsView() {
      return \`
        <div class="max-w-3xl space-y-6">
          <div>
            <h3 class="text-xl font-bold text-slate-800">Application Settings & Configuration</h3>
            <p class="text-xs text-slate-400">Manage visual theme, data resets, and institutional preferences</p>
          </div>

          <!-- Theme Accent Color System -->
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h4 class="font-bold text-sm text-slate-900">Primary Theme Accent Color</h4>
              <p class="text-xs text-slate-400 mt-0.5">Dynamically sets CSS variables --primary, button highlights, badge backgrounds, and focus rings.</p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              \${Object.keys(THEME_DEFS).map(tk => {
                const t = THEME_DEFS[tk];
                const isSelected = state.theme === tk;
                return \`
                  <button onclick="switchTheme('\${tk}')" class="p-3 rounded-xl border text-left flex items-center gap-3 transition-all \${isSelected ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-800' : 'border-slate-200 hover:bg-slate-50'}">
                    <span class="w-6 h-6 rounded-full shrink-0 shadow-sm" style="background-color: \${t.hex}"></span>
                    <div>
                      <span class="font-bold text-xs text-slate-800 block">\${t.name}</span>
                      <span class="text-[10px] text-slate-400 font-mono">\${t.hex}</span>
                    </div>
                  </button>
                \`;
              }).join('')}
            </div>
          </div>

          <!-- Demo Reset Section -->
          <div class="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-3">
            <div>
              <h4 class="font-bold text-sm text-rose-900">Reset Demo Data</h4>
              <p class="text-xs text-slate-500 mt-0.5">Wipes local modifications from localStorage and restores original Greenfield International School records.</p>
            </div>
            <button onclick="openResetDataModal()" class="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md">
              Reset Demo Records
            </button>
          </div>
        </div>
      \`;
    }

    // 18. Profile View
    function renderProfileView() {
      const cfg = ROLE_CONFIGS[state.currentRole] || ROLE_CONFIGS.principal;
      return \`
        <div class="max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div class="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div class="w-16 h-16 rounded-2xl bg-theme-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
              \${cfg.avatar}
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900">\${cfg.name}</h3>
              <p class="text-xs text-slate-500">\${cfg.title} · Greenfield International School</p>
              <span class="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-theme-light text-theme-primary border border-theme-border">
                \${cfg.roleBadge}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl"><span class="text-slate-400 block">Institution</span><strong class="text-slate-800">Greenfield International School</strong></div>
            <div class="p-3 bg-slate-50 rounded-xl"><span class="text-slate-400 block">Affiliation</span><strong class="text-slate-800">CBSE Affiliation #1930211</strong></div>
            <div class="p-3 bg-slate-50 rounded-xl"><span class="text-slate-400 block">Academic Year</span><strong class="text-slate-800">2026–2027</strong></div>
            <div class="p-3 bg-slate-50 rounded-xl"><span class="text-slate-400 block">Session Status</span><strong class="text-emerald-600 font-bold">Active Authenticated Demo</strong></div>
          </div>

          <div class="pt-2 flex justify-end gap-3">
            <button onclick="switchRole()" class="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700">
              Switch Institutional Role
            </button>
            <button onclick="signOut()" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50">
              Sign Out
            </button>
          </div>
        </div>
      \`;
    }

    // Role-specific Dashboards Fallbacks
    function renderVicePrincipalDashboard() { return renderPrincipalDashboard(); }
    function renderTeacherDashboard() { return renderTeacherAttendanceRollCall(); }
    function renderTeacherMyClasses() { return renderClassesModule(); }
    function renderTeacherStudents() { return renderStudentsModule(true); }
    function renderAccountantDashboard() { return renderFeesModule(); }
    function renderCollectionsModule() { return renderFeesModule(); }
    function renderFinanceReportsModule() { return renderFeesModule(); }
    function renderReceptionistDashboard() { return renderVisitorsModule(); }
    function renderAdmissionsPipelineModule() { return renderStudentsModule(true); }
    function renderAppointmentsModule() { return renderVisitorsModule(); }
    function renderLibrarianDashboard() { return renderBooksModule(); }
    function renderFinesModule() { return renderIssueReturnModule(); }
    function renderLibraryReportsModule() { return renderBooksModule(); }
    function renderReportsModule() { return renderAttendanceModule(); }
    function renderMarksModule() { return renderTeacherAttendanceRollCall(); }
    function renderFinanceModule() { return renderFeesModule(); }

    // Table Filtering Helpers
    function filterStudentsTable(term) {
      const q = term.toLowerCase();
      document.querySelectorAll('#students-table .student-row').forEach(row => {
        const name = row.getAttribute('data-name') || '';
        const id = row.getAttribute('data-id') || '';
        const cls = row.getAttribute('data-class') || '';
        row.style.display = (name.includes(q) || id.includes(q) || cls.toLowerCase().includes(q)) ? '' : 'none';
      });
    }

    function filterStudentsByClass(cls) {
      document.querySelectorAll('#students-table .student-row').forEach(row => {
        const rowClass = row.getAttribute('data-class');
        row.style.display = (cls === 'ALL' || rowClass === cls) ? '' : 'none';
      });
    }
  `;
}

module.exports = { getWebViewsScript };
