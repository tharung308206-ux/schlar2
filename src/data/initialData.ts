import {
  Student,
  Teacher,
  Staff,
  ClassInfo,
  AttendanceRecord,
  Exam,
  MarkEntry,
  Assignment,
  FeeRecord,
  PaymentReceipt,
  Book,
  LibraryTransaction,
  Visitor,
  Enquiry,
  Appointment,
  Notice,
  SchoolEvent,
  Message,
  NotificationItem,
  ChildProfile,
  UserProfile
} from '../types';

export const INITIAL_CLASSES: ClassInfo[] = [
  {
    id: 'class-10a',
    name: 'Grade 10A',
    grade: '10',
    section: 'A',
    classTeacherId: 't-1',
    classTeacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    capacity: 35,
    studentCount: 32,
    attendanceToday: 93.8,
    subjects: ['Mathematics', 'Science', 'English', 'Computer Science', 'Social Science']
  },
  {
    id: 'class-10b',
    name: 'Grade 10B',
    grade: '10',
    section: 'B',
    classTeacherId: 't-2',
    classTeacherName: 'Ms. Sunita Rao',
    room: 'Room 302',
    capacity: 35,
    studentCount: 30,
    attendanceToday: 90.0,
    subjects: ['Mathematics', 'Science', 'English', 'Computer Science', 'Social Science']
  },
  {
    id: 'class-9a',
    name: 'Grade 9A',
    grade: '9',
    section: 'A',
    classTeacherId: 't-3',
    classTeacherName: 'Mr. Rajesh Nair',
    room: 'Room 205',
    capacity: 35,
    studentCount: 28,
    attendanceToday: 96.4,
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'English', 'Social Science']
  },
  {
    id: 'class-8a',
    name: 'Grade 8A',
    grade: '8',
    section: 'A',
    classTeacherId: 't-4',
    classTeacherName: 'Ms. Anita Desai',
    room: 'Room 108',
    capacity: 32,
    studentCount: 26,
    attendanceToday: 96.2,
    subjects: ['Mathematics', 'Science', 'English', 'Social Science', 'Computer Science']
  },
  {
    id: 'class-7b',
    name: 'Grade 7B',
    grade: '7',
    section: 'B',
    classTeacherId: 't-5',
    classTeacherName: 'Mrs. Meera Patel',
    room: 'Room 102',
    capacity: 30,
    studentCount: 25,
    attendanceToday: 92.0,
    subjects: ['Mathematics', 'General Science', 'English', 'Social Studies']
  },
  {
    id: 'class-5b',
    name: 'Grade 5B',
    grade: '5',
    section: 'B',
    classTeacherId: 't-6',
    classTeacherName: 'Ms. Priya Sen',
    room: 'Junior Block 12',
    capacity: 28,
    studentCount: 24,
    attendanceToday: 91.7,
    subjects: ['Mathematics', 'Environmental Science', 'English', 'Art & Craft']
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-8a-01',
    name: 'Aarav Sharma',
    firstName: 'Aarav',
    lastName: 'Sharma',
    admissionId: 'GIS-2024-0812',
    admissionDate: '2024-04-10',
    academicYear: 'AY 2026–2027',
    classId: 'class-8a',
    section: 'A',
    rollNo: 1,
    dob: '2012-04-14',
    gender: 'Male',
    nationality: 'Indian',
    parentName: 'Ramesh Sharma',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 349-2180',
    parentEmail: 'ramesh.sharma@example.com',
    parentOccupation: 'Senior Technical Architect',
    secondaryGuardianName: 'Pooja Sharma',
    secondaryGuardianPhone: '+1 (555) 349-2181',
    secondaryGuardianRelation: 'Mother',
    address: '42 Pine Crest Avenue, Greenfield Campus Sector',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560102',
    country: 'India',
    attendanceRate: 96.2,
    academicStatus: 'Exceeding',
    status: 'Active',
    bloodGroup: 'O+',
    emergencyContact: '+1 (555) 349-2180',
    emergencyContactPerson: 'Ramesh Sharma (Father)',
    medicalAlerts: 'Mild seasonal pollen allergy; carries prescribed antihistamine',
    authorizedPickup: 'Ramesh Sharma (Father), Pooja Sharma (Mother)',
    previousSchool: 'St. Xavier Primary Academy',
    previousAdmissionRef: 'SXA-2023-P08',
    internalNotes: 'Elected Grade 8 House Captain. Active participant in National Science Olympiad.',
    documents: [
      { id: 'doc-std-01', name: 'Birth Certificate', type: 'PDF', uploadDate: '2024-04-08', status: 'Verified', fileSize: '1.2 MB', verifiedBy: 'Kavita Chawla' },
      { id: 'doc-std-02', name: 'Transfer Certificate (TC)', type: 'PDF', uploadDate: '2024-04-09', status: 'Verified', fileSize: '850 KB', verifiedBy: 'Dr. Arthur Campbell' },
      { id: 'doc-std-03', name: 'Immunization Record', type: 'PDF', uploadDate: '2024-04-10', status: 'Verified', fileSize: '640 KB', verifiedBy: 'Sister Mary Grace' },
      { id: 'doc-std-04', name: 'Previous Grade 7 Marksheet', type: 'PDF', uploadDate: '2024-04-10', status: 'Verified', fileSize: '1.1 MB', verifiedBy: 'Evelyn Hayes' }
    ],
    lifecycleHistory: [
      { id: 'lc-1', date: '2024-04-10', action: 'Admitted', note: 'Enrolled into Grade 6A under General Admissions merit list', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-2', date: '2025-04-02', action: 'Promotion', note: 'Promoted to Grade 7A with Cumulative Grade A+', actor: 'Evelyn Hayes' },
      { id: 'lc-3', date: '2026-04-04', action: 'Promotion', note: 'Promoted to Grade 8A; assigned House Captain', actor: 'Evelyn Hayes' }
    ]
  },
  {
    id: 'std-5b-01',
    name: 'Ananya Sharma',
    firstName: 'Ananya',
    lastName: 'Sharma',
    admissionId: 'GIS-2026-0523',
    admissionDate: '2026-04-15',
    academicYear: 'AY 2026–2027',
    classId: 'class-5b',
    section: 'B',
    rollNo: 4,
    dob: '2015-09-22',
    gender: 'Female',
    nationality: 'Indian',
    parentName: 'Ramesh Sharma',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 349-2180',
    parentEmail: 'ramesh.sharma@example.com',
    parentOccupation: 'Senior Technical Architect',
    secondaryGuardianName: 'Pooja Sharma',
    secondaryGuardianPhone: '+1 (555) 349-2181',
    secondaryGuardianRelation: 'Mother',
    address: '42 Pine Crest Avenue, Greenfield Campus Sector',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560102',
    country: 'India',
    attendanceRate: 91.3,
    academicStatus: 'On Track',
    status: 'Active',
    bloodGroup: 'B+',
    emergencyContact: '+1 (555) 349-2180',
    emergencyContactPerson: 'Ramesh Sharma (Father)',
    medicalAlerts: 'No known allergies or chronic conditions reported',
    authorizedPickup: 'Ramesh Sharma (Father), Pooja Sharma (Mother)',
    previousSchool: 'Greenfield Junior Kindergarten',
    previousAdmissionRef: 'GJK-2025-11',
    internalNotes: 'Sibling of Aarav Sharma (Grade 8A). Enjoys vocal choir and junior robotics.',
    documents: [
      { id: 'doc-std-05', name: 'Birth Certificate', type: 'PDF', uploadDate: '2026-04-12', status: 'Verified', fileSize: '1.4 MB', verifiedBy: 'Kavita Chawla' },
      { id: 'doc-std-06', name: 'Health Clearance Form', type: 'PDF', uploadDate: '2026-04-14', status: 'Verified', fileSize: '520 KB', verifiedBy: 'Sister Mary Grace' },
      { id: 'doc-std-07', name: 'Address Proof (Utility Bill)', type: 'PDF', uploadDate: '2026-04-14', status: 'Verified', fileSize: '980 KB', verifiedBy: 'Kavita Chawla' }
    ],
    lifecycleHistory: [
      { id: 'lc-4', date: '2026-04-15', action: 'Admitted', note: 'Enrolled into Grade 5B (Sibling Quota verified)', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 'std-10a-01',
    name: 'Rohan Mehta',
    firstName: 'Rohan',
    lastName: 'Mehta',
    admissionId: 'GIS-2022-1001',
    admissionDate: '2022-06-01',
    academicYear: 'AY 2026–2027',
    classId: 'class-10a',
    section: 'A',
    rollNo: 1,
    dob: '2010-02-18',
    gender: 'Male',
    nationality: 'Indian',
    parentName: 'Sanjay Mehta',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 782-9901',
    parentEmail: 'smehta@example.com',
    parentOccupation: 'Senior Financial Director',
    address: '15 Maple Lane, Greenfield East',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560105',
    country: 'India',
    attendanceRate: 94.5,
    academicStatus: 'Exceeding',
    status: 'Active',
    bloodGroup: 'A+',
    emergencyContact: '+1 (555) 782-9901',
    emergencyContactPerson: 'Sanjay Mehta (Father)',
    medicalAlerts: 'Asthma inhaler in classroom emergency kit',
    authorizedPickup: 'Sanjay Mehta, Ritu Mehta',
    previousSchool: 'Greenfield Middle Wing',
    internalNotes: 'CBSE Board exam registration completed. Excellent analytical performance.',
    documents: [
      { id: 'doc-std-08', name: 'Birth Certificate', type: 'PDF', uploadDate: '2022-05-20', status: 'Verified', fileSize: '1.1 MB' },
      { id: 'doc-std-09', name: 'Grade 9 CBSE Marksheet', type: 'PDF', uploadDate: '2026-03-28', status: 'Verified', fileSize: '1.3 MB' }
    ],
    lifecycleHistory: [
      { id: 'lc-5', date: '2022-06-01', action: 'Admitted', note: 'Enrolled in Grade 6A', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-6', date: '2026-04-01', action: 'Promotion', note: 'Promoted to Grade 10A (Board Candidate)', actor: 'Evelyn Hayes' }
    ]
  },
  {
    id: 'std-10a-02',
    name: 'Diya Kapoor',
    firstName: 'Diya',
    lastName: 'Kapoor',
    admissionId: 'GIS-2022-1002',
    admissionDate: '2022-06-01',
    academicYear: 'AY 2026–2027',
    classId: 'class-10a',
    section: 'A',
    rollNo: 2,
    dob: '2010-07-09',
    gender: 'Female',
    nationality: 'Indian',
    parentName: 'Neha Kapoor',
    guardianRelation: 'Mother',
    parentPhone: '+1 (555) 671-8822',
    parentEmail: 'nkapoor@example.com',
    parentOccupation: 'Chief Architect & Urban Planner',
    address: '88 Oakridge Drive, Greenfield High Hills',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560107',
    country: 'India',
    attendanceRate: 98.0,
    academicStatus: 'Exceeding',
    status: 'Active',
    bloodGroup: 'AB+',
    emergencyContact: '+1 (555) 671-8822',
    emergencyContactPerson: 'Neha Kapoor (Mother)',
    medicalAlerts: 'None reported',
    authorizedPickup: 'Neha Kapoor',
    internalNotes: 'President of High School Debate Society and Mathematics Club.',
    documents: [
      { id: 'doc-std-10', name: 'Birth Certificate', type: 'PDF', uploadDate: '2022-05-22', status: 'Verified', fileSize: '1.2 MB' },
      { id: 'doc-std-11', name: 'National Debate Championship Certificate', type: 'PDF', uploadDate: '2025-11-15', status: 'Verified', fileSize: '750 KB' }
    ],
    lifecycleHistory: [
      { id: 'lc-7', date: '2022-06-01', action: 'Admitted', note: 'Admitted with Academic Honors Fellowship', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-8', date: '2026-04-01', action: 'Promotion', note: 'Promoted to Grade 10A with Academic Excellence Award', actor: 'Evelyn Hayes' }
    ]
  },
  {
    id: 'std-10a-03',
    name: 'Kabir Verma',
    firstName: 'Kabir',
    lastName: 'Verma',
    admissionId: 'GIS-2022-1003',
    admissionDate: '2022-06-05',
    academicYear: 'AY 2026–2027',
    classId: 'class-10a',
    section: 'A',
    rollNo: 3,
    dob: '2010-11-25',
    gender: 'Male',
    nationality: 'Indian',
    parentName: 'Anil Verma',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 431-7765',
    parentEmail: 'averma@example.com',
    parentOccupation: 'Independent Consultant',
    address: '12 Birch Street, Greenfield South',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560103',
    country: 'India',
    attendanceRate: 74.2,
    academicStatus: 'Needs Attention',
    status: 'Active',
    bloodGroup: 'O-',
    emergencyContact: '+1 (555) 431-7765',
    emergencyContactPerson: 'Anil Verma (Father)',
    medicalAlerts: 'Recovering from sports sprain; excusal from rigorous athletics',
    authorizedPickup: 'Anil Verma, Shalini Verma',
    internalNotes: 'Under remedial support plan for Algebra. Attendance review scheduled with parents.',
    documents: [
      { id: 'doc-std-12', name: 'Birth Certificate', type: 'PDF', uploadDate: '2022-05-25', status: 'Verified', fileSize: '1.0 MB' },
      { id: 'doc-std-13', name: 'Medical Fitness & Recovery Certificate', type: 'PDF', uploadDate: '2026-08-10', status: 'Verified', fileSize: '880 KB' }
    ],
    lifecycleHistory: [
      { id: 'lc-9', date: '2022-06-05', action: 'Admitted', note: 'Admitted into Grade 6A', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-10', date: '2026-09-12', action: 'Academic Notice', note: 'Attendance dropped below 75%; parent counseling conducted', actor: 'Dr. Vikram Sharma' }
    ]
  },
  {
    id: 'std-10a-04',
    name: 'Sara Khan',
    firstName: 'Sara',
    lastName: 'Khan',
    admissionId: 'GIS-2022-1004',
    admissionDate: '2022-06-10',
    academicYear: 'AY 2026–2027',
    classId: 'class-10a',
    section: 'A',
    rollNo: 4,
    dob: '2010-05-12',
    gender: 'Female',
    nationality: 'Indian',
    parentName: 'Tariq Khan',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 890-1234',
    parentEmail: 'tkhan@example.com',
    parentOccupation: 'Pediatric Surgeon',
    address: '67 Cedar Court, Greenfield Garden City',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560104',
    country: 'India',
    attendanceRate: 91.5,
    academicStatus: 'On Track',
    status: 'Active',
    bloodGroup: 'B+',
    emergencyContact: '+1 (555) 890-1234',
    emergencyContactPerson: 'Tariq Khan (Father)',
    medicalAlerts: 'Mild nut sensitivity',
    authorizedPickup: 'Tariq Khan, Yasmin Khan',
    internalNotes: 'Lead violinist in Senior School Orchestra.',
    documents: [
      { id: 'doc-std-14', name: 'Birth Certificate', type: 'PDF', uploadDate: '2022-06-01', status: 'Verified', fileSize: '1.1 MB' }
    ],
    lifecycleHistory: [
      { id: 'lc-11', date: '2022-06-10', action: 'Admitted', note: 'Enrolled in Grade 6A', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-12', date: '2026-04-01', action: 'Promotion', note: 'Promoted to Grade 10A', actor: 'Evelyn Hayes' }
    ]
  },
  {
    id: 'std-10b-01',
    name: 'Arjun Reddy',
    firstName: 'Arjun',
    lastName: 'Reddy',
    admissionId: 'GIS-2022-1045',
    admissionDate: '2022-06-12',
    academicYear: 'AY 2026–2027',
    classId: 'class-10b',
    section: 'B',
    rollNo: 1,
    dob: '2010-03-30',
    gender: 'Male',
    nationality: 'Indian',
    parentName: 'Kishore Reddy',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 234-5678',
    parentEmail: 'kreddy@example.com',
    parentOccupation: 'Civil Infrastructure Engineer',
    address: '34 Elm Boulevard, Greenfield Central',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560101',
    country: 'India',
    attendanceRate: 88.0,
    academicStatus: 'On Track',
    status: 'Active',
    bloodGroup: 'A-',
    emergencyContact: '+1 (555) 234-5678',
    emergencyContactPerson: 'Kishore Reddy (Father)',
    medicalAlerts: 'None reported',
    authorizedPickup: 'Kishore Reddy, Padma Reddy',
    internalNotes: 'Captaining Under-16 Football Squad.',
    documents: [
      { id: 'doc-std-15', name: 'Birth Certificate', type: 'PDF', uploadDate: '2022-06-05', status: 'Verified', fileSize: '950 KB' }
    ],
    lifecycleHistory: [
      { id: 'lc-13', date: '2022-06-12', action: 'Admitted', note: 'Enrolled in Grade 6B', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-14', date: '2026-04-01', action: 'Promotion', note: 'Promoted to Grade 10B', actor: 'Evelyn Hayes' }
    ]
  },
  {
    id: 'std-9a-01',
    name: 'Isha Singhania',
    firstName: 'Isha',
    lastName: 'Singhania',
    admissionId: 'GIS-2023-0911',
    admissionDate: '2023-05-15',
    academicYear: 'AY 2026–2027',
    classId: 'class-9a',
    section: 'A',
    rollNo: 1,
    dob: '2011-08-16',
    gender: 'Female',
    nationality: 'Indian',
    parentName: 'Gaurav Singhania',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 678-9012',
    parentEmail: 'gsinghania@example.com',
    parentOccupation: 'Managing Partner, Singhania Law Firm',
    address: '102 Magnolia Way, Greenfield Hills',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560108',
    country: 'India',
    attendanceRate: 96.5,
    academicStatus: 'Exceeding',
    status: 'Active',
    bloodGroup: 'O+',
    emergencyContact: '+1 (555) 678-9012',
    emergencyContactPerson: 'Gaurav Singhania (Father)',
    medicalAlerts: 'None',
    authorizedPickup: 'Gaurav Singhania, Rupa Singhania',
    internalNotes: 'Winner of Regional Robotics Championship 2026.',
    documents: [
      { id: 'doc-std-16', name: 'Birth Certificate', type: 'PDF', uploadDate: '2023-05-02', status: 'Verified', fileSize: '1.2 MB' }
    ],
    lifecycleHistory: [
      { id: 'lc-15', date: '2023-05-15', action: 'Admitted', note: 'Enrolled in Grade 6A', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-16', date: '2026-04-01', action: 'Promotion', note: 'Promoted to Grade 9A', actor: 'Evelyn Hayes' }
    ]
  },
  {
    id: 'std-7b-01',
    name: 'Tanvi Joshi',
    firstName: 'Tanvi',
    lastName: 'Joshi',
    admissionId: 'GIS-2025-0720',
    admissionDate: '2025-04-18',
    academicYear: 'AY 2026–2027',
    classId: 'class-7b',
    section: 'B',
    rollNo: 1,
    dob: '2013-01-20',
    gender: 'Female',
    nationality: 'Indian',
    parentName: 'Manoj Joshi',
    guardianRelation: 'Father',
    parentPhone: '+1 (555) 345-6789',
    parentEmail: 'mjoshi@example.com',
    parentOccupation: 'Professor of Environmental Science',
    address: '56 Willow Creek, Greenfield West',
    city: 'Greenfield',
    state: 'Karnataka',
    postalCode: '560106',
    country: 'India',
    attendanceRate: 93.0,
    academicStatus: 'On Track',
    status: 'Active',
    bloodGroup: 'B+',
    emergencyContact: '+1 (555) 345-6789',
    emergencyContactPerson: 'Manoj Joshi (Father)',
    medicalAlerts: 'Requires reading glasses during class',
    authorizedPickup: 'Manoj Joshi, Anjali Joshi',
    internalNotes: 'Member of Green Club and School Eco Council.',
    documents: [
      { id: 'doc-std-17', name: 'Birth Certificate', type: 'PDF', uploadDate: '2025-04-10', status: 'Verified', fileSize: '1.1 MB' }
    ],
    lifecycleHistory: [
      { id: 'lc-17', date: '2025-04-18', action: 'Admitted', note: 'Enrolled into Grade 6B', actor: 'Dr. Arthur Campbell' },
      { id: 'lc-18', date: '2026-04-01', action: 'Promotion', note: 'Promoted to Grade 7B', actor: 'Evelyn Hayes' }
    ]
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    staffId: 'FAC-2019-101',
    name: 'Dr. Vikram Sharma',
    email: 'vikram.sharma@greenfield.edu',
    phone: '+1 (555) 201-4411',
    roleTitle: 'Head of Mathematics / Class Teacher 10A',
    department: 'Mathematics & STEM',
    qualification: 'Ph.D. in Applied Mathematics (IISc), B.Ed',
    certifications: ['CBSE Master Trainer Certification', 'Advanced Statistics Pedagogy', 'STEM Curriculum Leadership'],
    subjects: ['Mathematics', 'Advanced Statistics'],
    classes: ['Grade 10A', 'Grade 10B', 'Grade 9A'],
    classTeacherOf: 'class-10a',
    workloadHours: 24,
    attendanceRate: 98.5,
    joinDate: '2019-06-15',
    employmentType: 'Full-time',
    status: 'Active',
    room: 'Faculty Block B-102',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 14,
    address: '74 Oakridge Enclave, Greenfield Campus Area',
    emergencyContact: '+1 (555) 349-8800',
    dob: '1982-08-14',
    gender: 'Male',
    documents: [
      { id: 'doc-t1-01', name: 'Ph.D. Degree Certificate', type: 'PDF', uploadDate: '2019-06-01', status: 'Verified', fileSize: '2.4 MB' },
      { id: 'doc-t1-02', name: 'Employment Contract', type: 'PDF', uploadDate: '2019-06-15', status: 'Verified', fileSize: '1.5 MB' },
      { id: 'doc-t1-03', name: 'Police Background Verification', type: 'PDF', uploadDate: '2024-05-10', status: 'Verified', fileSize: '480 KB' }
    ],
    lifecycleHistory: [
      { id: 'tlc-1', date: '2019-06-15', action: 'Appointed', note: 'Joined as Senior Faculty of Mathematics', actor: 'Dr. Arthur Campbell' },
      { id: 'tlc-2', date: '2022-04-01', action: 'Promotion', note: 'Promoted to Head of Mathematics Department', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 't-2',
    staffId: 'FAC-2020-102',
    name: 'Ms. Sunita Rao',
    email: 'sunita.rao@greenfield.edu',
    phone: '+1 (555) 201-4412',
    roleTitle: 'Senior Science Teacher / Class Teacher 10B',
    department: 'Science & Physics',
    qualification: 'M.Sc. in Physics, B.Ed (Central University)',
    certifications: ['Experiential Lab Safety Specialist', 'CBSE Senior Secondary Physics Examiner'],
    subjects: ['Science', 'Physics'],
    classes: ['Grade 10A', 'Grade 10B'],
    classTeacherOf: 'class-10b',
    workloadHours: 22,
    attendanceRate: 96.0,
    joinDate: '2020-08-01',
    employmentType: 'Full-time',
    status: 'Active',
    room: 'Science Lab 2',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 11,
    address: '18 Pine Avenue, Greenfield',
    emergencyContact: '+1 (555) 201-9988',
    dob: '1985-03-22',
    gender: 'Female',
    documents: [
      { id: 'doc-t2-01', name: 'M.Sc. & B.Ed Credentials', type: 'PDF', uploadDate: '2020-07-20', status: 'Verified', fileSize: '1.9 MB' },
      { id: 'doc-t2-02', name: 'Employment Contract', type: 'PDF', uploadDate: '2020-08-01', status: 'Verified', fileSize: '1.4 MB' }
    ],
    lifecycleHistory: [
      { id: 'tlc-3', date: '2020-08-01', action: 'Appointed', note: 'Appointed as Senior Science Faculty', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 't-3',
    staffId: 'FAC-2021-103',
    name: 'Mr. Rajesh Nair',
    email: 'rajesh.nair@greenfield.edu',
    phone: '+1 (555) 201-4413',
    roleTitle: 'HOD Computer Science / Class Teacher 9A',
    department: 'Computer Science & ICT',
    qualification: 'M.Tech in CS & IT, B.Tech CSE',
    certifications: ['Python Pedagogy Certification', 'Robotics and AI in Schools Lead'],
    subjects: ['Computer Science', 'Robotics'],
    classes: ['Grade 10A', 'Grade 9A', 'Grade 8A'],
    classTeacherOf: 'class-9a',
    workloadHours: 20,
    attendanceRate: 100,
    joinDate: '2021-03-10',
    employmentType: 'Full-time',
    status: 'Active',
    room: 'Computer Lab 1',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 9,
    address: '32 Cyber Ridge, Greenfield Tech Corridor',
    emergencyContact: '+1 (555) 201-7711',
    dob: '1989-11-05',
    gender: 'Male',
    documents: [
      { id: 'doc-t3-01', name: 'Master of Technology Degree', type: 'PDF', uploadDate: '2021-03-01', status: 'Verified', fileSize: '2.1 MB' }
    ],
    lifecycleHistory: [
      { id: 'tlc-4', date: '2021-03-10', action: 'Appointed', note: 'Joined as Faculty for Computer Science & Robotics', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 't-4',
    staffId: 'FAC-2018-104',
    name: 'Ms. Anita Desai',
    email: 'anita.desai@greenfield.edu',
    phone: '+1 (555) 201-4414',
    roleTitle: 'Social Science Coordinator / Class Teacher 8A',
    department: 'Humanities & Social Sciences',
    qualification: 'M.A. in History, B.Ed (St. Stephens)',
    certifications: ['Model United Nations Advisor', 'Heritage Education Fellowship'],
    subjects: ['Social Science', 'History'],
    classes: ['Grade 8A', 'Grade 7B'],
    classTeacherOf: 'class-8a',
    workloadHours: 19,
    attendanceRate: 95.0,
    joinDate: '2018-07-22',
    employmentType: 'Full-time',
    status: 'Active',
    room: 'Faculty Block A-204',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 13,
    address: '61 Heritage Boulevard, Greenfield',
    emergencyContact: '+1 (555) 201-3322',
    dob: '1984-06-18',
    gender: 'Female',
    documents: [
      { id: 'doc-t4-01', name: 'M.A. in History Certificate', type: 'PDF', uploadDate: '2018-07-10', status: 'Verified', fileSize: '1.7 MB' }
    ],
    lifecycleHistory: [
      { id: 'tlc-5', date: '2018-07-22', action: 'Appointed', note: 'Appointed as Social Science Lead', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 't-5',
    staffId: 'FAC-2022-105',
    name: 'Mrs. Meera Patel',
    email: 'meera.patel@greenfield.edu',
    phone: '+1 (555) 201-4415',
    roleTitle: 'Science Faculty / Class Teacher 7B',
    department: 'Science & Chemistry',
    qualification: 'M.Sc. in Chemistry, B.Ed',
    certifications: ['Green Chemistry in Education', 'Junior Lab Safety Coordinator'],
    subjects: ['General Science', 'Chemistry'],
    classes: ['Grade 7B', 'Grade 8A'],
    classTeacherOf: 'class-7b',
    workloadHours: 21,
    attendanceRate: 97.2,
    joinDate: '2022-01-15',
    employmentType: 'Full-time',
    status: 'Active',
    room: 'Chemistry Lab 1',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 8,
    address: '90 Greenfield Meadows',
    emergencyContact: '+1 (555) 201-4499',
    dob: '1990-09-12',
    gender: 'Female',
    documents: [
      { id: 'doc-t5-01', name: 'M.Sc. Chemistry Degree', type: 'PDF', uploadDate: '2022-01-05', status: 'Verified', fileSize: '1.8 MB' }
    ],
    lifecycleHistory: [
      { id: 'tlc-6', date: '2022-01-15', action: 'Appointed', note: 'Joined Science Department', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 't-6',
    staffId: 'FAC-2020-106',
    name: 'Ms. Priya Sen',
    email: 'priya.sen@greenfield.edu',
    phone: '+1 (555) 201-4416',
    roleTitle: 'Primary Wing Coordinator / Class Teacher 5B',
    department: 'Primary & Early Childhood Wing',
    qualification: 'M.A. English Literature, Early Childhood Ed.',
    certifications: ['Montessori & Primary Pedagogy Diplomas', 'Child Psychology Workshop Lead'],
    subjects: ['English', 'Environmental Science'],
    classes: ['Grade 5B'],
    classTeacherOf: 'class-5b',
    workloadHours: 25,
    attendanceRate: 99.0,
    joinDate: '2020-04-10',
    employmentType: 'Full-time',
    status: 'Active',
    room: 'Junior Block J-10',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 10,
    address: '45 Jasmine Court, Greenfield Campus',
    emergencyContact: '+1 (555) 201-6677',
    dob: '1988-12-04',
    gender: 'Female',
    documents: [
      { id: 'doc-t6-01', name: 'Primary Education Master Degree', type: 'PDF', uploadDate: '2020-04-01', status: 'Verified', fileSize: '1.6 MB' }
    ],
    lifecycleHistory: [
      { id: 'tlc-7', date: '2020-04-10', action: 'Appointed', note: 'Appointed Primary Coordinator', actor: 'Dr. Arthur Campbell' }
    ]
  }
];

export const INITIAL_STAFF: Staff[] = [
  {
    id: 'stf-1',
    staffId: 'STF-2021-001',
    name: 'Kavita Chawla',
    department: 'Front Desk & Admissions',
    role: 'Head Receptionist',
    phone: '+1 (555) 500-1101',
    email: 'kavita.frontdesk@greenfield.edu',
    joinDate: '2021-02-01',
    employmentType: 'Full-time',
    status: 'Active',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    address: '24 Orchard View, Greenfield Campus',
    emergencyContact: '+1 (555) 500-9911',
    shift: 'Morning Shift (07:45 - 16:15)',
    responsibilities: 'Front desk management, prospective admissions enquiry handling, visitor pass registry, campus communications desk',
    qualifications: 'B.A. Public Relations & Administration',
    certifications: ['Front Desk Excellence Certified', 'Campus First Aid Level 1'],
    dob: '1987-05-19',
    gender: 'Female',
    documents: [
      { id: 'doc-stf1-01', name: 'ID Proof & Employment Contract', type: 'PDF', uploadDate: '2021-01-28', status: 'Verified', fileSize: '1.2 MB' }
    ],
    lifecycleHistory: [
      { id: 'slc-1', date: '2021-02-01', action: 'Appointed', note: 'Appointed as Senior Front Desk Executive', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 'stf-2',
    staffId: 'STF-2017-002',
    name: 'Alok Saxena',
    department: 'Accounts & Finance',
    role: 'Chief Bursar & Accountant',
    phone: '+1 (555) 500-1102',
    email: 'accounts@greenfield.edu',
    joinDate: '2017-09-15',
    employmentType: 'Full-time',
    status: 'Active',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    address: '52 Greenfield Bank Colony, Sector 4',
    emergencyContact: '+1 (555) 500-9922',
    shift: 'Standard Business Shift (08:30 - 17:00)',
    responsibilities: 'School fee collection, payment receipts reconciliation, balance audits, vendor payroll, bursar ledgers',
    qualifications: 'M.Com, Chartered Accountancy (Intermediate)',
    certifications: ['Certified Public Bookkeeper', 'Tally & ERP Financial Specialist'],
    dob: '1981-10-30',
    gender: 'Male',
    documents: [
      { id: 'doc-stf2-01', name: 'CA Intermediate & M.Com Degrees', type: 'PDF', uploadDate: '2017-09-01', status: 'Verified', fileSize: '2.5 MB' }
    ],
    lifecycleHistory: [
      { id: 'slc-2', date: '2017-09-15', action: 'Appointed', note: 'Joined as Chief Bursar', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 'stf-3',
    staffId: 'STF-2019-003',
    name: 'Nandini Krishnan',
    department: 'Library & Learning Commons',
    role: 'Head Librarian',
    phone: '+1 (555) 500-1103',
    email: 'library@greenfield.edu',
    joinDate: '2019-11-20',
    employmentType: 'Full-time',
    status: 'Active',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    address: '108 Scholar Haven, Greenfield North',
    emergencyContact: '+1 (555) 500-9933',
    shift: 'Library Hours (08:00 - 16:30)',
    responsibilities: 'Cataloguing volumes, ISBN inventory, circulation desk operations, overdue fine collection, student reading programs',
    qualifications: 'Master of Library and Information Science (M.Lib.I.Sc)',
    certifications: ['Dewey Decimal System Specialist', 'Digital Media Archives Lead'],
    dob: '1986-07-14',
    gender: 'Female',
    documents: [
      { id: 'doc-stf3-01', name: 'Master of Library Science Certificate', type: 'PDF', uploadDate: '2019-11-10', status: 'Verified', fileSize: '1.8 MB' }
    ],
    lifecycleHistory: [
      { id: 'slc-3', date: '2019-11-20', action: 'Appointed', note: 'Appointed Head Librarian', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 'stf-4',
    staffId: 'STF-2022-004',
    name: 'Devraj Chauhan',
    department: 'Campus IT & Infrastructure',
    role: 'Systems Administrator',
    phone: '+1 (555) 500-1104',
    email: 'it.support@greenfield.edu',
    joinDate: '2022-05-18',
    employmentType: 'Full-time',
    status: 'Active',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    address: '14 Silicon Square, Greenfield',
    emergencyContact: '+1 (555) 500-9944',
    shift: 'Operations Shift (08:00 - 17:00)',
    responsibilities: 'Campus network operations, classroom smartboard systems, student computer lab maintenance, data backup protocols',
    qualifications: 'B.Tech in Information Technology',
    certifications: ['Cisco CCNA Certified', 'Microsoft Azure Administrator'],
    dob: '1992-02-11',
    gender: 'Male',
    documents: [
      { id: 'doc-stf4-01', name: 'B.Tech Degree & CCNA Credentials', type: 'PDF', uploadDate: '2022-05-10', status: 'Verified', fileSize: '1.9 MB' }
    ],
    lifecycleHistory: [
      { id: 'slc-4', date: '2022-05-18', action: 'Appointed', note: 'Joined as Campus IT Administrator', actor: 'Dr. Arthur Campbell' }
    ]
  },
  {
    id: 'stf-5',
    staffId: 'STF-2018-005',
    name: 'Sister Mary Grace',
    department: 'Health & Wellness Infirmary',
    role: 'School Registered Nurse',
    phone: '+1 (555) 500-1105',
    email: 'infirmary@greenfield.edu',
    joinDate: '2018-03-01',
    employmentType: 'Full-time',
    status: 'Active',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    address: 'Campus Infirmary Residence, Greenfield',
    emergencyContact: '+1 (555) 500-9955',
    shift: 'Campus Clinic Shift (07:30 - 16:30)',
    responsibilities: 'Student emergency triage, first aid administration, medical records verification, immunization tracking, annual health screenings',
    qualifications: 'B.Sc. Nursing (RN License Verified)',
    certifications: ['Pediatric Advanced Life Support (PALS)', 'Emergency Trauma First Responder'],
    dob: '1979-01-25',
    gender: 'Female',
    documents: [
      { id: 'doc-stf5-01', name: 'Registered Nurse (RN) License', type: 'PDF', uploadDate: '2018-02-20', status: 'Verified', fileSize: '1.4 MB' }
    ],
    lifecycleHistory: [
      { id: 'slc-5', date: '2018-03-01', action: 'Appointed', note: 'Appointed School Nurse & Infirmary Head', actor: 'Dr. Arthur Campbell' }
    ]
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-today-10a',
    date: '2026-09-27',
    classId: 'class-10a',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-1',
    records: [
      { studentId: 'std-10a-01', studentName: 'Rohan Mehta', status: 'Present' },
      { studentId: 'std-10a-02', studentName: 'Diya Kapoor', status: 'Present' },
      { studentId: 'std-10a-03', studentName: 'Kabir Verma', status: 'Absent' },
      { studentId: 'std-10a-04', studentName: 'Sara Khan', status: 'Present' }
    ]
  },
  {
    id: 'att-today-8a',
    date: '2026-09-27',
    classId: 'class-8a',
    period: 'Period 1 (08:30 - 09:15)',
    teacherId: 't-4',
    records: [
      { studentId: 'std-8a-01', studentName: 'Aarav Sharma', status: 'Present' }
    ]
  },
  {
    id: 'att-today-5b',
    date: '2026-09-27',
    classId: 'class-5b',
    period: 'Morning Roll Call',
    teacherId: 't-6',
    records: [
      { studentId: 'std-5b-01', studentName: 'Ananya Sharma', status: 'Present' }
    ]
  }
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    name: 'Term 1 Final Examination',
    term: 'Term 1',
    classId: 'class-10a',
    subject: 'Mathematics',
    date: '2026-10-12',
    time: '09:00 AM - 12:00 PM',
    room: 'Main Examination Hall',
    totalMarks: 100,
    status: 'Upcoming'
  },
  {
    id: 'exam-2',
    name: 'Mid-Term Assessment',
    term: 'Mid-Term',
    classId: 'class-10a',
    subject: 'Science',
    date: '2026-09-18',
    time: '09:30 AM - 11:30 AM',
    room: 'Room 301',
    totalMarks: 50,
    status: 'Completed'
  },
  {
    id: 'exam-3',
    name: 'Unit Test 2',
    term: 'Term 1',
    classId: 'class-8a',
    subject: 'Mathematics',
    date: '2026-09-22',
    time: '10:00 AM - 11:00 AM',
    room: 'Room 108',
    totalMarks: 40,
    status: 'Completed'
  },
  {
    id: 'exam-4',
    name: 'Formative Assessment 1',
    term: 'Term 1',
    classId: 'class-5b',
    subject: 'English',
    date: '2026-09-20',
    time: '09:00 AM - 10:00 AM',
    room: 'Junior Block 12',
    totalMarks: 25,
    status: 'Completed'
  }
];

export const INITIAL_MARKS: MarkEntry[] = [
  {
    id: 'mrk-1',
    examId: 'exam-2',
    classId: 'class-10a',
    subject: 'Science',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    marksObtained: 46,
    totalMarks: 50,
    grade: 'A+',
    remarks: 'Outstanding grasp of physics principles'
  },
  {
    id: 'mrk-2',
    examId: 'exam-2',
    classId: 'class-10a',
    subject: 'Science',
    studentId: 'std-10a-02',
    studentName: 'Diya Kapoor',
    marksObtained: 48,
    totalMarks: 50,
    grade: 'A+',
    remarks: 'Flawless diagrams and problem solving'
  },
  {
    id: 'mrk-3',
    examId: 'exam-2',
    classId: 'class-10a',
    subject: 'Science',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    marksObtained: 28,
    totalMarks: 50,
    grade: 'C',
    remarks: 'Needs focused remedial support in chemical equations'
  },
  {
    id: 'mrk-4',
    examId: 'exam-3',
    classId: 'class-8a',
    subject: 'Mathematics',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    marksObtained: 38,
    totalMarks: 40,
    grade: 'A+',
    remarks: 'Exemplary performance in algebraic geometry'
  },
  {
    id: 'mrk-5',
    examId: 'exam-4',
    classId: 'class-5b',
    subject: 'English',
    studentId: 'std-5b-01',
    studentName: 'Ananya Sharma',
    marksObtained: 24,
    totalMarks: 25,
    grade: 'A+',
    remarks: 'Expressive vocabulary and beautiful handwriting'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Linear Quadratic Systems Investigation',
    classId: 'class-10a',
    className: 'Grade 10A',
    subject: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    description: 'Solve the 12 quadratic equation modeling real-world parabolic trajectory problems with graphical representation.',
    dueDate: '2026-10-02',
    createdDate: '2026-09-24',
    status: 'Published',
    submissionsCount: 28,
    totalStudents: 32
  },
  {
    id: 'asg-2',
    title: 'Photosynthesis & Light Absorption Lab Report',
    classId: 'class-10a',
    className: 'Grade 10A',
    subject: 'Science',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    description: 'Prepare a 3-page scientific investigation write-up analyzing chloroplast starch synthesis under LED wavelengths.',
    dueDate: '2026-10-05',
    createdDate: '2026-09-26',
    status: 'Published',
    submissionsCount: 19,
    totalStudents: 32
  },
  {
    id: 'asg-3',
    title: 'Linear Equations & Real Life Applications',
    classId: 'class-8a',
    className: 'Grade 8A',
    subject: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    description: 'Complete Exercise 4.3 on word problems involving speed, distance, and proportional cost calculations.',
    dueDate: '2026-10-03',
    createdDate: '2026-09-25',
    status: 'Published',
    submissionsCount: 22,
    totalStudents: 26
  },
  {
    id: 'asg-4',
    title: 'Solar System Planetary Orbit Model Poster',
    classId: 'class-5b',
    className: 'Grade 5B',
    subject: 'Environmental Science',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    description: 'Draw or craft the 8 planets in accurate orbital scale sequence with 3 fun facts for each planet.',
    dueDate: '2026-10-06',
    createdDate: '2026-09-26',
    status: 'Published',
    submissionsCount: 16,
    totalStudents: 24
  }
];

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee-1',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    classId: 'class-8a',
    className: 'Grade 8A',
    totalFee: 3400,
    paid: 3400,
    pending: 0,
    dueDate: '2026-09-15',
    status: 'Paid'
  },
  {
    id: 'fee-2',
    studentId: 'std-5b-01',
    studentName: 'Ananya Sharma',
    classId: 'class-5b',
    className: 'Grade 5B',
    totalFee: 3100,
    paid: 2000,
    pending: 1100,
    dueDate: '2026-10-15',
    status: 'Partially Paid'
  },
  {
    id: 'fee-3',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    classId: 'class-10a',
    className: 'Grade 10A',
    totalFee: 3800,
    paid: 3800,
    pending: 0,
    dueDate: '2026-09-15',
    status: 'Paid'
  },
  {
    id: 'fee-4',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    classId: 'class-10a',
    className: 'Grade 10A',
    totalFee: 3800,
    paid: 1200,
    pending: 2600,
    dueDate: '2026-09-01',
    status: 'Overdue'
  },
  {
    id: 'fee-5',
    studentId: 'std-10a-04',
    studentName: 'Sara Khan',
    classId: 'class-10a',
    className: 'Grade 10A',
    totalFee: 3800,
    paid: 0,
    pending: 3800,
    dueDate: '2026-10-10',
    status: 'Pending'
  }
];

export const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: 'pay-101',
    receiptNumber: 'GIS-REC-2026-0891',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    className: 'Grade 8A',
    amount: 3400,
    date: '2026-09-10',
    paymentMethod: 'Bank Transfer',
    referenceNumber: 'TXN-99812401',
    feeRecordId: 'fee-1',
    notes: 'Term 1 full tuition and composite laboratory fees',
    receivedBy: 'Alok Saxena (Accounts)'
  },
  {
    id: 'pay-102',
    receiptNumber: 'GIS-REC-2026-0892',
    studentId: 'std-5b-01',
    studentName: 'Ananya Sharma',
    className: 'Grade 5B',
    amount: 2000,
    date: '2026-09-14',
    paymentMethod: 'UPI',
    referenceNumber: 'UPI-77821903',
    feeRecordId: 'fee-2',
    notes: 'First installment payment received',
    receivedBy: 'Alok Saxena (Accounts)'
  },
  {
    id: 'pay-103',
    receiptNumber: 'GIS-REC-2026-0893',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    className: 'Grade 10A',
    amount: 3800,
    date: '2026-09-12',
    paymentMethod: 'Card',
    referenceNumber: 'CARD-AUTH-6541',
    feeRecordId: 'fee-3',
    notes: 'Annual composite fee settlement',
    receivedBy: 'Alok Saxena (Accounts)'
  }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'bk-1',
    title: 'Concepts of Physics (Vol. 1 & 2)',
    author: 'Dr. H.C. Verma',
    isbn: '978-8177091878',
    category: 'Physics & Science',
    totalCopies: 12,
    availableCopies: 8,
    shelf: 'Stack B, Row 4',
    status: 'Available'
  },
  {
    id: 'bk-2',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    isbn: '978-0262046305',
    category: 'Computer Science',
    totalCopies: 6,
    availableCopies: 1,
    shelf: 'Stack C, Row 1',
    status: 'Low Stock'
  },
  {
    id: 'bk-3',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0060935467',
    category: 'Literature & Fiction',
    totalCopies: 15,
    availableCopies: 11,
    shelf: 'Fiction Section A',
    status: 'Available'
  },
  {
    id: 'bk-4',
    title: 'The Illustrated Encyclopedia of World History',
    author: 'Dr. Anne Millard',
    isbn: '978-1843224419',
    category: 'History & Reference',
    totalCopies: 4,
    availableCopies: 0,
    shelf: 'Reference Desk R-2',
    status: 'Out of Stock'
  },
  {
    id: 'bk-5',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '978-1305272354',
    category: 'Mathematics',
    totalCopies: 8,
    availableCopies: 5,
    shelf: 'Stack B, Row 1',
    status: 'Available'
  }
];

export const INITIAL_LIBRARY_TRANSACTIONS: LibraryTransaction[] = [
  {
    id: 'lib-tx-1',
    bookId: 'bk-1',
    bookTitle: 'Concepts of Physics (Vol. 1 & 2)',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    className: 'Grade 10A',
    issueDate: '2026-09-14',
    dueDate: '2026-09-28',
    status: 'Issued',
    fineAmount: 0
  },
  {
    id: 'lib-tx-2',
    bookId: 'bk-4',
    bookTitle: 'The Illustrated Encyclopedia of World History',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    className: 'Grade 10A',
    issueDate: '2026-09-02',
    dueDate: '2026-09-16',
    status: 'Overdue',
    fineAmount: 11
  },
  {
    id: 'lib-tx-3',
    bookId: 'bk-3',
    bookTitle: 'To Kill a Mockingbird',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    className: 'Grade 8A',
    issueDate: '2026-09-10',
    dueDate: '2026-09-24',
    returnDate: '2026-09-23',
    status: 'Returned',
    fineAmount: 0
  }
];

export const INITIAL_VISITORS: Visitor[] = [
  {
    id: 'vis-1',
    visitorName: 'Mr. Arvind Khanna',
    purpose: 'Academic Syllabus Inquiry for Grade 6',
    personToMeet: 'Kavita Chawla (Front Desk)',
    phone: '+1 (555) 712-4091',
    entryTime: '09:15 AM',
    status: 'Checked In',
    badgeNo: 'VIS-084',
    date: '2026-09-27'
  },
  {
    id: 'vis-2',
    visitorName: 'Ms. Rebecca Sterling',
    purpose: 'Cambridge University Press Textbook Sample Delivery',
    personToMeet: 'Nandini Krishnan (Library)',
    phone: '+1 (555) 619-3382',
    entryTime: '09:45 AM',
    status: 'Checked In',
    badgeNo: 'VIS-085',
    date: '2026-09-27'
  },
  {
    id: 'vis-3',
    visitorName: 'Dr. Suresh Sen',
    purpose: 'Routine Campus Fire & Safety Compliance Audit',
    personToMeet: 'Principal Office',
    phone: '+1 (555) 829-1120',
    entryTime: '08:00 AM',
    exitTime: '09:30 AM',
    status: 'Checked Out',
    badgeNo: 'VIS-082',
    date: '2026-09-27'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    parentName: 'Deepak & Shalini Malhotra',
    studentName: 'Vihaan Malhotra',
    grade: 'Grade 9',
    contact: '+1 (555) 942-0192',
    source: 'Website',
    notes: 'Interested in STEM robotics track and boarding facilities. Scheduled campus tour for next Tuesday.',
    status: 'Follow-up',
    date: '2026-09-25'
  },
  {
    id: 'enq-2',
    parentName: 'Farah Siddiqui',
    studentName: 'Zayd Siddiqui',
    grade: 'Grade 6',
    contact: '+1 (555) 819-4402',
    source: 'Referral',
    notes: 'Relocating from Chicago. Inquired about middle school curriculum transfer equivalence.',
    status: 'New',
    date: '2026-09-27'
  },
  {
    id: 'enq-3',
    parentName: 'Col. Ranjit Roy',
    studentName: 'Arya Roy',
    grade: 'Grade 11 (Science)',
    contact: '+1 (555) 304-9912',
    source: 'Walk-in',
    notes: 'Completed entrance interview. Admission paperwork submitted for approval.',
    status: 'Converted',
    date: '2026-09-22'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    parentName: 'Ramesh Sharma',
    studentName: 'Aarav Sharma',
    meetWith: 'Dr. Vikram Sharma',
    role: 'Head of Mathematics',
    date: '2026-09-29',
    time: '11:00 AM - 11:30 AM',
    purpose: 'Discuss Advanced Math Olympiad Training program nomination',
    status: 'Scheduled'
  },
  {
    id: 'apt-2',
    parentName: 'Neha Kapoor',
    studentName: 'Diya Kapoor',
    meetWith: 'Mrs. Evelyn Hayes',
    role: 'Vice Principal',
    date: '2026-09-30',
    time: '02:00 PM - 02:30 PM',
    purpose: 'Review student council election leadership portfolio',
    status: 'Scheduled'
  }
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Term 1 Final Examination Timetable Released',
    content: 'The official schedule for Grade 9 through Grade 12 Term 1 board assessments is now published on the portal. Morning sessions commence at 09:00 AM sharp. Students must carry valid hall tickets.',
    category: 'Exam',
    targetAudience: 'All High School Students & Parents',
    date: '2026-09-26',
    author: 'Academic Directorate',
    priority: 'Urgent'
  },
  {
    id: 'not-2',
    title: 'Annual Inter-House Athletics Meet 2026',
    content: 'Greenfield International will host the 34th Annual Sports Meet at the Olympic Ground on Saturday, October 10. Track trials begin this Wednesday during physical education blocks.',
    category: 'Event',
    targetAudience: 'All School Community',
    date: '2026-09-24',
    author: 'Physical Education Department',
    priority: 'Normal'
  },
  {
    id: 'not-3',
    title: 'Parent-Teacher Academic Review Conferences (Term 1)',
    content: 'Scheduled for Friday, October 9, between 09:00 AM and 04:00 PM. Parents may book 15-minute consultation slots with class and subject teachers via the mobile app portal.',
    category: 'School',
    targetAudience: 'All Parents',
    date: '2026-09-25',
    author: 'Principal Office',
    priority: 'High'
  },
  {
    id: 'not-4',
    title: 'Robotics Innovation Lab Extended Hours',
    content: 'To support participants preparing for the National Science & Tech Exposition, the lab will remain open until 5:30 PM on Tuesdays and Thursdays with faculty supervision.',
    category: 'Class',
    targetAudience: 'Middle & Senior School Students',
    date: '2026-09-22',
    author: 'Mr. Rajesh Nair',
    priority: 'Normal'
  }
];

export const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'evt-1',
    title: 'Annual Inter-House Sports Olympiad',
    date: '2026-10-10',
    time: '08:00 AM - 04:30 PM',
    location: 'Main Sports Complex & Track',
    audience: 'All Students, Faculty & Parents',
    status: 'Upcoming',
    description: 'Track and field championships, relay challenges, tug-of-war, and marching band presentation.',
    category: 'Sports'
  },
  {
    id: 'evt-2',
    title: 'Greenfield Science & Tech Innovation Fair',
    date: '2026-10-18',
    time: '10:00 AM - 03:00 PM',
    location: 'Auditorium & Exhibition Hall',
    audience: 'Grades 6 - 12',
    status: 'Upcoming',
    description: 'Over 85 interactive exhibits on renewable energy, robotics, AI applications, and bio-agriculture.',
    category: 'Academic'
  },
  {
    id: 'evt-3',
    title: 'Parent-Teacher Academic Review Day',
    date: '2026-10-09',
    time: '09:00 AM - 04:00 PM',
    location: 'Respective Classrooms & Quadrangle',
    audience: 'All Parents & Teachers',
    status: 'Upcoming',
    description: 'One-on-one progress review of mid-term performance, student well-being, and curriculum roadmap.',
    category: 'Meeting'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    threadId: 'parent-teacher-aarav',
    senderRole: 'teacher',
    senderName: 'Dr. Vikram Sharma',
    recipientRole: 'parent',
    recipientName: 'Ramesh Sharma',
    text: 'Good afternoon Mr. Sharma. Aarav demonstrated brilliant mathematical insight during today’s quadratic geometry seminar. I would like to nominate him for the State Math Olympiad training cohort.',
    timestamp: 'Yesterday at 03:45 PM',
    isMine: false
  },
  {
    id: 'msg-2',
    threadId: 'parent-teacher-aarav',
    senderRole: 'parent',
    senderName: 'Ramesh Sharma',
    recipientRole: 'teacher',
    recipientName: 'Dr. Vikram Sharma',
    text: 'Thank you Dr. Sharma! That is wonderful to hear. We have booked an appointment on Tuesday at 11:00 AM to review the study schedule and requirements.',
    timestamp: 'Yesterday at 05:12 PM',
    isMine: true
  },
  {
    id: 'msg-3',
    threadId: 'parent-teacher-ananya',
    senderRole: 'teacher',
    senderName: 'Ms. Priya Sen',
    recipientRole: 'parent',
    recipientName: 'Ramesh Sharma',
    text: 'Hello Mr. Sharma, Ananya has excelled in her poetry recitations this week! A quick reminder that the Solar System art project is due on October 6.',
    timestamp: 'Today at 08:50 AM',
    isMine: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    targetRole: 'principal',
    title: 'Low Attendance Alert',
    message: 'Grade 10A student Kabir Verma has dropped below 75% threshold (currently 74.2%).',
    timestamp: '15 mins ago',
    read: false,
    targetModule: 'attendance',
    priority: 'urgent'
  },
  {
    id: 'notif-2',
    targetRole: 'principal',
    title: 'Outstanding Fee Balance',
    message: '$7,500 pending in Grade 10 fees for Term 1.',
    timestamp: '1 hour ago',
    read: false,
    targetModule: 'finance',
    priority: 'normal'
  },
  {
    id: 'notif-3',
    targetRole: 'vice_principal',
    title: 'Pending Marks Submission',
    message: 'Term 1 Grade 10B Science evaluation marks are awaiting submission from Ms. Sunita Rao.',
    timestamp: '45 mins ago',
    read: false,
    targetModule: 'marks',
    priority: 'urgent'
  },
  {
    id: 'notif-4',
    targetRole: 'vice_principal',
    title: 'Academic Alert: Grade 10A Math',
    message: 'Kabir Verma scored 28/50 in Science Mid-Term. Remedial session recommended.',
    timestamp: '2 hours ago',
    read: false,
    targetModule: 'academics',
    priority: 'normal'
  },
  {
    id: 'notif-5',
    targetRole: 'teacher',
    title: 'Assignment Submissions Due',
    message: '13 students in Grade 10A have pending submissions for Linear Quadratic Systems.',
    timestamp: '20 mins ago',
    read: false,
    targetModule: 'assignments',
    priority: 'normal'
  },
  {
    id: 'notif-6',
    targetRole: 'accountant',
    title: 'Overdue Fee Notice Triggered',
    message: 'Kabir Verma (Grade 10A) fee is 26 days overdue ($2,600 pending).',
    timestamp: '30 mins ago',
    read: false,
    targetModule: 'pending_fees',
    priority: 'urgent'
  },
  {
    id: 'notif-7',
    targetRole: 'receptionist',
    title: 'New Online Admission Enquiry',
    message: 'Enquiry received for Grade 6 from Farah Siddiqui (Walk-in expected).',
    timestamp: '10 mins ago',
    read: false,
    targetModule: 'enquiries',
    priority: 'normal'
  },
  {
    id: 'notif-8',
    targetRole: 'librarian',
    title: 'Overdue Book Return Notice',
    message: 'The Illustrated Encyclopedia of World History was due on Sept 16 from Kabir Verma.',
    timestamp: '25 mins ago',
    read: false,
    targetModule: 'due_books',
    priority: 'urgent'
  },
  {
    id: 'notif-9',
    targetRole: 'parent_mobile',
    title: 'Attendance Verified',
    message: 'Aarav marked PRESENT today at 08:32 AM.',
    timestamp: '40 mins ago',
    read: false,
    targetModule: 'attendance',
    priority: 'normal'
  },
  {
    id: 'notif-10',
    targetRole: 'parent_mobile',
    title: 'New Assignment Added',
    message: 'Dr. Vikram Sharma assigned Linear Equations Exercise due Oct 3.',
    timestamp: '1 hour ago',
    read: false,
    targetModule: 'academics',
    priority: 'normal'
  },
  {
    id: 'notif-11',
    targetRole: 'hr',
    title: 'Staff Leave Request Pending',
    message: 'Ms. Sunita Rao submitted a Medical Leave application for Oct 12.',
    timestamp: '35 mins ago',
    read: false,
    targetModule: 'leave_requests',
    priority: 'urgent'
  },
  {
    id: 'notif-12',
    targetRole: 'transport',
    title: 'Route 4 Morning Schedule Delay',
    message: 'Bus #04 delayed 12 minutes due to arterial road construction on Pine Ridge.',
    timestamp: '18 mins ago',
    read: false,
    targetModule: 'live_tracking',
    priority: 'urgent'
  },
  {
    id: 'notif-13',
    targetRole: 'exam_coordinator',
    title: 'Term 1 Seating Matrix Generated',
    message: 'Examination hall allocations for Hall A & B are ready for invigilator sign-off.',
    timestamp: '50 mins ago',
    read: false,
    targetModule: 'invigilation',
    priority: 'normal'
  },
  {
    id: 'notif-14',
    targetRole: 'parent',
    title: 'Term 1 Exam Timetable Available',
    message: 'Official assessment schedule published. Please check Aarav and Ananya’s hall tickets.',
    timestamp: '2 hours ago',
    read: false,
    targetModule: 'academics',
    priority: 'normal'
  }
];

export const INITIAL_CHILDREN: Record<'aarav' | 'ananya', ChildProfile> = {
  aarav: {
    id: 'aarav',
    studentId: 'std-8a-01',
    name: 'Aarav Sharma',
    grade: 'Grade 8',
    section: 'A',
    rollNo: 1,
    admissionId: 'GIS-2024-0812',
    classTeacher: 'Dr. Vikram Sharma',
    attendancePercentage: 96.2,
    presentDays: 114,
    absentDays: 3,
    lateDays: 2,
    overallGrade: 'A+',
    overallScore: 93.4,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    subjects: [
      {
        subject: 'Mathematics',
        score: 95,
        grade: 'A+',
        teacher: 'Dr. Vikram Sharma',
        feedback: 'Exceptional logical rigor, rapid conceptual grasp in algebraic proofs.'
      },
      {
        subject: 'Science',
        score: 92,
        grade: 'A+',
        teacher: 'Ms. Sunita Rao',
        feedback: 'Consistently thorough lab work and insightful scientific queries.'
      },
      {
        subject: 'Computer Science',
        score: 96,
        grade: 'A+',
        teacher: 'Mr. Rajesh Nair',
        feedback: 'Top performer in Python programming algorithms.'
      },
      {
        subject: 'English',
        score: 88,
        grade: 'A',
        teacher: 'Ms. Priya Sen',
        feedback: 'Strong analytical essays and articulate participation in debates.'
      },
      {
        subject: 'Social Science',
        score: 91,
        grade: 'A+',
        teacher: 'Ms. Anita Desai',
        feedback: 'In-depth historical context and map reading mastery.'
      }
    ],
    monthlyAttendance: [
      { month: 'Jun', rate: 98 },
      { month: 'Jul', rate: 95 },
      { month: 'Aug', rate: 97 },
      { month: 'Sep', rate: 96 }
    ],
    todaySchedule: [
      { period: 'Period 1', time: '08:30 - 09:15', subject: 'Mathematics', teacher: 'Dr. Vikram Sharma', room: 'Room 108' },
      { period: 'Period 2', time: '09:20 - 10:05', subject: 'Science', teacher: 'Mrs. Meera Patel', room: 'Lab 1' },
      { period: 'Period 3', time: '10:25 - 11:10', subject: 'English', teacher: 'Ms. Priya Sen', room: 'Room 108' },
      { period: 'Period 4', time: '11:15 - 12:00', subject: 'Computer Science', teacher: 'Mr. Rajesh Nair', room: 'CS Lab 1' },
      { period: 'Period 5', time: '12:45 - 01:30', subject: 'Physical Ed', teacher: 'Coach Roberts', room: 'Sports Complex' }
    ],
    fees: {
      total: 3400,
      paid: 3400,
      pending: 0,
      dueDate: '2026-09-15',
      status: 'Paid'
    }
  },
  ananya: {
    id: 'ananya',
    studentId: 'std-5b-01',
    name: 'Ananya Sharma',
    grade: 'Grade 5',
    section: 'B',
    rollNo: 4,
    admissionId: 'GIS-2026-0523',
    classTeacher: 'Ms. Priya Sen',
    attendancePercentage: 91.3,
    presentDays: 102,
    absentDays: 8,
    lateDays: 3,
    overallGrade: 'A',
    overallScore: 88.5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    subjects: [
      {
        subject: 'English',
        score: 96,
        grade: 'A+',
        teacher: 'Ms. Priya Sen',
        feedback: 'Outstanding storytelling, expressive reading voice, and neat cursive.'
      },
      {
        subject: 'Environmental Science',
        score: 87,
        grade: 'A',
        teacher: 'Ms. Priya Sen',
        feedback: 'Very curious about flora and fauna ecosystems.'
      },
      {
        subject: 'Mathematics',
        score: 82,
        grade: 'B+',
        teacher: 'Mr. David Wright',
        feedback: 'Good with multiplication tables; working on multi-digit division.'
      },
      {
        subject: 'Art & Craft',
        score: 98,
        grade: 'A+',
        teacher: 'Ms. Clara Vance',
        feedback: 'Tremendous creative vision, vibrant watercolor work.'
      }
    ],
    monthlyAttendance: [
      { month: 'Jun', rate: 94 },
      { month: 'Jul', rate: 89 },
      { month: 'Aug', rate: 92 },
      { month: 'Sep', rate: 91 }
    ],
    todaySchedule: [
      { period: 'Period 1', time: '08:45 - 09:30', subject: 'English Reading', teacher: 'Ms. Priya Sen', room: 'Junior Block 12' },
      { period: 'Period 2', time: '09:35 - 10:20', subject: 'Mathematics', teacher: 'Mr. David Wright', room: 'Junior Block 12' },
      { period: 'Period 3', time: '10:40 - 11:25', subject: 'Environmental Studies', teacher: 'Ms. Priya Sen', room: 'Junior Block 12' },
      { period: 'Period 4', time: '11:30 - 12:15', subject: 'Art & Craft Studio', teacher: 'Ms. Clara Vance', room: 'Studio 3' }
    ],
    fees: {
      total: 3100,
      paid: 2000,
      pending: 1100,
      dueDate: '2026-10-15',
      status: 'Partially Paid'
    }
  }
};

export const INITIAL_PROFILES: Record<string, UserProfile> = {
  principal: {
    id: 'usr-pr-1',
    role: 'principal',
    fullName: 'Dr. Arthur Campbell',
    title: 'Principal & Executive Head of School',
    email: 'principal@greenfield.edu',
    phone: '+1 (555) 019-4401',
    schoolName: 'Greenfield International School',
    avatarText: 'AC',
    accountStatus: 'Active',
    userId: 'EMP-PR-001',
    department: 'Executive Directorate & Board of Governors',
    officeLocation: 'Principal Executive Suite A-101',
    qualifications: 'Ph.D. in Educational Leadership (Columbia), M.Ed, B.Sc',
    specialization: 'Institutional Policy, Accreditation & Faculty Governance',
    administrativeScope: 'Full School Authority (6 Divisions, 54 Staff, 140+ Students)',
    emergencyContact: '+1 (555) 019-9911',
    preferences: {
      notificationsEmail: true,
      notificationsSms: true,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  vice_principal: {
    id: 'usr-vp-1',
    role: 'vice_principal',
    fullName: 'Mrs. Evelyn Hayes',
    title: 'Vice Principal & Academic Coordinator',
    email: 'evelyn.hayes@greenfield.edu',
    phone: '+1 (555) 019-4402',
    schoolName: 'Greenfield International School',
    avatarText: 'EH',
    accountStatus: 'Active',
    userId: 'EMP-VP-002',
    department: 'Academic Coordination & Curricular Directorate',
    officeLocation: 'Academic Coordination Wing B-101',
    qualifications: 'M.Sc. in Curriculum Design & Instruction, B.Ed, M.A',
    specialization: 'Curriculum Harmonization, Moderation & Timetable Matrix',
    administrativeScope: 'Curricular Operations & Faculty Oversight (5 Academic Disciplines)',
    emergencyContact: '+1 (555) 019-9912',
    preferences: {
      notificationsEmail: true,
      notificationsSms: false,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  teacher: {
    id: 'usr-tc-1',
    role: 'teacher',
    fullName: 'Dr. Vikram Sharma',
    title: 'Head of Mathematics / Class Mentor 10A',
    email: 'vikram.sharma@greenfield.edu',
    phone: '+1 (555) 201-4411',
    schoolName: 'Greenfield International School',
    avatarText: 'VS',
    accountStatus: 'Active',
    userId: 'EMP-TC-104',
    department: 'Mathematics & Senior STEM Faculty',
    officeLocation: 'Faculty Block B-102',
    qualifications: 'Ph.D. in Applied Mathematics (UC Berkeley), B.Ed',
    specialization: 'Algebraic Geometry & Calculus Olympiad Coaching',
    assignedClasses: ['Grade 10A (Class Mentor)', 'Grade 10B', 'Grade 9A', 'Grade 8A'],
    subjects: ['Mathematics', 'Advanced Statistics', 'Linear Algebra'],
    emergencyContact: '+1 (555) 201-9988',
    preferences: {
      notificationsEmail: true,
      notificationsSms: false,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  accountant: {
    id: 'usr-ac-1',
    role: 'accountant',
    fullName: 'Alok Saxena',
    title: 'Chief Bursar & Senior Financial Controller',
    email: 'accounts@greenfield.edu',
    phone: '+1 (555) 500-1102',
    schoolName: 'Greenfield International School',
    avatarText: 'AS',
    accountStatus: 'Active',
    userId: 'EMP-AC-201',
    department: 'Accounts, Bursary & Financial Administration',
    officeLocation: 'Bursar Suite C-12 (Main Administrative Wing)',
    qualifications: 'Chartered Accountant (FCA), B.Com (Hons), CPA',
    specialization: 'Tuition Auditing, Ledger Reconciliation, Statutory Compliance',
    approvalLimit: '$50,000 Disbursement Authorization',
    shiftHours: '08:00 AM - 05:00 PM (Monday - Friday)',
    emergencyContact: '+1 (555) 500-9933',
    preferences: {
      notificationsEmail: true,
      notificationsSms: true,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  receptionist: {
    id: 'usr-rc-1',
    role: 'receptionist',
    fullName: 'Kavita Chawla',
    title: 'Head Receptionist & Admissions Desk Lead',
    email: 'kavita.frontdesk@greenfield.edu',
    phone: '+1 (555) 500-1101',
    schoolName: 'Greenfield International School',
    avatarText: 'KC',
    accountStatus: 'Active',
    userId: 'EMP-RC-301',
    department: 'Front Office & Campus Visitor Operations',
    officeLocation: 'Main Entrance Reception Station 1',
    qualifications: 'B.A. in Communications & Public Relations',
    specialization: 'Visitor Security Screening, Parent Appointments, Admissions Intake',
    shiftHours: '07:30 AM - 04:30 PM (Campus Gate Hours)',
    emergencyContact: '+1 (555) 500-9944',
    preferences: {
      notificationsEmail: true,
      notificationsSms: false,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  librarian: {
    id: 'usr-lb-1',
    role: 'librarian',
    fullName: 'Nandini Krishnan',
    title: 'Head of Learning Commons & Head Librarian',
    email: 'library@greenfield.edu',
    phone: '+1 (555) 500-1103',
    schoolName: 'Greenfield International School',
    avatarText: 'NK',
    accountStatus: 'Active',
    userId: 'EMP-LB-401',
    department: 'Library, Media Center & Learning Commons',
    officeLocation: 'Central Media Commons Desk R-1',
    qualifications: 'Master of Library and Information Science (M.L.I.S.)',
    specialization: 'Digital Archiving, Dewey & ISBN Systems, Rare Manuscript Preservation',
    shiftHours: '08:00 AM - 04:30 PM (Library Stacks Clearance)',
    emergencyContact: '+1 (555) 500-9955',
    preferences: {
      notificationsEmail: true,
      notificationsSms: false,
      notificationsPush: false,
      language: 'English (US)',
      theme: 'light'
    }
  },
  transport: {
    id: 'usr-tr-1',
    role: 'transport',
    fullName: 'Gurpreet Singh',
    title: 'Director of Transport & Fleet Logistics',
    email: 'transport@greenfield.edu',
    phone: '+1 (555) 500-1106',
    schoolName: 'Greenfield International School',
    avatarText: 'GS',
    accountStatus: 'Active',
    userId: 'EMP-TR-501',
    department: 'Transport, Safety & Fleet Operations',
    officeLocation: 'Fleet Dispatch Control Depot, Gate 3',
    qualifications: 'B.Tech in Automotive Engineering, Certified Fleet Safety Director (CFSD)',
    specialization: 'Fleet Route Optimization, Student Commute Safety, Heavy Vehicle Maintenance Protocols',
    shiftHours: '06:00 AM - 03:30 PM (Morning & Afternoon Bus Dispatch)',
    emergencyContact: '+1 (555) 500-9966 (Deputy Dispatcher: Harish Rawat)',
    preferences: {
      notificationsEmail: true,
      notificationsSms: true,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  teacher_mobile: {
    id: 'usr-tc-mob',
    role: 'teacher_mobile',
    fullName: 'Dr. Vikram Sharma',
    title: 'Head of Mathematics (Mobile Assistant)',
    email: 'vikram.sharma@greenfield.edu',
    phone: '+1 (555) 201-4411',
    schoolName: 'Greenfield International School',
    avatarText: 'VS',
    accountStatus: 'Active',
    userId: 'EMP-TC-104',
    department: 'Mathematics & Senior STEM Faculty',
    officeLocation: 'Faculty Block B-102',
    qualifications: 'Ph.D. in Applied Mathematics (UC Berkeley), B.Ed',
    specialization: 'Handheld Attendance & Class Diagnostics',
    assignedClasses: ['Grade 10A (Class Mentor)', 'Grade 10B', 'Grade 9A', 'Grade 8A'],
    subjects: ['Mathematics', 'Advanced Statistics'],
    emergencyContact: '+1 (555) 201-9988',
    preferences: {
      notificationsEmail: true,
      notificationsSms: false,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  parent_mobile: {
    id: 'usr-par-1',
    role: 'parent_mobile',
    fullName: 'Ramesh Sharma',
    title: 'Parent & Primary Guardian',
    email: 'ramesh.sharma@example.com',
    phone: '+1 (555) 349-2180',
    schoolName: 'Greenfield International School',
    avatarText: 'RS',
    accountStatus: 'Active',
    userId: 'PAR-2024-881',
    relationship: 'Father / Primary Guardian',
    childrenNames: ['Aarav Sharma (Grade 8A, Admission GIS-2024-0812)', 'Ananya Sharma (Grade 5B, Admission GIS-2026-0523)'],
    residentialAddress: '42 Pine Crest Avenue, Greenfield Campus District',
    emergencyContact: '+1 (555) 349-9922 (Spouse: Sunita Sharma)',
    preferences: {
      notificationsEmail: true,
      notificationsSms: true,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  },
  exam_coordinator: {
    id: 'usr-ec-1',
    role: 'exam_coordinator',
    fullName: 'Dr. Marcus Brody',
    title: 'Director of Academic Examinations & Assessment Moderation',
    email: 'exams@greenfield.edu',
    phone: '+1 (555) 500-1107',
    schoolName: 'Greenfield International School',
    avatarText: 'MB',
    accountStatus: 'Active',
    userId: 'EMP-EC-601',
    department: 'Examination Directorate & Curricular Assessment Board',
    officeLocation: 'Examination Control Suite B-204',
    qualifications: 'Ph.D. in Educational Measurement & Psychometrics, M.Sc, B.Ed',
    specialization: 'Terminal Board Examination Design, Statistical Moderation & Question Bank Governance',
    shiftHours: '08:00 AM - 04:30 PM (Examination Chamber Protocol)',
    emergencyContact: '+1 (555) 500-9977 (Deputy Controller: Evelyn Hayes)',
    preferences: {
      notificationsEmail: true,
      notificationsSms: true,
      notificationsPush: true,
      language: 'English (US)',
      theme: 'light'
    }
  }
};

export const INITIAL_AUDIT_LOGS: import('../types').AuditLogEntry[] = [
  { id: 'aud-1', timestamp: '2026-10-14 08:30:15', actorRole: 'principal', actorName: 'Dr. Arthur Campbell', action: 'SESSION_START', module: 'auth', recordRef: 'ADMIN-PORTAL', status: 'SUCCESS', reason: 'Routine morning institutional oversight' },
  { id: 'aud-2', timestamp: '2026-10-14 08:45:22', actorRole: 'receptionist', actorName: 'Kavita Chawla', action: 'VISITOR_CHECK_IN', module: 'visitors', recordRef: 'VIS-081', status: 'SUCCESS', reason: 'Issued campus pass to Dr. Alok Nath' },
  { id: 'aud-3', timestamp: '2026-10-14 09:05:40', actorRole: 'teacher', actorName: 'Dr. Vikram Sharma', action: 'ATTENDANCE_SUBMIT', module: 'attendance', recordRef: 'class-10a', status: 'SUCCESS', reason: 'Period 1 Roll Call registered' },
  { id: 'aud-4', timestamp: '2026-10-14 09:15:10', actorRole: 'accountant', actorName: 'Alok Saxena', action: 'PAYMENT_RECORD', module: 'payments', recordRef: 'RCP-2026-894', status: 'SUCCESS', reason: 'Tuition installment fee collected via UPI' },
  { id: 'aud-5', timestamp: '2026-10-14 09:22:04', actorRole: 'librarian', actorName: 'Nandini Krishnan', action: 'BOOK_ISSUE', module: 'library', recordRef: 'bk-1', status: 'SUCCESS', reason: 'Concepts of Physics issued to Rohan Mehra' }
];


