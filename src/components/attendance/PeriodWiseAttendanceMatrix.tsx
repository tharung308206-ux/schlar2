import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  AttendanceRecord,
  StudentAttendanceStatus,
  StudentAttendanceEntry,
  TimetableEntry
} from '../../types';
import { StudentProfileModal } from '../common/StudentProfileModal';
import { AttendanceCorrectionModal } from './AttendanceCorrectionModal';
import {
  Calendar,
  Clock,
  Layers,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock3,
  HeartHandshake,
  Save,
  Send,
  Sparkles,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Unlock,
  Check,
  X,
  UserCheck,
  Info,
  ChevronRight,
  Eye,
  FileCheck2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface PeriodWiseAttendanceMatrixProps {
  initialClassId?: string;
  initialDate?: string;
  initialTeacherId?: string;
  onOpenSingleRegister?: (classId: string, periodStr: string, date: string) => void;
}

export const PeriodWiseAttendanceMatrix: React.FC<PeriodWiseAttendanceMatrixProps> = ({
  initialClassId = 'class-10a',
  initialDate,
  initialTeacherId = 't-1',
  onOpenSingleRegister
}) => {
  const {
    classes,
    students,
    teachers,
    timetableEntries,
    activeAcademicYearId,
    academicYears,
    attendance,
    recordAttendance,
    currentRole,
    userProfiles,
    addToast
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // Selection states
  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || todayStr);
  const [activeTeacherId, setActiveTeacherId] = useState<string>(initialTeacherId);
  const [selectedPeriodForAbsentees, setSelectedPeriodForAbsentees] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [highlightedStudentId, setHighlightedStudentId] = useState<string | null>(null);

  // Modals & Dialogs
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [correctionTargetRecord, setCorrectionTargetRecord] = useState<AttendanceRecord | null>(null);

  // Mark all present confirmation dialog
  const [showMarkAllConfirm, setShowMarkAllConfirm] = useState<{
    open: boolean;
    periodKey: string;
    periodName: string;
    subjectName: string;
    existingAbsentCount: number;
  }>({
    open: false,
    periodKey: '',
    periodName: '',
    subjectName: '',
    existingAbsentCount: 0
  });

  // Submission Review Dialog
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    periodKey: string;
    periodName: string;
    subjectName: string;
    teacherName: string;
    timetableEntry?: TimetableEntry;
  }>({
    open: false,
    periodKey: '',
    periodName: '',
    subjectName: '',
    teacherName: ''
  });

  // Local draft state for the matrix:
  // Key format: `${selectedClassId}_${selectedDate}_${periodKey}` -> Record<studentId, StudentAttendanceEntry>
  const [matrixDrafts, setMatrixDrafts] = useState<Record<string, Record<string, StudentAttendanceEntry>>>({});

  // Reference map for scrolling to student rows
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Active class object
  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0];
  }, [classes, selectedClassId]);

  // Active teacher object
  const activeTeacher = useMemo(() => {
    return teachers.find((t) => t.id === activeTeacherId);
  }, [teachers, activeTeacherId]);

  // Students in selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Selected date's day of week
  const selectedDayName = useMemo(() => {
    try {
      const d = new Date(selectedDate + 'T12:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'long' });
    } catch {
      return 'Monday';
    }
  }, [selectedDate]);

  // Timetable periods for this class on this day
  const scheduledPeriods = useMemo(() => {
    // First try exact day
    const entries = timetableEntries.filter(
      (e) => e.classId === selectedClassId && e.dayOfWeek === selectedDayName
    );

    if (entries.length > 0) {
      return [...entries].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    // Fallback: If chosen date has no entries (e.g. weekend or unpopulated day), show Monday schedule
    const mondayEntries = timetableEntries.filter(
      (e) => e.classId === selectedClassId && e.dayOfWeek === 'Monday'
    );
    if (mondayEntries.length > 0) {
      return [...mondayEntries].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    // Default fallback to any entries for this class
    const anyEntries = timetableEntries.filter((e) => e.classId === selectedClassId);
    if (anyEntries.length > 0) {
      const uniquePeriodNames = new Set<string>();
      return anyEntries.filter((e) => {
        if (uniquePeriodNames.has(e.periodName)) return false;
        uniquePeriodNames.add(e.periodName);
        return true;
      }).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    // Minimal synthetic periods if no timetable exists
    return [
      {
        id: `tt-${selectedClassId}-p1`,
        academicYearId: activeAcademicYearId,
        classId: selectedClassId,
        section: activeClass.section || 'A',
        dayOfWeek: 'Monday' as const,
        periodId: 'p-1',
        periodName: 'Period 1',
        startTime: '08:30',
        endTime: '09:15',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        teacherId: 't-1',
        teacherName: 'Dr. Vikram Sharma',
        room: activeClass.room || 'Room 301',
        status: 'Published' as const
      },
      {
        id: `tt-${selectedClassId}-p2`,
        academicYearId: activeAcademicYearId,
        classId: selectedClassId,
        section: activeClass.section || 'A',
        dayOfWeek: 'Monday' as const,
        periodId: 'p-2',
        periodName: 'Period 2',
        startTime: '09:20',
        endTime: '10:05',
        subjectId: 'sub-sci',
        subjectName: 'Science',
        teacherId: 't-2',
        teacherName: 'Ms. Sunita Rao',
        room: 'Science Lab',
        status: 'Published' as const
      },
      {
        id: `tt-${selectedClassId}-p3`,
        academicYearId: activeAcademicYearId,
        classId: selectedClassId,
        section: activeClass.section || 'A',
        dayOfWeek: 'Monday' as const,
        periodId: 'p-3',
        periodName: 'Period 3',
        startTime: '10:25',
        endTime: '11:10',
        subjectId: 'sub-eng',
        subjectName: 'English Literature',
        teacherId: 't-6',
        teacherName: 'Ms. Priya Sen',
        room: activeClass.room || 'Room 301',
        status: 'Published' as const
      },
      {
        id: `tt-${selectedClassId}-p4`,
        academicYearId: activeAcademicYearId,
        classId: selectedClassId,
        section: activeClass.section || 'A',
        dayOfWeek: 'Monday' as const,
        periodId: 'p-4',
        periodName: 'Period 4',
        startTime: '11:15',
        endTime: '12:00',
        subjectId: 'sub-cs',
        subjectName: 'Computer Science & AI',
        teacherId: 't-3',
        teacherName: 'Mr. Rajesh Nair',
        room: 'CS Lab 1',
        status: 'Published' as const
      }
    ];
  }, [timetableEntries, selectedClassId, selectedDayName, activeClass, activeAcademicYearId]);

  // Helper to format standard period key
  const getPeriodKey = (entry: TimetableEntry) => {
    return `${entry.periodName} (${entry.startTime} - ${entry.endTime})`;
  };

  // Find attendance record for a specific period
  const getAttendanceRecordForPeriod = (entry: TimetableEntry): AttendanceRecord | undefined => {
    const fullKey = getPeriodKey(entry);
    return attendance.find((a) => {
      if (a.classId !== selectedClassId || a.date !== selectedDate) return false;
      return (
        a.period === fullKey ||
        a.period === entry.periodName ||
        (a.subjectId && a.subjectId === entry.subjectId)
      );
    });
  };

  // Initialize drafts from existing attendance records or default to "Not Marked"
  useEffect(() => {
    const nextMatrixDrafts: Record<string, Record<string, StudentAttendanceEntry>> = {};

    scheduledPeriods.forEach((periodEntry) => {
      const periodKey = getPeriodKey(periodEntry);
      const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;
      const existing = getAttendanceRecordForPeriod(periodEntry);

      const entriesMap: Record<string, StudentAttendanceEntry> = {};

      if (existing && existing.records) {
        existing.records.forEach((r) => {
          entriesMap[r.studentId] = { ...r };
        });
      }

      // Ensure every enrolled student has an entry in this period draft
      classStudents.forEach((student) => {
        if (!entriesMap[student.id]) {
          entriesMap[student.id] = {
            studentId: student.id,
            studentName: student.name,
            status: 'Not Marked'
          };
        }
      });

      nextMatrixDrafts[matrixKey] = entriesMap;
    });

    setMatrixDrafts(nextMatrixDrafts);
  }, [selectedClassId, selectedDate, scheduledPeriods, classStudents, attendance]);

  // Permission Check: Teacher ID + Subject ID + Class ID + Section ID + Timetable Period ID + Applicable Date
  const checkPeriodPermission = (entry: TimetableEntry) => {
    // School Administrators and Academic Coordinators have supervisory authority across all lessons
    if (currentRole === 'principal' || currentRole === 'vice_principal') {
      return {
        authorized: true,
        reason: 'Supervisory Administrative Clearance'
      };
    }

    // Teacher match check: Direct timetable entry teacher match
    if (entry.teacherId === activeTeacherId) {
      return {
        authorized: true,
        reason: `Assigned Teacher: ${entry.teacherName} (${entry.subjectName})`
      };
    }

    // Class Teacher / Homeroom Mentor Authority: Class mentors possess supervisory roll-call authority for their class
    if (
      activeClass &&
      (activeClass.classTeacherId === activeTeacherId ||
        activeTeacher?.classTeacherOf === activeClass.id ||
        activeTeacher?.classTeacherOf === activeClass.name)
    ) {
      return {
        authorized: true,
        reason: `Class Mentor Authority: ${activeTeacher?.name || 'Class Teacher'} (${activeClass.name})`
      };
    }

    // Faculty Subject/Class Assignment check: Teacher teaches this class or subject
    if (activeTeacher) {
      const teachesThisClass = (activeTeacher.classes || []).some(
        (cls) => cls === activeClass?.name || cls === activeClass?.id
      );
      const teachesThisSubject = (activeTeacher.subjects || []).some(
        (sub) => sub.toLowerCase() === entry.subjectName.toLowerCase()
      );
      if (teachesThisClass && teachesThisSubject) {
        return {
          authorized: true,
          reason: `Assigned Subject Faculty: ${activeTeacher.name} (${entry.subjectName})`
        };
      }
    }

    return {
      authorized: false,
      reason: `Taught by ${entry.teacherName} — ${entry.subjectName}. Only the assigned faculty member or Class Mentor may modify this period.`
    };
  };

  // Get current student attendance entry in a given period
  const getStudentPeriodEntry = (studentId: string, entry: TimetableEntry): StudentAttendanceEntry => {
    const periodKey = getPeriodKey(entry);
    const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;
    const periodDraft = matrixDrafts[matrixKey];

    if (periodDraft && periodDraft[studentId]) {
      return periodDraft[studentId];
    }

    return {
      studentId,
      studentName: classStudents.find((s) => s.id === studentId)?.name || 'Student',
      status: 'Not Marked'
    };
  };

  // Update a single student's status in a period cell
  const handleUpdateStatus = (
    studentId: string,
    entry: TimetableEntry,
    newStatus: StudentAttendanceStatus
  ) => {
    const perm = checkPeriodPermission(entry);
    if (!perm.authorized) {
      addToast({
        type: 'error',
        title: 'Action Unauthorized',
        message: perm.reason
      });
      return;
    }

    const existingRec = getAttendanceRecordForPeriod(entry);
    if (existingRec?.status === 'Submitted') {
      addToast({
        type: 'info',
        title: 'Register Finalized',
        message: 'This period register has been submitted. Please request an authorized attendance correction to adjust.'
      });
      return;
    }

    const periodKey = getPeriodKey(entry);
    const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;

    setMatrixDrafts((prev) => {
      const periodDraft = { ...(prev[matrixKey] || {}) };
      const currentEntry = periodDraft[studentId] || {
        studentId,
        studentName: classStudents.find((s) => s.id === studentId)?.name || 'Student',
        status: 'Not Marked'
      };

      periodDraft[studentId] = {
        ...currentEntry,
        status: newStatus,
        arrivalTime: newStatus === 'Late' ? currentEntry.arrivalTime || '08:40' : undefined
      };

      return {
        ...prev,
        [matrixKey]: periodDraft
      };
    });
  };

  // Cycle status on cell click (Present -> Absent -> Late -> Excused -> Not Marked)
  const handleCycleStatus = (studentId: string, entry: TimetableEntry) => {
    const current = getStudentPeriodEntry(studentId, entry).status;
    let next: StudentAttendanceStatus = 'Present';

    if (current === 'Not Marked') next = 'Present';
    else if (current === 'Present') next = 'Absent';
    else if (current === 'Absent') next = 'Late';
    else if (current === 'Late') next = 'Excused';
    else if (current === 'Excused') next = 'Not Marked';

    handleUpdateStatus(studentId, entry, next);
  };

  // Trigger Mark All Present for an authorized period
  const handleTriggerMarkAllPresent = (entry: TimetableEntry) => {
    const perm = checkPeriodPermission(entry);
    if (!perm.authorized) {
      addToast({
        type: 'error',
        title: 'Action Unauthorized',
        message: perm.reason
      });
      return;
    }

    const periodKey = getPeriodKey(entry);
    const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;
    const periodDraft = matrixDrafts[matrixKey] || {};

    const existingAbsent = Object.values(periodDraft).filter((r) => r.status === 'Absent').length;

    if (existingAbsent > 0) {
      setShowMarkAllConfirm({
        open: true,
        periodKey,
        periodName: entry.periodName,
        subjectName: entry.subjectName,
        existingAbsentCount: existingAbsent
      });
      return;
    }

    executeMarkAllPresent(entry);
  };

  // Execute Mark All Present
  const executeMarkAllPresent = (entry: TimetableEntry) => {
    const periodKey = getPeriodKey(entry);
    const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;

    setMatrixDrafts((prev) => {
      const periodDraft: Record<string, StudentAttendanceEntry> = {};
      classStudents.forEach((student) => {
        periodDraft[student.id] = {
          studentId: student.id,
          studentName: student.name,
          status: 'Present',
          arrivalTime: '08:25'
        };
      });

      return {
        ...prev,
        [matrixKey]: periodDraft
      };
    });

    setShowMarkAllConfirm((prev) => ({ ...prev, open: false }));

    addToast({
      type: 'info',
      title: 'Roll Call Updated',
      message: `Marked all ${classStudents.length} students as Present for ${entry.periodName} (${entry.subjectName}).`
    });
  };

  // Save Draft for a specific period
  const handleSavePeriodDraft = (entry: TimetableEntry) => {
    const perm = checkPeriodPermission(entry);
    if (!perm.authorized) {
      addToast({
        type: 'error',
        title: 'Action Unauthorized',
        message: perm.reason
      });
      return;
    }

    const periodKey = getPeriodKey(entry);
    const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;
    const periodDraft = matrixDrafts[matrixKey] || {};

    const recordsList: StudentAttendanceEntry[] = classStudents.map((s) => {
      return (
        periodDraft[s.id] || {
          studentId: s.id,
          studentName: s.name,
          status: 'Not Marked'
        }
      );
    });

    recordAttendance(
      selectedClassId,
      periodKey,
      recordsList,
      selectedDate,
      true,
      entry.subjectId,
      entry.subjectName,
      entry.teacherId
    );

    addToast({
      type: 'info',
      title: 'Draft Saved',
      message: `Attendance draft saved for ${entry.periodName} · ${entry.subjectName}.`
    });
  };

  // Open Submit Review Dialog for a specific period
  const handleOpenSubmitReview = (entry: TimetableEntry) => {
    const perm = checkPeriodPermission(entry);
    if (!perm.authorized) {
      addToast({
        type: 'error',
        title: 'Action Unauthorized',
        message: perm.reason
      });
      return;
    }

    const periodKey = getPeriodKey(entry);
    setReviewDialog({
      open: true,
      periodKey,
      periodName: entry.periodName,
      subjectName: entry.subjectName,
      teacherName: entry.teacherName,
      timetableEntry: entry
    });
  };

  // Execute Final Submit from Review Dialog
  const handleExecuteFinalSubmit = () => {
    if (!reviewDialog.timetableEntry) return;
    const entry = reviewDialog.timetableEntry;
    const periodKey = getPeriodKey(entry);
    const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;
    const periodDraft = matrixDrafts[matrixKey] || {};

    const recordsList: StudentAttendanceEntry[] = classStudents.map((s) => {
      return (
        periodDraft[s.id] || {
          studentId: s.id,
          studentName: s.name,
          status: 'Not Marked'
        }
      );
    });

    recordAttendance(
      selectedClassId,
      periodKey,
      recordsList,
      selectedDate,
      false,
      entry.subjectId,
      entry.subjectName,
      entry.teacherId
    );

    setReviewDialog((prev) => ({ ...prev, open: false }));

    addToast({
      type: 'info',
      title: 'Official Attendance Submitted',
      message: `Finalized register for ${entry.periodName} (${entry.subjectName}). Submitted for official school audit.`
    });
  };

  // Calculate live statistics for each period
  const periodStats = useMemo(() => {
    const stats: Record<
      string,
      {
        present: number;
        absent: number;
        late: number;
        excused: number;
        halfDay: number;
        notMarked: number;
        total: number;
        completionRate: number;
        absentees: { student: Student; entry: StudentAttendanceEntry }[];
        unmarked: { student: Student; entry: StudentAttendanceEntry }[];
      }
    > = {};

    scheduledPeriods.forEach((entry) => {
      const periodKey = getPeriodKey(entry);
      const matrixKey = `${selectedClassId}_${selectedDate}_${periodKey}`;
      const periodDraft = matrixDrafts[matrixKey] || {};

      let present = 0;
      let absent = 0;
      let late = 0;
      let excused = 0;
      let halfDay = 0;
      let notMarked = 0;
      const absentees: { student: Student; entry: StudentAttendanceEntry }[] = [];
      const unmarked: { student: Student; entry: StudentAttendanceEntry }[] = [];

      classStudents.forEach((student) => {
        const entryData = periodDraft[student.id] || {
          studentId: student.id,
          studentName: student.name,
          status: 'Not Marked'
        };

        if (entryData.status === 'Present') present++;
        else if (entryData.status === 'Absent') {
          absent++;
          absentees.push({ student, entry: entryData });
        } else if (entryData.status === 'Late') late++;
        else if (entryData.status === 'Excused') excused++;
        else if (entryData.status === 'Half Day') halfDay++;
        else {
          notMarked++;
          unmarked.push({ student, entry: entryData });
        }
      });

      const total = classStudents.length;
      const markedCount = total - notMarked;
      const completionRate = total > 0 ? Math.round((markedCount / total) * 100) : 0;

      stats[periodKey] = {
        present,
        absent,
        late,
        excused,
        halfDay,
        notMarked,
        total,
        completionRate,
        absentees,
        unmarked
      };
    });

    return stats;
  }, [scheduledPeriods, selectedClassId, selectedDate, matrixDrafts, classStudents]);

  // Overall aggregate stats across all periods or selected period for the Absentees Panel
  const panelStats = useMemo(() => {
    if (selectedPeriodForAbsentees !== 'all' && periodStats[selectedPeriodForAbsentees]) {
      return periodStats[selectedPeriodForAbsentees];
    }

    // Aggregate across all scheduled periods
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;
    let halfDay = 0;
    let notMarked = 0;
    const allAbsentees: { student: Student; entry: StudentAttendanceEntry; periodName: string }[] = [];

    scheduledPeriods.forEach((entry) => {
      const pKey = getPeriodKey(entry);
      const s = periodStats[pKey];
      if (s) {
        present += s.present;
        absent += s.absent;
        late += s.late;
        excused += s.excused;
        halfDay += s.halfDay;
        notMarked += s.notMarked;

        s.absentees.forEach((ab) => {
          allAbsentees.push({
            student: ab.student,
            entry: ab.entry,
            periodName: `${entry.periodName} (${entry.subjectName})`
          });
        });
      }
    });

    const totalPossible = classStudents.length * scheduledPeriods.length;
    const markedTotal = totalPossible - notMarked;
    const completionRate = totalPossible > 0 ? Math.round((markedTotal / totalPossible) * 100) : 0;

    return {
      present,
      absent,
      late,
      excused,
      halfDay,
      notMarked,
      total: totalPossible,
      completionRate,
      absentees: allAbsentees,
      unmarked: []
    };
  }, [selectedPeriodForAbsentees, periodStats, scheduledPeriods, classStudents]);

  // Filter students displayed in the matrix rows
  const filteredStudents = useMemo(() => {
    return classStudents.filter((student) => {
      // Search filter
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toString().includes(searchTerm);

      if (!matchesSearch) return false;

      // Status filter
      if (statusFilter !== 'all') {
        // Check if student has this status in any period (or in the active period)
        const hasStatus = scheduledPeriods.some((p) => {
          const entry = getStudentPeriodEntry(student.id, p);
          return entry.status === statusFilter;
        });
        if (!hasStatus) return false;
      }

      return true;
    });
  }, [classStudents, searchTerm, statusFilter, scheduledPeriods, matrixDrafts]);

  // Locate and scroll to student row
  const handleLocateStudent = (studentId: string) => {
    setHighlightedStudentId(studentId);
    const rowEl = rowRefs.current[studentId];
    if (rowEl) {
      rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedStudentId(null);
    }, 3000);
  };

  // Find active teacher object
  const activeTeacherObj = useMemo(() => {
    return teachers.find((t) => t.id === activeTeacherId) || teachers[0];
  }, [teachers, activeTeacherId]);

  return (
    <div className="space-y-6">
      {/* ================= 1. TOP HEADER & WORKFLOW CONTROL CARD ================= */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Greenfield International School
              </span>
              <span className="text-xs font-mono text-slate-500">
                AY {academicYears.find((y) => y.id === activeAcademicYearId)?.name || '2026–2027'} · Term 1
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Period-Wise Attendance Matrix
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Class Attendance Matrix: {activeClass.name}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Complete scheduled period matrix with fine-grained teacher-subject permission isolation.
              Only assigned faculty members may edit roll call for their designated lessons.
            </p>
          </div>

          {/* Active Faculty Switcher (Critical for Demo Testing) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-1.5 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-blue-700" />
                Logged-in Faculty Identity
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded">
                Demo Switcher
              </span>
            </div>
            <select
              value={activeTeacherId}
              onChange={(e) => setActiveTeacherId(e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 shadow-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.subjectSpecialization || t.department})
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500 italic">
              Switching faculty updates period authorization across columns immediately.
            </span>
          </div>
        </div>

        {/* Filter Controls Bar: Date, Class, Section, Day Info */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>Attendance Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-700" />
              <span>Class Division</span>
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} (Room {cls.room} · Mentor: {cls.classTeacherName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>Day & Timetable Scope</span>
            </label>
            <div className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-semibold text-slate-800 flex items-center justify-between">
              <span>{selectedDayName} Schedule</span>
              <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-blue-900">
                {scheduledPeriods.length} Periods
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-700" />
              <span>Class Status Banner</span>
            </label>
            <div className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="truncate">
                {activeClass.name} · {classStudents.length} Students Enrolled
              </span>
            </div>
          </div>
        </div>

        {/* Permission Rules & Legend strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-800" />
              Column Permission Rule:
            </span>
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">Authorized Period (Your Lesson · Editable)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">Locked Period (Other Faculty · Read-Only)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            Click any editable cell to cycle statuses (Present → Absent → Late → Excused).
          </div>
        </div>
      </div>

      {/* ================= 2. ATTENDANCE SUMMARY & ABSENTEES INTEGRATED PANEL ================= */}
      {/* Requirement: Displayed in the same box/page, instant live update, clicking an absent student locates their row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Attendance Summary & Absentees Register
              </h2>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                Instant Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live presence metrics and itemized absentee roster for {activeClass.name} on {selectedDate}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Scope:</span>
            <select
              value={selectedPeriodForAbsentees}
              onChange={(e) => setSelectedPeriodForAbsentees(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
            >
              <option value="all">Full Day Aggregate ({scheduledPeriods.length} Periods)</option>
              {scheduledPeriods.map((p) => {
                const pKey = getPeriodKey(p);
                return (
                  <option key={p.id} value={pKey}>
                    {p.periodName} · {p.subjectName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Student Records
            </span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-0.5 block">
              {panelStats.total}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              {selectedPeriodForAbsentees === 'all'
                ? `${classStudents.length} students × ${scheduledPeriods.length} periods`
                : `${classStudents.length} enrolled students`}
            </span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
              Present Count
            </span>
            <span className="text-2xl font-black font-mono text-emerald-800 mt-0.5 block">
              {panelStats.present}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold font-mono">
              {panelStats.total > 0 ? Math.round((panelStats.present / panelStats.total) * 100) : 0}% Presence
            </span>
          </div>

          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
              Absent Count
            </span>
            <span className="text-2xl font-black font-mono text-rose-800 mt-0.5 block">
              {panelStats.absent}
            </span>
            <span className="text-[11px] text-rose-600 font-medium">Recorded Unexcused</span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Late / Tardy
            </span>
            <span className="text-2xl font-black font-mono text-amber-800 mt-0.5 block">
              {panelStats.late}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">With gate arrival</span>
          </div>

          <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
              Excused / Half Day
            </span>
            <span className="text-2xl font-black font-mono text-teal-800 mt-0.5 block">
              {panelStats.excused + panelStats.halfDay}
            </span>
            <span className="text-[11px] text-teal-600 font-medium">Approved reasons</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Not Marked / Incomplete
            </span>
            <span
              className={`text-2xl font-black font-mono mt-0.5 block ${
                panelStats.notMarked > 0 ? 'text-amber-700' : 'text-slate-400'
              }`}
            >
              {panelStats.notMarked}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Pending entry</span>
          </div>
        </div>

        {/* Absentees List Roster */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Currently Absent Students ({panelStats.absentees.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Click <strong className="text-blue-700">Locate</strong> to highlight student row in the matrix.
            </span>
          </div>

          {panelStats.absentees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {panelStats.absentees.map((item, idx) => {
                const s = item.student;
                return (
                  <div
                    key={`${s.id}-${idx}`}
                    className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between shadow-xs hover:border-rose-400 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{s.name}</span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {s.admissionId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <span className="font-medium text-rose-700">✕ Absent</span>
                        {'periodName' in item && (
                          <span className="text-slate-500 truncate max-w-[150px]">
                            · {(item as any).periodName}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLocateStudent(s.id)}
                      className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg text-[11px] border border-rose-200 transition-colors flex items-center gap-1"
                    >
                      <span>Locate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No absent students in this scope! All students are currently marked Present or pending.</span>
            </div>
          )}
        </div>
      </div>

      {/* ================= 3. MATRIX CONTROLS: SEARCH, FILTER, QUICK ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or admission ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              <option value="all">All Students ({classStudents.length})</option>
              <option value="Present">Has Present</option>
              <option value="Absent">Has Absent</option>
              <option value="Late">Has Late</option>
              <option value="Excused">Has Excused</option>
              <option value="Not Marked">Has Not Marked</option>
            </select>
          </div>
        </div>

        {/* Action legend & instructions */}
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span>Showing {filteredStudents.length} of {classStudents.length} students</span>
        </div>
      </div>

      {/* ================= 4. PERIOD-WISE ATTENDANCE MATRIX TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto relative max-h-[650px]">
          <table className="w-full text-left border-collapse text-xs min-w-[900px]">
            {/* Header row with periods as columns */}
            <thead className="sticky top-0 z-20 bg-slate-50 shadow-xs">
              <tr className="border-b border-slate-200 text-slate-600 text-[11px] font-bold">
                {/* Fixed Student Name & Roll No Column */}
                <th className="py-3 px-4 bg-slate-100/90 backdrop-blur sticky left-0 z-30 min-w-[200px] border-r border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span>Student Name & ID</span>
                    <span className="text-[10px] text-slate-400 font-mono">Roll #</span>
                  </div>
                </th>

                {/* Scheduled Periods as Columns */}
                {scheduledPeriods.map((entry) => {
                  const perm = checkPeriodPermission(entry);
                  const periodKey = getPeriodKey(entry);
                  const existingRec = getAttendanceRecordForPeriod(entry);
                  const isSubmitted = existingRec?.status === 'Submitted';
                  const isDraft = existingRec?.status === 'Draft';
                  const stats = periodStats[periodKey];

                  return (
                    <th
                      key={entry.id}
                      className={`py-3 px-3 min-w-[175px] max-w-[210px] border-r border-slate-200 align-top ${
                        perm.authorized ? 'bg-blue-50/50' : 'bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        {/* Period & Time header */}
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 block truncate">
                            {entry.periodName}
                          </span>
                          {perm.authorized ? (
                            <span
                              className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                              title="Authorized: You teach this lesson"
                            >
                              <Unlock className="w-2.5 h-2.5 text-emerald-700" />
                              <span>Assigned</span>
                            </span>
                          ) : (
                            <span
                              className="text-[10px] font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                              title={perm.reason}
                            >
                              <Lock className="w-2.5 h-2.5 text-slate-500" />
                              <span>Locked</span>
                            </span>
                          )}
                        </div>

                        {/* Subject & Time Slot */}
                        <div>
                          <span className="text-xs font-bold text-blue-900 block truncate" title={entry.subjectName}>
                            {entry.subjectName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 block">
                            {entry.startTime} – {entry.endTime} · {entry.room}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate" title={`Faculty: ${entry.teacherName}`}>
                            Faculty: {entry.teacherName}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          {isSubmitted ? (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              Submitted
                            </span>
                          ) : isDraft ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-700" />
                              Draft
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400">
                              Not Started
                            </span>
                          )}

                          {stats && (
                            <span className="text-[10px] font-mono text-slate-500">
                              {stats.present}P / {stats.absent}A
                            </span>
                          )}
                        </div>

                        {/* Quick-Action Buttons for Authorized Periods */}
                        {perm.authorized && !isSubmitted && (
                          <div className="flex items-center gap-1 pt-1">
                            <button
                              type="button"
                              onClick={() => handleTriggerMarkAllPresent(entry)}
                              className="flex-1 py-1 px-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold flex items-center justify-center gap-0.5 transition-colors"
                              title="Mark all students present for this period"
                            >
                              <Check className="w-2.5 h-2.5" />
                              <span>All Present</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSavePeriodDraft(entry)}
                              className="py-1 px-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition-colors"
                              title="Save Draft for this period"
                            >
                              <Save className="w-2.5 h-2.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenSubmitReview(entry)}
                              className="py-1 px-1.5 bg-blue-800 hover:bg-blue-900 text-white rounded text-[10px] font-bold transition-colors"
                              title="Review and Submit Attendance for this period"
                            >
                              <Send className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}

                        {perm.authorized && isSubmitted && (
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setCorrectionTargetRecord(existingRec || null);
                                setShowCorrectionModal(true);
                              }}
                              className="w-full py-1 px-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                            >
                              <ShieldAlert className="w-2.5 h-2.5 text-amber-700" />
                              <span>Correction</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Matrix Rows: Student Name and Period Cells */}
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isHighlighted = highlightedStudentId === student.id;

                  return (
                    <tr
                      key={student.id}
                      ref={(el) => {
                        rowRefs.current[student.id] = el;
                      }}
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-amber-100/90 ring-2 ring-amber-400'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Fixed First Column: Student Name, Roll No & ID */}
                      <td className="py-2.5 px-4 bg-white/95 sticky left-0 z-10 border-r border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[11px] font-bold text-slate-400 w-5 text-right shrink-0">
                            #{student.rollNo}
                          </span>
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setViewingStudent(student)}
                              className="font-bold text-slate-900 hover:text-blue-800 truncate block text-left transition-colors"
                              title="View official profile"
                            >
                              {student.name}
                            </button>
                            <span className="font-mono text-[10px] text-slate-400 block truncate">
                              {student.admissionId}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Period Cells */}
                      {scheduledPeriods.map((entry) => {
                        const perm = checkPeriodPermission(entry);
                        const cellEntry = getStudentPeriodEntry(student.id, entry);
                        const existingRec = getAttendanceRecordForPeriod(entry);
                        const isSubmitted = existingRec?.status === 'Submitted';
                        const status = cellEntry.status;

                        // Visual styling based on status
                        let statusColor = 'bg-slate-100 text-slate-600 border-slate-200';
                        if (status === 'Present') {
                          statusColor = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                        } else if (status === 'Absent') {
                          statusColor = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
                        } else if (status === 'Late') {
                          statusColor = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                        } else if (status === 'Excused') {
                          statusColor = 'bg-teal-50 text-teal-800 border-teal-300 font-bold';
                        } else if (status === 'Half Day') {
                          statusColor = 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold';
                        }

                        return (
                          <td
                            key={entry.id}
                            className={`py-2 px-3 border-r border-slate-100 text-center ${
                              !perm.authorized ? 'bg-slate-50/60' : ''
                            }`}
                          >
                            {perm.authorized && !isSubmitted ? (
                              // Authorized & Editable cell
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleCycleStatus(student.id, entry)}
                                  className={`w-full py-1.5 px-2 rounded-lg text-xs border transition-all active:scale-95 flex items-center justify-center gap-1 shadow-2xs ${statusColor}`}
                                  title="Click to toggle status: Present → Absent → Late → Excused"
                                >
                                  {status === 'Present' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                  {status === 'Absent' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                                  {status === 'Late' && <Clock3 className="w-3.5 h-3.5 text-amber-600" />}
                                  {status === 'Excused' && <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />}
                                  {status === 'Not Marked' && <span className="text-slate-400 font-medium">–</span>}
                                  <span>{status}</span>
                                </button>
                              </div>
                            ) : (
                              // Locked / Read-only cell
                              <div
                                className="w-full py-1.5 px-2 rounded-lg text-xs border border-dashed border-slate-200 text-slate-500 bg-slate-100/50 flex items-center justify-center gap-1 cursor-not-allowed select-none"
                                title={
                                  isSubmitted
                                    ? 'Official register already submitted'
                                    : perm.reason
                                }
                              >
                                {isSubmitted ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Lock className="w-2.5 h-2.5 text-slate-400" />
                                )}
                                <span className={status === 'Absent' ? 'text-rose-700 font-bold' : ''}>
                                  {status}
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={scheduledPeriods.length + 1}
                    className="py-12 text-center text-slate-400"
                  >
                    No students match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Matrix Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong>{filteredStudents.length}</strong> enrolled students across{' '}
              <strong>{scheduledPeriods.length}</strong> scheduled timetable periods.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              Greenfield Attendance Policy: Minimum 85% requirement enforced.
            </span>
          </div>
        </div>
      </div>

      {/* ================= 5. CONFIRMATION DIALOG: MARK ALL PRESENT ================= */}
      {showMarkAllConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Replace Existing Absentees with Present?
              </h3>
              <p className="text-slate-500 mt-1">
                You have already marked{' '}
                <strong className="text-rose-700 font-mono">
                  {showMarkAllConfirm.existingAbsentCount} student(s)
                </strong>{' '}
                as <em>Absent</em> in <strong>{showMarkAllConfirm.periodName}</strong> (
                {showMarkAllConfirm.subjectName}).
              </p>
              <p className="text-slate-500 mt-2">
                Clicking <strong>Yes, Mark All Present</strong> will reset all students in this period
                to Present. You can subsequently re-correct any absentees.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowMarkAllConfirm((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const entry = scheduledPeriods.find(
                    (p) => getPeriodKey(p) === showMarkAllConfirm.periodKey
                  );
                  if (entry) executeMarkAllPresent(entry);
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Yes, Mark All Present
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 6. SUBMISSION REVIEW DIALOG (Prompt 1 & 4 requirement) ================= */}
      {reviewDialog.open && reviewDialog.timetableEntry && (() => {
        const entry = reviewDialog.timetableEntry;
        const stats = periodStats[reviewDialog.periodKey] || {
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
          halfDay: 0,
          notMarked: 0,
          total: classStudents.length,
          completionRate: 0,
          absentees: [],
          unmarked: []
        };
        const hasUnmarked = stats.notMarked > 0;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Attendance Review Before Submission
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Greenfield International School · Official Roll Call Audit
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewDialog((prev) => ({ ...prev, open: false }))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Session Context Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">School</span>
                  <span className="font-bold text-slate-800">Greenfield Int. School</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Date & Day</span>
                  <span className="font-bold text-slate-800 font-mono">{selectedDate} ({selectedDayName})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Class Division</span>
                  <span className="font-bold text-slate-800">{activeClass.name} (Sec {activeClass.section || 'A'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Period & Subject</span>
                  <span className="font-bold text-slate-800">{entry.periodName} · {entry.subjectName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Scheduled Slot</span>
                  <span className="font-bold text-slate-800 font-mono">{entry.startTime} – {entry.endTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Recording Faculty</span>
                  <span className="font-bold text-slate-800">{entry.teacherName}</span>
                </div>
              </div>

              {/* Counters Summary */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 block">Enrolled</span>
                  <span className="text-lg font-black font-mono text-slate-900">{stats.total}</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-700 block">Present</span>
                  <span className="text-lg font-black font-mono text-emerald-800">{stats.present}</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-700 block">Absent</span>
                  <span className="text-lg font-black font-mono text-rose-800">{stats.absent}</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-700 block">Late / Other</span>
                  <span className="text-lg font-black font-mono text-amber-800">
                    {stats.late + stats.excused + stats.halfDay}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-100 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 block">Completion</span>
                  <span className="text-lg font-black font-mono text-blue-900">
                    {stats.completionRate}%
                  </span>
                </div>
              </div>

              {/* Itemized Absentees in Review Modal */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Students Marked Absent ({stats.absentees.length}):
                </span>
                {stats.absentees.length > 0 ? (
                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200">
                    {stats.absentees.map((item) => (
                      <div key={item.student.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.student.name}</span>
                          <span className="font-mono text-[10px] text-slate-500">({item.student.admissionId})</span>
                        </div>
                        <span className="text-rose-700 font-bold font-mono text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          ✕ Absent
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200 text-center">
                    No students marked absent for this lesson.
                  </div>
                )}
              </div>

              {/* Incomplete Warning if Unmarked Students Exist */}
              {hasUnmarked ? (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Incomplete Roll Call: {stats.notMarked} Student(s) Not Marked</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    According to Greenfield School policy, all students must be explicitly marked before final submission. Please return to the register to complete the remaining students.
                  </p>
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewDialog((prev) => ({ ...prev, open: false }))}
                  className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  Return to Register
                </button>

                <button
                  type="button"
                  onClick={handleExecuteFinalSubmit}
                  disabled={hasUnmarked}
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow-sm transition-all flex items-center gap-2 ${
                    hasUnmarked
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                      : 'bg-emerald-800 hover:bg-emerald-900 active:scale-95'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm and Submit</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================= 7. PROFILE & CORRECTION MODALS ================= */}
      {viewingStudent && (
        <StudentProfileModal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          student={viewingStudent}
        />
      )}

      {showCorrectionModal && correctionTargetRecord && (
        <AttendanceCorrectionModal
          isOpen={true}
          onClose={() => setShowCorrectionModal(false)}
          record={correctionTargetRecord}
        />
      )}
    </div>
  );
};
