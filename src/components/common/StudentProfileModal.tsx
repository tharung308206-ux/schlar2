import React, { useState } from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { canViewStudentSection, checkPermission } from '../../data/permissions';
import {
  X,
  User,
  GraduationCap,
  Calendar,
  Users,
  Award,
  DollarSign,
  FileText,
  Activity,
  HeartPulse,
  Printer,
  Edit,
  Archive,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Shield,
  FileCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit?: (student: Student) => void;
  onArchive?: (student: Student) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onArchive
}) => {
  const {
    currentRole,
    classes,
    attendance,
    exams,
    marks,
    fees,
    payments,
    auditLogs,
    correctionRequests,
    studentMovements
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [attDateFilter, setAttDateFilter] = useState<string>('all');

  if (!isOpen || !student) return null;

  const matchedClass = classes.find((c) => c.id === student.classId);
  const studentFees = fees.find((f) => f.studentId === student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  // Student exam marks
  const studentMarks = marks.filter((m) => m.studentId === student.id);

  // Student attendance history from attendance records
  const studentAttendanceLogs = attendance.flatMap((att) => {
    const record = att.records.find((r) => r.studentId === student.id);
    if (!record) return [];
    return [
      {
        id: att.id,
        date: att.date,
        period: att.period,
        status: record.status,
        arrivalTime: record.arrivalTime,
        remarks: record.remarks
      }
    ];
  });

  const presentCount = studentAttendanceLogs.filter((l) => l.status === 'Present').length;
  const absentCount = studentAttendanceLogs.filter((l) => l.status === 'Absent').length;
  const lateCount = studentAttendanceLogs.filter((l) => l.status === 'Late').length;
  const excusedCount = studentAttendanceLogs.filter((l) => l.status === 'Excused').length;

  // Student corrections and movements
  const studentCorrections = correctionRequests.filter((c) => c.studentId === student.id);
  const studentMovementLogs = studentMovements.filter((m) => m.studentId === student.id);

  // Student audit logs
  const studentAuditLogs = auditLogs.filter(
    (log) =>
      log.module === 'students' &&
      (log.recordRef.includes(student.admissionId) || log.recordRef.includes(student.name))
  );

  // Define available tabs filtered by role permission
  const allTabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'personal', label: 'Personal & Family', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'admission', label: 'Admission & Class', icon: <GraduationCap className="w-3.5 h-3.5" /> },
    { id: 'attendance', label: 'Attendance Logs', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'exams', label: 'Academics & Grades', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'fees', label: 'Fee Accounts', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'medical', label: 'Health & Safety', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'Documents & Proofs', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'lifecycle', label: 'Lifecycle Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'activity', label: 'Audit Trail', icon: <Activity className="w-3.5 h-3.5" /> }
  ];

  const visibleTabs = allTabs.filter((tab) => canViewStudentSection(currentRole, tab.id));

  // If current tab is restricted, fallback to first visible
  const selectedTab = visibleTabs.some((t) => t.id === activeTab) ? activeTab : visibleTabs[0]?.id || 'overview';

  const canEdit = checkPermission(currentRole, 'students', 'edit').allowed;
  const canArchive = checkPermission(currentRole, 'students', 'archive').allowed || currentRole === 'principal';

  const calculateAge = (dobString?: string) => {
    if (!dobString) return 'N/A';
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-theme-primary to-slate-800 text-white flex items-center justify-center font-black text-xl shadow-md border border-white/10 shrink-0">
                {student.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-white">{student.name}</h2>
                  {student.preferredName && (
                    <span className="text-xs text-slate-300 font-normal">({student.preferredName})</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      student.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : student.status === 'Transferred' || student.status === 'Withdrawn'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {student.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-1.5 font-mono flex-wrap">
                  <span className="font-semibold text-white">ID: {student.admissionId}</span>
                  <span>·</span>
                  <span>{matchedClass ? matchedClass.name : student.classId} (Sec {student.section})</span>
                  <span>·</span>
                  <span>Roll #{student.rollNo}</span>
                  <span>·</span>
                  <span className="text-slate-400">{student.academicYear || 'AY 2026–2027'}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {canEdit && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(student);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
                  title="Modify Student Record"
                >
                  <Edit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit</span>
                </button>
              )}
              {canArchive && onArchive && student.status === 'Active' && (
                <button
                  onClick={() => {
                    onClose();
                    onArchive(student);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 rounded-xl transition-colors border border-amber-800/60 flex items-center gap-1.5"
                  title="Archive or withdraw student"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Print Institutional Record"
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
        <div className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-6 overflow-x-auto scrollbar-none gap-1 text-xs font-semibold">
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
              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Attendance Index</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black font-mono text-emerald-800 tabular-nums">
                      {student.attendanceRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">overall</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${
                        student.attendanceRate >= 90 ? 'bg-emerald-600' : student.attendanceRate >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${student.attendanceRate}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Academic Standing</span>
                  <span className="text-base font-bold text-slate-900 mt-1 block">
                    {student.academicStatus}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {student.academicStatus === 'Exceeding' ? 'Honor Roll Eligible' : student.academicStatus === 'On Track' ? 'Meeting Standards' : 'Intervention Needed'}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Primary Guardian</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                    {student.parentName}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block mt-1 truncate">
                    {student.parentPhone}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Class Teacher</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                    {matchedClass?.classTeacherName || 'Unassigned'}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    {matchedClass?.room || 'Campus Room'}
                  </span>
                </div>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Particulars</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Full Legal Name:</span>
                    <span className="font-semibold text-slate-800">{student.name}</span>
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-mono text-slate-800">{student.dob} ({calculateAge(student.dob)} yrs)</span>
                    <span className="text-slate-500">Gender:</span>
                    <span className="font-medium text-slate-800">{student.gender}</span>
                    <span className="text-slate-500">Blood Group:</span>
                    <span className="font-mono font-bold text-slate-800">{student.bloodGroup || 'O+'}</span>
                    <span className="text-slate-500">Nationality:</span>
                    <span className="font-medium text-slate-800">{student.nationality || 'Indian'}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Class & Enrolment Status</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <span className="text-slate-500">Class & Section:</span>
                    <span className="font-semibold text-slate-800">{matchedClass?.name} — Section {student.section}</span>
                    <span className="text-slate-500">Admission No:</span>
                    <span className="font-mono font-bold text-slate-800">{student.admissionId}</span>
                    <span className="text-slate-500">Admission Date:</span>
                    <span className="font-mono text-slate-800">{student.admissionDate || '2024-04-10'}</span>
                    <span className="text-slate-500">Enrollment Status:</span>
                    <span className="font-semibold text-emerald-700">{student.status}</span>
                    <span className="text-slate-500">Academic Year:</span>
                    <span className="font-medium text-slate-800">{student.academicYear || 'AY 2026–2027'}</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes / Medical Alert Banner */}
              {student.medicalAlerts && canViewStudentSection(currentRole, 'medical') && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-900">
                  <HeartPulse className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Documented Medical Alert</span>
                    <p className="text-xs text-rose-800 mt-0.5">{student.medicalAlerts}</p>
                  </div>
                </div>
              )}

              {student.internalNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-800 block text-xs mb-1">Administrative & Faculty Notes</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{student.internalNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PERSONAL & FAMILY */}
          {selectedTab === 'personal' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Identity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">First Name</span>
                    <span className="font-semibold text-slate-800 text-xs">{student.firstName || student.name.split(' ')[0]}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Middle Name</span>
                    <span className="font-semibold text-slate-800 text-xs">{student.middleName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Last Name</span>
                    <span className="font-semibold text-slate-800 text-xs">{student.lastName || student.name.split(' ').slice(1).join(' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                    <span className="font-mono text-slate-800 text-xs">{student.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Calculated Age</span>
                    <span className="font-medium text-slate-800 text-xs">{calculateAge(student.dob)} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Gender</span>
                    <span className="font-medium text-slate-800 text-xs">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Blood Group</span>
                    <span className="font-mono font-bold text-slate-800 text-xs">{student.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nationality</span>
                    <span className="font-medium text-slate-800 text-xs">{student.nationality || 'Indian'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Preferred Name</span>
                    <span className="font-medium text-slate-800 text-xs">{student.preferredName || student.name}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Guardian & Family Particulars</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Primary Guardian</span>
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">{student.parentName}</span>
                      <span className="text-slate-500 block">{student.guardianRelation || 'Father'} {student.parentOccupation ? `· ${student.parentOccupation}` : ''}</span>
                      <span className="font-mono text-slate-700 block mt-1">{student.parentPhone}</span>
                      <span className="text-slate-600 block">{student.parentEmail}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Secondary Guardian</span>
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 block">{student.secondaryGuardianName || 'Pooja Sharma'}</span>
                      <span className="text-slate-500 block">{student.secondaryGuardianRelation || 'Mother'}</span>
                      <span className="font-mono text-slate-700 block mt-1">{student.secondaryGuardianPhone || '+1 (555) 349-2181'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Residential Address</h3>
                <p className="text-xs text-slate-800 font-medium">{student.address}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                  <span>City: {student.city || 'Greenfield'}</span>
                  <span>·</span>
                  <span>State: {student.state || 'Karnataka'}</span>
                  <span>·</span>
                  <span>Postal Code: {student.postalCode || '560102'}</span>
                  <span>·</span>
                  <span>Country: {student.country || 'India'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ADMISSION & CLASS */}
          {selectedTab === 'admission' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Enrolment Record</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Official Admission Number</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{student.admissionId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Admission</span>
                    <span className="font-mono text-slate-800">{student.admissionDate || '2024-04-10'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Academic Year</span>
                    <span className="font-medium text-slate-800">{student.academicYear || 'AY 2026–2027'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Current Class & Grade</span>
                    <span className="font-semibold text-slate-800">{matchedClass?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Section</span>
                    <span className="font-mono font-bold text-slate-800">Section {student.section}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Class Roll Number</span>
                    <span className="font-mono font-bold text-slate-800">Roll #{student.rollNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Enrollment Status</span>
                    <span className="font-bold text-emerald-700">{student.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Previous Institution</span>
                    <span className="font-medium text-slate-800">{student.previousSchool || 'Greenfield Junior Academy'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Transfer Reference</span>
                    <span className="font-mono text-slate-800">{student.previousAdmissionRef || 'TC-2024-G088'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Room & Teacher Assignment</h3>
                <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{matchedClass?.classTeacherName}</span>
                    <span className="text-slate-500 text-[11px]">Class Teacher · {matchedClass?.room}</span>
                  </div>
                  <span className="font-mono text-slate-600 text-xs">{matchedClass?.studentCount} enrolled peers</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE LOGS (Prompt 4 Section 8) */}
          {selectedTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Attendance Register & Operations History</h3>
                  <p className="text-xs text-slate-500">Official daily roll calls, authorized corrections, and gate movements for {student.name}.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Overall Index:</span>
                  <span className={`px-2.5 py-1 font-bold font-mono rounded-lg border text-xs ${
                    student.attendanceRate >= 85
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {student.attendanceRate}%
                  </span>
                </div>
              </div>

              {/* Attendance Breakdown Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                  <span className="text-lg font-black font-mono text-emerald-900 block">{presentCount}</span>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Present Sessions</span>
                </div>
                <div className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl">
                  <span className="text-lg font-black font-mono text-rose-900 block">{absentCount}</span>
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Absences</span>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                  <span className="text-lg font-black font-mono text-amber-900 block">{lateCount}</span>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Late Arrivals</span>
                </div>
                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl">
                  <span className="text-lg font-black font-mono text-blue-900 block">{excusedCount}</span>
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Excused</span>
                </div>
              </div>

              {/* Daily Roll Call Logs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Daily Session Records</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Filter:</span>
                    <select
                      value={attDateFilter}
                      onChange={(e) => setAttDateFilter(e.target.value)}
                      className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                    >
                      <option value="all">All Dates ({studentAttendanceLogs.length})</option>
                      {Array.from(new Set(studentAttendanceLogs.map((l) => l.date))).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {studentAttendanceLogs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                    No historical daily roll calls recorded for this student in current session.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Session / Period</th>
                          <th className="py-2.5 px-3">Roll Call Status</th>
                          <th className="py-2.5 px-3">Arrival Time</th>
                          <th className="py-2.5 px-3">Staff Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentAttendanceLogs
                          .filter((l) => attDateFilter === 'all' || l.date === attDateFilter)
                          .map((log, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{log.date}</td>
                              <td className="py-2.5 px-3 text-slate-600">{log.period}</td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    log.status === 'Present'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : log.status === 'Late'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : log.status === 'Excused'
                                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">
                                {log.arrivalTime || '—'}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 italic">
                                {log.remarks || 'Standard roll call'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Correction Requests History (if any) */}
              {studentCorrections.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block">Attendance Correction History</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Requested Change</th>
                          <th className="py-2 px-3">Reason</th>
                          <th className="py-2 px-3">Requested By</th>
                          <th className="py-2 px-3">Decision Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentCorrections.map((corr) => (
                          <tr key={corr.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono text-slate-700">{corr.date}</td>
                            <td className="py-2 px-3">
                              <span className="text-slate-500 line-through mr-1">{corr.originalStatus}</span>
                              <span className="font-bold text-emerald-800">→ {corr.requestedStatus}</span>
                            </td>
                            <td className="py-2 px-3 text-slate-600 max-w-xs truncate">{corr.reason}</td>
                            <td className="py-2 px-3 text-slate-500">{corr.requestedByName}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                corr.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : corr.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {corr.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Student Movement Gate Slips (if any) */}
              {studentMovementLogs.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 text-xs block">Gate Passes & Movement Log</span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Date & Time</th>
                          <th className="py-2 px-3">Reason</th>
                          <th className="py-2 px-3">Authorized Contact</th>
                          <th className="py-2 px-3">Gate Officer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentMovementLogs.map((mov) => (
                          <tr key={mov.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                mov.type === 'Late Arrival'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}>
                                {mov.type}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-700">{mov.date} {mov.time}</td>
                            <td className="py-2 px-3 text-slate-600">{mov.reason}</td>
                            <td className="py-2 px-3 text-slate-600">{mov.authorizedByPerson || 'Standard Gate Slip'}</td>
                            <td className="py-2 px-3 text-slate-500">{mov.recordedByStaffName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ACADEMICS & EXAM GRADES */}
          {selectedTab === 'exams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Term Assessment & Examination Results</h3>
                  <p className="text-xs text-slate-500">Moderated examination mark records and letter grades.</p>
                </div>
              </div>

              {studentMarks.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No examination score entries published for this student record.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                        <th className="py-2.5 px-4">Subject</th>
                        <th className="py-2.5 px-4">Assessment Term</th>
                        <th className="py-2.5 px-4 font-right">Marks Obtained</th>
                        <th className="py-2.5 px-4 font-center">Grade</th>
                        <th className="py-2.5 px-4">Faculty Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentMarks.map((m) => {
                        const examObj = exams.find((e) => e.id === m.examId);
                        return (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-bold text-slate-900">{m.subject}</td>
                            <td className="py-2.5 px-4 text-slate-600">{examObj ? examObj.name : 'Mid-Term Exam'}</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-800 tabular-nums">
                              {m.marksObtained} / {m.totalMarks}
                            </td>
                            <td className="py-2.5 px-4 font-mono font-bold text-theme-primary">
                              {m.grade}
                            </td>
                            <td className="py-2.5 px-4 text-slate-500 text-[11px]">{m.remarks || 'Consistent performance'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FEES & BURSAR */}
          {selectedTab === 'fees' && (
            <div className="space-y-6">
              {studentFees ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase">Total Assessed</span>
                      <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                        ${studentFees.totalFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                      <span className="text-[11px] text-emerald-700 block font-semibold uppercase">Paid to Date</span>
                      <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">
                        ${studentFees.paid.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                      <span className="text-[11px] text-amber-700 block font-semibold uppercase">Outstanding Due</span>
                      <span className="text-xl font-bold font-mono text-amber-800 mt-1 block">
                        ${studentFees.pending.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase">Status</span>
                      <span className={`inline-block mt-1 font-bold text-xs ${
                        studentFees.status === 'Paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {studentFees.status}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Due: {studentFees.dueDate}</span>
                    </div>
                  </div>

                  {/* Payment Receipts History */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Payment Receipts</h4>
                    {studentPayments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No receipts issued yet for this account.</p>
                    ) : (
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                              <th className="py-2.5 px-4">Receipt #</th>
                              <th className="py-2.5 px-4">Date</th>
                              <th className="py-2.5 px-4">Amount</th>
                              <th className="py-2.5 px-4">Method</th>
                              <th className="py-2.5 px-4">Reference</th>
                              <th className="py-2.5 px-4">Cashier</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {studentPayments.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                                <td className="py-2.5 px-4 font-mono text-slate-600">{p.date}</td>
                                <td className="py-2.5 px-4 font-mono font-bold text-emerald-800">${p.amount.toLocaleString()}</td>
                                <td className="py-2.5 px-4 text-slate-700">{p.paymentMethod}</td>
                                <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{p.referenceNumber}</td>
                                <td className="py-2.5 px-4 text-slate-600">{p.receivedBy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No active fee ledger account found for student ID {student.id}.
                </div>
              )}
            </div>
          )}

          {/* TAB 7: HEALTH & SAFETY */}
          {selectedTab === 'medical' && (
            <div className="space-y-6">
              <div className="bg-rose-50/70 p-5 rounded-xl border border-rose-200/80 space-y-3">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                  <HeartPulse className="w-4 h-4 text-rose-700" />
                  <span>Confidential Student Health Profile</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Blood Group</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{student.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Emergency Contact Person</span>
                    <span className="font-bold text-slate-900">{student.emergencyContactPerson || student.parentName}</span>
                    <span className="font-mono text-slate-700 block">{student.emergencyContact || student.parentPhone}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Documented Medical Alerts & Allergies</span>
                    <p className="font-medium text-rose-900 bg-white/70 p-2.5 rounded-lg border border-rose-200/60 mt-1">
                      {student.medicalAlerts || 'No acute allergies, dietary restrictions, or medical alerts on file.'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Authorized Campus Pickup Escorts</span>
                    <p className="font-medium text-slate-800 bg-white/70 p-2.5 rounded-lg border border-slate-200 mt-1">
                      {student.authorizedPickup || `${student.parentName} (Parent)`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-[11px]">
                Health records are strictly governed by institutional privacy guidelines. Any amendments must be submitted with official doctor documentation to the School Infirmary (Sister Mary Grace).
              </div>
            </div>
          )}

          {/* TAB 8: DOCUMENTS & PROOFS */}
          {selectedTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Enrolment Documents & Certificates</h3>
                  <p className="text-xs text-slate-500">Verified credentials and statutory attachments on record.</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Document Title</th>
                      <th className="py-2.5 px-4">Format</th>
                      <th className="py-2.5 px-4">File Size</th>
                      <th className="py-2.5 px-4">Verification Status</th>
                      <th className="py-2.5 px-4">Verification Officer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(student.documents && student.documents.length > 0
                      ? student.documents
                      : [
                          { id: 'd-1', name: 'Birth Certificate', type: 'PDF', fileSize: '1.2 MB', status: 'Verified' as const, verifiedBy: 'Kavita Chawla' },
                          { id: 'd-2', name: 'Transfer Certificate (TC)', type: 'PDF', fileSize: '850 KB', status: 'Verified' as const, verifiedBy: 'Dr. Arthur Campbell' },
                          { id: 'd-3', name: 'Immunization & Health Record', type: 'PDF', fileSize: '640 KB', status: 'Verified' as const, verifiedBy: 'Sister Mary Grace' },
                          { id: 'd-4', name: 'Guardian Address Proof', type: 'PDF', fileSize: '1.0 MB', status: 'Verified' as const, verifiedBy: 'Kavita Chawla' }
                        ]
                    ).map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{doc.name}</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{doc.type}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">{doc.fileSize || '1.1 MB'}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 font-medium">{doc.verifiedBy || 'Admissions Desk'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: LIFECYCLE TIMELINE */}
          {selectedTab === 'lifecycle' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Lifecycle & Progression History</h3>
                <p className="text-xs text-slate-500">Record of enrollment, academic promotions, and milestone events.</p>
              </div>

              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-2">
                {(student.lifecycleHistory && student.lifecycleHistory.length > 0
                  ? student.lifecycleHistory
                  : [
                      { id: 'lc-1', date: student.admissionDate || '2024-04-10', action: 'Admitted', note: `Enrolled into ${matchedClass?.name} under general merit admissions`, actor: 'Dr. Arthur Campbell' },
                      { id: 'lc-2', date: '2025-04-01', action: 'Promotion', note: 'Promoted to next grade level with academic clearance', actor: 'Evelyn Hayes' },
                      { id: 'lc-3', date: '2026-04-01', action: 'Current Term', note: 'Active session started in AY 2026–2027', actor: 'Evelyn Hayes' }
                    ]
                ).map((entry) => (
                  <div key={entry.id} className="relative group">
                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-theme-primary ring-4 ring-white" />
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{entry.action}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{entry.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{entry.note}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Authorized by: {entry.actor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT TRAIL */}
          {selectedTab === 'activity' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Institutional Security & Action Audit Ledger</h3>
                <p className="text-xs text-slate-500">Immutable ledger events referencing student ID {student.admissionId}.</p>
              </div>

              {studentAuditLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No logged modifications for this student during the current session.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                        <th className="py-2.5 px-4">Timestamp</th>
                        <th className="py-2.5 px-4">Action</th>
                        <th className="py-2.5 px-4">Staff Actor</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Audit Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{log.action}</td>
                          <td className="py-2.5 px-4 text-slate-700">
                            {log.actorName} ({log.actorRole.toUpperCase()})
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.status === 'SUCCESS'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 text-[11px]">{log.reason || 'Record updated'}</td>
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
          <span>Record verified with Greenfield International School Registry</span>
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
