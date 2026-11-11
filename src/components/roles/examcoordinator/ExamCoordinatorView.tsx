import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { ReportCardModal } from '../../examination/ReportCardModal';
import { Student, ClassInfo, Exam } from '../../../types';
import {
  DEFAULT_GRADING_SCALE,
  calculateGradeFromPercentage,
  detectExamScheduleConflicts,
  exportMarksCSV,
  INITIAL_DETAILED_EXAMS,
  ExamSession,
  SubjectAssessmentConfig,
  DetailedExam,
  ExamConflict,
  DetailedMarkEntry
} from '../../../data/examinationData';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Clock,
  FileSpreadsheet,
  MapPin,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  User,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Check,
  X,
  Send,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  Award,
  BookOpen,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const ExamCoordinatorView: React.FC = () => {
  const {
    exams,
    marks,
    classes,
    students,
    teachers,
    examModerationStatus,
    approveMarks,
    publishResults,
    addToast,
    logAuditEvent,
    currentPage
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(currentPage || 'dashboard');

  React.useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);

  // Exam Selection
  const detailedExams: DetailedExam[] = useMemo(() => {
    return INITIAL_DETAILED_EXAMS;
  }, []);

  const [selectedExamId, setSelectedExamId] = useState<string>(detailedExams[0]?.id || 'exam-term1-final');
  const currentExam = useMemo(() => {
    return detailedExams.find((e) => e.id === selectedExamId) || detailedExams[0];
  }, [detailedExams, selectedExamId]);

  // All Sessions across all exams
  const [allSessions, setAllSessions] = useState<ExamSession[]>(() => {
    const list: ExamSession[] = [];
    detailedExams.forEach((e) => {
      if (e.sessions) list.push(...e.sessions);
    });
    return list;
  });

  // Master Subject Configs
  const [allSubjectConfigs, setAllSubjectConfigs] = useState<SubjectAssessmentConfig[]>(() => {
    const list: SubjectAssessmentConfig[] = [];
    detailedExams.forEach((e) => {
      if (e.subjectConfigs) list.push(...e.subjectConfigs);
    });
    return list;
  });

  // Report Card Modal State
  const [selectedStudentForReportCard, setSelectedStudentForReportCard] = useState<Student | null>(null);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);

  // New Exam Definition Modal
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [examDefForm, setExamDefForm] = useState({
    name: '',
    term: 'Term 1',
    academicYearId: 'ay-2026-2027',
    startDate: '2026-11-10',
    endDate: '2026-11-20',
    applicableClasses: ['class-10a', 'class-8a'],
    totalMarks: 100,
    instructions: 'Comprehensive summative evaluation covering syllabus components.'
  });

  // New Session Modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    className: 'Grade 10A',
    classId: 'class-10a',
    subjectName: 'Mathematics',
    subjectId: 'sub-math',
    date: '2026-10-16',
    startTime: '09:00',
    endTime: '12:00',
    room: 'Main Examination Hall',
    invigilatorTeacherId: 't-1',
    invigilatorName: 'Dr. Vikram Sharma'
  });

  // Readiness Audit Running State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditTimestamp, setAuditTimestamp] = useState<string>('Today at 08:30 AM');
  const [auditScores, setAuditScores] = useState({
    timetable: 100,
    hallTickets: 100,
    rooms: 100,
    invigilators: 100,
    papersVault: 100
  });

  // Timetable Filters
  const [timetableClassFilter, setTimetableClassFilter] = useState('all');
  const [timetableDateFilter, setTimetableDateFilter] = useState('all');

  // Conflict Matrix Simulator (allows user to trigger and resolve test conflict)
  const [conflictSimulated, setConflictSimulated] = useState(false);

  // Calculate live conflicts using detectExamScheduleConflicts
  const liveConflicts: ExamConflict[] = useMemo(() => {
    const list: ExamConflict[] = [];
    allSessions.forEach((sess) => {
      const confs = detectExamScheduleConflicts(sess, allSessions);
      confs.forEach((c) => {
        // avoid duplicates by checking sessionId & conflictingSessionId
        if (!list.some((existing) => existing.title === c.title && existing.sessionId === c.sessionId)) {
          list.push(c);
        }
      });
    });

    if (conflictSimulated) {
      list.push({
        type: 'Class',
        severity: 'blocking',
        title: 'Class Double-Booking Conflict (Simulated)',
        message: 'Grade 10A has Science Practical scheduled simultaneously with Advanced Math in Lab 2.',
        sessionId: 'sim-1'
      });
    }

    return list;
  }, [allSessions, conflictSimulated]);

  // Overall KPIs
  const totalScheduledPapers = allSessions.length;
  const completedSessions = allSessions.filter((s) => s.status === 'Completed').length;
  const activeSessionsCount = allSessions.filter((s) => s.status === 'Scheduled').length;
  const totalSubjectMarksCount = marks.length;
  const enteredSubjectMarksCount = marks.filter((m) => m.marksObtained !== null).length;
  const marksSubmissionRate = totalSubjectMarksCount > 0 ? Math.round((enteredSubjectMarksCount / totalSubjectMarksCount) * 100) : 100;

  // Run Readiness Audit
  const handleRunAudit = () => {
    setIsAuditing(true);
    addToast({ type: 'info', title: 'Audit Verification', message: 'Initiating 5-Point Examination Readiness Verification...' });
    setTimeout(() => {
      setIsAuditing(false);
      setAuditTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Just Now');
      setAuditScores({
        timetable: 100,
        hallTickets: 100,
        rooms: 100,
        invigilators: 100,
        papersVault: 100
      });
      addToast({
        type: 'success',
        title: 'Audit Complete',
        message: 'Audit Complete: All 5 examination readiness criteria verified at 100% pass.'
      });
      logAuditEvent({
        action: 'EXECUTE',
        module: 'readiness',
        recordRef: 'readiness-5-point',
        actorRole: 'exam_coordinator',
        actorName: 'Dr. Marcus Brody',
        reason: 'Ran 5-point institutional examination readiness verification. Status: 100% READY.',
        status: 'SUCCESS'
      });
    }, 900);
  };

  // Handle Create Exam Definition
  const handleCreateExamDefinition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examDefForm.name.trim()) return;

    addToast({
      type: 'success',
      title: 'Exam Configured',
      message: `Examination Definition '${examDefForm.name}' configured for ${examDefForm.term}.`
    });

    setShowCreateExamModal(false);
    setExamDefForm({
      name: '',
      term: 'Term 1',
      academicYearId: 'ay-2026-2027',
      startDate: '2026-11-10',
      endDate: '2026-11-20',
      applicableClasses: ['class-10a', 'class-8a'],
      totalMarks: 100,
      instructions: 'Comprehensive summative evaluation covering syllabus components.'
    });
  };

  // Handle Schedule New Session
  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();

    const newSess: ExamSession = {
      id: `sess-${Date.now()}`,
      examId: selectedExamId,
      classId: sessionForm.classId,
      className: sessionForm.className,
      section: 'A',
      subjectId: sessionForm.subjectId,
      subjectName: sessionForm.subjectName,
      date: sessionForm.date,
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      durationMinutes: 180,
      room: sessionForm.room,
      invigilatorTeacherId: sessionForm.invigilatorTeacherId,
      invigilatorName: sessionForm.invigilatorName,
      status: 'Scheduled'
    };

    // Check conflict
    const conflicts = detectExamScheduleConflicts(newSess, allSessions);
    if (conflicts.length > 0) {
      addToast({
        type: 'error',
        title: 'Conflict Detected',
        message: `Conflict Warning: ${conflicts[0].title}. Please adjust room or time.`
      });
    } else {
      addToast({
        type: 'success',
        title: 'Session Scheduled',
        message: `Scheduled ${newSess.subjectName} for ${newSess.className} in ${newSess.room}.`
      });
    }

    setAllSessions((prev) => [newSess, ...prev]);
    setShowScheduleModal(false);
  };

  // Guarded Publication Action
  const handlePublishOfficialResults = () => {
    if (examModerationStatus !== 'Approved' && examModerationStatus !== 'Published') {
      addToast({
        type: 'error',
        title: 'Approval Required',
        message: 'Moderation approval required: Please approve statistical moderation before publishing results.'
      });
      return;
    }

    publishResults();
    addToast({
      type: 'success',
      title: 'Results Published',
      message: 'Official results published! Marks and terminal report cards are now accessible to parents.'
    });
    logAuditEvent({
      action: 'PUBLISH',
      module: 'results',
      recordRef: currentExam.id,
      actorRole: 'exam_coordinator',
      actorName: 'Dr. Marcus Brody',
      reason: 'Authorized official results publication to parent portal mobile app.',
      status: 'SUCCESS'
    });
  };

  // Moderation Approval Action
  const handleApproveModeration = () => {
    approveMarks();
    addToast({
      type: 'success',
      title: 'Moderation Approved',
      message: 'Statistical moderation approved by Academic Examination Board.'
    });
    logAuditEvent({
      action: 'APPROVE',
      module: 'moderation',
      recordRef: currentExam.id,
      actorRole: 'exam_coordinator',
      actorName: 'Dr. Marcus Brody',
      reason: 'Approved statistical marks moderation and score curves for all cohort classes.',
      status: 'SUCCESS'
    });
  };

  // Filtered timetable sessions
  const filteredTimetableSessions = useMemo(() => {
    return allSessions.filter((s) => {
      const matchClass = timetableClassFilter === 'all' || s.classId === timetableClassFilter;
      const matchDate = timetableDateFilter === 'all' || s.date === timetableDateFilter;
      return matchClass && matchDate;
    });
  }, [allSessions, timetableClassFilter, timetableDateFilter]);

  const uniqueDates = useMemo(() => {
    const set = new Set<string>();
    allSessions.forEach((s) => set.add(s.date));
    return Array.from(set).sort();
  }, [allSessions]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar Navigation */}
      <RoleSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAction={() => {
          setActiveTab('sessions');
          setShowScheduleModal(true);
        }}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* ============================================================== */}
        {/* 1. DASHBOARD                                                   */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Academic Examination Board
                  </span>
                  <span className="text-xs text-slate-400">· Directorate of Academic Assessment</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Examination Command Center
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Term schedules, conflict verification, invigilation rosters, moderated marks grading, and report card publishing.
                </p>
              </div>

              {/* Fast Action Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('sessions');
                    setShowScheduleModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-90 rounded-xl shadow-xs transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Exam Paper</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('readiness_audit');
                    handleRunAudit();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-slate-600" />
                  <span>Run Readiness Audit</span>
                </button>
                <button
                  onClick={() => setActiveTab('moderation')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Moderate Marks</span>
                </button>
                <button
                  onClick={() => setActiveTab('publication')}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Guarded Publication</span>
                </button>
              </div>
            </div>

            {/* 6 Key Executive KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Active Sessions</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{activeSessionsCount}</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Running</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Out of {totalScheduledPapers} total papers</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Completed Papers</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-emerald-600">{completedSessions}</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Concluded</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Invigilation verified</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Timetable Conflicts</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold font-mono ${liveConflicts.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {liveConflicts.length}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${liveConflicts.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {liveConflicts.length > 0 ? 'Action Req.' : 'Validated'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">Class & room clash audit</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Marks Entry Progress</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-mono text-slate-900">{marksSubmissionRate}%</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">All Faculty</span>
                </div>
                <span className="text-[10px] text-slate-400 block">{enteredSubjectMarksCount} of {totalSubjectMarksCount} marks</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Moderation Status</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {examModerationStatus === 'Published' ? 'Approved' : examModerationStatus}
                  </span>
                  <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded">Board</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Pass curve review</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">Parent Publication</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {examModerationStatus === 'Published' ? 'Published' : 'Locked'}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${examModerationStatus === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {examModerationStatus === 'Published' ? 'Live' : 'Guarded'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">Mobile portal status</span>
              </div>
            </div>

            {/* Timetable Health Alert & Conflict Resolution Panel */}
            {liveConflicts.length > 0 ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start justify-between gap-4 text-rose-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700">Timetable Conflict Detected</h4>
                    <p className="text-xs text-rose-800 mt-0.5">{liveConflicts[0].message}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('conflict_detection')}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shrink-0 hover:bg-rose-700 transition-colors"
                >
                  Resolve In Matrix
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4 text-emerald-900">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium">
                    Automated Timetable Clash Engine: <strong>0 Conflicts Detected</strong> across all cohorts, examination rooms, and faculty invigilators.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('conflict_detection')}
                  className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
                >
                  Inspect Conflict Matrix
                </button>
              </div>
            )}

            {/* Split Grid: Master Examination Definitions & Upcoming Sessions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Examinations */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Master Examination Cycles</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('setup')}
                    className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    <span>Manage Definitions</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-3 text-xs">
                  {detailedExams.map((exam) => (
                    <div key={exam.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{exam.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                            {exam.term}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Window: <span className="font-mono text-slate-800">{exam.startDate} – {exam.endDate}</span>
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Cohorts: {exam.applicableClassIds?.join(', ') || 'All High School'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          exam.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {exam.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today / Upcoming Examination Papers */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Upcoming Exam Papers</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    <span>Full Timetable</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-3 text-xs">
                  {allSessions.slice(0, 4).map((sess) => (
                    <div key={sess.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{sess.subjectName}</span>
                          <span className="text-[10px] text-slate-400">({sess.className})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Room: <strong className="text-slate-700">{sess.room}</strong> · Invigilator: {sess.invigilatorName}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {sess.date} · {sess.startTime} - {sess.endTime} ({sess.durationMinutes}m)
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          sess.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ACADEMIC MASTER EXAMINATION CALENDAR                        */}
        {/* ============================================================== */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Master Examination Calendar</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Institutional examination windows, practical assessment phases, moderation periods, and publication milestones.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold shadow-xs">
                  Session 2026-2027
                </span>
              </div>
            </div>

            {/* Academic Milestones Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-slate-900">Term 1 Assessment Operational Schedule</h3>

              <div className="relative border-l-2 border-theme-primary/30 pl-6 ml-3 space-y-6 text-xs">
                {/* Milestone 1 */}
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -left-[31px] top-1 border-2 border-white ring-4 ring-emerald-50" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">Study & Revision Week</span>
                    <span className="font-mono text-slate-500 font-semibold">Oct 05, 2026 – Oct 10, 2026</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    No new syllabus introduction. Dedicated classroom mock exams and laboratory test runs.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    Completed
                  </span>
                </div>

                {/* Milestone 2 */}
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-theme-primary absolute -left-[31px] top-1 border-2 border-white ring-4 ring-purple-50" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">Term 1 Theory Board Papers</span>
                    <span className="font-mono text-slate-500 font-semibold">Oct 12, 2026 – Oct 24, 2026</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Summative written board assessments across Grade 10A, Grade 8A, and Grade 5B in Main Examination Hall.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-theme-light text-theme-primary text-[10px] font-bold">
                    In Progress / Active
                  </span>
                </div>

                {/* Milestone 3 */}
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-500 absolute -left-[31px] top-1 border-2 border-white ring-4 ring-blue-50" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">Laboratory Practicals & Viva-Voce</span>
                    <span className="font-mono text-slate-500 font-semibold">Oct 26, 2026 – Oct 28, 2026</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Science Laboratory titration, optics benches, and computer science practical assessments.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                    Scheduled
                  </span>
                </div>

                {/* Milestone 4 */}
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500 absolute -left-[31px] top-1 border-2 border-white ring-4 ring-amber-50" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">Academic Board Moderation & Scrutiny</span>
                    <span className="font-mono text-slate-500 font-semibold">Oct 29, 2026 – Nov 02, 2026</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Marks verification, statistical distribution analysis, and discrepancy return resolution.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">
                    Pending
                  </span>
                </div>

                {/* Milestone 5 */}
                <div className="relative">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-400 absolute -left-[31px] top-1 border-2 border-white ring-4 ring-slate-50" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">Official Parent Results Publication</span>
                    <span className="font-mono text-slate-500 font-semibold">Nov 05, 2026</span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Guarded release to Parent Mobile App and dispatch of physical terminal report cards.
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    Target Milestone
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. EXAMINATION SETUP & DEFINITIONS                             */}
        {/* ============================================================== */}
        {activeTab === 'setup' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination Definitions Setup</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define summative cycles, academic terms, date windows, and participating grade cohorts.
                </p>
              </div>

              <button
                onClick={() => setShowCreateExamModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Examination Definition</span>
              </button>
            </div>

            {/* Definitions Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Exam Definition Name</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4">Academic Year</th>
                    <th className="py-3 px-4">Date Window</th>
                    <th className="py-3 px-4">Applicable Cohorts</th>
                    <th className="py-3 px-4">Total Marks</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detailedExams.map((def) => (
                    <tr key={def.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{def.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{def.term}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{def.academicYearId}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        {def.startDate} to {def.endDate}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {def.applicableClassIds?.join(', ') || 'High School'}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{def.totalMarks}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            def.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {def.status}
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
        {/* 4. EXAM TYPES & SESSIONS                                       */}
        {/* ============================================================== */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exam Types & Assessment Sessions</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage individual paper papers across terminal board exams, laboratory practicals, and unit tests.
                </p>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Paper Session</span>
              </button>
            </div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSessions.map((sess) => (
                <div key={sess.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded uppercase">
                        {sess.className}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{sess.subjectName}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sess.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {sess.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="font-mono font-medium text-slate-800">{sess.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time:</span>
                      <span className="font-mono font-medium text-slate-800">
                        {sess.startTime} – {sess.endTime} ({sess.durationMinutes}m)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Venue / Room:</span>
                      <span className="font-semibold text-slate-800">{sess.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Invigilator:</span>
                      <span className="font-medium text-slate-800 truncate ml-2">{sess.invigilatorName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. EXAM TIMETABLE & SCHEDULE MATRIX                            */}
        {/* ============================================================== */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination Timetable Matrix</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete schedule matrix by class, subject, venue, and designated faculty invigilator.
                </p>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Timetable Entry</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Cohort Class:</span>
                <select
                  value={timetableClassFilter}
                  onChange={(e) => setTimetableClassFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Classes</option>
                  <option value="class-10a">Grade 10A</option>
                  <option value="class-8a">Grade 8A</option>
                  <option value="class-5b">Grade 5B</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Exam Date:</span>
                <select
                  value={timetableDateFilter}
                  onChange={(e) => setTimetableDateFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Dates</option>
                  {uniqueDates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Timetable Matrix Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Exam Date</th>
                      <th className="py-3 px-4">Time Slot</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Subject Paper</th>
                      <th className="py-3 px-4">Allocated Room</th>
                      <th className="py-3 px-4">Invigilator Faculty</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTimetableSessions.map((sess) => (
                      <tr key={sess.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{sess.date}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {sess.startTime} – {sess.endTime}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{sess.className}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{sess.subjectName}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{sess.room}</td>
                        <td className="py-3 px-4 text-slate-700">{sess.invigilatorName}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{sess.durationMinutes} mins</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sess.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {sess.status}
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
        {/* 6. CLASS & SUBJECT ASSESSMENT MAPPING                          */}
        {/* ============================================================== */}
        {activeTab === 'subject_mapping' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assessment Structure & Component Breakdown</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Written theory, laboratory practical, and internal continuous assessment weightages.
                </p>
              </div>
            </div>

            {/* Assessment Component Breakdown Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Cohort</th>
                      <th className="py-3 px-3 text-center">Written (Theory)</th>
                      <th className="py-3 px-3 text-center">Practical (Lab)</th>
                      <th className="py-3 px-3 text-center">Internal / Projects</th>
                      <th className="py-3 px-3 text-center">Total Max</th>
                      <th className="py-3 px-3 text-center">Pass Threshold</th>
                      <th className="py-3 px-4">Assigned Evaluator Teacher</th>
                      <th className="py-3 px-4">Faculty Submission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allSubjectConfigs.map((cfg) => (
                      <tr key={cfg.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{cfg.subjectName}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{cfg.className}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{cfg.maxWrittenMarks}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{cfg.maxPracticalMarks || '—'}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{cfg.maxInternalMarks || '—'}</td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-emerald-800 bg-emerald-50/50">
                          {cfg.totalMaxMarks}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                          {cfg.passingMarks} ({cfg.passingPercentage}%)
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{cfg.assignedTeacherName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              cfg.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : cfg.status === 'Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cfg.status}
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
        {/* 7. ROOM & VENUE ALLOCATION                                     */}
        {/* ============================================================== */}
        {activeTab === 'room_allocation' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Examination Venues & Room Allocation</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage campus seating capacity, venue allocations, and spacing density across test centers.
                </p>
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Main Examination Hall',
                  building: 'Central Auditorium Block',
                  capacity: 250,
                  allocated: 120,
                  type: 'Summative Written Board Papers',
                  status: 'Optimal'
                },
                {
                  name: 'Science Lab 2',
                  building: 'Science & Lab Wing, Level 1',
                  capacity: 35,
                  allocated: 32,
                  type: 'Chemistry & Physics Practicals',
                  status: 'Optimal'
                },
                {
                  name: 'Computer Lab 1',
                  building: 'Technology Block B, Level 3',
                  capacity: 40,
                  allocated: 32,
                  type: 'Robotics & Computer Science Tests',
                  status: 'Optimal'
                },
                {
                  name: 'Room 108',
                  building: 'Academic Block A, Ground Floor',
                  capacity: 35,
                  allocated: 26,
                  type: 'Classroom Unit Assessment',
                  status: 'Optimal'
                }
              ].map((rm, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{rm.building}</span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">{rm.name}</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {rm.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Total Capacity:</span>
                      <span className="font-mono font-bold text-slate-800">{rm.capacity} Seats</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Allocated Students:</span>
                      <span className="font-mono font-bold text-emerald-600">{rm.allocated} Students</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(rm.allocated / rm.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">{rm.type}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. TIMETABLE CONFLICT DETECTION MATRIX                         */}
        {/* ============================================================== */}
        {activeTab === 'conflict_detection' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Automated Conflict Detection Matrix</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated collision verification engine: checks class double-booking, room clash, and invigilator overlap.
                </p>
              </div>

              {/* Conflict Simulator Tool */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConflictSimulated((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    conflictSimulated
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {conflictSimulated ? 'Clear Simulated Clash' : 'Simulate Conflict Test'}
                </button>
              </div>
            </div>

            {/* Conflict Status Display */}
            {liveConflicts.length === 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-900">Zero Schedule Conflicts Detected</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  All {allSessions.length} examination sessions have been verified against cohort allocations, invigilator teacher hours, and physical venue availability.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {liveConflicts.map((c, idx) => (
                  <div key={idx} className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-rose-700">{c.title}</span>
                        <span className="text-[10px] font-mono font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded">
                          BLOCKING ISSUE
                        </span>
                      </div>
                      <p className="text-xs text-rose-800 mt-1">{c.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Conflict Detection Rules Explained */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs">
              <h4 className="font-bold text-slate-900">Automated Audit Rules Enforced by System Engine:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">1. Class Double-Booking</span>
                  <p className="text-[11px]">
                    Ensures a student cohort cannot be scheduled for two papers simultaneously on the same date/time.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">2. Invigilator Overlap</span>
                  <p className="text-[11px]">
                    Guarantees a teacher cannot be designated to invigilate in two separate rooms simultaneously.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">3. Room Double-Booking</span>
                  <p className="text-[11px]">
                    Restricts dedicated rooms (labs, classrooms) from accommodating multiple subjects at the same time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 9. 5-POINT EXAMINATION READINESS AUDIT                         */}
        {/* ============================================================== */}
        {activeTab === 'readiness_audit' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">5-Point Examination Readiness Audit</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated verification checklist covering timetable scheduling, hall tickets, venues, invigilation, and vault seals.
                </p>
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing}
                className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'Verifying...' : 'Re-Run Institutional Audit'}</span>
              </button>
            </div>

            {/* Audit Status Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    Institutional Readiness Score
                  </span>
                  <h3 className="text-2xl font-black mt-1">100% READY FOR EXAMINATION</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl font-mono border border-emerald-500/30">
                  5/5
                </div>
              </div>

              <div className="text-xs text-slate-300">
                Audit Last Executed: <strong className="text-white">{auditTimestamp}</strong> by Dr. Marcus Brody (Exam Directorate)
              </div>
            </div>

            {/* 5-Point Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
              {[
                {
                  num: '01',
                  title: 'Timetable Published',
                  detail: 'All papers scheduled with no clashes',
                  status: 'Verified Ready',
                  icon: <Clock className="w-5 h-5 text-emerald-600" />
                },
                {
                  num: '02',
                  title: 'Hall Tickets Issued',
                  detail: 'Student barcode manifests generated',
                  status: 'Verified Ready',
                  icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                },
                {
                  num: '03',
                  title: 'Rooms Allocated',
                  detail: 'Main Hall, Lab 1 & 2 space cleared',
                  status: 'Verified Ready',
                  icon: <MapPin className="w-5 h-5 text-emerald-600" />
                },
                {
                  num: '04',
                  title: 'Invigilators On Roster',
                  detail: 'Faculty designated & briefing done',
                  status: 'Verified Ready',
                  icon: <User className="w-5 h-5 text-emerald-600" />
                },
                {
                  num: '05',
                  title: 'Paper Packets Vault-Sealed',
                  detail: 'Secure strongroom lock verified',
                  status: 'Verified Ready',
                  icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
                }
              ].map((pt, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-slate-400 text-xs">POINT {pt.num}</span>
                      {pt.icon}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{pt.title}</h4>
                    <p className="text-slate-500 text-[11px] mt-1">{pt.detail}</p>
                  </div>
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold self-start mt-2">
                    {pt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 10. READ-ONLY MARKS ENTRY TRACKING                             */}
        {/* ============================================================== */}
        {activeTab === 'marks_entry_status' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Marks Entry Status</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time tracking of marks submission progress across subject evaluators and department teachers.
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Coordinator Oversight (Read-Only)</span>
              </div>
            </div>

            {/* Role Boundary Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-blue-900 text-xs">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Academic Integrity Boundary:</span>
                Subject faculty members evaluate student scripts and enter assessment component scores. The Exam Coordinator monitors submission completion, conducts statistical moderation, and authorizes publishing, but does not enter or modify raw marks directly.
              </div>
            </div>

            {/* Marks Status Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Subject Paper</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Subject Teacher / Evaluator</th>
                      <th className="py-3 px-4">Students Enrolled</th>
                      <th className="py-3 px-4">Marks Entered</th>
                      <th className="py-3 px-4">Completion %</th>
                      <th className="py-3 px-4">Submission Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allSubjectConfigs.map((sc) => (
                      <tr key={sc.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{sc.subjectName}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{sc.className}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{sc.assignedTeacherName}</td>
                        <td className="py-3 px-4 font-mono text-slate-700">32</td>
                        <td className="py-3 px-4 font-mono text-slate-700">32 / 32</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                            </div>
                            <span className="font-mono font-bold text-emerald-600">100%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              sc.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {sc.status === 'Published' ? 'Approved & Published' : 'Submitted for Moderation'}
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
        {/* 11. RESULTS REVIEW & STATISTICAL MODERATION                    */}
        {/* ============================================================== */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Results Review & Statistical Moderation</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Academic board review of class score distributions, pass rates, and grade curve approvals.
                </p>
              </div>

              <button
                onClick={handleApproveModeration}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Moderation</span>
              </button>
            </div>

            {/* Statistical Curve Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-medium text-slate-500">Cohort Average Score</span>
                <span className="text-2xl font-bold font-mono text-slate-900 block">84.6%</span>
                <span className="text-[11px] text-emerald-600 font-medium">Within standard +2.1% bell curve</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-medium text-slate-500">Highest Score Achieved</span>
                <span className="text-2xl font-bold font-mono text-theme-primary block">98 / 100</span>
                <span className="text-[11px] text-slate-400">Rohan Mehta (Grade 10A Math)</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-medium text-slate-500">Lowest Score</span>
                <span className="text-2xl font-bold font-mono text-slate-700 block">62 / 100</span>
                <span className="text-[11px] text-slate-400">All students clear 40% passing bar</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs font-medium text-slate-500">Overall Pass Rate</span>
                <span className="text-2xl font-bold font-mono text-emerald-600 block">100%</span>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">0 Remedials</span>
              </div>
            </div>

            {/* Moderated Score Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Submitted Cohort Marks Review (Sample)</h3>
                <span className="text-xs text-slate-400">Class: Grade 10A · Mathematics Paper</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Roll</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-3 text-center">Written (80)</th>
                      <th className="py-3 px-3 text-center">Internal (20)</th>
                      <th className="py-3 px-3 text-center">Marks (100)</th>
                      <th className="py-3 px-3 text-center">%</th>
                      <th className="py-3 px-3 text-center">Grade</th>
                      <th className="py-3 px-4">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { roll: 1, name: 'Rohan Mehta', written: 74, internal: 18, total: 92, pct: 92, grade: 'A+', remarks: 'Outstanding analytical proofs' },
                      { roll: 2, name: 'Diya Kapoor', written: 70, internal: 18, total: 88, pct: 88, grade: 'A', remarks: 'Consistent theorem mastery' },
                      { roll: 3, name: 'Kabir Verma', written: 48, internal: 14, total: 62, pct: 62, grade: 'C', remarks: 'Good grasp; quadratic practice needed' }
                    ].map((row) => (
                      <tr key={row.roll} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.roll}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">{row.written}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-700">{row.internal}</td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-emerald-800 bg-emerald-50/50">{row.total}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{row.pct}%</td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-theme-primary">{row.grade}</td>
                        <td className="py-3 px-4 text-slate-600">{row.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 12. GUARDED RESULTS PUBLICATION WORKFLOW                       */}
        {/* ============================================================== */}
        {activeTab === 'publication' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Guarded Results Publication Workflow</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-check release gate for official examination results to Parent Mobile App.
                </p>
              </div>

              <button
                onClick={handlePublishOfficialResults}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-theme-primary hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-xs transition-opacity"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Publish Official Results</span>
              </button>
            </div>

            {/* Publication Gate Status Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${examModerationStatus === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <h3 className="text-sm font-bold text-slate-900">
                    Publication Status: {examModerationStatus === 'Published' ? 'Published to Parent Mobile App' : 'Held in Draft / Guarded'}
                  </h3>
                </div>
                <span className="font-mono text-xs text-slate-400">Security Gate: 4 of 4 Passed</span>
              </div>

              {/* 4-Step Prerequisite Checklist */}
              <div className="space-y-3 text-xs">
                {[
                  {
                    title: '1. 100% Subject Marks Submitted by Evaluator Faculty',
                    desc: 'All 4 enrolled cohorts have completed marks entered with no missing student records.',
                    pass: true
                  },
                  {
                    title: '2. Academic Board Statistical Moderation Approved',
                    desc: 'Dr. Marcus Brody approved cohort grade boundaries and statistical curves.',
                    pass: true
                  },
                  {
                    title: '3. Principal & Vice Principal Official Signoff',
                    desc: 'Executive institutional clearance recorded in SCHLAR audit ledger.',
                    pass: true
                  },
                  {
                    title: '4. Parent Privacy Protection Lock Active',
                    desc: 'Parent Mobile App access is strictly restricted until this guarded publish button is triggered.',
                    pass: true
                  }
                ].map((chk, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">{chk.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">{chk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 13. REPORT CARDS & EXAMINATION REPORTS                         */}
        {/* ============================================================== */}
        {activeTab === 'report_cards' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report Cards & Examination Analytics</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate terminal student report cards with standard A+ to F grade boundaries, GPA scale, and print manifests.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const mathMarks = marks.filter((m) => m.subject === 'Mathematics') as unknown as DetailedMarkEntry[];
                    exportMarksCSV(
                      currentExam,
                      'Mathematics',
                      classes[0] || ({ name: 'Grade 10A' } as any),
                      mathMarks
                    );
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Marks CSV</span>
                </button>
              </div>
            </div>

            {/* Students List for Report Cards */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Student Terminal Report Cards Manifest</h3>
                <span className="text-xs text-slate-400">Class: Grade 10A · Term 1 Examination</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Roll</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Admission ID</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Term Total</th>
                      <th className="py-3 px-4">Aggregate %</th>
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.slice(0, 5).map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{std.rollNo || 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{std.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{std.admissionId}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">
                          {classes.find((c) => c.id === std.classId)?.name || std.classId}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">180 / 200</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">90.0%</td>
                        <td className="py-3 px-4 font-mono font-bold text-theme-primary">A+</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedStudentForReportCard(std);
                              setIsReportCardOpen(true);
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                          >
                            View Report Card
                          </button>
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
        {/* 14. MY PROFILE                                                 */}
        {/* ============================================================== */}
        {activeTab === 'profile' && (
          <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* ============================================================== */}
      {/* MODALS                                                         */}
      {/* ============================================================== */}

      {/* 1. REPORT CARD MODAL */}
      {isReportCardOpen && selectedStudentForReportCard && (
        <ReportCardModal
          student={selectedStudentForReportCard}
          exam={currentExam}
          marksList={marks}
          classInfo={classes.find((c) => c.id === selectedStudentForReportCard.classId) || classes[0]}
          isOpen={isReportCardOpen}
          onClose={() => setIsReportCardOpen(false)}
        />
      )}

      {/* 2. SCHEDULE PAPER MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Schedule Examination Paper Session</h3>
              <p className="text-xs text-slate-500 mt-0.5">Assign subject, timing, venue, and invigilation teacher.</p>
            </div>

            <form onSubmit={handleScheduleSession} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Class Cohort *</label>
                  <select
                    value={sessionForm.classId}
                    onChange={(e) => {
                      const c = classes.find((cl) => cl.id === e.target.value);
                      setSessionForm({
                        ...sessionForm,
                        classId: e.target.value,
                        className: c?.name || 'Grade 10A'
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="class-10a">Grade 10A</option>
                    <option value="class-8a">Grade 8A</option>
                    <option value="class-5b">Grade 5B</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject Paper *</label>
                  <input
                    type="text"
                    required
                    value={sessionForm.subjectName}
                    onChange={(e) => setSessionForm({ ...sessionForm, subjectName: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={sessionForm.startTime}
                    onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time *</label>
                  <input
                    type="time"
                    required
                    value={sessionForm.endTime}
                    onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allocated Venue / Room *</label>
                  <select
                    value={sessionForm.room}
                    onChange={(e) => setSessionForm({ ...sessionForm, room: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Main Examination Hall">Main Examination Hall</option>
                    <option value="Science Lab 2">Science Lab 2</option>
                    <option value="Computer Lab 1">Computer Lab 1</option>
                    <option value="Room 108">Room 108</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Invigilator Faculty *</label>
                  <select
                    value={sessionForm.invigilatorTeacherId}
                    onChange={(e) => {
                      const t = teachers.find((tch) => tch.id === e.target.value);
                      setSessionForm({
                        ...sessionForm,
                        invigilatorTeacherId: e.target.value,
                        invigilatorName: t?.name || 'Dr. Vikram Sharma'
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    {teachers.map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} ({tch.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Schedule Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CREATE EXAM DEFINITION MODAL */}
      {showCreateExamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowCreateExamModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Define New Examination Cycle</h3>
              <p className="text-xs text-slate-500 mt-0.5">Configure term cycle, date window, and applicable cohorts.</p>
            </div>

            <form onSubmit={handleCreateExamDefinition} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Examination Name *</label>
                <input
                  type="text"
                  required
                  value={examDefForm.name}
                  onChange={(e) => setExamDefForm({ ...examDefForm, name: e.target.value })}
                  placeholder="e.g. Term 2 Pre-Board Assessments"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Term *</label>
                  <select
                    value={examDefForm.term}
                    onChange={(e) => setExamDefForm({ ...examDefForm, term: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Annual">Annual Board Final</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Maximum Marks</label>
                  <input
                    type="number"
                    value={examDefForm.totalMarks}
                    onChange={(e) => setExamDefForm({ ...examDefForm, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Window Start Date *</label>
                  <input
                    type="date"
                    required
                    value={examDefForm.startDate}
                    onChange={(e) => setExamDefForm({ ...examDefForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Window End Date *</label>
                  <input
                    type="date"
                    required
                    value={examDefForm.endDate}
                    onChange={(e) => setExamDefForm({ ...examDefForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Examination Instructions</label>
                <textarea
                  rows={2}
                  value={examDefForm.instructions}
                  onChange={(e) => setExamDefForm({ ...examDefForm, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateExamModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Save Definition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
