import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Exam,
  MarkEntry,
  Student,
  Teacher,
  ClassInfo,
  Assignment,
  ExamSession,
  SubjectAssessmentConfig,
  GradeBoundary
} from '../../types';
import {
  DEFAULT_GRADING_SCALE,
  calculateGradeFromPercentage,
  detectExamScheduleConflicts,
  exportMarksCSV,
  ExamConflict
} from '../../data/examinationData';
import { ReportCardModal } from './ReportCardModal';
import {
  FileSpreadsheet,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Printer,
  Download,
  Users,
  Eye,
  Check,
  X,
  ShieldCheck,
  Send,
  HelpCircle,
  TrendingUp,
  BarChart3,
  Layers,
  BookOpen,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';

export type ExamTabType =
  | 'dashboard'
  | 'schedule'
  | 'setup'
  | 'marks'
  | 'moderation'
  | 'results'
  | 'assignments'
  | 'reports'
  | 'settings';

interface ExaminationWorkspaceProps {
  defaultTab?: ExamTabType;
  allowedTabs?: ExamTabType[];
  teacherId?: string; // If supplied or in teacher role, scope marks entry to this teacher
}

export const ExaminationWorkspace: React.FC<ExaminationWorkspaceProps> = ({
  defaultTab = 'dashboard',
  allowedTabs,
  teacherId
}) => {
  const {
    exams,
    marks,
    assignments,
    classes,
    students,
    teachers,
    timetableEntries,
    currentRole,
    userProfiles,
    addToast,
    logAuditEvent,
    createAssignment,
    deleteAssignment,
    examModerationStatus
  } = useApp();

  // Active tab state
  const [activeTab, setActiveTab] = useState<ExamTabType>(defaultTab);

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Selected filters
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'exam-term1-final');
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10a');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  // Teacher scoping
  const activeTeacherId = teacherId || (currentRole === 'teacher' ? 't-1' : undefined);
  const currentTeacher = teachers.find((t) => t.id === activeTeacherId);

  // Grading scale state
  const [gradingScale, setGradingScale] = useState<GradeBoundary[]>(DEFAULT_GRADING_SCALE);

  // Draft marks state: key = studentId
  const [draftMarks, setDraftMarks] = useState<
    Record<
      string,
      {
        written?: number;
        practical?: number;
        internal?: number;
        status?: 'Entered' | 'Absent' | 'Exempt';
        remarks?: string;
      }
    >
  >({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Report Card Modal State
  const [reportCardStudent, setReportCardStudent] = useState<Student | null>(null);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);

  // Create / Edit Exam Modal State
  const [showCreateExamModal, setShowCreateExamModal] = useState<boolean>(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examForm, setExamForm] = useState<{
    name: string;
    term: string;
    academicYearId: string;
    applicableClassIds: string[];
    startDate: string;
    endDate: string;
    instructions: string;
    totalMarks: number;
    room: string;
    date: string;
    time: string;
  }>({
    name: '',
    term: 'Term 1',
    academicYearId: 'ay-2026-2027',
    applicableClassIds: ['class-10a', 'class-8a'],
    startDate: '2026-11-10',
    endDate: '2026-11-20',
    instructions: 'Summative term examination.',
    totalMarks: 100,
    room: 'Main Examination Hall',
    date: '2026-11-10',
    time: '09:00 AM - 12:00 PM'
  });

  // Moderation note modal
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [moderationNote, setModerationNote] = useState<string>('');

  // Assignment submissions modal state
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState<boolean>(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    title: '',
    classId: 'class-10a',
    subject: 'Mathematics',
    description: '',
    dueDate: '2026-10-25',
    maxMarks: 50,
    instructions: 'Complete exercises 4.1 to 4.5 and upload scanned solutions.',
    attachmentName: 'Calculus_Worksheet_Ch4.pdf'
  });

  // Schedule filters
  const [scheduleClassFilter, setScheduleClassFilter] = useState<string>('all');
  const [scheduleDateFilter, setScheduleDateFilter] = useState<string>('all');
  const [scheduleInvigilatorFilter, setScheduleInvigilatorFilter] = useState<string>('all');

  // Currently active selected exam object
  const currentExam = useMemo(() => {
    return exams.find((e) => e.id === selectedExamId) || exams[0];
  }, [exams, selectedExamId]);

  // Classes applicable for this exam
  const applicableClasses = useMemo(() => {
    if (currentExam?.applicableClassIds && currentExam.applicableClassIds.length > 0) {
      return classes.filter((c) => currentExam.applicableClassIds?.includes(c.id));
    }
    return classes;
  }, [classes, currentExam]);

  // Selected class
  const currentClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || applicableClasses[0] || classes[0];
  }, [classes, selectedClassId, applicableClasses]);

  // Students for currently selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Subject assessment config for selected exam, class, subject
  const currentSubjectConfig = useMemo(() => {
    if (!currentExam || !currentExam.subjectConfigs) return null;
    return currentExam.subjectConfigs.find(
      (sc) => sc.classId === selectedClassId && sc.subjectName.toLowerCase().includes(selectedSubject.toLowerCase())
    );
  }, [currentExam, selectedClassId, selectedSubject]);

  // Check teacher permission for selected class and subject
  const isTeacherAuthorizedForSubject = useMemo(() => {
    if (currentRole === 'principal' || currentRole === 'vice_principal') return true;
    if (!activeTeacherId) return true;

    // Check if teacher is assigned to this class and subject in timetable or allocations
    const hasSlot = timetableEntries.some(
      (e) =>
        e.teacherId === activeTeacherId &&
        e.classId === selectedClassId &&
        e.subjectName.toLowerCase().includes(selectedSubject.toLowerCase())
    );

    // Or assigned in subject config
    const assignedInConfig = currentSubjectConfig?.assignedTeacherId === activeTeacherId;

    // Or teacher's profile list of subjects and classes
    const inProfile =
      currentTeacher?.classes.includes(selectedClassId) &&
      currentTeacher?.subjects.some((s) => s.toLowerCase().includes(selectedSubject.toLowerCase()));

    return hasSlot || assignedInConfig || !!inProfile;
  }, [currentRole, activeTeacherId, timetableEntries, selectedClassId, selectedSubject, currentSubjectConfig, currentTeacher]);

  // All exam sessions across all exams for timetable & conflict detection
  const allExamSessions: ExamSession[] = useMemo(() => {
    const list: ExamSession[] = [];
    exams.forEach((ex) => {
      if (ex.sessions) {
        list.push(...ex.sessions);
      }
    });
    return list;
  }, [exams]);

  // Conflict detection for all sessions
  const detectedConflicts: { session: ExamSession; conflicts: ExamConflict[] }[] = useMemo(() => {
    return allExamSessions.map((session) => ({
      session,
      conflicts: detectExamScheduleConflicts(session, allExamSessions)
    })).filter((item) => item.conflicts.length > 0);
  }, [allExamSessions]);

  // Initializing draft marks when class/subject/exam changes
  const activeMarksList = useMemo(() => {
    return marks.filter(
      (m) =>
        m.examId === selectedExamId &&
        m.classId === selectedClassId &&
        m.subject.toLowerCase().includes(selectedSubject.toLowerCase())
    );
  }, [marks, selectedExamId, selectedClassId, selectedSubject]);

  // Handlers for marks entry
  const handleMarkChange = (
    studentId: string,
    field: 'written' | 'practical' | 'internal',
    value: number
  ) => {
    setDraftMarks((prev) => {
      const existing = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: Math.max(0, value),
          status: 'Entered'
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleStatusChange = (studentId: string, status: 'Entered' | 'Absent' | 'Exempt') => {
    setDraftMarks((prev) => {
      const existing = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...existing,
          status,
          ...(status === 'Absent' ? { written: 0, practical: 0, internal: 0 } : {})
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setDraftMarks((prev) => {
      const existing = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...existing,
          remarks
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  const handleMarkAllPresent = () => {
    const updated: typeof draftMarks = { ...draftMarks };
    classStudents.forEach((s) => {
      const cur = updated[s.id] || {};
      updated[s.id] = {
        ...cur,
        status: 'Entered'
      };
    });
    setDraftMarks(updated);
    setHasUnsavedChanges(true);
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: 'All students set to Present / Entered.'
    });
  };

  const handleSaveMarksDraft = () => {
    setHasUnsavedChanges(false);
    addToast({
      type: 'success',
      title: 'Grades Draft Saved',
      message: `Assessment scores for ${selectedSubject} (${currentClass.name}) saved to local workstation.`
    });
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Teacher',
      action: 'MARKS_SAVE_DRAFT',
      module: 'marks',
      recordRef: `${currentExam.name} - ${currentClass.name} - ${selectedSubject}`,
      status: 'SUCCESS',
      reason: 'Teacher saved work-in-progress assessment marks'
    });
  };

  const handleSubmitMarksToCoordinator = () => {
    setHasUnsavedChanges(false);
    addToast({
      type: 'success',
      title: 'Marks Submitted for Moderation',
      message: `${selectedSubject} marks submitted to Vice Principal (Mrs. Evelyn Hayes) for moderation.`
    });
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Teacher',
      action: 'MARKS_SUBMIT_MODERATION',
      module: 'marks',
      recordRef: `${currentExam.name} - ${currentClass.name} - ${selectedSubject}`,
      status: 'SUCCESS',
      reason: 'Teacher submitted completed gradebook for moderation review'
    });
  };

  const handleApproveMarks = () => {
    addToast({
      type: 'success',
      title: 'Marks Moderation Approved',
      message: `Marks distribution for ${currentClass.name} ${selectedSubject} approved. Cleared for report card release.`
    });
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Vice Principal',
      action: 'MARKS_APPROVE_MODERATION',
      module: 'marks',
      recordRef: `${currentExam.name} - ${currentClass.name} - ${selectedSubject}`,
      status: 'SUCCESS',
      reason: 'Academic Coordinator approved subject evaluation roster'
    });
  };

  const handleReturnMarks = () => {
    if (!moderationNote.trim()) {
      addToast({
        type: 'error',
        title: 'Note Required',
        message: 'Please provide moderation feedback or instructions for the teacher.'
      });
      return;
    }
    setShowReturnModal(false);
    addToast({
      type: 'info',
      title: 'Marks Returned to Faculty',
      message: `Evaluation returned to ${currentSubjectConfig?.assignedTeacherName || 'Teacher'} with note: "${moderationNote}"`
    });
    setModerationNote('');
  };

  const handlePublishResults = () => {
    addToast({
      type: 'success',
      title: 'Results Published Officially',
      message: `Official Report Cards for ${currentExam.name} are now released and viewable on Parent Portal!`
    });
    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Principal',
      action: 'RESULTS_PUBLISH',
      module: 'results',
      recordRef: `${currentExam.name}`,
      status: 'SUCCESS',
      reason: 'Principal authorized official public release of examination transcripts'
    });
  };

  // Filter tabs by allowedTabs
  const visibleTabs = useMemo(() => {
    const allTabItems: { id: ExamTabType; label: string; icon: React.ReactNode }[] = [
      { id: 'dashboard', label: 'Exam Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'schedule', label: 'Exam Schedule & Conflicts', icon: <Calendar className="w-4 h-4" /> },
      { id: 'setup', label: 'Examination Setup', icon: <Layers className="w-4 h-4" /> },
      { id: 'marks', label: 'Marks Entry Workstation', icon: <Award className="w-4 h-4" /> },
      { id: 'moderation', label: 'Review & Moderation', icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'results', label: 'Results & Report Cards', icon: <FileSpreadsheet className="w-4 h-4" /> },
      { id: 'assignments', label: 'Assignments & Homework', icon: <FileText className="w-4 h-4" /> },
      { id: 'reports', label: 'Analytics & Remedials', icon: <TrendingUp className="w-4 h-4" /> },
      { id: 'settings', label: 'Assessment Settings', icon: <BookOpen className="w-4 h-4" /> }
    ];

    if (!allowedTabs) {
      // Role-based sensible default
      if (currentRole === 'teacher') {
        return allTabItems.filter((t) =>
          ['dashboard', 'schedule', 'marks', 'results', 'assignments'].includes(t.id)
        );
      }
      if (currentRole === 'vice_principal') {
        return allTabItems.filter((t) =>
          ['dashboard', 'schedule', 'moderation', 'results', 'reports'].includes(t.id)
        );
      }
      return allTabItems;
    }

    return allTabItems.filter((t) => allowedTabs.includes(t.id));
  }, [allowedTabs, currentRole]);

  // Statistics calculation for current active subject
  const subjectStats = useMemo(() => {
    const validScores: number[] = [];
    let passCount = 0;
    let failCount = 0;
    let absentCount = 0;
    const gradeDist: Record<string, number> = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };

    classStudents.forEach((st) => {
      const existing = activeMarksList.find((m) => m.studentId === st.id);
      const draft = draftMarks[st.id];

      const status = draft?.status || existing?.assessmentStatus || 'Entered';
      if (status === 'Absent') {
        absentCount++;
        gradeDist['F'] = (gradeDist['F'] || 0) + 1;
        failCount++;
        return;
      }
      if (status === 'Exempt') return;

      const maxM = currentSubjectConfig?.totalMaxMarks || currentExam?.totalMarks || 100;
      const written = draft?.written ?? existing?.writtenMarks ?? 0;
      const practical = draft?.practical ?? existing?.practicalMarks ?? 0;
      const internal = draft?.internal ?? existing?.internalMarks ?? 0;
      const total = draft?.written !== undefined ? written + practical + internal : existing?.marksObtained ?? (written + practical + internal);

      validScores.push(total);
      const pct = (total / maxM) * 100;
      const grade = calculateGradeFromPercentage(pct, gradingScale).grade;
      gradeDist[grade] = (gradeDist[grade] || 0) + 1;

      const passingMark = currentSubjectConfig?.passingMarks || 40;
      if (total >= passingMark) {
        passCount++;
      } else {
        failCount++;
      }
    });

    const highest = validScores.length > 0 ? Math.max(...validScores) : 0;
    const lowest = validScores.length > 0 ? Math.min(...validScores) : 0;
    const avg = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
    const totalAssessed = validScores.length + absentCount;
    const passPercentage = totalAssessed > 0 ? (passCount / totalAssessed) * 100 : 0;

    return { highest, lowest, avg, passCount, failCount, absentCount, passPercentage, gradeDist, totalAssessed };
  }, [classStudents, activeMarksList, draftMarks, currentSubjectConfig, currentExam, gradingScale]);

  return (
    <div className="space-y-6">
      {/* Top Header & Context Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Greenfield Assessment Engine
            </span>
            <span className="text-xs font-mono text-slate-400">Academic Year 2026-2027</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Academic Examinations, Marks & Results
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive scholastic management for exam scheduling, subject configurations, teacher marksheets, and report cards.
          </p>
        </div>

        {/* Quick Switcher / Publish Shortcut */}
        <div className="flex flex-wrap items-center gap-2">
          {currentRole === 'principal' && (
            <button
              onClick={handlePublishResults}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Publish Official Results</span>
            </button>
          )}

          <button
            onClick={() => {
              if (classStudents.length > 0) {
                setReportCardStudent(classStudents[0]);
                setShowReportCardModal(true);
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Sample Report Card</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.id === 'schedule' && detectedConflicts.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-mono">
                {detectedConflicts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. EXAMINATION DASHBOARD TAB                                   */}
      {/* ============================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Scheduled Exams</span>
                <Calendar className="w-4 h-4 text-blue-700" />
              </div>
              <span className="text-3xl font-extrabold text-slate-900 font-mono block">{exams.length}</span>
              <p className="text-xs text-slate-500 mt-2">
                {allExamSessions.length} total invigilation sessions scheduled
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Marks Moderation</span>
                <Award className="w-4 h-4 text-emerald-700" />
              </div>
              <span className="text-3xl font-extrabold text-emerald-800 font-mono block">86.4%</span>
              <p className="text-xs text-slate-500 mt-2">
                19 of 22 subject gradebooks submitted & approved
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Average Class GPA</span>
                <TrendingUp className="w-4 h-4 text-indigo-700" />
              </div>
              <span className="text-3xl font-extrabold text-indigo-900 font-mono block">3.72</span>
              <p className="text-xs text-slate-500 mt-2">Consistent with A-grade academic benchmark</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Timetable Conflicts</span>
                <AlertTriangle className={`w-4 h-4 ${detectedConflicts.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
              </div>
              <span className={`text-3xl font-extrabold font-mono block ${detectedConflicts.length > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
                {detectedConflicts.length}
              </span>
              <p className="text-xs text-slate-500 mt-2">
                {detectedConflicts.length === 0 ? 'All examination rooms & supervisors clear' : 'Active overlaps flagged in schedule'}
              </p>
            </div>
          </div>

          {/* Conflict Notification Banner if any */}
          {detectedConflicts.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-sm text-rose-950">
                  {detectedConflicts.length} Examination Schedule Conflict(s) Detected
                </h4>
                <p className="mt-0.5 leading-relaxed">
                  Conflicting rooms or teachers assigned simultaneously have been flagged. View the Exam Schedule tab to resolve them.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('schedule')}
                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs shrink-0"
              >
                Inspect Schedule →
              </button>
            </div>
          )}

          {/* Active Examination Overview Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Active School Examination Cohorts</h3>
                <p className="text-xs text-slate-500">Official assessments configured for Greenfield International School</p>
              </div>
              <button
                onClick={() => {
                  setExamForm({
                    name: '',
                    term: 'Term 1',
                    academicYearId: 'ay-2026-2027',
                    applicableClassIds: ['class-10a', 'class-8a'],
                    startDate: '2026-11-10',
                    endDate: '2026-11-20',
                    instructions: 'New summative examination cycle.',
                    totalMarks: 100,
                    room: 'Main Examination Hall',
                    date: '2026-11-10',
                    time: '09:00 AM - 12:00 PM'
                  });
                  setEditingExamId(null);
                  setShowCreateExamModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Exam</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Examination</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4">Applicable Classes</th>
                    <th className="py-3 px-4">Window / Dates</th>
                    <th className="py-3 px-4">Subject Configs</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((ex) => (
                    <tr key={ex.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block text-sm">{ex.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">ID: {ex.id}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">{ex.term}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(ex.applicableClassIds || [ex.classId]).map((cid) => {
                            const cname = classes.find((c) => c.id === cid)?.name || cid;
                            return (
                              <span key={cid} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[10px]">
                                {cname}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {ex.startDate ? `${ex.startDate} → ${ex.endDate}` : ex.date}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-800">
                        {ex.subjectConfigs ? `${ex.subjectConfigs.length} Subjects` : 'Core Subjects'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ex.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : ex.status === 'Approved'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : ex.status === 'Completed'
                              ? 'bg-slate-200 text-slate-800'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {ex.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedExamId(ex.id);
                              setActiveTab('marks');
                            }}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-bold"
                            title="Enter / View Marks"
                          >
                            Gradebook
                          </button>
                          <button
                            onClick={() => {
                              setSelectedExamId(ex.id);
                              setActiveTab('schedule');
                            }}
                            className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-bold"
                            title="View Exam Schedule"
                          >
                            Schedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. EXAM SCHEDULE & TIMETABLE TAB                               */}
      {/* ============================================================== */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Official Examination Timetable & Hall Allocations</h2>
              <p className="text-xs text-slate-500">
                Date-wise schedule with invigilators, examination rooms, duration, and automatic conflict detection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Filter by Class</label>
              <select
                value={scheduleClassFilter}
                onChange={(e) => setScheduleClassFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="all">All Classes & Sections</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Filter by Supervisor / Invigilator</label>
              <select
                value={scheduleInvigilatorFilter}
                onChange={(e) => setScheduleInvigilatorFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="all">All Faculty Invigilators</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Active Examination Cycle</label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sessions Schedule List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">
                Examination Slots — {currentExam.name}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {allExamSessions.filter((s) => s.examId === selectedExamId).length} scheduled papers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Room / Hall</th>
                    <th className="py-3 px-4">Invigilator</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Conflict Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allExamSessions
                    .filter((s) => s.examId === selectedExamId)
                    .filter((s) => scheduleClassFilter === 'all' || s.classId === scheduleClassFilter)
                    .filter((s) => scheduleInvigilatorFilter === 'all' || s.invigilatorTeacherId === scheduleInvigilatorFilter)
                    .map((sess) => {
                      const conflicts = detectExamScheduleConflicts(sess, allExamSessions);
                      const hasConflict = conflicts.length > 0;

                      return (
                        <tr key={sess.id} className={hasConflict ? 'bg-rose-50/50' : 'hover:bg-slate-50'}>
                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-slate-900 block">{sess.date}</span>
                            <span className="text-[11px] text-slate-500">{sess.startTime} – {sess.endTime}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{sess.subjectName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                              {sess.className}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-700">{sess.room}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">{sess.invigilatorName}</span>
                            <span className="text-[10px] text-slate-400">Chief Supervisor</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{sess.durationMinutes} mins</td>
                          <td className="py-3 px-4">
                            {hasConflict ? (
                              <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                <span>{conflicts[0].title}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>No Conflict</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. EXAMINATION SETUP & SUBJECT CONFIGURATIONS TAB              */}
      {/* ============================================================== */}
      {activeTab === 'setup' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Examination Structure & Component Assessment Weightings</h2>
              <p className="text-xs text-slate-500">
                Configure Written, Practical, and Internal marks breakdown per subject for each class.
              </p>
            </div>

            <button
              onClick={() => {
                setExamForm({
                  name: '',
                  term: 'Term 1',
                  academicYearId: 'ay-2026-2027',
                  applicableClassIds: ['class-10a', 'class-8a'],
                  startDate: '2026-11-10',
                  endDate: '2026-11-20',
                  instructions: 'Summative term examination.',
                  totalMarks: 100,
                  room: 'Main Examination Hall',
                  date: '2026-11-10',
                  time: '09:00 AM - 12:00 PM'
                });
                setEditingExamId(null);
                setShowCreateExamModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Examination</span>
            </button>
          </div>

          {/* Subject Assessment Configurations Table for selected exam */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  Subject Weighting Matrix — {currentExam.name}
                </span>
                <span className="text-xs text-slate-500">
                  Custom evaluation models: Science (written + lab practical + internal) vs Humanities (written + coursework)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Select Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                >
                  {applicableClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-3 text-center">Written Marks</th>
                    <th className="py-3 px-3 text-center">Practical Marks</th>
                    <th className="py-3 px-3 text-center">Internal Marks</th>
                    <th className="py-3 px-3 text-center">Total Max</th>
                    <th className="py-3 px-3 text-center">Passing Marks</th>
                    <th className="py-3 px-4">Assigned Teacher</th>
                    <th className="py-3 px-4">Moderation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(currentExam.subjectConfigs || [])
                    .filter((sc) => sc.classId === selectedClassId)
                    .map((sc) => (
                      <tr key={sc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{sc.subjectName}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{sc.maxWrittenMarks}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{sc.maxPracticalMarks || '—'}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{sc.maxInternalMarks || '—'}</td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-emerald-800 bg-emerald-50/50">
                          {sc.totalMaxMarks}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                          {sc.passingMarks} ({sc.passingPercentage}%)
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{sc.assignedTeacherName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sc.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sc.status === 'Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : sc.status === 'Submitted'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {sc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. TEACHER-SPECIFIC MARKS ENTRY WORKSTATION                    */}
      {/* ============================================================== */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          {/* Header & Status Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded font-mono">
                  {currentTeacher?.name || 'Faculty Member'}
                </span>
                <span className="text-xs text-slate-400">· Evaluator Gradebook</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Subject Marks Entry & Component Scoring
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Input component marks with live automatic percentage, letter grade calculation, and moderation submission.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={handleSaveMarksDraft}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleSubmitMarksToCoordinator}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Coordinator</span>
              </button>
              <button
                type="button"
                onClick={() => exportMarksCSV(currentExam as any, selectedSubject, currentClass, activeMarksList as any)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selectors Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Class Section</label>
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  setDraftMarks({});
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                {applicableClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value);
                  setDraftMarks({});
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science (Physics & Chemistry)</option>
                <option value="English">English Literature</option>
                <option value="Computer Science">Computer Science & AI</option>
                <option value="Social Studies">Social Studies & History</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Examination</label>
              <select
                value={selectedExamId}
                onChange={(e) => {
                  setSelectedExamId(e.target.value);
                  setDraftMarks({});
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.totalMarks} Marks)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher Subject Permission Warning if Unauthorized */}
          {!isTeacherAuthorizedForSubject && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-amber-950">Read-Only View: Subject Not Assigned</h4>
                <p className="mt-0.5 leading-relaxed">
                  You are viewing <strong>{selectedSubject}</strong> for <strong>{currentClass.name}</strong>, which is assigned to another teacher. You can review existing records, but editing is locked to the designated subject faculty.
                </p>
              </div>
            </div>
          )}

          {/* Subject Weighting Information Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800">Assessment Breakdown:</span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-mono text-[11px]">
                Written: <strong>{currentSubjectConfig?.maxWrittenMarks ?? 80}</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-mono text-[11px]">
                Practical: <strong>{currentSubjectConfig?.maxPracticalMarks ?? 0}</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-mono text-[11px]">
                Internal: <strong>{currentSubjectConfig?.maxInternalMarks ?? 20}</strong>
              </span>
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded font-mono font-bold text-[11px]">
                Total: {currentSubjectConfig?.totalMaxMarks ?? 100}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <span>Passing: <strong className="font-mono text-slate-800">{currentSubjectConfig?.passingMarks ?? 40} Marks</strong></span>
              <span>Class Students: <strong className="font-mono text-slate-800">{classStudents.length}</strong></span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Written (/{currentSubjectConfig?.maxWrittenMarks ?? 80})</th>
                  <th className="py-3 px-3 text-center">Practical (/{currentSubjectConfig?.maxPracticalMarks ?? 0})</th>
                  <th className="py-3 px-3 text-center">Internal (/{currentSubjectConfig?.maxInternalMarks ?? 20})</th>
                  <th className="py-3 px-3 text-center">Total (/{currentSubjectConfig?.totalMaxMarks ?? 100})</th>
                  <th className="py-3 px-3 text-center">% & Grade</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st) => {
                  const existing = activeMarksList.find((m) => m.studentId === st.id);
                  const draft = draftMarks[st.id] || {};

                  const maxW = currentSubjectConfig?.maxWrittenMarks ?? 80;
                  const maxP = currentSubjectConfig?.maxPracticalMarks ?? 0;
                  const maxI = currentSubjectConfig?.maxInternalMarks ?? 20;
                  const maxTotal = currentSubjectConfig?.totalMaxMarks ?? 100;

                  const currentStatus = draft.status || existing?.assessmentStatus || 'Entered';
                  const isAbsent = currentStatus === 'Absent';
                  const isExempt = currentStatus === 'Exempt';

                  const written = isAbsent ? 0 : (draft.written ?? existing?.writtenMarks ?? 0);
                  const practical = isAbsent ? 0 : (draft.practical ?? existing?.practicalMarks ?? 0);
                  const internal = isAbsent ? 0 : (draft.internal ?? existing?.internalMarks ?? 0);
                  const total = isAbsent ? 0 : isExempt ? 0 : written + practical + internal;
                  const pct = isAbsent ? 0 : isExempt ? 100 : Math.round((total / maxTotal) * 100);
                  const grade = calculateGradeFromPercentage(pct, gradingScale).grade;

                  return (
                    <tr key={st.id} className={isAbsent ? 'bg-rose-50/40' : 'hover:bg-slate-50'}>
                      {/* Student info */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block text-xs">{st.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          #{st.rollNo} · {st.admissionId || st.id}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3 px-3">
                        <select
                          disabled={!isTeacherAuthorizedForSubject}
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(st.id, e.target.value as any)}
                          className={`p-1 text-[11px] rounded font-bold border ${
                            isAbsent
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : isExempt
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          <option value="Entered">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Exempt">Exempt</option>
                        </select>
                      </td>

                      {/* Written Marks */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={maxW}
                          disabled={!isTeacherAuthorizedForSubject || isAbsent || isExempt}
                          value={isAbsent ? 0 : written}
                          onChange={(e) => handleMarkChange(st.id, 'written', Number(e.target.value))}
                          className="w-16 p-1 text-center font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded disabled:opacity-50"
                        />
                      </td>

                      {/* Practical Marks */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={maxP}
                          disabled={!isTeacherAuthorizedForSubject || isAbsent || isExempt || maxP === 0}
                          value={maxP === 0 ? '' : isAbsent ? 0 : practical}
                          onChange={(e) => handleMarkChange(st.id, 'practical', Number(e.target.value))}
                          placeholder={maxP === 0 ? '—' : '0'}
                          className="w-16 p-1 text-center font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded disabled:opacity-40"
                        />
                      </td>

                      {/* Internal Marks */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={maxI}
                          disabled={!isTeacherAuthorizedForSubject || isAbsent || isExempt || maxI === 0}
                          value={maxI === 0 ? '' : isAbsent ? 0 : internal}
                          onChange={(e) => handleMarkChange(st.id, 'internal', Number(e.target.value))}
                          placeholder={maxI === 0 ? '—' : '0'}
                          className="w-16 p-1 text-center font-mono font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded disabled:opacity-40"
                        />
                      </td>

                      {/* Total Score */}
                      <td className="py-3 px-3 text-center font-mono font-extrabold text-sm text-slate-900">
                        {isAbsent ? (
                          <span className="text-rose-600 font-bold text-xs">0 (ABS)</span>
                        ) : isExempt ? (
                          <span className="text-blue-600 font-bold text-xs">EXEMPT</span>
                        ) : (
                          `${total} / ${maxTotal}`
                        )}
                      </td>

                      {/* Percentage & Grade Badge */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              isAbsent
                                ? 'bg-rose-100 text-rose-800'
                                : isExempt
                                ? 'bg-blue-100 text-blue-800'
                                : grade === 'A+' || grade === 'A'
                                ? 'bg-emerald-100 text-emerald-800'
                                : grade === 'B'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isAbsent ? 'F' : isExempt ? 'EX' : grade}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {isAbsent ? '0%' : isExempt ? '—' : `${pct}%`}
                          </span>
                        </div>
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          disabled={!isTeacherAuthorizedForSubject}
                          value={draft.remarks !== undefined ? draft.remarks : (existing?.remarks || '')}
                          onChange={(e) => handleRemarkChange(st.id, e.target.value)}
                          placeholder="Teacher observations..."
                          className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700 text-xs placeholder:text-slate-400"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODERATION & APPROVAL WORKFLOW TAB                          */}
      {/* ============================================================== */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded font-mono">
                  Academic Moderation Desk
                </span>
                <span className="text-xs text-slate-400">· Vice Principal Review Queue</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Marks Review, Bell-Curve Distribution & Approval
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit submitted assessment rosters, check statistical anomalies, approve for publication, or return with notes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowReturnModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Return with Feedback</span>
              </button>
              <button
                onClick={handleApproveMarks}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve Gradebook</span>
              </button>
            </div>
          </div>

          {/* Statistical Distribution Overview for selected Subject */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Class Average</span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
                {subjectStats.avg.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Compliant with standard curve</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Pass Rate %</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-800 mt-1 block">
                {subjectStats.passPercentage.toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {subjectStats.passCount} Passed · {subjectStats.failCount} Remedial Needed
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Score Range</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  {subjectStats.highest}
                </span>
                <span className="text-xs text-slate-400">High</span>
                <span className="text-xl font-extrabold font-mono text-slate-700 ml-2">
                  {subjectStats.lowest}
                </span>
                <span className="text-xs text-slate-400">Low</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Spread: {subjectStats.highest - subjectStats.lowest} marks</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Grade Breakdown</span>
              <div className="flex items-center gap-1.5 mt-2">
                {Object.entries(subjectStats.gradeDist).map(([gr, count]) => (
                  <span key={gr} className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
                    <strong>{gr}</strong>:{count}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Roster Table in Moderation View */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">
                Moderation Roster: {selectedSubject} · {currentClass.name}
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                Status: Under Review
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-3 text-center">Standing</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st) => {
                  const m = activeMarksList.find((x) => x.studentId === st.id);
                  const isAbs = m?.assessmentStatus === 'Absent';
                  const score = isAbs ? 0 : (m?.marksObtained ?? 0);
                  const pct = isAbs ? 0 : m?.percentage ?? Math.round((score / (m?.totalMarks || 100)) * 100);
                  const gr = isAbs ? 'F' : m?.grade || 'A';

                  return (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{st.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{st.rollNo}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                        {isAbs ? <span className="text-rose-600 font-bold">ABSENT</span> : `${score} / ${m?.totalMarks || 100}`}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            gr.startsWith('A')
                              ? 'bg-emerald-100 text-emerald-800'
                              : gr === 'B'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {gr}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600">{pct}%</td>
                      <td className="py-3 px-4 text-slate-600 italic max-w-xs truncate">
                        {m?.remarks || 'Evaluation verified by teacher.'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. RESULTS & STUDENT REPORT CARDS TAB                          */}
      {/* ============================================================== */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                  Official Scholastic Transcripts
                </span>
                <span className="text-xs text-slate-400">· Term 1 Final Results</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Class Master Sheet & Individual Report Cards
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Generate, view, and print official Greenfield International School Report Cards for any enrolled student.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Print Master Sheet</span>
              </button>
            </div>
          </div>

          {/* Class Selectors */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">Select Class for Report Cards:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
            >
              {applicableClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Roster Table with "Generate Report Card" Action */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Rank / Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Admission No</th>
                  <th className="py-3 px-4 text-center">Attendance Rate</th>
                  <th className="py-3 px-4 text-center">Academic Status</th>
                  <th className="py-3 px-4 text-right">Official Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((st, idx) => (
                  <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">#1 Leader</span>
                      ) : (
                        `#${st.rollNo || idx + 1}`
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block text-sm">{st.name}</span>
                      <span className="text-[11px] text-slate-400">Class {currentClass.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{st.admissionId || st.id}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-800">
                      {st.attendanceRate}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          st.academicStatus === 'Exceeding'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.academicStatus === 'On Track'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {st.academicStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setReportCardStudent(st);
                          setShowReportCardModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Report Card</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. ASSIGNMENTS & HOMEWORK WORKSPACE                            */}
      {/* ============================================================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Assignments & Homework Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Issue homework coursework, track student submissions, and record individual grades and feedback.
              </p>
            </div>

            <button
              onClick={() => setShowCreateAssignmentModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Assignment</span>
            </button>
          </div>

          {/* Assignments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((asg) => (
              <div key={asg.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {asg.subject} · {asg.className}
                    </span>
                    <button
                      onClick={() => deleteAssignment(asg.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{asg.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Due Date:</span>
                    <strong className="font-mono text-slate-800">{asg.dueDate}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-700 font-bold block">
                      {asg.submissionsCount} / {asg.totalStudents} Submitted
                    </span>
                    <button
                      onClick={() => setViewingAssignment(asg)}
                      className="text-xs text-blue-800 font-bold hover:underline mt-0.5"
                    >
                      View & Grade Submissions →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. ACADEMIC PERFORMANCE & REMEDIAL REPORTS TAB                 */}
      {/* ============================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Analytics & Remedial Tracking</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identify students requiring remedial intervention, subject benchmark comparisons, and failure prevention.
            </p>
          </div>

          {/* Remedial List Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-sm text-rose-950">Remedial Action Roster (&lt;40% Passing Standard)</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-800">
                Identified from latest Term assessments
              </span>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Score Obtained</th>
                  <th className="py-3 px-4">Recommended Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Rohan Kumar</td>
                  <td className="py-3 px-4">Grade 10A</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Mathematics</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">32 / 100 (32%)</td>
                  <td className="py-3 px-4 text-slate-600">Assigned 2 hours/week after-school geometry clinic with Dr. Sharma</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Vikram Nair</td>
                  <td className="py-3 px-4">Grade 8A</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Science</td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">36 / 100 (36%)</td>
                  <td className="py-3 px-4 text-slate-600">Supplemental workbook assigned; parent progress meeting scheduled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. ASSESSMENT SETTINGS & GRADING SCALES TAB                    */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Grading Scale & Assessment Policies</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Greenfield International School scholastic grade boundary definitions and standard GPA metrics.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">Standard 4.0 GPA Grading Scale</h3>
            </div>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Percentage Range</th>
                  <th className="py-3 px-4">GPA Equivalent</th>
                  <th className="py-3 px-4">Academic Description</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {gradingScale.map((b) => (
                  <tr key={b.grade} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-extrabold text-sm text-slate-900">{b.grade}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {b.minPercentage}% – {b.maxPercentage}%
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">{b.gpa.toFixed(1)} / 4.0</td>
                    <td className="py-3 px-4 text-slate-600">{b.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.isPassing ? 'Passing Standard' : 'Failing / Remedial'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS                                                         */}
      {/* ============================================================== */}

      {/* 1. Official Report Card Modal */}
      {reportCardStudent && (
        <ReportCardModal
          student={reportCardStudent}
          exam={currentExam}
          marksList={marks}
          classInfo={currentClass}
          isOpen={showReportCardModal}
          onClose={() => {
            setShowReportCardModal(false);
            setReportCardStudent(null);
          }}
          gradingScale={gradingScale}
        />
      )}

      {/* 2. Moderation Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">Return Marks with Moderation Notes</span>
              <button onClick={() => setShowReturnModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Provide instructions to <strong>{currentSubjectConfig?.assignedTeacherName || 'Teacher'}</strong> detailing what needs correction or re-evaluation before approval.
              </p>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Feedback / Reason for Revision</label>
                <textarea
                  rows={4}
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="e.g. Please verify practical marks for students 4 through 8..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReturnMarks}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold"
                >
                  Return to Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Assignment Submissions Modal */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-sm">{viewingAssignment.title}</h3>
                <span className="text-[11px] text-slate-400">
                  {viewingAssignment.className} · {viewingAssignment.subject} · Due: {viewingAssignment.dueDate}
                </span>
              </div>
              <button onClick={() => setViewingAssignment(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span>Instructions: <strong>{viewingAssignment.description}</strong></span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Max: {viewingAssignment.maxMarks || 50} Marks
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Score (/{viewingAssignment.maxMarks || 50})</th>
                      <th className="py-2.5 px-3">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(viewingAssignment.submissions && viewingAssignment.submissions.length > 0
                      ? viewingAssignment.submissions
                      : classStudents.map((st, i) => ({
                          id: `sub-${st.id}`,
                          assignmentId: viewingAssignment.id,
                          studentId: st.id,
                          studentName: st.name,
                          rollNo: st.rollNo,
                          admissionId: st.admissionId || st.id,
                          status: i % 4 === 0 ? 'Pending' : 'Submitted',
                          marksObtained: i % 4 === 0 ? undefined : Math.min(viewingAssignment.maxMarks || 50, 42 + (i % 8)),
                          feedback: 'Well reasoned proof and clear step-by-step working.'
                        }))
                    ).map((sub: any) => (
                      <tr key={sub.studentId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">#{sub.rollNo}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sub.status === 'Submitted' || sub.status === 'Graded'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                          {sub.marksObtained !== undefined ? sub.marksObtained : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 italic">{sub.feedback || 'Pending review.'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setViewingAssignment(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Create New Assignment Modal */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">Create New Student Assignment</span>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newAssignmentForm.title.trim()) return;

                const matchedClass = classes.find((c) => c.id === newAssignmentForm.classId);
                createAssignment({
                  title: newAssignmentForm.title,
                  classId: newAssignmentForm.classId,
                  className: matchedClass ? matchedClass.name : 'Grade 10A',
                  subject: newAssignmentForm.subject,
                  teacherId: activeTeacherId || 't-1',
                  teacherName: currentTeacher?.name || 'Dr. Vikram Sharma',
                  description: newAssignmentForm.description,
                  dueDate: newAssignmentForm.dueDate,
                  status: 'Published'
                });

                setShowCreateAssignmentModal(false);
                addToast({
                  type: 'success',
                  title: 'Assignment Created',
                  message: `New assignment "${newAssignmentForm.title}" assigned to ${matchedClass?.name || 'class'}.`
                });
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
                  placeholder="e.g. Chapter 4: Calculus Derivatives Exercise"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Class</label>
                  <select
                    value={newAssignmentForm.classId}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, classId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject</label>
                  <select
                    value={newAssignmentForm.subject}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, subject: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={newAssignmentForm.dueDate}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={newAssignmentForm.maxMarks}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, maxMarks: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Instructions</label>
                <textarea
                  rows={3}
                  value={newAssignmentForm.description}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })}
                  placeholder="Outline the problem sets and submission requirements..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-bold shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
