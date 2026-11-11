import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { StaffFormModal } from '../../common/StaffFormModal';
import { TeacherFormModal } from '../../common/TeacherFormModal';
import { TeacherProfileModal } from '../../common/TeacherProfileModal';
import { StaffProfileModal } from '../../common/StaffProfileModal';
import { Teacher, Staff, StaffLeaveRequest } from '../../../types';
import {
  Users,
  Briefcase,
  CalendarCheck,
  FileText,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Building,
  Mail,
  Phone,
  GraduationCap,
  Download,
  Printer,
  X,
  DollarSign,
  BarChart3,
  Layers,
  User,
  ShieldCheck,
  AlertCircle,
  Eye,
  Check,
  FileCheck2,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lock
} from 'lucide-react';

interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headName: string;
  facultyCount: number;
  staffCount: number;
  description: string;
}

interface EmploymentDocument {
  id: string;
  title: string;
  employeeName: string;
  employeeType: 'Faculty' | 'Staff';
  category: 'Contract' | 'Degree / Qualification' | 'Police Clearance' | 'ID Proof' | 'Medical Fitness';
  issueDate: string;
  status: 'Verified' | 'Pending Review';
  fileSize: string;
}

interface CandidateApplication {
  id: string;
  candidateName: string;
  position: string;
  department: string;
  experienceYears: number;
  appliedDate: string;
  stage: 'Screening' | 'Interview Scheduled' | 'Offer Extended' | 'Rejected';
  phone: string;
  email: string;
  notes?: string;
}

export const HRStaffView: React.FC = () => {
  const {
    teachers,
    staff,
    leaveRequests,
    reviewStaffLeave,
    applyStaffLeave,
    addToast,
    logAuditEvent,
    userProfiles
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directoryType, setDirectoryType] = useState<'all' | 'faculty' | 'staff'>('all');

  // Modals & Selection
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<EmploymentDocument | null>(null);
  const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Attendance Simulation State
  const [attendanceDate, setAttendanceDate] = useState('2026-10-22');
  const [staffAttendanceStatus, setStaffAttendanceStatus] = useState<Record<string, 'Present' | 'Absent' | 'Late' | 'On Leave'>>({
    't-1': 'Present',
    't-2': 'Present',
    't-3': 'Present',
    't-4': 'Present',
    't-5': 'Present',
    't-6': 'Late',
    't-7': 'Present',
    't-8': 'Present',
    'st-1': 'Present',
    'st-2': 'Present',
    'st-3': 'On Leave',
    'st-4': 'Present',
    'st-5': 'Present',
    'st-6': 'Present'
  });

  // Departments State
  const [departments, setDepartments] = useState<DepartmentItem[]>([
    {
      id: 'dept-1',
      name: 'STEM & Natural Sciences',
      code: 'STEM-SCI',
      headName: 'Dr. Vikram Sharma',
      facultyCount: 3,
      staffCount: 1,
      description: 'Physics, Chemistry, Biology, STEM Robotics and computer laboratory operations.'
    },
    {
      id: 'dept-2',
      name: 'Humanities & Social Studies',
      code: 'HUM-SOC',
      headName: 'Mrs. Priya Nair',
      facultyCount: 2,
      staffCount: 0,
      description: 'History, Civics, Geography, Economics, and Social Sciences curriculum.'
    },
    {
      id: 'dept-3',
      name: 'Languages & Literature',
      code: 'LANG-LIT',
      headName: 'Mr. David Miller',
      facultyCount: 3,
      staffCount: 0,
      description: 'English Core, World Literature, Hindi, French, and speech communication.'
    },
    {
      id: 'dept-4',
      name: 'Finance & Bursar Accounts',
      code: 'FIN-BUR',
      headName: 'Mr. Alok Saxena',
      facultyCount: 0,
      staffCount: 2,
      description: 'Tuition collections, bursar ledgers, vendor disbursements, and financial audits.'
    },
    {
      id: 'dept-5',
      name: 'Library & Information Commons',
      code: 'LIB-COM',
      headName: 'Mrs. Shweta Iyer',
      facultyCount: 0,
      staffCount: 1,
      description: 'Memorial library circulation, digital research catalog, and book repository.'
    },
    {
      id: 'dept-6',
      name: 'Fleet Logistics & Transportation',
      code: 'TRANS-LOG',
      headName: 'Mr. Rajesh Kumar',
      facultyCount: 0,
      staffCount: 1,
      description: 'School bus fleet operations, route navigation, and student commute safety.'
    },
    {
      id: 'dept-7',
      name: 'Front Office & Admissions',
      code: 'FO-ADM',
      headName: 'Ms. Sunita Rao',
      facultyCount: 0,
      staffCount: 1,
      description: 'Campus reception, parent admissions hotline, visitor check-in, and appointments.'
    }
  ]);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', headName: '', description: '' });

  // Employment Documents State
  const [documents, setDocuments] = useState<EmploymentDocument[]>([
    {
      id: 'doc-1',
      title: 'Full-time Faculty Employment Contract (AY 2026-27)',
      employeeName: 'Dr. Vikram Sharma',
      employeeType: 'Faculty',
      category: 'Contract',
      issueDate: '2026-07-01',
      status: 'Verified',
      fileSize: '1.8 MB'
    },
    {
      id: 'doc-2',
      title: 'Ph.D Physics & B.Ed Certified Degree Transcripts',
      employeeName: 'Dr. Vikram Sharma',
      employeeType: 'Faculty',
      category: 'Degree / Qualification',
      issueDate: '2026-07-05',
      status: 'Verified',
      fileSize: '3.4 MB'
    },
    {
      id: 'doc-3',
      title: 'National Criminal Background & Police Verification Clearance',
      employeeName: 'Alok Saxena',
      employeeType: 'Staff',
      category: 'Police Clearance',
      issueDate: '2026-06-15',
      status: 'Verified',
      fileSize: '950 KB'
    },
    {
      id: 'doc-4',
      title: 'Master of Library Science (M.Lib) Certificate',
      employeeName: 'Shweta Iyer',
      employeeType: 'Staff',
      category: 'Degree / Qualification',
      issueDate: '2026-08-01',
      status: 'Verified',
      fileSize: '2.1 MB'
    },
    {
      id: 'doc-5',
      title: 'Commercial Heavy Passenger Vehicle (Bus) Driving License Verification',
      employeeName: 'Mohan Singh',
      employeeType: 'Staff',
      category: 'ID Proof',
      issueDate: '2026-05-10',
      status: 'Verified',
      fileSize: '1.2 MB'
    }
  ]);
  const [docForm, setDocForm] = useState({
    title: '',
    employeeName: '',
    employeeType: 'Faculty' as EmploymentDocument['employeeType'],
    category: 'Contract' as EmploymentDocument['category']
  });

  // Recruitment Candidates State
  const [candidates, setCandidates] = useState<CandidateApplication[]>([
    {
      id: 'cand-1',
      candidateName: 'Dr. Ananya Sen',
      position: 'Senior PGT Computer Science & AI',
      department: 'STEM & Natural Sciences',
      experienceYears: 8,
      appliedDate: '2026-10-10',
      stage: 'Interview Scheduled',
      phone: '+91 98450 11223',
      email: 'ananya.sen@academic.org',
      notes: 'Demonstration lecture scheduled with Academic Dean on Oct 25.'
    },
    {
      id: 'cand-2',
      candidateName: 'Kavita Deshmukh',
      position: 'Primary English & Drama Educator',
      department: 'Languages & Literature',
      experienceYears: 4,
      appliedDate: '2026-10-14',
      stage: 'Screening',
      phone: '+91 98450 33445',
      email: 'kavita.deshmukh@mail.com',
      notes: 'Cambridge CELTA certified. Portfolio under review.'
    },
    {
      id: 'cand-3',
      candidateName: 'Suresh Menon',
      position: 'Junior Physics Lab Assistant',
      department: 'STEM & Natural Sciences',
      experienceYears: 3,
      appliedDate: '2026-10-08',
      stage: 'Offer Extended',
      phone: '+91 98450 55667',
      email: 'suresh.menon@labtech.in',
      notes: 'Formal appointment letter issued. Awaiting joining acceptance.'
    }
  ]);
  const [candidateForm, setCandidateForm] = useState({
    candidateName: '',
    position: 'Senior PGT Computer Science & AI',
    department: 'STEM & Natural Sciences',
    experienceYears: 3,
    phone: '',
    email: ''
  });

  // Payroll Overview State
  const [payrollStatus, setPayrollStatus] = useState<'Drafted' | 'Audited' | 'Disbursed to Bank'>('Audited');
  const [isProcessingPayroll, setIsProcessingPayroll] = useState(false);

  // Leave Form State (Apply on behalf of staff)
  const [leaveForm, setLeaveForm] = useState({
    staffId: '',
    leaveType: 'Casual Leave' as StaffLeaveRequest['leaveType'],
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    reason: ''
  });

  // Filtered Faculty
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        t.name.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        (t.room && t.room.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [teachers, searchQuery, statusFilter]);

  // Filtered Operational Staff
  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q);
      const matchesDept = deptFilter === 'all' || s.department.toLowerCase() === deptFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staff, searchQuery, deptFilter, statusFilter]);

  // Total Personnel Count
  const totalEmployeesCount = teachers.length + staff.length;
  const pendingLeavesCount = leaveRequests.filter((l) => l.status === 'Pending').length;

  // Handle Leave Review with reason requirement
  const handleApproveLeave = (reqId: string, staffName: string) => {
    // Check if HR is approving own request (Mrs. Clara Vance)
    if (staffName.toLowerCase().includes('clara')) {
      addToast({
        type: 'error',
        title: 'Policy Safeguard Violation',
        message: 'HR managers cannot approve their own leave applications. Administrative approval required.'
      });
      return;
    }

    reviewStaffLeave(reqId, 'Approved', 'Approved by HR & Personnel Manager');
    addToast({
      type: 'success',
      title: 'Leave Request Approved',
      message: `${staffName}'s leave application approved and recorded in timetable.`
    });
  };

  const handleDeclineLeaveConfirm = () => {
    if (!rejectingLeaveId || !rejectionReason.trim()) return;
    const req = leaveRequests.find((l) => l.id === rejectingLeaveId);

    reviewStaffLeave(rejectingLeaveId, 'Rejected', rejectionReason.trim());
    addToast({
      type: 'info',
      title: 'Leave Request Declined',
      message: `${req?.staffName || 'Staff'}'s leave application declined (${rejectionReason.trim()}).`
    });

    setRejectingLeaveId(null);
    setRejectionReason('');
  };

  // Submit Leave on Behalf of Staff
  const handleApplyLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allPersonnel = [
      ...teachers.map((t) => ({ id: t.id, name: t.name, role: 'Teacher', dept: 'Academics' })),
      ...staff.map((s) => ({ id: s.id, name: s.name, role: s.role, dept: s.department }))
    ];
    const found = allPersonnel.find((p) => p.id === leaveForm.staffId);
    if (!found) return;

    const diffDays = Math.max(
      1,
      Math.ceil(
        (new Date(leaveForm.endDate).getTime() - new Date(leaveForm.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );

    applyStaffLeave({
      staffId: found.id,
      staffName: found.name,
      staffRole: found.role,
      department: found.dept,
      leaveType: leaveForm.leaveType,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      totalDays: diffDays,
      reason: leaveForm.reason
    });

    setShowApplyLeaveModal(false);
    setLeaveForm({
      staffId: '',
      leaveType: 'Casual Leave',
      startDate: '2026-10-25',
      endDate: '2026-10-26',
      reason: ''
    });

    addToast({
      type: 'success',
      title: 'Leave Application Filed',
      message: `Emergency absence request logged for ${found.name} (${diffDays} days).`
    });
  };

  // Add Department Submit
  const handleAddDeptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;

    const newDept: DepartmentItem = {
      id: `dept-${Date.now()}`,
      name: deptForm.name,
      code: deptForm.code.toUpperCase(),
      headName: deptForm.headName || 'To be nominated',
      facultyCount: 0,
      staffCount: 0,
      description: deptForm.description || 'Institutional department wing'
    };

    setDepartments([...departments, newDept]);
    setShowAddDeptModal(false);
    setDeptForm({ name: '', code: '', headName: '', description: '' });

    addToast({
      type: 'success',
      title: 'Department Created',
      message: `${newDept.name} (${newDept.code}) added to organizational hierarchy.`
    });
  };

  // Add Document Submit
  const handleAddDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title || !docForm.employeeName) return;

    const newDoc: EmploymentDocument = {
      id: `doc-${Date.now()}`,
      title: docForm.title,
      employeeName: docForm.employeeName,
      employeeType: docForm.employeeType,
      category: docForm.category,
      issueDate: '2026-10-22',
      status: 'Verified',
      fileSize: '1.5 MB'
    };

    setDocuments([newDoc, ...documents]);
    setShowAddDocModal(false);
    setDocForm({ title: '', employeeName: '', employeeType: 'Faculty', category: 'Contract' });

    addToast({
      type: 'success',
      title: 'Document Metadata Logged',
      message: `${newDoc.title} registered for ${newDoc.employeeName}.`
    });
  };

  // Add Candidate Submit
  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.candidateName || !candidateForm.phone) return;

    const newCand: CandidateApplication = {
      id: `cand-${Date.now()}`,
      candidateName: candidateForm.candidateName,
      position: candidateForm.position,
      department: candidateForm.department,
      experienceYears: Number(candidateForm.experienceYears),
      appliedDate: '2026-10-22',
      stage: 'Screening',
      phone: candidateForm.phone,
      email: candidateForm.email || 'candidate@applicant.com',
      notes: 'Initial application received via Greenfield career portal.'
    };

    setCandidates([newCand, ...candidates]);
    setShowAddCandidateModal(false);
    setCandidateForm({
      candidateName: '',
      position: 'Senior PGT Computer Science & AI',
      department: 'STEM & Natural Sciences',
      experienceYears: 3,
      phone: '',
      email: ''
    });

    addToast({
      type: 'success',
      title: 'Candidate Enrolled in Pipeline',
      message: `${newCand.candidateName} added to ${newCand.position} screening round.`
    });
  };

  // Simulate Payroll Disbursement
  const handleDisbursePayroll = () => {
    setIsProcessingPayroll(true);
    setTimeout(() => {
      setIsProcessingPayroll(false);
      setPayrollStatus('Disbursed to Bank');
      logAuditEvent({
        actorRole: 'hr',
        actorName: userProfiles.hr?.name || 'Clara Vance',
        action: 'PAYROLL_DISBURSED',
        module: 'payroll',
        recordRef: 'payroll-2026-10',
        status: 'SUCCESS',
        reason: `Disbursed October 2026 payroll ($41,800 net) across ${totalEmployeesCount} active personnel.`
      });
      addToast({
        type: 'success',
        title: 'Payroll Remittance Completed',
        message: 'October 2026 salary vouchers verified and cleared with State Clearing House.'
      });
    }, 1200);
  };

  // Export CSV for HR Reports
  const handleExportHRCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Staff ID,Full Name,Personnel Type,Department,Designation,Phone,Email,Join Date,Status\n';

    teachers.forEach((t) => {
      csvContent += `"${t.id}","${t.name}","Teaching Faculty","Academics","Senior Educator","${t.phone}","${t.email}","${t.joinDate}","${t.status}"\n`;
    });
    staff.forEach((s) => {
      csvContent += `"${s.id}","${s.name}","Operations Staff","${s.department}","${s.role}","${s.phone}","${s.email}","${s.joinDate}","${s.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'schlar_hr_personnel_roster_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'HR Roster Exported',
      message: 'schlar_hr_personnel_roster_2026.csv downloaded successfully.'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Role Sidebar */}
      <RoleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* ================= PROFILE ================= */}
        {activeTab === 'profile' && <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />}

        {/* ================= 1. DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR & Personnel Workspace</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-theme-light text-theme-primary border border-theme-border">
                    Staff Management
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Faculty directory, staff employment rosters, daily attendance, leave approvals, and recruitment.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTeacherForm(true)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Faculty</span>
                </button>
                <button
                  onClick={() => setShowStaffForm(true)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Staff Member</span>
                </button>
              </div>
            </div>

            {/* KPI Cards (Data-derived) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Total Active Personnel</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  {totalEmployeesCount}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {teachers.length} Faculty · {staff.length} Operations
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Pending Leave Requests</span>
                <span className="text-2xl font-extrabold text-amber-700 font-mono mt-1 block">
                  {pendingLeavesCount}
                </span>
                <span className="text-[11px] text-amber-600 font-medium block mt-1">
                  Requires HR / Dean sign-off
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Staff Attendance Rate</span>
                <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 block">96.8%</span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-1">13 of 14 Present Today</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Departments Operating</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  {departments.length}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">Academic & Administrative</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                HR Core Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('directory')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <Users className="w-4 h-4 text-theme-primary" />
                  <span>Staff Directory</span>
                </button>
                <button
                  onClick={() => setActiveTab('leaves')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <Clock className="w-4 h-4 text-theme-primary" />
                  <span>Leave Moderation</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <CalendarCheck className="w-4 h-4 text-theme-primary" />
                  <span>Staff Roll Call</span>
                </button>
                <button
                  onClick={() => setActiveTab('recruitment')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-theme-primary" />
                  <span>Recruitment</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-theme-primary" />
                  <span>HR Analytics</span>
                </button>
              </div>
            </div>

            {/* Department Headcount Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Department Personnel Distribution</h3>
                  <button
                    onClick={() => setActiveTab('departments')}
                    className="text-xs font-semibold text-theme-primary hover:underline"
                  >
                    Manage Departments →
                  </button>
                </div>

                <div className="space-y-3">
                  {departments.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{d.name}</span>
                          <span className="text-[10px] font-mono font-bold text-theme-primary bg-theme-light px-1.5 py-0.2 rounded">
                            {d.code}
                          </span>
                        </div>
                        <span className="text-slate-500 text-[11px] block mt-0.5">Head: {d.headName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          {d.facultyCount + d.staffCount} Members
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {d.facultyCount} Faculty · {d.staffCount} Staff
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals & Activity Log */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Urgent HR Tasks</h3>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {pendingLeavesCount} Pending
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {leaveRequests
                    .filter((l) => l.status === 'Pending')
                    .map((req) => (
                      <div key={req.id} className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-slate-900">{req.staffName}</span>
                          <span className="text-[10px] font-mono text-amber-800 font-bold">
                            {req.totalDays} {req.totalDays === 1 ? 'Day' : 'Days'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          {req.leaveType} · {req.reason}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-400 font-mono">From: {req.startDate}</span>
                          <button
                            onClick={() => setActiveTab('leaves')}
                            className="text-theme-primary font-bold text-[11px] hover:underline"
                          >
                            Review Request →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. STAFF DIRECTORY ================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Staff Directory</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Searchable employee directory across Teaching Faculty and Operational Staff.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTeacherForm(true)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Faculty</span>
                </button>
                <button
                  onClick={() => setShowStaffForm(true)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Staff</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, role, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold">
                <button
                  onClick={() => setDirectoryType('all')}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    directoryType === 'all'
                      ? 'bg-theme-primary text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({totalEmployeesCount})
                </button>
                <button
                  onClick={() => setDirectoryType('faculty')}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    directoryType === 'faculty'
                      ? 'bg-theme-primary text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Teaching Faculty ({teachers.length})
                </button>
                <button
                  onClick={() => setDirectoryType('staff')}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    directoryType === 'staff'
                      ? 'bg-theme-primary text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Operations Staff ({staff.length})
                </button>
              </div>
            </div>

            {/* Faculty Section */}
            {(directoryType === 'all' || directoryType === 'faculty') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teaching Faculty</h3>
                  <span className="text-[11px] text-slate-400">{filteredTeachers.length} educators</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredTeachers.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTeacher(t)}
                      className="cursor-pointer p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-theme-primary hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-theme-primary text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                          {t.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="truncate flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">{t.name}</div>
                          <div className="text-[11px] text-theme-primary font-semibold truncate">
                            {t.subjects.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Assigned Classes:</span>
                          <span className="font-semibold">{t.classes.join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="font-mono">{t.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-emerald-700 font-bold">{t.status || 'Active'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Operations Staff Section */}
            {(directoryType === 'all' || directoryType === 'staff') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operations & Admin Staff</h3>
                  <span className="text-[11px] text-slate-400">{filteredStaff.length} employees</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredStaff.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStaff(s)}
                      className="cursor-pointer p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-theme-primary hover:shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                          {s.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="truncate flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">{s.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {s.role} · {s.department}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 text-slate-600 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Phone:</span>
                          <span className="font-mono">{s.phone}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Joined:</span>
                          <span>{s.joinDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-emerald-700 font-bold">{s.status || 'Active'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. STAFF PROFILES (CRUD & DETAILS) ================= */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Profiles & Records</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage individual employment contracts, professional records, and personal particulars.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStaffForm(true)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Staff Profile</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Employee Name</th>
                    <th className="py-3 px-4">Staff ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Employment</th>
                    <th className="py-3 px-4">Joining Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{s.id}</td>
                      <td className="py-3 px-4 text-slate-700">{s.department}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{s.role}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {s.employmentType || 'Full-time'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{s.joinDate}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStaff(s)}
                          className="text-theme-primary font-bold hover:underline"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 4. DEPARTMENTS & DESIGNATIONS ================= */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Departments & Organization Structure</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Academic faculties, administrative divisions, and designation hierarchy.
                </p>
              </div>

              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Department</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{d.name}</h3>
                        <span className="font-mono text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded">
                          {d.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Head: {d.headName}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg">
                      {d.facultyCount + d.staffCount} Staff
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Faculty: {d.facultyCount} · Operations: {d.staffCount}
                    </span>
                    <span className="text-emerald-700 font-bold">Operational</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. STAFF ATTENDANCE ================= */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Daily Attendance</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Employee check-in verification, biometric timesheet summaries, and presence rates.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
                <button
                  onClick={() => {
                    addToast({
                      type: 'success',
                      title: 'Attendance Sheet Verified',
                      message: `Staff presence confirmed for ${attendanceDate}.`
                    });
                  }}
                  className="px-3.5 py-2 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95"
                >
                  Save Register
                </button>
              </div>
            </div>

            {/* Attendance Status Counts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Present (✓)</span>
                <span className="text-xl font-bold font-mono text-emerald-800">12</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Late Arrival (⏱)</span>
                <span className="text-xl font-bold font-mono text-amber-800">1</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">On Approved Leave (📋)</span>
                <span className="text-xl font-bold font-mono text-blue-800">1</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance %</span>
                <span className="text-xl font-bold font-mono text-theme-primary">96.8%</span>
              </div>
            </div>

            {/* Roll Call List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Role / Department</th>
                    <th className="py-3 px-4">Check-in Status</th>
                    <th className="py-3 px-4 text-right">Toggle Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[...teachers, ...staff].map((emp) => {
                    const status = staffAttendanceStatus[emp.id] || 'Present';
                    return (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{emp.name}</td>
                        <td className="py-3 px-4 text-slate-500">
                          {'department' in emp ? emp.department : 'Teaching Faculty'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              status === 'Present'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : status === 'Late'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : status === 'On Leave'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {(['Present', 'Late', 'On Leave', 'Absent'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() =>
                                  setStaffAttendanceStatus({
                                    ...staffAttendanceStatus,
                                    [emp.id]: st
                                  })
                                }
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                                  status === st
                                    ? 'bg-theme-primary text-white shadow-2xs font-bold'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Privacy Safeguard Banner */}
            <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-theme-primary shrink-0" />
              <span>
                Read-only student protection: HR workspace operates on faculty & administrative personnel registers only.
                Student classroom roll call is reserved exclusively for classroom teachers.
              </span>
            </div>
          </div>
        )}

        {/* ================= 6. LEAVE MANAGEMENT ================= */}
        {activeTab === 'leaves' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Leave Moderation</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Faculty and employee absence authorizations, casual leave allocations, and medical leaves.
                </p>
              </div>

              <button
                onClick={() => setShowApplyLeaveModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Leave Request</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Submitted Leave Applications</h3>
                <span className="text-xs text-slate-500">{leaveRequests.length} Total Requests</span>
              </div>

              <div className="divide-y divide-slate-100">
                {leaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{req.staffName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {req.leaveType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({req.department})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {req.startDate} to {req.endDate} ({req.totalDays} Days) · Reason: {req.reason}
                      </p>
                      {req.reviewNote && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">Note: "{req.reviewNote}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleApproveLeave(req.id, req.staffName)}
                            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectingLeaveId(req.id)}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. WORK ASSIGNMENTS ================= */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Work Assignments & Responsibilities</h1>
              <p className="text-xs text-slate-500 mt-1">
                Faculty teaching period allotments, academic committee appointments, and operational facility duties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{t.name}</h3>
                      <p className="text-xs text-theme-primary font-semibold">{t.subjects.join(', ')}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      Room: {t.room}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Assigned Divisions:</span>
                      <span className="font-semibold text-slate-900">{t.classes.join(', ')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span>Homeroom Mentorship:</span>
                      <span className="font-semibold text-slate-900">{t.classTeacherOf || 'Subject Specialist'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Weekly Teaching Load:</span>
                      <span className="font-mono font-bold text-emerald-800">22 Periods / Week</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. EMPLOYMENT DOCUMENTS ================= */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employment Documents & Compliance</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Verified appointment letters, degree credentials, background verifications, and licenses.
                </p>
              </div>

              <button
                onClick={() => setShowAddDocModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Document Record</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Issue Date</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{doc.title}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{doc.employeeName}</td>
                      <td className="py-3 px-4 text-slate-600">{doc.category}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{doc.issueDate}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedDocPreview(doc)}
                          className="px-2.5 py-1 text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1 ml-auto"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 9. RECRUITMENT PIPELINE ================= */}
        {activeTab === 'recruitment' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Talent Acquisition & Recruitment</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Faculty openings, applicant screening, interview rounds, and candidate status tracking.
                </p>
              </div>

              <button
                onClick={() => setShowAddCandidateModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Candidate</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Applied Position</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Applied Date</th>
                    <th className="py-3 px-4">Recruitment Stage</th>
                    <th className="py-3 px-4">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{cand.candidateName}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{cand.position}</td>
                      <td className="py-3 px-4 font-mono">{cand.experienceYears} Years</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{cand.appliedDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cand.stage === 'Offer Extended'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : cand.stage === 'Interview Scheduled'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {cand.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{cand.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 10. PAYROLL OVERVIEW & PRIVACY ================= */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Monthly Payroll Overview</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Aggregated salary bills, statutory deduction summaries, and electronic clearing batches.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  Batch Status: {payrollStatus}
                </span>
                {payrollStatus !== 'Disbursed to Bank' && (
                  <button
                    disabled={isProcessingPayroll}
                    onClick={handleDisbursePayroll}
                    className="px-4 py-2 bg-theme-primary text-white text-xs font-bold rounded-xl shadow-xs hover:opacity-95 disabled:opacity-50"
                  >
                    {isProcessingPayroll ? 'Processing...' : 'Disburse October Payroll'}
                  </button>
                )}
              </div>
            </div>

            {/* Aggregated Figures */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Gross Salary Bill</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">$48,200.00</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">14 Full-time Employees</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Statutory Deductions & PF</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">$6,400.00</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Tax withholdings & PF</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Net Payroll Outflow</span>
                <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 block">$41,800.00</span>
                <span className="text-[11px] text-emerald-600 mt-0.5 block">Clearing House batch</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Disbursed Staff</span>
                <span className="text-2xl font-extrabold text-theme-primary font-mono mt-1 block">
                  {totalEmployeesCount} / {totalEmployeesCount}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">100% staff covered</span>
              </div>
            </div>

            {/* Salary Bands by Designation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Approved Faculty & Staff Salary Bands (AY 2026-27)</h3>
              <div className="space-y-2 text-xs">
                {[
                  { band: 'Senior Teaching Faculty (PGT)', range: '$4,500 – $5,500 / month', incumbents: 4 },
                  { band: 'Secondary Trained Faculty (TGT)', range: '$3,800 – $4,600 / month', incumbents: 4 },
                  { band: 'Bursar & Accounts Officers', range: '$3,400 – $4,200 / month', incumbents: 2 },
                  { band: 'Library & Information Officers', range: '$3,000 – $3,600 / month', incumbents: 1 },
                  { band: 'Transport & Security Supervisors', range: '$2,200 – $2,800 / month', incumbents: 3 }
                ].map((b, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{b.band}</span>
                      <span className="text-[11px] text-slate-500">{b.incumbents} Personnel on roster</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800">{b.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Safeguard Disclaimer */}
            <div className="p-4 bg-slate-100/70 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Lock className="w-4 h-4 text-theme-primary" />
                <span>Salary Privacy & Compliance Guard</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Individual salary credit amounts, employee bank account numbers, and personal tax identification pins are
                strictly protected under institutional privacy policies. No individual banking credentials are exposed in
                public rosters.
              </p>
            </div>
          </div>
        )}

        {/* ================= 11. HR REPORTS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HR Analytics & Compliance Reports</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Staff distribution, teaching workload balance, attendance rates, and CSV export.
                </p>
              </div>

              <button
                onClick={handleExportHRCSV}
                className="px-3.5 py-2 bg-theme-primary text-white hover:opacity-95 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Personnel CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Employment Type Distribution</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Full-time Permanent Faculty</span>
                    <span className="font-mono font-bold text-slate-900">8 (100% of Teachers)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Full-time Operations Staff</span>
                    <span className="font-mono font-bold text-slate-900">5 Employees</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Contract / Specialized Services</span>
                    <span className="font-mono font-bold text-slate-900">1 Employee</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Attendance & Leave Metric Summary</h3>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual Staff Attendance Rate:</span>
                    <span className="font-mono font-bold text-emerald-800">96.8% Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Leaves Filed This Term:</span>
                    <span className="font-mono font-bold text-slate-900">{leaveRequests.length} Leaves</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Active Leave Applications:</span>
                    <span className="font-mono font-bold text-amber-700">{pendingLeavesCount} Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: APPLY LEAVE ON BEHALF ================= */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">File Staff Leave Application</h3>
              <button onClick={() => setShowApplyLeaveModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Staff Member</label>
                <select
                  required
                  value={leaveForm.staffId}
                  onChange={(e) => setLeaveForm({ ...leaveForm, staffId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">-- Choose Employee --</option>
                  {[...teachers, ...staff].map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({'role' in e ? e.role : 'Teacher'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Leave Category</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick / Medical Leave">Sick / Medical Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Academic / Duty Leave">Academic / Duty Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason for Absence</label>
                <textarea
                  rows={2}
                  required
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-95 shadow-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DECLINE LEAVE REASON ================= */}
      {rejectingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Decline Leave Application</h3>
              <button onClick={() => setRejectingLeaveId(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please specify the operational or institutional reason for declining this request.
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">Mandatory Rejection Note</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Mandatory faculty presence required during board exam moderation..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={!rejectionReason.trim()}
                onClick={handleDeclineLeaveConfirm}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Decline
              </button>
              <button
                type="button"
                onClick={() => setRejectingLeaveId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: DOCUMENT PREVIEW ================= */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-theme-primary uppercase tracking-wider block font-mono">
                  Verified Employment File
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{selectedDocPreview.title}</h3>
              </div>
              <button onClick={() => setSelectedDocPreview(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee:</span>
                <span className="font-bold text-slate-900">{selectedDocPreview.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{selectedDocPreview.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verified Date:</span>
                <span className="font-mono text-slate-700">{selectedDocPreview.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compliance Status:</span>
                <span className="text-emerald-700 font-bold">{selectedDocPreview.status}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Document Saved',
                    message: `${selectedDocPreview.title} downloaded.`
                  });
                  setSelectedDocPreview(null);
                }}
                className="flex-1 py-2 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF File</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CANDIDATE ================= */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Register Candidate Application</h3>
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={candidateForm.candidateName}
                  onChange={(e) => setCandidateForm({ ...candidateForm, candidateName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Position</label>
                <input
                  type="text"
                  required
                  value={candidateForm.position}
                  onChange={(e) => setCandidateForm({ ...candidateForm, position: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Relevant Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={candidateForm.experienceYears}
                    onChange={(e) => setCandidateForm({ ...candidateForm, experienceYears: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={candidateForm.phone}
                    onChange={(e) => setCandidateForm({ ...candidateForm, phone: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-95 shadow-xs"
                >
                  Add Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile & Form Modals */}
      <TeacherProfileModal
        isOpen={!!selectedTeacher}
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
      <StaffProfileModal
        isOpen={!!selectedStaff}
        staff={selectedStaff}
        onClose={() => setSelectedStaff(null)}
      />
      {showTeacherForm && (
        <TeacherFormModal isOpen={showTeacherForm} onClose={() => setShowTeacherForm(false)} />
      )}
      {showStaffForm && (
        <StaffFormModal isOpen={showStaffForm} onClose={() => setShowStaffForm(false)} />
      )}
    </div>
  );
};
