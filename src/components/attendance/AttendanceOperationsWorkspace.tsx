import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentAttendanceMarker } from './StudentAttendanceMarker';
import { PeriodWiseAttendanceMatrix } from './PeriodWiseAttendanceMatrix';
import { StaffLeaveModal } from './StaffLeaveModal';
import { StudentMovementModal } from './StudentMovementModal';
import { exportAttendanceCSV } from '../../data/attendanceData';
import {
  StaffLeaveRequest,
  AttendanceCorrectionRequest,
  StudentMovementRecord,
  StaffAttendanceEntry,
  Student
} from '../../types';
import { StudentProfileModal } from '../common/StudentProfileModal';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Briefcase,
  FileCheck,
  ShieldAlert,
  Clock,
  BarChart3,
  Settings,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  HeartPulse,
  Eye
} from 'lucide-react';

interface AttendanceOperationsWorkspaceProps {
  defaultTab?:
    | 'dashboard'
    | 'student_attendance'
    | 'staff_attendance'
    | 'leave_management'
    | 'corrections'
    | 'movement'
    | 'reports'
    | 'settings';
  initialTeacherId?: string;
  defaultAttendanceMode?: 'matrix' | 'register';
}

export const AttendanceOperationsWorkspace: React.FC<AttendanceOperationsWorkspaceProps> = ({
  defaultTab = 'dashboard',
  initialTeacherId,
  defaultAttendanceMode = 'matrix'
}) => {
  const {
    currentRole,
    userProfiles,
    classes,
    students,
    teachers,
    staff,
    attendance,
    staffAttendance,
    leaveRequests,
    correctionRequests,
    studentMovements,
    attendancePolicy,
    updateAttendancePolicy,
    reviewAttendanceCorrection,
    reviewStaffLeave,
    cancelStaffLeave,
    recordStaffAttendance,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'student_attendance'
    | 'staff_attendance'
    | 'leave_management'
    | 'corrections'
    | 'movement'
    | 'reports'
    | 'settings'
  >(defaultTab);

  const [studentAttendanceMode, setStudentAttendanceMode] = useState<'matrix' | 'register'>(defaultAttendanceMode);

  const isTabPermitted = (tab: string) => {
    switch (currentRole) {
      case 'principal':
      case 'vice_principal':
        return true;
      case 'teacher':
        return ['student_attendance', 'leave_management', 'corrections', 'movement'].includes(tab);
      case 'accountant':
        return ['staff_attendance', 'reports'].includes(tab);
      case 'receptionist':
        return ['movement'].includes(tab);
      default:
        return false;
    }
  };

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [movementModalType, setMovementModalType] = useState<'Late Arrival' | 'Early Departure'>('Late Arrival');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Leave review modal state
  const [reviewingLeave, setReviewingLeave] = useState<StaffLeaveRequest | null>(null);
  const [leaveReviewDecision, setLeaveReviewDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [leaveReviewNote, setLeaveReviewNote] = useState('');

  // Correction review modal state
  const [reviewingCorrection, setReviewingCorrection] = useState<AttendanceCorrectionRequest | null>(null);
  const [correctionReviewDecision, setCorrectionReviewDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [correctionReviewNote, setCorrectionReviewNote] = useState('');

  // Reports state
  const [reportThreshold, setReportThreshold] = useState<number>(85);
  const [reportClassFilter, setReportClassFilter] = useState<string>('all');

  // Staff Attendance Tab State
  const [staffAttDate, setStaffAttDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [staffDeptFilter, setStaffDeptFilter] = useState<string>('all');
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all');

  // Policy Settings Draft
  const [policyCutoff, setPolicyCutoff] = useState(attendancePolicy.morningCutoffTime);
  const [policyMinRate, setPolicyMinRate] = useState(attendancePolicy.minimumRequiredPercentage);
  const [policyLateCredit, setPolicyLateCredit] = useState(attendancePolicy.countLateAsPresentPercentage);
  const [policyHalfDayCredit, setPolicyHalfDayCredit] = useState(attendancePolicy.countHalfDayAsPercentage);
  const [policyExcusedCredit, setPolicyExcusedCredit] = useState(attendancePolicy.countExcusedAsPresent);
  const [policyRequireApproval, setPolicyRequireApproval] = useState(attendancePolicy.requireCorrectionApproval);

  // Get staff daily record for selected date or initialize
  const allStaffList = useMemo(() => [...teachers, ...staff], [teachers, staff]);

  const currentStaffDaily = useMemo(() => {
    return staffAttendance.find((s) => s.date === staffAttDate);
  }, [staffAttendance, staffAttDate]);

  // Compute school-wide KPI metrics from actual underlying records
  const kpis = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter((a) => a.date === todayStr);

    let totalEnrolledToday = 0;
    let presentToday = 0;
    let absentToday = 0;
    let lateToday = 0;
    let excusedToday = 0;

    todayRecords.forEach((att) => {
      att.records.forEach((r) => {
        totalEnrolledToday++;
        if (r.status === 'Present') presentToday++;
        else if (r.status === 'Absent') absentToday++;
        else if (r.status === 'Late') lateToday++;
        else if (r.status === 'Excused') excusedToday++;
      });
    });

    const completionPct = classes.length > 0 ? Math.round((todayRecords.length / classes.length) * 100) : 0;
    const overallRate = totalEnrolledToday > 0 ? Math.round(((presentToday + lateToday + excusedToday) / totalEnrolledToday) * 100) : 92;

    const lowAttendanceStudents = students.filter((s) => s.attendanceRate < attendancePolicy.minimumRequiredPercentage);
    const pendingCorrections = correctionRequests.filter((c) => c.status === 'Pending').length;
    const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;

    return {
      totalEnrolledToday: totalEnrolledToday || students.length,
      presentToday,
      absentToday,
      lateToday,
      excusedToday,
      completionPct,
      overallRate,
      lowAttendanceCount: lowAttendanceStudents.length,
      pendingCorrections,
      pendingLeaves
    };
  }, [attendance, classes, students, correctionRequests, leaveRequests, attendancePolicy]);

  const permittedTabs = useMemo(() => {
    const all = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'student_attendance', label: 'Class Roll Call', icon: CalendarCheck },
      { id: 'staff_attendance', label: 'Staff Attendance', icon: Users },
      { id: 'leave_management', label: 'Leave Management', icon: Briefcase, badge: kpis.pendingLeaves },
      { id: 'corrections', label: 'Corrections Queue', icon: ShieldAlert, badge: kpis.pendingCorrections },
      { id: 'movement', label: 'Late & Early Departures', icon: Clock },
      { id: 'reports', label: 'Reports & CSV', icon: BarChart3 },
      { id: 'settings', label: 'Policy & Rules', icon: Settings }
    ];
    return all.filter((t) => isTabPermitted(t.id));
  }, [currentRole, kpis.pendingLeaves, kpis.pendingCorrections]);

  useEffect(() => {
    if (defaultTab && isTabPermitted(defaultTab)) {
      setActiveTab(defaultTab);
    } else if (permittedTabs.length > 0 && !permittedTabs.some((t) => t.id === activeTab)) {
      setActiveTab(permittedTabs[0].id as any);
    }
  }, [defaultTab, currentRole, permittedTabs]);

  // Handle Leave Review Submit
  const handleExecuteLeaveReview = () => {
    if (!reviewingLeave) return;
    const res = reviewStaffLeave(reviewingLeave.id, leaveReviewDecision, leaveReviewNote);
    if (res.success) {
      addToast({
        type: 'success',
        title: `Leave ${leaveReviewDecision}`,
        message: `Leave request for ${reviewingLeave.staffName} marked as ${leaveReviewDecision}.`
      });
      setReviewingLeave(null);
      setLeaveReviewNote('');
    }
  };

  // Handle Correction Review Submit
  const handleExecuteCorrectionReview = () => {
    if (!reviewingCorrection) return;
    const res = reviewAttendanceCorrection(reviewingCorrection.id, correctionReviewDecision, correctionReviewNote);
    if (res.success) {
      addToast({
        type: 'success',
        title: `Correction ${correctionReviewDecision}`,
        message: `Attendance for ${reviewingCorrection.studentName} updated to ${reviewingCorrection.requestedStatus}.`
      });
      setReviewingCorrection(null);
      setCorrectionReviewNote('');
    }
  };

  // Handle Policy Save
  const handleSavePolicy = () => {
    updateAttendancePolicy({
      morningCutoffTime: policyCutoff,
      minimumRequiredPercentage: Number(policyMinRate),
      countLateAsPresentPercentage: Number(policyLateCredit),
      countHalfDayAsPercentage: Number(policyHalfDayCredit),
      countExcusedAsPresent: policyExcusedCredit,
      requireCorrectionApproval: policyRequireApproval
    });
    addToast({
      type: 'success',
      title: 'Attendance Policy Updated',
      message: 'Institutional rules and calculation formulas updated across all registers.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {permittedTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                  isActive
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span
                    className={`w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center ${
                      tab.id === 'leave_management' ? 'bg-rose-600' : 'bg-amber-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: DASHBOARD ================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Today's School Attendance Rate</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-black font-mono text-emerald-800">{kpis.overallRate}%</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Target: 85%
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                Derived dynamically from all marked student attendance sessions today.
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Roll Call Completion</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-black font-mono text-slate-900">{kpis.completionPct}%</span>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {attendance.filter((a) => a.date === new Date().toISOString().split('T')[0]).length} / {classes.length} Divisions
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                Classes that have submitted official attendance for today.
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">At-Risk Attendance Watchlist</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-black font-mono text-rose-700">{kpis.lowAttendanceCount}</span>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  &lt; {attendancePolicy.minimumRequiredPercentage}% Threshold
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                Students requiring parent notification or counseling intervention.
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Action Items (Leaves & Corrections)</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-3xl font-black font-mono text-amber-700">
                  {kpis.pendingCorrections + kpis.pendingLeaves}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  Pending Review
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">
                {kpis.pendingCorrections} correction requests · {kpis.pendingLeaves} faculty leave applications.
              </span>
            </div>
          </div>

          {/* Division Roll Call Status & Watchlist Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Division-level roll call table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Today's Class Roll Call Submissions</h3>
                  <p className="text-[11px] text-slate-500">Live submission status across all school divisions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('student_attendance')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900"
                >
                  Open Roll Call Marker →
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {classes.map((cls) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const session = attendance.find((a) => a.classId === cls.id && a.date === todayStr);

                  return (
                    <div key={cls.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{cls.name}</span>
                        <span className="text-[11px] text-slate-400">
                          Mentor: {cls.classTeacherName} · {cls.room}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-800 text-sm block">
                            {cls.attendanceToday}%
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {Math.round((cls.studentCount * cls.attendanceToday) / 100)} / {cls.studentCount} present
                          </span>
                        </div>
                        {session?.status === 'Submitted' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                            Submitted
                          </span>
                        ) : session ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Draft
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance Watchlist (< 85%) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Attendance Watchlist (&lt; {attendancePolicy.minimumRequiredPercentage}%)</h3>
                  <p className="text-[11px] text-slate-500">Students falling below mandatory institutional attendance threshold</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 font-mono">
                  {students.filter((s) => s.attendanceRate < attendancePolicy.minimumRequiredPercentage).length} flagged
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs max-h-80 overflow-y-auto">
                {students
                  .filter((s) => s.attendanceRate < attendancePolicy.minimumRequiredPercentage)
                  .map((student) => {
                    const cls = classes.find((c) => c.id === student.classId);
                    return (
                      <div key={student.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center shrink-0">
                            {student.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setViewingStudent(student)}
                              className="font-bold text-slate-900 hover:text-emerald-700 text-left block"
                            >
                              {student.name}
                            </button>
                            <span className="text-[11px] text-slate-400">
                              {cls?.name || student.classId} · Guardian: {student.parentName} ({student.parentPhone})
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-extrabold text-sm text-rose-700 block">
                            {student.attendanceRate}%
                          </span>
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                            Counseling Required
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CLASS ROLL CALL & PERIOD MATRIX ================= */}
      {activeTab === 'student_attendance' && (
        <div className="space-y-4">
          {/* View mode toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStudentAttendanceMode('matrix')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  studentAttendanceMode === 'matrix'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Period-Wise Attendance Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => setStudentAttendanceMode('register')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  studentAttendanceMode === 'register'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Single Period Roll Call</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>
                {studentAttendanceMode === 'matrix'
                  ? 'Matrix View: Scheduled periods with faculty authorization permissions'
                  : 'Single Period Focus: Arrival timestamps & remarks entry'}
              </span>
            </div>
          </div>

          {studentAttendanceMode === 'matrix' ? (
            <PeriodWiseAttendanceMatrix
              initialTeacherId={initialTeacherId}
              onOpenSingleRegister={() => {
                setStudentAttendanceMode('register');
              }}
            />
          ) : (
            <StudentAttendanceMarker />
          )}
        </div>
      )}

      {/* ================= TAB 3: STAFF ATTENDANCE ================= */}
      {activeTab === 'staff_attendance' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Staff & Faculty Attendance Register</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily presence, biometric arrival timestamps, and approved leave records for teaching and general staff.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <input
                type="date"
                value={staffAttDate}
                onChange={(e) => setStaffAttDate(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-bold"
              />

              <button
                type="button"
                onClick={() => {
                  const updatedEntries: StaffAttendanceEntry[] = allStaffList.map((st) => ({
                    staffId: st.id,
                    staffName: st.name,
                    roleType: (st as any).subject ? 'teacher' : 'staff',
                    department: (st as any).department || 'Faculty',
                    status: 'Present',
                    arrivalTime: '08:00'
                  }));
                  recordStaffAttendance(staffAttDate, updatedEntries, false);
                  addToast({
                    type: 'success',
                    title: 'Staff Register Updated',
                    message: `Marked all staff present for ${staffAttDate}.`
                  });
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Mark All Staff Present
              </button>
            </div>
          </div>

          {/* Staff Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Department / Designation</th>
                  <th className="py-3 px-4">Role Classification</th>
                  <th className="py-3 px-4">Arrival Timestamp</th>
                  <th className="py-3 px-4 text-center">Daily Status</th>
                  <th className="py-3 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allStaffList.map((member) => {
                  const currentEntry = currentStaffDaily?.entries.find((e) => e.staffId === member.id);
                  const status = currentEntry?.status || 'Present';

                  return (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center shrink-0">
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{member.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{member.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {(member as any).department || (member as any).designation || 'Academic Staff'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {(member as any).subject ? 'Faculty / Teacher' : 'Administrative / Support'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {currentEntry?.arrivalTime || '08:00 AM'}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            status === 'Present'
                              ? 'bg-emerald-100 text-emerald-900'
                              : status === 'On Leave'
                              ? 'bg-blue-100 text-blue-900'
                              : status === 'Late'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-900'
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 italic text-[11px]">
                        {currentEntry?.remarks || 'Routine on-campus schedule'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: LEAVE MANAGEMENT ================= */}
      {activeTab === 'leave_management' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Staff Leave Management</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Faculty & staff leave applications, calendar window approvals, and substitute duty coordination.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for Staff Leave</span>
            </button>
          </div>

          {/* Leave Requests Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Date Window</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason / Attachment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Administrative Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{leave.staffName}</span>
                      <span className="text-[11px] text-slate-400">{leave.staffRole} · {leave.department}</span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">{leave.leaveType}</td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {leave.startDate} to {leave.endDate}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-900">
                      {leave.totalDays} day(s)
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-700">{leave.reason}</p>
                      {leave.attachmentName && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded mt-1 font-mono">
                          📎 {leave.attachmentName}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : leave.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900'
                            : leave.status === 'Cancelled'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {leave.status === 'Pending' ? (
                        currentRole === 'principal' || currentRole === 'vice_principal' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingLeave(leave);
                                setLeaveReviewDecision('Approved');
                              }}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px]"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingLeave(leave);
                                setLeaveReviewDecision('Rejected');
                              }}
                              className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-[11px]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => cancelStaffLeave(leave.id)}
                            className="px-2.5 py-1 text-slate-500 hover:text-rose-700 text-[11px] font-bold"
                          >
                            Cancel Request
                          </button>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Reviewed by {leave.reviewedByName || 'Administration'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CORRECTIONS QUEUE ================= */}
      {activeTab === 'corrections' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Correction Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized teacher adjustment requests for already submitted attendance registers.
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs">
              {kpis.pendingCorrections} Pending Approval
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4">Date & Session</th>
                  <th className="py-3 px-4">Original Status</th>
                  <th className="py-3 px-4">Requested Status</th>
                  <th className="py-3 px-4">Requester & Reason</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {correctionRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{req.studentName}</span>
                      <span className="text-[11px] text-slate-400">{req.className} · {req.studentId}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {req.date} · {req.period}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {req.originalStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {req.requestedStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-[11px] text-slate-500 block font-semibold">{req.requestedByName} ({req.requestedByRole}):</span>
                      <p className="line-clamp-2 text-slate-700">{req.reason}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-900'
                            : req.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {req.status === 'Pending' && (currentRole === 'principal' || currentRole === 'vice_principal') ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReviewingCorrection(req);
                              setCorrectionReviewDecision('Approved');
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReviewingCorrection(req);
                              setCorrectionReviewDecision('Rejected');
                            }}
                            className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          {req.reviewedByName ? `Decided by ${req.reviewedByName}` : 'Awaiting Review'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: LATE ARRIVALS & STUDENT MOVEMENT ================= */}
      {activeTab === 'movement' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Student Movement Register</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Front desk gate control: late student check-in slips and authorized early departures with guardian verification.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMovementModalType('Late Arrival');
                  setShowMovementModal(true);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Log Late Arrival</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMovementModalType('Early Departure');
                  setShowMovementModal(true);
                }}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>Log Early Departure</span>
              </button>
            </div>
          </div>

          {/* Movement Entries Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Student & Class</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Authorized Pickup / Contact</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4 text-center">Attendance Synchronized</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          mov.type === 'Late Arrival'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        {mov.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {mov.date} · {mov.time}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{mov.studentName}</span>
                      <span className="text-[11px] text-slate-400">{mov.className}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-700 max-w-xs">{mov.reason}</td>

                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {mov.authorizedByPerson || 'Standard Gate Slip'}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {mov.recordedByStaffName} ({mov.recordedByRole})
                    </td>

                    <td className="py-3 px-4 text-center">
                      {mov.statusUpdatedInAttendance ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Synced
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Gate only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 7: REPORTS & CSV EXPORT ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Attendance Reports & CSV Export</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download verified tabular records, class-by-class roll calls, and absenteeism interventions.
              </p>
            </div>

            {/* Quick CSV Export Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  exportAttendanceCSV(
                    'daily_class',
                    attendance,
                    classes,
                    students,
                    allStaffList,
                    leaveRequests,
                    studentMovements
                  )
                }
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Class Attendance CSV</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  exportAttendanceCSV(
                    'student_history',
                    attendance,
                    classes,
                    students,
                    allStaffList,
                    leaveRequests,
                    studentMovements
                  )
                }
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Student History CSV</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  exportAttendanceCSV(
                    'leave_summary',
                    attendance,
                    classes,
                    students,
                    allStaffList,
                    leaveRequests,
                    studentMovements
                  )
                }
                className="px-3.5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Leave CSV</span>
              </button>
            </div>
          </div>

          {/* Remedial & Chronic Absenteeism Filter Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Custom Threshold Remedial Analysis</h3>
                <p className="text-slate-500">Filter students who fall below an academic attendance benchmark.</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-slate-600 font-bold">Attendance Benchmark:</label>
                <select
                  value={reportThreshold}
                  onChange={(e) => setReportThreshold(Number(e.target.value))}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 text-xs"
                >
                  <option value={90}>&lt; 90% (Strict Honor Standard)</option>
                  <option value={85}>&lt; 85% (School Policy Threshold)</option>
                  <option value={80}>&lt; 80% (Warning Level)</option>
                  <option value={75}>&lt; 75% (Mandatory Remedial)</option>
                </select>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Class Division</th>
                    <th className="py-2.5 px-4">Admission ID</th>
                    <th className="py-2.5 px-4">Current Rate</th>
                    <th className="py-2.5 px-4">Guardian Contact</th>
                    <th className="py-2.5 px-4 text-right">Intervention Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((s) => s.attendanceRate < reportThreshold)
                    .map((s) => {
                      const cls = classes.find((c) => c.id === s.classId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">{s.name}</td>
                          <td className="py-2.5 px-4 text-slate-600">{cls?.name || s.classId}</td>
                          <td className="py-2.5 px-4 font-mono text-slate-500">{s.admissionId}</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-rose-700">{s.attendanceRate}%</td>
                          <td className="py-2.5 px-4 text-slate-600">{s.parentName} ({s.parentPhone})</td>
                          <td className="py-2.5 px-4 text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                              Flagged for Vice Principal
                            </span>
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

      {/* ================= TAB 8: POLICY & SETTINGS ================= */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-6 text-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Attendance Policy & Rules</h2>
            <p className="text-slate-500 mt-1">
              Configure parameters governing tardiness, minimum compliance rates, excused absences, and correction governance.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Morning Bell Gate Cutoff Time</label>
                <input
                  type="text"
                  value={policyCutoff}
                  onChange={(e) => setPolicyCutoff(e.target.value)}
                  placeholder="08:30"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Arrivals past this timestamp require a Late Gate Slip.</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Minimum Required Percentage (%)</label>
                <input
                  type="number"
                  value={policyMinRate}
                  onChange={(e) => setPolicyMinRate(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Academic promotion eligibility threshold.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Late (Tardy) Presence Credit (%)</label>
                <select
                  value={policyLateCredit}
                  onChange={(e) => setPolicyLateCredit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  <option value={100}>100% Credit (Presence with Tardy Flag)</option>
                  <option value={75}>75% Credit</option>
                  <option value={50}>50% Credit (Half Day Equivalent)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Half Day Presence Credit (%)</label>
                <select
                  value={policyHalfDayCredit}
                  onChange={(e) => setPolicyHalfDayCredit(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900"
                >
                  <option value={50}>50% Credit</option>
                  <option value={0}>0% Credit (Treated as Absent)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policyExcusedCredit}
                  onChange={(e) => setPolicyExcusedCredit(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Count Excused Absences in Attendance Numerator</span>
                  <span className="text-[11px] text-slate-500">Approved medical leave and official school sports duty count toward positive attendance rate.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-slate-200">
                <input
                  type="checkbox"
                  checked={policyRequireApproval}
                  onChange={(e) => setPolicyRequireApproval(e.target.checked)}
                  className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Require Administrative Approval for Attendance Corrections</span>
                  <span className="text-[11px] text-slate-500">Teachers cannot retroactively modify submitted records without Principal or Vice Principal sign-off.</span>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSavePolicy}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Save Institutional Attendance Rules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Leave Modal */}
      {reviewingLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Review Staff Leave Application
            </h3>
            <p className="text-slate-600">
              <strong>{reviewingLeave.staffName}</strong> ({reviewingLeave.department}) has applied for{' '}
              <strong>{reviewingLeave.leaveType}</strong> from <strong>{reviewingLeave.startDate}</strong> to{' '}
              <strong>{reviewingLeave.endDate}</strong> ({reviewingLeave.totalDays} day(s)).
            </p>
            <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
              "{reviewingLeave.reason}"
            </p>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Administrative Decision</label>
              <select
                value={leaveReviewDecision}
                onChange={(e) => setLeaveReviewDecision(e.target.value as 'Approved' | 'Rejected')}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="Approved">Approve Leave (Sync to Staff Attendance)</option>
                <option value="Rejected">Reject Leave Application</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Decision Notes / Remarks</label>
              <textarea
                rows={2}
                value={leaveReviewNote}
                onChange={(e) => setLeaveReviewNote(e.target.value)}
                placeholder="e.g. Approved with substitute faculty assigned. Please coordinate lesson plans."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingLeave(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteLeaveReview}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Correction Modal */}
      {reviewingCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Review Attendance Correction
            </h3>
            <p className="text-slate-600">
              Teacher <strong>{reviewingCorrection.requestedByName}</strong> requested modifying{' '}
              <strong>{reviewingCorrection.studentName}</strong>'s status from{' '}
              <span className="font-bold text-slate-800">{reviewingCorrection.originalStatus}</span> to{' '}
              <span className="font-bold text-emerald-800">{reviewingCorrection.requestedStatus}</span> on{' '}
              <strong>{reviewingCorrection.date}</strong> ({reviewingCorrection.period}).
            </p>
            <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
              "{reviewingCorrection.reason}"
            </p>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Administrative Decision</label>
              <select
                value={correctionReviewDecision}
                onChange={(e) => setCorrectionReviewDecision(e.target.value as 'Approved' | 'Rejected')}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="Approved">Approve & Update Official Register</option>
                <option value="Rejected">Reject Correction Request</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Review Note</label>
              <textarea
                rows={2}
                value={correctionReviewNote}
                onChange={(e) => setCorrectionReviewNote(e.target.value)}
                placeholder="e.g. Verified with bus delay log. Correction accepted."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewingCorrection(null)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteCorrectionReview}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow-xs"
              >
                Confirm Correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile & Creation Modals */}
      {viewingStudent && (
        <StudentProfileModal
          isOpen={true}
          onClose={() => setViewingStudent(null)}
          student={viewingStudent}
        />
      )}

      {showLeaveModal && (
        <StaffLeaveModal
          isOpen={true}
          onClose={() => setShowLeaveModal(false)}
        />
      )}

      {showMovementModal && (
        <StudentMovementModal
          isOpen={true}
          onClose={() => setShowMovementModal(false)}
          defaultType={movementModalType}
        />
      )}
    </div>
  );
};
