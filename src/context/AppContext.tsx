import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PlatformType,
  RoleType,
  Student,
  Teacher,
  Staff,
  ClassInfo,
  AttendanceRecord,
  Exam,
  MarkEntry,
  Assignment,
  FeeRecord,
  PaymentReceipt,
  Book,
  LibraryTransaction,
  Visitor,
  Enquiry,
  Appointment,
  Notice,
  SchoolEvent,
  Message,
  NotificationItem,
  ChildId,
  ChildProfile,
  UserProfile,
  ThemeColor,
  PaletteId,
  ThemeColors,
  CustomThemeRecord,
  AuditLogEntry,
  AcademicYear,
  SubjectItem,
  SubjectAllocation,
  PeriodConfig,
  TimetableEntry,
  TimetableVersion,
  TimetableConflict,
  StudentAttendanceStatus,
  StudentAttendanceEntry,
  AttendanceCorrectionRequest,
  StaffAttendanceStatus,
  StaffAttendanceEntry,
  StaffDailyAttendance,
  LeaveType,
  StaffLeaveRequest,
  StudentMovementRecord,
  AttendancePolicySettings
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_STAFF,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_MARKS,
  INITIAL_ASSIGNMENTS,
  INITIAL_FEES,
  INITIAL_PAYMENTS,
  INITIAL_BOOKS,
  INITIAL_LIBRARY_TRANSACTIONS,
  INITIAL_VISITORS,
  INITIAL_ENQUIRIES,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHILDREN,
  INITIAL_PROFILES,
  INITIAL_AUDIT_LOGS
} from '../data/initialData';
import {
  INITIAL_DETAILED_ATTENDANCE,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_CORRECTION_REQUESTS,
  INITIAL_STUDENT_MOVEMENTS,
  INITIAL_ATTENDANCE_POLICY
} from '../data/attendanceData';
import {
  INITIAL_ACADEMIC_YEARS,
  INITIAL_SUBJECTS,
  INITIAL_SUBJECT_ALLOCATIONS,
  INITIAL_PERIODS,
  INITIAL_TIMETABLE_ENTRIES,
  INITIAL_TIMETABLE_VERSIONS,
  AVAILABLE_ROOMS,
  checkTimetableConflict
} from '../data/academicData';
import { checkPermission, canEditStudentField, canEditTeacherField, canEditStaffField } from '../data/permissions';
import {
  INITIAL_DETAILED_EXAMS,
  INITIAL_DETAILED_MARKS,
  INITIAL_DETAILED_ASSIGNMENTS
} from '../data/examinationData';
import {
  SCHLAR_PALETTES,
  DEFAULT_PALETTE_ID,
  DEFAULT_THEME_COLORS,
  applyThemeVariables
} from '../data/themes';
import { APP_BRAND } from '../config/branding';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & Session
  isWelcomeScreen: boolean;
  setIsWelcomeScreen: (val: boolean) => void;
  currentPlatform: PlatformType;
  setCurrentPlatform: (platform: PlatformType) => void;
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  selectedChild: ChildId;
  setSelectedChild: (childId: ChildId) => void;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean) => void;

  // Theme & Layout
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  activePaletteId: PaletteId;
  themeColors: ThemeColors;
  setThemePalette: (paletteId: PaletteId) => void;
  applyCustomThemeColors: (colors: ThemeColors, paletteId?: PaletteId) => void;
  customThemes: CustomThemeRecord[];
  saveCustomTheme: (name: string, colors: ThemeColors) => void;
  deleteCustomTheme: (id: string) => void;
  renameCustomTheme: (id: string, name: string) => void;
  resetThemeToDefault: () => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (val: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleMobileSidebar: () => void;
  navigationHistory: string[];
  goBack: () => void;
  navigateTo: (tab: string) => void;
  quickSearchOpen: boolean;
  setQuickSearchOpen: (val: boolean) => void;
  activeScenarioModal: number | null;
  setActiveScenarioModal: (val: number | null) => void;
  runScenario: (scenarioNum: number) => void;

  // Domain Entities
  classes: ClassInfo[];
  students: Student[];
  teachers: Teacher[];
  staff: Staff[];
  attendance: AttendanceRecord[];
  exams: Exam[];
  marks: MarkEntry[];
  assignments: Assignment[];
  fees: FeeRecord[];
  setFees: React.Dispatch<React.SetStateAction<FeeRecord[]>>;
  payments: PaymentReceipt[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentReceipt[]>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  libraryTransactions: LibraryTransaction[];
  setLibraryTransactions: React.Dispatch<React.SetStateAction<LibraryTransaction[]>>;
  visitors: Visitor[];
  enquiries: Enquiry[];
  appointments: Appointment[];
  notices: Notice[];
  events: SchoolEvent[];
  messages: Message[];
  notifications: NotificationItem[];
  childrenData: Record<ChildId, ChildProfile>;
  userProfiles: Record<string, UserProfile>;
  auditLogs: AuditLogEntry[];
  examModerationStatus: 'Draft' | 'Submitted' | 'Approved' | 'Published';

  // Academic Management Entities (Prompt 3)
  academicYears: AcademicYear[];
  activeAcademicYearId: string;
  setActiveAcademicYearId: (id: string) => void;
  subjects: SubjectItem[];
  subjectAllocations: SubjectAllocation[];
  periods: PeriodConfig[];
  timetableEntries: TimetableEntry[];
  timetableVersions: TimetableVersion[];
  availableRooms: string[];

  // Daily Operations & Attendance (Prompt 4)
  staffAttendance: StaffDailyAttendance[];
  leaveRequests: StaffLeaveRequest[];
  correctionRequests: AttendanceCorrectionRequest[];
  studentMovements: StudentMovementRecord[];
  attendancePolicy: AttendancePolicySettings;

  // Receipt Modal State
  activeReceipt: PaymentReceipt | null;
  setActiveReceipt: (receipt: PaymentReceipt | null) => void;

  // Actions
  // Academic Setup Actions
  addAcademicYear: (year: Omit<AcademicYear, 'id'>) => { success: boolean; error?: string };
  updateAcademicYear: (id: string, updated: Partial<AcademicYear>) => { success: boolean; error?: string };
  archiveAcademicYear: (id: string) => boolean;

  // Class and Section Actions
  addClass: (classInfo: Omit<ClassInfo, 'id' | 'studentCount' | 'attendanceToday'>) => { success: boolean; error?: string };
  updateClass: (id: string, updated: Partial<ClassInfo>) => { success: boolean; error?: string };
  archiveClass: (id: string) => boolean;

  // Subject Actions
  addSubject: (subject: Omit<SubjectItem, 'id'>) => { success: boolean; error?: string };
  updateSubject: (id: string, updated: Partial<SubjectItem>) => { success: boolean; error?: string };
  deleteSubject: (id: string) => boolean;

  // Subject Allocation Actions
  addSubjectAllocation: (allocation: Omit<SubjectAllocation, 'id'>) => { success: boolean; error?: string };
  updateSubjectAllocation: (id: string, updated: Partial<SubjectAllocation>) => { success: boolean; error?: string };
  deleteSubjectAllocation: (id: string) => boolean;

  // Period Configuration Actions
  addPeriodConfig: (period: Omit<PeriodConfig, 'id'>) => { success: boolean; error?: string };
  updatePeriodConfig: (id: string, updated: Partial<PeriodConfig>) => { success: boolean; error?: string };
  deletePeriodConfig: (id: string) => boolean;

  // Timetable Actions & Conflict Management
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => { success: boolean; error?: string; conflicts?: TimetableConflict[] };
  updateTimetableEntry: (id: string, updated: Partial<TimetableEntry>) => { success: boolean; error?: string; conflicts?: TimetableConflict[] };
  deleteTimetableEntry: (id: string) => boolean;
  publishTimetable: (classId: string, notes?: string) => void;
  createTimetableRevision: (classId: string, notes?: string) => void;

  // Calendar Event Actions
  addEvent: (event: Omit<SchoolEvent, 'id'>) => { success: boolean; error?: string };
  updateEvent: (id: string, updated: Partial<SchoolEvent>) => { success: boolean; error?: string };
  deleteEvent: (id: string) => boolean;
  updateUserProfile: (roleKey: string, updated: Partial<UserProfile>) => void;
  addStudent: (student: Omit<Student, 'id' | 'attendanceRate' | 'academicStatus' | 'status'> & Partial<Student>) => boolean;
  updateStudent: (id: string, updated: Partial<Student>) => boolean;
  deleteStudent: (id: string) => boolean;

  addTeacher: (teacher: Omit<Teacher, 'id' | 'attendanceRate'> & Partial<Teacher>) => boolean;
  updateTeacher: (id: string, updated: Partial<Teacher>) => boolean;
  deleteTeacher: (id: string) => boolean;

  addStaff: (staffMember: Omit<Staff, 'id'> & Partial<Staff>) => boolean;
  updateStaff: (id: string, updated: Partial<Staff>) => boolean;
  deleteStaff: (id: string) => boolean;

  // Attendance & Daily Operations Actions (Prompt 4)
  recordAttendance: (
    classId: string,
    period: string,
    records: StudentAttendanceEntry[],
    date?: string,
    isDraft?: boolean,
    subjectId?: string,
    subjectName?: string,
    teacherId?: string
  ) => { success: boolean; error?: string; recordId: string };
  saveAttendanceDraft: (record: Omit<AttendanceRecord, 'id'> & { id?: string }) => { success: boolean; error?: string; recordId: string };
  submitAttendance: (recordId: string) => { success: boolean; error?: string };
  requestAttendanceCorrection: (req: Omit<AttendanceCorrectionRequest, 'id' | 'requestedAt' | 'status'>) => { success: boolean; error?: string };
  reviewAttendanceCorrection: (requestId: string, decision: 'Approved' | 'Rejected', reviewNote?: string) => { success: boolean; error?: string };
  recordStaffAttendance: (date: string, entries: StaffAttendanceEntry[], isDraft?: boolean) => { success: boolean; error?: string };
  applyStaffLeave: (req: Omit<StaffLeaveRequest, 'id' | 'appliedAt' | 'status'>) => { success: boolean; error?: string };
  reviewStaffLeave: (leaveId: string, decision: 'Approved' | 'Rejected', reviewNote?: string) => { success: boolean; error?: string };
  cancelStaffLeave: (leaveId: string) => { success: boolean; error?: string };
  recordStudentMovement: (movement: Omit<StudentMovementRecord, 'id'>, updateAttendance?: boolean) => { success: boolean; error?: string };
  updateAttendancePolicy: (updated: Partial<AttendancePolicySettings>) => void;

  addMarkEntry: (mark: Omit<MarkEntry, 'id'>) => void;
  submitMarksForReview: () => void;
  approveMarks: () => void;
  publishResults: () => void;

  createAssignment: (asg: Omit<Assignment, 'id' | 'createdDate' | 'submissionsCount' | 'totalStudents'>) => void;
  deleteAssignment: (id: string) => void;

  recordPayment: (payment: { studentId: string; studentName: string; amount: number; paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Card'; referenceNumber: string; notes?: string }) => void;
  reversePayment: (receiptNumber: string, reason: string) => boolean;

  checkInVisitor: (visitor: Omit<Visitor, 'id' | 'status' | 'entryTime' | 'date'>) => void;
  checkOutVisitor: (id: string) => void;

  issueBook: (bookId: string, studentId: string, dueDate: string) => boolean;
  returnBook: (transactionId: string) => void;
  addBook: (book: Omit<Book, 'id' | 'status'>) => void;
  deleteBook: (id: string) => void;

  updateEnquiryStatus: (id: string, status: Enquiry['status']) => void;
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'date'>) => void;
  enrolApplicant: (enquiryId: string) => void;
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  sendMessage: (threadId: string, text: string, recipientRole: string, recipientName: string) => void;

  logAuditEvent: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  executePermissionCheck: (module: string, action: string, context?: any) => boolean;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // UI helpers
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
  switchRoleAndNavigate: (role: RoleType, page?: string) => void;
}

const STORAGE_KEY = APP_BRAND.storagePrefix;
const LEGACY_STORAGE_KEY = APP_BRAND.legacyStoragePrefix;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [isWelcomeScreen, setIsWelcomeScreen] = useState<boolean>(true);
  const [currentPlatform, setCurrentPlatform] = useState<PlatformType>('web');
  const [currentRole, setCurrentRole] = useState<RoleType>('principal');
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [selectedChild, setSelectedChild] = useState<ChildId>('aarav');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(true);

  // Active Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Domain Entities initialized from localStorage (checking new key then legacy key)
  const loadInitial = <T,>(key: string, defaultVal: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`) || localStorage.getItem(`${LEGACY_STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : defaultVal;
    } catch (e) {
      console.warn(`Failed to parse localStorage for ${key}`, e);
      return defaultVal;
    }
  };

  const [classes, setClasses] = useState<ClassInfo[]>(() => loadInitial('classes', INITIAL_CLASSES));
  const [students, setStudents] = useState<Student[]>(() => loadInitial('students', INITIAL_STUDENTS));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadInitial('teachers', INITIAL_TEACHERS));
  const [staff, setStaff] = useState<Staff[]>(() => loadInitial('staff', INITIAL_STAFF));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadInitial('attendance', INITIAL_DETAILED_ATTENDANCE));
  const [exams, setExams] = useState<Exam[]>(() => {
    const loaded = loadInitial<Exam[]>('exams', INITIAL_DETAILED_EXAMS);
    if (!loaded || loaded.length === 0 || !loaded.some((e) => e.sessions && e.sessions.length > 0)) {
      return INITIAL_DETAILED_EXAMS;
    }
    return loaded;
  });
  const [marks, setMarks] = useState<MarkEntry[]>(() => {
    const loaded = loadInitial<MarkEntry[]>('marks', INITIAL_DETAILED_MARKS);
    if (!loaded || loaded.length === 0 || !loaded.some((m) => m.writtenMarks !== undefined)) {
      return INITIAL_DETAILED_MARKS;
    }
    return loaded;
  });
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const loaded = loadInitial<Assignment[]>('assignments', INITIAL_DETAILED_ASSIGNMENTS);
    if (!loaded || loaded.length === 0 || !loaded.some((a) => a.submissions && a.submissions.length > 0)) {
      return INITIAL_DETAILED_ASSIGNMENTS;
    }
    return loaded;
  });
  const [fees, setFees] = useState<FeeRecord[]>(() => loadInitial('fees', INITIAL_FEES));
  const [payments, setPayments] = useState<PaymentReceipt[]>(() => loadInitial('payments', INITIAL_PAYMENTS));
  const [books, setBooks] = useState<Book[]>(() => loadInitial('books', INITIAL_BOOKS));
  const [libraryTransactions, setLibraryTransactions] = useState<LibraryTransaction[]>(() => loadInitial('libraryTransactions', INITIAL_LIBRARY_TRANSACTIONS));
  const [visitors, setVisitors] = useState<Visitor[]>(() => loadInitial('visitors', INITIAL_VISITORS));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => loadInitial('enquiries', INITIAL_ENQUIRIES));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadInitial('appointments', INITIAL_APPOINTMENTS));
  const [notices, setNotices] = useState<Notice[]>(() => loadInitial('notices', INITIAL_NOTICES));
  const [events, setEvents] = useState<SchoolEvent[]>(() => loadInitial('events', INITIAL_EVENTS));
  const [messages, setMessages] = useState<Message[]>(() => loadInitial('messages', INITIAL_MESSAGES));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadInitial('notifications', INITIAL_NOTIFICATIONS));
  const [childrenData, setChildrenData] = useState<Record<ChildId, ChildProfile>>(() => loadInitial('childrenData', INITIAL_CHILDREN));
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>(() => loadInitial('userProfiles', INITIAL_PROFILES));
  // Theme & Design System State (Prompt 1)
  const [activePaletteId, setActivePaletteId] = useState<PaletteId>(() => {
    const saved = loadInitial<string>('activePaletteId', DEFAULT_PALETTE_ID);
    // Validate if it matches a known palette or custom
    if (saved === 'custom' || SCHLAR_PALETTES.some((p) => p.id === saved)) {
      return saved as PaletteId;
    }
    return DEFAULT_PALETTE_ID;
  });

  const [themeColors, setThemeColors] = useState<ThemeColors>(() => {
    const saved = loadInitial<ThemeColors | null>('themeColors', null);
    if (saved && saved.primary && saved.secondary && saved.accent && saved.background && saved.surface) {
      return saved;
    }
    const defaultPal = SCHLAR_PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID);
    return defaultPal ? { ...defaultPal.colors } : { ...DEFAULT_THEME_COLORS };
  });

  const [theme, setThemeState] = useState<ThemeColor>(() => {
    return loadInitial('theme', DEFAULT_PALETTE_ID);
  });

  const [customThemes, setCustomThemes] = useState<CustomThemeRecord[]>(() => {
    return loadInitial('customThemes', []);
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => loadInitial('sidebar_collapsed', false));
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['dashboard']);

  const navigateTo = (tab: string) => {
    setCurrentPage(tab);
    setNavigationHistory((prev) => [...prev, tab]);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const prevTab = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentPage(prevTab);
    } else {
      setCurrentPage('dashboard');
    }
  };

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadInitial('auditLogs', INITIAL_AUDIT_LOGS));
  const [examModerationStatus, setExamModerationStatus] = useState<'Draft' | 'Submitted' | 'Approved' | 'Published'>(() => loadInitial('examModerationStatus', 'Draft'));
  const [quickSearchOpen, setQuickSearchOpen] = useState<boolean>(false);
  const [activeScenarioModal, setActiveScenarioModal] = useState<number | null>(null);

  // Academic Management Entities State
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>(() => loadInitial('academicYears', INITIAL_ACADEMIC_YEARS));
  const [activeAcademicYearId, setActiveAcademicYearId] = useState<string>(() => loadInitial('activeAcademicYearId', 'ay-2026-2027'));
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => loadInitial('subjects', INITIAL_SUBJECTS));
  const [subjectAllocations, setSubjectAllocations] = useState<SubjectAllocation[]>(() => loadInitial('subjectAllocations', INITIAL_SUBJECT_ALLOCATIONS));
  const [periods, setPeriods] = useState<PeriodConfig[]>(() => loadInitial('periods', INITIAL_PERIODS));
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(() => loadInitial('timetableEntries', INITIAL_TIMETABLE_ENTRIES));
  const [timetableVersions, setTimetableVersions] = useState<TimetableVersion[]>(() => loadInitial('timetableVersions', INITIAL_TIMETABLE_VERSIONS));
  const [availableRooms] = useState<string[]>(AVAILABLE_ROOMS);

  // Daily Operations & Attendance Entities State (Prompt 4)
  const [staffAttendance, setStaffAttendance] = useState<StaffDailyAttendance[]>(() => loadInitial('staffAttendance', INITIAL_STAFF_ATTENDANCE));
  const [leaveRequests, setLeaveRequests] = useState<StaffLeaveRequest[]>(() => loadInitial('leaveRequests', INITIAL_LEAVE_REQUESTS));
  const [correctionRequests, setCorrectionRequests] = useState<AttendanceCorrectionRequest[]>(() => loadInitial('correctionRequests', INITIAL_CORRECTION_REQUESTS));
  const [studentMovements, setStudentMovements] = useState<StudentMovementRecord[]>(() => loadInitial('studentMovements', INITIAL_STUDENT_MOVEMENTS));
  const [attendancePolicy, setAttendancePolicy] = useState<AttendancePolicySettings>(() => loadInitial('attendancePolicy', INITIAL_ATTENDANCE_POLICY));

  const setThemePalette = (paletteId: PaletteId) => {
    const pal = SCHLAR_PALETTES.find((p) => p.id === paletteId);
    if (pal) {
      setActivePaletteId(paletteId);
      setThemeColors({ ...pal.colors });
      setThemeState(paletteId);
      applyThemeVariables(pal.colors);
      try {
        localStorage.setItem(`${STORAGE_KEY}_activePaletteId`, JSON.stringify(paletteId));
        localStorage.setItem(`${STORAGE_KEY}_themeColors`, JSON.stringify(pal.colors));
        localStorage.setItem(`${STORAGE_KEY}_theme`, JSON.stringify(paletteId));
      } catch (e) {}
    }
  };

  const applyCustomThemeColors = (colors: ThemeColors, paletteId: PaletteId = 'custom') => {
    setActivePaletteId(paletteId);
    setThemeColors(colors);
    setThemeState(paletteId);
    applyThemeVariables(colors);
    try {
      localStorage.setItem(`${STORAGE_KEY}_activePaletteId`, JSON.stringify(paletteId));
      localStorage.setItem(`${STORAGE_KEY}_themeColors`, JSON.stringify(colors));
      localStorage.setItem(`${STORAGE_KEY}_theme`, JSON.stringify(paletteId));
    } catch (e) {}
  };

  const saveCustomTheme = (name: string, colors: ThemeColors) => {
    const newRecord: CustomThemeRecord = {
      id: `theme_${Date.now()}`,
      name,
      colors: { ...colors },
      createdAt: new Date().toISOString()
    };
    const updated = [newRecord, ...customThemes];
    setCustomThemes(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}_customThemes`, JSON.stringify(updated));
    } catch (e) {}
  };

  const deleteCustomTheme = (id: string) => {
    const updated = customThemes.filter((t) => t.id !== id);
    setCustomThemes(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}_customThemes`, JSON.stringify(updated));
    } catch (e) {}
  };

  const renameCustomTheme = (id: string, name: string) => {
    const updated = customThemes.map((t) =>
      t.id === id ? { ...t, name, updatedAt: new Date().toISOString() } : t
    );
    setCustomThemes(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}_customThemes`, JSON.stringify(updated));
    } catch (e) {}
  };

  const resetThemeToDefault = () => {
    setThemePalette(DEFAULT_PALETTE_ID);
  };

  // Backwards compatibility with setTheme(ThemeColor)
  const setTheme = (newTheme: ThemeColor) => {
    // If it's one of the 12 palettes
    if (SCHLAR_PALETTES.some((p) => p.id === newTheme)) {
      setThemePalette(newTheme as PaletteId);
      return;
    }
    // If it's a legacy color name, map it
    const legacyMap: Record<string, PaletteId> = {
      blue: 'palette_1',
      teal: 'palette_7',
      green: 'palette_2',
      red: 'palette_3',
      indigo: 'palette_8',
      purple: 'palette_9',
      amber: 'palette_5',
      slate: 'palette_6'
    };
    const mapped = legacyMap[newTheme as string];
    if (mapped) {
      setThemePalette(mapped);
    } else {
      setThemeState(newTheme);
    }
  };

  useEffect(() => {
    applyThemeVariables(themeColors);
  }, [themeColors]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_teachers`, JSON.stringify(teachers));
      localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
      localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendance));
      localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
      localStorage.setItem(`${STORAGE_KEY}_marks`, JSON.stringify(marks));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${STORAGE_KEY}_fees`, JSON.stringify(fees));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_books`, JSON.stringify(books));
      localStorage.setItem(`${STORAGE_KEY}_libraryTransactions`, JSON.stringify(libraryTransactions));
      localStorage.setItem(`${STORAGE_KEY}_visitors`, JSON.stringify(visitors));
      localStorage.setItem(`${STORAGE_KEY}_enquiries`, JSON.stringify(enquiries));
      localStorage.setItem(`${STORAGE_KEY}_appointments`, JSON.stringify(appointments));
      localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
      localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
      localStorage.setItem(`${STORAGE_KEY}_messages`, JSON.stringify(messages));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_childrenData`, JSON.stringify(childrenData));
      localStorage.setItem(`${STORAGE_KEY}_userProfiles`, JSON.stringify(userProfiles));
      localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_examModerationStatus`, JSON.stringify(examModerationStatus));
      localStorage.setItem(`${STORAGE_KEY}_academicYears`, JSON.stringify(academicYears));
      localStorage.setItem(`${STORAGE_KEY}_activeAcademicYearId`, JSON.stringify(activeAcademicYearId));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_subjectAllocations`, JSON.stringify(subjectAllocations));
      localStorage.setItem(`${STORAGE_KEY}_periods`, JSON.stringify(periods));
      localStorage.setItem(`${STORAGE_KEY}_timetableEntries`, JSON.stringify(timetableEntries));
      localStorage.setItem(`${STORAGE_KEY}_timetableVersions`, JSON.stringify(timetableVersions));
      localStorage.setItem(`${STORAGE_KEY}_staffAttendance`, JSON.stringify(staffAttendance));
      localStorage.setItem(`${STORAGE_KEY}_leaveRequests`, JSON.stringify(leaveRequests));
      localStorage.setItem(`${STORAGE_KEY}_correctionRequests`, JSON.stringify(correctionRequests));
      localStorage.setItem(`${STORAGE_KEY}_studentMovements`, JSON.stringify(studentMovements));
      localStorage.setItem(`${STORAGE_KEY}_attendancePolicy`, JSON.stringify(attendancePolicy));
      localStorage.setItem(`${STORAGE_KEY}_sidebar_collapsed`, JSON.stringify(isSidebarCollapsed));
    } catch (err) {
      console.error('LocalStorage write error', err);
    }
  }, [
    classes,
    students,
    teachers,
    staff,
    attendance,
    exams,
    marks,
    assignments,
    fees,
    payments,
    books,
    libraryTransactions,
    visitors,
    enquiries,
    appointments,
    notices,
    events,
    messages,
    notifications,
    childrenData,
    userProfiles,
    auditLogs,
    examModerationStatus,
    academicYears,
    activeAcademicYearId,
    subjects,
    subjectAllocations,
    periods,
    timetableEntries,
    timetableVersions,
    staffAttendance,
    leaveRequests,
    correctionRequests,
    studentMovements,
    attendancePolicy,
    isSidebarCollapsed
  ]);


  const updateUserProfile = (roleKey: string, updated: Partial<UserProfile>) => {
    setUserProfiles((prev) => {
      const current = prev[roleKey] || prev.principal;
      return {
        ...prev,
        [roleKey]: {
          ...current,
          ...updated,
          preferences: {
            ...current.preferences,
            ...(updated.preferences || {})
          }
        }
      };
    });
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile changes have been saved.'
    });
  };

  // Actions — Student CRUD with strict validation and permission checks
  const addStudent = (studentData: Omit<Student, 'id' | 'attendanceRate' | 'academicStatus' | 'status'> & Partial<Student>): boolean => {
    // 1. Check permissions
    const perm = checkPermission(currentRole, 'students', 'create');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'ADD_STUDENT_DENIED',
        module: 'students',
        recordRef: studentData.admissionId || 'unknown',
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'You do not have permission to enrol students.'
      });
      return false;
    }

    // 2. Validate required fields
    if (!studentData.name?.trim() || !studentData.admissionId?.trim() || !studentData.classId) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Student name, admission ID, and assigned class are strictly required.'
      });
      return false;
    }

    // 3. Unique Admission Number Check
    const isDuplicate = students.some(
      (s) => s.admissionId.toLowerCase() === studentData.admissionId.trim().toLowerCase()
    );
    if (isDuplicate) {
      addToast({
        type: 'error',
        title: 'Duplicate Admission ID',
        message: `A student with admission number ${studentData.admissionId} is already registered.`
      });
      return false;
    }

    const newStudentId = `std-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newStudent: Student = {
      ...studentData,
      id: newStudentId,
      name: studentData.name.trim(),
      admissionId: studentData.admissionId.trim(),
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      academicYear: studentData.academicYear || APP_BRAND.academicYear,
      classId: studentData.classId,
      section: studentData.section || 'A',
      rollNo: Number(studentData.rollNo) || (students.filter((s) => s.classId === studentData.classId).length + 1),
      dob: studentData.dob || '2012-01-01',
      gender: studentData.gender || 'Male',
      parentName: studentData.parentName?.trim() || '',
      guardianRelation: studentData.guardianRelation || 'Father',
      parentPhone: studentData.parentPhone?.trim() || '',
      parentEmail: studentData.parentEmail?.trim() || '',
      secondaryGuardianName: studentData.secondaryGuardianName?.trim(),
      secondaryGuardianPhone: studentData.secondaryGuardianPhone?.trim(),
      secondaryGuardianRelation: studentData.secondaryGuardianRelation?.trim(),
      address: studentData.address?.trim() || 'Greenfield Campus District',
      attendanceRate: 100,
      academicStatus: studentData.academicStatus || 'On Track',
      status: studentData.status || 'Active',
      bloodGroup: studentData.bloodGroup || 'O+',
      emergencyContact: studentData.emergencyContact?.trim() || studentData.parentPhone?.trim() || '',
      medicalAlerts: studentData.medicalAlerts?.trim() || '',
      authorizedPickup: studentData.authorizedPickup?.trim() || ''
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update class student count
    setClasses((prev) =>
      prev.map((cls) =>
        cls.id === studentData.classId
          ? { ...cls, studentCount: cls.studentCount + 1 }
          : cls
      )
    );

    // Create an initial fee record for the student
    const matchedClass = classes.find((c) => c.id === studentData.classId);
    const newFeeRecord: FeeRecord = {
      id: `fee-auto-${Date.now()}`,
      studentId: newStudentId,
      studentName: newStudent.name,
      classId: newStudent.classId,
      className: matchedClass ? matchedClass.name : newStudent.classId,
      totalFee: 3600,
      paid: 0,
      pending: 3600,
      dueDate: '2026-10-31',
      status: 'Pending'
    };
    setFees((prev) => [newFeeRecord, ...prev]);

    // Log audit event
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_STUDENT',
      module: 'students',
      recordRef: `${newStudent.name} (${newStudent.admissionId})`,
      reason: `Admitted into ${matchedClass ? matchedClass.name : newStudent.classId}`,
      status: 'SUCCESS'
    });

    // Send notifications
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'principal',
        title: 'New Student Enrolled',
        message: `${newStudent.name} admitted to ${matchedClass ? matchedClass.name : ''} (${newStudent.admissionId}).`,
        timestamp: 'Just now',
        read: false,
        targetModule: 'students',
        priority: 'normal'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Student Admitted',
      message: `${newStudent.name} successfully registered with ID ${newStudent.admissionId}.`
    });
    return true;
  };

  const updateStudent = (id: string, updated: Partial<Student>): boolean => {
    const existing = students.find((s) => s.id === id);
    if (!existing) {
      addToast({ type: 'error', title: 'Student Not Found', message: 'Unable to locate student record.' });
      return false;
    }

    // 1. Permission check
    const perm = checkPermission(currentRole, 'students', 'edit');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'EDIT_STUDENT_DENIED',
        module: 'students',
        recordRef: existing.admissionId,
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'You do not have permission to edit student records.'
      });
      return false;
    }

    // 2. Field-level filtering based on role
    const sanitizedUpdates: Partial<Student> = {};
    let blockedFieldsCount = 0;
    for (const [key, val] of Object.entries(updated)) {
      if (canEditStudentField(currentRole, key)) {
        (sanitizedUpdates as any)[key] = val;
      } else {
        blockedFieldsCount++;
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      addToast({
        type: 'error',
        title: 'Action Restricted',
        message: `Your role (${currentRole}) is not permitted to modify these student fields.`
      });
      return false;
    }

    // 3. Admission ID uniqueness check if updated
    if (sanitizedUpdates.admissionId && sanitizedUpdates.admissionId !== existing.admissionId) {
      const isDuplicate = students.some(
        (s) => s.id !== id && s.admissionId.toLowerCase() === sanitizedUpdates.admissionId!.trim().toLowerCase()
      );
      if (isDuplicate) {
        addToast({
          type: 'error',
          title: 'Duplicate Admission ID',
          message: `Admission ID ${sanitizedUpdates.admissionId} is already assigned to another student.`
        });
        return false;
      }
    }

    // 4. Class transfer handling
    if (sanitizedUpdates.classId && sanitizedUpdates.classId !== existing.classId) {
      const oldClassId = existing.classId;
      const newClassId = sanitizedUpdates.classId;
      const newClassObj = classes.find((c) => c.id === newClassId);

      setClasses((prev) =>
        prev.map((c) => {
          if (c.id === oldClassId) return { ...c, studentCount: Math.max(0, c.studentCount - 1) };
          if (c.id === newClassId) return { ...c, studentCount: c.studentCount + 1 };
          return c;
        })
      );

      // Sync fees class name
      setFees((prev) =>
        prev.map((f) =>
          f.studentId === id
            ? { ...f, classId: newClassId, className: newClassObj ? newClassObj.name : newClassId }
            : f
        )
      );
    }

    // Update students state
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...sanitizedUpdates } : s))
    );

    // Sync with parent mobile if Aarav or Ananya
    if (id === 'std-8a-01' && sanitizedUpdates.name) {
      setChildrenData((prev) => ({
        ...prev,
        aarav: { ...prev.aarav, name: sanitizedUpdates.name! }
      }));
    } else if (id === 'std-5b-01' && sanitizedUpdates.name) {
      setChildrenData((prev) => ({
        ...prev,
        ananya: { ...prev.ananya, name: sanitizedUpdates.name! }
      }));
    }

    // Audit log
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_STUDENT',
      module: 'students',
      recordRef: `${existing.name} (${existing.admissionId})`,
      reason: `Updated fields: ${Object.keys(sanitizedUpdates).join(', ')}${blockedFieldsCount > 0 ? ` (${blockedFieldsCount} restricted fields protected)` : ''}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'success',
      title: 'Student Updated',
      message: `${existing.name} record changes have been saved.`
    });
    return true;
  };

  const deleteStudent = (id: string): boolean => {
    const studentToDelete = students.find((s) => s.id === id);
    if (!studentToDelete) return false;

    const perm = checkPermission(currentRole, 'students', 'delete');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'DELETE_STUDENT_DENIED',
        module: 'students',
        recordRef: studentToDelete.admissionId,
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'You do not have permission to delete student records.'
      });
      return false;
    }

    setStudents((prev) => prev.filter((s) => s.id !== id));
    setClasses((prev) =>
      prev.map((c) =>
        c.id === studentToDelete.classId
          ? { ...c, studentCount: Math.max(0, c.studentCount - 1) }
          : c
      )
    );
    setFees((prev) => prev.filter((f) => f.studentId !== id));

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_STUDENT',
      module: 'students',
      recordRef: `${studentToDelete.name} (${studentToDelete.admissionId})`,
      reason: 'Student withdrawn from institution',
      status: 'SUCCESS'
    });

    addToast({
      type: 'info',
      title: 'Student Removed',
      message: `${studentToDelete.name} has been removed from the school roster.`
    });
    return true;
  };

  // Actions — Teacher CRUD
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'attendanceRate'> & Partial<Teacher>): boolean => {
    const perm = checkPermission(currentRole, 'teachers', 'create');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'ADD_TEACHER_DENIED',
        module: 'teachers',
        recordRef: teacherData.email || 'unknown',
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'Only the Principal can appoint new faculty.'
      });
      return false;
    }

    if (!teacherData.name?.trim() || !teacherData.email?.trim() || !teacherData.phone?.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Faculty name, work email, and contact number are required.'
      });
      return false;
    }

    // Check duplicate staffId or email
    const duplicateEmail = teachers.some((t) => t.email.toLowerCase() === teacherData.email.trim().toLowerCase());
    if (duplicateEmail) {
      addToast({
        type: 'error',
        title: 'Duplicate Faculty Email',
        message: `A teacher with email ${teacherData.email} is already on staff.`
      });
      return false;
    }

    const newTeacherId = `t-${Date.now()}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: newTeacherId,
      staffId: teacherData.staffId || `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: teacherData.name.trim(),
      email: teacherData.email.trim(),
      phone: teacherData.phone.trim(),
      roleTitle: teacherData.roleTitle?.trim() || 'Subject Teacher',
      department: teacherData.department?.trim() || 'Academics',
      qualification: teacherData.qualification?.trim() || 'B.Ed, Master Degree',
      subjects: teacherData.subjects?.length ? teacherData.subjects : ['General Studies'],
      classes: teacherData.classes?.length ? teacherData.classes : ['Grade 10A'],
      workloadHours: Number(teacherData.workloadHours) || 20,
      attendanceRate: 100,
      joinDate: teacherData.joinDate || new Date().toISOString().split('T')[0],
      room: teacherData.room || 'Faculty Room 101',
      employmentType: teacherData.employmentType || 'Full-time',
      status: teacherData.status || 'Active',
      address: teacherData.address?.trim() || 'Greenfield, India',
      emergencyContact: teacherData.emergencyContact?.trim() || teacherData.phone.trim()
    };

    setTeachers((prev) => [newTeacher, ...prev]);

    // If teacher is assigned as class teacher of a class, sync classes
    if (newTeacher.classTeacherOf) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === newTeacher.classTeacherOf || c.name === newTeacher.classTeacherOf
            ? { ...c, classTeacherId: newTeacherId, classTeacherName: newTeacher.name }
            : c
        )
      );
    }

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_TEACHER',
      module: 'teachers',
      recordRef: `${newTeacher.name} (${newTeacher.staffId})`,
      reason: `Appointed as ${newTeacher.roleTitle}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'success',
      title: 'Faculty Appointed',
      message: `${newTeacher.name} successfully registered to faculty roster.`
    });
    return true;
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>): boolean => {
    const existing = teachers.find((t) => t.id === id);
    if (!existing) {
      addToast({ type: 'error', title: 'Teacher Not Found', message: 'Unable to locate faculty record.' });
      return false;
    }

    const perm = checkPermission(currentRole, 'teachers', 'edit');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'EDIT_TEACHER_DENIED',
        module: 'teachers',
        recordRef: existing.name,
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'You do not have permission to edit faculty records.'
      });
      return false;
    }

    // Field-level check: Vice Principal can only edit academic allocation fields!
    const sanitizedUpdates: Partial<Teacher> = {};
    for (const [key, val] of Object.entries(updated)) {
      if (canEditTeacherField(currentRole, key)) {
        (sanitizedUpdates as any)[key] = val;
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      addToast({
        type: 'error',
        title: 'Action Restricted',
        message: `Your role (${currentRole}) is not permitted to modify these teacher fields.`
      });
      return false;
    }

    // Sync class teacher in classes
    if (sanitizedUpdates.classTeacherOf !== undefined) {
      setClasses((prev) =>
        prev.map((c) => {
          if (c.classTeacherId === id && c.id !== sanitizedUpdates.classTeacherOf && c.name !== sanitizedUpdates.classTeacherOf) {
            return { ...c, classTeacherId: '', classTeacherName: 'Unassigned' };
          }
          if (c.id === sanitizedUpdates.classTeacherOf || c.name === sanitizedUpdates.classTeacherOf) {
            return { ...c, classTeacherId: id, classTeacherName: sanitizedUpdates.name || existing.name };
          }
          return c;
        })
      );
    }

    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...sanitizedUpdates } : t))
    );

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_TEACHER',
      module: 'teachers',
      recordRef: `${existing.name}`,
      reason: `Updated fields: ${Object.keys(sanitizedUpdates).join(', ')}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'success',
      title: 'Teacher Profile Saved',
      message: `${existing.name} records and allocations have been updated.`
    });
    return true;
  };

  const deleteTeacher = (id: string): boolean => {
    const existing = teachers.find((t) => t.id === id);
    if (!existing) return false;

    const perm = checkPermission(currentRole, 'teachers', 'delete');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'DELETE_TEACHER_DENIED',
        module: 'teachers',
        recordRef: existing.name,
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'Only the Principal can remove faculty members.'
      });
      return false;
    }

    // Clear class teacher role from classes if assigned
    setClasses((prev) =>
      prev.map((c) =>
        c.classTeacherId === id
          ? { ...c, classTeacherId: '', classTeacherName: 'Unassigned' }
          : c
      )
    );

    setTeachers((prev) => prev.filter((t) => t.id !== id));

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_TEACHER',
      module: 'teachers',
      recordRef: `${existing.name}`,
      reason: 'Teacher removed from faculty roster',
      status: 'SUCCESS'
    });

    addToast({
      type: 'info',
      title: 'Faculty Removed',
      message: `${existing.name} has been removed from the faculty roster.`
    });
    return true;
  };

  // Actions — Staff CRUD
  const addStaff = (staffData: Omit<Staff, 'id'> & Partial<Staff>): boolean => {
    const perm = checkPermission(currentRole, 'staff', 'create');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'ADD_STAFF_DENIED',
        module: 'staff',
        recordRef: staffData.email || 'unknown',
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'Only the Principal can add staff members.'
      });
      return false;
    }

    if (!staffData.name?.trim() || !staffData.department?.trim() || !staffData.role?.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Staff name, department, and role designation are required.'
      });
      return false;
    }

    const newStaffId = `stf-${Date.now()}`;
    const newStaff: Staff = {
      ...staffData,
      id: newStaffId,
      staffId: staffData.staffId || `STF-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: staffData.name.trim(),
      department: staffData.department.trim(),
      role: staffData.role.trim(),
      phone: staffData.phone?.trim() || '+1 (555) 500-0000',
      email: staffData.email?.trim() || `${staffData.name.toLowerCase().replace(/\s+/g, '.')}@greenfield.edu`,
      joinDate: staffData.joinDate || new Date().toISOString().split('T')[0],
      employmentType: staffData.employmentType || 'Full-time',
      status: staffData.status || 'Active',
      address: staffData.address?.trim() || 'Greenfield Campus District',
      emergencyContact: staffData.emergencyContact?.trim() || staffData.phone?.trim() || '',
      shift: staffData.shift?.trim() || 'Standard Shift (08:00 - 16:30)',
      responsibilities: staffData.responsibilities?.trim() || 'General campus operations and support'
    };

    setStaff((prev) => [newStaff, ...prev]);

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_STAFF',
      module: 'staff',
      recordRef: `${newStaff.name} (${newStaff.role})`,
      reason: `Hired into ${newStaff.department}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'success',
      title: 'Staff Enrolled',
      message: `${newStaff.name} added to ${newStaff.department} roster.`
    });
    return true;
  };

  const updateStaff = (id: string, updated: Partial<Staff>): boolean => {
    const existing = staff.find((st) => st.id === id);
    if (!existing) {
      addToast({ type: 'error', title: 'Staff Not Found', message: 'Unable to locate staff record.' });
      return false;
    }

    const perm = checkPermission(currentRole, 'staff', 'edit');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'EDIT_STAFF_DENIED',
        module: 'staff',
        recordRef: existing.name,
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'You do not have permission to edit staff records.'
      });
      return false;
    }

    const sanitizedUpdates: Partial<Staff> = {};
    for (const [key, val] of Object.entries(updated)) {
      if (canEditStaffField(currentRole, key)) {
        (sanitizedUpdates as any)[key] = val;
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      addToast({
        type: 'error',
        title: 'Action Restricted',
        message: `Your role (${currentRole}) is not permitted to modify staff records.`
      });
      return false;
    }

    setStaff((prev) =>
      prev.map((st) => (st.id === id ? { ...st, ...sanitizedUpdates } : st))
    );

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_STAFF',
      module: 'staff',
      recordRef: `${existing.name}`,
      reason: `Updated fields: ${Object.keys(sanitizedUpdates).join(', ')}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'success',
      title: 'Staff Record Updated',
      message: `${existing.name} details have been saved.`
    });
    return true;
  };

  const deleteStaff = (id: string): boolean => {
    const existing = staff.find((st) => st.id === id);
    if (!existing) return false;

    const perm = checkPermission(currentRole, 'staff', 'delete');
    if (!perm.allowed) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || currentRole,
        action: 'DELETE_STAFF_DENIED',
        module: 'staff',
        recordRef: existing.name,
        reason: perm.reason || 'Insufficient permissions',
        status: 'DENIED'
      });
      addToast({
        type: 'error',
        title: 'Permission Denied',
        message: perm.reason || 'Only the Principal can remove staff members.'
      });
      return false;
    }

    setStaff((prev) => prev.filter((st) => st.id !== id));

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_STAFF',
      module: 'staff',
      recordRef: `${existing.name}`,
      reason: 'Staff member removed from active employment roster',
      status: 'SUCCESS'
    });

    addToast({
      type: 'info',
      title: 'Staff Removed',
      message: `${existing.name} has been removed from staff roster.`
    });
    return true;
  };

  // ==========================================
  // ATTENDANCE & DAILY OPERATIONS ACTIONS (Prompt 4)
  // ==========================================

  const recordAttendance = (
    classId: string,
    period: string,
    records: StudentAttendanceEntry[],
    date?: string,
    isDraft?: boolean,
    subjectId?: string,
    subjectName?: string,
    teacherId?: string
  ): { success: boolean; error?: string; recordId: string } => {
    const sessionDate = date || new Date().toISOString().split('T')[0];
    const existingIndex = attendance.findIndex(
      (a) => a.classId === classId && a.date === sessionDate && a.period === period && (!subjectId || !a.subjectId || a.subjectId === subjectId)
    );

    const recordId =
      existingIndex >= 0
        ? attendance[existingIndex].id
        : `att-${sessionDate}-${classId}-${Date.now().toString().slice(-4)}`;
    const sessionStatus: 'Draft' | 'Submitted' = isDraft ? 'Draft' : 'Submitted';

    const newRecord: AttendanceRecord = {
      id: recordId,
      date: sessionDate,
      classId,
      period,
      subjectId: subjectId || (existingIndex >= 0 ? attendance[existingIndex].subjectId : undefined),
      subjectName: subjectName || (existingIndex >= 0 ? attendance[existingIndex].subjectName : undefined),
      teacherId: teacherId || (currentRole === 'teacher' ? 't-1' : 't-1'),
      academicYearId: activeAcademicYearId,
      status: sessionStatus,
      submittedAt: sessionStatus === 'Submitted' ? new Date().toISOString() : undefined,
      submittedBy: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
      records
    };

    if (existingIndex >= 0) {
      setAttendance((prev) => prev.map((a, idx) => (idx === existingIndex ? newRecord : a)));
    } else {
      setAttendance((prev) => [newRecord, ...prev]);
    }

    if (sessionStatus === 'Submitted') {
      const presentCount = records.filter(
        (r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Excused'
      ).length;
      const rate = Math.round((presentCount / (records.length || 1)) * 100);

      setClasses((prev) =>
        prev.map((c) => (c.id === classId ? { ...c, attendanceToday: rate } : c))
      );

      // If Aarav or Ananya is in this class, update child record
      const aaravRecord = records.find((r) => r.studentId === 'std-8a-01');
      if (aaravRecord) {
        setChildrenData((prev) => {
          const isPresent = aaravRecord.status === 'Present';
          const isLate = aaravRecord.status === 'Late';
          const isAbsent = aaravRecord.status === 'Absent';
          return {
            ...prev,
            aarav: {
              ...prev.aarav,
              presentDays: isPresent ? prev.aarav.presentDays + 1 : prev.aarav.presentDays,
              lateDays: isLate ? prev.aarav.lateDays + 1 : prev.aarav.lateDays,
              absentDays: isAbsent ? prev.aarav.absentDays + 1 : prev.aarav.absentDays,
              attendancePercentage: rate
            }
          };
        });
      }

      const ananyaRecord = records.find((r) => r.studentId === 'std-5b-01');
      if (ananyaRecord) {
        setChildrenData((prev) => ({
          ...prev,
          ananya: {
            ...prev.ananya,
            attendancePercentage: rate
          }
        }));
      }

      // Add parent notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          targetRole: 'parent_mobile',
          title: 'Daily Attendance Finalized',
          message: `Official attendance submitted for ${period}. Class presence: ${rate}%.`,
          timestamp: 'Just now',
          read: false,
          targetModule: 'attendance',
          priority: 'normal'
        },
        ...prev
      ]);

      addToast({
        type: 'success',
        title: 'Attendance Submitted',
        message: `${records.length} students marked for ${period}. Presence rate: ${rate}%.`
      });

      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
        action: 'SUBMIT_STUDENT_ATTENDANCE',
        module: 'attendance',
        recordRef: recordId,
        status: 'SUCCESS'
      });
    } else {
      addToast({
        type: 'info',
        title: 'Attendance Draft Saved',
        message: `Draft roll call for ${period} saved. You can resume and finalize later.`
      });

      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
        action: 'SAVE_ATTENDANCE_DRAFT',
        module: 'attendance',
        recordRef: recordId,
        status: 'SUCCESS'
      });
    }

    return { success: true, recordId };
  };

  const saveAttendanceDraft = (
    recordData: Omit<AttendanceRecord, 'id'> & { id?: string }
  ): { success: boolean; error?: string; recordId: string } => {
    return recordAttendance(
      recordData.classId,
      recordData.period,
      recordData.records,
      recordData.date,
      true
    );
  };

  const submitAttendance = (recordId: string): { success: boolean; error?: string } => {
    const existing = attendance.find((a) => a.id === recordId);
    if (!existing) {
      return { success: false, error: 'Attendance record not found.' };
    }
    recordAttendance(existing.classId, existing.period, existing.records, existing.date, false);
    return { success: true };
  };

  const requestAttendanceCorrection = (
    req: Omit<AttendanceCorrectionRequest, 'id' | 'requestedAt' | 'status'>
  ): { success: boolean; error?: string } => {
    const newReq: AttendanceCorrectionRequest = {
      ...req,
      id: `corr-req-${Date.now().toString().slice(-4)}`,
      requestedAt: new Date().toISOString(),
      status: 'Pending'
    };

    setCorrectionRequests((prev) => [newReq, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'principal',
        title: 'Attendance Correction Requested',
        message: `${req.requestedByName} requested status update for ${req.studentName} (${req.originalStatus} → ${req.requestedStatus}).`,
        timestamp: 'Just now',
        read: false,
        targetModule: 'attendance',
        priority: 'urgent'
      },
      ...prev
    ]);

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
      action: 'REQUEST_ATTENDANCE_CORRECTION',
      module: 'attendance',
      recordRef: newReq.id,
      status: 'SUCCESS'
    });

    return { success: true };
  };

  const reviewAttendanceCorrection = (
    requestId: string,
    decision: 'Approved' | 'Rejected',
    reviewNote?: string
  ): { success: boolean; error?: string } => {
    const req = correctionRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found.' };

    const reviewerName = userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole;

    setCorrectionRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: decision,
              reviewedByRole: currentRole,
              reviewedByName: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNote
            }
          : r
      )
    );

    // If approved, update the underlying attendance record!
    if (decision === 'Approved') {
      setAttendance((prev) =>
        prev.map((att) => {
          if (att.id === req.attendanceRecordId || (att.classId === req.classId && att.date === req.date && att.period === req.period)) {
            const updatedRecords = att.records.map((r) =>
              r.studentId === req.studentId
                ? {
                    ...r,
                    status: req.requestedStatus,
                    remarks: reviewNote || `Corrected from ${req.originalStatus} to ${req.requestedStatus}`
                  }
                : r
            );

            // Recompute class rate
            const presentCount = updatedRecords.filter(
              (r) => r.status === 'Present' || r.status === 'Late' || r.status === 'Excused'
            ).length;
            const newRate = Math.round((presentCount / (updatedRecords.length || 1)) * 100);

            setClasses((clPrev) =>
              clPrev.map((c) => (c.id === req.classId ? { ...c, attendanceToday: newRate } : c))
            );

            return {
              ...att,
              records: updatedRecords
            };
          }
          return att;
        })
      );
    }

    logAuditEvent({
      actorRole: currentRole,
      actorName: reviewerName,
      action: decision === 'Approved' ? 'APPROVE_ATTENDANCE_CORRECTION' : 'REJECT_ATTENDANCE_CORRECTION',
      module: 'attendance',
      recordRef: requestId,
      status: 'SUCCESS'
    });

    return { success: true };
  };

  const recordStaffAttendance = (
    date: string,
    entries: StaffAttendanceEntry[],
    isDraft?: boolean
  ): { success: boolean; error?: string } => {
    const status = isDraft ? 'Draft' : 'Submitted';
    const nowIso = new Date().toISOString();
    const updaterName = userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole;

    setStaffAttendance((prev) => {
      const existingIdx = prev.findIndex((s) => s.date === date);
      const newDaily: StaffDailyAttendance = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `staff-att-${date}`,
        date,
        status,
        submittedAt: status === 'Submitted' ? nowIso : undefined,
        submittedBy: status === 'Submitted' ? updaterName : undefined,
        entries
      };

      if (existingIdx >= 0) {
        return prev.map((s, idx) => (idx === existingIdx ? newDaily : s));
      }
      return [newDaily, ...prev];
    });

    logAuditEvent({
      actorRole: currentRole,
      actorName: updaterName,
      action: 'RECORD_STAFF_ATTENDANCE',
      module: 'staff_attendance',
      recordRef: date,
      status: 'SUCCESS'
    });

    return { success: true };
  };

  const applyStaffLeave = (
    req: Omit<StaffLeaveRequest, 'id' | 'appliedAt' | 'status'>
  ): { success: boolean; error?: string } => {
    if (new Date(req.startDate) > new Date(req.endDate)) {
      return { success: false, error: 'Leave start date cannot be after end date.' };
    }

    // Overlapping check for same staff member
    const overlap = leaveRequests.find(
      (l) =>
        l.staffId === req.staffId &&
        (l.status === 'Approved' || l.status === 'Pending') &&
        !(req.endDate < l.startDate || req.startDate > l.endDate)
    );

    if (overlap) {
      return {
        success: false,
        error: `Conflicting leave application already exists (${overlap.leaveType}: ${overlap.startDate} to ${overlap.endDate}, Status: ${overlap.status}).`
      };
    }

    const newLeave: StaffLeaveRequest = {
      ...req,
      id: `leave-req-${Date.now().toString().slice(-4)}`,
      appliedAt: new Date().toISOString(),
      status: 'Pending'
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'principal',
        title: 'Staff Leave Applied',
        message: `${req.staffName} (${req.staffRole}) applied for ${req.leaveType} (${req.startDate} to ${req.endDate}).`,
        timestamp: 'Just now',
        read: false,
        targetModule: 'leave',
        priority: 'urgent'
      },
      ...prev
    ]);

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
      action: 'APPLY_STAFF_LEAVE',
      module: 'leave',
      recordRef: newLeave.id,
      status: 'SUCCESS'
    });

    return { success: true };
  };

  const reviewStaffLeave = (
    leaveId: string,
    decision: 'Approved' | 'Rejected',
    reviewNote?: string
  ): { success: boolean; error?: string } => {
    const req = leaveRequests.find((l) => l.id === leaveId);
    if (!req) return { success: false, error: 'Leave request not found.' };

    const reviewerName = userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole;

    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === leaveId
          ? {
              ...l,
              status: decision,
              reviewedByRole: currentRole,
              reviewedByName: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNote
            }
          : l
      )
    );

    // If approved, synchronize to staff attendance for dates in range
    if (decision === 'Approved') {
      setStaffAttendance((prev) =>
        prev.map((daily) => {
          if (daily.date >= req.startDate && daily.date <= req.endDate) {
            return {
              ...daily,
              entries: daily.entries.map((entry) =>
                entry.staffId === req.staffId
                  ? {
                      ...entry,
                      status: 'On Leave',
                      remarks: `Approved ${req.leaveType}`
                    }
                  : entry
              )
            };
          }
          return daily;
        })
      );
    }

    logAuditEvent({
      actorRole: currentRole,
      actorName: reviewerName,
      action: decision === 'Approved' ? 'APPROVE_STAFF_LEAVE' : 'REJECT_STAFF_LEAVE',
      module: 'leave',
      recordRef: leaveId,
      status: 'SUCCESS'
    });

    return { success: true };
  };

  const cancelStaffLeave = (leaveId: string): { success: boolean; error?: string } => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === leaveId && l.status === 'Pending' ? { ...l, status: 'Cancelled' } : l))
    );
    addToast({
      type: 'info',
      title: 'Leave Request Cancelled',
      message: 'Pending leave application has been withdrawn.'
    });
    return { success: true };
  };

  const recordStudentMovement = (
    movement: Omit<StudentMovementRecord, 'id'>,
    updateAttendance?: boolean
  ): { success: boolean; error?: string } => {
    const newMovement: StudentMovementRecord = {
      ...movement,
      id: `mov-${Date.now().toString().slice(-4)}`
    };

    setStudentMovements((prev) => [newMovement, ...prev]);

    // If updateAttendance is enabled and it is a Late Arrival, reflect Late in today's register
    if (updateAttendance && movement.type === 'Late Arrival') {
      setAttendance((prev) =>
        prev.map((att) => {
          if (att.classId === movement.classId && att.date === movement.date) {
            return {
              ...att,
              records: att.records.map((r) =>
                r.studentId === movement.studentId
                  ? {
                      ...r,
                      status: 'Late',
                      arrivalTime: movement.time,
                      remarks: movement.reason
                    }
                  : r
              )
            };
          }
          return att;
        })
      );
    }

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
      action: movement.type === 'Late Arrival' ? 'LOG_LATE_ARRIVAL' : 'LOG_EARLY_DEPARTURE',
      module: 'movement',
      recordRef: newMovement.id,
      status: 'SUCCESS'
    });

    return { success: true };
  };

  const updateAttendancePolicy = (updated: Partial<AttendancePolicySettings>): void => {
    setAttendancePolicy((prev) => ({
      ...prev,
      ...updated
    }));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole,
      action: 'UPDATE_ATTENDANCE_POLICY',
      module: 'attendance',
      recordRef: 'policy-settings',
      status: 'SUCCESS'
    });
  };

  const addMarkEntry = (mark: Omit<MarkEntry, 'id'>) => {
    const newEntry: MarkEntry = {
      ...mark,
      id: `mrk-${Date.now()}`
    };
    setMarks((prev) => [newEntry, ...prev]);

    // Update child profile if Aarav or Ananya
    const validScore = mark.marksObtained ?? 0;
    if (mark.studentId === 'std-8a-01') {
      setChildrenData((prev) => {
        const updatedSubs = prev.aarav.subjects.map((sub) =>
          sub.subject === mark.subject
            ? { ...sub, score: Math.round((validScore / (mark.totalMarks || 1)) * 100), grade: mark.grade }
            : sub
        );
        return { ...prev, aarav: { ...prev.aarav, subjects: updatedSubs } };
      });
    } else if (mark.studentId === 'std-5b-01') {
      setChildrenData((prev) => {
        const updatedSubs = prev.ananya.subjects.map((sub) =>
          sub.subject === mark.subject
            ? { ...sub, score: Math.round((validScore / (mark.totalMarks || 1)) * 100), grade: mark.grade }
            : sub
        );
        return { ...prev, ananya: { ...prev.ananya, subjects: updatedSubs } };
      });
    }

    addToast({
      type: 'success',
      title: 'Grade Recorded',
      message: `${mark.studentName} marked ${mark.marksObtained}/${mark.totalMarks} (${mark.grade}) in ${mark.subject}.`
    });
  };

  const createAssignment = (
    asg: Omit<Assignment, 'id' | 'createdDate' | 'submissionsCount' | 'totalStudents'>
  ) => {
    const matchedClass = classes.find((c) => c.id === asg.classId);
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      submissionsCount: 0,
      totalStudents: matchedClass ? matchedClass.studentCount : 30
    };

    setAssignments((prev) => [newAsg, ...prev]);

    // Push notification to parent
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        targetRole: 'parent_mobile',
        title: 'New Class Assignment',
        message: `${asg.subject}: "${asg.title}" due on ${asg.dueDate}.`,
        timestamp: 'Just now',
        read: false,
        targetModule: 'academics',
        priority: 'normal'
      },
      ...prev
    ]);

    addToast({
      type: 'success',
      title: 'Assignment Published',
      message: `"${asg.title}" assigned to ${asg.className}.`
    });
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    addToast({
      type: 'info',
      title: 'Assignment Removed',
      message: 'Assignment has been deleted from curriculum.'
    });
  };

  const recordPayment = (payment: {
    studentId: string;
    studentName: string;
    amount: number;
    paymentMethod: 'Cash' | 'Bank Transfer' | 'UPI' | 'Card';
    referenceNumber: string;
    notes?: string;
  }) => {
    const matchedFee = fees.find((f) => f.studentId === payment.studentId);
    const matchedStudent = students.find((s) => s.id === payment.studentId);
    const className = matchedFee ? matchedFee.className : 'Greenfield High';

    const receiptNo = `GIS-REC-${Date.now().toString().slice(-6)}`;
    const newPaymentReceipt: PaymentReceipt = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNo,
      studentId: payment.studentId,
      studentName: payment.studentName,
      className,
      amount: payment.amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: payment.paymentMethod,
      referenceNumber: payment.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      feeRecordId: matchedFee ? matchedFee.id : '',
      notes: payment.notes || 'School fee transaction settlement',
      receivedBy: 'Alok Saxena (Accounts Desk)'
    };

    setPayments((prev) => [newPaymentReceipt, ...prev]);

    // Update Fee Record
    if (matchedFee) {
      const newPaid = matchedFee.paid + payment.amount;
      const newPending = Math.max(0, matchedFee.totalFee - newPaid);
      const newStatus =
        newPending === 0
          ? 'Paid'
          : newPaid > 0
          ? 'Partially Paid'
          : 'Pending';

      setFees((prev) =>
        prev.map((f) =>
          f.id === matchedFee.id
            ? { ...f, paid: newPaid, pending: newPending, status: newStatus }
            : f
        )
      );

      // If Aarav or Ananya, update child's fee data
      if (payment.studentId === 'std-8a-01') {
        setChildrenData((prev) => ({
          ...prev,
          aarav: {
            ...prev.aarav,
            fees: {
              ...prev.aarav.fees,
              paid: newPaid,
              pending: newPending,
              status: newStatus
            }
          }
        }));
      } else if (payment.studentId === 'std-5b-01') {
        setChildrenData((prev) => ({
          ...prev,
          ananya: {
            ...prev.ananya,
            fees: {
              ...prev.ananya.fees,
              paid: newPaid,
              pending: newPending,
              status: newStatus
            }
          }
        }));
      }
    }

    // Set active receipt modal
    setActiveReceipt(newPaymentReceipt);

    addToast({
      type: 'success',
      title: 'Payment Recorded',
      message: `Receipt #${receiptNo} generated for $${payment.amount.toLocaleString()}.`
    });
  };

  const reversePayment = (receiptNumber: string, reason: string): boolean => {
    const payment = payments.find((p) => p.receiptNumber === receiptNumber);
    if (!payment) {
      addToast({
        type: 'error',
        title: 'Receipt Not Found',
        message: `No payment transaction found with receipt #${receiptNumber}.`
      });
      return false;
    }

    // Remove from payments list
    setPayments((prev) => prev.filter((p) => p.receiptNumber !== receiptNumber));

    // Revert fee record
    const matchedFee = fees.find((f) => f.studentId === payment.studentId);
    if (matchedFee) {
      const newPaid = Math.max(0, matchedFee.paid - payment.amount);
      const newPending = matchedFee.pending + payment.amount;
      const newStatus = newPaid === 0 ? 'Pending' : 'Partially Paid';

      setFees((prev) =>
        prev.map((f) =>
          f.studentId === payment.studentId
            ? { ...f, paid: newPaid, pending: newPending, status: newStatus }
            : f
        )
      );

      // If Aarav or Ananya, synchronize parent mobile child view
      if (payment.studentId === 'std-8a-01') {
        setChildrenData((prev) => ({
          ...prev,
          aarav: {
            ...prev.aarav,
            fees: {
              ...prev.aarav.fees,
              paid: newPaid,
              pending: newPending,
              status: newStatus
            }
          }
        }));
      } else if (payment.studentId === 'std-5b-01') {
        setChildrenData((prev) => ({
          ...prev,
          ananya: {
            ...prev.ananya,
            fees: {
              ...prev.ananya.fees,
              paid: newPaid,
              pending: newPending,
              status: newStatus
            }
          }
        }));
      }
    }

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || userProfiles[currentRole]?.name || 'Accountant',
      action: 'PAYMENT_REVERSED',
      module: 'payments',
      recordRef: payment.receiptNumber,
      reason: `Reversal of $${payment.amount}: ${reason.trim()}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'info',
      title: 'Payment Voided & Reversed',
      message: `Receipt ${payment.receiptNumber} voided. $${payment.amount.toLocaleString()} reinstated to student fee ledger.`
    });

    return true;
  };

  const checkInVisitor = (visitor: Omit<Visitor, 'id' | 'status' | 'entryTime' | 'date'>) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date().toISOString().split('T')[0];
    const newVisitor: Visitor = {
      ...visitor,
      id: `vis-${Date.now()}`,
      status: 'Checked In',
      entryTime: timeNow,
      date: today
    };

    setVisitors((prev) => [newVisitor, ...prev]);

    addToast({
      type: 'success',
      title: 'Visitor Checked In',
      message: `${visitor.visitorName} issued pass ${visitor.badgeNo}.`
    });
  };

  const checkOutVisitor = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'Checked Out', exitTime: timeNow } : v))
    );

    addToast({
      type: 'info',
      title: 'Visitor Checked Out',
      message: `Pass deactivated and exit timestamp recorded.`
    });
  };

  const issueBook = (bookId: string, studentId: string, dueDate: string): boolean => {
    const book = books.find((b) => b.id === bookId);
    const student = students.find((s) => s.id === studentId);

    if (!book || !student) {
      addToast({ type: 'error', title: 'Error', message: 'Book or student not found.' });
      return false;
    }

    if (book.availableCopies <= 0) {
      addToast({
        type: 'error',
        title: 'Book Unavailable',
        message: `All copies of "${book.title}" are currently issued.`
      });
      return false;
    }

    // Decrement available copies
    const newAvailable = book.availableCopies - 1;
    const newStatus = newAvailable === 0 ? 'Out of Stock' : newAvailable <= 2 ? 'Low Stock' : 'Available';

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: newAvailable, status: newStatus } : b))
    );

    // Create transaction
    const matchedClass = classes.find((c) => c.id === student.classId);
    const newTx: LibraryTransaction = {
      id: `lib-tx-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      studentId: student.id,
      studentName: student.name,
      className: matchedClass ? matchedClass.name : student.classId,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      status: 'Issued',
      fineAmount: 0
    };

    setLibraryTransactions((prev) => [newTx, ...prev]);

    addToast({
      type: 'success',
      title: 'Book Issued',
      message: `"${book.title}" checked out to ${student.name}. Due on ${dueDate}.`
    });

    return true;
  };

  const returnBook = (transactionId: string) => {
    const tx = libraryTransactions.find((t) => t.id === transactionId);
    if (!tx) return;

    const today = new Date().toISOString().split('T')[0];
    const isOverdue = new Date(today) > new Date(tx.dueDate);
    const diffDays = isOverdue
      ? Math.ceil((new Date(today).getTime() - new Date(tx.dueDate).getTime()) / (1000 * 3600 * 24))
      : 0;
    const fine = diffDays * 2; // $2 per day late

    // Increment book availability
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === tx.bookId) {
          const newAvail = b.availableCopies + 1;
          const status = newAvail > 2 ? 'Available' : 'Low Stock';
          return { ...b, availableCopies: newAvail, status };
        }
        return b;
      })
    );

    // Update transaction
    setLibraryTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? { ...t, returnDate: today, status: 'Returned', fineAmount: fine }
          : t
      )
    );

    addToast({
      type: 'success',
      title: 'Book Returned',
      message: `"${tx.bookTitle}" returned successfully.${fine > 0 ? ` Overdue fine assessed: $${fine}.` : ''}`
    });
  };

  const addBook = (book: Omit<Book, 'id' | 'status'>) => {
    const newBook: Book = {
      ...book,
      id: `bk-${Date.now()}`,
      status: book.availableCopies > 2 ? 'Available' : book.availableCopies > 0 ? 'Low Stock' : 'Out of Stock'
    };
    setBooks((prev) => [newBook, ...prev]);
    addToast({
      type: 'success',
      title: 'Book Added',
      message: `"${book.title}" cataloged in ${book.category}.`
    });
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
    addToast({
      type: 'info',
      title: 'Book Removed',
      message: 'Title decommissioned from library catalogue.'
    });
  };

  const updateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    addToast({
      type: 'info',
      title: 'Enquiry Updated',
      message: `Status updated to "${status}".`
    });
  };

  const addEnquiry = (enquiry: Omit<Enquiry, 'id' | 'date'>) => {
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    addToast({
      type: 'success',
      title: 'Enquiry Registered',
      message: `New prospect enquiry logged for ${enquiry.studentName}.`
    });
  };

  const addAppointment = (apt: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      status: 'Scheduled'
    };
    setAppointments((prev) => [newApt, ...prev]);
    addToast({
      type: 'success',
      title: 'Appointment Scheduled',
      message: `Meeting confirmed for ${apt.parentName} on ${apt.date}.`
    });
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices((prev) => [newNotice, ...prev]);
    addToast({
      type: 'success',
      title: 'Notice Broadcasted',
      message: `"${notice.title}" posted to school board.`
    });
  };

  const sendMessage = (threadId: string, text: string, recipientRole: string, recipientName: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      senderRole: currentRole,
      senderName: currentRole === 'parent_mobile' ? 'Ramesh Sharma' : 'Faculty Member',
      recipientRole,
      recipientName,
      text,
      timestamp: 'Just now',
      isMine: true
    };
    setMessages((prev) => [...prev, newMsg]);
    addToast({
      type: 'success',
      title: 'Message Sent',
      message: `Sent to ${recipientName}.`
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.'
    });
  };

  const switchRoleAndNavigate = (role: RoleType, page?: string) => {
    setCurrentRole(role);
    setIsWelcomeScreen(false);
    if (role === 'teacher_mobile' || role === 'parent_mobile') {
      setCurrentPlatform('mobile');
      setCurrentPage(page || 'home');
    } else {
      setCurrentPlatform('web');
      setCurrentPage(page || 'dashboard');
    }
  };

  const logAuditEvent = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substr(0, 19)
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const executePermissionCheck = (module: string, action: string, context?: any): boolean => {
    const res = checkPermission(currentRole, module, action, context);
    if (!res.allowed) {
      addToast({
        type: 'error',
        title: 'Action Prohibited',
        message: res.reason || 'You do not have authorization for this operation.'
      });
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.fullName || currentRole,
        action: `${module.toUpperCase()}_${action.toUpperCase()}`,
        module,
        recordRef: context?.targetClass || context?.targetStudentId || 'N/A',
        status: 'DENIED',
        reason: res.reason
      });
      return false;
    }
    return true;
  };

  const submitMarksForReview = () => {
    if (!executePermissionCheck('marks', 'submit')) return;
    setExamModerationStatus('Submitted');
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Teacher',
      action: 'MARKS_SUBMIT_MODERATION',
      module: 'marks',
      recordRef: 'Term 1 Mathematics (Grade 10A)',
      status: 'SUCCESS',
      reason: 'Teacher submitted Grade 10A assessment marks to Academic Coordinator for moderation review'
    });
    addToast({
      type: 'success',
      title: 'Marks Submitted for Moderation',
      message: 'Assessment roster routed to Vice Principal for academic moderation.'
    });
  };

  const approveMarks = () => {
    if (!executePermissionCheck('marks', 'approve')) return;
    setExamModerationStatus('Approved');
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Vice Principal',
      action: 'MARKS_APPROVE_MODERATION',
      module: 'marks',
      recordRef: 'Term 1 Mathematics (Grade 10A)',
      status: 'SUCCESS',
      reason: 'Academic Coordinator approved moderated distribution and bell curve compliance'
    });
    addToast({
      type: 'success',
      title: 'Marks Moderation Approved',
      message: 'Assessment verified. Results are now cleared for official release.'
    });
  };

  const publishResults = () => {
    if (!executePermissionCheck('results', 'publish')) return;
    setExamModerationStatus('Published');
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Principal',
      action: 'RESULTS_PUBLISH',
      module: 'results',
      recordRef: 'Term 1 Official Report Cards',
      status: 'SUCCESS',
      reason: 'Principal authorized official release of Term 1 report cards to student & parent portals'
    });
    addToast({
      type: 'success',
      title: 'Results Published to Parents',
      message: 'Term 1 report cards are now officially visible on the Parent Portal.'
    });
  };

  const enrolApplicant = (enquiryId: string) => {
    if (!executePermissionCheck('admissions', 'enrol')) return;
    const enq = enquiries.find((e) => e.id === enquiryId);
    if (!enq) return;

    const newAdmissionId = `GIS-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newStudent: Student = {
      id: `std-enr-${Date.now()}`,
      name: enq.studentName,
      admissionId: newAdmissionId,
      classId: 'class-10a',
      section: 'A',
      rollNo: students.length + 1,
      dob: '2010-06-15',
      gender: 'Male',
      parentName: enq.parentName,
      parentPhone: enq.contact,
      parentEmail: `${enq.studentName.toLowerCase().replace(/\s+/g, '')}.family@greenfield.edu`,
      address: 'Greenfield Campus Residential Area',
      attendanceRate: 100.0,
      academicStatus: 'On Track',
      status: 'Active',
      bloodGroup: 'B+'
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Add tuition fee record
    const newFee: FeeRecord = {
      id: `fee-enr-${Date.now()}`,
      studentId: newStudent.id,
      studentName: newStudent.name,
      classId: 'class-10a',
      className: 'Grade 10A',
      totalFee: 3800,
      paid: 0,
      pending: 3800,
      dueDate: '2026-11-15',
      status: 'Pending'
    };
    setFees((prev) => [newFee, ...prev]);

    // Increment enrolled class student count
    setClasses((prev) =>
      prev.map((c) => (c.id === 'class-10a' ? { ...c, studentCount: c.studentCount + 1 } : c))
    );

    // Update enquiry status to Converted
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'Converted' } : e))
    );

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Principal',
      action: 'ADMISSION_ENROL_STUDENT',
      module: 'admissions',
      recordRef: newAdmissionId,
      status: 'SUCCESS',
      reason: `Applicant ${enq.studentName} matriculated and enrolled into Grade 10A directory`
    });

    addToast({
      type: 'success',
      title: 'Applicant Enrolled Successfully',
      message: `${newStudent.name} is now enrolled with Admission ID: ${newAdmissionId}.`
    });
  };

  const runScenario = (scenarioNum: number) => {
    setActiveScenarioModal(scenarioNum);
    switch (scenarioNum) {
      case 1:
        switchRoleAndNavigate('receptionist', 'admissions');
        break;
      case 2:
        switchRoleAndNavigate('teacher_mobile', 'attendance');
        break;
      case 3:
        switchRoleAndNavigate('teacher', 'assignments');
        break;
      case 4:
        switchRoleAndNavigate('teacher', 'marks');
        break;
      case 5:
        switchRoleAndNavigate('accountant', 'fees');
        break;
      case 6:
        switchRoleAndNavigate('librarian', 'issue_return');
        break;
      case 7:
        switchRoleAndNavigate('vice_principal', 'timetable');
        break;
      case 8:
        switchRoleAndNavigate('teacher', 'dashboard');
        break;
      case 9:
        addToast({
          type: 'info',
          title: 'Scenario 9: Local Persistence Active',
          message: 'All application state is synced in real-time to localStorage. Refresh anytime!'
        });
        break;
      case 10:
        switchRoleAndNavigate('principal', 'reports');
        break;
    }
  };

  // ==========================================
  // ACADEMIC MANAGEMENT ACTIONS (Prompt 3)
  // ==========================================

  // Academic Year Actions
  const addAcademicYear = (yearData: Omit<AcademicYear, 'id'>): { success: boolean; error?: string } => {
    if (!yearData.name?.trim() || !yearData.startDate || !yearData.endDate) {
      return { success: false, error: 'Academic year name, start date, and end date are required.' };
    }
    const newYear: AcademicYear = {
      ...yearData,
      id: `ay-${Date.now()}`
    };
    setAcademicYears((prev) => [newYear, ...prev]);
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_ACADEMIC_YEAR',
      module: 'academic',
      recordRef: newYear.id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const updateAcademicYear = (id: string, updated: Partial<AcademicYear>): { success: boolean; error?: string } => {
    setAcademicYears((prev) => prev.map((y) => (y.id === id ? { ...y, ...updated } : y)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_ACADEMIC_YEAR',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const archiveAcademicYear = (id: string): boolean => {
    if (id === activeAcademicYearId) return false;
    setAcademicYears((prev) => prev.map((y) => (y.id === id ? { ...y, status: 'Archived' } : y)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ARCHIVE_ACADEMIC_YEAR',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return true;
  };

  // Class and Section Actions
  const addClass = (classInfo: Omit<ClassInfo, 'id' | 'studentCount' | 'attendanceToday'>): { success: boolean; error?: string } => {
    if (!classInfo.name?.trim() || !classInfo.grade || !classInfo.section) {
      return { success: false, error: 'Grade, section, and display name are required.' };
    }
    const id = `class-${classInfo.grade.toLowerCase().replace(/[^a-z0-9]/g, '')}${classInfo.section.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const newClass: ClassInfo = {
      ...classInfo,
      id,
      studentCount: 0,
      attendanceToday: 0,
      status: classInfo.status || 'Active'
    };
    setClasses((prev) => [...prev, newClass]);
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_CLASS',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const updateClass = (id: string, updated: Partial<ClassInfo>): { success: boolean; error?: string } => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_CLASS',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const archiveClass = (id: string): boolean => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Archived' } : c)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ARCHIVE_CLASS',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return true;
  };

  // Subject Actions
  const addSubject = (subject: Omit<SubjectItem, 'id'>): { success: boolean; error?: string } => {
    if (!subject.code?.trim() || !subject.name?.trim()) {
      return { success: false, error: 'Subject code and name are required.' };
    }
    const newSubject: SubjectItem = {
      ...subject,
      id: `sub-${Date.now().toString().slice(-4)}`
    };
    setSubjects((prev) => [...prev, newSubject]);
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_SUBJECT',
      module: 'academic',
      recordRef: newSubject.id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const updateSubject = (id: string, updated: Partial<SubjectItem>): { success: boolean; error?: string } => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_SUBJECT',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const deleteSubject = (id: string): boolean => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setSubjectAllocations((prev) => prev.filter((a) => a.subjectId !== id));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_SUBJECT',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return true;
  };

  // Subject Allocation Actions
  const addSubjectAllocation = (allocation: Omit<SubjectAllocation, 'id'>): { success: boolean; error?: string } => {
    if (!allocation.classId || !allocation.subjectId || !allocation.teacherId) {
      return { success: false, error: 'Class, subject, and teacher are required.' };
    }
    const newAlloc: SubjectAllocation = {
      ...allocation,
      id: `alloc-${Date.now().toString().slice(-4)}`
    };
    setSubjectAllocations((prev) => [...prev, newAlloc]);
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_SUBJECT_ALLOCATION',
      module: 'academic',
      recordRef: newAlloc.id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const updateSubjectAllocation = (id: string, updated: Partial<SubjectAllocation>): { success: boolean; error?: string } => {
    setSubjectAllocations((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_SUBJECT_ALLOCATION',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const deleteSubjectAllocation = (id: string): boolean => {
    setSubjectAllocations((prev) => prev.filter((a) => a.id !== id));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_SUBJECT_ALLOCATION',
      module: 'academic',
      recordRef: id,
      status: 'SUCCESS'
    });
    return true;
  };

  // Period Configuration Actions
  const addPeriodConfig = (period: Omit<PeriodConfig, 'id'>): { success: boolean; error?: string } => {
    const newPeriod: PeriodConfig = {
      ...period,
      id: `p-${Date.now().toString().slice(-4)}`
    };
    setPeriods((prev) => [...prev, newPeriod]);
    return { success: true };
  };

  const updatePeriodConfig = (id: string, updated: Partial<PeriodConfig>): { success: boolean; error?: string } => {
    setPeriods((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    return { success: true };
  };

  const deletePeriodConfig = (id: string): boolean => {
    setPeriods((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  // Timetable Actions & Conflict Management
  const addTimetableEntry = (
    entry: Omit<TimetableEntry, 'id'>
  ): { success: boolean; error?: string; conflicts?: TimetableConflict[] } => {
    const conflicts = checkTimetableConflict(entry, timetableEntries);
    const blockingConflicts = conflicts.filter((c) => c.severity === 'blocking');
    if (blockingConflicts.length > 0) {
      return {
        success: false,
        error: blockingConflicts[0].message,
        conflicts: blockingConflicts
      };
    }

    const newEntry: TimetableEntry = {
      ...entry,
      id: `tt-${Date.now().toString().slice(-6)}`
    };
    setTimetableEntries((prev) => [...prev, newEntry]);
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_TIMETABLE_ENTRY',
      module: 'timetable',
      recordRef: newEntry.id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const updateTimetableEntry = (
    id: string,
    updated: Partial<TimetableEntry>
  ): { success: boolean; error?: string; conflicts?: TimetableConflict[] } => {
    const existing = timetableEntries.find((e) => e.id === id);
    if (!existing) {
      return { success: false, error: 'Timetable entry not found.' };
    }
    const merged = { ...existing, ...updated };
    const conflicts = checkTimetableConflict(merged, timetableEntries, id);
    const blockingConflicts = conflicts.filter((c) => c.severity === 'blocking');
    if (blockingConflicts.length > 0) {
      return {
        success: false,
        error: blockingConflicts[0].message,
        conflicts: blockingConflicts
      };
    }

    setTimetableEntries((prev) => prev.map((e) => (e.id === id ? merged : e)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_TIMETABLE_ENTRY',
      module: 'timetable',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const deleteTimetableEntry = (id: string): boolean => {
    setTimetableEntries((prev) => prev.filter((e) => e.id !== id));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_TIMETABLE_ENTRY',
      module: 'timetable',
      recordRef: id,
      status: 'SUCCESS'
    });
    return true;
  };

  const publishTimetable = (classId: string, notes?: string): void => {
    // 1. Mark entries for class as Published
    setTimetableEntries((prev) =>
      prev.map((e) => (e.classId === classId ? { ...e, status: 'Published' } : e))
    );

    // 2. Update version record
    const existingVersion = timetableVersions.find((v) => v.classId === classId);
    const nowIso = new Date().toISOString();
    const targetClass = classes.find((c) => c.id === classId);
    const className = targetClass?.name || classId;

    if (existingVersion) {
      const nextVerNum = (parseFloat(existingVersion.versionNumber.replace('v', '')) + 0.1).toFixed(1);
      setTimetableVersions((prev) =>
        prev.map((v) =>
          v.classId === classId
            ? {
                ...v,
                status: 'Published',
                versionNumber: `v${nextVerNum}`,
                lastUpdated: nowIso.split('T')[0],
                notes: notes || v.notes
              }
            : v
        )
      );
    } else {
      const newVersion: TimetableVersion = {
        id: `ver-${Date.now().toString().slice(-4)}`,
        academicYearId: activeAcademicYearId,
        classId,
        versionNumber: 'v1.0',
        status: 'Published',
        effectiveDate: nowIso.split('T')[0],
        lastUpdated: nowIso.split('T')[0],
        updatedBy: userProfiles[currentRole]?.name || currentRole,
        notes: notes || 'Initial official publication'
      };
      setTimetableVersions((prev) => [...prev, newVersion]);
    }

    addToast({
      type: 'success',
      title: 'Timetable Published',
      message: `Official weekly schedule for ${className} has been activated for faculty, students, and parents.`
    });

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'PUBLISH_TIMETABLE',
      module: 'timetable',
      recordRef: classId,
      status: 'SUCCESS'
    });
  };

  const createTimetableRevision = (classId: string, notes?: string): void => {
    const existingVersion = timetableVersions.find((v) => v.classId === classId);
    const targetClass = classes.find((c) => c.id === classId);
    const className = targetClass?.name || classId;
    const nowIso = new Date().toISOString();

    const nextVer = existingVersion
      ? `v${(parseFloat(existingVersion.versionNumber.replace('v', '')) + 0.1).toFixed(1)} (Draft)`
      : 'v1.1 (Draft)';

    const newVersion: TimetableVersion = {
      id: `ver-${Date.now().toString().slice(-4)}`,
      academicYearId: activeAcademicYearId,
      classId,
      versionNumber: nextVer,
      status: 'Draft',
      effectiveDate: nowIso.split('T')[0],
      lastUpdated: nowIso.split('T')[0],
      updatedBy: userProfiles[currentRole]?.name || currentRole,
      notes: notes || 'Draft revision in progress'
    };

    setTimetableVersions((prev) => [...prev.filter((v) => v.classId !== classId), newVersion]);

    addToast({
      type: 'info',
      title: 'Draft Revision Created',
      message: `Working copy started for ${className}. Modify slots freely without altering live student view until published.`
    });

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'CREATE_TIMETABLE_REVISION',
      module: 'timetable',
      recordRef: classId,
      status: 'SUCCESS'
    });
  };

  // Calendar Event Actions
  const addEvent = (event: Omit<SchoolEvent, 'id'>): { success: boolean; error?: string } => {
    if (!event.title?.trim() || !event.date) {
      return { success: false, error: 'Event title and date are required.' };
    }
    const newEvent: SchoolEvent = {
      ...event,
      id: `evt-${Date.now().toString().slice(-4)}`
    };
    setEvents((prev) => [newEvent, ...prev]);
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'ADD_EVENT',
      module: 'events',
      recordRef: newEvent.id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const updateEvent = (id: string, updated: Partial<SchoolEvent>): { success: boolean; error?: string } => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'UPDATE_EVENT',
      module: 'events',
      recordRef: id,
      status: 'SUCCESS'
    });
    return { success: true };
  };

  const deleteEvent = (id: string): boolean => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.name || currentRole,
      action: 'DELETE_EVENT',
      module: 'events',
      recordRef: id,
      status: 'SUCCESS'
    });
    return true;
  };

  const resetDemoData = () => {
    localStorage.clear();
    setClasses(INITIAL_CLASSES);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setStaff(INITIAL_STAFF);
    setAttendance(INITIAL_DETAILED_ATTENDANCE);
    setExams(INITIAL_DETAILED_EXAMS);
    setMarks(INITIAL_DETAILED_MARKS);
    setAssignments(INITIAL_DETAILED_ASSIGNMENTS);
    setFees(INITIAL_FEES);
    setPayments(INITIAL_PAYMENTS);
    setBooks(INITIAL_BOOKS);
    setLibraryTransactions(INITIAL_LIBRARY_TRANSACTIONS);
    setVisitors(INITIAL_VISITORS);
    setEnquiries(INITIAL_ENQUIRIES);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotices(INITIAL_NOTICES);
    setEvents(INITIAL_EVENTS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChildrenData(INITIAL_CHILDREN);
    setUserProfiles(INITIAL_PROFILES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setExamModerationStatus('Draft');
    setAcademicYears(INITIAL_ACADEMIC_YEARS);
    setActiveAcademicYearId('ay-2026-2027');
    setSubjects(INITIAL_SUBJECTS);
    setSubjectAllocations(INITIAL_SUBJECT_ALLOCATIONS);
    setPeriods(INITIAL_PERIODS);
    setTimetableEntries(INITIAL_TIMETABLE_ENTRIES);
    setTimetableVersions(INITIAL_TIMETABLE_VERSIONS);
    setStaffAttendance(INITIAL_STAFF_ATTENDANCE);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setCorrectionRequests(INITIAL_CORRECTION_REQUESTS);
    setStudentMovements(INITIAL_STUDENT_MOVEMENTS);
    setAttendancePolicy(INITIAL_ATTENDANCE_POLICY);
    setThemePalette(DEFAULT_PALETTE_ID);
    setIsSidebarCollapsed(false);

    addToast({
      type: 'info',
      title: 'Demo Data Reset',
      message: 'All entities and test state restored to initial factory defaults.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        isWelcomeScreen,
        setIsWelcomeScreen,
        currentPlatform,
        setCurrentPlatform,
        currentRole,
        setCurrentRole,
        currentPage,
        setCurrentPage,
        selectedChild,
        setSelectedChild,
        isMobileDeviceView,
        setIsMobileDeviceView,
        theme,
        setTheme,
        activePaletteId,
        themeColors,
        setThemePalette,
        applyCustomThemeColors,
        customThemes,
        saveCustomTheme,
        deleteCustomTheme,
        renameCustomTheme,
        resetThemeToDefault,
        isThemeModalOpen,
        setIsThemeModalOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        navigationHistory,
        goBack,
        navigateTo,
        quickSearchOpen,
        setQuickSearchOpen,
        activeScenarioModal,
        setActiveScenarioModal,
        runScenario,
        classes,
        students,
        teachers,
        staff,
        attendance,
        exams,
        marks,
        assignments,
        fees,
        setFees,
        payments,
        setPayments,
        books,
        setBooks,
        libraryTransactions,
        setLibraryTransactions,
        visitors,
        enquiries,
        appointments,
        notices,
        events,
        messages,
        notifications,
        childrenData,
        userProfiles,
        auditLogs,
        examModerationStatus,
        academicYears,
        activeAcademicYearId,
        setActiveAcademicYearId,
        subjects,
        subjectAllocations,
        periods,
        timetableEntries,
        timetableVersions,
        availableRooms,
        staffAttendance,
        leaveRequests,
        correctionRequests,
        studentMovements,
        attendancePolicy,
        addAcademicYear,
        updateAcademicYear,
        archiveAcademicYear,
        addClass,
        updateClass,
        archiveClass,
        addSubject,
        updateSubject,
        deleteSubject,
        addSubjectAllocation,
        updateSubjectAllocation,
        deleteSubjectAllocation,
        addPeriodConfig,
        updatePeriodConfig,
        deletePeriodConfig,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        publishTimetable,
        createTimetableRevision,
        addEvent,
        updateEvent,
        deleteEvent,
        updateUserProfile,
        activeReceipt,
        setActiveReceipt,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addStaff,
        updateStaff,
        deleteStaff,
        recordAttendance,
        saveAttendanceDraft,
        submitAttendance,
        requestAttendanceCorrection,
        reviewAttendanceCorrection,
        recordStaffAttendance,
        applyStaffLeave,
        reviewStaffLeave,
        cancelStaffLeave,
        recordStudentMovement,
        updateAttendancePolicy,
        addMarkEntry,
        submitMarksForReview,
        approveMarks,
        publishResults,
        createAssignment,
        deleteAssignment,
        recordPayment,
        reversePayment,
        checkInVisitor,
        checkOutVisitor,
        issueBook,
        returnBook,
        addBook,
        deleteBook,
        updateEnquiryStatus,
        addEnquiry,
        enrolApplicant,
        addAppointment,
        addNotice,
        sendMessage,
        logAuditEvent,
        executePermissionCheck,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        addToast,
        removeToast,
        resetDemoData,
        switchRoleAndNavigate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
