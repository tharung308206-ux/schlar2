// Interactive Modals for SCHLAR
function getModalsScript() {
  return `
    // Add Student Modal
    function openAddStudentModal() {
      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Add New Student</h3>
            <p class="text-xs text-slate-500">Greenfield International School Admissions Directory</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <form onsubmit="handleAddStudent(event)" class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <input type="text" name="name" required placeholder="e.g. Kavya Deshmukh" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Admission Number *</label>
              <input type="text" name="admissionId" required value="GIS-2024-\${Math.floor(100 + Math.random() * 900)}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Enrolled Class *</label>
              <select name="className" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
                <option value="Grade 8A">Grade 8A</option>
                <option value="Grade 8B">Grade 8B</option>
                <option value="Grade 9A">Grade 9A</option>
                <option value="Grade 10A" selected>Grade 10A</option>
                <option value="Grade 10B">Grade 10B</option>
                <option value="Grade 11A">Grade 11A</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Roll Number *</label>
              <input type="text" name="rollNo" required placeholder="e.g. 29" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
              <input type="text" name="parentName" required placeholder="e.g. Anand Deshmukh" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Parent Contact Phone *</label>
              <input type="tel" name="parentPhone" required placeholder="+91 98450 99887" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select name="gender" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <input type="text" name="bloodGroup" value="O+" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90">Save Student</button>
          </div>
        </form>
      \`);
    }

    // Edit Student Modal
    function openEditStudentModal(id) {
      const s = state.students.find(item => item.id === id);
      if (!s) return;
      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Edit Student Record</h3>
            <p class="text-xs text-slate-500">Updating \${s.name} (\${s.admissionId})</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <form onsubmit="handleEditStudent(event, '\${s.id}')" class="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <input type="text" name="name" required value="\${s.name}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Enrolled Class *</label>
              <select name="className" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
                <option value="Grade 8A" \${s.className === 'Grade 8A' ? 'selected' : ''}>Grade 8A</option>
                <option value="Grade 8B" \${s.className === 'Grade 8B' ? 'selected' : ''}>Grade 8B</option>
                <option value="Grade 9A" \${s.className === 'Grade 9A' ? 'selected' : ''}>Grade 9A</option>
                <option value="Grade 10A" \${s.className === 'Grade 10A' ? 'selected' : ''}>Grade 10A</option>
                <option value="Grade 10B" \${s.className === 'Grade 10B' ? 'selected' : ''}>Grade 10B</option>
                <option value="Grade 11A" \${s.className === 'Grade 11A' ? 'selected' : ''}>Grade 11A</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Roll Number *</label>
              <input type="text" name="rollNo" required value="\${s.rollNo}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Parent Name *</label>
              <input type="text" name="parentName" required value="\${s.parentName}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Parent Phone *</label>
              <input type="tel" name="parentPhone" required value="\${s.parentPhone}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select name="status" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
                <option value="Active" \${s.status === 'Active' ? 'selected' : ''}>Active</option>
                <option value="Inactive" \${s.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
              </select>
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90">Save Changes</button>
          </div>
        </form>
      \`);
    }

    // Student Profile Modal
    function openStudentProfileModal(id) {
      const s = state.students.find(item => item.id === id);
      if (!s) return;
      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-theme-primary text-white font-extrabold flex items-center justify-center text-lg">
              \${s.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">\${s.name}</h3>
              <p class="text-xs text-slate-500 font-mono">\${s.admissionId} · \${s.className} (Roll #\${s.rollNo})</p>
            </div>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <div class="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <!-- Key Metrics -->
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-[11px] text-slate-400 font-semibold block">Attendance</span>
              <span class="text-base font-extrabold text-emerald-600">\${s.attendanceRate}%</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-[11px] text-slate-400 font-semibold block">Academics</span>
              <span class="text-base font-extrabold text-theme-primary">\${s.academicStatus}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-[11px] text-slate-400 font-semibold block">Enrollment</span>
              <span class="text-base font-extrabold text-slate-700">\${s.status}</span>
            </div>
          </div>

          <!-- Personal & Family Information -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Personal & Family Details</h4>
            <div class="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div><span class="text-slate-400">Parent/Guardian:</span> <strong class="text-slate-700 block">\${s.parentName}</strong></div>
              <div><span class="text-slate-400">Emergency Phone:</span> <strong class="text-slate-700 block font-mono">\${s.parentPhone}</strong></div>
              <div><span class="text-slate-400">Date of Birth:</span> <strong class="text-slate-700 block">\${s.dob || '2010-05-15'}</strong></div>
              <div><span class="text-slate-400">Blood Group:</span> <strong class="text-slate-700 block">\${s.bloodGroup || 'O+'}</strong></div>
              <div class="col-span-2"><span class="text-slate-400">Residential Address:</span> <strong class="text-slate-700 block">\${s.address || 'Bengaluru, Karnataka'}</strong></div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300">Close</button>
        </div>
      \`);
    }

    // Record Payment Modal
    function openRecordPaymentModal(studentId = '') {
      const studentOptions = state.students.map(s => {
        const fee = state.fees.find(f => f.studentId === s.id);
        const pending = fee ? fee.pending : 0;
        return \`<option value="\${s.id}" \${s.id === studentId ? 'selected' : ''}>\${s.name} (\${s.className}) — Pending: ₹\${pending.toLocaleString()}</option>\`;
      }).join('');

      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Record Fee Collection</h3>
            <p class="text-xs text-slate-500">Greenfield Bursar Office & Finance Treasury</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <form onsubmit="handleRecordPayment(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Select Student *</label>
            <select name="studentId" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
              \${studentOptions}
            </select>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Payment Amount (₹) *</label>
              <input type="number" name="amount" required min="1000" step="500" value="40000" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme font-mono">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Payment Method *</label>
              <select name="method" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
                <option value="UPI" selected>UPI / QR Scan</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cash">Cash (Counter)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Reference / UTR Number *</label>
              <input type="text" name="refNo" required value="UPI/\${Math.floor(100000000 + Math.random()*900000000)}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme font-mono">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input type="date" name="date" required value="\${new Date().toISOString().split('T')[0]}" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90">Record Payment & Generate Receipt</button>
          </div>
        </form>
      \`);
    }

    // Receipt Modal
    function openReceiptModal(receiptNo) {
      const p = state.payments.find(item => item.receiptNo === receiptNo);
      if (!p) return;
      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center">✓</div>
            <div>
              <h3 class="text-base font-bold text-slate-900">Official Payment Receipt</h3>
              <p class="text-xs text-slate-500 font-mono">\${p.receiptNo}</p>
            </div>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <div class="p-6 space-y-5 text-sm">
          <div class="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <strong class="text-slate-800 text-base font-extrabold">Greenfield International School</strong>
              <p class="text-xs text-slate-400">Affiliation No. 1930211 · Bengaluru, India</p>
            </div>
            <div class="text-right">
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">PAID</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div><span class="text-slate-400">Student Name:</span> <strong class="text-slate-800 block text-sm">\${p.studentName}</strong></div>
            <div><span class="text-slate-400">Class & Section:</span> <strong class="text-slate-800 block text-sm">\${p.className}</strong></div>
            <div><span class="text-slate-400">Payment Date:</span> <strong class="text-slate-800 block font-mono">\${p.date}</strong></div>
            <div><span class="text-slate-400">Method:</span> <strong class="text-slate-800 block font-mono">\${p.method}</strong></div>
            <div><span class="text-slate-400">Transaction Ref:</span> <strong class="text-slate-800 block font-mono">\${p.refNo}</strong></div>
            <div><span class="text-slate-400">Bursar Cashier:</span> <strong class="text-slate-800 block">\${p.cashier || 'Ramanathan K.'}</strong></div>
          </div>
          <div class="flex items-center justify-between p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 font-extrabold">
            <span>Total Amount Received:</span>
            <span class="text-xl">₹\${p.amount.toLocaleString()}</span>
          </div>
        </div>
        <div class="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span class="text-xs text-slate-400">Computer generated receipt · Valid without signature</span>
          <button onclick="window.print()" class="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700">Print / Save PDF</button>
        </div>
      \`);
    }

    // Create Assignment Modal
    function openCreateAssignmentModal() {
      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Create New Assignment</h3>
            <p class="text-xs text-slate-500">Publish digital homework task for students</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <form onsubmit="handleCreateAssignment(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Assignment Title *</label>
            <input type="text" name="title" required placeholder="e.g. Newton Laws of Motion Problem Set" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Target Class *</label>
              <select name="className" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
                <option value="Grade 10A" selected>Grade 10A</option>
                <option value="Grade 10B">Grade 10B</option>
                <option value="Grade 8A">Grade 8A</option>
                <option value="Grade 9A">Grade 9A</option>
                <option value="Grade 11A">Grade 11A</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
              <input type="text" name="subject" required value="Mathematics" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-slate-700 mb-1">Due Date *</label>
              <input type="date" name="dueDate" required value="2026-10-15" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Instructions & Description</label>
            <textarea name="description" rows="3" placeholder="Provide guidelines, textbook page references, and submission criteria..." class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme"></textarea>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90">Publish Assignment</button>
          </div>
        </form>
      \`);
    }

    // Check In Visitor Modal
    function openCheckInVisitorModal() {
      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Check In Campus Visitor</h3>
            <p class="text-xs text-slate-500">Security Gate & Front Desk Access Log</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <form onsubmit="handleCheckInVisitor(event)" class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Visitor Full Name *</label>
              <input type="text" name="name" required placeholder="e.g. Mr. Rajesh Khanna" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Contact Phone *</label>
              <input type="tel" name="phone" required placeholder="+91 98450 44556" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Purpose of Visit *</label>
              <input type="text" name="purpose" required placeholder="e.g. Admission Inquiry Grade 8" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Person to Meet *</label>
              <input type="text" name="personToMeet" required placeholder="e.g. Admissions Coordinator" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
            </div>
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90">Generate Visitor Badge & Check In</button>
          </div>
        </form>
      \`);
    }

    // Issue Book Modal
    function openIssueBookModal() {
      const studentOptions = state.students.map(s => \`<option value="\${s.id}">\${s.name} (\${s.className})</option>\`).join('');
      const bookOptions = state.books.filter(b => b.availableCopies > 0).map(b => \`<option value="\${b.id}">\${b.title} (\${b.availableCopies} available)</option>\`).join('');

      openModal(\`
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Issue Library Book</h3>
            <p class="text-xs text-slate-500">Greenfield Library Commons Circulation Desk</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center font-bold text-lg">&times;</button>
        </div>
        <form onsubmit="handleIssueBook(event)" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Select Book (In Stock) *</label>
            <select name="bookId" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
              \${bookOptions || '<option disabled>No books currently available in stock</option>'}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Borrowing Student *</label>
            <select name="studentId" required class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
              \${studentOptions}
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Due Date (14 Days standard) *</label>
            <input type="date" name="dueDate" required value="2026-10-12" class="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary focus:ring-1 focus:ring-theme">
          </div>
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-md hover:opacity-90">Issue Book</button>
          </div>
        </form>
      \`);
    }

    // Quick Search Modal
    function openQuickSearchModal() {
      openModal(\`
        <div class="p-4 border-b border-slate-100 flex items-center gap-3">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="quick-search-input" oninput="handleQuickSearch(this.value)" placeholder="Search students, faculty, classes, modules..." autofocus class="w-full text-base focus:outline-none text-slate-800 placeholder-slate-400">
          <button onclick="closeModal()" class="text-xs px-2 py-1 rounded bg-slate-100 text-slate-500 font-mono">ESC</button>
        </div>
        <div id="quick-search-results" class="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          <div class="text-xs text-slate-400 uppercase font-semibold">Suggested Modules</div>
          <div onclick="setActiveTab('students'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs font-medium">
            <span>👨‍🎓 Students Directory</span>
            <span class="text-slate-400">Module</span>
          </div>
          <div onclick="setActiveTab('attendance'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs font-medium">
            <span>✓ Class Attendance Roll Call</span>
            <span class="text-slate-400">Module</span>
          </div>
          <div onclick="setActiveTab('finance'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs font-medium">
            <span>₹ Fee Collections & Ledger</span>
            <span class="text-slate-400">Module</span>
          </div>
        </div>
      \`);
    }

    // Reset Demo Data Confirmation Modal
    function openResetDataModal() {
      openModal(\`
        <div class="p-6 text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Reset all demo data?</h3>
            <p class="text-xs text-slate-500 mt-1">This will restore the original SCHLAR demo data for Greenfield International School and clear all changes from localStorage.</p>
          </div>
          <div class="pt-4 flex items-center justify-center gap-3">
            <button onclick="closeModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onclick="resetDemoData()" class="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md">Reset Everything</button>
          </div>
        </div>
      \`);
    }
  `;
}

module.exports = { getModalsScript };
