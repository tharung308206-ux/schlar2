import React, { useState } from 'react';
import { Teacher } from '../../types';
import { useApp } from '../../context/AppContext';
import { canViewTeacherSection, checkPermission } from '../../data/permissions';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  BookOpen,
  Layers,
  Clock,
  Briefcase,
  FileCheck,
  Activity,
  Edit,
  Printer,
  Phone,
  Mail,
  MapPin,
  Award,
  CheckCircle2
} from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onEdit?: (teacher: Teacher) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onEdit
}) => {
  const { currentRole, classes, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<string>('overview');

  if (!isOpen || !teacher) return null;

  // Teacher audit logs
  const teacherAuditLogs = auditLogs.filter(
    (log) =>
      log.module === 'teachers' &&
      (log.recordRef.includes(teacher.name) || (teacher.staffId && log.recordRef.includes(teacher.staffId)))
  );

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'personal', label: 'Personal & Contact', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'qualifications', label: 'Qualifications & Credentials', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'employment', label: 'Employment Record', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'allocations', label: 'Teaching Allocations', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'timetable', label: 'Weekly Timetable', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'Verified Documents', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'activity', label: 'Audit Trail', icon: <Activity className="w-3.5 h-3.5" /> }
  ];

  const visibleTabs = allTabs.filter((tab) => canViewTeacherSection(currentRole, tab.id));
  const selectedTab = visibleTabs.some((t) => t.id === activeTab) ? activeTab : visibleTabs[0]?.id || 'overview';

  const canEdit = checkPermission(currentRole, 'teachers', 'edit').allowed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-slate-800 text-white flex items-center justify-center font-black text-xl shadow-md border border-white/10 shrink-0">
                {teacher.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-white">{teacher.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      teacher.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : teacher.status === 'On Leave'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {teacher.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-1.5 font-mono flex-wrap">
                  <span className="font-semibold text-white">{teacher.staffId || 'FAC-2026-101'}</span>
                  <span>·</span>
                  <span className="text-emerald-300">{teacher.roleTitle}</span>
                  <span>·</span>
                  <span>{teacher.department || 'Academics'}</span>
                  <span>·</span>
                  <span className="text-slate-400">{teacher.room || 'Faculty Room'}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {canEdit && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(teacher);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentRole === 'vice_principal' ? 'Edit Workload' : 'Edit Faculty'}</span>
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Print Profile"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto gap-1 text-xs font-semibold">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-theme-primary text-theme-primary font-bold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-slate-700 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Highlight Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Weekly Workload</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black font-mono text-slate-900 tabular-nums">
                      {teacher.workloadHours}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">hrs / week</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Teaching & contact periods</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Faculty Attendance</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black font-mono text-emerald-800 tabular-nums">
                      {teacher.attendanceRate}%
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium block mt-1">Punctual & Regular</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Assigned Classes</span>
                  <span className="text-base font-bold text-slate-900 mt-1 block truncate">
                    {teacher.classes.length} Sections
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1 truncate">
                    {teacher.classes.join(', ')}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Class Teacher Of</span>
                  <span className="text-base font-bold text-emerald-800 mt-1 block truncate">
                    {teacher.classTeacherOf
                      ? classes.find((c) => c.id === teacher.classTeacherOf || c.name === teacher.classTeacherOf)?.name || teacher.classTeacherOf
                      : 'None Assigned'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Classroom Mentor</span>
                </div>
              </div>

              {/* Overview Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Identity</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Employee / Staff ID:</span>
                    <span className="font-mono font-bold text-slate-900">{teacher.staffId || 'FAC-2026-101'}</span>
                    <span className="text-slate-500">Designation:</span>
                    <span className="font-semibold text-slate-800">{teacher.roleTitle}</span>
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800">{teacher.department || 'Academics'}</span>
                    <span className="text-slate-500">Qualification:</span>
                    <span className="font-medium text-slate-800">{teacher.qualification}</span>
                    <span className="text-slate-500">Teaching Experience:</span>
                    <span className="font-medium text-slate-800">{teacher.experienceYears || 10} Years</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Contact & Office</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Institutional Email:</span>
                    <span className="font-mono text-slate-800">{teacher.email}</span>
                    <span className="text-slate-500">Official Phone:</span>
                    <span className="font-mono text-slate-800">{teacher.phone}</span>
                    <span className="text-slate-500">Campus Office:</span>
                    <span className="font-medium text-slate-800">{teacher.room}</span>
                    <span className="text-slate-500">Reporting Manager:</span>
                    <span className="font-medium text-slate-800">{teacher.reportingManager || 'Dr. Arthur Campbell (Principal)'}</span>
                    <span className="text-slate-500">Joining Date:</span>
                    <span className="font-mono text-slate-800">{teacher.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Subjects & Curriculum Bar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Subject Specializations</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {teacher.subjects.map((sub, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL & CONTACT */}
          {selectedTab === 'personal' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal & Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name</span>
                    <span className="font-bold text-slate-900">{teacher.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gender</span>
                    <span className="font-medium text-slate-800">{teacher.gender || 'Not Specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Work Email</span>
                    <span className="font-mono text-slate-800">{teacher.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Telephone</span>
                    <span className="font-mono text-slate-800">{teacher.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                    <span className="font-mono text-slate-800">{teacher.emergencyContact || teacher.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Residential Address</span>
                    <span className="font-medium text-slate-800">{teacher.address || 'Greenfield Campus Residential Area'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUALIFICATIONS */}
          {selectedTab === 'qualifications' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Degrees & Professional Honors</h3>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <GraduationCap className="w-5 h-5 text-theme-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{teacher.qualification}</span>
                    <p className="text-xs text-slate-500 mt-0.5">Verified institutional degree on file in campus administration archives.</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-800 block">Professional Certifications & Badges</span>
                  <div className="space-y-2">
                    {(teacher.certifications && teacher.certifications.length > 0
                      ? teacher.certifications
                      : [
                          'CBSE Senior Secondary Examiner Certification',
                          'Experiential Pedagogical Methods in STEM',
                          'Campus Safety and First Aid Protocol'
                        ]
                    ).map((cert, idx) => (
                      <div key={idx} className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-200/60 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EMPLOYMENT RECORD */}
          {selectedTab === 'employment' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Service Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Staff Identification ID</span>
                    <span className="font-mono font-bold text-slate-900">{teacher.staffId || 'FAC-2026-101'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Joining</span>
                    <span className="font-mono text-slate-800">{teacher.joinDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Department</span>
                    <span className="font-semibold text-slate-800">{teacher.department || 'Academics'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Designation</span>
                    <span className="font-semibold text-slate-800">{teacher.roleTitle}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Employment Type</span>
                    <span className="font-medium text-slate-800">{teacher.employmentType || 'Full-time'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status</span>
                    <span className="font-bold text-emerald-700">{teacher.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reporting Manager</span>
                    <span className="font-medium text-slate-800">{teacher.reportingManager || 'Dr. Arthur Campbell (Principal)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Experience at Greenfield</span>
                    <span className="font-medium text-slate-800">{teacher.experienceYears || 5} Years</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TEACHING ALLOCATIONS */}
          {selectedTab === 'allocations' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Teaching Roster & Workload</h3>
                  <span className="px-2.5 py-1 bg-slate-100 font-mono font-bold text-slate-800 rounded-lg text-xs">
                    {teacher.workloadHours} Hours / Week
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Class Sections Taught</span>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.classes.map((cls, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-slate-800 text-xs">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">Subject Assignments</span>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map((sub, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-md font-semibold text-emerald-800 text-xs">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl text-blue-900 text-xs flex items-center justify-between">
                  <span>Class Teacher Assignment: <strong>{teacher.classTeacherOf || 'Grade 10A'}</strong></span>
                  <span className="text-[11px] text-blue-700">Homeroom Mentor</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TIMETABLE */}
          {selectedTab === 'timetable' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Weekly Faculty Schedule Matrix</h3>
                <p className="text-xs text-slate-500">Period schedule across the five instructional school days.</p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Period</th>
                      <th className="py-2.5 px-4">Time</th>
                      <th className="py-2.5 px-4">Monday</th>
                      <th className="py-2.5 px-4">Wednesday</th>
                      <th className="py-2.5 px-4">Friday</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { period: 'Period 1', time: '08:30 - 09:15', mon: `${teacher.subjects[0]} (10A)`, wed: `${teacher.subjects[0]} (10B)`, fri: `${teacher.subjects[0]} (9A)` },
                      { period: 'Period 2', time: '09:20 - 10:05', mon: `${teacher.subjects[0]} (10B)`, wed: 'Prep / Planning', fri: `${teacher.subjects[0]} (10A)` },
                      { period: 'Period 3', time: '10:25 - 11:10', mon: 'Lab Practical (10A)', wed: `${teacher.subjects[0]} (9A)`, fri: 'Department Review' },
                      { period: 'Period 4', time: '11:15 - 12:00', mon: 'Remedial Clinic', wed: 'Faculty Meeting', fri: 'Class Mentor Period' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{row.period}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{row.time}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{row.mon}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{row.wed}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{row.fri}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: VERIFIED DOCUMENTS */}
          {selectedTab === 'documents' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Institutional Faculty Documentation</h3>
                <p className="text-xs text-slate-500">Statutory clearances, contracts, and degrees on file.</p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Document Title</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Upload Date</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(teacher.documents && teacher.documents.length > 0
                      ? teacher.documents
                      : [
                          { id: 'dt-1', name: 'Master / Ph.D. Degree Transcripts', type: 'PDF', uploadDate: teacher.joinDate, status: 'Verified' as const },
                          { id: 'dt-2', name: 'CBSE Teacher Eligibility Clearance', type: 'PDF', uploadDate: teacher.joinDate, status: 'Verified' as const },
                          { id: 'dt-3', name: 'Employment Agreement & Code of Conduct', type: 'PDF', uploadDate: teacher.joinDate, status: 'Verified' as const },
                          { id: 'dt-4', name: 'Background Verification Record', type: 'PDF', uploadDate: '2024-05-10', status: 'Verified' as const }
                        ]
                    ).map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{doc.name}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{doc.type}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{doc.uploadDate}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT TRAIL */}
          {selectedTab === 'activity' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Faculty Action & Allocation Audit Ledger</h3>
                <p className="text-xs text-slate-500">Immutable ledger actions referencing {teacher.name}.</p>
              </div>

              {teacherAuditLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No recorded modifications for this teacher in the active session.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                        <th className="py-2.5 px-4">Timestamp</th>
                        <th className="py-2.5 px-4">Action</th>
                        <th className="py-2.5 px-4">Actor</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teacherAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{log.action}</td>
                          <td className="py-2.5 px-4 text-slate-700">{log.actorName}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 text-[11px]">{log.reason || 'Faculty update'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Faculty Roster · Greenfield International School</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
