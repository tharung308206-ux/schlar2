import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Notice, Assignment, PaymentReceipt } from '../../../types';
import {
  Home,
  BookOpen,
  CalendarCheck,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Award,
  DollarSign,
  MessageSquare,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  CreditCard,
  User,
  FileText,
  Download,
  Printer,
  Bell,
  Search,
  Filter,
  ArrowLeft,
  Check,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  Sliders,
  ExternalLink,
  Bus,
  Plus,
  Trash2,
  CalendarDays,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { ReportCardModal } from '../../examination/ReportCardModal';

// Type definitions for Parent Mobile specific workflows
interface ParentLeaveRequest {
  id: string;
  childId: 'aarav' | 'ananya';
  childName: string;
  category: 'Medical / Sick Leave' | 'Family Event / Urgent Travel' | 'Religious Observance' | 'Other Personal';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  emergencyPhone: string;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: string;
  reviewNote?: string;
}

interface SimulatedCertificate {
  id: string;
  title: string;
  code: string;
  issueDate: string;
  category: 'Academic' | 'Enrollment' | 'Financial' | 'Health';
  description: string;
}

export const ParentMobile: React.FC = () => {
  const {
    childrenData,
    selectedChild,
    setSelectedChild,
    notices,
    messages,
    sendMessage,
    assignments,
    timetableEntries,
    students,
    attendance,
    userProfiles,
    updateUserProfile,
    addToast,
    exams,
    marks,
    classes,
    fees,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveReceipt,
    setIsThemeModalOpen
  } = useApp();

  // Navigation state: 5 primary destinations (Prompt 5 requirement)
  const [activeTab, setActiveTab] = useState<'home' | 'attendance' | 'academics' | 'fees' | 'more'>('home');

  // Secondary / Sub-screen routing (from More screen or Quick Actions)
  const [subScreen, setSubScreen] = useState<
    | null
    | 'timetable'
    | 'exams'
    | 'leave_requests'
    | 'announcements'
    | 'events'
    | 'transport'
    | 'library'
    | 'messages'
    | 'documents'
    | 'profile'
    | 'help'
    | 'homework_detail'
  >(null);

  // Academics tab view mode: Homework vs Curriculum
  const [academicsMode, setAcademicsMode] = useState<'homework' | 'curriculum'>('homework');

  // Timetable view mode: Daily vs Weekly
  const [timetableViewMode, setTimetableViewMode] = useState<'daily' | 'weekly'>('daily');

  // Screen-specific states
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [homeworkFilter, setHomeworkFilter] = useState<'all' | 'due_soon' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [completedHomeworkIds, setCompletedHomeworkIds] = useState<string[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [announcementCategory, setAnnouncementCategory] = useState<string>('all');
  const [readNoticeIds, setReadNoticeIds] = useState<string[]>([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showReportCardModal, setShowReportCardModal] = useState<boolean>(false);
  const [timetableDay, setTimetableDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [attendanceMonth, setAttendanceMonth] = useState<number>(9); // 0-indexed: 9 = October 2026
  const [selectedAttendanceDay, setSelectedAttendanceDay] = useState<number | null>(20);
  const [chatInput, setChatInput] = useState('');

  // Payment Simulation Modal State
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [simulatedReceipts, setSimulatedReceipts] = useState<PaymentReceipt[]>([]);
  const [paidOverrideBalance, setPaidOverrideBalance] = useState<Record<string, number>>({});

  // Leave Requests state
  const [leaveRequests, setLeaveRequests] = useState<ParentLeaveRequest[]>([
    {
      id: 'leave-001',
      childId: 'aarav',
      childName: 'Aarav Sharma',
      category: 'Medical / Sick Leave',
      startDate: '2026-10-08',
      endDate: '2026-10-08',
      totalDays: 1,
      reason: 'Viral fever and pediatric physician rest recommendation. Medical prescription submitted.',
      emergencyPhone: '+91 98112 88410',
      appliedDate: '2026-10-07',
      status: 'Approved',
      reviewedBy: 'Dr. Vikram Sharma',
      reviewNote: 'Excused medical absence noted.'
    },
    {
      id: 'leave-002',
      childId: 'ananya',
      childName: 'Ananya Sharma',
      category: 'Family Event / Urgent Travel',
      startDate: '2026-11-12',
      endDate: '2026-11-13',
      totalDays: 2,
      reason: 'Attending family wedding in Jaipur. Worksheets collected in advance from Mrs. Priya Nair.',
      emergencyPhone: '+91 98112 88410',
      appliedDate: '2026-10-18',
      status: 'Pending'
    }
  ]);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState<boolean>(false);
  const [leaveForm, setLeaveForm] = useState({
    category: 'Medical / Sick Leave' as ParentLeaveRequest['category'],
    startDate: '2026-10-26',
    endDate: '2026-10-27',
    reason: '',
    emergencyPhone: '+91 98112 88410'
  });
  const [leaveFormError, setLeaveFormError] = useState<string>('');

  // Document Certificate Preview Modal State
  const [selectedCertificate, setSelectedCertificate] = useState<SimulatedCertificate | null>(null);

  // Parent Profile Edit State
  const parentProfile = userProfiles.parent_mobile || userProfiles.principal;
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileForm, setProfileForm] = useState({
    fullName: parentProfile.fullName || 'Ramesh Sharma',
    email: parentProfile.email || 'ramesh.sharma@family.net',
    phone: parentProfile.phone || '+91 98112 88410',
    address: '42 Orchid Gardens, Greenfield Boulevard, New Delhi',
    emergencyPhone: '+91 98112 88411',
    notificationsSms: parentProfile.preferences?.notificationsSms ?? true,
    notificationsEmail: parentProfile.preferences?.notificationsEmail ?? true
  });
  const [profileErrors, setProfileErrors] = useState<{ email?: string; phone?: string }>({});

  // Active child context (Aarav or Ananya)
  const currentChild = childrenData[selectedChild] || childrenData.aarav;
  const childClassId = selectedChild === 'aarav' ? 'class-8a' : 'class-5b';
  const childClass = classes.find((c) => c.id === childClassId) || classes[0];
  const matchedStudent =
    students.find(
      (s) => s.id === currentChild.studentId || s.name.toLowerCase() === currentChild.name.toLowerCase()
    ) ||
    students.find((s) => s.classId === childClassId) ||
    students[0];

  // Scoped assignments for child's class
  const childAssignments = useMemo(() => {
    return assignments.filter((a) => a.classId === childClassId);
  }, [assignments, childClassId]);

  // Filtered homework list
  const filteredHomework = useMemo(() => {
    return childAssignments.filter((asg) => {
      const isCompleted = completedHomeworkIds.includes(asg.id);
      if (homeworkFilter === 'completed') return isCompleted;
      if (homeworkFilter === 'all') return true;

      // Calculate relative urgency
      const due = new Date(asg.dueDate);
      const now = new Date('2026-10-21');
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (homeworkFilter === 'due_soon') return diffDays >= 0 && diffDays <= 3 && !isCompleted;
      if (homeworkFilter === 'upcoming') return diffDays > 3 && !isCompleted;
      if (homeworkFilter === 'overdue') return diffDays < 0 && !isCompleted;
      return true;
    });
  }, [childAssignments, homeworkFilter, completedHomeworkIds]);

  // Timetable entries for active child's class
  const childTimetableSlots = useMemo(() => {
    return timetableEntries
      .filter((e) => e.classId === childClassId && e.dayOfWeek === timetableDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [timetableEntries, childClassId, timetableDay]);

  // Exam sessions for child's class
  const childExamSessions = useMemo(() => {
    return exams.flatMap((ex) => (ex.sessions || []).filter((s) => s.classId === childClassId));
  }, [exams, childClassId]);

  // Fee calculation for child
  const childFeeRecord = useMemo(() => {
    const base = fees.find(
      (f) =>
        f.studentId === matchedStudent.id ||
        f.studentName.toLowerCase().includes(currentChild.name.toLowerCase().split(' ')[0])
    ) || {
      id: `fee-${currentChild.studentId}`,
      studentId: currentChild.studentId,
      studentName: currentChild.name,
      classId: childClassId,
      className: `${currentChild.grade} - Section ${currentChild.section}`,
      totalFee: currentChild.fees.total,
      paid: currentChild.fees.paid,
      pending: currentChild.fees.pending,
      dueDate: currentChild.fees.dueDate,
      status: currentChild.fees.status as any
    };

    // Apply simulated payment override if paid in session
    const override = paidOverrideBalance[selectedChild];
    if (override !== undefined) {
      return {
        ...base,
        paid: base.totalFee,
        pending: 0,
        status: 'Paid' as const
      };
    }
    return base;
  }, [fees, matchedStudent, currentChild, childClassId, paidOverrideBalance, selectedChild]);

  // Filtered Leave Requests for active child
  const childLeaveRequests = useMemo(() => {
    return leaveRequests.filter((l) => l.childId === selectedChild);
  }, [leaveRequests, selectedChild]);

  // Notifications for parent
  const parentNotifications = useMemo(() => {
    return notifications.filter(
      (n) => n.targetRole === 'parent' || n.targetRole === 'parent_mobile' || n.targetRole === 'all'
    );
  }, [notifications]);

  const unreadNotifCount = parentNotifications.filter((n) => !n.read).length;

  // Filtered announcements
  const filteredNotices = useMemo(() => {
    if (announcementCategory === 'all') return notices;
    return notices.filter((n) => n.category.toLowerCase() === announcementCategory.toLowerCase());
  }, [notices, announcementCategory]);

  // Library transactions for active child
  const childLibraryBooks = useMemo(() => {
    if (selectedChild === 'aarav') {
      return [
        {
          id: 'lib-01',
          title: 'A Brief History of Time',
          author: 'Stephen Hawking',
          isbn: '978-0553380163',
          issueDate: '2026-10-05',
          dueDate: '2026-10-26',
          status: 'Issued' as const,
          shelf: 'Physics / Cosmology (Shelf B-4)'
        },
        {
          id: 'lib-02',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          isbn: '978-0061120084',
          issueDate: '2026-09-15',
          dueDate: '2026-09-29',
          status: 'Returned' as const,
          shelf: 'Classic Literature'
        }
      ];
    }
    return [
      {
        id: 'lib-03',
        title: 'Percy Jackson: The Lightning Thief',
        author: 'Rick Riordan',
        isbn: '978-0786838653',
        issueDate: '2026-10-10',
        dueDate: '2026-10-31',
        status: 'Issued' as const,
        shelf: 'Young Adult Fiction (Shelf A-2)'
      },
      {
        id: 'lib-04',
        title: 'National Geographic Kids: Ocean Animals',
        author: 'Johnna Rizzo',
        isbn: '978-1426324536',
        issueDate: '2026-09-20',
        dueDate: '2026-10-04',
        status: 'Returned' as const,
        shelf: 'Nature & Science Junior'
      }
    ];
  }, [selectedChild]);

  // School Events List
  const schoolEventsList = useMemo(() => {
    return [
      {
        id: 'ev-1',
        title: 'Annual Inter-House Athletics Meet 2026',
        date: '2026-11-06',
        time: '08:30 AM - 02:00 PM',
        location: 'Greenfield Main Sports Complex',
        category: 'Sports',
        description: 'Track and field events, sprint relays, long jump, and house parade. Parents warmly invited.'
      },
      {
        id: 'ev-2',
        title: 'Term 1 Parent-Teacher Consultation (PTM)',
        date: '2026-11-14',
        time: '09:00 AM - 01:30 PM',
        location: 'Classroom 8A & 5B Wings',
        category: 'Meeting',
        description: 'One-on-one progress discussion with class mentors and subject specialists.'
      },
      {
        id: 'ev-3',
        title: 'Science & Robotics Innovation Fair',
        date: '2026-11-20',
        time: '10:00 AM - 03:00 PM',
        location: 'Auditorium & STEM Labs',
        category: 'Academic',
        description: 'Exhibition of student STEM inventions, working models, and coding presentations.'
      },
      {
        id: 'ev-4',
        title: 'Term 1 Mid-Year Vacation & Break',
        date: '2026-12-20',
        time: 'All Day',
        location: 'All Campuses',
        category: 'Holiday',
        description: 'School reopens on Monday, 04 January 2027.'
      }
    ];
  }, []);

  // Downloadable Certificates
  const availableCertificates: SimulatedCertificate[] = useMemo(() => [
    {
      id: 'cert-1',
      title: 'Bonafide Student Enrollment Certificate',
      code: `BON-2026-${currentChild.rollNo}04`,
      issueDate: '2026-08-10',
      category: 'Enrollment',
      description: `Official certification confirming that ${currentChild.name} is a full-time regular student in Grade ${currentChild.grade} for Academic Year 2026-2027.`
    },
    {
      id: 'cert-2',
      title: 'Official Term 1 Academic Transcript',
      code: `TRANS-2026-T1-${selectedChild.toUpperCase()}`,
      issueDate: '2026-10-15',
      category: 'Academic',
      description: `Comprehensive academic marksheet, attendance record, and faculty remarks for ${currentChild.name}.`
    },
    {
      id: 'cert-3',
      title: 'Fee Dues Clearance Certificate',
      code: `FEE-CLR-2026-${currentChild.admissionId.replace(/[^0-9]/g, '')}`,
      issueDate: '2026-09-15',
      category: 'Financial',
      description: 'Official clearance from Bursar Office certifying timely settlement of verified tuition dues.'
    },
    {
      id: 'cert-4',
      title: 'Annual Student Health & Immunization Record',
      code: `MED-GIS-2026-${currentChild.rollNo}88`,
      issueDate: '2026-07-28',
      category: 'Health',
      description: 'School medical infirmary checkup record, vision screening, and emergency physician clearance.'
    }
  ], [currentChild, selectedChild]);

  // Navigation handlers
  const handleSelectPrimaryTab = (tab: 'home' | 'attendance' | 'academics' | 'fees' | 'more') => {
    setActiveTab(tab);
    setSubScreen(null);
    setSelectedAssignment(null);
  };

  const navigateToSubScreen = (
    screen:
      | 'timetable'
      | 'exams'
      | 'leave_requests'
      | 'announcements'
      | 'events'
      | 'transport'
      | 'library'
      | 'messages'
      | 'documents'
      | 'profile'
      | 'help'
  ) => {
    setSubScreen(screen);
  };

  const handleBackToMain = () => {
    if (selectedAssignment) {
      setSelectedAssignment(null);
      return;
    }
    setSubScreen(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const teacherName = currentChild.classTeacher;
    const threadId = `parent-teacher-${selectedChild}`;
    sendMessage(threadId, chatInput.trim(), 'parent', parentProfile.fullName || 'Ramesh Sharma');
    setChatInput('');
    addToast({
      type: 'success',
      title: 'Message Sent to Teacher',
      message: `Your message has been delivered to ${teacherName} (Class Mentor).`
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; phone?: string } = {};

    if (!profileForm.email || !/^\S+@\S+\.\S+$/.test(profileForm.email)) {
      errors.email = 'Please provide a valid email address';
    }
    if (!profileForm.phone || profileForm.phone.length < 8) {
      errors.phone = 'Please provide a valid contact telephone number';
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileErrors({});
    updateUserProfile('parent_mobile', {
      ...parentProfile,
      fullName: profileForm.fullName,
      email: profileForm.email,
      phone: profileForm.phone,
      preferences: {
        ...parentProfile.preferences,
        notificationsSms: profileForm.notificationsSms,
        notificationsEmail: profileForm.notificationsEmail
      }
    });

    setIsEditingProfile(false);
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Emergency contact information saved successfully.'
    });
  };

  const handleViewReceipt = (receiptNumber: string) => {
    const r: PaymentReceipt = {
      id: `rcpt-${Date.now()}`,
      receiptNumber,
      studentId: currentChild.studentId,
      studentName: currentChild.name,
      className: `${currentChild.grade} - Section ${currentChild.section}`,
      amount: childFeeRecord.paid || 2950,
      date: '2026-09-14',
      paymentMethod: 'Bank Transfer',
      referenceNumber: 'NEFT-AXIS-9921048',
      feeRecordId: childFeeRecord.id,
      receivedBy: 'Alok Saxena (Bursar)',
      notes: 'Term 1 Tuition & Academic Composite Fee cleared in full.'
    };
    setActiveReceipt(r);
  };

  // Submit simulated payment
  const handleExecuteSimulatedPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setShowPaymentModal(false);

      const receiptNum = `RCP-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
      const newReceipt: PaymentReceipt = {
        id: `rcpt-${Date.now()}`,
        receiptNumber: receiptNum,
        studentId: currentChild.studentId,
        studentName: currentChild.name,
        className: `${currentChild.grade} - Section ${currentChild.section}`,
        amount: childFeeRecord.pending,
        date: '2026-10-22',
        paymentMethod: paymentMethod === 'Card' ? 'Card' : paymentMethod === 'UPI' ? 'UPI' : 'Bank Transfer',
        referenceNumber: `${paymentMethod.toUpperCase()}-TXN-884920`,
        feeRecordId: childFeeRecord.id,
        receivedBy: 'Alok Saxena (Bursar - Electronic Gateway)',
        notes: `Simulated online payment for outstanding balance. Settlement verified.`
      };

      setSimulatedReceipts([newReceipt, ...simulatedReceipts]);
      setPaidOverrideBalance({
        ...paidOverrideBalance,
        [selectedChild]: 0
      });

      addToast({
        type: 'success',
        title: 'Payment Successful',
        message: `Payment of $${childFeeRecord.pending}.00 completed. Receipt #${receiptNum} generated.`
      });

      setActiveReceipt(newReceipt);
    }, 1200);
  };

  // Submit leave application
  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.reason.trim()) {
      setLeaveFormError('Please enter a specific reason for the leave application.');
      return;
    }
    if (new Date(leaveForm.startDate) > new Date(leaveForm.endDate)) {
      setLeaveFormError('End date cannot precede start date.');
      return;
    }

    const diffDays = Math.max(
      1,
      Math.ceil(
        (new Date(leaveForm.endDate).getTime() - new Date(leaveForm.startDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );

    const newReq: ParentLeaveRequest = {
      id: `leave-${Date.now()}`,
      childId: selectedChild,
      childName: currentChild.name,
      category: leaveForm.category,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      totalDays: diffDays,
      reason: leaveForm.reason.trim(),
      emergencyPhone: leaveForm.emergencyPhone,
      appliedDate: '2026-10-22',
      status: 'Pending'
    };

    setLeaveRequests([newReq, ...leaveRequests]);
    setShowApplyLeaveModal(false);
    setLeaveForm({
      category: 'Medical / Sick Leave',
      startDate: '2026-10-26',
      endDate: '2026-10-27',
      reason: '',
      emergencyPhone: '+91 98112 88410'
    });
    setLeaveFormError('');

    addToast({
      type: 'success',
      title: 'Leave Application Submitted',
      message: `Leave request for ${currentChild.name} (${diffDays} days) forwarded to ${currentChild.classTeacher}.`
    });
  };

  const handleCancelLeave = (reqId: string) => {
    setLeaveRequests(leaveRequests.filter((l) => l.id !== reqId));
    addToast({
      type: 'info',
      title: 'Leave Request Cancelled',
      message: 'The pending leave request has been cancelled.'
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-hidden relative font-sans">
      {/* ================= A. COMPACT MOBILE TOP BAR ================= */}
      <header className="bg-theme-primary text-white px-3.5 pt-3 pb-2.5 shrink-0 shadow-sm border-b border-white/10 z-30 transition-colors">
        <div className="flex items-center justify-between mb-2">
          {/* SCHLAR Monogram & Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-black text-xs text-white shadow-2xs">
              SC
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-white block leading-none">SCHLAR</span>
              <span className="text-[10px] text-white/70 block leading-tight">Greenfield Int.</span>
            </div>
          </div>

          {/* Top Bar Actions: Notifications + Profile */}
          <div className="flex items-center gap-1.5">
            {/* In-app Notification Bell */}
            <button
              onClick={() => setShowNotificationsModal(true)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Notifications"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-theme-primary animate-pulse" />
              )}
            </button>

            {/* Parent Profile Avatar button */}
            <button
              onClick={() => navigateToSubScreen('profile')}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-bold"
              title="Guardian Profile & Settings"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                RS
              </div>
              <span className="max-w-[70px] truncate hidden xs:inline">Ramesh</span>
            </button>
          </div>
        </div>

        {/* Child Selector Switcher (Aarav Grade 8A ↔ Ananya Grade 5B) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/15 rounded-xl border border-white/10">
          <button
            onClick={() => {
              setSelectedChild('aarav');
              addToast({
                type: 'info',
                title: 'Student Profile Switched',
                message: 'Now displaying records for Aarav Sharma (Grade 8A).'
              });
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all min-h-[34px] ${
              selectedChild === 'aarav'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-extrabold ${
                selectedChild === 'aarav' ? 'bg-theme-primary text-white' : 'bg-white/20 text-white'
              }`}
            >
              AS
            </div>
            <span className="truncate">Aarav (8A)</span>
          </button>

          <button
            onClick={() => {
              setSelectedChild('ananya');
              addToast({
                type: 'info',
                title: 'Student Profile Switched',
                message: 'Now displaying records for Ananya Sharma (Grade 5B).'
              });
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-all min-h-[34px] ${
              selectedChild === 'ananya'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-white/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-extrabold ${
                selectedChild === 'ananya' ? 'bg-theme-primary text-white' : 'bg-white/20 text-white'
              }`}
            >
              AS
            </div>
            <span className="truncate">Ananya (5B)</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN SCROLLABLE CONTENT AREA ================= */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= SUB-SCREEN: HOMEWORK DETAIL ================= */}
        {subScreen === 'homework_detail' && selectedAssignment && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <button
              onClick={() => {
                setSelectedAssignment(null);
                setSubScreen(null);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homework List</span>
            </button>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-1">
                    {selectedAssignment.subject}
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedAssignment.title}
                  </h2>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    completedHomeworkIds.includes(selectedAssignment.id)
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {completedHomeworkIds.includes(selectedAssignment.id) ? 'Completed' : 'Pending Submission'}
                </span>
              </div>

              {/* Assignment Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Assigned By:</span>
                  <span className="font-semibold text-slate-800 block truncate">{selectedAssignment.teacherName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Submission Deadline:</span>
                  <span className="font-mono font-bold text-rose-700 block">{selectedAssignment.dueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Maximum Score:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {selectedAssignment.maxMarks || 25} Marks
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Class Section:</span>
                  <span className="font-semibold text-slate-800">
                    {currentChild.grade} - {currentChild.section}
                  </span>
                </div>
              </div>

              {/* Full Description & Instructions */}
              <div className="space-y-1.5 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider text-[10px] text-slate-400">
                  Assignment Overview
                </span>
                <p className="leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  {selectedAssignment.description}
                </p>
                {selectedAssignment.instructions && (
                  <div className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <span className="font-bold text-blue-900 block mb-1">Teacher Instructions:</span>
                    <p className="text-blue-800 leading-relaxed text-[11px]">{selectedAssignment.instructions}</p>
                  </div>
                )}
              </div>

              {/* Downloadable Resource / Worksheet */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Study Resource / Worksheet Attachment
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-theme-primary shrink-0" />
                    <div>
                      <span className="font-semibold text-xs text-slate-900 block">
                        {selectedAssignment.attachmentName || `${selectedAssignment.subject}_Worksheet_Term1.pdf`}
                      </span>
                      <span className="text-[10px] text-slate-400">PDF Document · 1.4 MB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Worksheet Opened',
                        message: `Accessing ${selectedAssignment.subject} assignment resource.`
                      });
                    }}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Parent Review Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const isDone = completedHomeworkIds.includes(selectedAssignment.id);
                    if (isDone) {
                      setCompletedHomeworkIds(completedHomeworkIds.filter((id) => id !== selectedAssignment.id));
                      addToast({
                        type: 'info',
                        title: 'Marked as Pending',
                        message: 'Assignment status updated for your tracking.'
                      });
                    } else {
                      setCompletedHomeworkIds([...completedHomeworkIds, selectedAssignment.id]);
                      addToast({
                        type: 'success',
                        title: 'Marked as Reviewed with Child',
                        message: 'Great job! Assignment recorded as verified.'
                      });
                    }
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    completedHomeworkIds.includes(selectedAssignment.id)
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-theme-primary text-white shadow-2xs hover:opacity-95'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedHomeworkIds.includes(selectedAssignment.id)
                      ? 'Revert to Pending'
                      : 'Mark Reviewed with Child'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSubScreen('messages');
                    setSelectedAssignment(null);
                  }}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  title="Ask Teacher about Homework"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: TIMETABLE ================= */}
        {subScreen === 'timetable' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-theme-primary">
                  {currentChild.name} ({currentChild.grade})
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Student Class Timetable</h2>
                  <p className="text-[11px] text-slate-500">Academic Year 2026-2027 Schedule</p>
                </div>
                {/* Daily vs Weekly Toggle */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    onClick={() => setTimetableViewMode('daily')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      timetableViewMode === 'daily'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setTimetableViewMode('weekly')}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      timetableViewMode === 'weekly'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Weekly
                  </button>
                </div>
              </div>

              {/* Weekday Switcher (for Daily View) */}
              {timetableViewMode === 'daily' && (
                <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => (
                    <button
                      key={day}
                      onClick={() => setTimetableDay(day)}
                      className={`py-1.5 rounded-lg text-center transition-all ${
                        timetableDay === day
                          ? 'bg-theme-primary text-white font-bold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="block text-[11px]">{day.slice(0, 3)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Daily View Content */}
            {timetableViewMode === 'daily' && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
                  {timetableDay} Schedule
                </span>

                {/* Morning Assembly Slot */}
                <div className="p-2.5 bg-slate-100/70 border border-dashed border-slate-200 rounded-xl text-xs flex items-center justify-between text-slate-500">
                  <span className="font-semibold text-[11px]">Morning Assembly & Roll Call</span>
                  <span className="font-mono text-[10px]">08:15 - 08:30 AM</span>
                </div>

                {childTimetableSlots.length > 0 ? (
                  childTimetableSlots.map((slot, idx) => (
                    <React.Fragment key={slot.id || idx}>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{slot.subjectName}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                              {slot.room}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">{slot.teacherName}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded block">
                            {slot.startTime} - {slot.endTime}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{slot.periodName}</span>
                        </div>
                      </div>

                      {/* Recess after period 2 */}
                      {idx === 1 && (
                        <div className="p-2 bg-amber-50/70 border border-dashed border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-800">
                          <span className="font-semibold text-[11px]">Recess & Morning Snack</span>
                          <span className="font-mono text-[10px]">10:05 - 10:25 AM</span>
                        </div>
                      )}
                      {/* Lunch Break after period 4 */}
                      {idx === 3 && (
                        <div className="p-2 bg-emerald-50/70 border border-dashed border-emerald-200 rounded-xl text-xs flex items-center justify-between text-emerald-800">
                          <span className="font-semibold text-[11px]">Midday Lunch Break</span>
                          <span className="font-mono text-[10px]">12:15 - 01:00 PM</span>
                        </div>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  currentChild.todaySchedule.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{slot.subject}</span>
                        <span className="text-[11px] text-slate-500">
                          {slot.teacher} · {slot.room}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        {slot.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Weekly Overview Mode */}
            {timetableViewMode === 'weekly' && (
              <div className="space-y-3">
                {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => {
                  const daySlots = timetableEntries
                    .filter((e) => e.classId === childClassId && e.dayOfWeek === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  return (
                    <div key={day} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-extrabold text-xs text-slate-900">{day}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {daySlots.length > 0 ? `${daySlots.length} Periods` : 'Regular Day'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        {daySlots.slice(0, 4).map((s, idx) => (
                          <div key={idx} className="p-2 bg-slate-50 rounded-lg">
                            <span className="font-bold text-slate-900 block truncate">{s.subjectName}</span>
                            <span className="text-[10px] text-slate-400 block">{s.startTime} · {s.room}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================= SUB-SCREEN: EXAMINATIONS & RESULTS ================= */}
        {subScreen === 'exams' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Examinations & Results</span>
            </div>

            {/* Official Report Card Callout */}
            <div className="bg-theme-primary p-4 rounded-2xl text-white shadow-xs flex items-center justify-between border border-white/10">
              <div className="pr-2 space-y-1">
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider font-mono bg-white/15 px-2 py-0.5 rounded">
                  Official Academic Transcript
                </span>
                <h3 className="text-sm font-extrabold text-white">Term 1 Report Card</h3>
                <p className="text-[11px] text-white/80 leading-snug">
                  Complete transcript with official grades, teacher evaluation, and principal endorsement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReportCardModal(true)}
                className="px-3.5 py-2.5 bg-white text-slate-900 font-extrabold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-theme-primary" />
                <span>View Card</span>
              </button>
            </div>

            {/* Published Subject Results */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Published Subject Evaluations
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Overall: {currentChild.overallScore}% ({currentChild.overallGrade})
                </span>
              </div>

              {currentChild.subjects.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{sub.subject}</span>
                      <span className="text-[11px] text-slate-400">Instructor: {sub.teacher}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-extrabold font-mono text-theme-primary block">
                        {sub.score} / 100
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">Grade {sub.grade}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-theme-primary h-1.5 rounded-full" style={{ width: `${sub.score}%` }} />
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-600 italic">
                    "{sub.feedback}"
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Scheduled Examination Dates */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
                Upcoming Examination Schedule
              </span>

              {childExamSessions.length > 0 ? (
                childExamSessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{sess.subjectName}</span>
                        <span className="text-[11px] text-slate-500 font-mono">Hall / Room: {sess.room}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-light text-theme-primary border border-theme-border">
                        {sess.status}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                      <span>
                        Date: <strong className="font-mono text-slate-800">{sess.date}</strong>
                      </span>
                      <span className="font-mono">
                        {sess.startTime} - {sess.endTime}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400 italic">
                  No pending examination sessions scheduled for this division.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: LEAVE REQUESTS (PROMPT 11) ================= */}
        {subScreen === 'leave_requests' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setShowApplyLeaveModal(true)}
                className="px-3 py-1.5 bg-theme-primary text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Apply Leave</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900">Student Leave Applications</h2>
              <p className="text-[11px] text-slate-500">
                Official absence notification for {currentChild.name} ({currentChild.grade})
              </p>
            </div>

            {/* Leave Applications List */}
            <div className="space-y-2.5">
              {childLeaveRequests.length > 0 ? (
                childLeaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2.5"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{req.category}</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : ''} ({req.totalDays}{' '}
                          {req.totalDays === 1 ? 'day' : 'days'})
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : req.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                      {req.reason}
                    </p>

                    {req.reviewNote && (
                      <div className="text-[11px] text-slate-500 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                        <span className="font-bold text-blue-900">Mentor Remarks: </span>
                        <span>{req.reviewNote}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Applied on: {req.appliedDate}</span>
                      {req.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelLeave(req.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Cancel Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">No Leave Requests on Record</p>
                  <p className="text-[11px] text-slate-400">
                    Use the "Apply Leave" button above when your child requires excused absence.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: ANNOUNCEMENTS ================= */}
        {subScreen === 'announcements' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Announcements</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'School', 'Academic', 'Sports', 'Emergency'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAnnouncementCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    announcementCategory === cat
                      ? 'bg-theme-primary text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Notices' : cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredNotices.map((n) => {
                const isRead = readNoticeIds.includes(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      setSelectedNotice(n);
                      if (!readNoticeIds.includes(n.id)) {
                        setReadNoticeIds([...readNoticeIds, n.id]);
                      }
                    }}
                    className={`p-4 rounded-2xl border shadow-2xs text-xs space-y-2 cursor-pointer transition-all ${
                      isRead ? 'bg-white border-slate-200/80' : 'bg-slate-50 border-theme-primary ring-1 ring-theme-primary/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-2 py-0.5 rounded">
                          {n.category}
                        </span>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-rose-500" title="Unread Notice" />}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{n.date}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{n.title}</h3>
                    <p className="text-slate-600 line-clamp-2 leading-relaxed">{n.content}</p>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                      <span>Signatory: {n.author}</span>
                      <span className="text-theme-primary font-bold">Read Circular →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: SCHOOL EVENTS & CALENDAR ================= */}
        {subScreen === 'events' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">School Calendar</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900">Upcoming Campus Events</h2>
              <p className="text-[11px] text-slate-500">Official schedule for Academic Term 1 & 2</p>
            </div>

            <div className="space-y-3">
              {schoolEventsList.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded uppercase tracking-wider block mb-1">
                        {ev.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{ev.title}</h3>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded shrink-0">
                      {ev.date}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">{ev.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{ev.time}</span>
                    </span>
                    <button
                      onClick={() => {
                        addToast({
                          type: 'info',
                          title: 'Calendar Reminder Added',
                          message: `Saved reminder for "${ev.title}" to device calendar.`
                        });
                      }}
                      className="text-theme-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <CalendarDays className="w-3.5 h-3.5" />
                      <span>Remind Me</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: TRANSPORT ================= */}
        {subScreen === 'transport' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Transport & Fleet</span>
            </div>

            {/* Vehicle & Route Overview Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Route 12 · North Campus</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Bus #04 · Plate DL-01-AB-4021</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  On Route
                </span>
              </div>

              {/* Timing & Pickup Point */}
              <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Morning Pickup</span>
                  <span className="font-mono font-bold text-slate-900 block">07:45 AM</span>
                  <span className="text-[10px] text-slate-500 truncate block">Gate 3, Orchid Gardens</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Afternoon Drop-off</span>
                  <span className="font-mono font-bold text-slate-900 block">03:30 PM</span>
                  <span className="text-[10px] text-slate-500 truncate block">Gate 3, Orchid Gardens</span>
                </div>
              </div>

              {/* Crew Details */}
              <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Mohan Singh (Bus Driver)</span>
                    <span className="text-[10px] text-slate-400 font-mono">+91 98765 43210</span>
                  </div>
                  <a
                    href="tel:+919876543210"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast({
                        type: 'info',
                        title: 'Dialing Driver',
                        message: 'Contacting Mohan Singh (+91 98765 43210)'
                      });
                    }}
                    className="p-2 bg-theme-light text-theme-primary rounded-xl font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Driver</span>
                  </a>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="font-bold text-slate-800 block">Sunita Devi (Bus Attendant)</span>
                    <span className="text-[10px] text-slate-400 font-mono">+91 98765 43211</span>
                  </div>
                  <a
                    href="tel:+919876543211"
                    onClick={(e) => {
                      e.preventDefault();
                      addToast({
                        type: 'info',
                        title: 'Dialing Attendant',
                        message: 'Contacting Sunita Devi (+91 98765 43211)'
                      });
                    }}
                    className="p-2 bg-slate-100 text-slate-700 rounded-xl font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Route Sequence Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
              <span className="font-bold text-slate-900 block text-xs">Route 12 Waypoints & Stops</span>
              <div className="space-y-3 relative pl-4 border-l-2 border-theme-primary/30">
                {[
                  { stop: 'Sector 42 Terminal', time: '07:30 AM', passed: true },
                  { stop: 'Orchid Gardens Gate 3 (Child Pickup)', time: '07:45 AM', passed: true, current: true },
                  { stop: 'Greenfield Roundabout', time: '07:55 AM', passed: false },
                  { stop: 'South City Crossway', time: '08:05 AM', passed: false },
                  { stop: 'Greenfield Main Campus Gates', time: '08:15 AM', passed: false }
                ].map((st, i) => (
                  <div key={i} className="relative">
                    <span
                      className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        st.current
                          ? 'bg-theme-primary ring-2 ring-theme-primary/40'
                          : st.passed
                          ? 'bg-emerald-600'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${st.current ? 'text-theme-primary font-bold' : 'text-slate-800'}`}>
                        {st.stop}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">{st.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: LIBRARY ================= */}
        {subScreen === 'library' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Library Commons</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900">Student Borrowing Record</h2>
              <p className="text-[11px] text-slate-500">
                Greenfield Memorial Library records for {currentChild.name}
              </p>
            </div>

            <div className="space-y-2.5">
              {childLibraryBooks.map((b) => (
                <div
                  key={b.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{b.title}</span>
                      <span className="text-[11px] text-slate-400">Author: {b.author}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Issued'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] font-mono">
                    <div>
                      <span className="text-[9px] text-slate-400 font-sans block">Issued Date:</span>
                      <span className="text-slate-700 font-semibold">{b.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-sans block">Due Date:</span>
                      <span className="text-rose-700 font-bold">{b.dueDate}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                    <span>ISBN: {b.isbn}</span>
                    <span className="italic">{b.shelf}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100/70 rounded-xl text-center text-[11px] text-slate-400">
              Students may borrow up to 3 titles for a standard 14-day circulation cycle.
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: MESSAGES / TEACHER CHAT ================= */}
        {subScreen === 'messages' && (
          <div className="space-y-3 flex flex-col h-full animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary truncate max-w-[180px]">
                {currentChild.classTeacher}
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-theme-light text-theme-primary font-bold flex items-center justify-center text-xs">
                  {currentChild.classTeacher
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">{currentChild.classTeacher}</span>
                  <span className="text-[10px] text-slate-500">Class Mentor for {currentChild.name}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Online</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[420px] p-1">
              {messages.map((m) => {
                const isParent = m.senderRole === 'parent';
                return (
                  <div key={m.id} className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                        isParent
                          ? 'bg-theme-primary text-white rounded-br-xs shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <span className="text-[10px] font-bold opacity-75 block mb-1">{m.senderName}</span>
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 px-1 font-mono">{m.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Compose & Send Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-200">
              <input
                type="text"
                placeholder={`Message ${currentChild.classTeacher}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-theme font-sans"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-4 py-2 bg-theme-primary hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>

            <p className="text-[10px] text-center text-slate-400">
              Official school records. Messages are saved to your active browser session.
            </p>
          </div>
        )}

        {/* ================= SUB-SCREEN: DOCUMENTS & CERTIFICATES ================= */}
        {subScreen === 'documents' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Official Records</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900">Student Documents & Certificates</h2>
              <p className="text-[11px] text-slate-500">
                Verified records endorsed with the Greenfield International School seal
              </p>
            </div>

            <div className="space-y-2.5">
              {availableCertificates.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded uppercase tracking-wider block mb-1">
                        {doc.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{doc.title}</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{doc.issueDate}</span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed">{doc.description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400">{doc.code}</span>
                    <button
                      onClick={() => {
                        if (doc.id === 'cert-2') {
                          setShowReportCardModal(true);
                        } else {
                          setSelectedCertificate(doc);
                        }
                      }}
                      className="px-3 py-1.5 bg-theme-primary text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs hover:opacity-95"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>View & Print</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: PROFILE & SETTINGS ================= */}
        {subScreen === 'profile' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Guardian Profile & Settings</span>
            </div>

            {/* Profile Header Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-theme-primary text-white font-black text-xl flex items-center justify-center shadow-xs">
                  RS
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">{profileForm.fullName}</h2>
                  <p className="text-xs text-slate-500">Registered Guardian · Greenfield International</p>
                  <span className="text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded mt-1 inline-block">
                    Guardian ID: GRD-2024-8841
                  </span>
                </div>
              </div>

              {/* Linked Children summary */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Enrolled Wards Under Guardianship
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Aarav Sharma</span>
                    <span className="text-[10px] text-slate-500">Grade 8A · Roll #1</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-900 block">Ananya Sharma</span>
                    <span className="text-[10px] text-slate-500">Grade 5B · Roll #1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Contact Information Form */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Emergency Contact Particulars
                </h3>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-xs font-bold text-theme-primary hover:underline"
                  >
                    Edit Particulars
                  </button>
                )}
              </div>

              {!isEditingProfile ? (
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profileForm.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{profileForm.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{profileForm.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5 pt-1 text-slate-500 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Secondary Emergency Contact: {profileForm.emergencyPhone}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Guardian Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                    />
                    {profileErrors.email && (
                      <span className="text-rose-600 text-[10px] mt-0.5 block">{profileErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Mobile Telephone</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                    />
                    {profileErrors.phone && (
                      <span className="text-rose-600 text-[10px] mt-0.5 block">{profileErrors.phone}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Residential Address</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-theme-primary text-white rounded-lg font-bold shadow-2xs hover:opacity-95"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                Alert & Communication Preferences
              </h3>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">Real-Time SMS Attendance Alerts</span>
                  <input
                    type="checkbox"
                    checked={profileForm.notificationsSms}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, notificationsSms: e.target.checked });
                      addToast({ type: 'info', title: 'Preference Saved', message: 'SMS alert settings updated.' });
                    }}
                    className="w-4 h-4 accent-theme-primary"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-700">Email Academic Grade Reports</span>
                  <input
                    type="checkbox"
                    checked={profileForm.notificationsEmail}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, notificationsEmail: e.target.checked });
                      addToast({
                        type: 'info',
                        title: 'Preference Saved',
                        message: 'Email report settings updated.'
                      });
                    }}
                    className="w-4 h-4 accent-theme-primary"
                  />
                </label>
              </div>
            </div>

            {/* SCHLAR Theme Switcher Shortcut */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">App Theme & Appearance</h3>
                  <p className="text-[11px] text-slate-400">12 Palettes · Default Petrol & Copper</p>
                </div>
                <button
                  onClick={() => setIsThemeModalOpen(true)}
                  className="px-3 py-1.5 bg-theme-light text-theme-primary rounded-lg font-bold flex items-center gap-1 hover:opacity-90"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>
              </div>
            </div>

            {/* Application Information */}
            <div className="p-4 bg-slate-100/70 rounded-xl text-center text-[11px] text-slate-400 space-y-0.5">
              <p className="font-bold text-slate-600">SCHLAR Parent Mobile App v2.4 (Edition 2026)</p>
              <p>Greenfield International School · Demo Session Connected</p>
            </div>
          </div>
        )}

        {/* ================= SUB-SCREEN: HELP & SUPPORT ================= */}
        {subScreen === 'help' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <span className="text-xs font-bold text-theme-primary">Help & Support</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
              <h2 className="text-sm font-extrabold text-slate-900">Campus Contact Directory</h2>
              <p className="text-[11px] text-slate-500">Greenfield International School Administrative Offices</p>
            </div>

            {/* Contact Directory Cards */}
            <div className="space-y-2.5 text-xs">
              {[
                { title: "Principal's Secretariat", phone: '+91 11 2689 4001', email: 'principal@greenfield.edu', hours: 'Mon-Fri 08:30 AM - 03:30 PM' },
                { title: 'Bursar & Accounts Office', phone: '+91 11 2689 4002', email: 'accounts@greenfield.edu', hours: 'Mon-Fri 09:00 AM - 04:00 PM' },
                { title: 'Medical Infirmatory (24/7 Campus)', phone: '+91 11 2689 4009', email: 'infirmary@greenfield.edu', hours: 'Campus Nurse On-Duty' },
                { title: 'Transport Control Desk', phone: '+91 11 2689 4015', email: 'transport@greenfield.edu', hours: '06:30 AM - 06:00 PM' }
              ].map((c, i) => (
                <div key={i} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-xs">{c.title}</h3>
                  <div className="flex justify-between items-center text-[11px] text-slate-600">
                    <span className="font-mono">{c.phone}</span>
                    <span className="text-slate-400">{c.hours}</span>
                  </div>
                  <span className="text-[10px] text-theme-primary block">{c.email}</span>
                </div>
              ))}
            </div>

            {/* Parent FAQ Accordion */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
              <span className="font-bold text-slate-900 block text-xs">Frequently Asked Questions</span>
              <div className="space-y-2 text-slate-600 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">How do I submit an excused medical leave?</span>
                  <p>
                    Go to More → Student Leave Requests → "Apply Leave". Submit the date range and reason. The class
                    mentor will verify the application.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">When are official term report cards released?</span>
                  <p>
                    Term 1 report cards are officially published mid-October following Exam Coordination review and
                    Principal sign-off.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                  <span className="font-bold text-slate-900 block">How can I download a verified fee receipt?</span>
                  <p>
                    Navigate to the Fees tab, scroll to the "Official Payment Receipts" section, and tap "Receipt". You
                    can print or save the receipt PDF directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRIMARY TAB 1: HOME (PARENT DASHBOARD) ================= */}
        {activeTab === 'home' && !subScreen && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Friendly Greeting & Selected Child Hero Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-theme-light text-theme-primary border border-theme-border flex items-center justify-center font-extrabold text-base shadow-2xs">
                    {currentChild.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Good morning, Ramesh
                      </span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-900 leading-tight">{currentChild.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentChild.grade} · Section {currentChild.section} · Roll #{currentChild.rollNo}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded block">
                    {currentChild.overallGrade} Rank
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    {currentChild.overallScore}% Avg
                  </span>
                </div>
              </div>

              {/* Attendance & Class Mentor Quick Status */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div
                  onClick={() => handleSelectPrimaryTab('attendance')}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Today's Attendance</span>
                  <span className="font-mono font-bold text-emerald-800 text-xs mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Present ({currentChild.attendancePercentage}%)</span>
                  </span>
                </div>
                <div
                  onClick={() => navigateToSubScreen('messages')}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Class Mentor</span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block truncate">
                    {currentChild.classTeacher}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid (6 Direct Shortcuts) */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <button
                  onClick={() => handleSelectPrimaryTab('attendance')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[58px] active:scale-95 transition-all"
                >
                  <CalendarCheck className="w-5 h-5 text-theme-primary mb-1" />
                  <span className="font-bold text-slate-900 text-[11px]">Attendance</span>
                </button>

                <button
                  onClick={() => handleSelectPrimaryTab('academics')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[58px] active:scale-95 transition-all"
                >
                  <BookOpen className="w-5 h-5 text-theme-primary mb-1" />
                  <span className="font-bold text-slate-900 text-[11px]">Academics</span>
                </button>

                <button
                  onClick={() => navigateToSubScreen('timetable')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[58px] active:scale-95 transition-all"
                >
                  <Clock className="w-5 h-5 text-theme-primary mb-1" />
                  <span className="font-bold text-slate-900 text-[11px]">Timetable</span>
                </button>

                <button
                  onClick={() => navigateToSubScreen('exams')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[58px] active:scale-95 transition-all"
                >
                  <Award className="w-5 h-5 text-theme-primary mb-1" />
                  <span className="font-bold text-slate-900 text-[11px]">Results</span>
                </button>

                <button
                  onClick={() => handleSelectPrimaryTab('fees')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[58px] active:scale-95 transition-all"
                >
                  <DollarSign className="w-5 h-5 text-theme-primary mb-1" />
                  <span className="font-bold text-slate-900 text-[11px]">Fees</span>
                </button>

                <button
                  onClick={() => navigateToSubScreen('leave_requests')}
                  className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center min-h-[58px] active:scale-95 transition-all"
                >
                  <CalendarDays className="w-5 h-5 text-theme-primary mb-1" />
                  <span className="font-bold text-slate-900 text-[11px]">Leave</span>
                </button>
              </div>
            </div>

            {/* Fee Summary Widget with Direct Shortcut */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Term Fee Snapshot</span>
                <button
                  onClick={() => handleSelectPrimaryTab('fees')}
                  className="text-[10px] text-theme-primary font-bold hover:underline"
                >
                  View Details →
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 block">Outstanding Due</span>
                  <span
                    className={`font-mono text-base font-extrabold ${
                      childFeeRecord.pending > 0 ? 'text-amber-800' : 'text-emerald-800'
                    }`}
                  >
                    ${childFeeRecord.pending}.00
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Due Date</span>
                  <span className="font-mono text-xs font-bold text-slate-700">{childFeeRecord.dueDate}</span>
                </div>
              </div>
            </div>

            {/* Today's Schedule Overview */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Today's Schedule ({currentChild.grade})</span>
                <button
                  onClick={() => navigateToSubScreen('timetable')}
                  className="text-[10px] text-theme-primary font-bold hover:underline"
                >
                  Full Timetable →
                </button>
              </div>

              <div className="space-y-2">
                {childTimetableSlots.slice(0, 3).map((slot, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{slot.subjectName}</span>
                      <span className="text-[11px] text-slate-400">
                        {slot.teacherName} · {slot.room}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Homework Assignments Widget */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Active Homework & Tasks</span>
                <button
                  onClick={() => handleSelectPrimaryTab('academics')}
                  className="text-[10px] text-theme-primary font-bold hover:underline"
                >
                  View All ({childAssignments.length}) →
                </button>
              </div>

              <div className="space-y-2">
                {childAssignments.slice(0, 2).map((asg) => (
                  <div
                    key={asg.id}
                    onClick={() => {
                      setSelectedAssignment(asg);
                      setSubScreen('homework_detail');
                    }}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900">{asg.title}</span>
                      <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                        Due {asg.dueDate}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1 line-clamp-1">{asg.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Message Mentor Button */}
            <button
              onClick={() => navigateToSubScreen('messages')}
              className="w-full p-3.5 bg-theme-primary hover:opacity-95 text-white rounded-2xl shadow-2xs flex items-center justify-between text-xs font-semibold transition-opacity"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-white/80" />
                <span>Message Class Teacher ({currentChild.classTeacher})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/80" />
            </button>
          </div>
        )}

        {/* ================= PRIMARY TAB 2: ATTENDANCE ================= */}
        {activeTab === 'attendance' && !subScreen && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Annual Attendance Overview */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Attendance Rate</span>
                  <span className="text-[11px] text-slate-400">
                    {currentChild.name} · {currentChild.grade} - Section {currentChild.section}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Regular Status
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-3xl font-extrabold font-mono text-theme-primary">
                  {currentChild.attendancePercentage}%
                </span>
                <span className="text-xs text-slate-500">
                  {currentChild.presentDays} of {currentChild.presentDays + currentChild.absentDays} recorded sessions
                </span>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-2 border-t border-slate-100">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <span className="text-base font-bold text-emerald-900 block">{currentChild.presentDays}</span>
                  <span className="text-[10px] text-emerald-700 uppercase font-sans font-semibold">Present (✓)</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-xl">
                  <span className="text-base font-bold text-rose-900 block">{currentChild.absentDays}</span>
                  <span className="text-[10px] text-rose-700 uppercase font-sans font-semibold">Absent (✗)</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <span className="text-base font-bold text-amber-900 block">{currentChild.lateDays}</span>
                  <span className="text-[10px] text-amber-700 uppercase font-sans font-semibold">Tardy (⏱)</span>
                </div>
              </div>
            </div>

            {/* Attendance Calendar & Month Selector */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setAttendanceMonth((m) => Math.max(7, m - 1))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-900">
                  {['August', 'September', 'October', 'November'][attendanceMonth - 7]} 2026
                </span>
                <button
                  onClick={() => setAttendanceMonth((m) => Math.min(10, m + 1))}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span className="text-slate-300">Sat</span>
                <span className="text-slate-300">Sun</span>
              </div>

              {/* Day Grid for October 2026 */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const isWeekend = day % 7 === 3 || day % 7 === 4; // Simulated Sat/Sun
                  const isSelected = selectedAttendanceDay === day;
                  const isAbsent = day === 8;
                  const isLate = day === 14;
                  const isPresent = !isWeekend && !isAbsent && !isLate && day <= 21;

                  return (
                    <button
                      key={day}
                      disabled={isWeekend || day > 21}
                      onClick={() => setSelectedAttendanceDay(day)}
                      className={`h-9 rounded-xl flex flex-col items-center justify-center font-mono text-[11px] transition-all relative ${
                        isSelected ? 'ring-2 ring-theme-primary font-bold' : ''
                      } ${
                        isWeekend
                          ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                          : day > 21
                          ? 'text-slate-300'
                          : isAbsent
                          ? 'bg-rose-100 text-rose-900 font-bold'
                          : isLate
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : isPresent
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>{day}</span>
                      {isPresent && <span className="text-[8px] text-emerald-600 font-bold leading-none">✓</span>}
                      {isAbsent && <span className="text-[8px] text-rose-600 font-bold leading-none">✗</span>}
                      {isLate && <span className="text-[8px] text-amber-600 font-bold leading-none">⏱</span>}
                    </button>
                  );
                })}
              </div>

              {/* Accessible Legend */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300 inline-block" />
                  Present (✓)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-rose-100 border border-rose-300 inline-block" />
                  Absent (✗)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 inline-block" />
                  Late (⏱)
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-slate-100 inline-block" />
                  Weekend
                </span>
              </div>
            </div>

            {/* Selected Date Roll Call Log */}
            {selectedAttendanceDay && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">October {selectedAttendanceDay}, 2026 Record</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedAttendanceDay === 8
                        ? 'bg-rose-50 text-rose-800'
                        : selectedAttendanceDay === 14
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {selectedAttendanceDay === 8
                      ? 'Absent'
                      : selectedAttendanceDay === 14
                      ? 'Late Arrival (08:42 AM)'
                      : 'Full Day Present'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px] text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Morning Roll Call:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedAttendanceDay === 8
                        ? 'Marked Absent by Class Mentor'
                        : 'Verified Present in Homeroom'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Gate Movement Log:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedAttendanceDay === 14 ? 'Late Slip Issued at Main Gate' : 'Regular Gate In/Out'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Teacher Remarks:</span>
                    <span className="italic text-slate-500">
                      {selectedAttendanceDay === 8 ? 'Medical leave slip on file' : 'Normal classroom participation'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Read-only Access Disclaimer */}
            <div className="p-3 bg-slate-100/70 rounded-xl text-center text-[10px] text-slate-400">
              Verified read-only guardian record. Formal attendance corrections require administrative approval.
            </div>
          </div>
        )}

        {/* ================= PRIMARY TAB 3: ACADEMICS (HOMEWORK & CURRICULUM) ================= */}
        {activeTab === 'academics' && !subScreen && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Header with Sub-Tab Switcher */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Academic Progress</h2>
                  <p className="text-[11px] text-slate-500">
                    {currentChild.name} · {currentChild.grade} - Section {currentChild.section}
                  </p>
                </div>
                <span className="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-1 rounded-lg">
                  {currentChild.overallGrade} Grade
                </span>
              </div>

              {/* Sub-tabs: Homework vs Curriculum */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setAcademicsMode('homework')}
                  className={`py-1.5 rounded-lg transition-all ${
                    academicsMode === 'homework'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Homework & Tasks ({childAssignments.length})
                </button>
                <button
                  onClick={() => setAcademicsMode('curriculum')}
                  className={`py-1.5 rounded-lg transition-all ${
                    academicsMode === 'curriculum'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Curriculum & Subjects
                </button>
              </div>
            </div>

            {/* Sub-view 1: Homework & Tasks */}
            {academicsMode === 'homework' && (
              <div className="space-y-3">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {(
                    [
                      { id: 'all', label: 'All Tasks' },
                      { id: 'due_soon', label: 'Due Soon' },
                      { id: 'upcoming', label: 'Upcoming' },
                      { id: 'overdue', label: 'Overdue' },
                      { id: 'completed', label: 'Reviewed' }
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setHomeworkFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                        homeworkFilter === f.id
                          ? 'bg-theme-primary text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Homework Cards List */}
                <div className="space-y-2.5">
                  {filteredHomework.length > 0 ? (
                    filteredHomework.map((asg) => {
                      const isCompleted = completedHomeworkIds.includes(asg.id);
                      return (
                        <div
                          key={asg.id}
                          onClick={() => {
                            setSelectedAssignment(asg);
                            setSubScreen('homework_detail');
                          }}
                          className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2 cursor-pointer hover:border-theme-primary transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-theme-primary bg-theme-light px-2 py-0.5 rounded uppercase tracking-wider block">
                              {asg.subject}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Due {asg.dueDate}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm leading-snug">{asg.title}</h3>
                          <p className="text-slate-600 line-clamp-2 leading-relaxed">{asg.description}</p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>Instructor: {asg.teacherName}</span>
                            <div className="flex items-center gap-1.5 font-bold text-theme-primary">
                              {isCompleted ? (
                                <span className="text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                                </span>
                              ) : (
                                <span>View Details →</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                      <p className="text-xs font-bold text-slate-800">No tasks in this category</p>
                      <p className="text-[11px] text-slate-400">
                        All coursework for this filter is currently up to date.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-view 2: Curriculum & Subjects */}
            {academicsMode === 'curriculum' && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block px-1">
                  Enrolled Subjects & Faculty ({currentChild.grade})
                </span>

                <div className="space-y-2.5">
                  {currentChild.subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs space-y-2.5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{sub.subject}</h3>
                          <span className="text-[11px] text-slate-400">Faculty: {sub.teacher}</span>
                        </div>
                        <span className="text-xs font-bold font-mono text-theme-primary bg-theme-light px-2 py-0.5 rounded">
                          Grade {sub.grade} ({sub.score}%)
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-theme-primary h-1.5 rounded-full" style={{ width: `${sub.score}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Weekly Allotment: 5 Periods</span>
                        <span className="text-emerald-700 font-bold">Syllabus on track (Term 1)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= PRIMARY TAB 4: FEES ================= */}
        {activeTab === 'fees' && !subScreen && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Financial Summary Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Academic Year 2026 - 2027</span>
                  <span className="text-[11px] text-slate-400">
                    Student: {currentChild.name} ({currentChild.admissionId})
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    childFeeRecord.status === 'Paid'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {childFeeRecord.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-xs font-mono text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block">Assessed</span>
                  <span className="font-bold text-slate-900 text-sm">${childFeeRecord.totalFee}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 font-sans block">Paid</span>
                  <span className="font-bold text-emerald-800 text-sm">${childFeeRecord.paid}</span>
                </div>
                <div>
                  <span className="text-[10px] text-amber-700 font-sans block">Outstanding</span>
                  <span className="font-bold text-amber-800 text-sm">${childFeeRecord.pending}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-1 flex justify-between">
                <span>Payment Term: Annual Comprehensive</span>
                <span>Due Date: {childFeeRecord.dueDate}</span>
              </div>

              {/* Pay Online Action Trigger */}
              {childFeeRecord.pending > 0 && (
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-2.5 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-98 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Outstanding Balance (${childFeeRecord.pending}.00)</span>
                </button>
              )}
            </div>

            {/* Fee Heads Breakdown */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2.5 text-xs">
              <span className="font-bold text-slate-900 block text-xs">Fee Structure Breakdown</span>
              <div className="space-y-2 text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Term 1 Core Tuition & Faculty Instruction</span>
                  <span className="font-mono font-semibold text-slate-800">$2,000.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>STEM Curriculum & Computer Lab Fee</span>
                  <span className="font-mono font-semibold text-slate-800">$500.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Library & Digital Commons Subscription</span>
                  <span className="font-mono font-semibold text-slate-800">$450.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Sports, Co-Curricular & Activity Composite</span>
                  <span className="font-mono font-semibold text-slate-800">$450.00</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-slate-900">
                  <span>Total Composite Fee</span>
                  <span className="font-mono text-sm">${childFeeRecord.totalFee}.00</span>
                </div>
              </div>
            </div>

            {/* Payment Receipts & Ledger */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
              <span className="font-bold text-slate-900 block text-xs">Official Payment Receipts</span>

              {/* Dynamic list of receipts */}
              <div className="space-y-2">
                {simulatedReceipts
                  .filter((r) => r.studentId === currentChild.studentId)
                  .map((rcpt) => (
                    <div
                      key={rcpt.id}
                      className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 font-mono">{rcpt.receiptNumber}</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Verified · ${rcpt.amount}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">
                          {rcpt.paymentMethod} · {rcpt.date}
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveReceipt(rcpt)}
                        className="px-3 py-1.5 bg-theme-primary text-white rounded-lg text-xs font-bold shadow-2xs hover:opacity-90 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  ))}

                {/* Base Verified Receipt */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 font-mono">RCP-2026-0819</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Verified · $2,950
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">Bank Transfer · 14 Sep 2026</span>
                  </div>
                  <button
                    onClick={() => handleViewReceipt('RCP-2026-0819')}
                    className="px-3 py-1.5 bg-theme-primary text-white rounded-lg text-xs font-bold shadow-2xs hover:opacity-90 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Transparency Note */}
            <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-theme-primary" />
                <span>Financial Transparency Note</span>
              </div>
              <p>
                Fee ledgers are audited by the Greenfield International School Bursar Office. Direct online payments are
                demonstrated with real receipt generation and state persistence.
              </p>
            </div>
          </div>
        )}

        {/* ================= PRIMARY TAB 5: MORE (EXPANDED WORKSPACES) ================= */}
        {activeTab === 'more' && !subScreen && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">More Workspaces</h2>
              <p className="text-xs text-slate-500">Secondary modules for {currentChild.name}</p>
            </div>

            {/* Group 1: Academics & Schedule */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Academics & Schedule
              </span>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
                <button
                  onClick={() => navigateToSubScreen('timetable')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Class Timetable</span>
                      <span className="text-[11px] text-slate-400">Weekly schedule, periods & classrooms</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('exams')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Examinations & Results</span>
                      <span className="text-[11px] text-slate-400">Official marks & downloadable report card</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('leave_requests')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Student Leave Requests</span>
                      <span className="text-[11px] text-slate-400">Apply for leave, track approval & status</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Group 2: School Life & Campus */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Campus Life & Services
              </span>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
                <button
                  onClick={() => navigateToSubScreen('announcements')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Announcements & Circulars</span>
                      <span className="text-[11px] text-slate-400">Principal office notices & updates</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('events')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">School Events & Calendar</span>
                      <span className="text-[11px] text-slate-400">Sports Day, PTM, science exhibition</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('transport')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Bus Route & Fleet Info</span>
                      <span className="text-[11px] text-slate-400">Route 12, bus crew & live waypoints</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('library')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <BookMarked className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Library Borrowing History</span>
                      <span className="text-[11px] text-slate-400">Checked-out titles & return due dates</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Group 3: Communication & Official Records */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Communication & Records
              </span>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
                <button
                  onClick={() => navigateToSubScreen('messages')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Direct Teacher Messages</span>
                      <span className="text-[11px] text-slate-400">Chat with {currentChild.classTeacher}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('documents')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Documents & Certificates</span>
                      <span className="text-[11px] text-slate-400">Bonafide, report cards & clearance letters</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Group 4: Profile & Support */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Profile & Campus Directory
              </span>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden text-xs">
                <button
                  onClick={() => navigateToSubScreen('profile')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Guardian Profile & Settings</span>
                      <span className="text-[11px] text-slate-400">Emergency contacts, alerts & themes</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateToSubScreen('help')}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Help & Campus Support</span>
                      <span className="text-[11px] text-slate-400">Administrative desk contacts & FAQs</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= B. BOTTOM NAVIGATION (5 PRIMARY DESTINATIONS) ================= */}
      <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 grid grid-cols-5 items-center shrink-0 z-30 shadow-lg">
        {[
          { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
          { id: 'attendance', label: 'Attendance', icon: <CalendarCheck className="w-5 h-5" /> },
          { id: 'academics', label: 'Academics', icon: <BookOpen className="w-5 h-5" /> },
          { id: 'fees', label: 'Fees', icon: <DollarSign className="w-5 h-5" /> },
          { id: 'more', label: 'More', icon: <MoreHorizontal className="w-5 h-5" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id && subScreen === null;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectPrimaryTab(tab.id as any)}
              className={`flex flex-col items-center justify-center min-h-[44px] transition-colors ${
                isActive ? 'text-theme-primary font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'academics' && childAssignments.length > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-theme-primary text-white text-[9px] font-extrabold rounded-full">
                    {childAssignments.length}
                  </span>
                )}
                {tab.id === 'fees' && childFeeRecord.pending > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ================= MODAL: IN-APP NOTIFICATION CENTER ================= */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-theme-primary" />
                <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                {unreadNotifCount > 0 && (
                  <span className="text-[10px] bg-theme-primary text-white font-bold px-1.5 py-0.2 rounded-full">
                    {unreadNotifCount} New
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
              {parentNotifications.length > 0 ? (
                parentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      setShowNotificationsModal(false);
                      // Route to appropriate module
                      if (notif.targetModule === 'attendance') handleSelectPrimaryTab('attendance');
                      else if (notif.targetModule === 'homework') handleSelectPrimaryTab('academics');
                      else if (notif.targetModule === 'fees') handleSelectPrimaryTab('fees');
                      else if (notif.targetModule === 'exams') navigateToSubScreen('exams');
                      else navigateToSubScreen('announcements');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      notif.read
                        ? 'bg-slate-50 border-slate-100 text-slate-600'
                        : 'bg-white border-theme-primary/30 shadow-2xs font-semibold'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{notif.message}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">No notifications at this time.</div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs font-bold text-theme-primary hover:underline"
              >
                Mark all as read
              </button>
              <button
                onClick={() => setShowNotificationsModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: NOTICE FULL DETAILS ================= */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-2 py-0.5 rounded">
                {selectedNotice.category} Notice
              </span>
              <button onClick={() => setSelectedNotice(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{selectedNotice.title}</h3>

            <div className="text-[10px] text-slate-400 border-b border-slate-100 pb-2 flex justify-between">
              <span>Date: {selectedNotice.date}</span>
              <span>Signatory: {selectedNotice.author}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed max-h-56 overflow-y-auto">{selectedNotice.content}</p>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-1.5 bg-theme-primary text-white rounded-xl text-xs font-bold"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: APPLY FOR STUDENT LEAVE ================= */}
      {showApplyLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Apply for Student Leave</h3>
                <p className="text-[10px] text-slate-400">
                  Submitting for {currentChild.name} ({currentChild.grade})
                </p>
              </div>
              <button onClick={() => setShowApplyLeaveModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Leave Category</label>
                <select
                  value={leaveForm.category}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, category: e.target.value as ParentLeaveRequest['category'] })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  <option value="Medical / Sick Leave">Medical / Sick Leave</option>
                  <option value="Family Event / Urgent Travel">Family Event / Urgent Travel</option>
                  <option value="Religious Observance">Religious Observance</option>
                  <option value="Other Personal">Other Personal Reason</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Absence Reason & Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide detailed explanation for faculty review..."
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Emergency Phone During Absence</label>
                <input
                  type="text"
                  required
                  value={leaveForm.emergencyPhone}
                  onChange={(e) => setLeaveForm({ ...leaveForm, emergencyPhone: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              {leaveFormError && (
                <div className="p-2 bg-rose-50 text-rose-700 text-[11px] rounded-lg border border-rose-200">
                  {leaveFormError}
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-theme-primary text-white rounded-xl font-bold shadow-2xs hover:opacity-95"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyLeaveModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SIMULATED PAYMENT ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Greenfield Payment Gateway</h3>
                <p className="text-[10px] text-slate-400">Simulated School Bank Terminal</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-bold text-slate-900">{currentChild.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice:</span>
                <span className="font-mono text-slate-700">INV-2026-TERM1</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="font-bold text-slate-900">Payable Amount:</span>
                <span className="font-mono font-extrabold text-theme-primary text-sm">
                  ${childFeeRecord.pending}.00
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block text-slate-600 font-semibold text-[11px]">Select Payment Mode</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['UPI', 'Card', 'Net Banking'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      paymentMethod === method
                        ? 'bg-theme-primary text-white border-theme-primary shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-[10px] text-blue-900 leading-relaxed flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-theme-primary shrink-0" />
              <span>Safe sandbox demonstration. No real financial transaction will occur.</span>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleExecuteSimulatedPayment}
                className="flex-1 py-2.5 bg-theme-primary text-white rounded-xl font-bold shadow-2xs hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isProcessingPayment ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Pay ${childFeeRecord.pending}.00</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL CERTIFICATE PREVIEW ================= */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[9px] font-bold text-theme-primary uppercase tracking-widest block font-mono">
                  Official Document
                </span>
                <h3 className="font-extrabold text-sm text-slate-900">{selectedCertificate.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Certificate Sheet Mockup */}
            <div className="p-4 bg-amber-50/30 rounded-xl border border-amber-200/80 space-y-3 text-xs shadow-2xs">
              <div className="text-center pb-2 border-b border-amber-200/60">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block">
                  Greenfield International School
                </span>
                <span className="text-[9px] text-slate-500">Established 1994 · Affiliated to Central Board</span>
              </div>

              <div className="space-y-2 text-[11px] text-slate-700 leading-relaxed">
                <p>
                  This is to certify that <strong className="text-slate-900">{currentChild.name}</strong>, Ward of Mr.
                  Ramesh Sharma, is a bonafide student in <strong className="text-slate-900">{currentChild.grade}</strong>{' '}
                  (Section {currentChild.section}, Admission No. {currentChild.admissionId}).
                </p>
                <p className="text-[10px] text-slate-500 italic">{selectedCertificate.description}</p>
              </div>

              <div className="pt-3 border-t border-amber-200/60 flex items-end justify-between text-[10px]">
                <div>
                  <span className="text-slate-400 block font-mono">Certificate Ref:</span>
                  <span className="font-bold font-mono text-slate-800">{selectedCertificate.code}</span>
                </div>
                <div className="text-right">
                  <div className="w-10 h-10 border border-theme-primary/30 rounded-full flex items-center justify-center mx-auto text-[8px] font-bold text-theme-primary">
                    GIS SEAL
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 block mt-0.5">Registrar</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Document Saved',
                    message: `${selectedCertificate.title} downloaded to device storage.`
                  });
                  setSelectedCertificate(null);
                }}
                className="flex-1 py-2.5 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Printing Document',
                    message: 'Sending certificate to local printer spool.'
                  });
                }}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: OFFICIAL STUDENT REPORT CARD ================= */}
      {(() => {
        const term1Exam = exams.find((e) => e.term.includes('Term 1')) || exams[0];

        return (
          <ReportCardModal
            student={matchedStudent}
            exam={term1Exam}
            marksList={marks}
            classInfo={childClass}
            isOpen={showReportCardModal}
            onClose={() => setShowReportCardModal(false)}
          />
        );
      })()}
    </div>
  );
};
