import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Student,
  AttendanceRecord,
  StudentAttendanceStatus,
  StudentAttendanceEntry
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
  FileText,
  ArrowRight,
  FileCheck2,
  X
} from 'lucide-react';

interface StudentAttendanceMarkerProps {
  initialClassId?: string;
  initialDate?: string;
  initialPeriod?: string;
}

export const StudentAttendanceMarker: React.FC<StudentAttendanceMarkerProps> = ({
  initialClassId = 'class-10a',
  initialDate,
  initialPeriod = 'Period 1 (08:30 - 09:15)'
}) => {
  const {
    classes,
    students,
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
  const [selectedPeriod, setSelectedPeriod] = useState<string>(initialPeriod);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Attendance draft state: Record<studentId, { status, arrivalTime, remarks }>
  const [draftEntries, setDraftEntries] = useState<Record<string, StudentAttendanceEntry>>({});
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showCorrectionModal, setShowCorrectionModal] = useState<boolean>(false);
  const [showUnmarkedWarning, setShowUnmarkedWarning] = useState<boolean>(false);
  const [showMarkAllConfirm, setShowMarkAllConfirm] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [highlightedStudentId, setHighlightedStudentId] = useState<string | null>(null);

  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});
  const absenteesRef = useRef<HTMLDivElement | null>(null);

  // Filter students enrolled in currently selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Absent students list directly derived from draftEntries
  const absentStudents = useMemo(() => {
    return classStudents.filter((s) => draftEntries[s.id]?.status === 'Absent');
  }, [classStudents, draftEntries]);

  const targetClass = classes.find((c) => c.id === selectedClassId);

  // Look for existing session record
  const existingRecord = useMemo(() => {
    return attendance.find(
      (a) => a.classId === selectedClassId && a.date === selectedDate && a.period === selectedPeriod
    );
  }, [attendance, selectedClassId, selectedDate, selectedPeriod]);

  // Load existing entries or initialize draft for enrolled students
  useEffect(() => {
    const entriesMap: Record<string, StudentAttendanceEntry> = {};

    if (existingRecord) {
      existingRecord.records.forEach((r) => {
        entriesMap[r.studentId] = {
          studentId: r.studentId,
          studentName: r.studentName,
          status: r.status,
          arrivalTime: r.arrivalTime,
          remarks: r.remarks
        };
      });
    } else {
      classStudents.forEach((s) => {
        entriesMap[s.id] = {
          studentId: s.id,
          studentName: s.name,
          status: 'Not Marked'
        };
      });
    }

    setDraftEntries(entriesMap);
  }, [existingRecord, selectedClassId, selectedDate, selectedPeriod, classStudents]);

  // Computed tallies
  const tallies = useMemo(() => {
    const all = Object.values(draftEntries);
    const present = all.filter((r) => r.status === 'Present').length;
    const absent = all.filter((r) => r.status === 'Absent').length;
    const late = all.filter((r) => r.status === 'Late').length;
    const halfDay = all.filter((r) => r.status === 'Half Day').length;
    const excused = all.filter((r) => r.status === 'Excused').length;
    const notMarked = all.filter((r) => r.status === 'Not Marked').length;
    const total = classStudents.length;

    const presentEquiv = present + late + excused + halfDay * 0.5;
    const rate = total > 0 ? Math.round((presentEquiv / (total - notMarked || 1)) * 100) : 0;

    return {
      present,
      absent,
      late,
      halfDay,
      excused,
      notMarked,
      total,
      rate
    };
  }, [draftEntries, classStudents]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNo.toString().includes(searchTerm);

      if (!matchSearch) return false;

      if (filterStatus !== 'all') {
        const entry = draftEntries[s.id];
        if (!entry || entry.status !== filterStatus) return false;
      }

      return true;
    });
  }, [classStudents, searchTerm, filterStatus, draftEntries]);

  // Update single student
  const updateStudentEntry = (
    studentId: string,
    status: StudentAttendanceStatus,
    patch?: Partial<StudentAttendanceEntry>
  ) => {
    setDraftEntries((prev) => {
      const current = prev[studentId] || {
        studentId,
        studentName: classStudents.find((s) => s.id === studentId)?.name || 'Student',
        status: 'Not Marked'
      };

      const updated: StudentAttendanceEntry = {
        ...current,
        status,
        ...patch
      };

      // Auto-populate arrival time for Late if missing
      if (status === 'Late' && !updated.arrivalTime) {
        updated.arrivalTime = '08:42';
      }

      return {
        ...prev,
        [studentId]: updated
      };
    });
  };

  // Bulk: Mark all enrolled present
  const handleMarkAllPresent = () => {
    setDraftEntries((prev) => {
      const next = { ...prev };
      classStudents.forEach((s) => {
        next[s.id] = {
          studentId: s.id,
          studentName: s.name,
          status: 'Present',
          arrivalTime: '08:25'
        };
      });
      return next;
    });
    setShowMarkAllConfirm(false);
    addToast({
      type: 'info',
      title: 'Bulk Roll Call Updated',
      message: `Marked all ${classStudents.length} enrolled students as Present.`
    });
  };

  // Bulk: Reset all to Not Marked
  const handleResetToNotMarked = () => {
    setDraftEntries((prev) => {
      const next = { ...prev };
      classStudents.forEach((s) => {
        next[s.id] = {
          studentId: s.id,
          studentName: s.name,
          status: 'Not Marked'
        };
      });
      return next;
    });
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const recordsList: StudentAttendanceEntry[] = classStudents.map((s) => {
      return (
        draftEntries[s.id] || {
          studentId: s.id,
          studentName: s.name,
          status: 'Not Marked'
        }
      );
    });

    recordAttendance(
      selectedClassId,
      selectedPeriod,
      recordsList,
      selectedDate,
      true,
      existingRecord?.subjectId,
      existingRecord?.subjectName,
      existingRecord?.teacherId || 't-1'
    );
  };

  // Submit Official Attendance
  const handleExecuteSubmit = () => {
    const recordsList: StudentAttendanceEntry[] = classStudents.map((s) => {
      return (
        draftEntries[s.id] || {
          studentId: s.id,
          studentName: s.name,
          status: 'Not Marked'
        }
      );
    });

    recordAttendance(
      selectedClassId,
      selectedPeriod,
      recordsList,
      selectedDate,
      false,
      existingRecord?.subjectId,
      existingRecord?.subjectName,
      existingRecord?.teacherId || 't-1'
    );
    setShowUnmarkedWarning(false);
  };

  // Trigger Mark All Present with confirmation if absentees exist
  const handleTriggerMarkAllPresent = () => {
    const existingAbsent = classStudents.filter((s) => draftEntries[s.id]?.status === 'Absent').length;
    if (existingAbsent > 0) {
      setShowMarkAllConfirm(true);
      return;
    }
    handleMarkAllPresent();
  };

  const handleTriggerSubmit = () => {
    setShowReviewModal(true);
  };

  const isSubmitted = existingRecord?.status === 'Submitted';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Greenfield Academic Roll Call
              </span>
              <span className="text-xs font-mono text-slate-500">
                AY {academicYears.find((y) => y.id === activeAcademicYearId)?.name || '2026–2027'}
              </span>
              {isSubmitted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Official Register Submitted
                </span>
              ) : existingRecord ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  Saved Draft
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  New Attendance Session
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Class Attendance Register: {targetClass?.name || selectedClassId}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Select date, class division, and period slot to record attendance. Multi-status support (Present, Absent, Late, Excused, Half Day).
            </p>
          </div>

          {/* Top Quick Action Buttons (Prompt 1 Workflow) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isSubmitted ? (
              <button
                type="button"
                onClick={() => setShowCorrectionModal(true)}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Request Correction</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleTriggerMarkAllPresent}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mark All Present</span>
            </button>

            <button
              type="button"
              onClick={() => {
                absenteesRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Users className="w-4 h-4 text-rose-600" />
              <span>View Absentees ({tallies.absent})</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4 text-slate-600" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleTriggerSubmit}
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>Submit Attendance</span>
            </button>
          </div>
        </div>

        {/* Selectors Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Attendance Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-800" />
              <span>Class Division</span>
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.room} · Mentor: {cls.classTeacherName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-800" />
              <span>Timetable Period / Session</span>
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Period 1 (08:30 - 09:15)">Period 1 (08:30 - 09:15) · Morning Core</option>
              <option value="Period 2 (09:20 - 10:05)">Period 2 (09:20 - 10:05)</option>
              <option value="Period 3 (10:25 - 11:10)">Period 3 (10:25 - 11:10)</option>
              <option value="Period 4 (11:15 - 12:00)">Period 4 (11:15 - 12:00)</option>
              <option value="Period 5 (12:45 - 01:30)">Period 5 (12:45 - 01:30)</option>
              <option value="Period 6 (01:35 - 02:20)">Period 6 (01:35 - 02:20)</option>
              <option value="Morning Roll Call">Full Day Homeroom Roll Call</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= INTEGRATED ATTENDANCE SUMMARY & ABSENTEES PANEL (Prompt 1) ================= */}
      <div ref={absenteesRef} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {targetClass?.name || selectedClassId} — Attendance Summary & Absentees
              </h2>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Live Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant attendance summary and real-time list of absent students for {selectedPeriod} on {selectedDate}.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-500">Completion:</span>
            <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
              {tallies.total > 0 ? Math.round(((tallies.total - tallies.notMarked) / tallies.total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Students</span>
            <span className="text-2xl font-black font-mono text-slate-900 mt-0.5 block">{tallies.total}</span>
            <span className="text-[11px] text-slate-400 font-medium">Enrolled in section</span>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Present</span>
            <span className="text-2xl font-black font-mono text-emerald-800 mt-0.5 block">{tallies.present}</span>
            <span className="text-[11px] text-emerald-700 font-bold font-mono">
              {tallies.total > 0 ? Math.round((tallies.present / tallies.total) * 100) : 0}% of class
            </span>
          </div>

          <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Absent</span>
            <span className="text-2xl font-black font-mono text-rose-800 mt-0.5 block">{tallies.absent}</span>
            <span className="text-[11px] text-rose-600 font-medium">Unexcused Absence</span>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Late / Other</span>
            <span className="text-2xl font-black font-mono text-amber-800 mt-0.5 block">
              {tallies.late + tallies.excused + tallies.halfDay}
            </span>
            <span className="text-[11px] text-amber-600 font-medium">Tardy & Excused</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Not Marked</span>
            <span className={`text-2xl font-black font-mono mt-0.5 block ${tallies.notMarked > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
              {tallies.notMarked}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Pending Entry</span>
          </div>
        </div>

        {/* Absent Students Table (Prompt 1 specification) */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Absent Students ({absentStudents.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Click <strong>Locate in Register</strong> to highlight student row below.
            </span>
          </div>

          {absentStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Admission No.</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {absentStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{s.rollNo}</span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">{s.admissionId}</td>
                      <td className="py-2 px-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          <span>✕ Absent</span>
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setHighlightedStudentId(s.id);
                            const row = rowRefs.current[s.id];
                            if (row) {
                              row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                            setTimeout(() => setHighlightedStudentId(null), 3000);
                          }}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold rounded-lg text-[11px] border border-rose-200 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Locate</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No absent students in this session! All students are marked Present or pending.</span>
            </div>
          )}
        </div>
      </div>

      {/* Roster Controls: Search, Filters, Bulk Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
            >
              <option value="all">All Statuses ({tallies.total})</option>
              <option value="Present">Present ({tallies.present})</option>
              <option value="Absent">Absent ({tallies.absent})</option>
              <option value="Late">Late ({tallies.late})</option>
              <option value="Excused">Excused ({tallies.excused})</option>
              <option value="Half Day">Half Day ({tallies.halfDay})</option>
              <option value="Not Marked">Not Marked ({tallies.notMarked})</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMarkAllConfirm(true)}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={handleResetToNotMarked}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-medium transition-colors"
          >
            Reset Statuses
          </button>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4 w-12 text-center">Roll</th>
                <th className="py-3 px-4">Student & Guardian Details</th>
                <th className="py-3 px-4">Admission ID</th>
                <th className="py-3 px-4">Term Standing</th>
                <th className="py-3 px-4 text-center">Mark Attendance Status</th>
                <th className="py-3 px-4 w-32">Arrival / Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const entry = draftEntries[student.id] || {
                    studentId: student.id,
                    studentName: student.name,
                    status: 'Not Marked'
                  };
                  const currentStatus = entry.status;

                  return (
                    <tr
                      key={student.id}
                      ref={(el) => {
                        rowRefs.current[student.id] = el;
                      }}
                      className={`transition-colors ${
                        highlightedStudentId === student.id
                          ? 'bg-amber-100/90 ring-2 ring-amber-400'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Roll Number */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-700 text-center">
                        #{student.rollNo}
                      </td>

                      {/* Student Info (Clickable for Profile) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setViewingStudent(student)}
                            className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center shrink-0 hover:ring-2 hover:ring-emerald-500 transition-all"
                            title="View official student profile"
                          >
                            {student.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => setViewingStudent(student)}
                              className="font-bold text-slate-900 text-xs hover:text-emerald-700 text-left block transition-colors"
                            >
                              {student.name}
                            </button>
                            <span className="text-[11px] text-slate-400 block">
                              Parent: {student.parentName} ({student.parentPhone})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Admission ID */}
                      <td className="py-3 px-4 font-mono text-slate-600">{student.admissionId}</td>

                      {/* Overall Attendance Rate */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                              student.attendanceRate >= 85
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {student.attendanceRate}%
                          </span>
                          {student.attendanceRate < 85 && (
                            <span className="text-[10px] text-rose-600 font-bold">Watchlist</span>
                          )}
                        </div>
                      </td>

                      {/* Status Buttons */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => updateStudentEntry(student.id, 'Present')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStudentEntry(student.id, 'Absent')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStudentEntry(student.id, 'Late')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'Late'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <Clock3 className="w-3.5 h-3.5" />
                            <span>Late</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStudentEntry(student.id, 'Excused')}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              currentStatus === 'Excused'
                                ? 'bg-teal-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            <HeartHandshake className="w-3.5 h-3.5" />
                            <span>Excused</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateStudentEntry(student.id, 'Half Day')}
                            className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'Half Day'
                                ? 'bg-indigo-700 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Half Day
                          </button>
                        </div>
                      </td>

                      {/* Optional Arrival Time & Remarks */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {currentStatus === 'Late' && (
                            <input
                              type="text"
                              value={entry.arrivalTime || ''}
                              onChange={(e) =>
                                updateStudentEntry(student.id, 'Late', { arrivalTime: e.target.value })
                              }
                              placeholder="08:45"
                              className="w-full p-1 bg-amber-50 border border-amber-200 rounded font-mono text-[11px] text-amber-900"
                              title="Arrival Time"
                            />
                          )}
                          <input
                            type="text"
                            value={entry.remarks || ''}
                            onChange={(e) =>
                              updateStudentEntry(student.id, currentStatus, { remarks: e.target.value })
                            }
                            placeholder="Add remarks..."
                            className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info strip */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredStudents.length}</span> of{' '}
            <span className="font-bold text-slate-800">{classStudents.length}</span> enrolled students.
          </div>
          <div className="flex items-center gap-3">
            {isSubmitted && existingRecord && (
              <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Submitted by {existingRecord.submittedBy || 'Teacher'} at {existingRecord.submittedAt?.slice(11, 16) || '08:35'}
              </span>
            )}
            <button
              type="button"
              onClick={handleTriggerSubmit}
              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg transition-colors shadow-xs"
            >
              Confirm & Submit Register
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog: Mark All Present */}
      {showMarkAllConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mark Entire Class Present?</h3>
              <p className="text-slate-500 mt-1">
                This deliberate action will set all {classStudents.length} enrolled students in {targetClass?.name} to <strong>Present</strong> with default arrival timestamp (08:25 AM). You can subsequently adjust individual late or absent students.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMarkAllConfirm(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
              >
                Yes, Mark All Present
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Dialog: Unmarked Students Exist */}
      {showUnmarkedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Unmarked Students Detected</h3>
              <p className="text-slate-500 mt-1">
                There are <strong className="text-amber-800 font-mono">{tallies.notMarked}</strong> student(s) currently set to <em>Not Marked</em>.
                According to school rules, unmarked students will not receive presence credit.
              </p>
              <p className="text-slate-500 mt-2">
                Would you prefer to review unmarked students, or proceed with submission?
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowUnmarkedWarning(false);
                  setFilterStatus('Not Marked');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold"
              >
                Review Unmarked Students
              </button>
              <button
                type="button"
                onClick={handleExecuteSubmit}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUBMISSION REVIEW DIALOG (Prompt 1 specification) ================= */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Review Attendance Before Submission
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Greenfield International School · Class Roll Call Register
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session Context Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">School</span>
                <span className="font-bold text-slate-800">Greenfield International School</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Academic Term</span>
                <span className="font-bold text-slate-800">
                  {academicYears.find((y) => y.id === activeAcademicYearId)?.name || 'AY 2026–2027'} · Term 1
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Date</span>
                <span className="font-bold text-slate-800 font-mono">{selectedDate}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Class Division</span>
                <span className="font-bold text-slate-800">{targetClass?.name || selectedClassId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Timetable Period</span>
                <span className="font-bold text-slate-800">{selectedPeriod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Class Mentor</span>
                <span className="font-bold text-slate-800">{targetClass?.classTeacherName || 'Class Mentor'}</span>
              </div>
            </div>

            {/* Counters Summary */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block">Total Students</span>
                <span className="text-lg font-black font-mono text-slate-900">{tallies.total}</span>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 block">Present</span>
                <span className="text-lg font-black font-mono text-emerald-800">{tallies.present}</span>
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 block">Absent</span>
                <span className="text-lg font-black font-mono text-rose-800">{tallies.absent}</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 block">Not Marked</span>
                <span className={`text-lg font-black font-mono ${tallies.notMarked > 0 ? 'text-amber-800' : 'text-slate-400'}`}>
                  {tallies.notMarked}
                </span>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <span className="text-[10px] font-bold text-slate-500 block">Completion</span>
                <span className="text-lg font-black font-mono text-emerald-800">
                  {tallies.total > 0 ? Math.round(((tallies.total - tallies.notMarked) / tallies.total) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Itemized Absent Students */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Absent Students ({absentStudents.length}):
              </span>
              {absentStudents.length > 0 ? (
                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200">
                  {absentStudents.map((s) => (
                    <div key={s.id} className="p-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{s.name}</span>
                        <span className="font-mono text-[10px] text-slate-500">({s.admissionId})</span>
                      </div>
                      <span className="text-rose-700 font-bold font-mono text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        ✕ Absent
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200 text-center">
                  No students are marked absent for this session.
                </div>
              )}
            </div>

            {/* Incomplete Submission Rule Enforcement */}
            {tallies.notMarked > 0 ? (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Incomplete Attendance: {tallies.notMarked} Student(s) Not Marked</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  Greenfield International School policy requires all students to be marked before final submission. Incomplete registers cannot be submitted.
                </p>
              </div>
            ) : null}

            {/* Actions: Return to Register & Confirm and Submit */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Return to Register
              </button>

              <button
                type="button"
                onClick={() => {
                  handleExecuteSubmit();
                  setShowReviewModal(false);
                }}
                disabled={tallies.notMarked > 0}
                className={`px-5 py-2 rounded-xl text-white font-bold shadow-sm transition-all flex items-center gap-2 ${
                  tallies.notMarked > 0
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
      )}

      {/* Modals */}
      {viewingStudent && (
        <StudentProfileModal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          student={viewingStudent}
        />
      )}

      {showCorrectionModal && existingRecord && (
        <AttendanceCorrectionModal
          isOpen={true}
          onClose={() => setShowCorrectionModal(false)}
          record={existingRecord}
        />
      )}
    </div>
  );
};
