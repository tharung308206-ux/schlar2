import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Visitor, Enquiry, Appointment, Notice, Student, FrontOfficeCommunication } from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { AttendanceOperationsWorkspace } from '../../attendance/AttendanceOperationsWorkspace';
import {
  LayoutDashboard,
  HelpCircle,
  GraduationCap,
  Users,
  Calendar,
  PhoneCall,
  Bell,
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  X,
  ShieldCheck,
  MapPin,
  Mail,
  Send,
  User,
  Eye,
  Phone,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Building2,
  Check,
  AlertTriangle,
  QrCode,
  Printer,
  Copy,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';

const INITIAL_FRONT_OFFICE_COMMUNICATIONS: FrontOfficeCommunication[] = [
  {
    id: 'foc-1',
    timestamp: '2026-09-27 08:30 AM',
    type: 'Phone Call',
    contactPerson: 'Mrs. Anjali Sharma',
    contactNumber: '+1 (555) 301-8841',
    regardingStudent: 'Aarav Sharma (Grade 8A)',
    summary: 'Inquired regarding early gate pass for medical appointment at 1:30 PM. Informed of standard gate slip procedure.',
    handledBy: 'Kavita Chawla',
    status: 'Resolved'
  },
  {
    id: 'foc-2',
    timestamp: '2026-09-27 09:15 AM',
    type: 'Front Desk Walk-in',
    contactPerson: 'Mr. Arvind Khanna',
    contactNumber: '+1 (555) 712-4091',
    regardingStudent: 'Prospective Admission (Grade 6)',
    summary: 'Visited front desk for prospectus and Cambridge syllabus booklet. Collected contact info and scheduled campus tour.',
    handledBy: 'Kavita Chawla',
    status: 'Resolved'
  },
  {
    id: 'foc-3',
    timestamp: '2026-09-27 10:10 AM',
    type: 'Email Inquiry',
    contactPerson: 'David Miller (Edutech Supplies)',
    contactNumber: 'david.m@labsupplies.com',
    summary: 'Inquiry regarding laboratory equipment delivery gate access protocol and unloading bay availability.',
    handledBy: 'Kavita Chawla',
    status: 'Follow-up Required'
  },
  {
    id: 'foc-4',
    timestamp: '2026-09-27 11:20 AM',
    type: 'Phone Call',
    contactPerson: 'Sunita Verma',
    contactNumber: '+1 (555) 412-9901',
    regardingStudent: 'Kabir Verma (Grade 10A)',
    summary: 'Called to verify bus route #4 evening drop timing change circular. Confirmed drop timing is unchanged.',
    handledBy: 'Kavita Chawla',
    status: 'Resolved'
  }
];

interface SchoolOfficeContact {
  id: string;
  name: string;
  department: string;
  room: string;
  extension: string;
  email: string;
  directPhone: string;
  leadPerson: string;
  hours: string;
}

const SCHOOL_CONTACTS: SchoolOfficeContact[] = [
  {
    id: 'off-1',
    name: "Principal's Executive Office",
    department: 'Executive Administration',
    room: 'Admin Block, Room 101',
    extension: 'Ext. 101',
    email: 'principal@greenfield.edu',
    directPhone: '+1 (555) 201-1001',
    leadPerson: 'Dr. Arthur Campbell',
    hours: '08:00 AM – 04:30 PM'
  },
  {
    id: 'off-2',
    name: 'Vice Principal (Academics & Faculty)',
    department: 'Academic Affairs',
    room: 'Admin Block, Room 102',
    extension: 'Ext. 102',
    email: 'vp.academics@greenfield.edu',
    directPhone: '+1 (555) 201-1002',
    leadPerson: 'Mrs. Evelyn Hayes',
    hours: '08:00 AM – 04:00 PM'
  },
  {
    id: 'off-3',
    name: 'Admissions & Prospective Enrollment',
    department: 'Student Placement',
    room: 'Reception Lobby, Room 105',
    extension: 'Ext. 105',
    email: 'admissions@greenfield.edu',
    directPhone: '+1 (555) 201-1005',
    leadPerson: 'Kavita Chawla',
    hours: '07:30 AM – 04:00 PM'
  },
  {
    id: 'off-4',
    name: 'Accounts & Bursar Counter',
    department: 'Finance & Accounts',
    room: 'Admin Block, Counter 2',
    extension: 'Ext. 108',
    email: 'accounts@greenfield.edu',
    directPhone: '+1 (555) 201-1008',
    leadPerson: 'Alok Saxena',
    hours: '08:30 AM – 03:30 PM'
  },
  {
    id: 'off-5',
    name: 'Examination Board & Records Wing',
    department: 'Academic Directorate',
    room: 'Academic Block B, Room 204',
    extension: 'Ext. 204',
    email: 'exams@greenfield.edu',
    directPhone: '+1 (555) 201-1204',
    leadPerson: 'Dr. Marcus Brody',
    hours: '08:00 AM – 04:00 PM'
  },
  {
    id: 'off-6',
    name: 'Campus Infirmary & Medical Center',
    department: 'Health & Wellness',
    room: 'Ground Floor Block B (Near Quad)',
    extension: 'Ext. 911 / 112',
    email: 'infirmary@greenfield.edu',
    directPhone: '+1 (555) 201-9911',
    leadPerson: 'Sister Mary Joseph (Staff Nurse)',
    hours: '24/7 On Campus (Day Shifts 07:30 – 17:00)'
  },
  {
    id: 'off-7',
    name: 'Central Library & Media Center',
    department: 'Library Services',
    room: 'Block C, Level 2',
    extension: 'Ext. 301',
    email: 'library@greenfield.edu',
    directPhone: '+1 (555) 201-1301',
    leadPerson: 'Nandini Krishnan',
    hours: '08:00 AM – 05:00 PM'
  },
  {
    id: 'off-8',
    name: 'Transport Operations & Fleet Dispatch',
    department: 'Transport Logistics',
    room: 'Transport Bay 1 & Bus Depot',
    extension: 'Ext. 401',
    email: 'transport@greenfield.edu',
    directPhone: '+1 (555) 201-1401',
    leadPerson: 'Harish Rawat',
    hours: '06:00 AM – 06:30 PM'
  },
  {
    id: 'off-9',
    name: 'Campus Security & Main Gate Control',
    department: 'Campus Safety',
    room: 'Main Gatehouse A',
    extension: 'Ext. 999 / 100',
    email: 'security@greenfield.edu',
    directPhone: '+1 (555) 201-1999',
    leadPerson: 'Chief Inspector Ram Singh',
    hours: '24 Hours / 7 Days'
  }
];

export const ReceptionistView: React.FC = () => {
  const {
    visitors,
    enquiries,
    appointments,
    students,
    teachers,
    staff,
    classes,
    notices,
    checkInVisitor,
    checkOutVisitor,
    updateEnquiryStatus,
    addEnquiry,
    addAppointment,
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

  // Communication Log state
  const [communications, setCommunications] = useState<FrontOfficeCommunication[]>(INITIAL_FRONT_OFFICE_COMMUNICATIONS);
  const [commSearch, setCommSearch] = useState('');
  const [commTypeFilter, setCommTypeFilter] = useState<string>('all');
  const [commStatusFilter, setCommStatusFilter] = useState<string>('all');
  const [showCommModal, setShowCommModal] = useState(false);
  const [commForm, setCommForm] = useState({
    type: 'Phone Call' as FrontOfficeCommunication['type'],
    contactPerson: '',
    contactNumber: '',
    regardingStudent: '',
    summary: '',
    status: 'Resolved' as FrontOfficeCommunication['status']
  });

  // Visitor Check-In Form
  const [visitorForm, setVisitorForm] = useState({
    visitorName: '',
    organization: '',
    purpose: 'Parent-Teacher Meeting',
    personToMeet: 'Mrs. Evelyn Hayes (Vice Principal)',
    phone: '',
    idVerified: true,
    vehicleNo: '',
    expectedDuration: '45 mins',
    badgeNo: `VIS-${Math.floor(100 + Math.random() * 900)}`,
    notes: ''
  });

  // Visitor Register & Check-out state
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorFilter, setVisitorFilter] = useState<'all' | 'Checked In' | 'Checked Out' | 'Expected'>('all');
  const [selectedBadgeVisitor, setSelectedBadgeVisitor] = useState<Visitor | null>(null);

  // New Enquiry Modal State
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');
  const [enquirySourceFilter, setEnquirySourceFilter] = useState<string>('all');
  const [enquiryForm, setEnquiryForm] = useState({
    parentName: '',
    studentName: '',
    grade: 'Grade 9',
    contact: '',
    source: 'Walk-in' as Enquiry['source'],
    notes: '',
    followUpDate: '2026-10-05',
    assignedStaff: 'Kavita Chawla'
  });

  // Appointments State
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>('all');
  const [appointmentList, setAppointmentList] = useState<Appointment[]>(appointments);

  // Keep appointmentList in sync with AppContext appointments
  React.useEffect(() => {
    setAppointmentList(appointments);
  }, [appointments]);

  const [appointmentForm, setAppointmentForm] = useState({
    parentName: '',
    studentName: '',
    meetWith: 'Mrs. Evelyn Hayes',
    role: 'Vice Principal',
    date: '2026-10-02',
    time: '11:00 AM - 11:30 AM',
    purpose: 'Academic assessment review',
    visitorPhone: '+1 (555) 712-4091',
    notes: 'Requested consultation on advanced placement electives.'
  });

  // Directories state
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const [staffSearch, setStaffSearch] = useState('');
  const [staffDeptFilter, setStaffDeptFilter] = useState('all');
  const [schoolContactSearch, setSchoolContactSearch] = useState('');

  // Notices state
  const [noticeSearch, setNoticeSearch] = useState('');
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Check-In Sub-tab (tab within 'checkin' module)
  const [checkinSubTab, setCheckinSubTab] = useState<'form' | 'fast_checkout'>('form');

  // KPI Calculations
  const checkedInVisitorsCount = visitors.filter((v) => v.status === 'Checked In').length;
  const expectedVisitorsCount = visitors.filter((v) => v.status === 'Expected').length;
  const scheduledAppointmentsCount = appointmentList.filter((a) => a.status === 'Scheduled').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  // Handle Visitor Check-In Submit
  const handleVisitorCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorForm.visitorName.trim() || !visitorForm.phone.trim()) {
      addToast({ type: 'info', title: 'Input Required', message: 'Please provide visitor name and contact phone number.' });
      return;
    }

    checkInVisitor({
      visitorName: visitorForm.visitorName,
      organization: visitorForm.organization || 'Independent Parent / Visitor',
      purpose: visitorForm.purpose,
      personToMeet: visitorForm.personToMeet,
      phone: visitorForm.phone,
      badgeNo: visitorForm.badgeNo,
      notes: `${visitorForm.notes ? visitorForm.notes + ' · ' : ''}Expected: ${visitorForm.expectedDuration}${visitorForm.vehicleNo ? ` · Vehicle: ${visitorForm.vehicleNo}` : ''}`
    });

    addToast({
      type: 'success',
      title: 'Badge Issued',
      message: `Visitor badge ${visitorForm.badgeNo} issued to ${visitorForm.visitorName}. Checked in successfully.`
    });

    // Reset form with new badge number
    setVisitorForm({
      visitorName: '',
      organization: '',
      purpose: 'Parent-Teacher Meeting',
      personToMeet: 'Mrs. Evelyn Hayes (Vice Principal)',
      phone: '',
      idVerified: true,
      vehicleNo: '',
      expectedDuration: '45 mins',
      badgeNo: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      notes: ''
    });
  };

  // Handle Fast Check Out
  const handleFastCheckOut = (visitorId: string, visitorName: string) => {
    checkOutVisitor(visitorId);
    addToast({
      type: 'info',
      title: 'Visitor Checked Out',
      message: `Visitor ${visitorName} marked as Departed/Checked Out. Gate pass closed.`
    });
  };

  // Handle New Enquiry Submit
  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryForm.parentName.trim() || !enquiryForm.studentName.trim()) {
      addToast({ type: 'info', title: 'Input Required', message: 'Parent name and prospective student name are required.' });
      return;
    }

    addEnquiry({
      parentName: enquiryForm.parentName,
      studentName: enquiryForm.studentName,
      grade: enquiryForm.grade,
      contact: enquiryForm.contact,
      source: enquiryForm.source,
      notes: enquiryForm.notes,
      status: 'New'
    });

    setShowEnquiryModal(false);
    addToast({
      type: 'success',
      title: 'Enquiry Recorded',
      message: `New admission enquiry recorded for ${enquiryForm.studentName} (${enquiryForm.grade}).`
    });

    setEnquiryForm({
      parentName: '',
      studentName: '',
      grade: 'Grade 9',
      contact: '',
      source: 'Walk-in',
      notes: '',
      followUpDate: '2026-10-05',
      assignedStaff: 'Kavita Chawla'
    });
  };

  // Handle Appointment Status Change
  const handleUpdateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointmentList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Appointment status updated to '${newStatus}'.`
    });
  };

  // Handle Appointment Submit
  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentForm.parentName.trim() || !appointmentForm.meetWith.trim()) {
      addToast({ type: 'info', title: 'Input Required', message: 'Parent name and staff host are required.' });
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      parentName: appointmentForm.parentName,
      studentName: appointmentForm.studentName,
      meetWith: appointmentForm.meetWith,
      role: appointmentForm.role,
      date: appointmentForm.date,
      time: appointmentForm.time,
      purpose: appointmentForm.purpose,
      status: 'Scheduled',
      visitorPhone: appointmentForm.visitorPhone,
      notes: appointmentForm.notes
    };

    addAppointment({
      parentName: appointmentForm.parentName,
      studentName: appointmentForm.studentName,
      meetWith: appointmentForm.meetWith,
      role: appointmentForm.role,
      date: appointmentForm.date,
      time: appointmentForm.time,
      purpose: appointmentForm.purpose
    });

    setAppointmentList((prev) => [newApt, ...prev]);
    setShowAppointmentModal(false);
    addToast({
      type: 'success',
      title: 'Appointment Booked',
      message: `Appointment booked with ${appointmentForm.meetWith} on ${appointmentForm.date}.`
    });
  };

  // Handle New Communication Submit
  const handleCommSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commForm.contactPerson.trim() || !commForm.summary.trim()) {
      addToast({ type: 'info', title: 'Input Required', message: 'Caller/visitor name and summary are required.' });
      return;
    }

    const newEntry: FrontOfficeCommunication = {
      id: `foc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      type: commForm.type,
      contactPerson: commForm.contactPerson,
      contactNumber: commForm.contactNumber || '—',
      regardingStudent: commForm.regardingStudent || undefined,
      summary: commForm.summary,
      handledBy: 'Kavita Chawla',
      status: commForm.status
    };

    setCommunications((prev) => [newEntry, ...prev]);
    setShowCommModal(false);
    setCommForm({
      type: 'Phone Call',
      contactPerson: '',
      contactNumber: '',
      regardingStudent: '',
      summary: '',
      status: 'Resolved'
    });
    addToast({
      type: 'success',
      title: 'Communication Logged',
      message: 'Front office communication logged successfully.'
    });
  };

  // CSV Exporters
  const downloadCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Export Successful', message: `Downloaded ${filename}` });
  };

  const exportVisitorLogCSV = () => {
    const headers = ['Badge No', 'Visitor Name', 'Phone', 'Host / Person to Meet', 'Purpose', 'Date', 'Entry Time', 'Exit Time', 'Status'];
    const rows = visitors.map((v) => [
      `"${v.badgeNo}"`,
      `"${v.visitorName}"`,
      `"${v.phone}"`,
      `"${v.personToMeet}"`,
      `"${v.purpose}"`,
      `"${v.date}"`,
      `"${v.entryTime}"`,
      `"${v.exitTime || 'On Campus'}"`,
      `"${v.status}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`SCHLAR_Visitor_Register_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  const exportAppointmentsCSV = () => {
    const headers = ['ID', 'Visitor / Parent', 'Student', 'Host Faculty / Staff', 'Date', 'Time Slot', 'Purpose', 'Status', 'Phone'];
    const rows = appointmentList.map((a) => [
      `"${a.id}"`,
      `"${a.parentName}"`,
      `"${a.studentName}"`,
      `"${a.meetWith} (${a.role})"`,
      `"${a.date}"`,
      `"${a.time}"`,
      `"${a.purpose}"`,
      `"${a.status}"`,
      `"${a.visitorPhone || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`SCHLAR_Appointments_Report_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  const exportEnquiriesCSV = () => {
    const headers = ['ID', 'Parent Name', 'Student Name', 'Target Grade', 'Contact Number', 'Source', 'Status', 'Date Recorded', 'Notes'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${e.parentName}"`,
      `"${e.studentName}"`,
      `"${e.grade}"`,
      `"${e.contact}"`,
      `"${e.source}"`,
      `"${e.status}"`,
      `"${e.date}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`SCHLAR_Admission_Enquiries_Pipeline_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
  };

  // Filtered lists
  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const q = visitorSearch.toLowerCase();
      const matchSearch =
        v.visitorName.toLowerCase().includes(q) ||
        v.badgeNo.toLowerCase().includes(q) ||
        v.personToMeet.toLowerCase().includes(q) ||
        v.purpose.toLowerCase().includes(q) ||
        (v.phone && v.phone.includes(q));
      const matchFilter = visitorFilter === 'all' || v.status === visitorFilter;
      return matchSearch && matchFilter;
    });
  }, [visitors, visitorSearch, visitorFilter]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const q = enquirySearch.toLowerCase();
      const matchSearch =
        e.parentName.toLowerCase().includes(q) ||
        e.studentName.toLowerCase().includes(q) ||
        e.contact.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q);
      const matchStatus = enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
      const matchSource = enquirySourceFilter === 'all' || e.source === enquirySourceFilter;
      return matchSearch && matchStatus && matchSource;
    });
  }, [enquiries, enquirySearch, enquiryStatusFilter, enquirySourceFilter]);

  const filteredAppointments = useMemo(() => {
    return appointmentList.filter((a) => {
      const q = appointmentSearch.toLowerCase();
      const matchSearch =
        a.parentName.toLowerCase().includes(q) ||
        a.studentName.toLowerCase().includes(q) ||
        a.meetWith.toLowerCase().includes(q) ||
        a.purpose.toLowerCase().includes(q);
      const matchStatus = appointmentStatusFilter === 'all' || a.status === appointmentStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [appointmentList, appointmentSearch, appointmentStatusFilter]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = studentSearch.toLowerCase();
      const matchSearch =
        s.name.toLowerCase().includes(q) ||
        s.admissionId.toLowerCase().includes(q) ||
        s.parentName.toLowerCase().includes(q) ||
        s.parentPhone.toLowerCase().includes(q) ||
        (s.emergencyContact && s.emergencyContact.toLowerCase().includes(q));
      const matchClass = studentClassFilter === 'all' || s.classId === studentClassFilter;
      return matchSearch && matchClass;
    });
  }, [students, studentSearch, studentClassFilter]);

  const filteredStaff = useMemo(() => {
    const combined = [
      ...teachers.map((t) => ({
        id: t.id,
        name: t.name,
        role: t.roleTitle || 'Faculty Member',
        department: t.department,
        email: t.email,
        phone: t.phone,
        location: t.room || 'Faculty Room',
        type: 'Teacher'
      })),
      ...staff.map((s) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        department: s.department,
        email: s.email,
        phone: s.phone,
        location: s.address || 'Admin Block',
        type: 'Staff'
      }))
    ];

    return combined.filter((m) => {
      const q = staffSearch.toLowerCase();
      const dept = m.department || '';
      const matchSearch =
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        dept.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);
      const matchDept = staffDeptFilter === 'all' || dept === staffDeptFilter;
      return matchSearch && matchDept;
    });
  }, [teachers, staff, staffSearch, staffDeptFilter]);

  const staffDepartments = useMemo(() => {
    const depts = new Set<string>();
    teachers.forEach((t) => {
      if (t.department) depts.add(t.department);
    });
    staff.forEach((s) => {
      if (s.department) depts.add(s.department);
    });
    return Array.from(depts);
  }, [teachers, staff]);

  const filteredSchoolContacts = useMemo(() => {
    const q = schoolContactSearch.toLowerCase();
    return SCHOOL_CONTACTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.leadPerson.toLowerCase().includes(q) ||
        c.extension.toLowerCase().includes(q)
    );
  }, [schoolContactSearch]);

  const filteredCommunications = useMemo(() => {
    return communications.filter((c) => {
      const q = commSearch.toLowerCase();
      const matchSearch =
        c.contactPerson.toLowerCase().includes(q) ||
        c.contactNumber.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        (c.regardingStudent && c.regardingStudent.toLowerCase().includes(q));
      const matchType = commTypeFilter === 'all' || c.type === commTypeFilter;
      const matchStatus = commStatusFilter === 'all' || c.status === commStatusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [communications, commSearch, commTypeFilter, commStatusFilter]);

  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      const q = noticeSearch.toLowerCase();
      const matchSearch =
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q);
      const matchCategory = noticeCategoryFilter === 'all' || n.category === noticeCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [notices, noticeSearch, noticeCategoryFilter]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Sidebar Navigation */}
      <RoleSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* ============================================================== */}
        {/* 1. DASHBOARD                                                   */}
        {/* ============================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Reception Desk
                  </span>
                  <span className="text-xs text-slate-400">· Main Gatehouse & Front Lobby</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  Front Office & Reception Desk
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time visitor badge tracking, scheduled parent consultations, and prospective student admissions.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('checkin');
                    setCheckinSubTab('form');
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-90 rounded-xl shadow-xs transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Check In Visitor</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('appointments');
                    setShowAppointmentModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>New Appointment</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('enquiries');
                    setShowEnquiryModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>New Enquiry</span>
                </button>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Visitors on Campus</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-slate-900">{checkedInVisitorsCount}</span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Expected Today</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-slate-900">{expectedVisitorsCount || 3}</span>
                    <span className="text-[11px] text-slate-400">Pre-registered</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Appointments Today</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-slate-900">{scheduledAppointmentsCount}</span>
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Scheduled</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-500">Pending Enquiries</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold font-mono text-slate-900">{newEnquiriesCount}</span>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Action Req.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Grid: Live Visitors & Today's Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Visitors Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-900">Current Visitors on Campus</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('visitors')}
                    className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    <span>View Register</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-3 text-xs">
                  {visitors.filter((v) => v.status === 'Checked In').length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No active visitors checked in at this moment.</p>
                    </div>
                  ) : (
                    visitors
                      .filter((v) => v.status === 'Checked In')
                      .map((v) => (
                        <div key={v.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{v.visitorName}</span>
                              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                                {v.badgeNo}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Host: <span className="text-slate-800 font-medium">{v.personToMeet}</span> · In: {v.entryTime}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">{v.purpose}</p>
                          </div>
                          <button
                            onClick={() => handleFastCheckOut(v.id, v.visitorName)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold shrink-0 transition-colors"
                          >
                            Check Out
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Today's Appointments Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Upcoming Appointments</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    <span>All Appointments</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100 mt-3 text-xs">
                  {appointmentList.slice(0, 4).map((apt) => (
                    <div key={apt.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{apt.parentName}</span>
                          <span className="text-[10px] text-slate-400">for {apt.studentName}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Host: <span className="font-medium text-slate-800">{apt.meetWith}</span> ({apt.role})
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">{apt.time} · {apt.date}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          apt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : apt.status === 'No-show'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Desk Communications Bar */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-purple-300 font-semibold tracking-wider uppercase block">
                  Front Office Communication Desk
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">Need to log an incoming phone call or visitor walk-in?</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Maintain the verified audit trail of front office communications, parents inquiries, and courier drops.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveTab('communication_log');
                  setShowCommModal(true);
                }}
                className="px-4 py-2 bg-theme-primary text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 shrink-0 transition-opacity"
              >
                Log Communication
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. VISITOR REGISTER                                           */}
        {/* ============================================================== */}
        {activeTab === 'visitors' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Visitor Register</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full searchable ledger of parent visitors, guest faculty, contractors, and institutional deliveries.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportVisitorLogCSV}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Register CSV</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('checkin');
                    setCheckinSubTab('form');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Check In New Visitor</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search visitor, badge #, host or purpose..."
                  value={visitorSearch}
                  onChange={(e) => setVisitorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={visitorFilter}
                  onChange={(e) => setVisitorFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Visitors ({visitors.length})</option>
                  <option value="Checked In">Checked In ({checkedInVisitorsCount})</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Expected">Expected Pre-registered</option>
                </select>
              </div>
            </div>

            {/* Visitors Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Badge No</th>
                      <th className="py-3 px-4">Visitor Name</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Host / Department</th>
                      <th className="py-3 px-4">Purpose</th>
                      <th className="py-3 px-4">Check-In</th>
                      <th className="py-3 px-4">Check-Out</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-10 text-center text-slate-400">
                          No visitors match your search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                              {v.badgeNo}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{v.visitorName}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{v.phone}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">{v.personToMeet}</td>
                          <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{v.purpose}</td>
                          <td className="py-3 px-4 font-mono text-slate-700">{v.entryTime}</td>
                          <td className="py-3 px-4 font-mono text-slate-700">{v.exitTime || '—'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                v.status === 'Checked In'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : v.status === 'Expected'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {v.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedBadgeVisitor(v)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                                title="View / Print Badge Pass"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              {v.status === 'Checked In' && (
                                <button
                                  onClick={() => handleFastCheckOut(v.id, v.visitorName)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
                                >
                                  Check Out
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. VISITOR CHECK-IN / CHECK-OUT WORKFLOW                      */}
        {/* ============================================================== */}
        {activeTab === 'checkin' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Visitor Check-In & Security Pass Desk</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arrival identity verification, instant badge creation, and expedited departure clearance.
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start">
                <button
                  onClick={() => setCheckinSubTab('form')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    checkinSubTab === 'form' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Arrival Check-In
                </button>
                <button
                  onClick={() => setCheckinSubTab('fast_checkout')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    checkinSubTab === 'fast_checkout' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Expedited Check-Out ({checkedInVisitorsCount})
                </button>
              </div>
            </div>

            {checkinSubTab === 'form' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Issue New Visitor Security Pass</h3>
                      <p className="text-xs text-slate-500">Record visitor details before allowing entry into campus gates.</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-mono font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{visitorForm.badgeNo}</span>
                    </div>
                  </div>

                  <form onSubmit={handleVisitorCheckInSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Visitor Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={visitorForm.visitorName}
                          onChange={(e) => setVisitorForm({ ...visitorForm, visitorName: e.target.value })}
                          placeholder="e.g. Mr. Arvind Khanna"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Contact Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={visitorForm.phone}
                          onChange={(e) => setVisitorForm({ ...visitorForm, phone: e.target.value })}
                          placeholder="e.g. +1 (555) 712-4091"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Organization / Firm (if applicable)
                        </label>
                        <input
                          type="text"
                          value={visitorForm.organization}
                          onChange={(e) => setVisitorForm({ ...visitorForm, organization: e.target.value })}
                          placeholder="e.g. Parent of Student, Cambridge Press, EduLogistics"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Person / Department to Meet <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={visitorForm.personToMeet}
                          onChange={(e) => setVisitorForm({ ...visitorForm, personToMeet: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                        >
                          <option value="Mrs. Evelyn Hayes (Vice Principal)">Mrs. Evelyn Hayes (Vice Principal)</option>
                          <option value="Dr. Arthur Campbell (Principal Office)">Dr. Arthur Campbell (Principal Office)</option>
                          <option value="Kavita Chawla (Admissions & Front Desk)">Kavita Chawla (Admissions & Front Desk)</option>
                          <option value="Dr. Vikram Sharma (Head of Mathematics)">Dr. Vikram Sharma (Head of Mathematics)</option>
                          <option value="Ms. Sunita Rao (Science Department)">Ms. Sunita Rao (Science Department)</option>
                          <option value="Nandini Krishnan (Central Library)">Nandini Krishnan (Central Library)</option>
                          <option value="Alok Saxena (Accounts & Finance)">Alok Saxena (Accounts & Finance)</option>
                          <option value="Dr. Marcus Brody (Academic Examination Board)">Dr. Marcus Brody (Academic Examination Board)</option>
                          <option value="Harish Rawat (Transport Desk)">Harish Rawat (Transport Desk)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose of Visit</label>
                        <select
                          value={visitorForm.purpose}
                          onChange={(e) => setVisitorForm({ ...visitorForm, purpose: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                        >
                          <option value="Parent-Teacher Meeting">Parent-Teacher Meeting</option>
                          <option value="Prospective Admission Inquiry">Prospective Admission Inquiry</option>
                          <option value="Fee Payment / Accounts Inquiry">Fee Payment / Accounts Inquiry</option>
                          <option value="Vendor / Delivery / Dispatch">Vendor / Delivery / Dispatch</option>
                          <option value="Official Institutional Meeting">Official Institutional Meeting</option>
                          <option value="Maintenance / IT Support">Maintenance / IT Support</option>
                          <option value="Campus Tour">Campus Tour</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle No. (if parked)</label>
                        <input
                          type="text"
                          value={visitorForm.vehicleNo}
                          onChange={(e) => setVisitorForm({ ...visitorForm, vehicleNo: e.target.value })}
                          placeholder="e.g. NY-782-XYZ"
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Duration</label>
                        <select
                          value={visitorForm.expectedDuration}
                          onChange={(e) => setVisitorForm({ ...visitorForm, expectedDuration: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                        >
                          <option value="30 mins">30 mins</option>
                          <option value="45 mins">45 mins</option>
                          <option value="1 hour">1 hour</option>
                          <option value="2 hours">2 hours</option>
                          <option value="Half Day (4 hours)">Half Day (4 hours)</option>
                          <option value="Full Day">Full Day</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Internal Front Desk Remarks</label>
                      <input
                        type="text"
                        value={visitorForm.notes}
                        onChange={(e) => setVisitorForm({ ...visitorForm, notes: e.target.value })}
                        placeholder="Additional front office observations, baggage, escort details..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                      />
                    </div>

                    {/* Checkbox verification */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="idVerified"
                        checked={visitorForm.idVerified}
                        onChange={(e) => setVisitorForm({ ...visitorForm, idVerified: e.target.checked })}
                        className="rounded border-slate-300 text-theme-primary focus:ring-theme-primary"
                      />
                      <label htmlFor="idVerified" className="text-xs text-slate-700 font-medium cursor-pointer">
                        Government Photo ID (Driver's License / Passport / National ID) verified at front desk
                      </label>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Check-in records official arrival timestamp and generates printable pass badge.
                      </span>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 py-2.5 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Issue Pass & Check In</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Real-Time Live Badge Preview */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Badge Preview</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Format: ID-1</span>
                    </div>

                    {/* Badge Card Mockup */}
                    <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
                            SC
                          </div>
                          <span className="font-bold text-xs">GREENFIELD INT.</span>
                        </div>
                        <span className="font-mono text-xs font-extrabold text-theme-primary">{visitorForm.badgeNo}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                          {visitorForm.visitorName ? visitorForm.visitorName.charAt(0) : 'V'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-slate-900 truncate">
                            {visitorForm.visitorName || 'Visitor Name'}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {visitorForm.organization || 'Guest / Parent'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                        <div className="flex justify-between text-slate-500">
                          <span>Host:</span>
                          <span className="font-medium text-slate-800 text-right truncate ml-2">
                            {visitorForm.personToMeet.split('(')[0]}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Purpose:</span>
                          <span className="font-medium text-slate-800 text-right truncate ml-2">
                            {visitorForm.purpose}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Valid Today:</span>
                          <span className="font-mono font-medium text-slate-800">Until 05:00 PM</span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>SECURITY LEVEL: VISITOR</span>
                        <span>CAMPUS ZONE A</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-[11px] text-slate-400">
                      Printable pass thermal sticker format. Automatically archived on departure.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Expedited Check-out table */
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Active Visitors Departure Desk</h3>
                    <p className="text-xs text-slate-500">
                      Check out visitors who are departing campus. System records departure timestamp.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-theme-primary bg-theme-light px-3 py-1 rounded-full">
                    {checkedInVisitorsCount} Active Passes
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {visitors.filter((v) => v.status === 'Checked In').length === 0 ? (
                    <div className="py-12 text-center text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p>All visitors have checked out. No active passes on campus.</p>
                    </div>
                  ) : (
                    visitors
                      .filter((v) => v.status === 'Checked In')
                      .map((v) => (
                        <div key={v.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{v.visitorName}</span>
                              <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                                {v.badgeNo}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">{v.phone}</span>
                            </div>
                            <p className="text-slate-600">
                              Host: <span className="font-semibold text-slate-800">{v.personToMeet}</span> · Purpose: {v.purpose}
                            </p>
                            <p className="text-slate-400 text-[11px] font-mono">
                              Check-In: <strong>{v.entryTime}</strong> on {v.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedBadgeVisitor(v)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                            >
                              View Badge
                            </button>
                            <button
                              onClick={() => handleFastCheckOut(v.id, v.visitorName)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Complete Check Out</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. APPOINTMENTS                                                */}
        {/* ============================================================== */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scheduled Appointments</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Book and track parent-teacher conferences, principal briefings, and administrative meetings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportAppointmentsCSV}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Appointments CSV</span>
                </button>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Appointment</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search visitor, host or student..."
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={appointmentStatusFilter}
                  onChange={(e) => setAppointmentStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Appointments ({appointmentList.length})</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-show">No-show</option>
                </select>
              </div>
            </div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAppointments.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No appointments match the selected filter.</p>
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            apt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : apt.status === 'No-show'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {apt.status}
                        </span>
                        <span className="font-mono text-xs font-semibold text-slate-500">{apt.date}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm">{apt.parentName}</h3>
                      <p className="text-xs text-slate-500 mb-2">Student: <span className="font-semibold text-slate-700">{apt.studentName}</span></p>

                      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600 mb-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Host:</span>
                          <span className="font-semibold text-slate-800">{apt.meetWith}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Role:</span>
                          <span>{apt.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Time:</span>
                          <span className="font-mono font-medium text-slate-800">{apt.time}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 italic mb-3">
                        "{apt.purpose}"
                      </p>
                    </div>

                    {/* Status Toggles */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                      <span className="text-[11px] text-slate-400 font-medium">Update Status:</span>
                      <div className="flex items-center gap-1">
                        {apt.status !== 'Completed' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'Completed')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {apt.status !== 'No-show' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'No-show')}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded text-[11px] font-bold transition-colors"
                          >
                            No-show
                          </button>
                        )}
                        {apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => handleUpdateAppointmentStatus(apt.id, 'Cancelled')}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. GENERAL ENQUIRIES                                           */}
        {/* ============================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">General Enquiries Pipeline</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track visitor queries across Phone, Walk-in, Website, and Referral channels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportEnquiriesCSV}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Enquiries CSV</span>
                </button>
                <button
                  onClick={() => setShowEnquiryModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Inquiry</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by parent, student or notes..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
                <select
                  value={enquirySourceFilter}
                  onChange={(e) => setEnquirySourceFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Sources</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Website">Website</option>
                  <option value="Phone">Phone</option>
                  <option value="Referral">Referral</option>
                </select>

                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Stages</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Parent / Contact</th>
                      <th className="py-3 px-4">Prospective Student</th>
                      <th className="py-3 px-4">Target Grade</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Pipeline Stage</th>
                      <th className="py-3 px-4">Notes & Observations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          No enquiries found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{e.parentName}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{e.studentName}</td>
                          <td className="py-3 px-4">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium">
                              {e.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{e.contact}</td>
                          <td className="py-3 px-4 text-slate-600">{e.source}</td>
                          <td className="py-3 px-4">
                            <select
                              value={e.status}
                              onChange={(ev) => updateEnquiryStatus(e.id, ev.target.value as any)}
                              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Follow-up">Follow-up</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-sm truncate">{e.notes}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. ADMISSIONS ENQUIRY TRACKING                                */}
        {/* ============================================================== */}
        {activeTab === 'admissions_enquiry' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admissions Pipeline & Lead Tracking</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage prospective student application stages and follow-up schedules.
                </p>
              </div>

              <button
                onClick={() => setShowEnquiryModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Prospective Lead</span>
              </button>
            </div>

            {/* Strict Role Policy Notice Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block">Admissions Boundary Guard:</span>
                Recording a prospective admission inquiry does <strong>NOT</strong> enroll a student. Official admission confirmation, student ID allocation, and enrollment onboarding are performed strictly by the Admissions Directorate and Principal's Office.
              </div>
            </div>

            {/* Funnel Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {[
                { label: 'New Leads', count: enquiries.filter((e) => e.status === 'New').length, color: 'bg-blue-50 text-blue-800 border-blue-200' },
                { label: 'Campus Tour Contacted', count: enquiries.filter((e) => e.status === 'Contacted').length, color: 'bg-purple-50 text-purple-800 border-purple-200' },
                { label: 'Under Review / Follow-up', count: enquiries.filter((e) => e.status === 'Follow-up').length, color: 'bg-amber-50 text-amber-800 border-amber-200' },
                { label: 'Converted to Applicant', count: enquiries.filter((e) => e.status === 'Converted').length, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
              ].map((funnel, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${funnel.color} shadow-xs`}>
                  <span className="text-xs font-semibold block">{funnel.label}</span>
                  <span className="text-2xl font-bold font-mono mt-1 block">{funnel.count}</span>
                  <span className="text-[11px] opacity-75 block mt-0.5">Academic Session 2026-27</span>
                </div>
              ))}
            </div>

            {/* Admissions Pipeline Detailed List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Active Prospective Candidates</h3>
                <span className="text-xs text-slate-400">Total: {enquiries.length} Inquiries</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {enquiries.map((e) => (
                  <div key={e.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{e.studentName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-light text-theme-primary">
                          Applying for {e.grade}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">Via {e.source}</span>
                      </div>
                      <p className="text-slate-500">
                        Parent: <strong>{e.parentName}</strong> · Phone: <span className="font-mono">{e.contact}</span> · Recorded: {e.date}
                      </p>
                      <p className="text-slate-600 text-[11px] italic">Notes: {e.notes}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={e.status}
                        onChange={(ev) => updateEnquiryStatus(e.id, ev.target.value as any)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                      >
                        <option value="New">Stage: New Lead</option>
                        <option value="Contacted">Stage: Campus Tour / Contacted</option>
                        <option value="Follow-up">Stage: Evaluation Review</option>
                        <option value="Converted">Stage: Converted to Applicant</option>
                        <option value="Closed">Stage: Closed / Archived</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. STUDENT & GUARDIAN DIRECTORY (READ-ONLY)                    */}
        {/* ============================================================== */}
        {activeTab === 'student_directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student & Guardian Contact Directory</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Read-only access for parent contact verification, emergency notification, and front desk phone inquiries.
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Read-Only Front Desk Access</span>
              </div>
            </div>

            {/* Read-Only Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block">Front Desk Directory Security Boundary:</span>
                Front office staff may view student placement, parent names, emergency phone numbers, and authorized pickup relations. Modifying student grades, fee ledgers, or enrollment status is strictly restricted.
              </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student, roll #, parent or phone..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Class:</span>
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Classes</option>
                  <option value="class-10a">Grade 10A</option>
                  <option value="class-8a">Grade 8A</option>
                  <option value="class-5b">Grade 5B</option>
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Roll / Admission ID</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Primary Guardian</th>
                      <th className="py-3 px-4">Parent Phone</th>
                      <th className="py-3 px-4">Emergency Contact</th>
                      <th className="py-3 px-4">Residential Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          No students found matching search.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {s.rollNo ? `Roll ${s.rollNo} · ` : ''}{s.admissionId}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {classes.find((c) => c.id === s.classId)?.name || s.classId}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900">{s.parentName}</td>
                          <td className="py-3 px-4 font-mono text-slate-700">{s.parentPhone}</td>
                          <td className="py-3 px-4 font-mono text-slate-700">{s.emergencyContact || s.parentPhone}</td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{s.address}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 8. STAFF DIRECTORY                                            */}
        {/* ============================================================== */}
        {activeTab === 'staff_directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff & Faculty Directory</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official public contact directory for routing visitor calls and scheduling parent meetings.
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Public Institutional Contacts Only</span>
              </div>
            </div>

            {/* Privacy Compliance Banner */}
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-slate-700 text-xs">
              <ShieldCheck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Strict Data Protection Compliance:</span>
                Displays authorized institutional contact information: Faculty & staff names, designations, department extensions, official school emails, and campus room locations. Private HR salaries, banking credentials, and appraisal ratings are strictly excluded.
              </div>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name, role or email..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Department:</span>
                <select
                  value={staffDeptFilter}
                  onChange={(e) => setStaffDeptFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Departments</option>
                  {staffDepartments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{m.name}</h4>
                      <p className="text-xs text-slate-500 truncate">{m.role}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-medium text-slate-800 text-right truncate ml-2">{m.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Room / Cabin:</span>
                      <span className="font-medium text-slate-800">{m.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Phone:</span>
                      <span className="font-mono text-slate-800">{m.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-slate-800 truncate ml-2">{m.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 9. COMMUNICATION LOG                                          */}
        {/* ============================================================== */}
        {activeTab === 'communication_log' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Front Office Communication Log</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official log of front desk telephone calls, parent walk-ins, courier drops, and email inquiries.
                </p>
              </div>

              <button
                onClick={() => setShowCommModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log New Communication</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search caller, number, summary or student..."
                  value={commSearch}
                  onChange={(e) => setCommSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
                <select
                  value={commTypeFilter}
                  onChange={(e) => setCommTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Channels</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Front Desk Walk-in">Front Desk Walk-in</option>
                  <option value="Email Inquiry">Email Inquiry</option>
                </select>

                <select
                  value={commStatusFilter}
                  onChange={(e) => setCommStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                </select>
              </div>
            </div>

            {/* Communication Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-3 px-4">Time & Date</th>
                      <th className="py-3 px-4">Channel</th>
                      <th className="py-3 px-4">Caller / Contact Person</th>
                      <th className="py-3 px-4">Phone / Email</th>
                      <th className="py-3 px-4">Regarding Student</th>
                      <th className="py-3 px-4">Summary & Notes</th>
                      <th className="py-3 px-4">Handled By</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCommunications.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-slate-400">
                          No communication entries match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredCommunications.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">{c.timestamp}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800">{c.type}</span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{c.contactPerson}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{c.contactNumber}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">{c.regardingStudent || '—'}</td>
                          <td className="py-3 px-4 text-slate-600 max-w-sm">{c.summary}</td>
                          <td className="py-3 px-4 text-slate-700">{c.handledBy}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.status === 'Resolved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 10. SCHOOL CONTACT DIRECTORY                                   */}
        {/* ============================================================== */}
        {activeTab === 'school_directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Administrative Extensions</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct telephone extensions and office locations for key departments, security desks, and emergency centers.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search department, room or lead..."
                  value={schoolContactSearch}
                  onChange={(e) => setSchoolContactSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary shadow-xs"
                />
              </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchoolContacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{c.department}</span>
                      <h3 className="font-bold text-slate-900 text-sm mt-0.5">{c.name}</h3>
                    </div>
                    <span className="font-mono font-bold text-xs bg-theme-light text-theme-primary px-2.5 py-1 rounded-lg">
                      {c.extension}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Officer: <strong>{c.leadPerson}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-800">{c.directPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-800 truncate">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{c.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 11. NOTICES & EVENTS                                           */}
        {/* ============================================================== */}
        {activeTab === 'notices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Circulars & School Notices</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official circulars, sports schedules, and academic conferences for front desk parent enquiries.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notices..."
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary shadow-xs"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'School', 'Exam', 'Event', 'Important'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNoticeCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    noticeCategoryFilter === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'all' ? 'All Circulars' : cat}
                </button>
              ))}
            </div>

            {/* Notices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNotice(n)}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          n.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : n.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {n.priority} · {n.category}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{n.date}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{n.content}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Issued By: <strong className="text-slate-700">{n.author}</strong></span>
                    <span className="text-theme-primary font-semibold flex items-center gap-1">
                      Read Circular <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 12. FRONT OFFICE REPORTS & CSV EXPORT                          */}
        {/* ============================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Front Office Analytics & CSV Reports</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Export structured visitor registers, appointment schedules, and admissions pipelines for compliance audits.
                </p>
              </div>
            </div>

            {/* Quick Export Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Campus Visitor Register Report</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete security log of all visitors, entry and departure timestamps, badge codes, host departments, and visitor contacts.
                  </p>
                  <div className="mt-3 text-xs text-slate-400 font-mono">
                    Includes {visitors.length} records · Verified format
                  </div>
                </div>
                <button
                  onClick={exportVisitorLogCSV}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-theme-primary text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Visitor Log CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Appointments Schedule Report</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Full manifest of scheduled, completed, and cancelled parent-teacher consultations and administrative briefings.
                  </p>
                  <div className="mt-3 text-xs text-slate-400 font-mono">
                    Includes {appointmentList.length} records
                  </div>
                </div>
                <button
                  onClick={exportAppointmentsCSV}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-black transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Appointments CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Admissions Pipeline Report</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Summary of prospective student enquiries, marketing referral channels, conversion stages, and counseling notes.
                  </p>
                  <div className="mt-3 text-xs text-slate-400 font-mono">
                    Includes {enquiries.length} prospective leads
                  </div>
                </div>
                <button
                  onClick={exportEnquiriesCSV}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-black transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Enquiries CSV</span>
                </button>
              </div>
            </div>

            {/* Front Desk Operating Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Front Desk Operational Key Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500">Average Daily Campus Footfall</span>
                  <span className="text-xl font-bold font-mono text-slate-900 block">18 Visitors / Day</span>
                  <span className="text-[11px] text-emerald-600 font-medium">98.4% On-time departure logging</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500">Appointment Fulfillment Rate</span>
                  <span className="text-xl font-bold font-mono text-slate-900 block">92.0%</span>
                  <span className="text-[11px] text-slate-400">8.0% No-show or rescheduled</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-500">Admissions Inquiry Conversion</span>
                  <span className="text-xl font-bold font-mono text-slate-900 block">33.3% Converted</span>
                  <span className="text-[11px] text-blue-600 font-medium">Stage: Application review</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 13. MY PROFILE                                                 */}
        {/* ============================================================== */}
        {activeTab === 'profile' && (
          <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />
        )}

        {/* Backward Compatibility: Gate Movements */}
        {activeTab === 'gate_movements' && (
          <AttendanceOperationsWorkspace defaultTab="movement" />
        )}
      </main>

      {/* ============================================================== */}
      {/* MODALS                                                         */}
      {/* ============================================================== */}

      {/* 1. VISITOR BADGE PRINT PREVIEW MODAL */}
      {selectedBadgeVisitor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedBadgeVisitor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b border-slate-100">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Security Gate Pass</span>
              <h3 className="text-lg font-extrabold text-slate-900">Greenfield International</h3>
              <p className="text-[11px] text-slate-500">Campus Visitor Security Verification</p>
            </div>

            <div className="p-4 rounded-xl border-2 border-slate-800 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">PASS ID</span>
                <span className="font-mono font-extrabold text-base text-theme-primary">{selectedBadgeVisitor.badgeNo}</span>
              </div>

              <div className="text-center py-2">
                <div className="w-16 h-16 rounded-full bg-slate-300 mx-auto mb-2 flex items-center justify-center text-xl font-bold text-slate-600">
                  {selectedBadgeVisitor.visitorName.charAt(0)}
                </div>
                <h4 className="font-extrabold text-base text-slate-900">{selectedBadgeVisitor.visitorName}</h4>
                <p className="text-xs text-slate-500">{selectedBadgeVisitor.phone}</p>
              </div>

              <div className="space-y-1 text-xs border-t border-slate-200 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Host Person:</span>
                  <span className="font-bold text-slate-800">{selectedBadgeVisitor.personToMeet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Purpose:</span>
                  <span className="font-medium text-slate-800">{selectedBadgeVisitor.purpose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Entry Time:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedBadgeVisitor.entryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-mono text-slate-800">{selectedBadgeVisitor.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => {
                  addToast({ type: 'info', title: 'Printing Badge', message: 'Sending pass to thermal printer...' });
                  setSelectedBadgeVisitor(null);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass Card</span>
              </button>
              <button
                onClick={() => setSelectedBadgeVisitor(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SCHEDULE APPOINTMENT MODAL */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowAppointmentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Schedule Parent / Visitor Meeting</h3>
              <p className="text-xs text-slate-500 mt-0.5">Book an appointment slot with faculty or administrators.</p>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Visitor Name *</label>
                  <input
                    type="text"
                    required
                    value={appointmentForm.parentName}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, parentName: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Name (if applicable)</label>
                  <input
                    type="text"
                    value={appointmentForm.studentName}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, studentName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty / Staff Host *</label>
                  <input
                    type="text"
                    required
                    value={appointmentForm.meetWith}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, meetWith: e.target.value })}
                    placeholder="e.g. Mrs. Evelyn Hayes"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Host Designation</label>
                  <input
                    type="text"
                    value={appointmentForm.role}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, role: e.target.value })}
                    placeholder="e.g. Vice Principal"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    placeholder="e.g. 11:00 AM - 11:30 AM"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Purpose *</label>
                <input
                  type="text"
                  required
                  value={appointmentForm.purpose}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, purpose: e.target.value })}
                  placeholder="e.g. Discuss term academic progress and elective preferences"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visitor Contact Phone</label>
                <input
                  type="text"
                  value={appointmentForm.visitorPhone}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, visitorPhone: e.target.value })}
                  placeholder="e.g. +1 (555) 712-4091"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. NEW ENQUIRY MODAL */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Record Prospective Student Inquiry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Captures parent lead for academic counseling and follow-up.</p>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.parentName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                    placeholder="e.g. Deepak Malhotra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prospective Student Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.studentName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                    placeholder="e.g. Vihaan Malhotra"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Grade Level *</label>
                  <select
                    value={enquiryForm.grade}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11 (Science)">Grade 11 (Science)</option>
                    <option value="Grade 11 (Commerce)">Grade 11 (Commerce)</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={enquiryForm.contact}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, contact: e.target.value })}
                    placeholder="e.g. +1 (555) 942-0192"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inquiry Source</label>
                  <select
                    value={enquiryForm.source}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, source: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Walk-in">Walk-in Visit</option>
                    <option value="Website">Website Portal Form</option>
                    <option value="Phone">Telephone Inquiry</option>
                    <option value="Referral">Family Referral</option>
                    <option value="Social Media">Social Media Campaign</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-up Target Date</label>
                  <input
                    type="date"
                    value={enquiryForm.followUpDate}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes & Requirements</label>
                <textarea
                  rows={3}
                  value={enquiryForm.notes}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
                  placeholder="e.g. Interested in STEM track, robotics club, bus route coverage..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEnquiryModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. LOG COMMUNICATION MODAL */}
      {showCommModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowCommModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Log Front Office Communication</h3>
              <p className="text-xs text-slate-500 mt-0.5">Record an incoming telephone call, walk-in request, or delivery.</p>
            </div>

            <form onSubmit={handleCommSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Communication Channel *</label>
                  <select
                    value={commForm.type}
                    onChange={(e) => setCommForm({ ...commForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Front Desk Walk-in">Front Desk Walk-in</option>
                    <option value="Email Inquiry">Email Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={commForm.status}
                    onChange={(e) => setCommForm({ ...commForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Resolved">Resolved</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Caller / Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={commForm.contactPerson}
                    onChange={(e) => setCommForm({ ...commForm, contactPerson: e.target.value })}
                    placeholder="e.g. Mrs. Sunita Verma"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number / Email</label>
                  <input
                    type="text"
                    value={commForm.contactNumber}
                    onChange={(e) => setCommForm({ ...commForm, contactNumber: e.target.value })}
                    placeholder="e.g. +1 (555) 412-9901"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Regarding Student (optional)</label>
                <input
                  type="text"
                  value={commForm.regardingStudent}
                  onChange={(e) => setCommForm({ ...commForm, regardingStudent: e.target.value })}
                  placeholder="e.g. Kabir Verma (Grade 10A)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discussion Summary & Action Taken *</label>
                <textarea
                  rows={3}
                  required
                  value={commForm.summary}
                  onChange={(e) => setCommForm({ ...commForm, summary: e.target.value })}
                  placeholder="Brief note on topic discussed, inquiry resolved, or action escalated..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCommModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. NOTICE DETAIL MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-slate-400">{selectedNotice.date}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-light text-theme-primary">
                  {selectedNotice.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedNotice.title}</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-3">
              <p>{selectedNotice.content}</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                <span>Target Audience: <strong>{selectedNotice.targetAudience}</strong></span>
                <span>Author: <strong>{selectedNotice.author}</strong></span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
