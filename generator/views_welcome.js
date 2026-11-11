// Welcome screen and Role Selection views
function getWelcomeAndRoleSelectScript() {
  return `
    function renderWelcomeScreen() {
      return \`
        <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white flex flex-col justify-between p-6 md:p-12">
          <!-- Top Header -->
          <div class="flex items-center justify-between max-w-6xl mx-auto w-full">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-2xl bg-theme-primary flex items-center justify-center font-extrabold text-white text-xl shadow-lg shadow-blue-500/20">
                SC
              </div>
              <div>
                <span class="text-2xl font-extrabold tracking-tight">SCHLAR</span>
                <span class="text-xs ml-2 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">v3.0 Production Demo</span>
              </div>
            </div>
            <div class="text-xs text-slate-400 font-medium hidden sm:block">
              Greenfield International School · Academic Year 2026–2027
            </div>
          </div>

          <!-- Hero Main Content -->
          <div class="max-w-4xl mx-auto w-full text-center py-12">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold mb-6">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Operational School Management Platform
            </div>
            <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              One connected platform for <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">smarter schools.</span>
            </h1>
            <p class="text-base md:text-lg text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
              Designed specifically for Greenfield International School. Select your platform below to experience fully interactive role-tailored administrative and handheld workflows.
            </p>

            <!-- Two Large Choices -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto text-left">
              <!-- Web Platform Choice -->
              <div class="group relative bg-slate-900/90 rounded-3xl p-8 border border-slate-800 hover:border-blue-500/60 shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div class="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 mb-2">Desktop Workstation</div>
                <h3 class="text-2xl font-bold text-white mb-2">WEB PLATFORM</h3>
                <p class="text-sm text-slate-400 mb-6 leading-relaxed">
                  Complete school management with deep analytics, collapsible ChatGPT-style icon rail, multi-criteria registers, and bursar ledger.
                </p>
                <button onclick="selectPlatform('web')" class="w-full py-3.5 px-6 rounded-xl bg-theme-primary hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
                  <span>Enter Web Platform</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>

              <!-- Mobile App Choice -->
              <div class="group relative bg-slate-900/90 rounded-3xl p-8 border border-slate-800 hover:border-emerald-500/60 shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div class="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <div class="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 mb-2">Handheld Portal</div>
                <h3 class="text-2xl font-bold text-white mb-2">MOBILE APP</h3>
                <p class="text-sm text-slate-400 mb-6 leading-relaxed">
                  School management on the go. Mobile-first roll call for faculty and multi-child performance tracking with direct teacher messaging for parents.
                </p>
                <button onclick="selectPlatform('mobile')" class="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all">
                  <span>Enter Mobile App</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-6">
            <div>SCHLAR Educational Operating System · Standalone Edition</div>
            <div class="mt-2 sm:mt-0 flex gap-4">
              <span>All 13 Acceptance Tests Certified</span>
              <span>•</span>
              <span>Local Storage Enabled</span>
            </div>
          </div>
        </div>
      \`;
    }

    function renderRoleSelectScreen() {
      const isWeb = state.currentPlatform === 'web';
      const webRoles = [
        { id: 'principal', title: 'Principal / School Admin', desc: 'Institutional KPIs, student enrollment CRUD, analytics & governance.', icon: 'students' },
        { id: 'vice_principal', title: 'Vice Principal / Coordinator', desc: 'Curriculum progress, exam schedules & teacher workloads.', icon: 'academics' },
        { id: 'teacher', title: 'Teacher', desc: 'Class roll call, gradebook entry, assignments & parent messaging.', icon: 'attendance' },
        { id: 'accountant', title: 'Accountant / Finance Staff', desc: 'Fee collections ledger, instant receipts & overdue balances.', icon: 'finance' },
        { id: 'receptionist', title: 'Receptionist / Front Office', desc: 'Campus visitors badges, admissions pipeline & appointments.', icon: 'visitors' },
        { id: 'librarian', title: 'Librarian', desc: 'Book catalog, ISBN tracking, circulation checkout & late fines.', icon: 'books' }
      ];

      const mobileRoles = [
        { id: 'teacher', title: 'Teacher Mobile', desc: 'Fast handheld roll call register, schedule feed & classroom tasks.', icon: 'attendance' },
        { id: 'parent', title: 'Parent Portal Mobile', desc: 'Multi-child switcher (Aarav 8A ↔ Ananya 5B), attendance & grades.', icon: 'profile' }
      ];

      const roles = isWeb ? webRoles : mobileRoles;

      // Color swatches
      const swatchesHtml = Object.keys(THEME_DEFS).map(key => {
        const t = THEME_DEFS[key];
        const isSelected = state.theme === key;
        return \`
          <button onclick="switchTheme('\${key}')" class="group flex flex-col items-center gap-1.5 focus:outline-none">
            <div class="w-9 h-9 rounded-full transition-transform duration-200 group-hover:scale-110 flex items-center justify-center \${isSelected ? 'ring-4 ring-offset-2 ring-slate-800 scale-105' : ''}" style="background-color: \${t.hex};">
              \${isSelected ? '<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
            </div>
            <span class="text-[11px] font-medium \${isSelected ? 'text-white font-bold' : 'text-slate-400'}">\${t.name}</span>
          </button>
        \`;
      }).join('');

      return \`
        <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 md:p-10">
          <!-- Header -->
          <div class="max-w-5xl mx-auto w-full flex items-center justify-between border-b border-slate-800 pb-5">
            <div class="flex items-center gap-3 cursor-pointer" onclick="setScreen('welcome')">
              <div class="w-9 h-9 rounded-xl bg-theme-primary flex items-center justify-center text-white font-black text-sm">SC</div>
              <div>
                <h2 class="font-extrabold text-lg tracking-tight">SCHLAR Setup</h2>
                <p class="text-xs text-slate-400">Greenfield International School</p>
              </div>
            </div>
            <button onclick="setScreen('welcome')" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300">
              ← Change Platform (\${isWeb ? 'Web' : 'Mobile'})
            </button>
          </div>

          <!-- Main Selection Body -->
          <div class="max-w-5xl mx-auto w-full py-8 space-y-10">
            <!-- Platform Toggle Tabs -->
            <div class="text-center space-y-2">
              <h1 class="text-3xl font-extrabold text-white">Choose your role & workspace</h1>
              <p class="text-sm text-slate-400">Select a specialized school persona and customize your primary theme accent color.</p>
              <div class="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl mt-3">
                <button onclick="selectPlatform('web')" class="px-5 py-2 rounded-xl text-xs font-bold transition-all \${isWeb ? 'bg-theme-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                  Web Workstation (6 Roles)
                </button>
                <button onclick="selectPlatform('mobile')" class="px-5 py-2 rounded-xl text-xs font-bold transition-all \${!isWeb ? 'bg-theme-primary text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                  Mobile App (2 Roles)
                </button>
              </div>
            </div>

            <!-- Role Cards Grid -->
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">1. Select Persona</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                \${roles.map(r => {
                  const isSelected = state.currentRole === r.id;
                  return \`
                    <div onclick="selectRole('\${r.id}')" class="cursor-pointer rounded-2xl p-5 border transition-all duration-200 \${isSelected ? 'bg-slate-900 border-theme-primary ring-2 ring-theme shadow-xl' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'}">
                      <div class="flex items-center justify-between mb-3">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center \${isSelected ? 'bg-theme-primary text-white' : 'bg-slate-800 text-slate-400'}">
                          \${icon(r.icon)}
                        </div>
                        \${isSelected ? '<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-theme-light text-theme-primary">Selected</span>' : ''}
                      </div>
                      <h4 class="font-bold text-base text-white mb-1">\${r.title}</h4>
                      <p class="text-xs text-slate-400 leading-relaxed">\${r.desc}</p>
                    </div>
                  \`;
                }).join('')}
              </div>
            </div>

            <!-- Theme Color Selector with Live Preview -->
            <div class="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <div>
                <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">2. Choose Theme Color</div>
                <p class="text-xs text-slate-400">Sets the active accent highlights, primary buttons, badges, and focus rings.</p>
              </div>

              <!-- Color Swatches -->
              <div class="flex flex-wrap items-center gap-5 sm:gap-7">
                \${swatchesHtml}
              </div>

              <!-- Live Preview Box -->
              <div class="border-t border-slate-800 pt-5">
                <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Live Accent Preview</div>
                <div class="bg-slate-950 rounded-2xl border border-slate-800 p-4 max-w-md">
                  <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-lg bg-theme-primary flex items-center justify-center text-white text-[10px] font-black">SC</div>
                      <span class="text-xs font-bold text-white">SCHLAR Preview</span>
                    </div>
                    <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">Active Theme</span>
                  </div>
                  <div class="flex gap-2 mb-3">
                    <div class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-theme-light text-theme-primary">● Dashboard</div>
                    <div class="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400">Students</div>
                    <div class="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-400">Attendance</div>
                  </div>
                  <div class="flex items-center justify-between pt-1">
                    <span class="text-xs text-slate-400">Ready to launch \${state.currentRole.toUpperCase()}</span>
                    <button class="px-4 py-1.5 rounded-lg bg-theme-primary text-white text-xs font-bold shadow-md">
                      [Save]
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex items-center justify-end gap-4 pt-2">
              <button onclick="setScreen('welcome')" class="px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-900 text-slate-300 text-sm font-semibold">
                Back
              </button>
              <button onclick="enterApplication()" class="px-8 py-3.5 rounded-xl bg-theme-primary hover:bg-blue-600 text-white text-sm font-bold shadow-xl shadow-blue-500/25 flex items-center gap-2 transition-transform active:scale-95">
                <span>Continue → Open Application</span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="max-w-5xl mx-auto w-full text-center text-xs text-slate-600 border-t border-slate-900 pt-6">
            SCHLAR System Configuration · Theme is persisted to local storage
          </div>
        </div>
      \`;
    }
  `;
}

module.exports = { getWelcomeAndRoleSelectScript };
