import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Notice, Exam, MarkEntry, Teacher, Student } from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { TeacherFormModal } from '../../common/TeacherFormModal';
import { StudentFormModal } from '../../common/StudentFormModal';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import { TeacherProfileModal } from '../../common/TeacherProfileModal';
import { TimetableEditor } from '../../academic/TimetableEditor';
import { ClassSectionWorkspace } from '../../academic/ClassSectionWorkspace';
import { SubjectAllocationWorkspace } from '../../academic/SubjectAllocationWorkspace';
import { AcademicReports } from '../../academic/AcademicReports';
import { AttendanceOperationsWorkspace } from '../../attendance/AttendanceOperationsWorkspace';
import { ExaminationWorkspace } from '../../examination/ExaminationWorkspace';
import { AcademicCalendarEvents } from '../../academic/AcademicCalendarEvents';
import { SharedNoticeBoard } from '../../common/SharedNoticeBoard';
import { SharedMessagingWorkspace } from '../../common/SharedMessagingWorkspace';
import {
  LayoutDashboard,
  Layers,
  Users,
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  FileText,
  Clock,
  BarChart3,
  Bell,
  MessageSquare,
  User,
  AlertTriangle,
  CheckCircle2,
  Send,
  Plus,
  X,
  Search,
  BookMarked,
  Edit,
  Eye
} from 'lucide-react';

export const VicePrincipalView: React.FC = () => {
  const {
    classes,
    teachers,
    attendance,
    exams,
    marks,
    assignments,
    notices,
    messages,
    sendMessage,
    addNotice,
    students,
    addToast,
    currentPage,
    setCurrentPage
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(currentPage || 'dashboard');

  React.useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10a');
  const [academicSettings, setAcademicSettings] = useState({
    term1Start: '2026-08-15',
    term1End: '2026-12-20',
    term2Start: '2027-01-10',
    term2End: '2027-05-30',
    minAttendancePct: 75,
    passScorePct: 40,
    moderationWindowDays: 14
  });
  const [showAcademicNoticeModal, setShowAcademicNoticeModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<Teacher | null>(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [newAcademicNotice, setNewAcademicNotice] = useState({
    title: '',
    content: '',
    targetAudience: 'All Faculty & Students',
    category: 'Exam' as Notice['category'],
    priority: 'High' as Notice['priority']
  });

  const navItems = [
    { id: 'dashboard', label: 'Academic Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'classes', label: 'Class Coordination', icon: <Layers className="w-4 h-4" /> },
    { id: 'teachers', label: 'Faculty Workload', icon: <Users className="w-4 h-4" /> },
    { id: 'subjects', label: 'Subject Curriculum', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance Monitoring', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'exams', label: 'Exam Schedules', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'marks', label: 'Marks & Moderation', icon: <Award className="w-4 h-4" /> },
    { id: 'assignments', label: 'Coursework Tracking', icon: <FileText className="w-4 h-4" /> },
    { id: 'timetable', label: 'Timetable Matrix', icon: <Clock className="w-4 h-4" /> },
    { id: 'reports', label: 'Academic Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'notices', label: 'Academic Circulars', icon: <Bell className="w-4 h-4" /> },
    { id: 'messages', label: 'Faculty Messages', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  const handleCreateAcademicNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcademicNotice.title.trim()) return;

    addNotice({
      title: newAcademicNotice.title,
      content: newAcademicNotice.content,
      category: newAcademicNotice.category,
      targetAudience: newAcademicNotice.targetAudience,
      author: 'Vice Principal Office (Academic Coordinator)',
      priority: newAcademicNotice.priority
    });

    setShowAcademicNoticeModal(false);
    setNewAcademicNotice({
      title: '',
      content: '',
      targetAudience: 'All Faculty & Students',
      category: 'Exam',
      priority: 'High'
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage('vp-faculty-chat', chatInput, 'teacher', 'Dr. Vikram Sharma (Math HOD)');
    setChatInput('');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar */}
      <RoleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {/* ================= PROFILE ================= */}
        {activeTab === 'profile' && <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />}

        {/* ================= DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Academic Operations Console
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Curriculum progress monitoring, marks moderation queues, and faculty workload coordination.
                </p>
              </div>

              <button
                onClick={() => setShowAcademicNoticeModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue Academic Notice</span>
              </button>
            </div>

            {/* Academic KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Class Cohort Average</span>
                <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">88.2%</span>
                <span className="text-[11px] text-teal-700 font-medium block mt-1">Across 6 divisions</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Pending Exam Marks</span>
                <span className="text-2xl font-bold text-amber-700 font-mono mt-1 block">2 Sets</span>
                <span className="text-[11px] text-slate-500 block mt-1">Grade 10B Science pending</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">Avg Faculty Workload</span>
                <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">21.8 hrs</span>
                <span className="text-[11px] text-teal-700 font-medium block mt-1">Balanced timetable</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-500 block">At-Risk Students</span>
                <span className="text-2xl font-bold text-rose-700 font-mono mt-1 block">1 Student</span>
                <span className="text-[11px] text-rose-600 font-medium block mt-1">Kabir Verma (Needs Review)</span>
              </div>
            </div>

            {/* Academic Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Class Performance Benchmarks */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Subject Performance Benchmarks</h3>
                <p className="text-xs text-slate-500 mb-4">Standardized term assessment averages by academic discipline</p>

                <div className="space-y-3.5">
                  {[
                    { subject: 'Mathematics', average: 92, target: 85, lead: 'Dr. Vikram Sharma' },
                    { subject: 'Computer Science & Robotics', average: 94, target: 88, lead: 'Mr. Rajesh Nair' },
                    { subject: 'Science (Physics / Chem)', average: 86, target: 85, lead: 'Ms. Sunita Rao' },
                    { subject: 'English & Literature', average: 89, target: 85, lead: 'Ms. Priya Sen' },
                    { subject: 'Social Sciences', average: 87, target: 85, lead: 'Ms. Anita Desai' }
                  ].map((sub, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-800">{sub.subject}</span>
                        <span className="text-slate-500 font-mono font-bold">
                          {sub.average}% (Target: {sub.target}%) · {sub.lead}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-teal-700 h-2 rounded-full"
                          style={{ width: `${sub.average}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Moderation & Conflict Alerts */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">Academic Attention Queue</h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Moderation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                    <span className="font-bold text-amber-900 block">Pending Marks Verification</span>
                    <p className="text-slate-600 mt-1 leading-snug">
                      Ms. Sunita Rao has 12 student evaluations pending moderation in Grade 10B Science.
                    </p>
                    <button
                      onClick={() => setActiveTab('marks')}
                      className="mt-2 text-teal-800 font-semibold hover:underline"
                    >
                      Open Marks Moderation →
                    </button>
                  </div>

                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                    <span className="font-bold text-rose-900 block">Remedial Action Recommended</span>
                    <p className="text-slate-600 mt-1 leading-snug">
                      Kabir Verma scored 28/50 in Science Mid-Term. Academic counseling scheduled.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block">Lab Facility Sharing</span>
                    <p className="text-slate-600 mt-1 leading-snug">
                      Science Lab 2 double-booked on Thursday Period 4. Resolved with alternate block.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= CLASSES ================= */}
        {activeTab === 'classes' && <ClassSectionWorkspace />}

        {/* ================= TEACHERS WORKLOAD ================= */}
        {activeTab === 'teachers' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Academic Workload</h1>
              <p className="text-xs text-slate-500 mt-1">Weekly contact hours, curriculum allocation, and class assignments.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Primary Subject</th>
                    <th className="py-3 px-4">Class Allocations</th>
                    <th className="py-3 px-4">Weekly Workload</th>
                    <th className="py-3 px-4">Workload Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teachers.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">{t.subjects[0]}</td>
                      <td className="py-3 px-4 text-slate-600">{t.classes.join(', ')}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{t.workloadHours} hrs / wk</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.workloadHours >= 24
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {t.workloadHours >= 24 ? 'High Load' : 'Balanced'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingTeacher(t)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors inline-flex items-center gap-1.5"
                            title="View Faculty Academic Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTeacherForEdit(t);
                              setIsTeacherModalOpen(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors inline-flex items-center gap-1.5"
                            title="Edit teaching workload & class allocations"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Allocation</span>
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

        {/* ================= MARKS MODERATION ================= */}
        {activeTab === 'marks' && (
          <ExaminationWorkspace defaultTab="moderation" />
        )}

        {/* ================= TIMETABLE ================= */}
        {activeTab === 'timetable' && <TimetableEditor />}

        {/* ================= NOTICES / CIRCULARS ================= */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Circulars</h1>
                <p className="text-xs text-slate-500 mt-1">Directives to faculty on exam moderation, syllabus deadlines, and meetings.</p>
              </div>

              <button
                onClick={() => setShowAcademicNoticeModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Circular</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">{n.title}</span>
                    <span className="font-mono text-[11px] text-slate-400">{n.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed mt-1">{n.content}</p>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
                    <span>Target: {n.targetAudience}</span>
                    <span>Signatory: {n.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= FACULTY MESSAGES ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Academic Coordination Chat</h1>
              <p className="text-xs text-slate-500 mt-1">Direct channel with department heads and class mentors.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[500px]">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Faculty Coordination Thread</h3>
                  <span className="text-[11px] text-teal-700">Active channel with HOD Mathematics & Science</span>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-xl ${
                        m.isMine
                          ? 'bg-teal-800 text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <span className="block text-[10px] font-bold opacity-75 mb-1">{m.senderName}</span>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Type academic memo or reply to faculty..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-700"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= SUBJECTS ================= */}
        {activeTab === 'subjects' && <SubjectAllocationWorkspace />}

        {/* ================= ATTENDANCE & DAILY OPERATIONS MODULE (Prompt 4) ================= */}
        {activeTab === 'attendance' && (
          <AttendanceOperationsWorkspace defaultTab="dashboard" />
        )}

        {/* ================= EXAMS ================= */}
        {activeTab === 'exams' && (
          <ExaminationWorkspace defaultTab="schedule" />
        )}

        {/* ================= ASSIGNMENTS ================= */}
        {activeTab === 'assignments' && (
          <ExaminationWorkspace defaultTab="assignments" />
        )}

        {/* ================= ACADEMIC REPORTS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <AcademicReports />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Cohort Average by Class Division</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { division: 'Grade 10A (Advanced Science & Math)', avg: 91.4, target: 85 },
                    { division: 'Grade 10B (Secondary)', avg: 85.2, target: 85 },
                    { division: 'Grade 9A (Secondary Foundation)', avg: 88.0, target: 85 },
                    { division: 'Grade 8A (Middle School Olympiad)', avg: 92.6, target: 85 },
                    { division: 'Grade 5B (Primary Wing)', avg: 89.1, target: 85 }
                  ].map((d, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-800">{d.division}</span>
                        <span className="font-mono font-bold text-teal-800">{d.avg}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-teal-700 h-2 rounded-full" style={{ width: `${d.avg}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Academic Excellence Honour Roll</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { student: 'Aarav Sharma', class: 'Grade 8A', score: '94.5%', honors: 'Dean’s Honour Roll & Math Gold Medal' },
                    { student: 'Ananya Sharma', class: 'Grade 5B', score: '93.2%', honors: 'Excellence in Science & Arts' },
                    { student: 'Vikramaditya Singhal', class: 'Grade 10A', score: '96.0%', honors: 'Top Ranker — Secondary Division' }
                  ].map((h, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{h.student} ({h.class})</span>
                        <span className="text-slate-500 text-[11px]">{h.honors}</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-800 text-sm">{h.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= NOTICES MODULE ================= */}
        {activeTab === 'notices' && <SharedNoticeBoard />}

        {/* ================= EVENTS & CALENDAR MODULE ================= */}
        {(activeTab === 'events' || activeTab === 'calendar') && <AcademicCalendarEvents />}

        {/* ================= MESSAGING MODULE ================= */}
        {activeTab === 'messages' && <SharedMessagingWorkspace />}

        {/* ================= SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Program Configuration</h1>
              <p className="text-xs text-slate-500 mt-1">Configure term timelines, passing thresholds, and moderation periods.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addToast({
                  type: 'success',
                  title: 'Academic Settings Updated',
                  message: 'Curriculum timelines and passing thresholds saved successfully.'
                });
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Term 1 Start</label>
                  <input
                    type="date"
                    value={academicSettings.term1Start}
                    onChange={(e) => setAcademicSettings({ ...academicSettings, term1Start: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Term 1 End</label>
                  <input
                    type="date"
                    value={academicSettings.term1End}
                    onChange={(e) => setAcademicSettings({ ...academicSettings, term1End: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Minimum Pass Threshold (%)</label>
                  <input
                    type="number"
                    value={academicSettings.passScorePct}
                    onChange={(e) => setAcademicSettings({ ...academicSettings, passScorePct: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min. Attendance Requirement (%)</label>
                  <input
                    type="number"
                    value={academicSettings.minAttendancePct}
                    onChange={(e) => setAcademicSettings({ ...academicSettings, minAttendancePct: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 rounded-xl shadow-xs"
                >
                  Save Academic Parameters
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL: ACADEMIC NOTICE ================= */}
      {showAcademicNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-teal-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold">Issue Academic Directive</h3>
              <button onClick={() => setShowAcademicNoticeModal(false)} className="text-teal-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAcademicNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Circular Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mid-Term Moderation Submission Deadline"
                  value={newAcademicNotice.title}
                  onChange={(e) => setNewAcademicNotice({ ...newAcademicNotice, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newAcademicNotice.targetAudience}
                  onChange={(e) => setNewAcademicNotice({ ...newAcademicNotice, targetAudience: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Directive</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Official instructions to faculty..."
                  value={newAcademicNotice.content}
                  onChange={(e) => setNewAcademicNotice({ ...newAcademicNotice, content: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAcademicNoticeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm"
                >
                  Publish Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Form Modal for Academic Allocations */}
      <TeacherFormModal
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setSelectedTeacherForEdit(null);
        }}
        teacherToEdit={selectedTeacherForEdit}
      />

      {/* Student Form Modal for Academic Status */}
      <StudentFormModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setSelectedStudentForEdit(null);
        }}
        studentToEdit={selectedStudentForEdit}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        onEdit={(st) => {
          setViewingStudent(null);
          setSelectedStudentForEdit(st);
          setIsStudentModalOpen(true);
        }}
      />

      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={!!viewingTeacher}
        onClose={() => setViewingTeacher(null)}
        teacher={viewingTeacher}
        onEdit={(tch) => {
          setViewingTeacher(null);
          setSelectedTeacherForEdit(tch);
          setIsTeacherModalOpen(true);
        }}
      />
    </div>
  );
};
