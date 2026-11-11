// Master initial data for Greenfield International School
const INITIAL_DATA = {
  theme: 'blue',
  currentPlatform: 'web',
  currentRole: 'principal',
  activeTab: 'dashboard',
  sidebarCollapsed: false,
  selectedChild: 'c1', // c1: Aarav Sharma 8A, c2: Ananya Sharma 5B

  // Master Students
  students: [
    { id: 's1', name: 'Aarav Sharma', admissionId: 'GIS-2024-001', className: 'Grade 8A', rollNo: '01', attendanceRate: 94.2, academicStatus: 'Excellent', parentName: 'Sunita Sharma', parentPhone: '+91 98450 11223', status: 'Active', dob: '2011-04-12', gender: 'Male', address: '42 Orchid Residency, Bengaluru', bloodGroup: 'O+' },
    { id: 's2', name: 'Ananya Sharma', admissionId: 'GIS-2024-002', className: 'Grade 5B', rollNo: '04', attendanceRate: 97.5, academicStatus: 'Outstanding', parentName: 'Sunita Sharma', parentPhone: '+91 98450 11223', status: 'Active', dob: '2014-08-20', gender: 'Female', address: '42 Orchid Residency, Bengaluru', bloodGroup: 'B+' },
    { id: 's3', name: 'Rohan Mehra', admissionId: 'GIS-2024-015', className: 'Grade 10A', rollNo: '12', attendanceRate: 91.0, academicStatus: 'Good', parentName: 'Kunal Mehra', parentPhone: '+91 98221 44556', status: 'Active', dob: '2009-02-15', gender: 'Male', address: '18 Green Glen, Bengaluru', bloodGroup: 'A+' },
    { id: 's4', name: 'Ishita Kapoor', admissionId: 'GIS-2024-022', className: 'Grade 10A', rollNo: '07', attendanceRate: 96.4, academicStatus: 'Excellent', parentName: 'Meera Kapoor', parentPhone: '+91 97334 55667', status: 'Active', dob: '2009-09-08', gender: 'Female', address: '102 Silver Oak, Bengaluru', bloodGroup: 'AB+' },
    { id: 's5', name: 'Kabir Varma', admissionId: 'GIS-2024-031', className: 'Grade 10A', rollNo: '18', attendanceRate: 74.0, academicStatus: 'Needs Attention', parentName: 'Vikram Varma', parentPhone: '+91 98112 33445', status: 'Active', dob: '2009-11-25', gender: 'Male', address: '55 Palm Meadows, Bengaluru', bloodGroup: 'O-' },
    { id: 's6', name: 'Dia Sen', admissionId: 'GIS-2024-045', className: 'Grade 9A', rollNo: '09', attendanceRate: 95.0, academicStatus: 'Good', parentName: 'Arun Sen', parentPhone: '+91 99001 22334', status: 'Active', dob: '2010-06-14', gender: 'Female', address: '88 Lake View, Bengaluru', bloodGroup: 'B+' },
    { id: 's7', name: 'Arjun Das', admissionId: 'GIS-2024-052', className: 'Grade 10B', rollNo: '14', attendanceRate: 88.5, academicStatus: 'Average', parentName: 'Debashis Das', parentPhone: '+91 98440 66778', status: 'Active', dob: '2009-03-30', gender: 'Male', address: '12 Wind Tunnel Rd, Bengaluru', bloodGroup: 'A-' },
    { id: 's8', name: 'Zoya Khan', admissionId: 'GIS-2024-061', className: 'Grade 11A', rollNo: '03', attendanceRate: 98.2, academicStatus: 'Outstanding', parentName: 'Tariq Khan', parentPhone: '+91 97400 99887', status: 'Active', dob: '2008-01-19', gender: 'Female', address: '304 Ferns City, Bengaluru', bloodGroup: 'O+' },
    { id: 's9', name: 'Pranav Rao', admissionId: 'GIS-2024-073', className: 'Grade 10A', rollNo: '21', attendanceRate: 86.0, academicStatus: 'Good', parentName: 'Girish Rao', parentPhone: '+91 98860 11990', status: 'Active', dob: '2009-07-04', gender: 'Male', address: '77 Rustam Bagh, Bengaluru', bloodGroup: 'B+' },
    { id: 's10', name: 'Tanvi Joshi', admissionId: 'GIS-2024-084', className: 'Grade 8A', rollNo: '16', attendanceRate: 93.5, academicStatus: 'Good', parentName: 'Shashank Joshi', parentPhone: '+91 98455 33221', status: 'Active', dob: '2011-10-10', gender: 'Female', address: '9 Diamond District, Bengaluru', bloodGroup: 'AB-' }
  ],

  // Teachers
  teachers: [
    { id: 't1', name: 'Dr. Vikram Sharma', employeeId: 'EMP-T-101', department: 'Mathematics & Physics', assignedClasses: ['Grade 10A', 'Grade 11A'], email: 'vikram.sharma@greenfield.edu', phone: '+91 98451 00221', qualification: 'Ph.D. Applied Physics', joinDate: '2018-06-01' },
    { id: 't2', name: 'Mrs. Priya Nair', employeeId: 'EMP-T-102', department: 'English & Literature', assignedClasses: ['Grade 8A', 'Grade 9A'], email: 'priya.nair@greenfield.edu', phone: '+91 98452 00222', qualification: 'M.A. English, B.Ed', joinDate: '2019-07-15' },
    { id: 't3', name: 'Mr. Rajesh Iyer', employeeId: 'EMP-T-103', department: 'Chemistry & Biology', assignedClasses: ['Grade 10B', 'Grade 12A'], email: 'rajesh.iyer@greenfield.edu', phone: '+91 98453 00223', qualification: 'M.Sc. Organic Chemistry', joinDate: '2017-04-10' },
    { id: 't4', name: 'Ms. Sarah Jenkins', employeeId: 'EMP-T-104', department: 'Computer Science & AI', assignedClasses: ['Grade 8A', 'Grade 10A'], email: 'sarah.j@greenfield.edu', phone: '+91 98454 00224', qualification: 'M.Tech CSE', joinDate: '2021-08-01' },
    { id: 't5', name: 'Mr. Amit Patel', employeeId: 'EMP-T-105', department: 'Social Sciences & History', assignedClasses: ['Grade 9A', 'Grade 10A'], email: 'amit.patel@greenfield.edu', phone: '+91 98455 00225', qualification: 'M.A. History, B.Ed', joinDate: '2020-01-05' }
  ],

  // Staff
  staff: [
    { id: 'st1', name: 'Mr. Ramanathan K.', role: 'Accountant / Bursar', department: 'Finance', phone: '+91 98450 77112', email: 'bursar@greenfield.edu' },
    { id: 'st2', name: 'Ms. Shalini Gupta', role: 'Front Desk Receptionist', department: 'Administration', phone: '+91 98450 77113', email: 'frontdesk@greenfield.edu' },
    { id: 'st3', name: 'Mrs. Jayalakshmi M.', role: 'Chief Librarian', department: 'Library Commons', phone: '+91 98450 77114', email: 'library@greenfield.edu' },
    { id: 'st4', name: 'Mr. Ashok Kumar', role: 'Campus Facilities Manager', department: 'Operations', phone: '+91 98450 77115', email: 'facilities@greenfield.edu' }
  ],

  // Classes
  classes: [
    { id: 'c-8a', name: 'Grade 8A', teacher: 'Mrs. Priya Nair', room: 'Room 204', totalStudents: 32, attendanceAvg: 94.8, subjects: ['English', 'Math', 'Science', 'History', 'CompSci'] },
    { id: 'c-8b', name: 'Grade 8B', teacher: 'Mr. Deepak Verma', room: 'Room 205', totalStudents: 30, attendanceAvg: 92.1, subjects: ['English', 'Math', 'Science', 'History', 'Art'] },
    { id: 'c-9a', name: 'Grade 9A', teacher: 'Mr. Amit Patel', room: 'Room 301', totalStudents: 34, attendanceAvg: 93.5, subjects: ['English', 'Math', 'Physics', 'Chem', 'CompSci'] },
    { id: 'c-10a', name: 'Grade 10A', teacher: 'Dr. Vikram Sharma', room: 'Room 402', totalStudents: 35, attendanceAvg: 95.2, subjects: ['Advanced Math', 'Physics', 'Chemistry', 'English', 'CompSci'] },
    { id: 'c-10b', name: 'Grade 10B', teacher: 'Mr. Rajesh Iyer', room: 'Room 403', totalStudents: 33, attendanceAvg: 91.4, subjects: ['Math', 'Physics', 'Chemistry', 'Biology', 'English'] },
    { id: 'c-11a', name: 'Grade 11A', teacher: 'Dr. Sunita Sen', room: 'Lab 1', totalStudents: 28, attendanceAvg: 96.0, subjects: ['Calculus', 'Electrodynamics', 'Physical Chem', 'Python'] }
  ],

  // Teacher Roll Call records for Grade 10A today
  todayRollCall: [
    { studentId: 's3', name: 'Rohan Mehra', rollNo: '12', status: 'Present' },
    { studentId: 's4', name: 'Ishita Kapoor', rollNo: '07', status: 'Present' },
    { studentId: 's5', name: 'Kabir Varma', rollNo: '18', status: 'Absent' },
    { studentId: 's9', name: 'Pranav Rao', rollNo: '21', status: 'Present' },
    { studentId: 's1', name: 'Aarav Sharma', rollNo: '01', status: 'Present' }
  ],

  // Assignments
  assignments: [
    { id: 'a1', title: 'Quadratic Equations & Parabolic Motion', className: 'Grade 10A', subject: 'Mathematics', teacher: 'Dr. Vikram Sharma', dueDate: '2026-10-05', status: 'Active', description: 'Solve textbook exercises 4.1 to 4.4 and plot trajectory graphs.', submissions: 28, total: 35 },
    { id: 'a2', title: 'Photosynthesis & Cellular Respiration Report', className: 'Grade 10A', subject: 'Science', teacher: 'Mr. Rajesh Iyer', dueDate: '2026-10-08', status: 'Active', description: 'Submit experimental write-up on leaf chromatography.', submissions: 22, total: 35 },
    { id: 'a3', title: 'Shakespearean Monologue Analysis', className: 'Grade 8A', subject: 'English', teacher: 'Mrs. Priya Nair', dueDate: '2026-10-04', status: 'Active', description: 'Critical breakdown of Mark Antony speech in Julius Caesar.', submissions: 30, total: 32 },
    { id: 'a4', title: 'Python Sorting Algorithms Implementation', className: 'Grade 10A', subject: 'Computer Science', teacher: 'Ms. Sarah Jenkins', dueDate: '2026-10-12', status: 'Upcoming', description: 'Implement MergeSort and QuickSort with timing benchmarks.', submissions: 14, total: 35 }
  ],

  // Fees & Collections
  fees: [
    { studentId: 's1', name: 'Aarav Sharma', className: 'Grade 8A', totalFee: 145000, paid: 145000, pending: 0, dueDate: '2026-09-15', status: 'Paid', parent: 'Sunita Sharma' },
    { studentId: 's2', name: 'Ananya Sharma', className: 'Grade 5B', totalFee: 120000, paid: 80000, pending: 40000, dueDate: '2026-10-15', status: 'Partial', parent: 'Sunita Sharma' },
    { studentId: 's3', name: 'Rohan Mehra', className: 'Grade 10A', totalFee: 160000, paid: 160000, pending: 0, dueDate: '2026-09-15', status: 'Paid', parent: 'Kunal Mehra' },
    { studentId: 's4', name: 'Ishita Kapoor', className: 'Grade 10A', totalFee: 160000, paid: 160000, pending: 0, dueDate: '2026-09-15', status: 'Paid', parent: 'Meera Kapoor' },
    { studentId: 's5', name: 'Kabir Varma', className: 'Grade 10A', totalFee: 160000, paid: 90000, pending: 70000, dueDate: '2026-09-30', status: 'Partial', parent: 'Vikram Varma' },
    { studentId: 's6', name: 'Dia Sen', className: 'Grade 9A', totalFee: 150000, paid: 150000, pending: 0, dueDate: '2026-09-15', status: 'Paid', parent: 'Arun Sen' },
    { studentId: 's7', name: 'Arjun Das', className: 'Grade 10B', totalFee: 160000, paid: 60000, pending: 100000, dueDate: '2026-09-20', status: 'Overdue', parent: 'Debashis Das' },
    { studentId: 's8', name: 'Zoya Khan', className: 'Grade 11A', totalFee: 175000, paid: 175000, pending: 0, dueDate: '2026-09-15', status: 'Paid', parent: 'Tariq Khan' }
  ],

  // Payments Ledger
  payments: [
    { receiptNo: 'RCP-2026-894', studentId: 's1', studentName: 'Aarav Sharma', className: 'Grade 8A', amount: 45000, date: '2026-09-14', method: 'UPI', refNo: 'UPI/294029410', cashier: 'Ramanathan K.' },
    { receiptNo: 'RCP-2026-895', studentId: 's2', studentName: 'Ananya Sharma', className: 'Grade 5B', amount: 40000, date: '2026-09-14', method: 'Bank Transfer', refNo: 'NEFT-HDFC-99120', cashier: 'Ramanathan K.' },
    { receiptNo: 'RCP-2026-896', studentId: 's4', studentName: 'Ishita Kapoor', className: 'Grade 10A', amount: 80000, date: '2026-09-20', method: 'Card', refNo: 'POS-TXN-44120', cashier: 'Ramanathan K.' },
    { receiptNo: 'RCP-2026-897', studentId: 's8', studentName: 'Zoya Khan', className: 'Grade 11A', amount: 87500, date: '2026-09-22', method: 'UPI', refNo: 'UPI/884102948', cashier: 'Ramanathan K.' }
  ],

  // Library Books
  books: [
    { id: 'b1', title: 'Concepts of Physics (Vol 1)', author: 'Dr. H.C. Verma', isbn: '978-8177091878', category: 'Physics', totalCopies: 8, availableCopies: 5, status: 'Available', shelf: 'Shelf P-04' },
    { id: 'b2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0060935467', category: 'Literature', totalCopies: 5, availableCopies: 2, status: 'Available', shelf: 'Shelf L-12' },
    { id: 'b3', title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest', isbn: '978-0262033848', category: 'Computer Science', totalCopies: 4, availableCopies: 0, status: 'Out of Stock', shelf: 'Shelf CS-01' },
    { id: 'b4', title: 'Advanced Inorganic Chemistry', author: 'F.A. Cotton & G. Wilkinson', isbn: '978-0471199571', category: 'Chemistry', totalCopies: 6, availableCopies: 4, status: 'Available', shelf: 'Shelf C-09' },
    { id: 'b5', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Astronomy', totalCopies: 6, availableCopies: 3, status: 'Available', shelf: 'Shelf A-02' },
    { id: 'b6', title: 'The Discovery of India', author: 'Jawaharlal Nehru', isbn: '978-0143031031', category: 'History', totalCopies: 5, availableCopies: 5, status: 'Available', shelf: 'Shelf H-07' }
  ],

  // Library Issue Transactions
  libraryTransactions: [
    { id: 'tx-101', bookId: 'b1', bookTitle: 'Concepts of Physics (Vol 1)', studentId: 's3', studentName: 'Rohan Mehra', className: 'Grade 10A', issueDate: '2026-09-10', dueDate: '2026-09-24', returnDate: null, status: 'Issued', fine: 0 },
    { id: 'tx-102', bookId: 'b2', bookTitle: 'To Kill a Mockingbird', studentId: 's1', studentName: 'Aarav Sharma', className: 'Grade 8A', issueDate: '2026-09-12', dueDate: '2026-09-26', returnDate: null, status: 'Issued', fine: 0 },
    { id: 'tx-103', bookId: 'b3', bookTitle: 'Introduction to Algorithms (CLRS)', studentId: 's8', studentName: 'Zoya Khan', className: 'Grade 11A', issueDate: '2026-09-01', dueDate: '2026-09-15', returnDate: null, status: 'Overdue', fine: 120 }
  ],

  // Visitors
  visitors: [
    { id: 'v1', name: 'Dr. Alok Nath', purpose: 'Campus Guest Lecture', personToMeet: 'Dr. Vikram Sharma', phone: '+91 98450 11999', badgeNo: 'VIS-081', entryTime: '09:30 AM', exitTime: null, status: 'Checked In', date: '2026-09-27' },
    { id: 'v2', name: 'Mrs. Vandana Sen', purpose: 'Admissions Enquiry for Grade 6', personToMeet: 'Admissions Team', phone: '+91 98450 22888', badgeNo: 'VIS-082', entryTime: '10:15 AM', exitTime: '11:45 AM', status: 'Checked Out', date: '2026-09-27' },
    { id: 'v3', name: 'Mr. Karthik Reddy', purpose: 'Textbook Publisher Representative', personToMeet: 'Mrs. Jayalakshmi (Library)', phone: '+91 98450 33777', badgeNo: 'VIS-083', entryTime: '11:00 AM', exitTime: null, status: 'Checked In', date: '2026-09-27' }
  ],

  // Enquiries
  enquiries: [
    { id: 'e1', parentName: 'Sanjay Deshmukh', studentName: 'Vihaan Deshmukh', grade: 'Grade 6', contact: '+91 98230 45678', source: 'Website Inquiry', status: 'New', notes: 'Interested in Cambridge curriculum & basketball coaching.' },
    { id: 'e2', parentName: 'Lakshmi Narayan', studentName: 'Aditi Narayan', grade: 'Grade 9', contact: '+91 98450 78901', source: 'Campus Walk-in', status: 'Contacted', notes: 'Scheduled campus tour for Saturday morning.' },
    { id: 'e3', parentName: 'Gaurav Singhal', studentName: 'Aayush Singhal', grade: 'Grade 11', contact: '+91 97110 23456', source: 'Parent Referral', status: 'Converted', notes: 'Admission test cleared; documents submitted.' }
  ],

  // Appointments
  appointments: [
    { id: 'apt1', parentName: 'Sunita Sharma', studentName: 'Aarav Sharma', meetWith: 'Dr. Vikram Sharma (Teacher)', date: '2026-09-28', time: '02:30 PM', purpose: 'Term 1 Math performance review', status: 'Confirmed' },
    { id: 'apt2', parentName: 'Kunal Mehra', studentName: 'Rohan Mehra', meetWith: 'Academic Vice Principal', date: '2026-09-29', time: '11:00 AM', purpose: 'Career counseling discussion', status: 'Pending' }
  ],

  // Notices
  notices: [
    { id: 'n1', title: 'Mid-Term Examinations Schedule Released', category: 'Exam', date: '2026-09-25', audience: 'All Parents & Students', body: 'The Mid-Term assessments for Grades 6 through 12 commence on October 14, 2026. Detailed hall tickets will be uploaded next week.' },
    { id: 'n2', title: 'Annual Inter-School STEM Conclave', category: 'Event', date: '2026-09-24', audience: 'High School', body: 'Greenfield hosts 18 international schools for robotics, mathematics olympiad, and scientific paper presentations on October 28.' },
    { id: 'n3', title: 'Updated Winter Uniform Advisory', category: 'School', date: '2026-09-22', audience: 'All Students', body: 'Winter blazers and sweaters are mandatory starting November 1. Order replacements from the school bookstore.' }
  ],

  // Messages (Parent <-> Teacher)
  messages: [
    { id: 'm1', sender: 'Dr. Vikram Sharma', senderRole: 'Teacher', text: 'Hello Mrs. Sharma, Aarav did exceptionally well in the recent Trigonometry unit quiz (19/20). Keep up the great encouragement!', time: 'Yesterday 04:15 PM' },
    { id: 'm2', sender: 'Sunita Sharma (Parent)', senderRole: 'Parent', text: 'Thank you Dr. Sharma! He has been practicing the extra problem sets you provided.', time: 'Yesterday 05:20 PM' }
  ],

  // Multi-child Profiles for Parent Mobile
  children: {
    c1: {
      id: 'c1',
      name: 'Aarav Sharma',
      grade: 'Grade 8A',
      rollNo: '01',
      admissionId: 'GIS-2024-001',
      classTeacher: 'Mrs. Priya Nair',
      attendanceOverall: 94.2,
      presentDays: 82,
      absentDays: 4,
      lateDays: 1,
      academicAverage: 89.4,
      termRank: '3rd of 32',
      subjects: [
        { name: 'Mathematics', marks: 92, grade: 'A1', teacher: 'Dr. Vikram Sharma' },
        { name: 'English Language', marks: 88, grade: 'A2', teacher: 'Mrs. Priya Nair' },
        { name: 'Integrated Science', marks: 90, grade: 'A1', teacher: 'Mr. Rajesh Iyer' },
        { name: 'Social Studies', marks: 85, grade: 'B1', teacher: 'Mr. Amit Patel' },
        { name: 'Computer Science', marks: 96, grade: 'A1', teacher: 'Ms. Sarah Jenkins' }
      ],
      feeStatus: { total: 145000, paid: 145000, pending: 0, status: 'Paid in Full' },
      upcomingAssignments: [
        { title: 'Shakespearean Monologue Analysis', subject: 'English', dueDate: 'Oct 04', status: 'Submitted' },
        { title: 'Algebra Polynomials Sheet', subject: 'Math', dueDate: 'Oct 06', status: 'Pending' }
      ]
    },
    c2: {
      id: 'c2',
      name: 'Ananya Sharma',
      grade: 'Grade 5B',
      rollNo: '04',
      admissionId: 'GIS-2024-002',
      classTeacher: 'Ms. Kavita Menon',
      attendanceOverall: 97.5,
      presentDays: 85,
      absentDays: 2,
      lateDays: 0,
      academicAverage: 93.8,
      termRank: '1st of 30',
      subjects: [
        { name: 'Mathematics', marks: 98, grade: 'A1', teacher: 'Ms. Kavita Menon' },
        { name: 'English Literature', marks: 94, grade: 'A1', teacher: 'Mrs. Anita Rao' },
        { name: 'General Science', marks: 92, grade: 'A1', teacher: 'Mr. Sudhir K.' },
        { name: 'Environmental Studies', marks: 95, grade: 'A1', teacher: 'Ms. Kavita Menon' },
        { name: 'Visual Arts & Craft', marks: 90, grade: 'A1', teacher: 'Mr. Francis D.' }
      ],
      feeStatus: { total: 120000, paid: 80000, pending: 40000, status: 'Term 2 Due: Oct 15' },
      upcomingAssignments: [
        { title: 'Solar System Planetary Scale Model', subject: 'Science', dueDate: 'Oct 05', status: 'Pending' },
        { title: 'Creative Fable Story Writing', subject: 'English', dueDate: 'Oct 07', status: 'Submitted' }
      ]
    }
  },

  // Role Profiles
  profiles: {
    principal: {
      name: 'Dr. Elizabeth Henderson',
      role: 'Principal / Head of School',
      email: 'principal@greenfield.edu',
      phone: '+91 98450 10001',
      id: 'GIS-ADM-001',
      department: 'School Leadership & Governance',
      school: 'Greenfield International School',
      avatarText: 'EH'
    },
    vice_principal: {
      name: 'Prof. Marcus Vance',
      role: 'Vice Principal / Academic Dean',
      email: 'dean.academics@greenfield.edu',
      phone: '+91 98450 10002',
      id: 'GIS-ADM-002',
      department: 'Academic Coordination & Curricula',
      school: 'Greenfield International School',
      avatarText: 'MV'
    },
    teacher: {
      name: 'Dr. Vikram Sharma',
      role: 'Senior Faculty / PGT Physics & Math',
      email: 'vikram.sharma@greenfield.edu',
      phone: '+91 98451 00221',
      id: 'EMP-T-101',
      department: 'Mathematics & Physical Sciences',
      school: 'Greenfield International School',
      avatarText: 'VS'
    },
    accountant: {
      name: 'Mr. Ramanathan K.',
      role: 'Chief Bursar & Finance Controller',
      email: 'bursar@greenfield.edu',
      phone: '+91 98450 77112',
      id: 'EMP-FIN-001',
      department: 'Accounts & Finance Treasury',
      school: 'Greenfield International School',
      avatarText: 'RK'
    },
    receptionist: {
      name: 'Ms. Shalini Gupta',
      role: 'Head Receptionist & Front Office Lead',
      email: 'frontdesk@greenfield.edu',
      phone: '+91 98450 77113',
      id: 'EMP-ADM-003',
      department: 'Front Office & Admissions Gateway',
      school: 'Greenfield International School',
      avatarText: 'SG'
    },
    librarian: {
      name: 'Mrs. Jayalakshmi M.',
      role: 'Chief Librarian & Information Specialist',
      email: 'library@greenfield.edu',
      phone: '+91 98450 77114',
      id: 'EMP-LIB-001',
      department: 'Learning Resource Commons',
      school: 'Greenfield International School',
      avatarText: 'JM'
    },
    parent_mobile: {
      name: 'Mrs. Sunita Sharma',
      role: 'Parent / Guardian',
      email: 'sunita.sharma@example.com',
      phone: '+91 98450 11223',
      id: 'PAR-2024-089',
      department: 'Parent Association Member',
      school: 'Greenfield International School',
      avatarText: 'SS'
    }
  }
};

module.exports = { INITIAL_DATA };
