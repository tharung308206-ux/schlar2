import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { FeeRecord, PaymentReceipt, Notice, Student } from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import { StudentProfileModal } from '../../common/StudentProfileModal';
import {
  LayoutDashboard,
  DollarSign,
  Layers,
  CheckCircle2,
  Clock,
  FileText,
  History,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  X,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  Send,
  AlertTriangle,
  Bell,
  Eye,
  Repeat,
  Award,
  ShieldCheck,
  Check,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  User,
  Trash2
} from 'lucide-react';

// Type definitions for Accountant Workspace specific workflows
interface FeeConcession {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  concessionType: 'Merit Academic Scholarship' | 'Sibling Concession' | 'Need-Based Financial Aid' | 'Staff Child Concession' | 'Sports Excellence Award';
  percentage: number;
  waiverAmount: number;
  reason: string;
  status: 'Approved' | 'Pending Principal Approval';
  appliedDate: string;
  approvedBy?: string;
}

interface FeeRefund {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  refundAmount: number;
  reason: string;
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Counter Cash';
  status: 'Approved' | 'Pending Principal Approval';
  date: string;
  approvedBy?: string;
}

interface SchoolExpense {
  id: string;
  category: 'Laboratory Supplies' | 'Library & Journals' | 'Sports & Activities' | 'Campus Maintenance' | 'Utilities & Electricity' | 'Software & IT Cloud' | 'Office Stationery';
  title: string;
  vendor: string;
  amount: number;
  invoiceNumber: string;
  date: string;
  paymentMethod: 'Bank Transfer' | 'Corporate Card' | 'Cheque';
  status: 'Approved' | 'Pending Bursar Sign-off';
  recordedBy: string;
}

interface FeeStructureItem {
  id: string;
  gradeGroup: string;
  classes: string;
  tuition: number;
  lab: number;
  library: number;
  sports: number;
  exam: number;
  total: number;
  termInstallments: number;
  dueDate: string;
}

export const AccountantView: React.FC = () => {
  const {
    fees,
    setFees,
    payments,
    students,
    notices,
    recordPayment,
    reversePayment,
    setActiveReceipt,
    addToast,
    currentPage,
    setCurrentPage,
    logAuditEvent,
    userProfiles
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>(currentPage || 'dashboard');

  React.useEffect(() => {
    if (currentPage) {
      setActiveTab(currentPage);
    }
  }, [currentPage]);

  // Search & Filter States
  const [feeSearch, setFeeSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [receiptSearch, setReceiptSearch] = useState('');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('all');
  const [duesAgingFilter, setDuesAgingFilter] = useState<'all' | 'week' | '15days' | '30days'>('all');

  // Modals & Selection States
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddConcessionModal, setShowAddConcessionModal] = useState(false);
  const [showAddRefundModal, setShowAddRefundModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddFeeStructureModal, setShowAddFeeStructureModal] = useState(false);
  const [showDuesStatementModal, setShowDuesStatementModal] = useState(false);
  const [reversingPayment, setReversingPayment] = useState<PaymentReceipt | null>(null);
  const [reversalReason, setReversalReason] = useState('');

  // Fee Collection Workflow Form State
  const [paymentForm, setPaymentForm] = useState({
    studentId: 'std-10a-04',
    amount: 3800,
    paymentMethod: 'UPI' as 'Cash' | 'Bank Transfer' | 'UPI' | 'Card',
    referenceNumber: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
    notes: 'Term 1 composite fee payment',
    isAdvancePayment: false
  });
  const [paymentStep, setPaymentStep] = useState<'details' | 'review'>('details');

  // Concessions State
  const [concessions, setConcessions] = useState<FeeConcession[]>([
    {
      id: 'conc-001',
      studentId: 'std-10a-02',
      studentName: 'Sneha Patel',
      className: 'Grade 10 - Section A',
      concessionType: 'Merit Academic Scholarship',
      percentage: 25,
      waiverAmount: 950,
      reason: 'State Level Mathematics Olympiad Gold Medalist. 25% annual tuition waiver approved.',
      status: 'Approved',
      appliedDate: '2026-08-15',
      approvedBy: 'Dr. Arthur Campbell (Principal)'
    },
    {
      id: 'conc-002',
      studentId: 'std-8a-02',
      studentName: 'Zoya Khan',
      className: 'Grade 8 - Section A',
      concessionType: 'Sibling Concession',
      percentage: 10,
      waiverAmount: 380,
      reason: 'Second child enrolled in Greenfield International (Elder sibling in Grade 11).',
      status: 'Approved',
      appliedDate: '2026-08-20',
      approvedBy: 'Alok Saxena (Bursar)'
    },
    {
      id: 'conc-003',
      studentId: 'std-9a-03',
      studentName: 'Rohan Verma',
      className: 'Grade 9 - Section A',
      concessionType: 'Sports Excellence Award',
      percentage: 20,
      waiverAmount: 840,
      reason: 'National Junior Athletics representative (400m sprint). Board sports waiver.',
      status: 'Pending Principal Approval',
      appliedDate: '2026-10-18'
    }
  ]);
  const [concessionForm, setConcessionForm] = useState({
    studentId: '',
    concessionType: 'Merit Academic Scholarship' as FeeConcession['concessionType'],
    percentage: 15,
    reason: ''
  });

  // Refunds State
  const [refunds, setRefunds] = useState<FeeRefund[]>([
    {
      id: 'ref-001',
      studentId: 'std-10a-01',
      studentName: 'Aarav Sharma',
      className: 'Grade 10 - Section A',
      refundAmount: 150,
      reason: 'Overpayment refund for duplicate computer laboratory subscription voucher.',
      paymentMethod: 'Bank Transfer',
      status: 'Approved',
      date: '2026-09-22',
      approvedBy: 'Alok Saxena (Bursar)'
    }
  ]);
  const [refundForm, setRefundForm] = useState({
    studentId: '',
    refundAmount: 100,
    paymentMethod: 'Bank Transfer' as FeeRefund['paymentMethod'],
    reason: ''
  });

  // School Expenses State
  const [expenses, setExpenses] = useState<SchoolExpense[]>([
    {
      id: 'exp-101',
      category: 'Laboratory Supplies',
      title: 'Physics & Chemistry Lab Reagents and Glassware Batch',
      vendor: 'Borosil Scientific Supplies Ltd.',
      amount: 2450,
      invoiceNumber: 'INV-BOR-9921',
      date: '2026-10-12',
      paymentMethod: 'Bank Transfer',
      status: 'Approved',
      recordedBy: 'Alok Saxena'
    },
    {
      id: 'exp-102',
      category: 'Software & IT Cloud',
      title: 'SCHLAR Enterprise Learning Cloud & Server Hosting (Q3)',
      vendor: 'Google Cloud Platform & AI Studio',
      amount: 1850,
      invoiceNumber: 'GCP-OCT-88214',
      date: '2026-10-15',
      paymentMethod: 'Corporate Card',
      status: 'Approved',
      recordedBy: 'Alok Saxena'
    },
    {
      id: 'exp-103',
      category: 'Library & Journals',
      title: 'Annual Encyclopedias & Digital Periodicals Subscription',
      vendor: 'Oxford University Press India',
      amount: 1200,
      invoiceNumber: 'OUP-2026-771',
      date: '2026-10-18',
      paymentMethod: 'Bank Transfer',
      status: 'Approved',
      recordedBy: 'Alok Saxena'
    },
    {
      id: 'exp-104',
      category: 'Campus Maintenance',
      title: 'Sports Field Turf Re-leveling and Drainage Inspection',
      vendor: 'Greenfield Turf Works',
      amount: 980,
      invoiceNumber: 'TURF-8841',
      date: '2026-10-20',
      paymentMethod: 'Cheque',
      status: 'Pending Bursar Sign-off',
      recordedBy: 'Alok Saxena'
    }
  ]);
  const [expenseForm, setExpenseForm] = useState({
    category: 'Laboratory Supplies' as SchoolExpense['category'],
    title: '',
    vendor: '',
    amount: 500,
    invoiceNumber: '',
    paymentMethod: 'Bank Transfer' as SchoolExpense['paymentMethod']
  });

  // Fee Structures State
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>([
    {
      id: 'fs-1',
      gradeGroup: 'Primary Wing (Grades 1 – 5)',
      classes: 'Grade 1, Grade 2, Grade 3, Grade 4, Grade 5',
      tuition: 3000,
      lab: 400,
      library: 200,
      sports: 400,
      exam: 200,
      total: 4200,
      termInstallments: 3,
      dueDate: '10th of Term Month'
    },
    {
      id: 'fs-2',
      gradeGroup: 'Middle School (Grades 6 – 8)',
      classes: 'Grade 6, Grade 7, Grade 8',
      tuition: 3600,
      lab: 600,
      library: 250,
      sports: 500,
      exam: 250,
      total: 5200,
      termInstallments: 3,
      dueDate: '10th of Term Month'
    },
    {
      id: 'fs-3',
      gradeGroup: 'Secondary Wing (Grades 9 – 10)',
      classes: 'Grade 9, Grade 10',
      tuition: 4200,
      lab: 900,
      library: 300,
      sports: 600,
      exam: 400,
      total: 6400,
      termInstallments: 3,
      dueDate: '10th of Term Month'
    },
    {
      id: 'fs-4',
      gradeGroup: 'Senior Secondary (Grades 11 – 12)',
      classes: 'Grade 11, Grade 12 (Science / Commerce / Arts)',
      tuition: 4800,
      lab: 1200,
      library: 400,
      sports: 600,
      exam: 500,
      total: 7500,
      termInstallments: 3,
      dueDate: '10th of Term Month'
    }
  ]);
  const [structureForm, setStructureForm] = useState({
    gradeGroup: '',
    classes: '',
    tuition: 3500,
    lab: 500,
    library: 250,
    sports: 450,
    exam: 300,
    termInstallments: 3,
    dueDate: '10th of Term Month'
  });

  // Settings State
  const [billingSettings, setBillingSettings] = useState({
    academicYear: '2026-2027',
    dueDayOfMonth: 10,
    lateFeePerDay: 5,
    gracePeriodDays: 7,
    bankName: 'National Education Bank (State Clearing House)',
    accountNumber: '**** **** 8821',
    ifscCode: 'NEBN0002194',
    enableUpiGateway: true,
    enableCardProcessing: true
  });

  // KPI Calculations (derived strictly from underlying demo records)
  const totalFees = fees.reduce((sum, f) => sum + f.totalFee, 0);
  const totalCollected = fees.reduce((sum, f) => sum + f.paid, 0);
  const totalPending = fees.reduce((sum, f) => sum + f.pending, 0);
  const overdueFees = fees
    .filter((f) => f.status === 'Overdue')
    .reduce((sum, f) => sum + f.pending, 0);
  const studentsWithDuesCount = fees.filter((f) => f.pending > 0).length;
  const collectionPercentage = Math.round((totalCollected / (totalFees || 1)) * 100);
  const totalExpensesAmount = expenses
    .filter((e) => e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0);

  // Filtered Fees
  const filteredFees = useMemo(() => {
    return fees.filter((f) => {
      const matchesSearch =
        f.studentName.toLowerCase().includes(feeSearch.toLowerCase()) ||
        f.className.toLowerCase().includes(feeSearch.toLowerCase()) ||
        f.studentId.toLowerCase().includes(feeSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [fees, feeSearch, statusFilter]);

  // Filtered Payments / Receipts
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = receiptSearch.toLowerCase();
      return (
        p.studentName.toLowerCase().includes(q) ||
        p.receiptNumber.toLowerCase().includes(q) ||
        p.referenceNumber.toLowerCase().includes(q) ||
        p.studentId.toLowerCase().includes(q)
      );
    });
  }, [payments, receiptSearch]);

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.vendor.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.invoiceNumber.toLowerCase().includes(expenseSearch.toLowerCase());
      const matchesCat = expenseCategoryFilter === 'all' || e.category === expenseCategoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [expenses, expenseSearch, expenseCategoryFilter]);

  // Filtered Outstanding Dues by Aging
  const filteredDues = useMemo(() => {
    return fees
      .filter((f) => f.pending > 0)
      .filter((f) => {
        if (duesAgingFilter === 'all') return true;
        // Calculation based on reference date 2026-10-22
        const dueDate = new Date(f.dueDate);
        const refDate = new Date('2026-10-22');
        const diffDays = Math.ceil((refDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (duesAgingFilter === 'week') return diffDays <= 7 && diffDays >= -7;
        if (duesAgingFilter === '15days') return diffDays > 0 && diffDays <= 15;
        if (duesAgingFilter === '30days') return diffDays > 15;
        return true;
      });
  }, [fees, duesAgingFilter]);

  // Handle Payment Submit (Full Workflow)
  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedFee = fees.find((f) => f.studentId === paymentForm.studentId);
    if (!matchedFee) return;

    if (paymentForm.amount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Payment amount must be greater than zero.'
      });
      return;
    }

    if (paymentForm.amount > matchedFee.pending && !paymentForm.isAdvancePayment) {
      addToast({
        type: 'error',
        title: 'Amount Exceeds Dues',
        message: `Amount ($${paymentForm.amount}) exceeds outstanding balance ($${matchedFee.pending}). Enable advance payment if intended.`
      });
      return;
    }

    // Move to review step if not already reviewed
    if (paymentStep === 'details') {
      setPaymentStep('review');
      return;
    }

    // Execution step
    recordPayment({
      studentId: paymentForm.studentId,
      studentName: matchedFee.studentName,
      amount: Number(paymentForm.amount),
      paymentMethod: paymentForm.paymentMethod,
      referenceNumber: paymentForm.referenceNumber,
      notes: paymentForm.notes
    });

    logAuditEvent({
      actorRole: 'accountant',
      actorName: userProfiles.accountant?.name || 'Alok Saxena',
      action: 'RECORD_FEE_PAYMENT',
      module: 'fees',
      recordRef: paymentForm.studentId,
      status: 'SUCCESS',
      reason: `Collected $${paymentForm.amount} via ${paymentForm.paymentMethod} (Ref: ${paymentForm.referenceNumber || 'N/A'})`
    });

    addToast({
      type: 'success',
      title: 'Payment Recorded Successfully',
      message: `Verified receipt generated for ${matchedFee.studentName} ($${paymentForm.amount}).`
    });

    setShowPaymentModal(false);
    setPaymentStep('details');
  };

  // Reversal / Voiding action
  const handleExecuteReversal = () => {
    if (!reversingPayment || !reversalReason.trim()) return;
    reversePayment(reversingPayment.receiptNumber, reversalReason);
    setReversingPayment(null);
    setReversalReason('');
  };

  // Concession Submit
  const handleAddConcessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === concessionForm.studentId);
    const matchedFee = fees.find((f) => f.studentId === concessionForm.studentId);
    if (!student || !matchedFee) {
      addToast({ type: 'error', title: 'Student Required', message: 'Please select a valid student account.' });
      return;
    }

    const waiver = Math.round((matchedFee.totalFee * concessionForm.percentage) / 100);
    const isHighValue = waiver > 500;

    const newConc: FeeConcession = {
      id: `conc-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      className: matchedFee.className,
      concessionType: concessionForm.concessionType,
      percentage: concessionForm.percentage,
      waiverAmount: waiver,
      reason: concessionForm.reason,
      status: isHighValue ? 'Pending Principal Approval' : 'Approved',
      appliedDate: '2026-10-22',
      approvedBy: isHighValue ? undefined : 'Alok Saxena (Bursar Authorized Delegation)'
    };

    if (!isHighValue) {
      // Apply waiver immutably to fees state
      setFees((prev) =>
        prev.map((f) => {
          if (f.id === matchedFee.id) {
            const newTotal = Math.max(0, f.totalFee - waiver);
            const newPending = Math.max(0, f.pending - waiver);
            const newStatus = newPending === 0 && f.paid > 0 ? 'Paid' : f.status;
            return { ...f, totalFee: newTotal, pending: newPending, status: newStatus };
          }
          return f;
        })
      );
    }

    setConcessions([newConc, ...concessions]);
    setShowAddConcessionModal(false);
    setConcessionForm({ studentId: '', concessionType: 'Merit Academic Scholarship', percentage: 15, reason: '' });

    addToast({
      type: 'success',
      title: isHighValue ? 'Scholarship Forwarded for Sign-off' : 'Concession Applied to Ledger',
      message: isHighValue
        ? `Waiver of $${waiver} submitted to Principal office for endorsement.`
        : `Fee ledger for ${student.name} adjusted by -$${waiver}.00.`
    });
  };

  // Refund Submit
  const handleAddRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === refundForm.studentId);
    const matchedFee = fees.find((f) => f.studentId === refundForm.studentId);
    if (!student || !matchedFee) return;

    const newRef: FeeRefund = {
      id: `ref-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      className: matchedFee.className,
      refundAmount: Number(refundForm.refundAmount),
      paymentMethod: refundForm.paymentMethod,
      reason: refundForm.reason,
      status: 'Approved',
      date: '2026-10-22',
      approvedBy: 'Alok Saxena (Bursar)'
    };

    setRefunds([newRef, ...refunds]);
    setShowAddRefundModal(false);
    setRefundForm({ studentId: '', refundAmount: 100, paymentMethod: 'Bank Transfer', reason: '' });

    addToast({
      type: 'success',
      title: 'Refund Dispatched & Logged',
      message: `Refund remittance of $${refundForm.refundAmount}.00 processed for ${student.name}.`
    });
  };

  // Expense Submit
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || expenseForm.amount <= 0) return;

    const newExp: SchoolExpense = {
      id: `exp-${Date.now()}`,
      category: expenseForm.category,
      title: expenseForm.title,
      vendor: expenseForm.vendor || 'Authorized School Vendor',
      amount: Number(expenseForm.amount),
      invoiceNumber: expenseForm.invoiceNumber || `BILL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: '2026-10-22',
      paymentMethod: expenseForm.paymentMethod,
      status: 'Approved',
      recordedBy: 'Alok Saxena'
    };

    setExpenses([newExp, ...expenses]);
    setShowAddExpenseModal(false);
    setExpenseForm({
      category: 'Laboratory Supplies',
      title: '',
      vendor: '',
      amount: 500,
      invoiceNumber: '',
      paymentMethod: 'Bank Transfer'
    });

    addToast({
      type: 'success',
      title: 'Expense Voucher Booked',
      message: `$${newExp.amount}.00 booked under ${newExp.category}.`
    });
  };

  // Add Fee Structure Submit
  const handleAddFeeStructureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total =
      Number(structureForm.tuition) +
      Number(structureForm.lab) +
      Number(structureForm.library) +
      Number(structureForm.sports) +
      Number(structureForm.exam);

    const newStruct: FeeStructureItem = {
      id: `fs-${Date.now()}`,
      gradeGroup: structureForm.gradeGroup,
      classes: structureForm.classes,
      tuition: Number(structureForm.tuition),
      lab: Number(structureForm.lab),
      library: Number(structureForm.library),
      sports: Number(structureForm.sports),
      exam: Number(structureForm.exam),
      total,
      termInstallments: Number(structureForm.termInstallments),
      dueDate: structureForm.dueDate
    };

    setFeeStructures([...feeStructures, newStruct]);
    setShowAddFeeStructureModal(false);
    addToast({
      type: 'success',
      title: 'Fee Structure Added',
      message: `Annual schedule for ${newStruct.gradeGroup} configured ($${total}/year).`
    });
  };

  // Export CSV Functionality (real data-derived CSV)
  const handleExportCSV = (reportType: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    let filename = `schlar_${reportType}_report_2026.csv`;

    if (reportType === 'collections') {
      csvContent += 'Receipt Number,Student Name,Class,Amount,Payment Method,Reference Number,Date,Cashier\n';
      payments.forEach((p) => {
        csvContent += `"${p.receiptNumber}","${p.studentName}","${p.className}",${p.amount},"${p.paymentMethod}","${p.referenceNumber}","${p.date}","${p.receivedBy}"\n`;
      });
    } else if (reportType === 'dues') {
      csvContent += 'Student Name,Class,Total Fee,Amount Paid,Outstanding Balance,Due Date,Status\n';
      fees
        .filter((f) => f.pending > 0)
        .forEach((f) => {
          csvContent += `"${f.studentName}","${f.className}",${f.totalFee},${f.paid},${f.pending},"${f.dueDate}","${f.status}"\n`;
        });
    } else {
      csvContent += 'Category,Title,Vendor,Amount,Invoice,Date,Status\n';
      expenses.forEach((e) => {
        csvContent += `"${e.category}","${e.title}","${e.vendor}",${e.amount},"${e.invoiceNumber}","${e.date}","${e.status}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Report Exported to CSV',
      message: `${filename} downloaded successfully.`
    });
  };

  const handleSendReminder = (studentName: string, amount: number) => {
    addToast({
      type: 'success',
      title: 'Fee Reminder Dispatched',
      message: `Digital notice for $${amount.toLocaleString()} dispatched to the guardians of ${studentName}.`
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Billing Configuration Saved',
      message: 'Institution fee schedule, penalty rates, and clearing house details updated.'
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
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accounts & Finance Workspace</h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-theme-light text-theme-primary border border-theme-border">
                    Bursar Office
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Tuition collections ledger, student account reconciliation, bank deposits, and expenditure audits.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPaymentStep('details');
                    setShowPaymentModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Fee Payment</span>
                </button>
              </div>
            </div>

            {/* Financial KPIs (Data-derived) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Total Tuition Assessed</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  ${totalFees.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">AY 2026-2027 Roster</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Collected to Date</span>
                <span className="text-2xl font-extrabold text-emerald-800 font-mono mt-1 block">
                  ${totalCollected.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                  {collectionPercentage}% Recovery Rate
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Outstanding Dues</span>
                <span className="text-2xl font-extrabold text-amber-700 font-mono mt-1 block">
                  ${totalPending.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Across {studentsWithDuesCount} student accounts
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-medium text-slate-500 block">Overdue Default Sum</span>
                <span className="text-2xl font-extrabold text-rose-700 font-mono mt-1 block">
                  ${overdueFees.toLocaleString()}
                </span>
                <span className="text-[11px] text-rose-600 font-medium block mt-1">Actionable aging notices</span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Accountant Quick Workflows
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-semibold">
                <button
                  onClick={() => {
                    setPaymentStep('details');
                    setShowPaymentModal(true);
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-theme-primary" />
                  <span>Record Payment</span>
                </button>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-theme-primary" />
                  <span>Find Student</span>
                </button>
                <button
                  onClick={() => setActiveTab('dues')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <Clock className="w-4 h-4 text-theme-primary" />
                  <span>Review Dues</span>
                </button>
                <button
                  onClick={() => setActiveTab('receipts')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <FileText className="w-4 h-4 text-theme-primary" />
                  <span>Open Receipts</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 flex items-center gap-2 justify-center transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-theme-primary" />
                  <span>Finance Reports</span>
                </button>
              </div>
            </div>

            {/* Collections Breakdown by Payment Method */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900">Recent Payment Receipts</h3>
                  <button
                    onClick={() => setActiveTab('receipts')}
                    className="text-xs font-semibold text-theme-primary hover:underline"
                  >
                    View All Receipts →
                  </button>
                </div>

                <div className="space-y-3">
                  {payments.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          $
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{p.studentName}</span>
                            <span className="font-mono text-[10px] text-slate-400 font-bold">{p.receiptNumber}</span>
                          </div>
                          <span className="text-slate-500 text-[11px]">
                            {p.date} · via {p.paymentMethod} ({p.referenceNumber})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-slate-900 text-sm">
                          ${p.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setActiveReceipt(p)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inflow Distribution */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Collection Inflow Channels</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { label: 'UPI Instant Transfers', amount: '$26,100', pct: 58, icon: <Smartphone className="w-4 h-4 text-emerald-600" /> },
                    { label: 'Bank Direct NEFT/Wire', amount: '$13,400', pct: 29, icon: <Building className="w-4 h-4 text-blue-600" /> },
                    { label: 'Credit / Debit Cards', amount: '$4,250', pct: 9, icon: <CreditCard className="w-4 h-4 text-purple-600" /> },
                    { label: 'Cash at Counter', amount: '$1,800', pct: 4, icon: <Banknote className="w-4 h-4 text-amber-600" /> }
                  ].map((ch, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {ch.icon}
                          <span className="font-medium text-slate-800">{ch.label}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-900">{ch.amount}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-theme-primary h-1.5 rounded-full" style={{ width: `${ch.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. FEE STRUCTURE MANAGEMENT ================= */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Fee Structure</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Annual grade-level composite fee schedules, heads, and installment policies for AY 2026-2027.
                </p>
              </div>

              <button
                onClick={() => setShowAddFeeStructureModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Configure New Wing Schedule</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feeStructures.map((grp) => (
                <div key={grp.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{grp.gradeGroup}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{grp.classes}</p>
                    </div>
                    <span className="font-mono font-bold text-theme-primary text-base">
                      ${grp.total.toLocaleString()} / Year
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Tuition & Instructional Fee</span>
                      <span className="font-mono text-slate-900">${grp.tuition.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STEM / Science Laboratory Levy</span>
                      <span className="font-mono text-slate-900">${grp.lab.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Library & Digital Resources</span>
                      <span className="font-mono text-slate-900">${grp.library.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sports, Gymnasium & Activities</span>
                      <span className="font-mono text-slate-900">${grp.sports.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Board Examination & Assessment</span>
                      <span className="font-mono text-slate-900">${grp.exam.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Installments: {grp.termInstallments} Terms</span>
                    <span>Due: {grp.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. STUDENT FEE ACCOUNTS ================= */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Fee Accounts</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Individual student billing balances, partial payments, and overdue accounts.
                </p>
              </div>

              <button
                onClick={() => {
                  setPaymentStep('details');
                  setShowPaymentModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Record Fee Payment</span>
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name, ID or class..."
                  value={feeSearch}
                  onChange={(e) => setFeeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="flex items-center gap-2 self-stretch sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <option value="all">All Accounts ({fees.length})</option>
                  <option value="Paid">Fully Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Fee Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Total Assessed</th>
                    <th className="py-3 px-4">Paid to Date</th>
                    <th className="py-3 px-4">Pending Due</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFees.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const found = students.find(
                              (s) => s.id === f.studentId || s.name.toLowerCase() === f.studentName.toLowerCase()
                            );
                            if (found) setViewingStudent(found);
                          }}
                          className="font-bold text-slate-900 hover:text-theme-primary hover:underline text-left inline-flex items-center gap-1.5"
                          title="View Student Account Ledger & Profile"
                        >
                          <span>{f.studentName}</span>
                          <Eye className="w-3 h-3 text-slate-400" />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-semibold">{f.className}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">${f.totalFee.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">${f.paid.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-700">${f.pending.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{f.dueDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            f.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : f.status === 'Partially Paid'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : f.status === 'Overdue'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const found = students.find(
                                (s) => s.id === f.studentId || s.name.toLowerCase() === f.studentName.toLowerCase()
                              );
                              if (found) setViewingStudent(found);
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="View Student Account Ledger"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {f.pending > 0 ? (
                            <button
                              onClick={() => {
                                setPaymentForm({
                                  studentId: f.studentId,
                                  amount: f.pending,
                                  paymentMethod: 'UPI',
                                  referenceNumber: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
                                  notes: 'Tuition settlement',
                                  isAdvancePayment: false
                                });
                                setPaymentStep('details');
                                setShowPaymentModal(true);
                              }}
                              className="px-3 py-1 bg-theme-primary hover:opacity-95 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                            >
                              Collect Fee
                            </button>
                          ) : (
                            <span className="text-emerald-700 font-medium text-xs">Settled</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 4. FEE COLLECTION (GUIDED WORKFLOW) ================= */}
        {activeTab === 'collection' && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Collection Cashier Desk</h1>
              <p className="text-xs text-slate-500 mt-1">
                Record counter collections, electronic wire transfers, or UPI receipts with verified audit vouchers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Step 1: Select Student & Billing Account
                </span>
                <span className="text-[11px] text-theme-primary font-bold">Standard Clearing</span>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Billing Account</label>
                  <select
                    value={paymentForm.studentId}
                    onChange={(e) => {
                      const matched = fees.find((f) => f.studentId === e.target.value);
                      setPaymentForm({
                        ...paymentForm,
                        studentId: e.target.value,
                        amount: matched ? matched.pending || matched.totalFee : 1000
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  >
                    {fees.map((f) => (
                      <option key={f.id} value={f.studentId}>
                        {f.studentName} ({f.className}) — Balance Due: ${f.pending} (Total: ${f.totalFee})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Summary Banner */}
                {(() => {
                  const curr = fees.find((f) => f.studentId === paymentForm.studentId);
                  if (!curr) return null;
                  return (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Assessed</span>
                        <span className="font-bold text-slate-900 font-mono">${curr.totalFee}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-700 block">Paid to Date</span>
                        <span className="font-bold text-emerald-800 font-mono">${curr.paid}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-700 block">Current Balance</span>
                        <span className="font-bold text-amber-800 font-mono">${curr.pending}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Collection Amount ($)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    >
                      <option value="UPI">UPI Instant (GPay / PhonePe / Paytm)</option>
                      <option value="Bank Transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                      <option value="Card">Debit / Credit Card Terminal</option>
                      <option value="Cash">Cash at Counter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Reference / UTR Number</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.referenceNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Receipt Notes / Voucher Remarks</label>
                  <input
                    type="text"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('fees')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold shadow-xs hover:opacity-95"
                  >
                    Review & Issue Official Receipt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 5. OUTSTANDING DUES ================= */}
        {activeTab === 'dues' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Outstanding Dues & Aging Register</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Tuition defaults, term delinquency tracking, and digital reminder dispatching.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDuesStatementModal(true)}
                  className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Print Dues Statement</span>
                </button>
                <button
                  onClick={() => handleExportCSV('dues')}
                  className="px-3.5 py-2 bg-theme-primary text-white hover:opacity-95 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Dues CSV</span>
                </button>
              </div>
            </div>

            {/* Aging Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'all', label: `All Defaulters (${fees.filter((f) => f.pending > 0).length})` },
                  { id: 'week', label: 'Due This Week' },
                  { id: '15days', label: '1 - 15 Days Overdue' },
                  { id: '30days', label: '30+ Days Overdue' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDuesAgingFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    duesAgingFilter === tab.id
                      ? 'bg-theme-primary text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dues List */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Outstanding Balance</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Days Overdue</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDues.map((f) => {
                    const diffDays = Math.max(
                      0,
                      Math.ceil((new Date('2026-10-22').getTime() - new Date(f.dueDate).getTime()) / (1000 * 60 * 60 * 24))
                    );

                    return (
                      <tr key={f.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{f.studentName}</td>
                        <td className="py-3 px-4 text-slate-600 font-semibold">{f.className}</td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-700 text-sm">
                          ${f.pending.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-500">{f.dueDate}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                          {diffDays > 0 ? `${diffDays} days` : 'On schedule'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.status === 'Overdue'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleSendReminder(f.studentName, f.pending)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3 h-3 text-slate-500" />
                            <span>Dispatch Reminder</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 6. PAYMENT HISTORY & AUDIT LEDGER ================= */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Trail & Transaction History</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Chronological financial ledger, cashier stamps, and verified transaction reversal controls.
                </p>
              </div>

              <button
                onClick={() => handleExportCSV('collections')}
                className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Export Ledger CSV</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4">Cashier</th>
                    <th className="py-3 px-4 text-right">Ledger Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-600">{p.date}</td>
                      <td className="py-3 px-4 font-mono font-bold text-theme-primary">{p.receiptNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.studentName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">${p.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-700">{p.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{p.referenceNumber}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{p.receivedBy}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setReversingPayment(p)}
                          className="text-rose-600 hover:text-rose-800 font-semibold hover:underline"
                        >
                          Reverse Entry
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 7. OFFICIAL RECEIPTS ================= */}
        {activeTab === 'receipts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Official Fee Receipts Register</h1>
                <p className="text-xs text-slate-500 mt-1">Verified receipts issued for bursar accounts and audit records.</p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search receipt #, student, or TXN..."
                  value={receiptSearch}
                  onChange={(e) => setReceiptSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPayments.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-extrabold text-theme-primary bg-theme-light px-2 py-0.5 rounded">
                      {p.receiptNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{p.date}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.studentName}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Class: {p.className}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Amount Paid</span>
                      <span className="text-base font-extrabold text-emerald-800 font-mono">
                        ${p.amount.toLocaleString()}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                      {p.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
                      TXN: {p.referenceNumber}
                    </span>
                    <button
                      onClick={() => setActiveReceipt(p)}
                      className="px-3 py-1.5 bg-theme-primary text-white hover:opacity-95 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. CONCESSIONS & SCHOLARSHIPS ================= */}
        {activeTab === 'concessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Concessions & Scholarships</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Merit scholarships, sibling fee waivers, need-based financial aid, and sports awards.
                </p>
              </div>

              <button
                onClick={() => setShowAddConcessionModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Apply Concession Voucher</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Waiver Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {concessions.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.studentName}</td>
                      <td className="py-3 px-4 text-slate-600">{c.className}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{c.concessionType}</td>
                      <td className="py-3 px-4 font-mono font-bold text-theme-primary">{c.percentage}%</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">${c.waiverAmount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{c.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 9. REFUNDS & ADJUSTMENTS ================= */}
        {activeTab === 'refunds' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Fee Refunds & Ledger Adjustments</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Processed student deposit refunds, duplicate collection returns, and debit/credit adjustments.
                </p>
              </div>

              <button
                onClick={() => setShowAddRefundModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Process New Refund</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Refund Amount</th>
                    <th className="py-3 px-4">Remittance Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {refunds.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-600">{r.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{r.studentName}</td>
                      <td className="py-3 px-4 text-slate-600">{r.className}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-700">${r.refundAmount}</td>
                      <td className="py-3 px-4 text-slate-700">{r.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 10. EXPENSES ================= */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campus Operating Expenses</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Institutional expenditures, laboratory consumables, facilities maintenance, and utilities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddExpenseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Expense Voucher</span>
                </button>
              </div>
            </div>

            {/* Expense KPI summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Total Approved Expenditure</span>
                <span className="text-2xl font-extrabold text-slate-900 font-mono mt-1 block">
                  ${totalExpensesAmount.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Q3 Operating Period</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Vouchers Recorded</span>
                <span className="text-2xl font-extrabold text-theme-primary font-mono mt-1 block">
                  {expenses.length} Bills
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Audited invoices</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs text-slate-500 block">Pending Sign-off</span>
                <span className="text-2xl font-extrabold text-amber-700 font-mono mt-1 block">
                  ${expenses.filter((e) => e.status !== 'Approved').reduce((s, e) => s + e.amount, 0)}
                </span>
                <span className="text-[11px] text-amber-600 mt-0.5 block">1 invoice awaiting review</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search expense, vendor, or invoice..."
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="all">All Categories</option>
                <option value="Laboratory Supplies">Laboratory Supplies</option>
                <option value="Library & Journals">Library & Journals</option>
                <option value="Sports & Activities">Sports & Activities</option>
                <option value="Campus Maintenance">Campus Maintenance</option>
                <option value="Utilities & Electricity">Utilities & Electricity</option>
                <option value="Software & IT Cloud">Software & IT Cloud</option>
              </select>
            </div>

            {/* Expenses Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Voucher Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-600">{exp.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{exp.title}</td>
                      <td className="py-3 px-4 text-slate-700">{exp.category}</td>
                      <td className="py-3 px-4 text-slate-600">{exp.vendor}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">${exp.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{exp.invoiceNumber}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            exp.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 11. FINANCE REPORTS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bursar Financial Statements & Reports</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Variance audits, recovery curves, class efficiency, and CSV export.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV('collections')}
                  className="px-3.5 py-2 bg-theme-primary text-white hover:opacity-95 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete CSV</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Collection Recovery by Division */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Collection Recovery by Division</h3>
                <div className="space-y-3 text-xs">
                  {[
                    { division: 'Grade 10 (Secondary Board)', collected: 13500, total: 15600, pct: 86 },
                    { division: 'Grade 9 (Secondary)', collected: 11200, total: 13800, pct: 81 },
                    { division: 'Grade 8 (Middle Wing)', collected: 9600, total: 10400, pct: 92 },
                    { division: 'Grade 5 (Primary Wing)', collected: 8100, total: 8400, pct: 96 }
                  ].map((div, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-800">{div.division}</span>
                        <span className="font-mono text-slate-500">
                          ${div.collected.toLocaleString()} / ${div.total.toLocaleString()} ({div.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-theme-primary h-2 rounded-full" style={{ width: `${div.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Annual Audit Variance Status */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Annual Audit Variance Status</h3>
                <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Reconciled Deposits:</span>
                    <span className="font-mono font-bold text-emerald-800">${totalCollected.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Uncleared Drafts:</span>
                    <span className="font-mono font-bold text-slate-800">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Operating Expenses Outflow:</span>
                    <span className="font-mono font-bold text-slate-900">${totalExpensesAmount.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-700 font-bold">Net Institution Cash Balance:</span>
                    <span className="font-mono font-extrabold text-emerald-800 text-sm">
                      ${(totalCollected - totalExpensesAmount).toLocaleString()}.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 12. SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tuition & Billing Configuration</h1>
              <p className="text-xs text-slate-500 mt-1">
                Configure penalty rates, payment gateway integrations, and bank settlement details.
              </p>
            </div>

            <form
              onSubmit={handleSaveSettings}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Active Academic Term</label>
                  <input
                    type="text"
                    value={billingSettings.academicYear}
                    onChange={(e) => setBillingSettings({ ...billingSettings, academicYear: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fee Due Day of Month</label>
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={billingSettings.dueDayOfMonth}
                    onChange={(e) => setBillingSettings({ ...billingSettings, dueDayOfMonth: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Grace Period (Days)</label>
                  <input
                    type="number"
                    value={billingSettings.gracePeriodDays}
                    onChange={(e) => setBillingSettings({ ...billingSettings, gracePeriodDays: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Late Fine Fee ($ / Day)</label>
                  <input
                    type="number"
                    value={billingSettings.lateFeePerDay}
                    onChange={(e) => setBillingSettings({ ...billingSettings, lateFeePerDay: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">School Settlement Account</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={billingSettings.bankName}
                      onChange={(e) => setBillingSettings({ ...billingSettings, bankName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Account Number</label>
                    <input
                      type="text"
                      value={billingSettings.accountNumber}
                      onChange={(e) => setBillingSettings({ ...billingSettings, accountNumber: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">IFSC / Routing Code</label>
                    <input
                      type="text"
                      value={billingSettings.ifscCode}
                      onChange={(e) => setBillingSettings({ ...billingSettings, ifscCode: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL: RECORD FEE PAYMENT (Step-by-Step) ================= */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-theme-primary text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {paymentStep === 'details' ? 'Record Tuition Payment' : 'Confirm Payment Summary'}
                </h3>
                <p className="text-xs text-white/70">
                  {paymentStep === 'details'
                    ? 'Enter collection details and payment method'
                    : 'Review details before posting to ledger'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentStep('details');
                }}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4 text-xs">
              {paymentStep === 'details' ? (
                <>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Select Student Account</label>
                    <select
                      value={paymentForm.studentId}
                      onChange={(e) => {
                        const matchedFee = fees.find((f) => f.studentId === e.target.value);
                        setPaymentForm({
                          ...paymentForm,
                          studentId: e.target.value,
                          amount: matchedFee ? matchedFee.pending || matchedFee.totalFee : 1000
                        });
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                    >
                      {fees.map((f) => (
                        <option key={f.id} value={f.studentId}>
                          {f.studentName} ({f.className}) — Balance: ${f.pending}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Payment Amount ($)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-base"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Payment Method</label>
                      <select
                        value={paymentForm.paymentMethod}
                        onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                      >
                        <option value="UPI">UPI Instant</option>
                        <option value="Bank Transfer">Bank Transfer (NEFT)</option>
                        <option value="Card">Debit / Credit Card</option>
                        <option value="Cash">Cash at Counter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Reference / TXN ID</label>
                      <input
                        type="text"
                        required
                        value={paymentForm.referenceNumber}
                        onChange={(e) => setPaymentForm({ ...paymentForm, referenceNumber: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Payment Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g. Term 1 Tuition installment payment"
                      value={paymentForm.notes}
                      onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    {(() => {
                      const sf = fees.find((f) => f.studentId === paymentForm.studentId);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Student Name:</span>
                            <span className="font-bold text-slate-900">{sf?.studentName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Class Section:</span>
                            <span className="font-semibold text-slate-800">{sf?.className}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Amount to Post:</span>
                            <span className="font-mono font-bold text-emerald-800 text-sm">
                              ${paymentForm.amount}.00
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Payment Channel:</span>
                            <span className="font-semibold text-slate-800">{paymentForm.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Reference:</span>
                            <span className="font-mono text-slate-700">{paymentForm.referenceNumber}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-theme-primary shrink-0" />
                    <span>Posting this payment will update the student's ledger and generate an official receipt.</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                {paymentStep === 'review' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setPaymentStep('details')}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Back to Edit
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
                    >
                      Confirm & Issue Receipt
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs"
                    >
                      Proceed to Review
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CONCESSION / SCHOLARSHIP ================= */}
      {showAddConcessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Grant Fee Concession / Scholarship</h3>
              <button onClick={() => setShowAddConcessionModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddConcessionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Beneficiary Student</label>
                <select
                  required
                  value={concessionForm.studentId}
                  onChange={(e) => setConcessionForm({ ...concessionForm, studentId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">-- Choose Student Account --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Concession / Award Category</label>
                <select
                  value={concessionForm.concessionType}
                  onChange={(e) =>
                    setConcessionForm({
                      ...concessionForm,
                      concessionType: e.target.value as FeeConcession['concessionType']
                    })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Merit Academic Scholarship">Merit Academic Scholarship</option>
                  <option value="Sibling Concession">Sibling Concession</option>
                  <option value="Need-Based Financial Aid">Need-Based Financial Aid</option>
                  <option value="Staff Child Concession">Staff Child Concession</option>
                  <option value="Sports Excellence Award">Sports Excellence Award</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Waiver Percentage (%)</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  required
                  value={concessionForm.percentage}
                  onChange={(e) => setConcessionForm({ ...concessionForm, percentage: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Justification & Reference</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official justification for waiver grant..."
                  value={concessionForm.reason}
                  onChange={(e) => setConcessionForm({ ...concessionForm, reason: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddConcessionModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-95 shadow-xs"
                >
                  Submit Concession
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROCESS REFUND ================= */}
      {showAddRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Process Fee Refund / Return</h3>
              <button onClick={() => setShowAddRefundModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRefundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student</label>
                <select
                  required
                  value={refundForm.studentId}
                  onChange={(e) => setRefundForm({ ...refundForm, studentId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.admissionId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Refund Amount ($)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={refundForm.refundAmount}
                  onChange={(e) => setRefundForm({ ...refundForm, refundAmount: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Remittance Mode</label>
                <select
                  value={refundForm.paymentMethod}
                  onChange={(e) => setRefundForm({ ...refundForm, paymentMethod: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Bank Transfer">Bank Electronic Transfer</option>
                  <option value="Cheque">Bursar Account Cheque</option>
                  <option value="Counter Cash">Counter Petty Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Refund Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Reason for fee refund or security deposit release..."
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRefundModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-95 shadow-xs"
                >
                  Confirm & Post Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD EXPENSE VOUCHER ================= */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Book Campus Expenditure Voucher</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expense Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Laboratory Supplies">Laboratory Supplies</option>
                  <option value="Library & Journals">Library & Journals</option>
                  <option value="Sports & Activities">Sports & Activities</option>
                  <option value="Campus Maintenance">Campus Maintenance</option>
                  <option value="Utilities & Electricity">Utilities & Electricity</option>
                  <option value="Software & IT Cloud">Software & IT Cloud</option>
                  <option value="Office Stationery">Office Stationery</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Voucher Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science lab chemical consumables batch 3"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payee / Vendor</label>
                  <input
                    type="text"
                    required
                    placeholder="Vendor Name"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Amount ($)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vendor Invoice / Reference #</label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-991"
                  value={expenseForm.invoiceNumber}
                  onChange={(e) => setExpenseForm({ ...expenseForm, invoiceNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-95 shadow-xs"
                >
                  Book Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD FEE STRUCTURE ================= */}
      {showAddFeeStructureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Configure Wing Fee Schedule</h3>
              <button
                onClick={() => setShowAddFeeStructureModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddFeeStructureSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Grade Wing Group Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pre-Primary Wing (Nursery – KG)"
                  value={structureForm.gradeGroup}
                  onChange={(e) => setStructureForm({ ...structureForm, gradeGroup: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Applicable Classes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nursery, LKG, UKG"
                  value={structureForm.classes}
                  onChange={(e) => setStructureForm({ ...structureForm, classes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tuition ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={structureForm.tuition}
                    onChange={(e) => setStructureForm({ ...structureForm, tuition: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lab / Activity ($)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={structureForm.lab}
                    onChange={(e) => setStructureForm({ ...structureForm, lab: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFeeStructureModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-95 shadow-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINT DUES STATEMENT ================= */}
      {showDuesStatementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-theme-primary uppercase tracking-wider block font-mono">
                  Official Statement
                </span>
                <h3 className="font-extrabold text-base text-slate-900">Greenfield Outstanding Dues Register</h3>
              </div>
              <button
                onClick={() => setShowDuesStatementModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Statement Date:</span>
                <span className="font-mono font-bold">22 October 2026</span>
              </div>
              <div className="flex justify-between">
                <span>Total Overdue Sum:</span>
                <span className="font-mono font-bold text-rose-700">${overdueFees.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Defaulter Accounts:</span>
                <span className="font-semibold text-slate-800">{studentsWithDuesCount} Students</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {fees
                .filter((f) => f.pending > 0)
                .map((f) => (
                  <div key={f.id} className="p-2.5 bg-slate-50/60 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">{f.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {f.className} · Due: {f.dueDate}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-rose-700 text-sm">${f.pending}</span>
                  </div>
                ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Printing Statement',
                    message: 'Sending dues register to connected office printer.'
                  });
                }}
                className="flex-1 py-2.5 bg-theme-primary text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Statement</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDuesStatementModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TRANSACTION REVERSAL ================= */}
      {reversingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">Confirm Payment Reversal</h3>
              </div>
              <button onClick={() => setReversingPayment(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to reverse receipt{' '}
              <strong className="font-mono text-slate-900">{reversingPayment.receiptNumber}</strong> ($
              {reversingPayment.amount}.00) for{' '}
              <strong className="text-slate-900">{reversingPayment.studentName}</strong>. This will reinstate the
              outstanding dues on the student fee ledger.
            </p>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">Mandatory Reversal Justification</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Bank transaction bounced / Incorrect cashier ledger entry"
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={!reversalReason.trim()}
                onClick={handleExecuteReversal}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Reversal
              </button>
              <button
                type="button"
                onClick={() => setReversingPayment(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STUDENT PROFILE MODAL ================= */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
      />
    </div>
  );
};
