// Interactive Handlers and CRUD functions
function getActionsScript() {
  return `
    // Add Student
    function handleAddStudent(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const newStudent = {
        id: 's-' + Date.now(),
        name: formData.get('name').trim(),
        admissionId: formData.get('admissionId').trim(),
        className: formData.get('className'),
        rollNo: formData.get('rollNo').trim(),
        parentName: formData.get('parentName').trim(),
        parentPhone: formData.get('parentPhone').trim(),
        gender: formData.get('gender') || 'Male',
        bloodGroup: formData.get('bloodGroup') || 'O+',
        attendanceRate: 95.0,
        academicStatus: 'Good',
        status: 'Active',
        dob: '2011-01-01',
        address: 'Bengaluru, India'
      };

      state.students.unshift(newStudent);
      
      // Also add fee record for the student
      state.fees.unshift({
        studentId: newStudent.id,
        name: newStudent.name,
        className: newStudent.className,
        totalFee: 150000,
        paid: 0,
        pending: 150000,
        dueDate: '2026-10-30',
        status: 'Pending',
        parent: newStudent.parentName
      });

      saveState();
      closeModal();
      showToast('Student Added Successfully', \`\${newStudent.name} enrolled into \${newStudent.className}.\`);
      renderApp();
    }

    // Edit Student
    function handleEditStudent(event, id) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const student = state.students.find(s => s.id === id);
      if (!student) return;

      student.name = formData.get('name').trim();
      student.className = formData.get('className');
      student.rollNo = formData.get('rollNo').trim();
      student.parentName = formData.get('parentName').trim();
      student.parentPhone = formData.get('parentPhone').trim();
      student.status = formData.get('status') || 'Active';

      // Update in fees as well
      const fee = state.fees.find(f => f.studentId === id);
      if (fee) {
        fee.name = student.name;
        fee.className = student.className;
        fee.parent = student.parentName;
      }

      saveState();
      closeModal();
      showToast('Student Updated', \`Record for \${student.name} saved successfully.\`);
      renderApp();
    }

    // Delete Student
    function handleDeleteStudent(id) {
      const student = state.students.find(s => s.id === id);
      if (!student) return;
      if (confirm(\`Are you sure you want to withdraw and remove \${student.name} (\${student.admissionId})?\`)) {
        state.students = state.students.filter(s => s.id !== id);
        state.fees = state.fees.filter(f => f.studentId !== id);
        saveState();
        showToast('Student Removed', \`\${student.name} record was deleted.\`, 'info');
        renderApp();
      }
    }

    // Roll Call Attendance marking
    function handleToggleAttendance(studentId, newStatus) {
      const record = state.todayRollCall.find(r => r.studentId === studentId);
      if (record) {
        record.status = newStatus;
        renderApp();
      }
    }

    function handleSaveAttendance() {
      // Calculate new percentage for class 10A
      const presentCount = state.todayRollCall.filter(r => r.status === 'Present').length;
      const totalCount = state.todayRollCall.length;
      const pct = Math.round((presentCount / totalCount) * 100);

      // Update Grade 10A class stats
      const cls = state.classes.find(c => c.name === 'Grade 10A');
      if (cls) {
        cls.attendanceAvg = pct;
      }

      saveState();
      showToast('Attendance Saved Successfully', \`Grade 10A roll call updated: \${presentCount} Present, \${totalCount - presentCount} Absent/Late (\${pct}% rate).\`);
      renderApp();
    }

    // Record Payment
    function handleRecordPayment(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const studentId = formData.get('studentId');
      const amount = parseInt(formData.get('amount'), 10);
      const method = formData.get('method');
      const refNo = formData.get('refNo');
      const date = formData.get('date');

      const student = state.students.find(s => s.id === studentId);
      const fee = state.fees.find(f => f.studentId === studentId);

      if (!student || !fee) return;

      // Update fee balances
      fee.paid += amount;
      fee.pending = Math.max(0, fee.totalFee - fee.paid);
      fee.status = fee.pending === 0 ? 'Paid' : 'Partial';

      const receiptNo = 'RCP-2026-' + Math.floor(1000 + Math.random() * 9000);
      const newPayment = {
        receiptNo,
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        amount,
        date,
        method,
        refNo,
        cashier: state.profiles.accountant.name
      };

      state.payments.unshift(newPayment);
      saveState();
      closeModal();
      showToast('Payment Recorded Successfully', \`₹\${amount.toLocaleString()} received via \${method} for \${student.name}.\`);
      renderApp();
      // Automatically pop up official receipt
      setTimeout(() => openReceiptModal(receiptNo), 400);
    }

    // Check In Visitor
    function handleCheckInVisitor(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newVisitor = {
        id: 'v-' + Date.now(),
        name: formData.get('name').trim(),
        phone: formData.get('phone').trim(),
        purpose: formData.get('purpose').trim(),
        personToMeet: formData.get('personToMeet').trim(),
        badgeNo: 'VIS-' + Math.floor(100 + Math.random() * 900),
        entryTime: timeStr,
        exitTime: null,
        status: 'Checked In',
        date: now.toISOString().split('T')[0]
      };

      state.visitors.unshift(newVisitor);
      saveState();
      closeModal();
      showToast('Visitor Checked In', \`Badge \${newVisitor.badgeNo} issued to \${newVisitor.name}.\`);
      renderApp();
    }

    // Check Out Visitor
    function handleCheckOutVisitor(id) {
      const visitor = state.visitors.find(v => v.id === id);
      if (!visitor) return;
      const now = new Date();
      visitor.exitTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      visitor.status = 'Checked Out';
      saveState();
      showToast('Visitor Checked Out', \`\${visitor.name} marked checked out at \${visitor.exitTime}.\`);
      renderApp();
    }

    // Issue Book
    function handleIssueBook(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const bookId = formData.get('bookId');
      const studentId = formData.get('studentId');
      const dueDate = formData.get('dueDate');

      const book = state.books.find(b => b.id === bookId);
      const student = state.students.find(s => s.id === studentId);

      if (!book || !student) return;
      if (book.availableCopies <= 0) {
        showToast('Out of Stock', 'No copies available for issue at this time.', 'error');
        return;
      }

      // Decrement copies
      book.availableCopies -= 1;
      if (book.availableCopies === 0) book.status = 'Out of Stock';

      // Create transaction
      const tx = {
        id: 'tx-' + Date.now(),
        bookId: book.id,
        bookTitle: book.title,
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate,
        returnDate: null,
        status: 'Issued',
        fine: 0
      };

      state.libraryTransactions.unshift(tx);
      saveState();
      closeModal();
      showToast('Book Issued Successfully', \`"\${book.title}" checked out to \${student.name}. Available: \${book.availableCopies}\`);
      renderApp();
    }

    // Return Book
    function handleReturnBook(txId) {
      const tx = state.libraryTransactions.find(t => t.id === txId);
      if (!tx || tx.status === 'Returned') return;

      const book = state.books.find(b => b.id === tx.bookId);
      if (book) {
        book.availableCopies += 1;
        book.status = 'Available';
      }

      tx.returnDate = new Date().toISOString().split('T')[0];
      tx.status = 'Returned';

      saveState();
      showToast('Book Returned', \`"\${tx.bookTitle}" returned by \${tx.studentName}. Stock restored.\`);
      renderApp();
    }

    // Create Assignment
    function handleCreateAssignment(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);

      const asg = {
        id: 'a-' + Date.now(),
        title: formData.get('title').trim(),
        className: formData.get('className'),
        subject: formData.get('subject').trim(),
        teacher: state.profiles.teacher.name,
        dueDate: formData.get('dueDate'),
        status: 'Active',
        description: formData.get('description'),
        submissions: 0,
        total: 35
      };

      state.assignments.unshift(asg);
      saveState();
      closeModal();
      showToast('Assignment Published', \`"\${asg.title}" assigned to \${asg.className}.\`);
      renderApp();
    }

    // Delete Assignment
    function handleDeleteAssignment(id) {
      const asg = state.assignments.find(a => a.id === id);
      if (!asg) return;
      if (confirm(\`Delete assignment "\${asg.title}"?\`)) {
        state.assignments = state.assignments.filter(a => a.id !== id);
        saveState();
        showToast('Assignment Deleted', \`"\${asg.title}" was removed.\`, 'info');
        renderApp();
      }
    }

    // Send Parent Message
    function handleSendParentMessage(event) {
      event.preventDefault();
      const input = document.getElementById('parent-chat-input');
      const text = input ? input.value.trim() : '';
      if (!text) return;

      const now = new Date();
      const timeStr = 'Today ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      state.messages.push({
        id: 'm-' + Date.now(),
        sender: 'Sunita Sharma (Parent)',
        senderRole: 'Parent',
        text: text,
        time: timeStr
      });

      if (input) input.value = '';
      saveState();
      showToast('Message Sent', 'Your message has been delivered to Dr. Vikram Sharma.');
      renderApp();
    }

    // Global Search filter
    function handleQuickSearch(term) {
      const q = term.toLowerCase().trim();
      const container = document.getElementById('quick-search-results');
      if (!container) return;

      if (!q) {
        container.innerHTML = \`
          <div class="text-xs text-slate-400 uppercase font-semibold">Suggested Modules</div>
          <div onclick="setActiveTab('students'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs font-medium">
            <span>👨‍🎓 Students Directory</span>
            <span class="text-slate-400">Module</span>
          </div>
          <div onclick="setActiveTab('attendance'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs font-medium">
            <span>✓ Class Attendance Roll Call</span>
            <span class="text-slate-400">Module</span>
          </div>
        \`;
        return;
      }

      const matchStudents = state.students.filter(s => s.name.toLowerCase().includes(q) || s.admissionId.toLowerCase().includes(q) || s.className.toLowerCase().includes(q));
      const matchTeachers = state.teachers.filter(t => t.name.toLowerCase().includes(q) || t.department.toLowerCase().includes(q));
      const matchBooks = state.books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));

      let html = '';
      if (matchStudents.length > 0) {
        html += '<div class="text-xs text-slate-400 uppercase font-semibold mb-1">Students</div>';
        matchStudents.slice(0, 4).forEach(s => {
          html += \`
            <div onclick="setActiveTab('students'); closeModal(); setTimeout(()=>openStudentProfileModal('\${s.id}'), 200);" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs">
              <div>
                <strong class="text-slate-800 font-semibold">\${s.name}</strong>
                <span class="text-slate-400 ml-1">(\${s.className} · \${s.admissionId})</span>
              </div>
              <span class="text-emerald-600 font-bold">\${s.attendanceRate}%</span>
            </div>
          \`;
        });
      }

      if (matchTeachers.length > 0) {
        html += '<div class="text-xs text-slate-400 uppercase font-semibold mt-3 mb-1">Faculty</div>';
        matchTeachers.slice(0, 3).forEach(t => {
          html += \`
            <div onclick="setActiveTab('teachers'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs">
              <div>
                <strong class="text-slate-800 font-semibold">\${t.name}</strong>
                <span class="text-slate-400 ml-1">(\${t.department})</span>
              </div>
              <span class="text-slate-400">\${t.assignedClasses.join(', ')}</span>
            </div>
          \`;
        });
      }

      if (matchBooks.length > 0) {
        html += '<div class="text-xs text-slate-400 uppercase font-semibold mt-3 mb-1">Library Books</div>';
        matchBooks.slice(0, 3).forEach(b => {
          html += \`
            <div onclick="setActiveTab('books'); closeModal();" class="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs">
              <div>
                <strong class="text-slate-800 font-semibold">\${b.title}</strong>
                <span class="text-slate-400 ml-1">(\${b.author})</span>
              </div>
              <span class="text-theme-primary font-bold">\${b.availableCopies} available</span>
            </div>
          \`;
        });
      }

      if (!html) {
        html = '<div class="p-4 text-center text-xs text-slate-400">No matching records found across SCHLAR.</div>';
      }

      container.innerHTML = html;
    }
  `;
}

module.exports = { getActionsScript };
