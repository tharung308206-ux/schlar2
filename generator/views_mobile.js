// Mobile Role Views (Teacher Mobile and Parent Mobile) for SCHLAR
function getMobileViewsScript() {
  return `
    function renderMobileApp() {
      const isParent = state.currentRole === 'parent_mobile' || state.currentRole === 'parent';
      const roleTitle = isParent ? 'SCHLAR Parent Portal' : 'SCHLAR Teacher Assistant';

      return \`
        <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
          <!-- Top Desktop Bar for Mobile Preview Control -->
          <div class="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
            <button onclick="selectPlatform('web')" class="flex items-center gap-1.5 hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              <span>Back to Web Platform</span>
            </button>
            <div class="flex items-center gap-2">
              <button onclick="selectRole(state.currentRole === 'teacher_mobile' ? 'parent_mobile' : 'teacher_mobile')" class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-semibold">
                Switch: \${isParent ? 'Teacher' : 'Parent'}
              </button>
              <button onclick="switchRole()" class="hover:text-white">Role Picker</button>
            </div>
          </div>

          <!-- Smartphone Shell Container -->
          <div class="w-full max-w-sm bg-white rounded-[40px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col h-[760px] relative">
            <!-- Mobile Status Bar -->
            <div class="bg-slate-900 text-white px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
              <span>9:41</span>
              <div class="w-20 h-4 bg-black rounded-full mx-auto"></div>
              <div class="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            <!-- Mobile App Header -->
            <div class="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-lg bg-theme-primary flex items-center justify-center font-bold text-xs text-white">
                  EC
                </div>
                <div>
                  <h3 class="font-extrabold text-xs tracking-tight leading-tight">\${roleTitle}</h3>
                  <p class="text-[10px] text-slate-400">Greenfield International School</p>
                </div>
              </div>
              <button onclick="signOut()" title="Sign Out" class="text-slate-400 hover:text-rose-400 text-xs">
                Exit
              </button>
            </div>

            <!-- Mobile Content Area -->
            <div class="flex-1 overflow-y-auto bg-slate-50 p-4">
              \${isParent ? renderParentMobileContent() : renderTeacherMobileContent()}
            </div>

            <!-- Mobile Bottom Tab Navigation Bar -->
            <div class="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shrink-0 z-10">
              \${isParent ? \`
                <button onclick="setActiveTab('overview')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'overview' || state.activeTab === 'dashboard' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  <span>Home</span>
                </button>
                <button onclick="setActiveTab('attendance')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'attendance' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span>Attendance</span>
                </button>
                <button onclick="setActiveTab('fees')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'fees' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                  <span>Fees</span>
                </button>
                <button onclick="setActiveTab('chat')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'chat' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                  <span>Messages</span>
                </button>
              \` : \`
                <button onclick="setActiveTab('dashboard')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'dashboard' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <span>Schedule</span>
                </button>
                <button onclick="setActiveTab('attendance')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'attendance' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  <span>Roll Call</span>
                </button>
                <button onclick="setActiveTab('tasks')" class="flex flex-col items-center gap-1 text-[10px] font-bold \${state.activeTab === 'tasks' ? 'text-theme-primary' : 'text-slate-400'}">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                  <span>Assignments</span>
                </button>
              \`}
            </div>
          </div>
        </div>
      \`;
    }

    // Teacher Mobile Content
    function renderTeacherMobileContent() {
      const tab = state.activeTab;

      if (tab === 'attendance') {
        const presentCount = state.todayRollCall.filter(r => r.status === 'Present').length;
        const total = state.todayRollCall.length;
        return \`
          <div class="space-y-3">
            <div class="flex items-center justify-between pb-1">
              <div>
                <h4 class="font-bold text-sm text-slate-800">Roll Call · Grade 10A</h4>
                <p class="text-[11px] text-slate-400">Tap to toggle student status</p>
              </div>
              <button onclick="handleSaveAttendance()" class="px-3 py-1.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-sm">
                Save (\${presentCount}/\${total})
              </button>
            </div>

            <div class="space-y-2">
              \${state.todayRollCall.map(r => \`
                <div class="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
                  <div class="flex items-center gap-2.5">
                    <span class="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold font-mono flex items-center justify-center">\${r.rollNo}</span>
                    <span class="font-bold text-xs text-slate-900">\${r.studentName}</span>
                  </div>
                  <div class="flex gap-1">
                    <button onclick="handleToggleAttendance('\${r.studentId}', 'Present')" class="px-2 py-0.5 rounded text-[10px] font-bold \${r.status === 'Present' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}">P</button>
                    <button onclick="handleToggleAttendance('\${r.studentId}', 'Absent')" class="px-2 py-0.5 rounded text-[10px] font-bold \${r.status === 'Absent' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}">A</button>
                    <button onclick="handleToggleAttendance('\${r.studentId}', 'Late')" class="px-2 py-0.5 rounded text-[10px] font-bold \${r.status === 'Late' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}">L</button>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      }

      // Default: Teacher Daily Schedule
      return \`
        <div class="space-y-4">
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md">
            <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Today's Teaching Schedule</span>
            <h4 class="text-base font-extrabold mt-0.5">Dr. Vikram Sharma</h4>
            <p class="text-xs text-slate-400">Senior STEM Faculty · 3 Classes Today</p>
          </div>

          <div class="space-y-2.5">
            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-slate-400">08:30 - 09:15 AM · Room 204</span>
                <h5 class="text-xs font-bold text-slate-800">Physics Lecture · Grade 10A</h5>
              </div>
              <button onclick="setActiveTab('attendance')" class="px-2.5 py-1 rounded-lg bg-theme-light text-theme-primary text-[11px] font-bold">
                Roll Call →
              </button>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-slate-400">09:15 - 10:00 AM · Room 102</span>
                <h5 class="text-xs font-bold text-slate-800">Advanced Mathematics · Grade 8A</h5>
              </div>
              <span class="text-xs font-semibold text-slate-400">Next</span>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-slate-400">10:20 - 11:05 AM · Science Lab</span>
                <h5 class="text-xs font-bold text-slate-800">Optics Practical Lab · Grade 10B</h5>
              </div>
              <span class="text-xs font-semibold text-slate-400">Upcoming</span>
            </div>
          </div>
        </div>
      \`;
    }

    // Parent Mobile Content
    function renderParentMobileContent() {
      const childKey = state.selectedChild || 'aarav';
      const child = state.children[childKey] || state.children.aarav;
      const tab = state.activeTab;

      // Header Child Switcher (Mandatory Requirement)
      const switcherHtml = \`
        <div class="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs mb-3">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">Selected Ward Profile</div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="selectChild('aarav')" class="p-2 rounded-xl text-left border transition-all \${childKey === 'aarav' ? 'bg-theme-light border-theme-primary ring-1 ring-theme' : 'border-slate-100 hover:bg-slate-50'}">
              <span class="font-bold text-xs text-slate-900 block truncate">Aarav Sharma</span>
              <span class="text-[10px] text-slate-500">Grade 8A · Roll 12</span>
            </button>
            <button onclick="selectChild('ananya')" class="p-2 rounded-xl text-left border transition-all \${childKey === 'ananya' ? 'bg-theme-light border-theme-primary ring-1 ring-theme' : 'border-slate-100 hover:bg-slate-50'}">
              <span class="font-bold text-xs text-slate-900 block truncate">Ananya Sharma</span>
              <span class="text-[10px] text-slate-500">Grade 5B · Roll 06</span>
            </button>
          </div>
        </div>
      \`;

      if (tab === 'chat') {
        return \`
          \${switcherHtml}
          <div class="flex flex-col h-[520px]">
            <div class="flex items-center gap-2 pb-2 mb-2 border-b border-slate-200">
              <div class="w-8 h-8 rounded-full bg-theme-primary text-white font-bold flex items-center justify-center text-xs">VS</div>
              <div>
                <h4 class="font-bold text-xs text-slate-900">Dr. Vikram Sharma</h4>
                <p class="text-[10px] text-slate-400">Class Teacher (\${child.grade})</p>
              </div>
            </div>

            <!-- Messages Stream -->
            <div class="flex-1 overflow-y-auto space-y-2.5 pr-1">
              \${state.messages.map(m => \`
                <div class="flex flex-col \${m.senderRole === 'Parent' ? 'items-end' : 'items-start'}">
                  <div class="p-2.5 rounded-2xl max-w-[85%] text-xs \${m.senderRole === 'Parent' ? 'bg-theme-primary text-white rounded-br-none shadow-xs' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'}">
                    <p>\${m.text}</p>
                  </div>
                  <span class="text-[9px] text-slate-400 mt-0.5 px-1 font-mono">\${m.time}</span>
                </div>
              \`).join('')}
            </div>

            <!-- Input Form -->
            <form onsubmit="handleSendParentMessage(event)" class="mt-2 pt-2 border-t border-slate-200 flex gap-1.5">
              <input type="text" id="parent-chat-input" required placeholder="Type message to class teacher..." class="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white">
              <button type="submit" class="px-3 py-2 bg-theme-primary text-white text-xs font-bold rounded-xl shadow-xs">
                Send
              </button>
            </form>
          </div>
        \`;
      }

      if (tab === 'fees') {
        return \`
          \${switcherHtml}
          <div class="space-y-3">
            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs text-slate-400 font-semibold">Tuition Status</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">\${child.feeStatus}</span>
              </div>
              <div class="text-xl font-extrabold text-slate-900">
                \${child.pendingFee === 0 ? '₹0 Pending' : '₹' + child.pendingFee.toLocaleString() + ' Due'}
              </div>
              <p class="text-[11px] text-slate-500">AY 2026–2027 Term 1 & 2 Dues</p>
            </div>

            <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h5 class="font-bold text-xs text-slate-800">Recent Payment Receipts</h5>
              <div class="divide-y divide-slate-100">
                <div class="py-2 flex items-center justify-between text-xs">
                  <div>
                    <strong class="font-mono text-slate-800">RCP-2026-1044</strong>
                    <span class="block text-[10px] text-slate-400">Sep 15, 2026 · UPI</span>
                  </div>
                  <button onclick="openReceiptModal('RCP-2026-1044')" class="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                    Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>
        \`;
      }

      // Default: Parent Overview Tab
      return \`
        \${switcherHtml}
        <div class="space-y-3">
          <!-- Child Snapshot Card -->
          <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Student Dashboard</span>
              <h4 class="text-base font-extrabold mt-0.5">\${child.name}</h4>
              <p class="text-xs text-slate-400">\${child.grade} · Admission ID: \${child.admissionId}</p>
            </div>
            <div class="text-center">
              <span class="text-xl font-extrabold text-emerald-400 block">\${child.attendanceRate}%</span>
              <span class="text-[10px] text-slate-400">Attendance</span>
            </div>
          </div>

          <!-- Academic Performance Pills -->
          <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <h5 class="text-xs font-bold text-slate-800">Recent Term 1 Subject Scores</h5>
            <div class="space-y-1.5">
              \${child.recentMarks.map(m => \`
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-600 font-medium">\${m.subject}</span>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-900">\${m.score}</span>
                    <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">\${m.grade}</span>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-2 gap-2">
            <button onclick="setActiveTab('chat')" class="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-theme-primary shadow-xs">
              <span class="block text-xs font-bold text-slate-800">Chat Teacher</span>
              <span class="text-[10px] text-slate-400">Dr. Vikram Sharma</span>
            </button>
            <button onclick="setActiveTab('fees')" class="p-3 bg-white rounded-xl border border-slate-200 text-left hover:border-theme-primary shadow-xs">
              <span class="block text-xs font-bold text-slate-800">Fee Status</span>
              <span class="text-[10px] text-emerald-600 font-bold">\${child.feeStatus}</span>
            </button>
          </div>
        </div>
      \`;
    }
  `;
}

module.exports = { getMobileViewsScript };
