import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { Book, BookCopy, BookReservation, LostOrDamagedRecord, LibraryTransaction, Student, Teacher, Staff } from '../../../types';
import { RoleSidebar } from '../../common/RoleSidebar';
import { ProfileView } from '../../common/ProfileView';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  FileText,
  Repeat,
  CheckCircle2,
  Clock,
  AlertCircle,
  Bookmark,
  AlertTriangle,
  Users,
  History,
  BarChart3,
  Search,
  Filter,
  Plus,
  ArrowRight,
  X,
  Eye,
  Download,
  Calendar,
  Send,
  User,
  ShieldCheck,
  ChevronRight,
  Edit2,
  Trash2,
  RefreshCw,
  BookMarked
} from 'lucide-react';

// Demo categories with shelfStack references
const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Physics & Science', shelf: 'Stack B, Rows 3-5', color: 'blue', description: 'Core secondary & higher secondary experimental science & physical theory' },
  { id: 'cat-2', name: 'Computer Science', shelf: 'Stack C, Rows 1-2', color: 'indigo', description: 'Algorithms, programming paradigms, hardware architectures, robotics & AI' },
  { id: 'cat-3', name: 'Literature & Fiction', shelf: 'Fiction Section A, Rows 1-6', color: 'emerald', description: 'Classical literature, world poetry, contemporary novels, drama' },
  { id: 'cat-4', name: 'History & Reference', shelf: 'Reference Desk R-1 to R-4', color: 'amber', description: 'Encyclopedias, world atlases, regional archives, historical documents' },
  { id: 'cat-5', name: 'Mathematics', shelf: 'Stack B, Rows 1-2', color: 'purple', description: 'Calculus, algebra, discrete structures, Olympiad problem sets' },
  { id: 'cat-6', name: 'Environmental Studies', shelf: 'Stack D, Row 1', color: 'teal', description: 'Ecology, sustainable geography, climate systems' },
  { id: 'cat-7', name: 'Arts & Music', shelf: 'Stack E, Row 1', color: 'rose', description: 'Fine arts, art history, classical orchestration, musicology' }
];

// Initial physical copy barcodes mapped to initial books
const INITIAL_PHYSICAL_COPIES: BookCopy[] = [
  // Concepts of Physics (bk-1, 12 total, 8 avail, 4 issued)
  { id: 'BC-PHY-001', bookId: 'bk-1', copyNumber: 1, barcode: 'BC-PHY-001', shelf: 'Stack B, Row 4', acquisitionYear: 2023, condition: 'Pristine', status: 'Issued', borrowerId: 'std-10a-01', borrowerName: 'Rohan Mehta', borrowerType: 'Student' },
  { id: 'BC-PHY-002', bookId: 'bk-1', copyNumber: 2, barcode: 'BC-PHY-002', shelf: 'Stack B, Row 4', acquisitionYear: 2023, condition: 'Good', status: 'Available' },
  { id: 'BC-PHY-003', bookId: 'bk-1', copyNumber: 3, barcode: 'BC-PHY-003', shelf: 'Stack B, Row 4', acquisitionYear: 2023, condition: 'Good', status: 'Available' },
  { id: 'BC-PHY-004', bookId: 'bk-1', copyNumber: 4, barcode: 'BC-PHY-004', shelf: 'Stack B, Row 4', acquisitionYear: 2024, condition: 'Pristine', status: 'Available' },
  { id: 'BC-PHY-005', bookId: 'bk-1', copyNumber: 5, barcode: 'BC-PHY-005', shelf: 'Stack B, Row 4', acquisitionYear: 2024, condition: 'Pristine', status: 'Available' },
  { id: 'BC-PHY-006', bookId: 'bk-1', copyNumber: 6, barcode: 'BC-PHY-006', shelf: 'Stack B, Row 4', acquisitionYear: 2024, condition: 'Fair', status: 'Available' },
  { id: 'BC-PHY-007', bookId: 'bk-1', copyNumber: 7, barcode: 'BC-PHY-007', shelf: 'Stack B, Row 4', acquisitionYear: 2024, condition: 'Good', status: 'Available' },
  { id: 'BC-PHY-008', bookId: 'bk-1', copyNumber: 8, barcode: 'BC-PHY-008', shelf: 'Stack B, Row 4', acquisitionYear: 2025, condition: 'Pristine', status: 'Available' },
  { id: 'BC-PHY-009', bookId: 'bk-1', copyNumber: 9, barcode: 'BC-PHY-009', shelf: 'Stack B, Row 4', acquisitionYear: 2025, condition: 'Pristine', status: 'Available' },
  // Introduction to Algorithms (bk-2, 6 total, 1 avail, 5 issued)
  { id: 'BC-ALG-001', bookId: 'bk-2', copyNumber: 1, barcode: 'BC-ALG-001', shelf: 'Stack C, Row 1', acquisitionYear: 2022, condition: 'Good', status: 'Available' },
  { id: 'BC-ALG-002', bookId: 'bk-2', copyNumber: 2, barcode: 'BC-ALG-002', shelf: 'Stack C, Row 1', acquisitionYear: 2022, condition: 'Fair', status: 'Issued', borrowerId: 't-3', borrowerName: 'Mr. Rajesh Nair', borrowerType: 'Faculty' },
  { id: 'BC-ALG-003', bookId: 'bk-2', copyNumber: 3, barcode: 'BC-ALG-003', shelf: 'Stack C, Row 1', acquisitionYear: 2023, condition: 'Good', status: 'Issued', borrowerId: 'std-10a-04', borrowerName: 'Sara Khan', borrowerType: 'Student' },
  { id: 'BC-ALG-004', bookId: 'bk-2', copyNumber: 4, barcode: 'BC-ALG-004', shelf: 'Stack C, Row 1', acquisitionYear: 2023, condition: 'Pristine', status: 'Reserved' },
  // To Kill a Mockingbird (bk-3, 15 total, 11 avail, 4 issued)
  { id: 'BC-LIT-001', bookId: 'bk-3', copyNumber: 1, barcode: 'BC-LIT-001', shelf: 'Fiction Section A', acquisitionYear: 2021, condition: 'Good', status: 'Available' },
  { id: 'BC-LIT-002', bookId: 'bk-3', copyNumber: 2, barcode: 'BC-LIT-002', shelf: 'Fiction Section A', acquisitionYear: 2021, condition: 'Good', status: 'Available' },
  { id: 'BC-LIT-003', bookId: 'bk-3', copyNumber: 3, barcode: 'BC-LIT-003', shelf: 'Fiction Section A', acquisitionYear: 2022, condition: 'Pristine', status: 'Available' },
  // Encyclopedia of World History (bk-4, 4 total, 0 avail, 1 overdue, 1 lost/damaged)
  { id: 'BC-HIS-001', bookId: 'bk-4', copyNumber: 1, barcode: 'BC-HIS-001', shelf: 'Reference Desk R-2', acquisitionYear: 2020, condition: 'Worn', status: 'Issued', borrowerId: 'std-10a-03', borrowerName: 'Kabir Verma', borrowerType: 'Student' },
  { id: 'BC-HIS-002', bookId: 'bk-4', copyNumber: 2, barcode: 'BC-HIS-002', shelf: 'Reference Desk R-2', acquisitionYear: 2020, condition: 'Damaged', status: 'Damaged' },
  // Calculus: Early Transcendentals (bk-5, 8 total, 5 avail)
  { id: 'BC-MAT-001', bookId: 'bk-5', copyNumber: 1, barcode: 'BC-MAT-001', shelf: 'Stack B, Row 1', acquisitionYear: 2023, condition: 'Pristine', status: 'Available' },
  { id: 'BC-MAT-002', bookId: 'bk-5', copyNumber: 2, barcode: 'BC-MAT-002', shelf: 'Stack B, Row 1', acquisitionYear: 2023, condition: 'Good', status: 'Available' },
  { id: 'BC-MAT-003', bookId: 'bk-5', copyNumber: 3, barcode: 'BC-MAT-003', shelf: 'Stack B, Row 1', acquisitionYear: 2024, condition: 'Pristine', status: 'Available' }
];

// Initial Reservations
const INITIAL_RESERVATIONS: BookReservation[] = [
  {
    id: 'res-1',
    bookId: 'bk-2',
    bookTitle: 'Introduction to Algorithms (4th Edition)',
    memberId: 'std-9a-01',
    memberName: 'Isha Singhania',
    memberType: 'Student',
    memberRoleOrClass: 'Grade 9A',
    reservedDate: '2026-10-18',
    queuePosition: 1,
    status: 'Ready for Pickup',
    pickupDeadline: '2026-10-25'
  },
  {
    id: 'res-2',
    bookId: 'bk-4',
    bookTitle: 'The Illustrated Encyclopedia of World History',
    memberId: 't-1',
    memberName: 'Dr. Vikram Sharma',
    memberType: 'Faculty',
    memberRoleOrClass: 'Head of Mathematics',
    reservedDate: '2026-10-20',
    queuePosition: 1,
    status: 'Waitlisted'
  }
];

// Initial Lost / Damaged records
const INITIAL_LOST_DAMAGED: LostOrDamagedRecord[] = [
  {
    id: 'ld-1',
    bookId: 'bk-4',
    bookTitle: 'The Illustrated Encyclopedia of World History',
    copyBarcode: 'BC-HIS-002',
    reportedDate: '2026-10-12',
    memberId: 'std-10a-03',
    memberName: 'Kabir Verma',
    conditionIssue: 'Water Damage',
    chargeAmount: 25.0,
    status: 'Billed',
    notes: 'Liquid spill across pages 120-145 during science symposium study session. Replacement charge assessed.'
  }
];

export const LibrarianView: React.FC = () => {
  const {
    books,
    setBooks,
    libraryTransactions,
    setLibraryTransactions,
    students,
    teachers,
    staff,
    userProfiles,
    logAuditEvent,
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

  // Physical copies state
  const [physicalCopies, setPhysicalCopies] = useState<BookCopy[]>(INITIAL_PHYSICAL_COPIES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [reservations, setReservations] = useState<BookReservation[]>(INITIAL_RESERVATIONS);
  const [lostDamaged, setLostDamaged] = useState<LostOrDamagedRecord[]>(INITIAL_LOST_DAMAGED);

  // Filters & Searches
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'Available' | 'Low Stock' | 'Out of Stock'>('all');
  const [copySearch, setCopySearch] = useState('');
  const [copyStatusFilter, setCopyStatusFilter] = useState('all');
  const [memberSearch, setMemberSearch] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState<'all' | 'Student' | 'Faculty'>('all');
  const [loanSearch, setLoanSearch] = useState('');
  const [overdueSeverityFilter, setOverdueSeverityFilter] = useState<'all' | 'mild' | 'moderate' | 'severe'>('all');

  // Modals
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnLoan, setSelectedReturnLoan] = useState<LibraryTransaction | null>(null);
  const [returnCondition, setReturnCondition] = useState<'Pristine' | 'Good' | 'Fair' | 'Damaged'>('Good');
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showLostDamagedModal, setShowLostDamagedModal] = useState(false);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<{
    id: string;
    name: string;
    type: 'Student' | 'Faculty';
    roleOrClass: string;
    email: string;
    phone: string;
    loans: LibraryTransaction[];
  } | null>(null);

  // Add/Edit Book Form
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Physics & Science',
    publisher: 'Cambridge University Press',
    edition: '3rd International Edition',
    publishYear: 2024,
    shelf: 'Stack B, Row 4',
    totalCopies: 5,
    description: 'Academic reference standard for senior curriculum study.'
  });

  // Issue Book Form
  const [issueForm, setIssueForm] = useState({
    memberType: 'Student' as 'Student' | 'Faculty',
    memberId: 'std-10a-01',
    bookId: 'bk-1',
    copyBarcode: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Lost/Damaged Form
  const [lostDamagedForm, setLostDamagedForm] = useState({
    bookId: 'bk-1',
    copyBarcode: '',
    conditionIssue: 'Water Damage' as 'Torn Pages' | 'Water Damage' | 'Cover Detached' | 'Missing/Lost',
    chargeAmount: 15.0,
    memberId: 'std-10a-01',
    notes: 'Pages damaged during science lab session.'
  });

  // Calculate Data-Derived Dashboard Metrics
  const totalTitles = books.length;
  const totalPhysicalCopiesCount = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalAvailableCopiesCount = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const currentlyIssuedCount = libraryTransactions.filter((t) => t.status === 'Issued' || t.status === 'Overdue').length;
  const overdueLoansList = useMemo(() => {
    const today = '2026-10-22';
    return libraryTransactions.filter((t) => {
      if (t.status === 'Overdue') return true;
      if (t.status === 'Issued' && t.dueDate < today) return true;
      return false;
    });
  }, [libraryTransactions]);
  const overdueCount = overdueLoansList.length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'Waitlisted' || r.status === 'Ready for Pickup').length;
  const lostDamagedCount = lostDamaged.length;
  const totalFinesAccrued = overdueLoansList.reduce((sum, t) => sum + (t.fineAmount > 0 ? t.fineAmount : 5), 0);

  // Combined library members (Students + Teachers)
  const allLibraryMembers = useMemo(() => {
    const studentMembers = students.map((s) => {
      const activeLoans = libraryTransactions.filter((t) => t.studentId === s.id && (t.status === 'Issued' || t.status === 'Overdue'));
      const overdue = activeLoans.filter((t) => t.status === 'Overdue' || t.dueDate < '2026-10-22');
      return {
        id: s.id,
        cardId: `LIB-S-${s.rollNo < 10 ? '0' + s.rollNo : s.rollNo}`,
        name: s.name,
        type: 'Student' as const,
        roleOrClass: s.classId ? s.classId.replace('class-', 'Grade ').toUpperCase() : 'Student',
        email: s.parentEmail || `${s.admissionId.toLowerCase()}@greenfield.edu`,
        phone: s.parentPhone || '+1 (555) 000-0000',
        activeLoansCount: activeLoans.length,
        borrowingLimit: 3,
        overdueCount: overdue.length,
        status: overdue.length > 0 ? ('Delinquent' as const) : ('Active' as const)
      };
    });

    const facultyMembers = teachers.map((t, idx) => {
      const activeLoans = libraryTransactions.filter((tx) => tx.studentId === t.id && (tx.status === 'Issued' || tx.status === 'Overdue'));
      const overdue = activeLoans.filter((tx) => tx.status === 'Overdue' || tx.dueDate < '2026-10-22');
      return {
        id: t.id,
        cardId: `LIB-F-10${idx + 1}`,
        name: t.name,
        type: 'Faculty' as const,
        roleOrClass: t.department || 'Academic Faculty',
        email: t.email,
        phone: t.phone,
        activeLoansCount: activeLoans.length,
        borrowingLimit: 6,
        overdueCount: overdue.length,
        status: overdue.length > 0 ? ('Delinquent' as const) : ('Active' as const)
      };
    });

    return [...studentMembers, ...facultyMembers];
  }, [students, teachers, libraryTransactions]);

  // Filtered catalogue books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const q = catalogueSearch.toLowerCase();
      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.shelf.toLowerCase().includes(q);
      const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
      const matchesAvail =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'Available' && b.availableCopies > 2) ||
        (availabilityFilter === 'Low Stock' && b.availableCopies > 0 && b.availableCopies <= 2) ||
        (availabilityFilter === 'Out of Stock' && b.availableCopies === 0);
      return matchesSearch && matchesCategory && matchesAvail;
    });
  }, [books, catalogueSearch, categoryFilter, availabilityFilter]);

  // Available copies for currently selected book in Issue workflow
  const availableCopiesForIssue = useMemo(() => {
    return physicalCopies.filter((c) => c.bookId === issueForm.bookId && c.status === 'Available');
  }, [physicalCopies, issueForm.bookId]);

  // Handle open Add Book
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setBookForm({
      title: '',
      author: '',
      isbn: `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category: 'Physics & Science',
      publisher: 'Greenfield Academic Press',
      edition: '1st Edition',
      publishYear: 2026,
      shelf: 'Stack A, Row 1',
      totalCopies: 4,
      description: 'Comprehensive curriculum reference volume for secondary academic study.'
    });
    setShowAddBookModal(true);
  };

  // Handle open Edit Book
  const handleOpenEditBook = (b: Book) => {
    setEditingBook(b);
    setBookForm({
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      publisher: b.publisher || 'Academic Press',
      edition: b.edition || '1st Edition',
      publishYear: b.publishYear || 2024,
      shelf: b.shelf,
      totalCopies: b.totalCopies,
      description: b.description || 'Reference textbook volume.'
    });
    setShowAddBookModal(true);
  };

  // Handle Save Book
  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title.trim() || !bookForm.author.trim() || !bookForm.isbn.trim()) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Title, Author, and ISBN are required.' });
      return;
    }

    if (Number(bookForm.totalCopies) < 1) {
      addToast({ type: 'error', title: 'Invalid Copies', message: 'Total physical copies must be at least 1.' });
      return;
    }

    // Check duplicate ISBN on new book
    if (!editingBook && books.some((b) => b.isbn.trim().toLowerCase() === bookForm.isbn.trim().toLowerCase())) {
      addToast({ type: 'error', title: 'Duplicate ISBN', message: `ISBN ${bookForm.isbn} is already registered in catalogue.` });
      return;
    }

    if (editingBook) {
      const copyDiff = Number(bookForm.totalCopies) - editingBook.totalCopies;
      const newAvail = Math.max(0, editingBook.availableCopies + copyDiff);
      const updatedBooks = books.map((b) =>
        b.id === editingBook.id
          ? {
              ...b,
              title: bookForm.title,
              author: bookForm.author,
              isbn: bookForm.isbn,
              category: bookForm.category,
              publisher: bookForm.publisher,
              edition: bookForm.edition,
              publishYear: Number(bookForm.publishYear),
              shelf: bookForm.shelf,
              totalCopies: Number(bookForm.totalCopies),
              availableCopies: newAvail,
              description: bookForm.description,
              status: newAvail === 0 ? ('Out of Stock' as const) : newAvail <= 2 ? ('Low Stock' as const) : ('Available' as const)
            }
          : b
      );
      setBooks(updatedBooks);

      logAuditEvent({
        actorRole: 'librarian',
        actorName: userProfiles.librarian?.fullName || 'Nandini Krishnan',
        action: 'UPDATE_BOOK_CATALOGUE',
        module: 'library',
        recordRef: editingBook.id,
        status: 'SUCCESS',
        reason: `Updated catalogue record "${bookForm.title}" (${bookForm.isbn})`
      });

      addToast({ type: 'success', title: 'Book Catalogue Updated', message: `"${bookForm.title}" metadata saved.` });
    } else {
      const newBookId = `bk-${Date.now()}`;
      const totalCopiesNum = Number(bookForm.totalCopies);
      const newBook: Book = {
        id: newBookId,
        title: bookForm.title,
        author: bookForm.author,
        isbn: bookForm.isbn,
        category: bookForm.category,
        publisher: bookForm.publisher,
        edition: bookForm.edition,
        publishYear: Number(bookForm.publishYear),
        shelf: bookForm.shelf,
        totalCopies: totalCopiesNum,
        availableCopies: totalCopiesNum,
        description: bookForm.description,
        status: 'Available'
      };

      setBooks([newBook, ...books]);

      // Automatically generate barcode physical copy records
      const newCopies: BookCopy[] = Array.from({ length: totalCopiesNum }, (_, i) => ({
        id: `BC-${newBookId.slice(-4)}-00${i + 1}`,
        bookId: newBookId,
        copyNumber: i + 1,
        barcode: `BC-${newBookId.slice(-4)}-00${i + 1}`,
        shelf: bookForm.shelf,
        acquisitionYear: 2026,
        condition: 'Pristine',
        status: 'Available'
      }));

      setPhysicalCopies((prev) => [...newCopies, ...prev]);

      logAuditEvent({
        actorRole: 'librarian',
        actorName: userProfiles.librarian?.fullName || 'Nandini Krishnan',
        action: 'CATALOGUE_NEW_BOOK',
        module: 'library',
        recordRef: newBookId,
        status: 'SUCCESS',
        reason: `Catalogued new accession "${bookForm.title}" with ${totalCopiesNum} physical copies`
      });

      addToast({
        type: 'success',
        title: 'Book Catalogued Successfully',
        message: `"${bookForm.title}" added with ${totalCopiesNum} barcode labels.`
      });
    }

    setShowAddBookModal(false);
  };

  // Handle Execute Issue Book Workflow
  const handleExecuteIssue = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMember = allLibraryMembers.find((m) => m.id === issueForm.memberId);
    if (!selectedMember) {
      addToast({ type: 'error', title: 'Member Not Found', message: 'Please select a valid library borrower.' });
      return;
    }

    // Safeguard 1: Borrowing limit enforcement
    if (selectedMember.activeLoansCount >= selectedMember.borrowingLimit) {
      addToast({
        type: 'error',
        title: 'Borrowing Limit Exceeded',
        message: `${selectedMember.name} has already reached their maximum limit of ${selectedMember.borrowingLimit} active loans.`
      });
      return;
    }

    // Safeguard 2: Overdue blocking
    if (selectedMember.overdueCount > 0) {
      addToast({
        type: 'error',
        title: 'Borrower Delinquent',
        message: `${selectedMember.name} has ${selectedMember.overdueCount} overdue item(s). Overdues must be cleared prior to new issue.`
      });
      return;
    }

    const targetBook = books.find((b) => b.id === issueForm.bookId);
    if (!targetBook || targetBook.availableCopies <= 0) {
      addToast({
        type: 'error',
        title: 'Book Unavailable',
        message: `All physical copies of "${targetBook?.title || 'Selected Book'}" are currently checked out.`
      });
      return;
    }

    // Select physical copy
    let targetCopy = physicalCopies.find((c) => c.barcode === issueForm.copyBarcode);
    if (!targetCopy) {
      targetCopy = physicalCopies.find((c) => c.bookId === targetBook.id && c.status === 'Available');
    }

    if (!targetCopy || targetCopy.status !== 'Available') {
      addToast({ type: 'error', title: 'Copy Unavailable', message: 'No available physical copy could be allocated.' });
      return;
    }

    // 1. Decrement book available count
    const updatedBooks = books.map((b) => {
      if (b.id === targetBook.id) {
        const newAvail = Math.max(0, b.availableCopies - 1);
        return {
          ...b,
          availableCopies: newAvail,
          status: newAvail === 0 ? ('Out of Stock' as const) : newAvail <= 2 ? ('Low Stock' as const) : ('Available' as const)
        };
      }
      return b;
    });
    setBooks(updatedBooks);

    // 2. Update physical copy record
    const updatedCopies = physicalCopies.map((c) =>
      c.id === targetCopy!.id
        ? {
            ...c,
            status: 'Issued' as const,
            borrowerId: selectedMember.id,
            borrowerName: selectedMember.name,
            borrowerType: selectedMember.type
          }
        : c
    );
    setPhysicalCopies(updatedCopies);

    // 3. Create circulation transaction record
    const newTx: LibraryTransaction = {
      id: `lib-tx-${Date.now()}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      studentId: selectedMember.id,
      studentName: selectedMember.name,
      className: selectedMember.roleOrClass,
      issueDate: '2026-10-22',
      dueDate: issueForm.dueDate,
      status: 'Issued',
      fineAmount: 0,
      copyBarcode: targetCopy.barcode,
      memberType: selectedMember.type
    };
    setLibraryTransactions([newTx, ...libraryTransactions]);

    logAuditEvent({
      actorRole: 'librarian',
      actorName: userProfiles.librarian?.fullName || 'Nandini Krishnan',
      action: 'ISSUE_LIBRARY_BOOK',
      module: 'library',
      recordRef: newTx.id,
      status: 'SUCCESS',
      reason: `Issued "${targetBook.title}" (Barcode: ${targetCopy.barcode}) to ${selectedMember.name} (Due: ${issueForm.dueDate})`
    });

    addToast({
      type: 'success',
      title: 'Book Issued Successfully',
      message: `"${targetBook.title}" checked out to ${selectedMember.name}. Return due by ${issueForm.dueDate}.`
    });

    setShowIssueModal(false);
  };

  // Handle open return workflow
  const handleOpenReturnModal = (tx: LibraryTransaction) => {
    setSelectedReturnLoan(tx);
    setReturnCondition('Good');
    setShowReturnModal(true);
  };

  // Execute Return Book Workflow
  const handleExecuteReturn = () => {
    if (!selectedReturnLoan) return;

    const today = '2026-10-22';
    const isOverdue = new Date(today) > new Date(selectedReturnLoan.dueDate);
    const overdueDays = isOverdue
      ? Math.max(1, Math.ceil((new Date(today).getTime() - new Date(selectedReturnLoan.dueDate).getTime()) / (1000 * 3600 * 24)))
      : 0;
    const assessedFine = overdueDays * 2.0; // $2 per day late

    // 1. Update book availability
    const updatedBooks = books.map((b) => {
      if (b.id === selectedReturnLoan.bookId) {
        const newAvail = b.availableCopies + (returnCondition === 'Damaged' ? 0 : 1);
        return {
          ...b,
          availableCopies: newAvail,
          status: newAvail === 0 ? ('Out of Stock' as const) : newAvail <= 2 ? ('Low Stock' as const) : ('Available' as const)
        };
      }
      return b;
    });
    setBooks(updatedBooks);

    // 2. Update physical copy barcode status
    const updatedCopies = physicalCopies.map((c) => {
      if (
        (selectedReturnLoan.copyBarcode && c.barcode === selectedReturnLoan.copyBarcode) ||
        (c.bookId === selectedReturnLoan.bookId && c.borrowerId === selectedReturnLoan.studentId)
      ) {
        return {
          ...c,
          status: returnCondition === 'Damaged' ? ('Damaged' as const) : ('Available' as const),
          condition: returnCondition,
          borrowerId: undefined,
          borrowerName: undefined,
          borrowerType: undefined
        };
      }
      return c;
    });
    setPhysicalCopies(updatedCopies);

    // 3. If damaged, record in Lost/Damaged register
    if (returnCondition === 'Damaged') {
      const newDamagedRecord: LostOrDamagedRecord = {
        id: `ld-${Date.now()}`,
        bookId: selectedReturnLoan.bookId,
        bookTitle: selectedReturnLoan.bookTitle,
        copyBarcode: selectedReturnLoan.copyBarcode || 'BC-GEN-001',
        reportedDate: today,
        memberId: selectedReturnLoan.studentId,
        memberName: selectedReturnLoan.studentName,
        conditionIssue: 'Torn Pages',
        chargeAmount: 18.0,
        status: 'Pending Assessment',
        notes: `Returned in damaged state by ${selectedReturnLoan.studentName}. Requires re-binding or replacement fee.`
      };
      setLostDamaged([newDamagedRecord, ...lostDamaged]);
    }

    // 4. Update transaction status
    const updatedTransactions = libraryTransactions.map((tx) =>
      tx.id === selectedReturnLoan.id
        ? {
            ...tx,
            status: 'Returned' as const,
            returnDate: today,
            fineAmount: assessedFine
          }
        : tx
    );
    setLibraryTransactions(updatedTransactions);

    logAuditEvent({
      actorRole: 'librarian',
      actorName: userProfiles.librarian?.fullName || 'Nandini Krishnan',
      action: 'RETURN_LIBRARY_BOOK',
      module: 'library',
      recordRef: selectedReturnLoan.id,
      status: 'SUCCESS',
      reason: `Processed return of "${selectedReturnLoan.bookTitle}". Overdue days: ${overdueDays}. Assessed fine: $${assessedFine}. Condition: ${returnCondition}.`
    });

    addToast({
      type: 'success',
      title: 'Book Returned Successfully',
      message: `"${selectedReturnLoan.bookTitle}" returned.${assessedFine > 0 ? ` Overdue fine assessed: $${assessedFine}.00.` : ''}`
    });

    setShowReturnModal(false);
    setSelectedReturnLoan(null);
  };

  // Dispatch overdue reminder
  const handleDispatchReminder = (tx: LibraryTransaction) => {
    addToast({
      type: 'info',
      title: 'Circulation Reminder Dispatched',
      message: `Automated overdue notice and email notification transmitted to ${tx.studentName} for "${tx.bookTitle}".`
    });

    logAuditEvent({
      actorRole: 'librarian',
      actorName: userProfiles.librarian?.fullName || 'Nandini Krishnan',
      action: 'DISPATCH_OVERDUE_NOTICE',
      module: 'library',
      recordRef: tx.id,
      status: 'SUCCESS',
      reason: `Dispatched overdue return notification to ${tx.studentName}`
    });
  };

  // Extend active loan by 7 days
  const handleExtendLoan = (tx: LibraryTransaction) => {
    const currentDue = new Date(tx.dueDate);
    currentDue.setDate(currentDue.getDate() + 7);
    const newDueDate = currentDue.toISOString().split('T')[0];

    const updated = libraryTransactions.map((t) => (t.id === tx.id ? { ...t, dueDate: newDueDate, status: 'Issued' as const } : t));
    setLibraryTransactions(updated);

    addToast({
      type: 'success',
      title: 'Loan Extended',
      message: `Loan for "${tx.bookTitle}" extended by 7 days. New due date: ${newDueDate}.`
    });

    logAuditEvent({
      actorRole: 'librarian',
      actorName: userProfiles.librarian?.fullName || 'Nandini Krishnan',
      action: 'EXTEND_LOAN_DUE_DATE',
      module: 'library',
      recordRef: tx.id,
      status: 'SUCCESS',
      reason: `Extended loan for ${tx.studentName} until ${newDueDate}`
    });
  };

  // Handle Export CSV
  const handleExportLibraryCSV = () => {
    const headers = ['Accession ID', 'Title', 'Author', 'ISBN', 'Category', 'Total Copies', 'Available Copies', 'Shelf', 'Status'];
    const rows = books.map((b) => [
      b.id,
      `"${b.title.replace(/"/g, '""')}"`,
      `"${b.author.replace(/"/g, '""')}"`,
      b.isbn,
      `"${b.category}"`,
      b.totalCopies,
      b.availableCopies,
      `"${b.shelf}"`,
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SCHLAR_Library_Catalogue_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Catalogue Export Complete',
      message: 'Comprehensive library inventory CSV generated and downloaded.'
    });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Role-Specific Sidebar */}
      <RoleSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickAction={() => {
          setIssueForm({
            memberType: 'Student',
            memberId: students[0]?.id || 'std-10a-01',
            bookId: books[0]?.id || 'bk-1',
            copyBarcode: '',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });
          setShowIssueModal(true);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* ================= 1. MY PROFILE ================= */}
        {activeTab === 'profile' && <ProfileView onBackToDashboard={() => setActiveTab('dashboard')} />}

        {/* ================= 2. DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Library & Learning Commons</h1>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-theme-light text-theme-primary border border-theme-border">
                    Circulation Desk & Stacks
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Accession catalogue, barcode inventory, active loans, and student reading records.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIssueForm({
                      memberType: 'Student',
                      memberId: students[0]?.id || 'std-10a-01',
                      bookId: books[0]?.id || 'bk-1',
                      copyBarcode: '',
                      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                    });
                    setShowIssueModal(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Issue Book</span>
                </button>
                <button
                  onClick={handleOpenAddBook}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catalog Title</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Reports</span>
                </button>
              </div>
            </div>

            {/* KPI Cards (All Data-Derived) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('catalogue')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-theme-primary transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalogue Titles</span>
                  <BookOpen className="w-4 h-4 text-theme-primary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{totalTitles}</div>
                <div className="text-[11px] text-slate-500 mt-1">{totalPhysicalCopiesCount} total physical copies</div>
              </div>

              <div
                onClick={() => setActiveTab('copies_inventory')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-600 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available in Stacks</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-emerald-700 mt-2 font-mono">{totalAvailableCopiesCount}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">Ready for checkout</div>
              </div>

              <div
                onClick={() => setActiveTab('active_loans')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-theme-secondary transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Circulations</span>
                  <Repeat className="w-4 h-4 text-theme-secondary group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-2 font-mono">{currentlyIssuedCount}</div>
                <div className="text-[11px] text-slate-500 mt-1">Checked out to students & faculty</div>
              </div>

              <div
                onClick={() => setActiveTab('overdue_books')}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-rose-600 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overdue Items</span>
                  <AlertCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-black text-rose-600 mt-2 font-mono">{overdueCount}</div>
                <div className="text-[11px] text-rose-700 font-semibold mt-1">${totalFinesAccrued} fines pending</div>
              </div>
            </div>

            {/* Quick Actions & Circulation Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Circulation Activities */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Recent Circulation Transactions</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
                  >
                    <span>View All Ledger</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {libraryTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            tx.status === 'Overdue'
                              ? 'bg-rose-50 text-rose-700'
                              : tx.status === 'Returned'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{tx.bookTitle}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Borrower: <span className="font-medium text-slate-700">{tx.studentName}</span> ({tx.className}) · Due: {tx.dueDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            tx.status === 'Returned'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : tx.status === 'Overdue'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {tx.status}
                        </span>

                        {tx.status !== 'Returned' && (
                          <button
                            onClick={() => handleOpenReturnModal(tx)}
                            className="px-2 py-1 text-[11px] font-semibold text-theme-primary bg-theme-light border border-theme-border rounded-lg hover:opacity-90"
                          >
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stacks Health & Reservations Overview */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-theme-primary" />
                    <h3 className="text-sm font-bold text-slate-900">Waitlist & Stacks Status</h3>
                  </div>
                  <button onClick={() => setActiveTab('reservations')} className="text-xs font-semibold text-theme-primary hover:underline">
                    Manage
                  </button>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Pending Reservations:</span>
                    <span className="font-bold text-slate-900 font-mono">{pendingReservationsCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Lost/Damaged Volumes:</span>
                    <span className="font-bold text-amber-700 font-mono">{lostDamagedCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">On-Time Return Rate:</span>
                    <span className="font-bold text-emerald-700 font-mono">88.5%</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quick Desk Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab('issue_book')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <Repeat className="w-4 h-4 text-theme-primary" />
                      <span>Issue Loan</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('overdue_books')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-rose-600 bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>Overdue List</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('copies_inventory')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <FileText className="w-4 h-4 text-theme-primary" />
                      <span>Scan Barcodes</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('members')}
                      className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-theme-primary bg-white text-xs font-semibold text-slate-800 transition-colors flex flex-col gap-1"
                    >
                      <Users className="w-4 h-4 text-theme-primary" />
                      <span>Reader Cards</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. BOOK CATALOGUE ================= */}
        {activeTab === 'catalogue' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Accession Book Catalogue</h1>
                <p className="text-xs text-slate-500 mt-1">Master bibliographic registry of all published titles in learning commons.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLibraryCSV}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleOpenAddBook}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Book</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN, or shelf location..."
                  value={catalogueSearch}
                  onChange={(e) => setCatalogueSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  <option value="all">All Availability</option>
                  <option value="Available">Available (&gt;2 copies)</option>
                  <option value="Low Stock">Low Stock (1-2 copies)</option>
                  <option value="Out of Stock">Out of Stock (0 copies)</option>
                </select>
              </div>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Title & Bibliographic</th>
                      <th className="py-3 px-4">Author(s)</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">ISBN</th>
                      <th className="py-3 px-4">Shelf Stack</th>
                      <th className="py-3 px-4 text-center">Copies (Avail / Tot)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredBooks.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          No books found matching search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredBooks.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{b.title}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {b.publisher || 'Academic Press'} · {b.edition || 'Standard Ed.'}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-800">{b.author}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                              {b.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{b.isbn}</td>
                          <td className="py-3 px-4 text-slate-600">{b.shelf}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            <span className={b.availableCopies === 0 ? 'text-rose-600' : 'text-emerald-700'}>
                              {b.availableCopies}
                            </span>
                            <span className="text-slate-400"> / {b.totalCopies}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                b.availableCopies === 0
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : b.availableCopies <= 2
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {b.availableCopies === 0 ? 'Out of Stock' : b.availableCopies <= 2 ? 'Low Stock' : 'Available'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedBookDetail(b)}
                                title="View Details & Barcodes"
                                className="p-1.5 text-slate-600 hover:text-theme-primary hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEditBook(b)}
                                title="Edit Book"
                                className="p-1.5 text-slate-600 hover:text-theme-primary hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
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

        {/* ================= 4. BOOK CATEGORIES & SHELVING ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Classification Categories & Stacks</h1>
                <p className="text-xs text-slate-500 mt-1">Shelving taxonomy, stack allocations, and collection distribution matrix.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const booksInCat = books.filter((b) => b.category === cat.name);
                const totalCopiesInCat = booksInCat.reduce((sum, b) => sum + b.totalCopies, 0);
                const availInCat = booksInCat.reduce((sum, b) => sum + b.availableCopies, 0);

                return (
                  <div key={cat.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-theme-light text-theme-primary flex items-center justify-center font-bold text-xs">
                        <Layers className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {cat.shelf}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{cat.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase">Titles</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">{booksInCat.length}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase">Total Copies</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">{totalCopiesInCat}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <span className="text-[10px] text-slate-400 block uppercase">Available</span>
                        <span className="text-sm font-bold text-emerald-700 font-mono">{availInCat}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 5. COPIES & BARCODE INVENTORY ================= */}
        {activeTab === 'copies_inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Physical Copies & Barcode Register</h1>
                <p className="text-xs text-slate-500 mt-1">Individual item-level tracking, barcode tags, condition audits, and stack locations.</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search barcode (e.g. BC-PHY-001) or borrower..."
                  value={copySearch}
                  onChange={(e) => setCopySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <select
                value={copyStatusFilter}
                onChange={(e) => setCopyStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-theme"
              >
                <option value="all">All Copy Statuses</option>
                <option value="Available">Available in Stacks</option>
                <option value="Issued">Currently Issued</option>
                <option value="Reserved">Reserved</option>
                <option value="Damaged">Damaged / Repair</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            {/* Physical Copies List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Barcode ID</th>
                      <th className="py-3 px-4">Associated Title</th>
                      <th className="py-3 px-4">Shelf Location</th>
                      <th className="py-3 px-4">Acquisition Year</th>
                      <th className="py-3 px-4">Physical Condition</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Current Borrower</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {physicalCopies
                      .filter((c) => {
                        const q = copySearch.toLowerCase();
                        const matchedBook = books.find((b) => b.id === c.bookId);
                        const bookTitle = matchedBook?.title || '';
                        const matchesQ =
                          c.barcode.toLowerCase().includes(q) ||
                          bookTitle.toLowerCase().includes(q) ||
                          (c.borrowerName && c.borrowerName.toLowerCase().includes(q));
                        const matchesStatus = copyStatusFilter === 'all' || c.status === copyStatusFilter;
                        return matchesQ && matchesStatus;
                      })
                      .map((c) => {
                        const book = books.find((b) => b.id === c.bookId);
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{c.barcode}</td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900">{book?.title || 'Unknown Title'}</span>
                              <span className="text-[11px] text-slate-500 block">{book?.author}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{c.shelf}</td>
                            <td className="py-3 px-4 font-mono">{c.acquisitionYear}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  c.condition === 'Pristine'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : c.condition === 'Good'
                                    ? 'bg-blue-50 text-blue-700'
                                    : c.condition === 'Fair'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {c.condition}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  c.status === 'Available'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : c.status === 'Issued'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : c.status === 'Reserved'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {c.borrowerName ? (
                                <div>
                                  <span className="font-bold text-slate-900">{c.borrowerName}</span>
                                  <span className="text-[10px] text-slate-500 block">{c.borrowerType}</span>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">None (In Stacks)</span>
                              )}
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

        {/* ================= 6. ISSUE BOOK WORKFLOW ================= */}
        {activeTab === 'issue_book' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Circulation Desk — Issue Book</h1>
              <p className="text-xs text-slate-500 mt-1">Five-step circulation workflow with member eligibility validation and loan limits.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl">
              <form onSubmit={handleExecuteIssue} className="space-y-5">
                {/* Step 1: Member Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    1. Select Borrower (Student or Faculty)
                  </label>
                  <select
                    value={issueForm.memberId}
                    onChange={(e) => {
                      const m = allLibraryMembers.find((mem) => mem.id === e.target.value);
                      setIssueForm({
                        ...issueForm,
                        memberId: e.target.value,
                        memberType: m?.type || 'Student'
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <optgroup label="Students">
                      {allLibraryMembers
                        .filter((m) => m.type === 'Student')
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.roleOrClass}) · {m.activeLoansCount}/{m.borrowingLimit} Loans
                            {m.overdueCount > 0 ? ' [OVERDUE DELINQUENT]' : ''}
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Faculty">
                      {allLibraryMembers
                        .filter((m) => m.type === 'Faculty')
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.roleOrClass}) · {m.activeLoansCount}/{m.borrowingLimit} Loans
                          </option>
                        ))}
                    </optgroup>
                  </select>

                  {/* Borrower Details Card */}
                  {(() => {
                    const selectedMember = allLibraryMembers.find((m) => m.id === issueForm.memberId);
                    if (!selectedMember) return null;
                    return (
                      <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{selectedMember.name}</span>
                          <span className="text-slate-500 block text-[11px]">{selectedMember.cardId} · {selectedMember.roleOrClass}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${selectedMember.activeLoansCount >= selectedMember.borrowingLimit ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {selectedMember.activeLoansCount} / {selectedMember.borrowingLimit} Loans Used
                          </span>
                          {selectedMember.overdueCount > 0 && (
                            <span className="text-[10px] text-rose-600 font-bold block">Blocked due to overdue books</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Step 2: Book Title Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    2. Select Book Title
                  </label>
                  <select
                    value={issueForm.bookId}
                    onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value, copyBarcode: '' })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                        {b.title} ({b.author}) — {b.availableCopies} available {b.availableCopies <= 0 ? '[OUT OF STOCK]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 3: Physical Copy Barcode Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    3. Allocate Physical Copy Barcode
                  </label>
                  <select
                    value={issueForm.copyBarcode}
                    onChange={(e) => setIssueForm({ ...issueForm, copyBarcode: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="">Auto-allocate next available copy</option>
                    {availableCopiesForIssue.map((c) => (
                      <option key={c.id} value={c.barcode}>
                        {c.barcode} — Condition: {c.condition} (Shelf: {c.shelf})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 4: Loan Due Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    4. Return Due Date
                  </label>
                  <input
                    type="date"
                    value={issueForm.dueDate}
                    onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Institutional policy: 14 days standard for students, 28 days for faculty members.
                  </span>
                </div>

                {/* Step 5: Submit Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Check Out Book</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= 7. ACTIVE LOANS ================= */}
        {activeTab === 'active_loans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Book Loans</h1>
                <p className="text-xs text-slate-500 mt-1">Live circulation register of items checked out across student bodies and faculty.</p>
              </div>

              <button
                onClick={() => setActiveTab('issue_book')}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Issue New Loan</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, borrower name, or class..."
                  value={loanSearch}
                  onChange={(e) => setLoanSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>
            </div>

            {/* Active Loans Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Loan Ref</th>
                      <th className="py-3 px-4">Book Title</th>
                      <th className="py-3 px-4">Borrower</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Loan Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {libraryTransactions
                      .filter((tx) => tx.status === 'Issued' || tx.status === 'Overdue')
                      .filter((tx) => {
                        const q = loanSearch.toLowerCase();
                        return (
                          tx.bookTitle.toLowerCase().includes(q) ||
                          tx.studentName.toLowerCase().includes(q) ||
                          tx.className.toLowerCase().includes(q)
                        );
                      })
                      .map((tx) => {
                        const today = '2026-10-22';
                        const isOverdue = tx.dueDate < today || tx.status === 'Overdue';

                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.id}</td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900">{tx.bookTitle}</span>
                              {tx.copyBarcode && <span className="text-[10px] text-slate-500 font-mono block">Barcode: {tx.copyBarcode}</span>}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900">{tx.studentName}</span>
                              <span className="text-[11px] text-slate-500 block">{tx.className}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600">{tx.issueDate}</td>
                            <td className="py-3 px-4 font-mono font-medium">
                              <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}>{tx.dueDate}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  isOverdue
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                }`}
                              >
                                {isOverdue ? 'Overdue' : 'Active'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleExtendLoan(tx)}
                                  title="Extend loan by 7 days"
                                  className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span>+7 Days</span>
                                </button>
                                <button
                                  onClick={() => handleOpenReturnModal(tx)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-theme-primary bg-theme-light border border-theme-border hover:opacity-90 rounded-lg transition-colors"
                                >
                                  Process Return
                                </button>
                              </div>
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

        {/* ================= 8. OVERDUE TRACKING ================= */}
        {activeTab === 'overdue_books' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Overdue Loans & Fine Recovery</h1>
                <p className="text-xs text-slate-500 mt-1">Delinquent borrowing alerts, duration aging calculations, and notification dispatch.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {overdueCount} Total Overdue Items
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
                  ${totalFinesAccrued}.00 Penalties Accrued
                </span>
              </div>
            </div>

            {/* Overdue Items Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Borrower Particulars</th>
                      <th className="py-3 px-4">Book Title & Barcode</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Days Overdue</th>
                      <th className="py-3 px-4">Accrued Fine ($2/day)</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {overdueLoansList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-60" />
                          Zero overdue items. All checked-out volumes are currently within permissible borrowing windows!
                        </td>
                      </tr>
                    ) : (
                      overdueLoansList.map((tx) => {
                        const today = '2026-10-22';
                        const daysLate = Math.max(
                          1,
                          Math.ceil((new Date(today).getTime() - new Date(tx.dueDate).getTime()) / (1000 * 3600 * 24))
                        );
                        const fine = tx.fineAmount > 0 ? tx.fineAmount : daysLate * 2.0;

                        return (
                          <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{tx.studentName}</div>
                              <div className="text-[11px] text-slate-500">{tx.className}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-slate-900">{tx.bookTitle}</span>
                              {tx.copyBarcode && <span className="text-[10px] text-slate-500 font-mono block">Barcode: {tx.copyBarcode}</span>}
                            </td>
                            <td className="py-3 px-4 font-mono text-rose-600 font-bold">{tx.dueDate}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-rose-50 text-rose-700 border border-rose-200">
                                {daysLate} days late
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">${fine.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleDispatchReminder(tx)}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3 text-slate-500" />
                                  <span>Send Reminder</span>
                                </button>
                                <button
                                  onClick={() => handleOpenReturnModal(tx)}
                                  className="px-2.5 py-1 text-[11px] font-bold text-white bg-theme-primary hover:opacity-95 rounded-lg transition-colors"
                                >
                                  Collect & Settle
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
            </div>
          </div>
        )}

        {/* ================= 9. RESERVATIONS ================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Book Reservations & Hold Queues</h1>
                <p className="text-xs text-slate-500 mt-1">Waitlist orders for high-demand titles and ready-for-pickup notifications.</p>
              </div>

              <button
                onClick={() => setShowReservationModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Reservation</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Book Title</th>
                      <th className="py-3 px-4">Reserved By</th>
                      <th className="py-3 px-4">Reserved Date</th>
                      <th className="py-3 px-4 text-center">Queue Position</th>
                      <th className="py-3 px-4">Hold Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{res.bookTitle}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">{res.memberName}</span>
                          <span className="text-[11px] text-slate-500 block">{res.memberRoleOrClass} ({res.memberType})</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{res.reservedDate}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-800">
                            #{res.queuePosition}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              res.status === 'Ready for Pickup'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : res.status === 'Waitlisted'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {res.status}
                          </span>
                          {res.pickupDeadline && (
                            <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                              Hold expires: {res.pickupDeadline}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                addToast({
                                  type: 'info',
                                  title: 'Pickup Notice Sent',
                                  message: `Notification transmitted to ${res.memberName}: Book is ready for pickup at circulation desk.`
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              Notify Reader
                            </button>
                            <button
                              onClick={() => {
                                setReservations(reservations.filter((r) => r.id !== res.id));
                                addToast({ type: 'info', title: 'Reservation Cancelled', message: 'Waitlist entry cleared.' });
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Cancel Reservation"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 10. LOST OR DAMAGED COPIES ================= */}
        {activeTab === 'lost_damaged' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lost & Damaged Stacks Register</h1>
                <p className="text-xs text-slate-500 mt-1">Controlled audit of compromised, torn, water-damaged, or misplaced accession copies.</p>
              </div>

              <button
                onClick={() => setShowLostDamagedModal(true)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Damage / Loss</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Copy Barcode</th>
                      <th className="py-3 px-4">Book Title</th>
                      <th className="py-3 px-4">Reported Date</th>
                      <th className="py-3 px-4">Condition Issue</th>
                      <th className="py-3 px-4">Borrower at Incident</th>
                      <th className="py-3 px-4">Replacement Fee</th>
                      <th className="py-3 px-4">Audit Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {lostDamaged.map((ld) => (
                      <tr key={ld.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{ld.copyBarcode}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{ld.bookTitle}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{ld.reportedDate}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-rose-50 text-rose-700 border border-rose-200">
                            {ld.conditionIssue}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{ld.memberName || 'Unassigned'}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">${ld.chargeAmount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {ld.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              addToast({
                                type: 'success',
                                title: 'Replacement Settle Logged',
                                message: `Replacement charge of $${ld.chargeAmount} forwarded to Bursar desk.`
                              });
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            Forward to Bursar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 11. LIBRARY MEMBERS ================= */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Library Members Directory</h1>
                <p className="text-xs text-slate-500 mt-1">Authorized student and faculty reader accounts with borrowing quotas and active card statuses.</p>
              </div>
            </div>

            {/* Member Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by reader name, card number, or class/department..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <select
                value={memberTypeFilter}
                onChange={(e) => setMemberTypeFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-theme"
              >
                <option value="all">All Member Types</option>
                <option value="Student">Students Only</option>
                <option value="Faculty">Faculty Only</option>
              </select>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Card ID</th>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">Member Type</th>
                      <th className="py-3 px-4">Class / Department</th>
                      <th className="py-3 px-4 text-center">Active Loans</th>
                      <th className="py-3 px-4 text-center">Overdues</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {allLibraryMembers
                      .filter((m) => {
                        const q = memberSearch.toLowerCase();
                        const matchesSearch =
                          m.name.toLowerCase().includes(q) ||
                          m.cardId.toLowerCase().includes(q) ||
                          m.roleOrClass.toLowerCase().includes(q);
                        const matchesType = memberTypeFilter === 'all' || m.type === memberTypeFilter;
                        return matchesSearch && matchesType;
                      })
                      .map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{m.cardId}</td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900">{m.name}</span>
                            <span className="text-[11px] text-slate-500 block">{m.email}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                m.type === 'Student' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                              }`}
                            >
                              {m.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{m.roleOrClass}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            <span className={m.activeLoansCount >= m.borrowingLimit ? 'text-rose-600' : 'text-slate-900'}>
                              {m.activeLoansCount}
                            </span>
                            <span className="text-slate-400"> / {m.borrowingLimit} max</span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold">
                            <span className={m.overdueCount > 0 ? 'text-rose-600' : 'text-slate-400'}>{m.overdueCount}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                m.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                const memberLoans = libraryTransactions.filter((tx) => tx.studentId === m.id);
                                setSelectedMemberDetail({
                                  id: m.id,
                                  name: m.name,
                                  type: m.type,
                                  roleOrClass: m.roleOrClass,
                                  email: m.email,
                                  phone: m.phone,
                                  loans: memberLoans
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                              Card Ledger
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 12. CIRCULATION HISTORY & AUDIT ================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Circulation History & Accession Ledger</h1>
                <p className="text-xs text-slate-500 mt-1">Chronological record of all checkouts, returns, extensions, and penalty assessments.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Book Title</th>
                      <th className="py-3 px-4">Borrower Name</th>
                      <th className="py-3 px-4">Issue Date</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Return Date</th>
                      <th className="py-3 px-4">Fine Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {libraryTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{tx.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{tx.bookTitle}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-900">{tx.studentName}</span>
                          <span className="text-[11px] text-slate-500 block">{tx.className}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{tx.issueDate}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{tx.dueDate}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">{tx.returnDate || '—'}</td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {tx.fineAmount > 0 ? (
                            <span className="text-rose-600">${tx.fineAmount.toFixed(2)}</span>
                          ) : (
                            <span className="text-slate-400">$0.00</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              tx.status === 'Returned'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : tx.status === 'Overdue'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 13. LIBRARY REPORTS ================= */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Library Analytics & Accession Reports</h1>
                <p className="text-xs text-slate-500 mt-1">Circulation velocity, category distribution metrics, and reading engagement statistics.</p>
              </div>

              <button
                onClick={handleExportLibraryCSV}
                className="px-3.5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Master Report (CSV)</span>
              </button>
            </div>

            {/* Performance Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Circulation Velocity</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {Math.round((currentlyIssuedCount / (totalPhysicalCopiesCount || 1)) * 100)}%
                </div>
                <p className="text-xs text-slate-500">Proportion of physical inventory actively in loan rotation across academic terms.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">On-Time Return Compliance</span>
                <div className="text-2xl font-black text-emerald-700 font-mono">88.5%</div>
                <p className="text-xs text-slate-500">88.5% of students and faculty return checked-out titles prior to or on the due date.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Top Subject Stream</span>
                <div className="text-2xl font-black text-theme-primary">STEM & Physics</div>
                <p className="text-xs text-slate-500">Highest loan demand observed in secondary science & algorithm problem sets.</p>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Collection Inventory by Category</h3>
              <div className="divide-y divide-slate-100">
                {categories.map((cat) => {
                  const bCount = books.filter((b) => b.category === cat.name).length;
                  const totalCopies = books.filter((b) => b.category === cat.name).reduce((sum, b) => sum + b.totalCopies, 0);
                  const availCopies = books.filter((b) => b.category === cat.name).reduce((sum, b) => sum + b.availableCopies, 0);
                  const pct = totalCopies > 0 ? Math.round(((totalCopies - availCopies) / totalCopies) * 100) : 0;

                  return (
                    <div key={cat.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                        <span className="text-[11px] text-slate-500">{cat.shelf} · {bCount} Titles</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-slate-600">{availCopies} available / {totalCopies} copies</span>
                        <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-theme-primary h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-10 text-right font-bold text-slate-700">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS & SLIDEOVERS ================= */}

      {/* 1. Add / Edit Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingBook ? 'Edit Book Record' : 'Catalog New Book Volume'}
              </h3>
              <button onClick={() => setShowAddBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Molecular Biology of the Cell"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author(s) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bruce Alberts"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ISBN Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="978-XXXXXXXXXX"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject Category</label>
                  <select
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Physical Copies</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({ ...bookForm, totalCopies: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publisher</label>
                  <input
                    type="text"
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shelf / Stack Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Stack B, Row 4"
                    value={bookForm.shelf}
                    onChange={(e) => setBookForm({ ...bookForm, shelf: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  rows={2}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  {editingBook ? 'Save Changes' : 'Catalog Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Book Detail Modal */}
      {selectedBookDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary bg-theme-light px-2 py-0.5 rounded-md">
                  {selectedBookDetail.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedBookDetail.title}</h3>
                <span className="text-xs text-slate-500">By {selectedBookDetail.author}</span>
              </div>
              <button onClick={() => setSelectedBookDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">ISBN</span>
                <span className="text-xs font-mono font-bold text-slate-900">{selectedBookDetail.isbn}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Shelf Stack</span>
                <span className="text-xs font-bold text-slate-900">{selectedBookDetail.shelf}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Available</span>
                <span className="text-xs font-mono font-bold text-emerald-700">{selectedBookDetail.availableCopies}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block uppercase">Total Copies</span>
                <span className="text-xs font-mono font-bold text-slate-900">{selectedBookDetail.totalCopies}</span>
              </div>
            </div>

            {/* Individual Physical Copies for this Title */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Registered Physical Copies</h4>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                {physicalCopies
                  .filter((c) => c.bookId === selectedBookDetail.id)
                  .map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{c.barcode}</span>
                        <span className="text-[11px] text-slate-500 block">Condition: {c.condition}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            c.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {c.status}
                        </span>
                        {c.borrowerName && <span className="text-[10px] text-slate-500 block mt-0.5">With {c.borrowerName}</span>}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedBookDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Return Book Workflow Modal */}
      {showReturnModal && selectedReturnLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Process Circulation Return</h3>
              <button onClick={() => setShowReturnModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Volume:</span>
                <span className="font-bold text-slate-900">{selectedReturnLoan.bookTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Borrower:</span>
                <span className="font-bold text-slate-900">{selectedReturnLoan.studentName} ({selectedReturnLoan.className})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Due Date:</span>
                <span className="font-mono text-slate-900">{selectedReturnLoan.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Return Date:</span>
                <span className="font-mono text-slate-900">2026-10-22 (Today)</span>
              </div>

              {selectedReturnLoan.dueDate < '2026-10-22' && (
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-rose-700">
                  <span>Overdue Fine Assessed:</span>
                  <span className="font-mono">$2.00 / day penalty</span>
                </div>
              )}
            </div>

            {/* Condition Check */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Volume Condition Assessment
              </label>
              <select
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
              >
                <option value="Good">Good — Normal read condition</option>
                <option value="Pristine">Pristine — Like new</option>
                <option value="Fair">Fair — Minor page crease</option>
                <option value="Damaged">Damaged — Torn, water damage or detachment</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteReturn}
                className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Return</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Member Detail Modal */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedMemberDetail.name}</h3>
                <span className="text-xs text-slate-500">
                  {selectedMemberDetail.roleOrClass} · {selectedMemberDetail.type}
                </span>
              </div>
              <button onClick={() => setSelectedMemberDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Registered Email</span>
                <span className="font-medium text-slate-800">{selectedMemberDetail.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Contact Phone</span>
                <span className="font-medium text-slate-800">{selectedMemberDetail.phone}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Circulation Borrowing History
              </h4>
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                {selectedMemberDetail.loans.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 italic">No checkout history for this member card.</div>
                ) : (
                  selectedMemberDetail.loans.map((tx) => (
                    <div key={tx.id} className="p-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{tx.bookTitle}</span>
                        <span className="text-[11px] text-slate-500 block">Due: {tx.dueDate}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          tx.status === 'Returned'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tx.status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMemberDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Issue Modal Shortcut from Quick Actions */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Issue Book to Member</h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Borrower</label>
                <select
                  value={issueForm.memberId}
                  onChange={(e) => {
                    const m = allLibraryMembers.find((mem) => mem.id === e.target.value);
                    setIssueForm({ ...issueForm, memberId: e.target.value, memberType: m?.type || 'Student' });
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {allLibraryMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.roleOrClass}) · {m.activeLoansCount}/{m.borrowingLimit} Used
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Volume</label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value, copyBarcode: '' })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id} disabled={b.availableCopies <= 0}>
                      {b.title} ({b.author}) — {b.availableCopies} in stacks
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={issueForm.dueDate}
                  onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Issue Volume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. New Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Hold / Waitlist Reservation</h3>
              <button onClick={() => setShowReservationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const targetBook = books.find((b) => b.id === issueForm.bookId) || books[0];
                const selectedMember = allLibraryMembers.find((m) => m.id === issueForm.memberId) || allLibraryMembers[0];

                const newRes: BookReservation = {
                  id: `res-${Date.now()}`,
                  bookId: targetBook.id,
                  bookTitle: targetBook.title,
                  memberId: selectedMember.id,
                  memberName: selectedMember.name,
                  memberType: selectedMember.type,
                  memberRoleOrClass: selectedMember.roleOrClass,
                  reservedDate: '2026-10-22',
                  queuePosition: reservations.filter((r) => r.bookId === targetBook.id).length + 1,
                  status: targetBook.availableCopies > 0 ? 'Ready for Pickup' : 'Waitlisted',
                  pickupDeadline: '2026-10-29'
                };

                setReservations([newRes, ...reservations]);
                addToast({
                  type: 'success',
                  title: 'Reservation Registered',
                  message: `Waitlist entry created for ${selectedMember.name} on "${targetBook.title}".`
                });
                setShowReservationModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Borrower</label>
                <select
                  value={issueForm.memberId}
                  onChange={(e) => setIssueForm({ ...issueForm, memberId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {allLibraryMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.roleOrClass})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title to Hold</label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Place Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Log Lost / Damaged Modal */}
      {showLostDamagedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Log Damaged / Missing Copy</h3>
              <button onClick={() => setShowLostDamagedModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const targetBook = books.find((b) => b.id === lostDamagedForm.bookId) || books[0];
                const selectedMember = allLibraryMembers.find((m) => m.id === lostDamagedForm.memberId);

                const newLd: LostOrDamagedRecord = {
                  id: `ld-${Date.now()}`,
                  bookId: targetBook.id,
                  bookTitle: targetBook.title,
                  copyBarcode: lostDamagedForm.copyBarcode || 'BC-GEN-002',
                  reportedDate: '2026-10-22',
                  memberId: selectedMember?.id,
                  memberName: selectedMember?.name,
                  conditionIssue: lostDamagedForm.conditionIssue,
                  chargeAmount: Number(lostDamagedForm.chargeAmount),
                  status: 'Pending Assessment',
                  notes: lostDamagedForm.notes
                };

                setLostDamaged([newLd, ...lostDamaged]);
                addToast({
                  type: 'info',
                  title: 'Loss / Damage Registered',
                  message: `Logged ${lostDamagedForm.conditionIssue} on "${targetBook.title}".`
                });
                setShowLostDamagedModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Book Title</label>
                <select
                  value={lostDamagedForm.bookId}
                  onChange={(e) => setLostDamagedForm({ ...lostDamagedForm, bookId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Copy Barcode Tag</label>
                <input
                  type="text"
                  placeholder="e.g. BC-PHY-006"
                  value={lostDamagedForm.copyBarcode}
                  onChange={(e) => setLostDamagedForm({ ...lostDamagedForm, copyBarcode: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Condition Issue</label>
                  <select
                    value={lostDamagedForm.conditionIssue}
                    onChange={(e) => setLostDamagedForm({ ...lostDamagedForm, conditionIssue: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-theme"
                  >
                    <option value="Water Damage">Water Damage</option>
                    <option value="Torn Pages">Torn Pages</option>
                    <option value="Cover Detached">Cover Detached</option>
                    <option value="Missing/Lost">Missing / Lost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Replacement Fee ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={lostDamagedForm.chargeAmount}
                    onChange={(e) => setLostDamagedForm({ ...lostDamagedForm, chargeAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Incident Notes</label>
                <textarea
                  rows={2}
                  value={lostDamagedForm.notes}
                  onChange={(e) => setLostDamagedForm({ ...lostDamagedForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-theme"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLostDamagedModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-95 rounded-xl shadow-xs transition-colors"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
