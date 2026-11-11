import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { Student, StudentAttendanceStatus, StudentAttendanceEntry } from '../../../types';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import {
  Home,
  Layers,
  CalendarCheck,
  MoreHorizontal,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Clock3,
  Award,
  Plus,
  BookOpen,
  Calendar,
  Bell,
  Eye,
  Sparkles,
  ArrowLeft,
  Search,
  Send,
  X,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Settings,
  Palette,
  Laptop
} from 'lucide-react';

export const TeacherMobile: React.FC = () => {
  const {
    classes,
    students,
    attendance,
    recordAttendance,
    assignments,
    createAssignment,
    notices,
    addNotice,
    timetableEntries,
    periods,
    userProfiles,
    updateUserProfile,
    switchRoleAndNavigate,
    setIsWelcomeScreen,
    setIsThemeModalOpen,
    addToast,
    marks,
    addMarkEntry,
    exams
  } = useApp();

  const profile = userProfiles.teacher_mobile || userProfiles.teacher;

  // Primary 4 Tabs
  const [activeTab, setActiveTab] = useState<'home' | 'classes' | 'attendance' | 'more'>('home');

  // More screen navigation
  const [moreSubScreen, setMoreSubScreen] = useState<
    'menu' | 'timetable' | 'assignments' | 'exams' | 'marks' | 'students' | 'notices' | 'settings'
  >('menu');

  // Timetable State
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<
    'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'
  >('Monday');

  // Classes Workspace State
  const [selectedClassDetailId, setSelectedClassDetailId] = useState<string>('class-10a');
  const [classesSearch, setClassesSearch] = useState<string>('');

  // Attendance Workspace State
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10a');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Period 1 (08:30 - 09:15)');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, StudentAttendanceStatus>>({});
  const [lateTimes, setLateTimes] = useState<Record<string, string>>({});
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Marks Workspace State
  const [markClassId, setMarkClassId] = useState<string>('class-10a');
  const [markSubject, setMarkSubject] = useState<string>('Mathematics');
  const [markExamId, setMarkExamId] = useState<string>('exam-1');
  const [mobileMarksDraft, setMobileMarksDraft] = useState<Record<string, number>>({});

  // Assignments Workspace State
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    title: '',
    classId: 'class-10a',
    subject: 'Mathematics',
    description: '',
    dueDate: '2026-10-10'
  });

  // Announcements Workspace State
  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false);
  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    category: 'Class' as const,
    targetAudience: 'Grade 10A Students & Parents',
    content: '',
    priority: 'Normal' as const
  });

  // Active teacher slots (Dr. Vikram Sharma = t-1)
  const teacherId = 't-1';
  const mySlots = timetableEntries.filter((e) => e.teacherId === teacherId);
  const currentDaySlots = mySlots.filter((e) => e.dayOfWeek === selectedTimetableDay);

  // Assigned classes
  const assignedClassIds = ['class-10a', 'class-10b', 'class-9a', 'class-8a'];
  const teacherClasses = classes.filter((c) => assignedClassIds.includes(c.id));

  // Current attendance class students
  const classStudents = students.filter((s) => s.classId === selectedClassId);

  // Sync draft when class changes
  useEffect(() => {
    const draft: Record<string, StudentAttendanceStatus> = {};
    classStudents.forEach((s) => {
      draft[s.id] = 'Present';
    });
    setAttendanceDraft(draft);
  }, [selectedClassId, students]);

  const handleMarkAllPresent = () => {
    const updated: Record<string, StudentAttendanceStatus> = {};
    classStudents.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setAttendanceDraft(updated);
    addToast({
      type: 'info',
      title: 'All Marked Present',
      message: 'All enrolled students marked Present for this session.'
    });
  };

  const handleSaveAttendance = (isDraft: boolean = false) => {
    const records: StudentAttendanceEntry[] = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceDraft[s.id] || 'Present',
      arrivalTime: attendanceDraft[s.id] === 'Late' ? lateTimes[s.id] || '08:45 AM' : undefined
    }));

    const res = recordAttendance(
      selectedClassId,
      selectedPeriod,
      records,
      sessionDate,
      isDraft,
      'sub-math',
      'Mathematics',
      't-1'
    );
    if (res.success) {
      addToast({
        type: 'success',
        title: isDraft ? 'Attendance Draft Saved' : 'Attendance Submitted',
        message: isDraft
          ? `Draft saved for ${classes.find((c) => c.id === selectedClassId)?.name}.`
          : `Official register submitted for ${classes.find((c) => c.id === selectedClassId)?.name}.`
      });
      setActiveTab('home');
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentForm.title.trim()) return;

    const matchedClass = classes.find((c) => c.id === newAssignmentForm.classId);

    createAssignment({
      title: newAssignmentForm.title,
      classId: newAssignmentForm.classId,
      className: matchedClass ? matchedClass.name : newAssignmentForm.classId,
      subject: newAssignmentForm.subject,
      teacherId: 't-1',
      teacherName: 'Dr. Vikram Sharma',
      description: newAssignmentForm.description,
      dueDate: newAssignmentForm.dueDate,
      status: 'Published'
    });

    setShowCreateAssignmentModal(false);
    setNewAssignmentForm({
      title: '',
      classId: 'class-10a',
      subject: 'Mathematics',
      description: '',
      dueDate: '2026-10-10'
    });
    addToast({
      type: 'success',
      title: 'Assignment Published',
      message: 'Coursework posted to student and parent apps.'
    });
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeForm.title.trim() || !newNoticeForm.content.trim()) return;

    addNotice({
      title: newNoticeForm.title,
      content: newNoticeForm.content,
      category: newNoticeForm.category,
      targetAudience: newNoticeForm.targetAudience,
      author: 'Dr. Vikram Sharma (Faculty)',
      priority: newNoticeForm.priority
    });

    setShowCreateNoticeModal(false);
    setNewNoticeForm({
      title: '',
      category: 'Class',
      targetAudience: 'Grade 10A Students & Parents',
      content: '',
      priority: 'Normal'
    });
    addToast({
      type: 'success',
      title: 'Circular Broadcasted',
      message: 'Class announcement successfully published.'
    });
  };

  const handleSaveMarks = () => {
    const selectedExam = exams.find((e) => e.id === markExamId);
    const total = selectedExam ? selectedExam.totalMarks : 100;
    const targetStudents = students.filter((s) => s.classId === markClassId);

    let count = 0;
    targetStudents.forEach((s) => {
      const score = mobileMarksDraft[s.id];
      if (score !== undefined) {
        count++;
        const pct = (score / total) * 100;
        const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
        addMarkEntry({
          examId: markExamId,
          classId: markClassId,
          subject: markSubject,
          studentId: s.id,
          studentName: s.name,
          marksObtained: score,
          totalMarks: total,
          grade,
          remarks: 'Entered via SCHLAR Teacher Mobile App'
        });
      }
    });

    addToast({
      type: 'success',
      title: 'Marks Saved',
      message: `Updated scores for ${count} students in ${classes.find((c) => c.id === markClassId)?.name}.`
    });
  };

  const presentCount = Object.values(attendanceDraft).filter((v) => v === 'Present').length;
  const absentCount = Object.values(attendanceDraft).filter((v) => v === 'Absent').length;
  const lateCount = Object.values(attendanceDraft).filter((v) => v === 'Late').length;
  const excusedCount = Object.values(attendanceDraft).filter((v) => v === 'Excused').length;

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-hidden">
      {/* Top Mobile App Bar */}
      <div className="h-14 bg-theme-primary text-white px-4 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center font-bold text-xs text-white">
            VS
          </div>
          <div>
            <h2 className="text-xs font-bold leading-tight">Dr. Vikram Sharma</h2>
            <p className="text-[10px] opacity-80">Grade 10A Mentor · Mathematics</p>
          </div>
        </div>
        <button
          onClick={() => switchRoleAndNavigate('teacher')}
          className="text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1 transition-colors"
          title="Switch to Web Workstation"
        >
          <Laptop className="w-3 h-3" />
          <span>Web Portal</span>
        </button>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= 1. HOME TAB ================= */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            {/* Header greeting card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] text-slate-400 block font-medium">Monday Teaching Session</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">Good Morning, Dr. Sharma</h3>
              <p className="text-xs text-slate-500 mt-1">
                You have 4 teaching periods assigned today across 4 cohorts.
              </p>
            </div>

            {/* Next Class Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                    Next Lesson
                  </span>
                  <h4 className="text-lg font-extrabold mt-2">Grade 10A · Advanced Algebra</h4>
                  <p className="text-xs text-slate-300 mt-0.5">Room 301 · 08:30 – 09:15</p>
                </div>
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-xs">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-mono">Roll call pending</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClassId('class-10a');
                    setActiveTab('attendance');
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-transform flex items-center gap-1 shadow-sm"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Take Attendance</span>
                </button>
              </div>
            </div>

            {/* Quick Action Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('classes')}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 text-left flex items-center gap-3 active:scale-98 transition-transform"
              >
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">My Classes</span>
                  <span className="text-[10px] text-slate-400">4 Cohorts</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('more');
                  setMoreSubScreen('timetable');
                }}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 text-left flex items-center gap-3 active:scale-98 transition-transform"
              >
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Timetable</span>
                  <span className="text-[10px] text-slate-400">Weekly Plan</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('more');
                  setMoreSubScreen('assignments');
                  setShowCreateAssignmentModal(true);
                }}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 text-left flex items-center gap-3 active:scale-98 transition-transform"
              >
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">New Task</span>
                  <span className="text-[10px] text-slate-400">Coursework</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('more');
                  setMoreSubScreen('marks');
                }}
                className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 text-left flex items-center gap-3 active:scale-98 transition-transform"
              >
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Enter Marks</span>
                  <span className="text-[10px] text-slate-400">Term 1 Math</span>
                </div>
              </button>
            </div>

            {/* Today's Schedule Overview */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Today's Teaching Schedule
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('more');
                    setMoreSubScreen('timetable');
                  }}
                  className="text-[11px] font-semibold text-theme-primary"
                >
                  Full Week →
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { time: '08:30 - 09:15', class: 'Grade 10A', subject: 'Advanced Algebra', room: 'Room 301', status: 'Completed' },
                  { time: '09:20 - 10:05', class: 'Grade 9A', subject: 'Linear Equations', room: 'Room 205', status: 'Upcoming' },
                  { time: '11:15 - 12:00', class: 'Grade 8A', subject: 'Algebraic Foundations', room: 'Room 108', status: 'Upcoming' },
                  { time: '01:35 - 02:20', class: 'Grade 10B', subject: 'Quadratic Curves', room: 'Room 302', status: 'Upcoming' }
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{s.subject} ({s.class})</span>
                      <span className="text-[10px] text-slate-400">{s.time} · {s.room}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        s.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Circulars Snippet */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Announcements</h3>
                <button
                  onClick={() => {
                    setActiveTab('more');
                    setMoreSubScreen('notices');
                  }}
                  className="text-[11px] font-semibold text-theme-primary"
                >
                  View All ({notices.length}) →
                </button>
              </div>
              {notices.slice(0, 2).map((n) => (
                <div key={n.id} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 line-clamp-1">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 2. CLASSES TAB ================= */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">My Assigned Cohorts</h3>
              <p className="text-xs text-slate-500 mt-0.5">Select a division to inspect enrolled student roster.</p>
            </div>

            {/* Cohort Selector Horizontal Pills */}
            <div className="grid grid-cols-2 gap-2">
              {teacherClasses.map((cls) => {
                const isSelected = cls.id === selectedClassDetailId;
                const isMentor = cls.id === 'class-10a';
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassDetailId(cls.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-theme-primary text-white border-theme-primary shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{cls.name}</span>
                      {isMentor && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          Mentor
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] block mt-1 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {cls.room} · {students.filter((s) => s.classId === cls.id).length} Students
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Class Roster */}
            {(() => {
              const activeClassObj = classes.find((c) => c.id === selectedClassDetailId) || teacherClasses[0];
              const enrolled = students.filter((s) => s.classId === activeClassObj.id);

              return (
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{activeClassObj.name} Student Roster</h4>
                      <p className="text-[11px] text-slate-500">{enrolled.length} enrolled students</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedClassId(activeClassObj.id);
                        setActiveTab('attendance');
                      }}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Take Roll Call</span>
                    </button>
                  </div>

                  {/* Search within class */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search student in this class..."
                      value={classesSearch}
                      onChange={(e) => setClassesSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  {/* Student list */}
                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {enrolled
                      .filter((s) => {
                        if (!classesSearch.trim()) return true;
                        const term = classesSearch.toLowerCase();
                        return (
                          s.name.toLowerCase().includes(term) ||
                          s.admissionId.toLowerCase().includes(term) ||
                          String(s.rollNo).includes(term)
                        );
                      })
                      .map((st) => (
                        <div
                          key={st.id}
                          className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                              {st.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{st.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{st.rollNo} · {st.academicStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-emerald-800 font-bold text-[11px]">
                              {st.attendanceRate}%
                            </span>
                            <button
                              type="button"
                              onClick={() => setViewingStudent(st)}
                              className="p-1 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900"
                              title="View Profile"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ================= 3. ATTENDANCE TAB ================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            {/* Control Panel */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Period Roll Call Register</h3>
                  <p className="text-[11px] text-slate-500">Fast one-touch presence tracking</p>
                </div>
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold active:scale-95 transition-transform flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>All Present</span>
                </button>
              </div>

              {/* Class, Period & Date selectors */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Class</label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs"
                  >
                    {teacherClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 text-xs"
                  >
                    <option value="Period 1 (08:30 - 09:15)">Period 1 (Math)</option>
                    <option value="Period 2 (09:20 - 10:05)">Period 2 (Algebra)</option>
                    <option value="Period 4 (11:15 - 12:00)">Period 4 (Math Foundations)</option>
                    <option value="Period 6 (01:35 - 02:20)">Period 6 (Statistics)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-1">Date</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 text-[11px]"
                  />
                </div>
              </div>

              {/* Live Count Tally */}
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs font-mono font-bold">
                <span className="text-emerald-800">{presentCount} Present</span>
                <span className="text-rose-700">{absentCount} Absent</span>
                <span className="text-amber-700">{lateCount} Late</span>
                <span className="text-blue-700">{excusedCount} Excused</span>
              </div>
            </div>

            {/* Student List */}
            <div className="space-y-2">
              {classStudents.map((s) => {
                const status = attendanceDraft[s.id] || 'Present';
                return (
                  <div
                    key={s.id}
                    className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setViewingStudent(s)}
                        className="text-left group"
                        title="View Student Profile"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-400 text-[11px]">#{s.rollNo}</span>
                          <span className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                            {s.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {s.admissionId} · {s.attendanceRate}% avg
                        </span>
                      </button>

                      {status === 'Late' && (
                        <input
                          type="text"
                          value={lateTimes[s.id] || '08:45 AM'}
                          onChange={(e) => setLateTimes({ ...lateTimes, [s.id]: e.target.value })}
                          className="w-20 text-[10px] px-1.5 py-0.5 border border-amber-300 bg-amber-50 rounded font-mono text-center text-amber-900"
                          placeholder="Arr. Time"
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-1 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setAttendanceDraft({ ...attendanceDraft, [s.id]: 'Present' })}
                        className={`h-8 rounded-lg text-xs font-bold transition-all ${
                          status === 'Present'
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceDraft({ ...attendanceDraft, [s.id]: 'Absent' })}
                        className={`h-8 rounded-lg text-xs font-bold transition-all ${
                          status === 'Absent'
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceDraft({ ...attendanceDraft, [s.id]: 'Late' })}
                        className={`h-8 rounded-lg text-xs font-bold transition-all ${
                          status === 'Late'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        L
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceDraft({ ...attendanceDraft, [s.id]: 'Excused' })}
                        className={`h-8 rounded-lg text-[11px] font-bold transition-all ${
                          status === 'Excused'
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        EX
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendanceDraft({ ...attendanceDraft, [s.id]: 'Half Day' })}
                        className={`h-8 rounded-lg text-[11px] font-bold transition-all ${
                          status === 'Half Day'
                            ? 'bg-purple-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        HD
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Actions Bar */}
            <div className="sticky bottom-0 pt-2 pb-1 grid grid-cols-2 gap-2 bg-slate-50/90 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => handleSaveAttendance(true)}
                className="h-11 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleSaveAttendance(false)}
                className="h-11 bg-theme-primary hover:opacity-90 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-transform"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Register</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 4. MORE TAB ================= */}
        {activeTab === 'more' && (
          <div className="space-y-4">
            {/* Top Back bar when in a subscreen */}
            {moreSubScreen !== 'menu' && (
              <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMoreSubScreen('menu')}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-1 text-xs font-bold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to More Hub</span>
                </button>
              </div>
            )}

            {/* ================= SUB-SCREEN: MENU HUB ================= */}
            {moreSubScreen === 'menu' && (
              <div className="space-y-4">
                {/* Faculty Card */}
                <div className="bg-theme-primary text-white p-4 rounded-2xl shadow-md flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                    {profile.avatarText}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold truncate">{profile.fullName}</h3>
                    <p className="text-xs opacity-80">{profile.title}</p>
                    <p className="text-[10px] opacity-70 font-mono mt-0.5">Faculty ID: {profile.userId}</p>
                  </div>
                </div>

                {/* Destinations Menu List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('timetable')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Timetable & Schedule</span>
                        <span className="text-[10px] text-slate-400">Weekly teaching timetable</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('assignments')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Assignments & Tasks</span>
                        <span className="text-[10px] text-slate-400">
                          {assignments.filter((a) => a.teacherId === 't-1').length} Active Coursework
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('exams')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Examinations</span>
                        <span className="text-[10px] text-slate-400">Midterm & Final schedules</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('marks')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Marks & Results</span>
                        <span className="text-[10px] text-slate-400">Input student exam scores</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('students')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-50 text-rose-800">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Student Progress</span>
                        <span className="text-[10px] text-slate-400">Academic & attendance dossiers</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('notices')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-teal-50 text-teal-800">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Announcements</span>
                        <span className="text-[10px] text-slate-400">Class circulars & notices</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setMoreSubScreen('settings')}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Profile & Settings</span>
                        <span className="text-[10px] text-slate-400">Account & theme preferences</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Switch to Web Workstation Button */}
                <button
                  type="button"
                  onClick={() => switchRoleAndNavigate('teacher')}
                  className="w-full py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 rounded-2xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Laptop className="w-4 h-4 text-theme-primary" />
                  <span>Switch to Teacher Web Workstation</span>
                </button>
              </div>
            )}

            {/* ================= SUB-SCREEN: TIMETABLE ================= */}
            {moreSubScreen === 'timetable' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Faculty Teaching Timetable</h3>
                  <span className="text-[10px] font-mono text-slate-400">Dr. Vikram Sharma</span>
                </div>

                {/* Day selector pills */}
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl text-[11px] font-semibold">
                  {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedTimetableDay(day)}
                      className={`py-1.5 rounded-lg transition-all ${
                        selectedTimetableDay === day
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-500'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>

                {/* Slots */}
                <div className="space-y-2">
                  {currentDaySlots.length > 0 ? (
                    currentDaySlots.map((slot) => {
                      const clsObj = classes.find((c) => c.id === slot.classId);
                      return (
                        <div
                          key={slot.id}
                          className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{slot.periodName}</span>
                              <span className="font-semibold text-theme-primary">{slot.subjectName}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 block mt-0.5">
                              {clsObj?.name || slot.classId} · {slot.room} · {slot.startTime}–{slot.endTime}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Live
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                      No teaching periods scheduled on {selectedTimetableDay}. Free preparation slot.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= SUB-SCREEN: ASSIGNMENTS ================= */}
            {moreSubScreen === 'assignments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Active Coursework & Tasks</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateAssignmentModal(true)}
                    className="px-2.5 py-1.5 bg-theme-primary text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Task</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {assignments.map((asg) => (
                    <div key={asg.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{asg.title}</span>
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded">
                          {asg.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{asg.description}</p>
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Class: {asg.className}</span>
                        <span>Due: {asg.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SUB-SCREEN: EXAMS ================= */}
            {moreSubScreen === 'exams' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Examination Timetables</h3>
                  <p className="text-[11px] text-slate-500">Upcoming assessment schedules</p>
                </div>

                <div className="space-y-2">
                  {exams.map((ex) => (
                    <div key={ex.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{ex.name}</span>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                          {ex.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Subject: {ex.subject} · Total Marks: {ex.totalMarks}
                      </p>
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Starts: {ex.startDate}</span>
                        <span>Ends: {ex.endDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SUB-SCREEN: MARKS & RESULTS ================= */}
            {moreSubScreen === 'marks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Marks Entry & Evaluation</h3>
                    <p className="text-[11px] text-slate-500">Subject gradebook sync</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveMarks}
                    className="px-3 py-1.5 bg-theme-primary text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Save Marks
                  </button>
                </div>

                {/* Class selector */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Class</label>
                    <select
                      value={markClassId}
                      onChange={(e) => setMarkClassId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                    >
                      {teacherClasses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Exam</label>
                    <select
                      value={markExamId}
                      onChange={(e) => setMarkExamId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-900"
                    >
                      {exams.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Student Score list */}
                <div className="space-y-2">
                  {students
                    .filter((s) => s.classId === markClassId)
                    .map((st) => (
                      <div key={st.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{st.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Roll #{st.rollNo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Score"
                            value={mobileMarksDraft[st.id] ?? ''}
                            onChange={(e) =>
                              setMobileMarksDraft({ ...mobileMarksDraft, [st.id]: Number(e.target.value) })
                            }
                            className="w-16 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono font-bold text-slate-900 text-xs"
                          />
                          <span className="text-slate-400 text-xs">/ 100</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================= SUB-SCREEN: STUDENT PROGRESS ================= */}
            {moreSubScreen === 'students' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Progress Dossiers</h3>
                  <p className="text-[11px] text-slate-500">Tap a student to view academic history</p>
                </div>

                <div className="space-y-2">
                  {students
                    .filter((s) => assignedClassIds.includes(s.classId))
                    .map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setViewingStudent(st)}
                        className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs cursor-pointer hover:border-slate-300"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-slate-800 flex items-center justify-center text-xs">
                            {st.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{st.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {classes.find((c) => c.id === st.classId)?.name} · #{st.rollNo}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-800 block">{st.attendanceRate}%</span>
                          <span className="text-[10px] text-slate-500">{st.academicStatus}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================= SUB-SCREEN: ANNOUNCEMENTS ================= */}
            {moreSubScreen === 'notices' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">School & Class Notices</h3>
                  <button
                    type="button"
                    onClick={() => setShowCreateNoticeModal(true)}
                    className="px-2.5 py-1.5 bg-theme-primary text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {notices.map((n) => (
                    <div key={n.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{n.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{n.content}</p>
                      <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                        Target: {n.targetAudience}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= SUB-SCREEN: SETTINGS ================= */}
            {moreSubScreen === 'settings' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Faculty Settings & Theme</h3>

                {/* Notification Toggles */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
                  <span className="font-bold text-slate-900 block">Notification Preferences</span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Push Notifications for Parent Messages</span>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notificationsPush}
                      onChange={(e) =>
                        updateUserProfile('teacher_mobile', {
                          preferences: { ...profile.preferences, notificationsPush: e.target.checked }
                        })
                      }
                      className="w-4 h-4 accent-theme-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">SMS Urgent Operational Alerts</span>
                    <input
                      type="checkbox"
                      checked={profile.preferences.notificationsSms}
                      onChange={(e) =>
                        updateUserProfile('teacher_mobile', {
                          preferences: { ...profile.preferences, notificationsSms: e.target.checked }
                        })
                      }
                      className="w-4 h-4 accent-theme-primary"
                    />
                  </div>
                </div>

                {/* Theme Customizer Trigger */}
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(true)}
                  className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-2xl text-xs font-bold shadow-xs flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4 text-theme-primary" />
                  <span>Customize Theme Palette</span>
                </button>

                {/* Exit to Welcome Portal */}
                <button
                  type="button"
                  onClick={() => setIsWelcomeScreen(true)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-semibold"
                >
                  Exit to SCHLAR Welcome Portal
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed 4-Destination Bottom Navigation Bar */}
      <div className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 grid grid-cols-4 items-center shrink-0 z-40">
        {[
          { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { id: 'classes', label: 'Classes', icon: <Layers className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
          { id: 'more', label: 'More', icon: <MoreHorizontal className="w-5 h-5" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === 'more') {
                  setMoreSubScreen('menu');
                }
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                isActive ? 'text-theme-primary font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modal: Create Assignment */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Publish New Coursework</h3>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 Practice Exercises"
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class</label>
                  <select
                    value={newAssignmentForm.classId}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, classId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    {teacherClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignmentForm.dueDate}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Instructions for students..."
                  value={newAssignmentForm.description}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-theme-primary text-white font-bold shadow-xs"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Notice */}
      {showCreateNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Broadcast Class Notice</h3>
              <button onClick={() => setShowCreateNoticeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Notice Headline"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Audience</label>
                <input
                  type="text"
                  required
                  value={newNoticeForm.targetAudience}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetAudience: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Notice details..."
                  value={newNoticeForm.content}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateNoticeModal(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-theme-primary text-white font-bold shadow-xs"
                >
                  Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
      />
    </div>
  );
};
