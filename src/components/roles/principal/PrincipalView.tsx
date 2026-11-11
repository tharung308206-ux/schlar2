import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Student, Teacher, Staff, Notice, SchoolEvent } from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { StudentFormModal } from '../../common/StudentFormModal';
import { TeacherFormModal } from '../../common/TeacherFormModal';
import { StaffFormModal } from '../../common/StaffFormModal';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { TeacherProfileModal } from '../../common/TeacherProfileModal';
import { StaffProfileModal } from '../../common/StaffProfileModal';
import { TimetableEditor } from '../../academic/TimetableEditor';
import { AcademicSetupWorkspace } from '../../academic/AcademicSetupWorkspace';
import { ClassSectionWorkspace } from '../../academic/ClassSectionWorkspace';
import { SubjectAllocationWorkspace } from '../../academic/SubjectAllocationWorkspace';
import { AcademicCalendarEvents } from '../../academic/AcademicCalendarEvents';
import { AcademicReports } from '../../academic/AcademicReports';
import { AttendanceOperationsWorkspace } from '../../attendance/AttendanceOperationsWorkspace';
import { ExaminationWorkspace } from '../../examination/ExaminationWorkspace';
import { SharedNoticeBoard } from '../../common/SharedNoticeBoard';
import { SharedMessagingWorkspace } from '../../common/SharedMessagingWorkspace';
import { SharedAuditTrail } from '../../common/SharedAuditTrail';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Briefcase,
  Layers,
  BookOpen,
  CalendarCheck,
  Clock,
  FileSpreadsheet,
  FileText,
  Bell,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  ArrowUpDown,
  BookMarked
} from 'lucide-react';

export const PrincipalView: React.FC = () => {
  const {
    students,
    teachers,
    staff,
    classes,
    attendance,
    exams,
    assignments,
    fees,
    notices,
    events,
    notifications,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    addStaff,
    updateStaff,
    deleteStaff,
    addNotice,
    resetDemoData,
    currentPage,
    setCurrentPage
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(currentPage || 'dashboard');

  React.useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);

  // Student module state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'attendanceRate' | 'rollNo'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [studentPage, setStudentPage] = useState(1);
  const studentPageSize = 8;

  // Student Modals
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [archivingStudent, setArchivingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  // Teacher Modals & Filters
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [teacherDeptFilter, setTeacherDeptFilter] = useState('all');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState('all');

  // Staff Modals & Filters
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<Staff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDeptFilter, setStaffDeptFilter] = useState('all');
  const [staffStatusFilter, setStaffStatusFilter] = useState('all');

  // Notice modal
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Timetable & Academic Sub-navigation
  const [timetableClass, setTimetableClass] = useState('class-10a');
  const [academicSubTab, setAcademicSubTab] = useState<'setup' | 'allocations' | 'performance' | 'reports'>('setup');

  // Form state for Notice
  const [newNoticeForm, setNewNoticeForm] = useState({
    title: '',
    content: '',
    category: 'School' as Notice['category'],
    targetAudience: 'All School Community',
    author: 'Principal Office',
    priority: 'Normal' as Notice['priority']
  });

  // KPI calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalStaff = staff.length;
  const totalClasses = classes.length;
  const avgAttendance = Math.round(
    classes.reduce((sum, c) => sum + c.attendanceToday, 0) / (classes.length || 1)
  );
  const totalFeeCollected = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalFeePending = fees.reduce((sum, f) => sum + f.pending, 0);
  const lowAttendanceStudents = students.filter((s) => s.attendanceRate < 75);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.admissionId.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.parentName.toLowerCase().includes(studentSearch.toLowerCase());
        const matchesClass = studentClassFilter === 'all' || s.classId === studentClassFilter;
        const matchesStatus = studentStatusFilter === 'all' || s.status === studentStatusFilter;
        return matchesSearch && matchesClass && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'name') {
          return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortField === 'attendanceRate') {
          return sortAsc ? a.attendanceRate - b.attendanceRate : b.attendanceRate - a.attendanceRate;
        }
        return sortAsc ? a.rollNo - b.rollNo : b.rollNo - a.rollNo;
      });
  }, [students, studentSearch, studentClassFilter, studentStatusFilter, sortField, sortAsc]);

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * studentPageSize;
    return filteredStudents.slice(start, start + studentPageSize);
  }, [filteredStudents, studentPage, studentPageSize]);

  const totalStudentPages = Math.max(1, Math.ceil(filteredStudents.length / studentPageSize));

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
        (t.staffId && t.staffId.toLowerCase().includes(teacherSearch.toLowerCase())) ||
        t.subjects.some((s) => s.toLowerCase().includes(teacherSearch.toLowerCase()));
      const matchesDept = teacherDeptFilter === 'all' || (t.department && t.department.toLowerCase().includes(teacherDeptFilter.toLowerCase()));
      const matchesStatus = teacherStatusFilter === 'all' || t.status === teacherStatusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [teachers, teacherSearch, teacherDeptFilter, teacherStatusFilter]);

  const filteredStaff = useMemo(() => {
    return staff.filter((st) => {
      const matchesSearch =
        st.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        (st.staffId && st.staffId.toLowerCase().includes(staffSearch.toLowerCase())) ||
        st.role.toLowerCase().includes(staffSearch.toLowerCase());
      const matchesDept = staffDeptFilter === 'all' || st.department.toLowerCase().includes(staffDeptFilter.toLowerCase());
      const matchesStatus = staffStatusFilter === 'all' || st.status === staffStatusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staff, staffSearch, staffDeptFilter, staffStatusFilter]);

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeForm.title.trim()) return;
    addNotice({
      title: newNoticeForm.title,
      content: newNoticeForm.content,
      category: newNoticeForm.category,
      targetAudience: newNoticeForm.targetAudience,
      author: newNoticeForm.author,
      priority: newNoticeForm.priority
    });
    setShowAddNoticeModal(false);
    setNewNoticeForm({
      title: '',
      content: '',
      category: 'School',
      targetAudience: 'All School Community',
      author: 'Principal Office',
      priority: 'Normal'
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'teachers', label: 'Teachers', icon: <Users className="w-4 h-4" /> },
    { id: 'staff', label: 'Staff', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'classes', label: 'Classes', icon: <Layers className="w-4 h-4" /> },
    { id: 'academics', label: 'Academics', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'timetable', label: 'Timetable', icon: <Clock className="w-4 h-4" /> },
    { id: 'exams', label: 'Exams', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> },
    { id: 'notices', label: 'Notices', icon: <Bell className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar navigation */}
      <RoleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content body */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* ================= PROFILE ================= */}
        {activeTab === 'profile' && <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />}

        {/* ================= DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Institutional oversight, real-time enrollment metrics, and cross-departmental operations.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedStudentForEdit(null);
                    setStudentModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Admit Student</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('notices');
                    setShowAddNoticeModal(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
                >
                  <Bell className="w-3.5 h-3.5 text-slate-500" />
                  <span>Post Notice</span>
                </button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Total Students</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  {totalStudents}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +4 this semester
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Teachers & Faculty</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  {totalTeachers}
                </span>
                <span className="text-[11px] text-slate-500 block mt-1">1:14 Faculty ratio</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Today's Attendance</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  {avgAttendance}%
                </span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-1">Nominal threshold</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Fee Collection</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  ${(totalFeeCollected / 1000).toFixed(1)}k
                </span>
                <span className="text-[11px] text-amber-600 font-medium block mt-1">
                  ${(totalFeePending / 1000).toFixed(1)}k outstanding
                </span>
              </div>
            </div>

            {/* Analytics & Schedule split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Class Attendance Distribution */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Attendance by Class</h3>
                    <p className="text-xs text-slate-500">Live morning roll call telemetry across divisions</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Active Session
                  </span>
                </div>

                <div className="space-y-3.5">
                  {classes.map((cls) => (
                    <div key={cls.id}>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-slate-800 font-semibold">{cls.name}</span>
                        <span className="text-slate-600 font-mono">{cls.attendanceToday}% · {cls.studentCount} students</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            cls.attendanceToday >= 95
                              ? 'bg-emerald-600'
                              : cls.attendanceToday >= 90
                              ? 'bg-emerald-700'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${cls.attendanceToday}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Alerts & Notices */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Executive Alerts</h3>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      Action Required
                    </span>
                  </div>

                  <div className="space-y-3">
                    {lowAttendanceStudents.map((s) => (
                      <div key={s.id} className="p-3 bg-rose-50/60 rounded-lg border border-rose-100 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Low Attendance Alert: {s.name}</span>
                        </div>
                        <p className="text-slate-600 mt-1 leading-snug">
                          {s.name} ({s.classId.toUpperCase()}) rate has dipped to{' '}
                          <span className="font-bold text-rose-700 font-mono">{s.attendanceRate}%</span>. Parent contact required.
                        </p>
                      </div>
                    ))}

                    <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Term 1 Examinations Approaching</span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-snug">
                        Mathematics and Science finals scheduled to begin in 15 days. Hall tickets in preparation.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className="mt-4 w-full py-2 text-center text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                >
                  View Full Attendance Ledger →
                </button>
              </div>
            </div>

            {/* Recent Notices & School Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Active Campus Notices</h3>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {notices.slice(0, 3).map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => setSelectedNotice(notice)}
                      className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 cursor-pointer transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 line-clamp-1">{notice.title}</span>
                        <span className="text-[10px] text-slate-400">{notice.date}</span>
                      </div>
                      <p className="text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notice.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Institutional Events</h3>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    Calendar
                  </button>
                </div>
                <div className="space-y-3">
                  {events.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-center shrink-0">
                        <span className="block text-[10px] font-bold text-emerald-700 uppercase">
                          {evt.date.split('-')[1] === '10' ? 'OCT' : 'SEP'}
                        </span>
                        <span className="block text-base font-extrabold text-slate-900">
                          {evt.date.split('-')[2]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{evt.title}</span>
                        <span className="text-slate-500 block text-[11px] mt-0.5">{evt.time} · {evt.location}</span>
                        <span className="text-slate-400 block text-[10px] mt-0.5 truncate">{evt.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STUDENTS MODULE ================= */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage student profiles, enrollments, guardian details, and academic statuses.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedStudentForEdit(null);
                  setStudentModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name, ID, or guardian..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                {/* Class filter */}
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>

                {/* Sort */}
                <button
                  onClick={() => {
                    if (sortField === 'name') setSortAsc(!sortAsc);
                    else {
                      setSortField('name');
                      setSortAsc(true);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sort</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Admission ID</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Section</th>
                      <th className="py-3 px-4">Attendance</th>
                      <th className="py-3 px-4">Academic Status</th>
                      <th className="py-3 px-4">Parent / Contact</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-400">
                          No students matched your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => {
                        const matchedClass = classes.find((c) => c.id === s.classId);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900 block">{s.name}</span>
                              <span className="text-[11px] text-slate-400">Roll #{s.rollNo}</span>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-slate-700">
                              {s.admissionId}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">
                              {matchedClass ? matchedClass.name : s.classId}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700">
                              {s.section}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`font-mono font-bold ${
                                  s.attendanceRate >= 90
                                    ? 'text-emerald-700'
                                    : s.attendanceRate >= 75
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {s.attendanceRate}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  s.academicStatus === 'Exceeding'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : s.academicStatus === 'On Track'
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}
                              >
                                {s.academicStatus}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-slate-800 block font-medium">{s.parentName}</span>
                              <span className="text-[11px] text-slate-400 block">{s.parentPhone}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                                  s.status === 'Active' ? 'text-emerald-700' : 'text-slate-400'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    s.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
                                  }`}
                                />
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => setViewingStudent(s)}
                                  title="View Profile"
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedStudentForEdit(s);
                                    setStudentModalOpen(true);
                                  }}
                                  title="Edit Student"
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeletingStudentId(s.id)}
                                  title="Delete Student"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                <span>Showing {filteredStudents.length} of {students.length} enrolled students</span>
                <span>Active Term: Fall 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= TEACHERS MODULE ================= */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Directory</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Faculty qualifications, assigned class sections, and weekly contact workloads.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTeacherForEdit(null);
                  setTeacherModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center border border-emerald-200 text-sm">
                        {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {t.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.roleTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{t.qualification}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400">Classes: </span>
                        <span className="font-semibold text-slate-800">{t.classes.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Subjects: </span>
                        <span className="font-semibold text-slate-800">{t.subjects.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Workload: </span>
                        <span className="font-mono font-semibold text-slate-800">{t.workloadHours} hrs/week</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{t.email}</span>
                      <span className="font-medium text-emerald-700">{t.attendanceRate}% Attendance</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingTeacher(t)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1.5"
                        title="View Faculty Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeacherForEdit(t);
                          setTeacherModalOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-emerald-50 rounded-md transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Faculty</span>
                      </button>
                      <button
                        onClick={() => setDeletingTeacherId(t.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Remove Faculty Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STAFF MODULE ================= */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administrative & Support Staff</h1>
                <p className="text-xs text-slate-500 mt-1">Campus operations personnel, front office, bursar, and IT support team.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedStaffForEdit(null);
                  setStaffModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff Member</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Role Designation</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Campus Email</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{st.department}</td>
                      <td className="py-3 px-4 text-slate-600">{st.role}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{st.phone}</td>
                      <td className="py-3 px-4 text-slate-600">{st.email}</td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {st.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingStaff(st)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Staff Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStaffForEdit(st);
                              setStaffModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit Staff Member"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStaffId(st.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Remove Staff Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* ================= CLASSES MODULE ================= */}
        {activeTab === 'classes' && <ClassSectionWorkspace />}

        {/* ================= ACADEMICS MODULE ================= */}
        {activeTab === 'academics' && (
          <div className="space-y-6">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAcademicSubTab('setup')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  academicSubTab === 'setup'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                Academic Setup (Years & Terms)
              </button>
              <button
                onClick={() => setAcademicSubTab('allocations')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  academicSubTab === 'allocations'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                Subject Allocation Matrix
              </button>
              <button
                onClick={() => setAcademicSubTab('reports')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  academicSubTab === 'reports'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                Workload & Capacity Analytics
              </button>
              <button
                onClick={() => setAcademicSubTab('performance')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  academicSubTab === 'performance'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900'
                }`}
              >
                GPA & Benchmarking
              </button>
            </div>

            {academicSubTab === 'setup' && <AcademicSetupWorkspace />}
            {academicSubTab === 'allocations' && <SubjectAllocationWorkspace />}
            {academicSubTab === 'reports' && <AcademicReports />}
            {academicSubTab === 'performance' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Performance Overview</h1>
                  <p className="text-xs text-slate-500 mt-1">Term examinations, subject mastery indexes, and class performance comparisons.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Overall School GPA</span>
                    <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">3.74 / 4.0</span>
                    <p className="text-xs text-emerald-700 mt-2 font-medium">↑ 0.12 pts above target cohort</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Top Performing Subject</span>
                    <span className="text-2xl font-bold text-slate-900 mt-1 block">Mathematics</span>
                    <p className="text-xs text-slate-500 mt-2">Class 10A average: 88.4%</p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-medium text-slate-500 block">Formative Completion Rate</span>
                    <span className="text-3xl font-extrabold text-slate-900 font-mono mt-1 block">94.2%</span>
                    <p className="text-xs text-slate-500 mt-2">78 of 82 assignments submitted on time</p>
                  </div>
                </div>

                {/* Performance by Class */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-4">Class Performance Benchmarking</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Grade 10A', score: 91, leader: 'Diya Kapoor (98%)' },
                      { name: 'Grade 10B', score: 86, leader: 'Arjun Reddy (88%)' },
                      { name: 'Grade 9A', score: 89, leader: 'Isha Singhania (96.5%)' },
                      { name: 'Grade 8A', score: 93, leader: 'Aarav Sharma (96.2%)' },
                      { name: 'Grade 7B', score: 85, leader: 'Tanvi Joshi (93%)' },
                      { name: 'Grade 5B', score: 88, leader: 'Ananya Sharma (91.3%)' }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className="text-slate-500">
                            Top: {item.leader} · <span className="font-mono font-bold text-slate-900">{item.score}% Avg</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-800 h-2 rounded-full"
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ATTENDANCE & DAILY OPERATIONS MODULE (Prompt 4) ================= */}
        {activeTab === 'attendance' && (
          <AttendanceOperationsWorkspace defaultTab="dashboard" />
        )}

        {/* ================= TIMETABLE MODULE ================= */}
        {activeTab === 'timetable' && <TimetableEditor />}

        {/* ================= EXAMS MODULE ================= */}
        {activeTab === 'exams' && (
          <ExaminationWorkspace defaultTab="dashboard" />
        )}

        {/* ================= ASSIGNMENTS MODULE ================= */}
        {activeTab === 'assignments' && (
          <ExaminationWorkspace defaultTab="assignments" />
        )}

        {/* ================= NOTICES MODULE ================= */}
        {activeTab === 'notices' && <SharedNoticeBoard />}

        {/* ================= EVENTS & CALENDAR MODULE ================= */}
        {(activeTab === 'events' || activeTab === 'calendar') && <AcademicCalendarEvents />}

        {/* ================= MESSAGING MODULE ================= */}
        {activeTab === 'messages' && <SharedMessagingWorkspace />}

        {/* ================= FINANCE MODULE ================= */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">School Financial Summary</h1>
              <p className="text-xs text-slate-500 mt-1">Executive overview of tuition collection, balance aging, and monthly performance.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Total Fees Assessed</span>
                <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">
                  ${(fees.reduce((s, f) => s + f.totalFee, 0) / 1000).toFixed(1)}k
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Collected to Date</span>
                <span className="text-2xl font-bold text-emerald-800 font-mono mt-1 block">
                  ${(totalFeeCollected / 1000).toFixed(1)}k
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Pending Current</span>
                <span className="text-2xl font-bold text-amber-700 font-mono mt-1 block">
                  ${(totalFeePending / 1000).toFixed(1)}k
                </span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Overdue Accounts</span>
                <span className="text-2xl font-bold text-rose-700 font-mono mt-1 block">
                  ${(fees.filter((f) => f.status === 'Overdue').reduce((s, f) => s + f.pending, 0) / 1000).toFixed(1)}k
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Class Collection Performance</h3>
              <div className="space-y-3">
                {classes.map((cls) => {
                  const classFees = fees.filter((f) => f.classId === cls.id);
                  const total = classFees.reduce((s, f) => s + f.totalFee, 0) || 1;
                  const paid = classFees.reduce((s, f) => s + f.paid, 0);
                  const pct = Math.round((paid / total) * 100);

                  return (
                    <div key={cls.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{cls.name}</span>
                        <span className="text-slate-500 font-mono">
                          ${paid.toLocaleString()} / ${total.toLocaleString()} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-emerald-800 h-2 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= REPORTS & SETTINGS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Reports & Audits</h1>
              <p className="text-xs text-slate-500 mt-1">Exportable administrative transcripts, attendance compliance logs, and fee audit sheets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Annual Enrollment Audit Report', desc: 'Comprehensive census of student enrollments by grade division and teacher ratios.' },
                { title: 'CBSE / State Academic Compliance Dossier', desc: 'Standardized curricular compliance, assessment records, and teacher qualification metrics.' },
                { title: 'Fee Reconciliation & Bursar Summary', desc: 'Itemized receipts, online payment gateway reconciliation, and bank settlement ledger.' },
                { title: 'Safety, Infirmary & Attendance Compliance', desc: 'Daily roll call compliance records and student clinic admission logs.' }
              ].map((rep, idx) => (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rep.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                  </div>
                  <button className="mt-4 self-start px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                    Generate Export (CSV / PDF)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= AUDIT TRAIL MODULE ================= */}
        {activeTab === 'audit' && <SharedAuditTrail />}

        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Demo Settings</h1>
              <p className="text-xs text-slate-500 mt-1">School profile configuration, security preferences, and demo data controls.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Institution Identity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">School Name</span>
                  <input
                    type="text"
                    disabled
                    value="Greenfield International School"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Academic Year</span>
                  <input
                    type="text"
                    disabled
                    value="2026 - 2027"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-rose-200 space-y-3">
              <h3 className="text-sm font-bold text-rose-900">Reset Demo Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Clears all browser localStorage demo modifications (added students, marked attendance, created assignments, recorded payments) and resets to factory Greenfield International demo data.
              </p>
              <button
                onClick={resetDemoData}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-sm"
              >
                Reset Demo Data Now
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: STUDENT (ADD & EDIT) ================= */}
      <StudentFormModal
        isOpen={studentModalOpen}
        onClose={() => {
          setStudentModalOpen(false);
          setSelectedStudentForEdit(null);
        }}
        studentToEdit={selectedStudentForEdit}
      />

      {/* ================= MODAL: TEACHER (ADD & EDIT) ================= */}
      <TeacherFormModal
        isOpen={teacherModalOpen}
        onClose={() => {
          setTeacherModalOpen(false);
          setSelectedTeacherForEdit(null);
        }}
        teacherToEdit={selectedTeacherForEdit}
      />

      {/* ================= MODAL: STAFF (ADD & EDIT) ================= */}
      <StaffFormModal
        isOpen={staffModalOpen}
        onClose={() => {
          setStaffModalOpen(false);
          setSelectedStaffForEdit(null);
        }}
        staffToEdit={selectedStaffForEdit}
      />

      {/* ================= MODAL: VIEW STUDENT PROFILE ================= */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        onEdit={(st) => {
          setViewingStudent(null);
          setSelectedStudentForEdit(st);
          setStudentModalOpen(true);
        }}
        onArchive={(st) => {
          setViewingStudent(null);
          setArchivingStudent(st);
        }}
      />

      {/* ================= MODAL: VIEW TEACHER PROFILE ================= */}
      <TeacherProfileModal
        isOpen={!!viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        teacher={viewingTeacher}
        onEdit={(tch) => {
          setViewingTeacher(null);
          setSelectedTeacherForEdit(tch);
          setTeacherModalOpen(true);
        }}
      />

      {/* ================= MODAL: VIEW STAFF PROFILE ================= */}
      <StaffProfileModal
        isOpen={!!viewingStaff}
        onClose={() => setViewingStaff(null)}
        staff={viewingStaff}
        onEdit={(stf) => {
          setViewingStaff(null);
          setSelectedStaffForEdit(stf);
          setStaffModalOpen(true);
        }}
      />

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingStudentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">Remove Student Record?</h3>
            <p className="text-xs text-center text-slate-600 mt-2 leading-relaxed">
              This action will remove the student from active enrollment roster and update class headcount.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeletingStudentId(null)}
                className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudent(deletingStudentId);
                  setDeletingStudentId(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Teacher Confirmation */}
      {deletingTeacherId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">Remove Faculty Member?</h3>
            <p className="text-xs text-center text-slate-600 mt-2 leading-relaxed">
              This action will remove the teacher from active faculty roster, revoke class mentor roles, and adjust department workload.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeletingTeacherId(null)}
                className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTeacher(deletingTeacherId);
                  setDeletingTeacherId(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation */}
      {deletingStaffId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-slate-900">Remove Staff Record?</h3>
            <p className="text-xs text-center text-slate-600 mt-2 leading-relaxed">
              This action will remove the staff member from campus operations roster and operational shifts.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeletingStaffId(null)}
                className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStaff(deletingStaffId);
                  setDeletingStaffId(null);
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE NOTICE ================= */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold">Post Institutional Notice</h3>
              <button onClick={() => setShowAddNoticeModal(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Exhibition Registration"
                  value={newNoticeForm.title}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
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
                    <option value="School">School</option>
                    <option value="Class">Class</option>
                    <option value="Exam">Exam</option>
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
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newNoticeForm.targetAudience}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, targetAudience: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Content</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed announcement details..."
                  value={newNoticeForm.content}
                  onChange={(e) => setNewNoticeForm({ ...newNoticeForm, content: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW NOTICE DETAILS ================= */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 text-slate-800">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {selectedNotice.category} Notice
              </span>
              <button onClick={() => setSelectedNotice(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{selectedNotice.title}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-100">
              <span>Date: {selectedNotice.date}</span>
              <span>·</span>
              <span>Audience: {selectedNotice.targetAudience}</span>
              <span>·</span>
              <span>By: {selectedNotice.author}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{selectedNotice.content}</p>
            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
