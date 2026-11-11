export type PlatformType = 'web' | 'mobile';

export type PaletteId =
  | 'palette_1' // Navy & Teal
  | 'palette_2' // Forest & Champagne
  | 'palette_3' // Oxblood & Blush
  | 'palette_4' // Cobalt & Electric Lime
  | 'palette_5' // Terracotta & Sage
  | 'palette_6' // Graphite & Ice Lavender
  | 'palette_7' // Petrol & Copper (DEFAULT)
  | 'palette_8' // Indigo & Marigold
  | 'palette_9' // Royal Purple & Gold
  | 'palette_10' // Emerald & Coral
  | 'palette_11' // Black & Gold
  | 'palette_12' // Sky & Midnight
  | 'custom';

export type ThemeColor = PaletteId | 'blue' | 'purple' | 'green' | 'teal' | 'amber' | 'red' | 'indigo' | 'slate';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
}

export interface ThemeConfig {
  id: PaletteId | string;
  name: string;
  number?: number;
  hex: string; // primary color hex
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  hover: string;
  light: string;
  border: string;
  dark: string;
  ring: string;
}

export interface PaletteDefinition {
  id: PaletteId;
  name: string;
  number: number;
  colors: ThemeColors;
  description: string;
}

export interface CustomThemeRecord {
  id: string;
  name: string;
  colors: ThemeColors;
  createdAt: string;
  updatedAt?: string;
}

// Exactly 10 approved roles (Teacher and Parent support Web and Mobile experiences)
export type RoleType = 
  | 'principal'        // 1. Admin
  | 'vice_principal'   // 2. Vice Principal
  | 'teacher'          // 3. Teacher (Web Portal)
  | 'teacher_mobile'   // 3. Teacher (Mobile App)
  | 'parent'           // 4. Parent (Web Portal)
  | 'parent_mobile'    // 4. Parent (Mobile App)
  | 'accountant'       // 5. Accountant / Fee Manager
  | 'hr'               // 6. HR / Staff Manager
  | 'librarian'        // 7. Librarian
  | 'transport'        // 8. Transport Manager
  | 'receptionist'     // 9. Receptionist / Front Office
  | 'exam_coordinator';// 10. Exam Coordinator

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: RoleType;
  actorName: string;
  action: string;
  module: string;
  recordRef: string;
  reason?: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

export interface RecordDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Missing';
  fileSize?: string;
  verifiedBy?: string;
}

export interface LifecycleEntry {
  id: string;
  date: string;
  action: string;
  note: string;
  actor: string;
}

export interface Student {
  id: string;
  name: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
  admissionId: string;
  admissionDate?: string;
  academicYear?: string;
  classId: string;
  section: string;
  rollNo: number;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  nationality?: string;
  parentName: string;
  guardianRelation?: 'Father' | 'Mother' | 'Guardian';
  parentPhone: string;
  parentEmail: string;
  parentOccupation?: string;
  secondaryGuardianName?: string;
  secondaryGuardianPhone?: string;
  secondaryGuardianRelation?: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  attendanceRate: number;
  academicStatus: 'Exceeding' | 'On Track' | 'Needs Attention';
  status: 'Active' | 'Inactive' | 'Transferred' | 'Withdrawn' | 'Archived';
  avatar?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyContactPerson?: string;
  medicalAlerts?: string;
  authorizedPickup?: string;
  previousSchool?: string;
  previousAdmissionRef?: string;
  internalNotes?: string;
  documents?: RecordDocument[];
  lifecycleHistory?: LifecycleEntry[];
}

export interface Teacher {
  id: string;
  staffId?: string;
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  department?: string;
  qualification: string;
  certifications?: string[];
  subjects: string[];
  subjectSpecialization?: string;
  classes: string[];
  classTeacherOf?: string;
  workloadHours: number;
  attendanceRate: number;
  joinDate: string;
  room: string;
  employmentType?: 'Full-time' | 'Contract' | 'Part-time';
  status: 'Active' | 'On Leave' | 'Inactive';
  reportingManager?: string;
  experienceYears?: number;
  address?: string;
  emergencyContact?: string;
  avatar?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  documents?: RecordDocument[];
  lifecycleHistory?: LifecycleEntry[];
}

export interface Staff {
  id: string;
  staffId?: string;
  name: string;
  department: string;
  role: string;
  phone: string;
  email: string;
  joinDate: string;
  employmentType?: 'Full-time' | 'Contract' | 'Part-time';
  status: 'Active' | 'On Leave' | 'Inactive';
  reportingManager?: string;
  address?: string;
  emergencyContact?: string;
  shift?: string;
  responsibilities?: string;
  qualifications?: string;
  certifications?: string[];
  avatar?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  documents?: RecordDocument[];
  lifecycleHistory?: LifecycleEntry[];
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  classTeacherId: string;
  classTeacherName: string;
  room: string;
  capacity: number;
  studentCount: number;
  attendanceToday: number;
  subjects: string[];
  academicYearId?: string;
  status?: 'Active' | 'Archived';
}

export interface TermInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  examStartDate: string;
  examEndDate: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Upcoming' | 'Archived';
  terms: TermInfo[];
  workingDays: string[];
  holidaysCount: number;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  category: 'Core Academic' | 'Science & Lab' | 'Humanities' | 'Technology' | 'Arts & Physical Ed';
  applicableGrades: string[];
  departmentHodId?: string;
  departmentHodName?: string;
  periodsPerWeek: number;
  textbook?: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

export interface SubjectAllocation {
  id: string;
  academicYearId: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  periodsPerWeek: number;
  room?: string;
}

export interface PeriodConfig {
  id: string;
  number: number;
  name: string;
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:15"
  type: 'Teaching' | 'Break' | 'Lunch' | 'Assembly';
  displayOrder: number;
  isActive: boolean;
}

export interface TimetableEntry {
  id: string;
  academicYearId: string;
  classId: string;
  section: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodId: string;
  periodName: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  notes?: string;
  status: 'Draft' | 'Published';
}

export interface TimetableVersion {
  id: string;
  academicYearId: string;
  classId: string;
  versionNumber: string;
  status: 'Draft' | 'Under Review' | 'Published' | 'Archived';
  effectiveDate: string;
  lastUpdated: string;
  updatedBy: string;
  notes?: string;
}

export interface TimetableConflict {
  type: 'Teacher' | 'Class' | 'Room' | 'Duplicate' | 'TimeRange';
  severity: 'blocking' | 'warning';
  title: string;
  message: string;
  conflictingEntryId?: string;
}

export type StudentAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'Excused' | 'Not Marked';

export interface StudentAttendanceEntry {
  studentId: string;
  studentName: string;
  status: StudentAttendanceStatus;
  arrivalTime?: string;
  remarks?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  classId: string;
  period: string;
  teacherId: string;
  academicYearId?: string;
  section?: string;
  subjectId?: string;
  subjectName?: string;
  status?: 'Draft' | 'Submitted';
  submittedAt?: string;
  submittedBy?: string;
  records: StudentAttendanceEntry[];
}

export interface AttendanceCorrectionRequest {
  id: string;
  attendanceRecordId: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  period: string;
  originalStatus: StudentAttendanceStatus;
  requestedStatus: StudentAttendanceStatus;
  reason: string;
  requestedByRole: RoleType;
  requestedByName: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedByRole?: RoleType;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export type StaffAttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave' | 'Not Marked';

export interface StaffAttendanceEntry {
  staffId: string;
  staffName: string;
  roleType: 'teacher' | 'staff';
  department: string;
  status: StaffAttendanceStatus;
  arrivalTime?: string;
  departureTime?: string;
  remarks?: string;
}

export interface StaffDailyAttendance {
  id: string;
  date: string;
  status: 'Draft' | 'Submitted';
  submittedAt?: string;
  submittedBy?: string;
  entries: StaffAttendanceEntry[];
}

export type LeaveType =
  | 'Casual Leave'
  | 'Sick / Medical Leave'
  | 'Earned Leave'
  | 'Academic / Duty Leave'
  | 'Maternity / Paternity Leave'
  | 'Emergency Leave';

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentName?: string;
  attachmentSize?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedAt: string;
  reviewedByRole?: RoleType;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export type MovementType = 'Late Arrival' | 'Early Departure';

export interface StudentMovementRecord {
  id: string;
  type: MovementType;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  reason: string;
  authorizedByPerson?: string;
  recordedByStaffName: string;
  recordedByRole: string;
  statusUpdatedInAttendance?: boolean;
  notes?: string;
}

export interface AttendancePolicySettings {
  morningCutoffTime: string;
  lateThresholdMinutes: number;
  minimumRequiredPercentage: number;
  countLateAsPresentPercentage: number;
  countHalfDayAsPercentage: number;
  countExcusedAsPresent: boolean;
  allowTeacherSameDayEditsOnly: boolean;
  requireCorrectionApproval: boolean;
}

export type ExamStatus =
  | 'Upcoming'
  | 'Completed'
  | 'Marks Pending'
  | 'Draft'
  | 'Scheduled'
  | 'Ongoing'
  | 'Marks Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Published'
  | 'Archived';

export interface ExamSession {
  id: string;
  examId: string;
  classId: string;
  className: string;
  section: string;
  subjectId: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  room: string;
  invigilatorTeacherId: string;
  invigilatorName: string;
  status: 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';
}

export interface SubjectAssessmentConfig {
  id: string;
  examId: string;
  classId: string;
  className: string;
  section: string;
  subjectId: string;
  subjectName: string;
  maxWrittenMarks: number;
  maxPracticalMarks: number;
  maxInternalMarks: number;
  totalMaxMarks: number;
  passingMarks: number;
  passingPercentage: number;
  assignedTeacherId: string;
  assignedTeacherName: string;
  status: 'Not Started' | 'Draft' | 'Submitted' | 'Under Review' | 'Returned' | 'Approved' | 'Published';
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface GradeBoundary {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpa: number;
  description: string;
  isPassing: boolean;
}

export interface Exam {
  id: string;
  name: string;
  term: string;
  classId: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  totalMarks: number;
  status: ExamStatus;
  academicYearId?: string;
  applicableClassIds?: string[];
  startDate?: string;
  endDate?: string;
  instructions?: string;
  publishedAt?: string;
  publishedBy?: string;
  sessions?: ExamSession[];
  subjectConfigs?: SubjectAssessmentConfig[];
}

export interface MarkEntry {
  id: string;
  examId: string;
  classId: string;
  subject: string;
  studentId: string;
  studentName: string;
  marksObtained: number | null;
  totalMarks: number;
  grade: string;
  remarks?: string;
  writtenMarks?: number;
  practicalMarks?: number;
  internalMarks?: number;
  assessmentStatus?: 'Entered' | 'Not Entered' | 'Absent' | 'Exempt';
  admissionId?: string;
  rollNo?: number;
  isAbsent?: boolean;
  isExempt?: boolean;
  percentage?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo?: number;
  admissionId?: string;
  status: 'Submitted' | 'Late' | 'Pending' | 'Graded';
  submittedDate?: string;
  marksObtained?: number;
  maxMarks?: number;
  grade?: string;
  feedback?: string;
  attachmentName?: string;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  section?: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  description: string;
  dueDate: string;
  createdDate: string;
  status: 'Published' | 'Draft' | 'Graded' | 'Archived';
  submissionsCount: number;
  totalStudents: number;
  maxMarks?: number;
  attachmentName?: string;
  attachmentSize?: string;
  instructions?: string;
  submissions?: AssignmentSubmission[];
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  totalFee: number;
  paid: number;
  pending: number;
  dueDate: string;
  status: 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Card';
  referenceNumber: string;
  feeRecordId: string;
  notes?: string;
  receivedBy: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelf: string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  publisher?: string;
  edition?: string;
  publishYear?: number;
  description?: string;
}

export interface BookCopy {
  id: string; // barcode e.g. BC-PHY-001
  bookId: string;
  copyNumber: number;
  barcode: string;
  shelf: string;
  acquisitionYear: number;
  condition: 'Pristine' | 'Good' | 'Fair' | 'Worn' | 'Damaged';
  status: 'Available' | 'Issued' | 'Reserved' | 'Lost' | 'Damaged' | 'Archived';
  borrowerId?: string;
  borrowerName?: string;
  borrowerType?: 'Student' | 'Faculty';
}

export interface BookReservation {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberType: 'Student' | 'Faculty';
  memberRoleOrClass: string;
  reservedDate: string;
  queuePosition: number;
  status: 'Waitlisted' | 'Ready for Pickup' | 'Fulfilled' | 'Cancelled';
  pickupDeadline?: string;
}

export interface LostOrDamagedRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  copyBarcode: string;
  reportedDate: string;
  memberId?: string;
  memberName?: string;
  conditionIssue: 'Torn Pages' | 'Water Damage' | 'Cover Detached' | 'Missing/Lost';
  chargeAmount: number;
  status: 'Pending Assessment' | 'Billed' | 'Written Off' | 'Restored';
  notes?: string;
}

export interface LibraryTransaction {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  className: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Issued' | 'Returned' | 'Overdue';
  fineAmount: number;
  copyBarcode?: string;
  memberType?: 'Student' | 'Faculty';
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  makeModel: string;
  type: 'Bus' | 'Mini-Bus' | 'Van';
  capacity: number;
  assignedRouteId?: string;
  assignedRouteName?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  conductorName?: string;
  status: 'Active' | 'Under Maintenance' | 'Inactive';
  insuranceExpiry: string;
  fitnessExpiry: string;
  fuelType: 'Diesel' | 'CNG' | 'Electric';
  lastServiceDate: string;
  gpsUnitId: string;
}

export interface TransportStop {
  id: string;
  routeId: string;
  stopName: string;
  landmark: string;
  morningPickupTime: string;
  afternoonDropTime: string;
  sequence: number;
  studentsCount: number;
}

export interface TransportRoute {
  id: string;
  routeNumber: string;
  name: string;
  startPoint: string;
  endPoint: string;
  busId: string;
  busNumber: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  conductorName: string;
  capacity: number;
  assignedCount: number;
  morningStart: string;
  afternoonStart: string;
  operatingDays: string;
  status: 'Active' | 'On Route' | 'Maintenance' | 'Inactive';
  stops: TransportStop[];
}

export interface StudentTransportAssignment {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  routeId: string;
  routeNumber: string;
  pickupStopId: string;
  pickupStopName: string;
  dropoffStopId: string;
  dropoffStopName: string;
  guardianContact: string;
  seatNumber?: number;
  status: 'Active' | 'Suspended' | 'Temporary';
  effectiveDate: string;
}

export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  serviceType: string;
  serviceDate: string;
  nextDueDate: string;
  cost: number;
  serviceCenter: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Overdue';
  notes?: string;
}

export interface TransportIncident {
  id: string;
  incidentNumber: string;
  date: string;
  time: string;
  routeId?: string;
  routeNumber?: string;
  vehicleRegistration: string;
  driverName: string;
  category: 'Traffic Delay' | 'Mechanical Breakdown' | 'Minor Scrape' | 'Student Misconduct' | 'Weather Detour';
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  actionTaken: string;
  status: 'Resolved' | 'Under Investigation';
}

export interface TransportAnnouncement {
  id: string;
  title: string;
  message: string;
  targetRoute: string; // 'All Routes' | route ID
  publishDate: string;
  status: 'Published' | 'Draft';
  author: string;
  priority: 'Normal' | 'Urgent';
}


export interface Visitor {
  id: string;
  visitorName: string;
  organization?: string;
  purpose: string;
  personToMeet: string;
  phone: string;
  entryTime: string;
  exitTime?: string;
  expectedTime?: string;
  status: 'Checked In' | 'Checked Out' | 'Expected';
  badgeNo: string;
  date: string;
  notes?: string;
}

export interface Enquiry {
  id: string;
  parentName: string;
  studentName: string;
  grade: string;
  contact: string;
  source: 'Walk-in' | 'Website' | 'Referral' | 'Social Media' | 'Phone';
  notes: string;
  status: 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';
  date: string;
  followUpDate?: string;
  assignedStaff?: string;
}

export interface Appointment {
  id: string;
  parentName: string;
  studentName: string;
  meetWith: string;
  role: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  visitorPhone?: string;
  notes?: string;
}

export interface FrontOfficeCommunication {
  id: string;
  timestamp: string;
  type: 'Phone Call' | 'Front Desk Walk-in' | 'Email Inquiry';
  contactPerson: string;
  contactNumber: string;
  regardingStudent?: string;
  summary: string;
  handledBy: string;
  status: 'Resolved' | 'Follow-up Required';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'School' | 'Class' | 'Exam' | 'Event' | 'Important';
  targetAudience: string;
  date: string;
  author: string;
  priority: 'Normal' | 'High' | 'Urgent';
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  audience?: string;
  targetAudience?: 'All School Community' | 'Students & Faculty' | 'Parents & Faculty' | 'High School Grades 9-10' | 'Middle School Grades 7-8' | string;
  status?: 'Upcoming' | 'Ongoing' | 'Completed';
  description: string;
  category: 'Sports' | 'Academic' | 'Cultural' | 'Meeting' | 'Exams' | 'Parent Meeting' | 'Assembly' | 'Holiday';
}

export interface Message {
  id: string;
  threadId: string;
  senderRole: string;
  senderName: string;
  recipientRole: string;
  recipientName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface NotificationItem {
  id: string;
  targetRole: RoleType | 'all';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetModule: string;
  priority: 'normal' | 'urgent';
}

export type ChildId = 'aarav' | 'ananya';

export interface ChildProfile {
  id: ChildId;
  studentId: string;
  name: string;
  grade: string;
  section: string;
  rollNo: number;
  admissionId: string;
  classTeacher: string;
  attendancePercentage: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  overallGrade: string;
  overallScore: number;
  avatar: string;
  subjects: {
    subject: string;
    score: number;
    grade: string;
    teacher: string;
    feedback: string;
  }[];
  monthlyAttendance: { month: string; rate: number }[];
  todaySchedule: { period: string; time: string; subject: string; teacher: string; room: string }[];
  fees: {
    total: number;
    paid: number;
    pending: number;
    dueDate: string;
    status: 'Paid' | 'Partially Paid' | 'Pending';
  };
}

export interface UserProfile {
  id: string;
  role: RoleType;
  fullName: string;
  name?: string;
  title: string;
  email: string;
  phone: string;
  schoolName: string;
  avatarText: string;
  accountStatus: 'Active' | 'Pending' | 'Suspended';
  userId: string;
  department?: string;
  officeLocation?: string;
  qualifications?: string;
  specialization?: string;
  assignedClasses?: string[];
  subjects?: string[];
  approvalLimit?: string;
  shiftHours?: string;
  relationship?: string;
  childrenNames?: string[];
  emergencyContact?: string;
  residentialAddress?: string;
  administrativeScope?: string;
  preferences: {
    notificationsEmail: boolean;
    notificationsSms: boolean;
    notificationsPush: boolean;
    language: string;
    theme: 'light' | 'dark' | 'system';
  };
}

