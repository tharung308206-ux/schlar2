import React from 'react';
import { useApp } from '../../context/AppContext';
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
  User,
  MessageSquare,
  HelpCircle,
  Repeat,
  AlertCircle,
  History,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Bus,
  ShieldAlert,
  Wrench,
  MapPin,
  Bookmark,
  AlertTriangle,
  PhoneCall,
  ClipboardCheck,
  ShieldCheck
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface RoleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onQuickAction?: () => void;
}

export const RoleSidebar: React.FC<RoleSidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  onQuickAction
}) => {
  const {
    currentRole,
    userProfiles,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    setQuickSearchOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    switchRoleAndNavigate
  } = useApp();

  const isDrawerOpen = isOpenMobile ?? isMobileSidebarOpen;
  const closeDrawer = onCloseMobile || (() => setIsMobileSidebarOpen(false));
  const [mobileRoleMenuOpen, setMobileRoleMenuOpen] = React.useState(false);

  const profile = userProfiles[currentRole] || userProfiles.principal;

  // Build role-specific sidebar sections matching prompt requirements
  const getSections = (): SidebarSection[] => {
    switch (currentRole) {
      case 'principal':
        return [
          {
            items: [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'STUDENT MANAGEMENT',
            items: [
              { id: 'students', label: 'Students', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'teachers', label: 'Teachers', icon: <Users className="w-4 h-4" /> },
              { id: 'staff', label: 'Staff', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'classes', label: 'Classes', icon: <Layers className="w-4 h-4" /> }
            ]
          },
          {
            title: 'ACADEMICS',
            items: [
              { id: 'academics', label: 'Academics', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
              { id: 'timetable', label: 'Timetable', icon: <Clock className="w-4 h-4" /> },
              { id: 'exams', label: 'Exams', icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> }
            ]
          },
          {
            title: 'COMMUNICATION',
            items: [
              { id: 'notices', label: 'Notices', icon: <Bell className="w-4 h-4" /> },
              { id: 'events', label: 'Calendar & Events', icon: <Calendar className="w-4 h-4" /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> }
            ]
          },
          {
            title: 'FINANCE & AUDIT',
            items: [
              { id: 'finance', label: 'Finance', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'audit', label: 'Audit Trail', icon: <History className="w-4 h-4" /> }
            ]
          }
        ];

      case 'vice_principal':
        return [
          {
            items: [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'ACADEMIC MANAGEMENT',
            items: [
              { id: 'classes', label: 'Classes', icon: <Layers className="w-4 h-4" /> },
              { id: 'teachers', label: 'Teachers', icon: <Users className="w-4 h-4" /> },
              { id: 'subjects', label: 'Subjects', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
              { id: 'exams', label: 'Exams', icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: 'marks', label: 'Marks', icon: <Award className="w-4 h-4" /> },
              { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> },
              { id: 'timetable', label: 'Timetable', icon: <Clock className="w-4 h-4" /> }
            ]
          },
          {
            title: 'REPORTING',
            items: [
              { id: 'reports', label: 'Academic Reports', icon: <BarChart3 className="w-4 h-4" /> }
            ]
          },
          {
            title: 'COMMUNICATION',
            items: [
              { id: 'notices', label: 'Notices', icon: <Bell className="w-4 h-4" /> },
              { id: 'events', label: 'Calendar & Events', icon: <Calendar className="w-4 h-4" /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> }
            ]
          }
        ];

      case 'teacher':
        return [
          {
            items: [{ id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'TEACHING & ACADEMICS',
            items: [
              { id: 'classes', label: 'My Classes', icon: <Layers className="w-4 h-4" /> },
              { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
              { id: 'timetable', label: 'Timetable', icon: <Clock className="w-4 h-4" /> },
              { id: 'assignments', label: 'Assignments', icon: <FileText className="w-4 h-4" /> },
              { id: 'exams', label: 'Examinations', icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: 'marks', label: 'Marks & Results', icon: <Award className="w-4 h-4" /> },
              { id: 'students', label: 'Student Progress', icon: <GraduationCap className="w-4 h-4" /> }
            ]
          },
          {
            title: 'COMMUNICATION',
            items: [
              { id: 'notices', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> }
            ]
          }
        ];

      case 'accountant':
        return [
          {
            items: [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'STUDENT FEES & BILLING',
            items: [
              { id: 'structure', label: 'Fee Structure', icon: <Layers className="w-4 h-4" /> },
              { id: 'fees', label: 'Student Accounts', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'collection', label: 'Fee Collection', icon: <CheckCircle2 className="w-4 h-4" /> },
              { id: 'dues', label: 'Outstanding Dues', icon: <Clock className="w-4 h-4" /> }
            ]
          },
          {
            title: 'TRANSACTIONS & LEDGERS',
            items: [
              { id: 'history', label: 'Payment History', icon: <History className="w-4 h-4" /> },
              { id: 'receipts', label: 'Official Receipts', icon: <FileText className="w-4 h-4" /> },
              { id: 'concessions', label: 'Concessions & Aid', icon: <Award className="w-4 h-4" /> },
              { id: 'refunds', label: 'Refunds & Adjustments', icon: <Repeat className="w-4 h-4" /> }
            ]
          },
          {
            title: 'EXPENSES & REPORTING',
            items: [
              { id: 'expenses', label: 'Operating Expenses', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'reports', label: 'Finance Reports', icon: <BarChart3 className="w-4 h-4" /> }
            ]
          }
        ];

      case 'receptionist':
        return [
          {
            items: [{ id: 'dashboard', label: 'Front Office Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'VISITORS & APPOINTMENTS',
            items: [
              { id: 'visitors', label: 'Visitor Register', icon: <Users className="w-4 h-4" /> },
              { id: 'checkin', label: 'Check-In / Out', icon: <Clock className="w-4 h-4" /> },
              { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> }
            ]
          },
          {
            title: 'ENQUIRIES & DIRECTORIES',
            items: [
              { id: 'enquiries', label: 'General Enquiries', icon: <HelpCircle className="w-4 h-4" /> },
              { id: 'admissions_enquiry', label: 'Admissions Pipeline', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'student_directory', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
              { id: 'staff_directory', label: 'Staff Directory', icon: <Briefcase className="w-4 h-4" /> },
              { id: 'school_directory', label: 'School Extensions', icon: <PhoneCall className="w-4 h-4" /> }
            ]
          },
          {
            title: 'LOGS & REPORTS',
            items: [
              { id: 'communication_log', label: 'Communication Log', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'notices', label: 'Notices & Circulars', icon: <Bell className="w-4 h-4" /> },
              { id: 'reports', label: 'Front Office Reports', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'profile', label: 'Receptionist Profile', icon: <User className="w-4 h-4" /> }
            ]
          }
        ];

      case 'librarian':
        return [
          {
            items: [{ id: 'dashboard', label: 'Library Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'CATALOGUE & INVENTORY',
            items: [
              { id: 'catalogue', label: 'Book Catalogue', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'categories', label: 'Book Categories', icon: <Layers className="w-4 h-4" /> },
              { id: 'copies_inventory', label: 'Copies & Barcodes', icon: <FileText className="w-4 h-4" /> }
            ]
          },
          {
            title: 'CIRCULATION DESK',
            items: [
              { id: 'issue_book', label: 'Issue Book', icon: <Repeat className="w-4 h-4" /> },
              { id: 'return_book', label: 'Return Book', icon: <CheckCircle2 className="w-4 h-4" /> },
              { id: 'active_loans', label: 'Active Loans', icon: <Clock className="w-4 h-4" /> },
              { id: 'overdue_books', label: 'Overdue Tracking', icon: <AlertCircle className="w-4 h-4" /> },
              { id: 'reservations', label: 'Book Reservations', icon: <Bookmark className="w-4 h-4" /> },
              { id: 'lost_damaged', label: 'Lost / Damaged', icon: <AlertTriangle className="w-4 h-4" /> }
            ]
          },
          {
            title: 'MEMBERS & REPORTS',
            items: [
              { id: 'members', label: 'Library Members', icon: <Users className="w-4 h-4" /> },
              { id: 'transactions', label: 'Circulation History', icon: <History className="w-4 h-4" /> },
              { id: 'reports', label: 'Library Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'profile', label: 'Librarian Profile', icon: <User className="w-4 h-4" /> }
            ]
          }
        ];

      case 'parent':
        return [
          {
            items: [{ id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'STUDENT PROGRESS',
            items: [
              { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
              { id: 'report_cards', label: 'Report Cards', icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: 'fees', label: 'Fees & Invoices', icon: <DollarSign className="w-4 h-4" /> }
            ]
          }
        ];

      case 'hr':
        return [
          {
            items: [{ id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'STAFF & ROSTERS',
            items: [
              { id: 'directory', label: 'Staff Directory', icon: <Users className="w-4 h-4" /> },
              { id: 'profiles', label: 'Staff Profiles', icon: <User className="w-4 h-4" /> },
              { id: 'departments', label: 'Departments & Roles', icon: <Layers className="w-4 h-4" /> }
            ]
          },
          {
            title: 'ATTENDANCE & TIME',
            items: [
              { id: 'attendance', label: 'Staff Attendance', icon: <CalendarCheck className="w-4 h-4" /> },
              { id: 'leaves', label: 'Leave Requests', icon: <Clock className="w-4 h-4" /> },
              { id: 'assignments', label: 'Work Assignments', icon: <Briefcase className="w-4 h-4" /> }
            ]
          },
          {
            title: 'COMPLIANCE & PAYROLL',
            items: [
              { id: 'documents', label: 'Employment Documents', icon: <FileText className="w-4 h-4" /> },
              { id: 'recruitment', label: 'Recruitment Pipeline', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'payroll', label: 'Payroll Overview', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'reports', label: 'HR Analytics Reports', icon: <BarChart3 className="w-4 h-4" /> }
            ]
          }
        ];

      case 'transport':
        return [
          {
            items: [{ id: 'dashboard', label: 'Transport Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> }]
          },
          {
            title: 'FLEET & CREW',
            items: [
              { id: 'vehicles', label: 'Vehicle Fleet', icon: <Bus className="w-4 h-4" /> },
              { id: 'drivers', label: 'Drivers & Operators', icon: <Users className="w-4 h-4" /> },
              { id: 'transport_staff', label: 'Support Attendants', icon: <Briefcase className="w-4 h-4" /> }
            ]
          },
          {
            title: 'ROUTES & STOPS',
            items: [
              { id: 'routes', label: 'Bus Routes', icon: <Clock className="w-4 h-4" /> },
              { id: 'stops', label: 'Stops & Schedules', icon: <MapPin className="w-4 h-4" /> },
              { id: 'student_assignments', label: 'Student Assignments', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'rosters', label: 'Route Rosters', icon: <FileSpreadsheet className="w-4 h-4" /> }
            ]
          },
          {
            title: 'OPERATIONS & SAFETY',
            items: [
              { id: 'maintenance', label: 'Fleet Maintenance', icon: <Wrench className="w-4 h-4" /> },
              { id: 'incidents', label: 'Safety Incidents', icon: <ShieldAlert className="w-4 h-4" /> },
              { id: 'announcements', label: 'Announcements', icon: <Bell className="w-4 h-4" /> },
              { id: 'reports', label: 'Transport Reports', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'profile', label: 'Manager Profile', icon: <User className="w-4 h-4" /> }
            ]
          }
        ];

      case 'exam_coordinator':
        return [
          {
            items: [
              { id: 'dashboard', label: 'Exam Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'calendar', label: 'Master Exam Calendar', icon: <Calendar className="w-4 h-4" /> }
            ]
          },
          {
            title: 'EXAM PLANNING & SETUP',
            items: [
              { id: 'setup', label: 'Exam Definitions', icon: <Layers className="w-4 h-4" /> },
              { id: 'sessions', label: 'Types & Sessions', icon: <Bookmark className="w-4 h-4" /> },
              { id: 'timetable', label: 'Timetable Matrix', icon: <Clock className="w-4 h-4" /> },
              { id: 'subject_mapping', label: 'Assessment Structure', icon: <FileSpreadsheet className="w-4 h-4" /> },
              { id: 'room_allocation', label: 'Room & Hall Allocation', icon: <MapPin className="w-4 h-4" /> }
            ]
          },
          {
            title: 'AUDIT & CONFLICT CONTROL',
            items: [
              { id: 'conflict_detection', label: 'Conflict Matrix', icon: <AlertTriangle className="w-4 h-4" /> },
              { id: 'readiness_audit', label: 'Readiness Audit', icon: <ClipboardCheck className="w-4 h-4" /> }
            ]
          },
          {
            title: 'MARKS, MODERATION & RESULTS',
            items: [
              { id: 'marks_entry_status', label: 'Marks Entry Tracking', icon: <FileText className="w-4 h-4" /> },
              { id: 'moderation', label: 'Results Moderation', icon: <CheckCircle2 className="w-4 h-4" /> },
              { id: 'publication', label: 'Guarded Publication', icon: <ShieldCheck className="w-4 h-4" /> },
              { id: 'report_cards', label: 'Report Cards & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'profile', label: 'Coordinator Profile', icon: <User className="w-4 h-4" /> }
            ]
          }
        ];

      default:
        return [];
    }
  };

  const sections = getSections();
  const hasSettings = ['principal', 'vice_principal', 'accountant', 'librarian', 'exam_coordinator', 'receptionist'].includes(currentRole);

  const getQuickActionLabel = () => {
    switch (currentRole) {
      case 'principal': return 'New Student';
      case 'vice_principal': return 'New Exam/Roster';
      case 'teacher': return 'New Assignment';
      case 'accountant': return 'Record Payment';
      case 'hr': return 'Add Staff Member';
      case 'receptionist': return 'Add Visitor';
      case 'librarian': return 'Issue Book';
      case 'transport': return 'Assign Student';
      case 'exam_coordinator': return 'Schedule Exam';
      default: return 'Quick Action';
    }
  };

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    closeDrawer();
  };

  const roleLabelsShort: Record<string, string> = {
    principal: '1. Admin / Principal',
    vice_principal: '2. Vice Principal',
    teacher: '3. Teacher (Web)',
    teacher_mobile: '3. Teacher (Mobile)',
    parent_mobile: '4. Parent (Mobile)',
    accountant: '5. Accountant',
    hr: '6. HR / Staff',
    librarian: '7. Librarian',
    transport: '8. Transport',
    receptionist: '9. Receptionist',
    exam_coordinator: '10. Exam Coordinator'
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-screen lg:h-[calc(100vh-4rem)] bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isDrawerOpen
            ? 'translate-x-0 w-[270px] shadow-2xl'
            : `-translate-x-full lg:translate-x-0 ${isSidebarCollapsed ? 'lg:w-[70px]' : 'lg:w-[260px]'}`
        }`}
      >
        {/* Top Header / Brand / Collapse Toggle */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-theme-primary text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
              SC
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 transition-opacity duration-200">
                <span className="text-xs font-bold text-slate-900 block leading-tight">SCHLAR</span>
                <span className="text-[10px] text-slate-400 block truncate">Greenfield Int.</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 items-center justify-center transition-colors"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={closeDrawer}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close navigation drawer"
          >
            ✕
          </button>
        </div>

        {/* Mobile-Only Role Quick-Switch Bar */}
        <div className="lg:hidden px-2 pt-2 pb-1 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
            <button
              onClick={() => setMobileRoleMenuOpen(!mobileRoleMenuOpen)}
              className="text-[11px] font-bold text-theme-primary hover:underline flex items-center gap-1"
            >
              <span>{roleLabelsShort[currentRole] || currentRole}</span>
              <span className="text-[9px]">▼</span>
            </button>
          </div>

          {mobileRoleMenuOpen && (
            <div className="mt-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto space-y-0.5">
              {Object.entries(roleLabelsShort).map(([rKey, rLabel]) => (
                <button
                  key={rKey}
                  onClick={() => {
                    switchRoleAndNavigate(rKey as any);
                    setMobileRoleMenuOpen(false);
                    closeDrawer();
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between ${
                    currentRole === rKey ? 'bg-theme-primary text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{rLabel}</span>
                  {currentRole === rKey && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Search Area */}
        <div className="p-2 space-y-1.5 border-b border-slate-100">
          {/* Working Quick Action Button */}
          <button
            onClick={onQuickAction}
            className={`w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all group relative`}
            title={getQuickActionLabel()}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">{getQuickActionLabel()}</span>}
            {isSidebarCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {getQuickActionLabel()}
              </span>
            )}
          </button>

          {/* Working Search Button */}
          <button
            onClick={() => setQuickSearchOpen(true)}
            className={`w-full flex items-center justify-center lg:justify-start gap-2.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs transition-colors group relative`}
            title="Search modules & records"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px]">Search...</span>
                <kbd className="text-[9px] bg-slate-100 border border-slate-200 px-1 py-0.2 rounded font-mono text-slate-400">Ctrl+K</kbd>
              </div>
            )}
            {isSidebarCollapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-md shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                Search
              </span>
            )}
          </button>
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-0.5">
              {section.title && !isSidebarCollapsed && (
                <div className="px-2.5 pt-2 pb-1 text-[9px] font-bold text-slate-400 tracking-wider uppercase">
                  {section.title}
                </div>
              )}
              {isSidebarCollapsed && section.title && (
                <div className="w-4 h-0.5 bg-slate-200 mx-auto my-2 rounded-full" />
              )}
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all group relative ${
                      isActive
                        ? 'bg-theme-primary text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}

                    {/* Tooltip on hover when collapsed */}
                    {isSidebarCollapsed && (
                      <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Section: Settings + Profile + User Card */}
        <div className="p-2 border-t border-slate-200/80 bg-slate-50/50 space-y-1 shrink-0">
          {hasSettings && (
            <button
              onClick={() => handleItemClick('settings')}
              className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all group relative ${
                activeTab === 'settings'
                  ? 'bg-theme-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-white' : 'text-slate-400'}`} />
              {!isSidebarCollapsed && <span>Settings</span>}
              {isSidebarCollapsed && (
                <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  Settings & Theme
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => handleItemClick('profile')}
            className={`w-full flex items-center gap-3 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all group relative ${
              activeTab === 'profile'
                ? 'bg-theme-primary text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-slate-400'}`} />
            {!isSidebarCollapsed && <span>Profile</span>}
            {isSidebarCollapsed && (
              <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                My Profile
              </span>
            )}
          </button>

          {/* User Profile Mini Badge at bottom */}
          <div
            onClick={() => handleItemClick('profile')}
            className="pt-2 border-t border-slate-200/60 mt-1 flex items-center gap-2 p-1 rounded-xl cursor-pointer hover:bg-white transition-colors group relative"
          >
            <div className="w-8 h-8 rounded-lg bg-theme-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              {profile.avatarText}
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-slate-900 truncate leading-tight">
                  {profile.fullName}
                </span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                  {profile.title.split('/')[0]}
                </span>
              </div>
            )}
            {isSidebarCollapsed && (
              <span className="absolute left-full ml-2.5 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {profile.fullName} ({profile.title.split('/')[0]})
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// Simple Award icon helper
function Award(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="6" strokeWidth="2" />
      <path strokeWidth="2" d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
