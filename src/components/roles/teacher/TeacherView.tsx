import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Assignment, MarkEntry, Notice, Student } from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { AttendanceOperationsWorkspace } from '../../attendance/AttendanceOperationsWorkspace';
import { ExaminationWorkspace } from '../../examination/ExaminationWorkspace';
import { SharedNoticeBoard } from '../../common/SharedNoticeBoard';
import { SharedMessagingWorkspace } from '../../common/SharedMessagingWorkspace';
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  CalendarCheck,
  Award,
  FileText,
  Clock,
  FileSpreadsheet,
  Bell,
  MessageSquare,
  User,
  Plus,
  CheckCircle2,
  XCircle,
  Clock3,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  Send,
  X,
  AlertCircle,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Sparkles,
  Smartphone,
  Palette,
  ShieldCheck
} from 'lucide-react';

export const TeacherView: React.FC = () => {
  const {
    classes,
    students,
    teachers,
    timetableEntries,
    periods,
    activeAcademicYearId,
    attendance,
    exams,
    marks,
    assignments,
    notices,
    messages,
    recordAttendance,
    addMarkEntry,
    createAssignment,
    deleteAssignment,
    sendMessage,
    addNotice,
    currentPage,
    setCurrentPage,
    switchRoleAndNavigate,
    setIsThemeModalOpen,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(currentPage || 'dashboard');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-1');

  React.useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);

  // Classes Workspace state
  const [selectedMyClassId, setSelectedMyClassId] = useState<string>('class-10a');
  const [myClassSearch, setMyClassSearch] = useState<string>('');

  // Attendance quick action target
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10a');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Period 1 (08:30 - 09:15)');
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  // Marks workflow states
  const [markClassId, setMarkClassId] = useState<string>('class-10a');
  const [markSubject, setMarkSubject] = useState<string>('Mathematics');
  const [markExamId, setMarkExamId] = useState<string>('exam-1');
  const [markDraft, setMarkDraft] = useState<Record<string, number>>({});
  const [markRemarks, setMarkRemarks] = useState<Record<string, string>>({});

  // Assignment workflow states
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    title: '',
    classId: 'class-10a',
    subject: 'Mathematics',
    description: '',
    dueDate: '2026-10-10'
  });

  // Notice creation modal state
  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false);
  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    category: 'Class' as const,
    targetAudience: 'Grade 10A Students & Parents',
    content: '',
    priority: 'Normal' as const
  });
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState<string>('all');
  const [noticeSearch, setNoticeSearch] = useState<string>('');

  // Chat state
  const [chatText, setChatText] = useState('');

  // Student directory & progress state
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [teacherNotes, setTeacherNotes] = useState<Record<string, string>>({
    'std-10a-01': 'Exceptional algebraic insight; candidate for National Mathematics Olympiad.',
    'std-10a-02': 'Consistent homework submission. Requires light review on quadratic word problems.',
    'std-10a-03': 'Bus delay logged today. Good conceptual engagement in morning session.',
    'std-8a-01': 'Strong academic aptitude. Parent Ramesh Sharma requested follow-up on syllabus pacing.'
  });
  const [editingNoteStudent, setEditingNoteStudent] = useState<Student | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Class students for selected class
  const classStudents = students.filter((s) => s.classId === selectedClassId);
  const markStudents = students.filter((s) => s.classId === markClassId);

  // Initialize attendance draft on class change
  React.useEffect(() => {
    const initial: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    classStudents.forEach((s) => {
      initial[s.id] = 'Present';
    });
    setAttendanceDraft(initial);
  }, [selectedClassId, students]);

  // Handle Attendance Save
  const handleSaveAttendance = () => {
    const records = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      status: attendanceDraft[s.id] || 'Present'
    }));

    recordAttendance(
      selectedClassId,
      selectedPeriod,
      records,
      new Date().toISOString().split('T')[0],
      false,
      'sub-math',
      'Mathematics',
      't-1'
    );
    addToast({
      type: 'success',
      title: 'Roll Call Submitted',
      message: `Attendance submitted for ${classes.find((c) => c.id === selectedClassId)?.name}.`
    });
  };

  // Handle Assignment Create
  const handlePublishAssignment = (e: React.FormEvent) => {
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
  };

  // Handle Notice Create
  const handlePublishNotice = (e: React.FormEvent) => {
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
      title: 'Notice Broadcasted',
      message: 'Class announcement successfully published to student & parent portals.'
    });
  };

  // Save Teacher Observation Note
  const handleSaveObservation = () => {
    if (!editingNoteStudent) return;
    setTeacherNotes((prev) => ({
      ...prev,
      [editingNoteStudent.id]: tempNoteText
    }));
    setEditingNoteStudent(null);
    setTempNoteText('');
    addToast({
      type: 'success',
      title: 'Observation Saved',
      message: `Teacher observation recorded for ${editingNoteStudent.name}.`
    });
  };

  // Assigned classes for Dr. Vikram Sharma
  const assignedClassIds = ['class-10a', 'class-10b', 'class-9a', 'class-8a'];
  const teacherClasses = classes.filter((c) => assignedClassIds.includes(c.id));
  const activeMyClass = classes.find((c) => c.id === selectedMyClassId) || teacherClasses[0] || classes[0];
  const activeClassStudents = students.filter((s) => s.classId === activeMyClass.id);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar */}
      <RoleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* ================= PROFILE ================= */}
        {activeTab === 'profile' && <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />}

        {/* ================= DASHBOARD (OVERVIEW) ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Workstation</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Good morning, Dr. Sharma. Here is your daily teaching schedule, assigned classes, and priority action items.
                </p>
              </div>

              {/* Quick action shortcuts */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-90 rounded-lg shadow-sm transition-opacity"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Take Attendance</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('assignments');
                    setShowCreateAssignmentModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Assignment</span>
                </button>
                <button
                  onClick={() => setActiveTab('marks')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Enter Marks</span>
                </button>
                <button
                  onClick={() => switchRoleAndNavigate('teacher_mobile')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg shadow-sm transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile App</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('classes')}
                className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
              >
                <span className="text-xs font-medium text-slate-500 block">Assigned Classes</span>
                <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">4 Cohorts</span>
                <span className="text-[11px] text-theme-primary font-medium block mt-1">Grade 10A Mentor</span>
              </div>
              <div
                onClick={() => setActiveTab('attendance')}
                className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
              >
                <span className="text-xs font-medium text-slate-500 block">Grade 10A Attendance</span>
                <span className="text-2xl font-bold text-emerald-800 font-mono mt-1 block">
                  {classes.find((c) => c.id === 'class-10a')?.attendanceToday}%
                </span>
                <span className="text-[11px] text-emerald-600 block mt-1">Logged for Period 1</span>
              </div>
              <div
                onClick={() => setActiveTab('assignments')}
                className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
              >
                <span className="text-xs font-medium text-slate-500 block">Active Coursework</span>
                <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">
                  {assignments.filter((a) => a.teacherId === 't-1').length} Assignments
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">1 due this Friday</span>
              </div>
              <div
                onClick={() => setActiveTab('marks')}
                className="bg-white p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
              >
                <span className="text-xs font-medium text-slate-500 block">Marks Pending Entry</span>
                <span className="text-2xl font-bold text-amber-700 font-mono mt-1 block">1 Exam</span>
                <span className="text-[11px] text-amber-700 block mt-1">Term 1 Math Final</span>
              </div>
            </div>

            {/* Schedule & Priority Tasks split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily teaching schedule */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule</h3>
                    <p className="text-xs text-slate-500">Classroom allocations and period timestamps</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="text-xs font-mono font-semibold text-theme-primary bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                  >
                    View Weekly Timetable →
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { period: 'Period 1', time: '08:30 - 09:15', class: 'Grade 10A', subject: 'Advanced Algebra', room: 'Room 301', status: 'Completed' },
                    { period: 'Period 2', time: '09:20 - 10:05', class: 'Grade 9A', subject: 'Linear Equations', room: 'Room 205', status: 'Upcoming' },
                    { period: 'Period 4', time: '11:15 - 12:00', class: 'Grade 8A', subject: 'Algebraic Foundations', room: 'Room 108', status: 'Upcoming' },
                    { period: 'Period 6', time: '01:35 - 02:20', class: 'Grade 10B', subject: 'Quadratic Curves', room: 'Room 302', status: 'Upcoming' }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-16 font-mono font-bold text-slate-900">{s.period}</span>
                        <div>
                          <span className="font-bold text-slate-900 block">{s.subject} ({s.class})</span>
                          <span className="text-slate-500 text-[11px]">{s.time} · {s.room}</span>
                        </div>
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

              {/* Priority Tasks & Communications Preview */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Priority Action Items</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg">
                      <span className="font-bold text-emerald-900 block">Grade 10A Attendance Verified</span>
                      <p className="text-slate-600 mt-1">Roll call marked with 93.8% presence. 1 student absent.</p>
                    </div>
                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-lg">
                      <span className="font-bold text-amber-900 block">Olympiad Nomination</span>
                      <p className="text-slate-600 mt-1">Parent appointment scheduled with Ramesh Sharma regarding Aarav.</p>
                    </div>
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-lg">
                      <span className="font-bold text-blue-900 block">Class Circular Pending</span>
                      <p className="text-slate-600 mt-1">Midterm revision schedule announcement for Grade 10A.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => setActiveTab('messages')}
                    className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    Open Parent Messages →
                  </button>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  >
                    Broadcast Class Circular →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MY CLASSES WORKSPACE ================= */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Assigned Classes & Cohorts</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage class rosters, homeroom mentorship, and launch rapid session workflows.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('attendance');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-theme-primary rounded-lg shadow-xs"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Take Attendance</span>
                </button>
                <button
                  onClick={() => {
                    setNewAssignmentForm((prev) => ({ ...prev, classId: activeMyClass.id }));
                    setShowCreateAssignmentModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Assignment</span>
                </button>
              </div>
            </div>

            {/* Class Cards Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {teacherClasses.map((cls) => {
                const isSelected = cls.id === activeMyClass.id;
                const isMentor = cls.id === 'class-10a';
                return (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedMyClassId(cls.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-white border-theme-primary shadow-sm ring-2 ring-theme-primary/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isMentor && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Class Mentor
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900">{cls.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{cls.room} · Section {cls.section || 'A'}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Students</span>
                        <span className="font-bold text-slate-800 font-mono">
                          {students.filter((s) => s.classId === cls.id).length} Enrolled
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-medium">Attendance</span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {cls.attendanceToday}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Class Deep-Dive Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{activeMyClass.name} Detailed Roster</h2>
                    {activeMyClass.id === 'class-10a' && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                        Homeroom Mentorship Division
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Curriculum: Mathematics & STEM · Room: {activeMyClass.room} · Enrolled: {activeClassStudents.length} Students
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search class students..."
                      value={myClassSearch}
                      onChange={(e) => setMyClassSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Roll #</th>
                      <th className="py-3 px-4">Admission ID</th>
                      <th className="py-3 px-4">Attendance Index</th>
                      <th className="py-3 px-4">Academic Status</th>
                      <th className="py-3 px-4">Parent / Guardian</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeClassStudents
                      .filter((s) => {
                        if (!myClassSearch.trim()) return true;
                        const term = myClassSearch.toLowerCase();
                        return (
                          s.name.toLowerCase().includes(term) ||
                          s.admissionId.toLowerCase().includes(term) ||
                          String(s.rollNo).includes(term)
                        );
                      })
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                                {st.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{st.name}</span>
                                <span className="text-[11px] text-slate-400">Class {activeMyClass.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">#{st.rollNo}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{st.admissionId}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                                st.attendanceRate >= 90
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : st.attendanceRate >= 75
                                  ? 'bg-blue-50 text-blue-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {st.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                st.academicStatus === 'Exceeding'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : st.academicStatus === 'On Track'
                                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {st.academicStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 block">{st.parentName}</span>
                            <span className="font-mono text-slate-400 text-[11px]">{st.parentPhone}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setViewingStudent(st)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Profile</span>
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

        {/* ================= ATTENDANCE WORKSPACE ================= */}
        {activeTab === 'attendance' && (
          <AttendanceOperationsWorkspace
            defaultTab="student_attendance"
            initialTeacherId={selectedTeacherId}
            defaultAttendanceMode="matrix"
          />
        )}

        {/* ================= TIMETABLE ================= */}
        {activeTab === 'timetable' && (() => {
          const teacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];
          const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;
          const myEntries = timetableEntries.filter(
            (e) => e.teacherId === teacher.id && e.academicYearId === activeAcademicYearId
          );

          return (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Timetable</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Synchronized teaching schedule, classroom allocations, and prep periods.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Viewing Faculty:</span>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Weekly summary KPI */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Assigned Teaching Periods</span>
                  <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
                    {myEntries.length} periods/week
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
                    Active academic year schedule
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Cohort Divisions Taught</span>
                  <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
                    {Array.from(new Set(myEntries.map((e) => e.classId))).length} Classes
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {teacher.subjectSpecialization || teacher.department}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs text-slate-500 font-medium">Planning & Office Hours</span>
                  <span className="text-2xl font-extrabold font-mono text-slate-900 mt-1 block">
                    {30 - myEntries.length} slots
                  </span>
                  <span className="text-[11px] text-teal-700 font-medium mt-0.5 block">
                    Available for student mentoring
                  </span>
                </div>
              </div>

              {/* Weekly Timetable Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                        <th className="py-3 px-3.5 w-36 border-r border-slate-200">Time / Period</th>
                        {workingDays.map((day) => (
                          <th key={day} className="py-3 px-3.5 text-center border-r border-slate-200 last:border-r-0">
                            <span className="font-extrabold text-slate-900 block">{day}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {periods.map((period) => {
                        const isBreak = period.type === 'Break' || period.type === 'Lunch';
                        if (isBreak) {
                          return (
                            <tr key={period.id} className="bg-slate-50/70 border-y border-slate-200">
                              <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-slate-500 font-mono text-[11px]">
                                {period.startTime} - {period.endTime}
                              </td>
                              <td colSpan={workingDays.length} className="py-2 px-4 text-center font-bold text-slate-500 uppercase text-xs">
                                ☕ {period.name} ({period.startTime} – {period.endTime})
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={period.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3.5 border-r border-slate-200 align-top bg-slate-50/40">
                              <div className="font-extrabold text-slate-900">{period.name}</div>
                              <div className="text-[11px] font-mono text-slate-500">{period.startTime}–{period.endTime}</div>
                            </td>

                            {workingDays.map((day) => {
                              const entry = myEntries.find((e) => e.dayOfWeek === day && e.periodId === period.id);
                              const targetClass = classes.find((c) => c.id === entry?.classId);

                              return (
                                <td key={day} className="p-2 border-r border-slate-200 last:border-r-0 align-top h-20 min-w-[140px]">
                                  {entry ? (
                                    <div className="h-full p-2.5 rounded-lg border border-teal-200 bg-teal-50/60 text-teal-950 flex flex-col justify-between">
                                      <div>
                                        <span className="font-extrabold text-xs block text-slate-900">
                                          {targetClass?.name || entry.classId}
                                        </span>
                                        <span className="text-[11px] text-teal-900 font-semibold block mt-0.5">
                                          {entry.subjectName}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 border-t border-teal-200/50 pt-1">
                                        <span>{entry.room}</span>
                                        <span className="font-mono text-emerald-800 font-bold">✓ Live</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="h-full rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-400 font-medium">
                                      Prep / Free Slot
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ================= ASSIGNMENTS WORKFLOW ================= */}
        {activeTab === 'assignments' && (
          <ExaminationWorkspace defaultTab="assignments" teacherId="t-1" />
        )}

        {/* ================= EXAMINATIONS WORKFLOW ================= */}
        {activeTab === 'exams' && (
          <ExaminationWorkspace defaultTab="schedule" teacherId="t-1" />
        )}

        {/* ================= MARKS & RESULTS WORKFLOW ================= */}
        {activeTab === 'marks' && (
          <ExaminationWorkspace defaultTab="marks" teacherId="t-1" />
        )}

        {/* ================= STUDENT PROGRESS WORKSPACE ================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Academic Progress & Portfolio</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Track academic progress, attendance compliance, and mentor observations for your students.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="all">All Assigned Cohorts</option>
                  <option value="class-10a">Grade 10A (Mentor)</option>
                  <option value="class-10b">Grade 10B</option>
                  <option value="class-9a">Grade 9A</option>
                  <option value="class-8a">Grade 8A</option>
                </select>

                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="all">All Standing Statuses</option>
                  <option value="Exceeding">Exceeding Expectations</option>
                  <option value="On Track">On Track</option>
                  <option value="Needs Attention">Needs Attention</option>
                </select>
              </div>
            </div>

            {/* Quick Metrics */}
            {(() => {
              const assignedStudents = students.filter((s) => {
                const isAssigned = assignedClassIds.includes(s.classId);
                const matchesClass = studentClassFilter === 'all' || s.classId === studentClassFilter;
                const matchesStatus = studentStatusFilter === 'all' || s.academicStatus === studentStatusFilter;
                return isAssigned && matchesClass && matchesStatus;
              });
              const avgAtt = Math.round(
                assignedStudents.reduce((acc, curr) => acc + curr.attendanceRate, 0) / (assignedStudents.length || 1)
              );
              const exceedingCount = assignedStudents.filter((s) => s.academicStatus === 'Exceeding').length;
              const atRiskCount = assignedStudents.filter((s) => s.attendanceRate < 85 || s.academicStatus === 'Needs Attention').length;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium block">Monitored Students</span>
                    <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">
                      {assignedStudents.length} Students
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">Across assigned divisions</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium block">Cohort Attendance Index</span>
                    <span className="text-2xl font-bold text-emerald-800 font-mono mt-1 block">
                      {avgAtt}%
                    </span>
                    <span className="text-[11px] text-emerald-600 block mt-1">Above institutional threshold</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium block">Academic High Achievers</span>
                    <span className="text-2xl font-bold text-theme-primary font-mono mt-1 block">
                      {exceedingCount} Students
                    </span>
                    <span className="text-[11px] text-theme-primary block mt-1">Exceeding grade rubric</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs text-slate-500 font-medium block">At-Risk Watchlist</span>
                    <span className="text-2xl font-bold text-rose-700 font-mono mt-1 block">
                      {atRiskCount} Flagged
                    </span>
                    <span className="text-[11px] text-rose-600 block mt-1">Attendance &lt; 85% or support</span>
                  </div>
                </div>
              );
            })()}

            {/* Search Input */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name, roll number, or admission ID..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Roll #</th>
                    <th className="py-3 px-4">Attendance Rate</th>
                    <th className="py-3 px-4">Academic Status</th>
                    <th className="py-3 px-4">Faculty Observations</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((s) => {
                      const matchesAssigned = assignedClassIds.includes(s.classId);
                      const matchesClass = studentClassFilter === 'all' || s.classId === studentClassFilter;
                      const matchesStatus = studentStatusFilter === 'all' || s.academicStatus === studentStatusFilter;
                      const matchesSearch =
                        !studentSearch ||
                        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.admissionId.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        String(s.rollNo).includes(studentSearch);
                      return matchesAssigned && matchesClass && matchesStatus && matchesSearch;
                    })
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                              {st.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{st.name}</span>
                              <span className="text-[11px] font-mono text-slate-400">ID: {st.admissionId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">
                            {classes.find((c) => c.id === st.classId)?.name || st.classId.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">#{st.rollNo}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              st.attendanceRate >= 90
                                ? 'bg-emerald-50 text-emerald-800'
                                : st.attendanceRate >= 75
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-rose-50 text-rose-800'
                            }`}
                          >
                            {st.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              st.academicStatus === 'Exceeding'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : st.academicStatus === 'On Track'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {st.academicStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          {teacherNotes[st.id] ? (
                            <p className="text-slate-600 line-clamp-1 italic cursor-pointer hover:text-slate-900" onClick={() => { setEditingNoteStudent(st); setTempNoteText(teacherNotes[st.id]); }}>
                              "{teacherNotes[st.id]}"
                            </p>
                          ) : (
                            <button
                              onClick={() => { setEditingNoteStudent(st); setTempNoteText(''); }}
                              className="text-slate-400 hover:text-theme-primary text-[11px] flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add note</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingNoteStudent(st);
                                setTempNoteText(teacherNotes[st.id] || '');
                              }}
                              className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
                              title="Edit Observation"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setViewingStudent(st)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Profile</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= ANNOUNCEMENTS WORKSPACE ================= */}
        {activeTab === 'notices' && <SharedNoticeBoard />}

        {/* ================= PARENT & INTERNAL COMMUNICATIONS ================= */}
        {activeTab === 'messages' && <SharedMessagingWorkspace />}

        {/* ================= SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Teacher Workstation Preferences</h1>
              <p className="text-xs text-slate-500 mt-1">Configure profile data, notification preferences, and workspace options.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Faculty Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Teacher Name</span>
                  <input
                    type="text"
                    disabled
                    value="Dr. Vikram Sharma"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Faculty ID</span>
                  <input
                    type="text"
                    disabled
                    value="FAC-2019-101"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Primary Department</span>
                  <input
                    type="text"
                    disabled
                    value="Mathematics & STEM"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Office Station</span>
                  <input
                    type="text"
                    disabled
                    value="Faculty Block B-102"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(true)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Palette className="w-4 h-4 text-slate-600" />
                  <span>Customize Theme Palette</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchRoleAndNavigate('teacher_mobile')}
                  className="px-4 py-2.5 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Launch Teacher Mobile App</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: CREATE ASSIGNMENT ================= */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-theme-primary text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Create New Assignment</h3>
                <p className="text-xs opacity-80">Broadcasts coursework to student & parent portals</p>
              </div>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="opacity-80 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishAssignment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Word Problems Chapter 4"
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Class</label>
                  <select
                    value={newAssignmentForm.classId}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, classId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {teacherClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={newAssignmentForm.subject}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, subject: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Submission Deadline</label>
                <input
                  type="date"
                  required
                  value={newAssignmentForm.dueDate}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instructions / Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Specific problem questions, reference page numbers, and formatting rules..."
                  value={newAssignmentForm.description}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateAssignmentModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-90 rounded-lg shadow-sm"
                >
                  Publish to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE NOTICE ================= */}
      {showCreateNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-theme-primary text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Draft Class Circular</h3>
                <p className="text-xs opacity-80">Publishes notice to student & parent dashboards</p>
              </div>
              <button onClick={() => setShowCreateNoticeModal(false)} className="opacity-80 hover:opacity-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics Formula Sheet & Term 1 Study Guide"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newNoticeForm.category}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, category: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Class">Class Specific</option>
                    <option value="Exam">Examination</option>
                    <option value="Event">Event</option>
                    <option value="Important">Important</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newNoticeForm.priority}
                    onChange={(e) => setNewNoticeForm({ ...newNoticeForm, priority: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                <input
                  type="text"
                  required
                  value={newNoticeForm.targetAudience}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetAudience: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Announcement Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed guidelines, reference materials, or timing updates..."
                  value={newNoticeForm.content}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateNoticeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-90 rounded-lg shadow-sm"
                >
                  Broadcast Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT OBSERVATION NOTE ================= */}
      {editingNoteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Faculty Observation: {editingNoteStudent.name}</h3>
              <button onClick={() => setEditingNoteStudent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-500">Record academic remarks, learning behavior observations, or mentorship notes.</p>
              <textarea
                rows={4}
                value={tempNoteText}
                onChange={(e) => setTempNoteText(e.target.value)}
                placeholder="Enter teacher observation..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNoteStudent(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveObservation}
                  className="px-4 py-1.5 rounded-lg bg-theme-primary text-white font-bold shadow-xs hover:opacity-90"
                >
                  Save Observation
                </button>
              </div>
            </div>
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
