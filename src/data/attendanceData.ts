import {
  AttendanceRecord,
  StaffDailyAttendance,
  StaffLeaveRequest,
  AttendanceCorrectionRequest,
  StudentMovementRecord,
  AttendancePolicySettings,
  ClassInfo,
  Student,
  Teacher,
  Staff,
  StudentAttendanceStatus
} from '../types';

export const INITIAL_ATTENDANCE_POLICY: AttendancePolicySettings = {
  morningCutoffTime: '08:30',
  lateThresholdMinutes: 15,
  minimumRequiredPercentage: 85,
  countLateAsPresentPercentage: 100, // Counted as present for overall percentage, tagged as Tardy
  countHalfDayAsPercentage: 50,
  countExcusedAsPresent: true,
  allowTeacherSameDayEditsOnly: true,
  requireCorrectionApproval: true
};

export const INITIAL_DETAILED_ATTENDANCE: AttendanceRecord[] = [
  // Today's morning roll call - Grade 10A
  {
    id: 'att-2026-10-18-10a-p1',
    date: '2026-10-18',
    classId: 'class-10a',
    academicYearId: 'ay-2026-2027',
    section: 'A',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-1',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    status: 'Submitted',
    submittedAt: '2026-10-18T08:38:00.000Z',
    submittedBy: 'Dr. Sarah Jenkins',
    records: [
      { studentId: 'std-10a-01', studentName: 'Rohan Mehta', status: 'Present', arrivalTime: '08:24' },
      { studentId: 'std-10a-02', studentName: 'Diya Kapoor', status: 'Present', arrivalTime: '08:28' },
      { studentId: 'std-10a-03', studentName: 'Kabir Verma', status: 'Late', arrivalTime: '08:42', remarks: 'School Bus #4 delayed due to metro roadwork' },
      { studentId: 'std-10a-04', studentName: 'Sara Khan', status: 'Present', arrivalTime: '08:20' }
    ]
  },
  // Today's morning roll call - Grade 8A (Aarav Sharma)
  {
    id: 'att-2026-10-18-8a-p1',
    date: '2026-10-18',
    classId: 'class-8a',
    academicYearId: 'ay-2026-2027',
    section: 'A',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-4',
    subjectId: 'sub-sci',
    subjectName: 'General Science',
    status: 'Submitted',
    submittedAt: '2026-10-18T08:35:00.000Z',
    submittedBy: 'Dr. Vikram Sharma',
    records: [
      { studentId: 'std-8a-01', studentName: 'Aarav Sharma', status: 'Present', arrivalTime: '08:22' },
      { studentId: 'std-8a-02', studentName: 'Meera Patel', status: 'Present', arrivalTime: '08:25' },
      { studentId: 'std-8a-03', studentName: 'Arjun Das', status: 'Excused', remarks: 'Regional tennis tournament representation' },
      { studentId: 'std-8a-04', studentName: 'Ananya Roy', status: 'Present', arrivalTime: '08:18' }
    ]
  },
  // Today's morning roll call - Grade 5B (Ananya Sharma)
  {
    id: 'att-2026-10-18-5b-p1',
    date: '2026-10-18',
    classId: 'class-5b',
    academicYearId: 'ay-2026-2027',
    section: 'B',
    period: 'Morning Roll Call',
    teacherId: 't-6',
    subjectId: 'sub-eng',
    subjectName: 'English Literature',
    status: 'Submitted',
    submittedAt: '2026-10-18T08:40:00.000Z',
    submittedBy: 'Sunita Rao',
    records: [
      { studentId: 'std-5b-01', studentName: 'Ananya Sharma', status: 'Present', arrivalTime: '08:15' },
      { studentId: 'std-5b-02', studentName: 'Kunal Sen', status: 'Present', arrivalTime: '08:25' },
      { studentId: 'std-5b-03', studentName: 'Tara Nambiar', status: 'Absent', remarks: 'Unnotified absence' }
    ]
  },
  // Yesterday's session - Grade 10A
  {
    id: 'att-2026-10-17-10a-p1',
    date: '2026-10-17',
    classId: 'class-10a',
    academicYearId: 'ay-2026-2027',
    section: 'A',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-1',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    status: 'Submitted',
    submittedAt: '2026-10-17T08:36:00.000Z',
    submittedBy: 'Dr. Sarah Jenkins',
    records: [
      { studentId: 'std-10a-01', studentName: 'Rohan Mehta', status: 'Present', arrivalTime: '08:20' },
      { studentId: 'std-10a-02', studentName: 'Diya Kapoor', status: 'Present', arrivalTime: '08:26' },
      { studentId: 'std-10a-03', studentName: 'Kabir Verma', status: 'Absent', remarks: 'Viral fever reported by guardian' },
      { studentId: 'std-10a-04', studentName: 'Sara Khan', status: 'Present', arrivalTime: '08:25' }
    ]
  },
  // Yesterday's session - Grade 8A
  {
    id: 'att-2026-10-17-8a-p1',
    date: '2026-10-17',
    classId: 'class-8a',
    academicYearId: 'ay-2026-2027',
    section: 'A',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-4',
    subjectId: 'sub-sci',
    subjectName: 'General Science',
    status: 'Submitted',
    submittedAt: '2026-10-17T08:35:00.000Z',
    submittedBy: 'Dr. Vikram Sharma',
    records: [
      { studentId: 'std-8a-01', studentName: 'Aarav Sharma', status: 'Late', arrivalTime: '08:38', remarks: 'Heavy Ring Road congestion' },
      { studentId: 'std-8a-02', studentName: 'Meera Patel', status: 'Present', arrivalTime: '08:22' },
      { studentId: 'std-8a-03', studentName: 'Arjun Das', status: 'Present', arrivalTime: '08:27' },
      { studentId: 'std-8a-04', studentName: 'Ananya Roy', status: 'Present', arrivalTime: '08:19' }
    ]
  },
  // Earlier date - Grade 10A
  {
    id: 'att-2026-10-16-10a-p1',
    date: '2026-10-16',
    classId: 'class-10a',
    academicYearId: 'ay-2026-2027',
    section: 'A',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-1',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    status: 'Submitted',
    submittedAt: '2026-10-16T08:35:00.000Z',
    submittedBy: 'Dr. Sarah Jenkins',
    records: [
      { studentId: 'std-10a-01', studentName: 'Rohan Mehta', status: 'Present', arrivalTime: '08:25' },
      { studentId: 'std-10a-02', studentName: 'Diya Kapoor', status: 'Present', arrivalTime: '08:25' },
      { studentId: 'std-10a-03', studentName: 'Kabir Verma', status: 'Present', arrivalTime: '08:28' },
      { studentId: 'std-10a-04', studentName: 'Sara Khan', status: 'Half Day', arrivalTime: '08:20', remarks: 'Authorized early medical appointment departure' }
    ]
  },
  // Earlier date - Grade 8A
  {
    id: 'att-2026-10-16-8a-p1',
    date: '2026-10-16',
    classId: 'class-8a',
    academicYearId: 'ay-2026-2027',
    section: 'A',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-4',
    subjectId: 'sub-sci',
    subjectName: 'General Science',
    status: 'Submitted',
    submittedAt: '2026-10-16T08:35:00.000Z',
    submittedBy: 'Dr. Vikram Sharma',
    records: [
      { studentId: 'std-8a-01', studentName: 'Aarav Sharma', status: 'Present', arrivalTime: '08:20' },
      { studentId: 'std-8a-02', studentName: 'Meera Patel', status: 'Present', arrivalTime: '08:24' },
      { studentId: 'std-8a-03', studentName: 'Arjun Das', status: 'Present', arrivalTime: '08:26' },
      { studentId: 'std-8a-04', studentName: 'Ananya Roy', status: 'Present', arrivalTime: '08:18' }
    ]
  }
];

export const INITIAL_STAFF_ATTENDANCE: StaffDailyAttendance[] = [
  {
    id: 'staff-att-2026-10-18',
    date: '2026-10-18',
    status: 'Submitted',
    submittedAt: '2026-10-18T08:15:00.000Z',
    submittedBy: 'Dr. Arthur Campbell',
    entries: [
      { staffId: 't-1', staffName: 'Dr. Sarah Jenkins', roleType: 'teacher', department: 'Mathematics', status: 'Present', arrivalTime: '07:55', remarks: 'HOD Math on campus' },
      { staffId: 't-2', staffName: 'Mark Vance', roleType: 'teacher', department: 'Physical Sciences', status: 'Present', arrivalTime: '08:05' },
      { staffId: 't-3', staffName: 'Emily Chen', roleType: 'teacher', department: 'English & Literature', status: 'On Leave', remarks: 'Approved Medical Leave (Doctor slip verified)' },
      { staffId: 't-4', staffName: 'Dr. Vikram Sharma', roleType: 'teacher', department: 'Chemistry & STEM', status: 'Present', arrivalTime: '08:00' },
      { staffId: 't-5', staffName: 'Michael Chang', roleType: 'teacher', department: 'Social Sciences & History', status: 'Present', arrivalTime: '08:10' },
      { staffId: 't-6', staffName: 'Sunita Rao', roleType: 'teacher', department: 'Primary Education', status: 'Present', arrivalTime: '07:50' },
      { staffId: 'st-1', staffName: 'Kavita Chawla', roleType: 'staff', department: 'Front Desk Administration', status: 'Present', arrivalTime: '07:45' },
      { staffId: 'st-2', staffName: 'Alok Saxena', roleType: 'staff', department: 'Accounts & Bursar', status: 'Present', arrivalTime: '08:15' },
      { staffId: 'st-3', staffName: 'Nandini Krishnan', roleType: 'staff', department: 'Library & Media Center', status: 'Present', arrivalTime: '08:00' },
      { staffId: 'st-4', staffName: 'Rajesh Kumar', roleType: 'staff', department: 'Campus Security & Transport', status: 'Present', arrivalTime: '07:30' }
    ]
  },
  {
    id: 'staff-att-2026-10-17',
    date: '2026-10-17',
    status: 'Submitted',
    submittedAt: '2026-10-17T08:20:00.000Z',
    submittedBy: 'Dr. Arthur Campbell',
    entries: [
      { staffId: 't-1', staffName: 'Dr. Sarah Jenkins', roleType: 'teacher', department: 'Mathematics', status: 'Present', arrivalTime: '07:58' },
      { staffId: 't-2', staffName: 'Mark Vance', roleType: 'teacher', department: 'Physical Sciences', status: 'Late', arrivalTime: '08:35', remarks: 'Railway crossing delay' },
      { staffId: 't-3', staffName: 'Emily Chen', roleType: 'teacher', department: 'English & Literature', status: 'On Leave', remarks: 'Medical Leave' },
      { staffId: 't-4', staffName: 'Dr. Vikram Sharma', roleType: 'teacher', department: 'Chemistry & STEM', status: 'Present', arrivalTime: '08:02' },
      { staffId: 't-5', staffName: 'Michael Chang', roleType: 'teacher', department: 'Social Sciences & History', status: 'Present', arrivalTime: '08:12' },
      { staffId: 't-6', staffName: 'Sunita Rao', roleType: 'teacher', department: 'Primary Education', status: 'Present', arrivalTime: '07:52' },
      { staffId: 'st-1', staffName: 'Kavita Chawla', roleType: 'staff', department: 'Front Desk Administration', status: 'Present', arrivalTime: '07:45' },
      { staffId: 'st-2', staffName: 'Alok Saxena', roleType: 'staff', department: 'Accounts & Bursar', status: 'Present', arrivalTime: '08:10' },
      { staffId: 'st-3', staffName: 'Nandini Krishnan', roleType: 'staff', department: 'Library & Media Center', status: 'Present', arrivalTime: '08:00' },
      { staffId: 'st-4', staffName: 'Rajesh Kumar', roleType: 'staff', department: 'Campus Security & Transport', status: 'Present', arrivalTime: '07:30' }
    ]
  }
];

export const INITIAL_LEAVE_REQUESTS: StaffLeaveRequest[] = [
  {
    id: 'leave-req-101',
    staffId: 't-3',
    staffName: 'Emily Chen',
    staffRole: 'Senior English Faculty',
    department: 'English & Literature',
    leaveType: 'Sick / Medical Leave',
    startDate: '2026-10-17',
    endDate: '2026-10-19',
    totalDays: 3,
    reason: 'Acute respiratory infection and fever. Advised bed rest by general physician.',
    attachmentName: 'medical_certificate_chen.pdf',
    attachmentSize: '1.2 MB',
    status: 'Approved',
    appliedAt: '2026-10-16T14:30:00.000Z',
    reviewedByRole: 'principal',
    reviewedByName: 'Dr. Arthur Campbell',
    reviewedAt: '2026-10-16T16:15:00.000Z',
    reviewNote: 'Approved with medical certificate verified. Substituted classes assigned to Mrs. Sunita Rao.'
  },
  {
    id: 'leave-req-102',
    staffId: 't-5',
    staffName: 'Michael Chang',
    staffRole: 'History & Social Studies Teacher',
    department: 'Social Sciences & History',
    leaveType: 'Academic / Duty Leave',
    startDate: '2026-10-24',
    endDate: '2026-10-25',
    totalDays: 2,
    reason: 'Keynote panelist at Regional UNESCO History Educators Symposium in Bengaluru.',
    attachmentName: 'symposium_invitation_letter.pdf',
    attachmentSize: '420 KB',
    status: 'Pending',
    appliedAt: '2026-10-17T09:10:00.000Z'
  },
  {
    id: 'leave-req-103',
    staffId: 't-2',
    staffName: 'Mark Vance',
    staffRole: 'Physics Department Lead',
    department: 'Physical Sciences',
    leaveType: 'Casual Leave',
    startDate: '2026-10-10',
    endDate: '2026-10-10',
    totalDays: 1,
    reason: 'Family emergency and municipal document registration.',
    status: 'Approved',
    appliedAt: '2026-10-08T11:00:00.000Z',
    reviewedByRole: 'vice_principal',
    reviewedByName: 'Evelyn Hayes',
    reviewedAt: '2026-10-08T15:20:00.000Z',
    reviewNote: 'Approved. Advance laboratory experiment rescheduled.'
  },
  {
    id: 'leave-req-104',
    staffId: 'st-4',
    staffName: 'Rajesh Kumar',
    staffRole: 'Transport Supervisor',
    department: 'Campus Security & Transport',
    leaveType: 'Casual Leave',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    totalDays: 2,
    reason: 'Personal pilgrimage and family wedding.',
    status: 'Pending',
    appliedAt: '2026-10-18T08:00:00.000Z'
  },
  {
    id: 'leave-req-105',
    staffId: 't-4',
    staffName: 'Dr. Vikram Sharma',
    staffRole: 'Senior STEM & Chemistry Faculty',
    department: 'Chemistry & STEM',
    leaveType: 'Casual Leave',
    startDate: '2026-11-04',
    endDate: '2026-11-05',
    totalDays: 2,
    reason: 'Attending elder daughter convocation ceremony.',
    status: 'Pending',
    appliedAt: '2026-10-18T07:45:00.000Z'
  }
];

export const INITIAL_CORRECTION_REQUESTS: AttendanceCorrectionRequest[] = [
  {
    id: 'corr-req-001',
    attendanceRecordId: 'att-2026-10-18-10a-p1',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: '2026-10-18',
    period: 'Period 1 (08:30 - 09:15)',
    originalStatus: 'Absent',
    requestedStatus: 'Late',
    reason: 'Student arrived at 08:42 AM with official school bus #4 delay slip signed by receptionist Kavita Chawla.',
    requestedByRole: 'teacher',
    requestedByName: 'Dr. Sarah Jenkins',
    requestedAt: '2026-10-18T08:50:00.000Z',
    status: 'Pending'
  },
  {
    id: 'corr-req-002',
    attendanceRecordId: 'att-2026-10-17-10a-p1',
    studentId: 'std-10a-02',
    studentName: 'Diya Kapoor',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: '2026-10-17',
    period: 'Period 1 (08:30 - 09:15)',
    originalStatus: 'Absent',
    requestedStatus: 'Excused',
    reason: 'Student was officially participating in Interschool Model United Nations representing GIS.',
    requestedByRole: 'teacher',
    requestedByName: 'Dr. Sarah Jenkins',
    requestedAt: '2026-10-17T11:20:00.000Z',
    status: 'Approved',
    reviewedByRole: 'vice_principal',
    reviewedByName: 'Evelyn Hayes',
    reviewedAt: '2026-10-17T14:00:00.000Z',
    reviewNote: 'Verified with MUN delegation roster. Status updated to Excused.'
  },
  {
    id: 'corr-req-003',
    attendanceRecordId: 'att-2026-10-16-10a-p1',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: '2026-10-16',
    period: 'Period 1 (08:30 - 09:15)',
    originalStatus: 'Late',
    requestedStatus: 'Present',
    reason: 'Teacher thought student was 10 mins late, but bell was delayed by 5 mins.',
    requestedByRole: 'teacher',
    requestedByName: 'Dr. Vikram Sharma',
    requestedAt: '2026-10-16T10:15:00.000Z',
    status: 'Rejected',
    reviewedByRole: 'principal',
    reviewedByName: 'Dr. Arthur Campbell',
    reviewedAt: '2026-10-16T12:00:00.000Z',
    reviewNote: 'Biometric gate timestamp records 08:36 arrival. Morning cutoff is 08:30. Tardy status stands.'
  }
];

export const INITIAL_STUDENT_MOVEMENTS: StudentMovementRecord[] = [
  {
    id: 'mov-001',
    type: 'Late Arrival',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: '2026-10-18',
    time: '08:42 AM',
    reason: 'School Bus #4 mechanical delay along Ring Road metro line',
    authorizedByPerson: 'Bus Driver: Mohan Lal (Slip #402)',
    recordedByStaffName: 'Kavita Chawla',
    recordedByRole: 'Receptionist / Front Office',
    statusUpdatedInAttendance: true,
    notes: 'Late gate entry issued. Sent directly to Period 1 Math.'
  },
  {
    id: 'mov-002',
    type: 'Late Arrival',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    classId: 'class-8a',
    className: 'Grade 8A',
    date: '2026-10-17',
    time: '08:38 AM',
    reason: 'Torrential rain and severe traffic congestion at Whitefield junction',
    authorizedByPerson: 'Parent: Ramesh Sharma (accompanied)',
    recordedByStaffName: 'Kavita Chawla',
    recordedByRole: 'Receptionist / Front Office',
    statusUpdatedInAttendance: true,
    notes: 'Parent accompanied student to reception desk.'
  },
  {
    id: 'mov-003',
    type: 'Early Departure',
    studentId: 'std-10a-04',
    studentName: 'Sara Khan',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: '2026-10-16',
    time: '01:15 PM',
    reason: 'Scheduled dental surgery and orthodontics clinic appointment',
    authorizedByPerson: 'Father: Tariq Khan (Govt ID verified)',
    recordedByStaffName: 'Kavita Chawla',
    recordedByRole: 'Receptionist / Front Office',
    statusUpdatedInAttendance: true,
    notes: 'Gate pass #GP-883 issued. Student checked out safely.'
  },
  {
    id: 'mov-004',
    type: 'Early Departure',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    classId: 'class-10a',
    className: 'Grade 10A',
    date: '2026-10-18',
    time: '02:00 PM',
    reason: 'National STEM Olympiad finalist stage rehearsal at State Institute',
    authorizedByPerson: 'Vice Principal Evelyn Hayes (Official letter)',
    recordedByStaffName: 'Kavita Chawla',
    recordedByRole: 'Receptionist / Front Office',
    statusUpdatedInAttendance: false,
    notes: 'Class teacher informed in advance.'
  }
];

// Helper: Calculate individual student attendance rate according to institutional policy
export function calculateStudentAttendanceStats(
  studentId: string,
  attendanceRecords: AttendanceRecord[],
  policy: AttendancePolicySettings = INITIAL_ATTENDANCE_POLICY
): {
  totalEligibleSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  halfDayCount: number;
  excusedCount: number;
  notMarkedCount: number;
  attendancePercentage: number | null;
} {
  let totalEligibleSessions = 0;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let halfDayCount = 0;
  let excusedCount = 0;
  let notMarkedCount = 0;

  attendanceRecords.forEach((att) => {
    const rec = att.records.find((r) => r.studentId === studentId);
    if (!rec) return;

    if (rec.status === 'Not Marked') {
      notMarkedCount++;
      return; // Not marked records do not form part of the denominator or numerator
    }

    totalEligibleSessions++;

    switch (rec.status) {
      case 'Present':
        presentCount++;
        break;
      case 'Absent':
        absentCount++;
        break;
      case 'Late':
        lateCount++;
        break;
      case 'Half Day':
        halfDayCount++;
        break;
      case 'Excused':
        excusedCount++;
        break;
    }
  });

  if (totalEligibleSessions === 0) {
    return {
      totalEligibleSessions: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      halfDayCount: 0,
      excusedCount: 0,
      notMarkedCount,
      attendancePercentage: null // Explicit N/A rather than divide by zero
    };
  }

  // Calculate numerator with policy weights
  let presentEquivalent = presentCount;
  presentEquivalent += (lateCount * policy.countLateAsPresentPercentage) / 100;
  presentEquivalent += (halfDayCount * policy.countHalfDayAsPercentage) / 100;
  if (policy.countExcusedAsPresent) {
    presentEquivalent += excusedCount;
  }

  const attendancePercentage = Math.round((presentEquivalent / totalEligibleSessions) * 100);

  return {
    totalEligibleSessions,
    presentCount,
    absentCount,
    lateCount,
    halfDayCount,
    excusedCount,
    notMarkedCount,
    attendancePercentage
  };
}

// Helper: Calculate class roll call stats for a given date
export function calculateClassAttendanceStats(
  classId: string,
  date: string,
  attendanceRecords: AttendanceRecord[]
): {
  isRecorded: boolean;
  status: 'Draft' | 'Submitted' | 'Missing';
  presentCount: number;
  absentCount: number;
  lateCount: number;
  halfDayCount: number;
  excusedCount: number;
  notMarkedCount: number;
  totalStudents: number;
  rate: number;
} {
  const match = attendanceRecords.find((a) => a.classId === classId && a.date === date);
  if (!match) {
    return {
      isRecorded: false,
      status: 'Missing',
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      halfDayCount: 0,
      excusedCount: 0,
      notMarkedCount: 0,
      totalStudents: 0,
      rate: 0
    };
  }

  const records = match.records;
  const present = records.filter((r) => r.status === 'Present').length;
  const absent = records.filter((r) => r.status === 'Absent').length;
  const late = records.filter((r) => r.status === 'Late').length;
  const halfDay = records.filter((r) => r.status === 'Half Day').length;
  const excused = records.filter((r) => r.status === 'Excused').length;
  const notMarked = records.filter((r) => r.status === 'Not Marked').length;

  const total = records.length;
  const presentEquivalent = present + late + excused + halfDay * 0.5;
  const rate = total > 0 ? Math.round((presentEquivalent / (total - notMarked || 1)) * 100) : 0;

  return {
    isRecorded: true,
    status: match.status || 'Submitted',
    presentCount: present,
    absentCount: absent,
    lateCount: late,
    halfDayCount: halfDay,
    excusedCount: excused,
    notMarkedCount: notMarked,
    totalStudents: total,
    rate
  };
}

// Helper: Real working CSV Export for Attendance Reports
export function exportAttendanceCSV(
  reportType: 'daily_class' | 'student_history' | 'staff_attendance' | 'leave_summary' | 'movement_log',
  attendanceRecords: AttendanceRecord[],
  classes: ClassInfo[],
  students: Student[],
  staffList: (Teacher | Staff)[],
  leaveRequests: StaffLeaveRequest[],
  movements: StudentMovementRecord[]
) {
  let filename = `SCHLAR_Attendance_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
  let csvContent = '';

  if (reportType === 'daily_class') {
    csvContent = 'Date,Class ID,Class Name,Period,Teacher ID,Submission Status,Total Enrolled,Present,Absent,Late,Excused,Rate %\n';
    attendanceRecords.forEach((att) => {
      const cls = classes.find((c) => c.id === att.classId);
      const present = att.records.filter((r) => r.status === 'Present').length;
      const absent = att.records.filter((r) => r.status === 'Absent').length;
      const late = att.records.filter((r) => r.status === 'Late').length;
      const excused = att.records.filter((r) => r.status === 'Excused').length;
      const rate = att.records.length > 0 ? Math.round(((present + late + excused) / att.records.length) * 100) : 0;
      csvContent += `"${att.date}","${att.classId}","${cls?.name || att.classId}","${att.period}","${att.teacherId}","${att.status || 'Submitted'}",${att.records.length},${present},${absent},${late},${excused},${rate}%\n`;
    });
  } else if (reportType === 'student_history') {
    csvContent = 'Date,Class,Student ID,Student Name,Roll No,Period,Status,Arrival Time,Remarks\n';
    attendanceRecords.forEach((att) => {
      const cls = classes.find((c) => c.id === att.classId);
      att.records.forEach((r) => {
        const std = students.find((s) => s.id === r.studentId);
        csvContent += `"${att.date}","${cls?.name || att.classId}","${r.studentId}","${r.studentName}","${std?.rollNo || '-'}","${att.period}","${r.status}","${r.arrivalTime || '-'}","${r.remarks || '-'}"\n`;
      });
    });
  } else if (reportType === 'leave_summary') {
    csvContent = 'Leave ID,Staff ID,Staff Name,Role,Department,Leave Type,Start Date,End Date,Days,Status,Reviewer,Review Note\n';
    leaveRequests.forEach((l) => {
      csvContent += `"${l.id}","${l.staffId}","${l.staffName}","${l.staffRole}","${l.department}","${l.leaveType}","${l.startDate}","${l.endDate}",${l.totalDays},"${l.status}","${l.reviewedByName || '-'}","${l.reviewNote || '-'}"\n`;
    });
  } else if (reportType === 'movement_log') {
    csvContent = 'Log ID,Movement Type,Date,Time,Class,Student Name,Reason,Authorized By,Recorded By Staff,Attendance Sync\n';
    movements.forEach((m) => {
      csvContent += `"${m.id}","${m.type}","${m.date}","${m.time}","${m.className}","${m.studentName}","${m.reason}","${m.authorizedByPerson || '-'}","${m.recordedByStaffName}","${m.statusUpdatedInAttendance ? 'Yes' : 'No'}"\n`;
    });
  }

  // Generate real downloadable Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
