import {
  AcademicYear,
  SubjectItem,
  SubjectAllocation,
  PeriodConfig,
  TimetableEntry,
  TimetableVersion,
  TimetableConflict
} from '../types';

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  {
    id: 'ay-2026-2027',
    name: 'Academic Year 2026–2027',
    startDate: '2026-08-15',
    endDate: '2027-05-30',
    status: 'Active',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidaysCount: 24,
    terms: [
      {
        id: 'term-1',
        name: 'Term 1 (Autumn & Winter)',
        startDate: '2026-08-15',
        endDate: '2026-12-20',
        examStartDate: '2026-11-20',
        examEndDate: '2026-12-05'
      },
      {
        id: 'term-2',
        name: 'Term 2 (Spring & Summer)',
        startDate: '2027-01-10',
        endDate: '2027-05-30',
        examStartDate: '2027-05-01',
        examEndDate: '2027-05-18'
      }
    ]
  },
  {
    id: 'ay-2025-2026',
    name: 'Academic Year 2025–2026',
    startDate: '2025-08-15',
    endDate: '2026-05-30',
    status: 'Archived',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidaysCount: 26,
    terms: [
      {
        id: 'term-1-old',
        name: 'Term 1',
        startDate: '2025-08-15',
        endDate: '2025-12-20',
        examStartDate: '2025-11-25',
        examEndDate: '2025-12-10'
      },
      {
        id: 'term-2-old',
        name: 'Term 2',
        startDate: '2026-01-10',
        endDate: '2026-05-30',
        examStartDate: '2026-05-02',
        examEndDate: '2026-05-20'
      }
    ]
  },
  {
    id: 'ay-2027-2028',
    name: 'Academic Year 2027–2028 (Planning)',
    startDate: '2027-08-16',
    endDate: '2028-05-31',
    status: 'Upcoming',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    holidaysCount: 22,
    terms: [
      {
        id: 'term-1-plan',
        name: 'Term 1',
        startDate: '2027-08-16',
        endDate: '2027-12-22',
        examStartDate: '2027-11-22',
        examEndDate: '2027-12-07'
      },
      {
        id: 'term-2-plan',
        name: 'Term 2',
        startDate: '2028-01-10',
        endDate: '2028-05-31',
        examStartDate: '2028-05-05',
        examEndDate: '2028-05-22'
      }
    ]
  }
];

export const INITIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'sub-math',
    code: 'MTH-10',
    name: 'Mathematics',
    category: 'Core Academic',
    applicableGrades: ['8', '9', '10'],
    departmentHodId: 't-1',
    departmentHodName: 'Dr. Vikram Sharma',
    periodsPerWeek: 6,
    textbook: 'Oxford Advanced Mathematics Edition IV',
    description: 'Algebra, Trigonometry, Euclidean Geometry, and Data Statistics.',
    status: 'Active'
  },
  {
    id: 'sub-sci',
    code: 'SCI-10',
    name: 'Science (Physics & Chemistry)',
    category: 'Science & Lab',
    applicableGrades: ['8', '9', '10'],
    departmentHodId: 't-2',
    departmentHodName: 'Ms. Sunita Rao',
    periodsPerWeek: 5,
    textbook: 'Cambridge Integrated Science Foundations',
    description: 'Mechanics, Optics, Thermodynamics, Chemical Bonding, and Lab Practicals.',
    status: 'Active'
  },
  {
    id: 'sub-eng',
    code: 'ENG-10',
    name: 'English & World Literature',
    category: 'Humanities',
    applicableGrades: ['5', '7', '8', '9', '10'],
    departmentHodId: 't-6',
    departmentHodName: 'Ms. Priya Sen',
    periodsPerWeek: 5,
    textbook: 'Norton Anthology of Young World Literature',
    description: 'Critical textual analysis, compositional rhetoric, and creative writing.',
    status: 'Active'
  },
  {
    id: 'sub-cs',
    code: 'CS-10',
    name: 'Computer Science & AI',
    category: 'Technology',
    applicableGrades: ['8', '9', '10'],
    departmentHodId: 't-3',
    departmentHodName: 'Mr. Rajesh Nair',
    periodsPerWeek: 4,
    textbook: 'Python & Robotics Foundation Courseware',
    description: 'Algorithms, Data Structures, Python programming, and introductory AI ethics.',
    status: 'Active'
  },
  {
    id: 'sub-soc',
    code: 'SOC-10',
    name: 'Social Sciences & Civics',
    category: 'Humanities',
    applicableGrades: ['7', '8', '9', '10'],
    departmentHodId: 't-4',
    departmentHodName: 'Ms. Anita Desai',
    periodsPerWeek: 4,
    textbook: 'Global Heritage, Economic Systems & Civic Law',
    description: 'Modern World History, Human Geography, Constitution, and Democratic institutions.',
    status: 'Active'
  },
  {
    id: 'sub-pe',
    code: 'PE-01',
    name: 'Physical Education & Athletics',
    category: 'Arts & Physical Ed',
    applicableGrades: ['5', '7', '8', '9', '10'],
    departmentHodId: 't-7',
    departmentHodName: 'Coach David Roberts',
    periodsPerWeek: 2,
    textbook: 'National Physical Literacy & Fitness Manual',
    description: 'Cardiovascular conditioning, competitive track sports, and tactical teamwork.',
    status: 'Active'
  },
  {
    id: 'sub-art',
    code: 'ART-01',
    name: 'Visual Arts & Studio Design',
    category: 'Arts & Physical Ed',
    applicableGrades: ['5', '7', '8', '9'],
    departmentHodId: 't-6',
    departmentHodName: 'Ms. Priya Sen',
    periodsPerWeek: 2,
    textbook: 'Studio Drawing & Sculptural Form',
    description: 'Color theory, acrylic painting, digital illustration, and ceramic craft.',
    status: 'Active'
  }
];

export const INITIAL_SUBJECT_ALLOCATIONS: SubjectAllocation[] = [
  // Grade 10A
  {
    id: 'alloc-10a-math',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    periodsPerWeek: 6,
    room: 'Room 301'
  },
  {
    id: 'alloc-10a-sci',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    periodsPerWeek: 5,
    room: 'Science Lab 2'
  },
  {
    id: 'alloc-10a-eng',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    periodsPerWeek: 5,
    room: 'Room 301'
  },
  {
    id: 'alloc-10a-cs',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    periodsPerWeek: 4,
    room: 'CS Lab 1'
  },
  {
    id: 'alloc-10a-soc',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    periodsPerWeek: 4,
    room: 'Room 301'
  },
  {
    id: 'alloc-10a-pe',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    subjectId: 'sub-pe',
    subjectName: 'Physical Education & Athletics',
    teacherId: 't-7',
    teacherName: 'Coach David Roberts',
    periodsPerWeek: 2,
    room: 'Main Oval'
  },

  // Grade 10B
  {
    id: 'alloc-10b-math',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    periodsPerWeek: 6,
    room: 'Room 302'
  },
  {
    id: 'alloc-10b-sci',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    periodsPerWeek: 5,
    room: 'Science Lab 2'
  },
  {
    id: 'alloc-10b-eng',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    periodsPerWeek: 5,
    room: 'Room 302'
  },
  {
    id: 'alloc-10b-cs',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    periodsPerWeek: 4,
    room: 'CS Lab 1'
  },
  {
    id: 'alloc-10b-soc',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    periodsPerWeek: 4,
    room: 'Room 302'
  },

  // Grade 9A
  {
    id: 'alloc-9a-math',
    academicYearId: 'ay-2026-2027',
    classId: 'class-9a',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    periodsPerWeek: 5,
    room: 'Room 205'
  },
  {
    id: 'alloc-9a-sci',
    academicYearId: 'ay-2026-2027',
    classId: 'class-9a',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    periodsPerWeek: 5,
    room: 'Room 205'
  },
  {
    id: 'alloc-9a-eng',
    academicYearId: 'ay-2026-2027',
    classId: 'class-9a',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    periodsPerWeek: 5,
    room: 'Room 205'
  },
  {
    id: 'alloc-9a-cs',
    academicYearId: 'ay-2026-2027',
    classId: 'class-9a',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    periodsPerWeek: 4,
    room: 'CS Lab 1'
  },
  {
    id: 'alloc-9a-soc',
    academicYearId: 'ay-2026-2027',
    classId: 'class-9a',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    periodsPerWeek: 4,
    room: 'Room 205'
  },

  // Grade 8A
  {
    id: 'alloc-8a-math',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-5',
    teacherName: 'Mrs. Meera Patel',
    periodsPerWeek: 5,
    room: 'Room 108'
  },
  {
    id: 'alloc-8a-sci',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    periodsPerWeek: 5,
    room: 'Room 108'
  },
  {
    id: 'alloc-8a-eng',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    periodsPerWeek: 5,
    room: 'Room 108'
  },
  {
    id: 'alloc-8a-soc',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    periodsPerWeek: 4,
    room: 'Room 108'
  },
  {
    id: 'alloc-8a-cs',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    periodsPerWeek: 4,
    room: 'CS Lab 1'
  }
];

export const INITIAL_PERIODS: PeriodConfig[] = [
  {
    id: 'p-1',
    number: 1,
    name: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    type: 'Teaching',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'p-2',
    number: 2,
    name: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    type: 'Teaching',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'p-break',
    number: 0,
    name: 'Morning Recess',
    startTime: '10:05',
    endTime: '10:25',
    type: 'Break',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'p-3',
    number: 3,
    name: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    type: 'Teaching',
    displayOrder: 4,
    isActive: true
  },
  {
    id: 'p-4',
    number: 4,
    name: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    type: 'Teaching',
    displayOrder: 5,
    isActive: true
  },
  {
    id: 'p-lunch',
    number: 0,
    name: 'Lunch Break',
    startTime: '12:00',
    endTime: '12:45',
    type: 'Lunch',
    displayOrder: 6,
    isActive: true
  },
  {
    id: 'p-5',
    number: 5,
    name: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    type: 'Teaching',
    displayOrder: 7,
    isActive: true
  },
  {
    id: 'p-6',
    number: 6,
    name: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    type: 'Teaching',
    displayOrder: 8,
    isActive: true
  }
];

export const INITIAL_TIMETABLE_VERSIONS: TimetableVersion[] = [
  {
    id: 'tv-10a-v1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    versionNumber: '1.0',
    status: 'Published',
    effectiveDate: '2026-08-15',
    lastUpdated: '2026-08-12 14:30',
    updatedBy: 'Mrs. Evelyn Hayes (Vice Principal)',
    notes: 'Official approved timetable for Term 1.'
  },
  {
    id: 'tv-10b-v1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    versionNumber: '1.0',
    status: 'Published',
    effectiveDate: '2026-08-15',
    lastUpdated: '2026-08-12 14:35',
    updatedBy: 'Mrs. Evelyn Hayes (Vice Principal)',
    notes: 'Official approved timetable for Term 1.'
  },
  {
    id: 'tv-9a-v1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-9a',
    versionNumber: '1.0',
    status: 'Published',
    effectiveDate: '2026-08-15',
    lastUpdated: '2026-08-12 14:40',
    updatedBy: 'Mrs. Evelyn Hayes (Vice Principal)',
    notes: 'Official approved timetable for Term 1.'
  },
  {
    id: 'tv-8a-v1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    versionNumber: '1.0',
    status: 'Published',
    effectiveDate: '2026-08-15',
    lastUpdated: '2026-08-12 14:45',
    updatedBy: 'Mrs. Evelyn Hayes (Vice Principal)',
    notes: 'Official approved timetable for Term 1.'
  }
];

export const INITIAL_TIMETABLE_ENTRIES: TimetableEntry[] = [
  // ===================== GRADE 10A (class-10a) =====================
  // Monday
  {
    id: 'tt-10a-mon-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published',
    notes: 'Quadratic equations & theorem review'
  },
  {
    id: 'tt-10a-mon-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published',
    notes: 'Refraction optics experiment'
  },
  {
    id: 'tt-10a-mon-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 301',
    status: 'Published',
    notes: 'Shakespearean drama analysis'
  },
  {
    id: 'tt-10a-mon-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published',
    notes: 'Binary search tree lab'
  },
  {
    id: 'tt-10a-mon-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 301',
    status: 'Published',
    notes: 'Constitutional framework'
  },
  {
    id: 'tt-10a-mon-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-pe',
    subjectName: 'Physical Education & Athletics',
    teacherId: 't-7',
    teacherName: 'Coach David Roberts',
    room: 'Main Oval',
    status: 'Published',
    notes: 'Track stamina drills'
  },

  // Tuesday
  {
    id: 'tt-10a-tue-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Tuesday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published'
  },
  {
    id: 'tt-10a-tue-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Tuesday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-tue-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Tuesday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published'
  },
  {
    id: 'tt-10a-tue-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Tuesday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-tue-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Tuesday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-tue-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Tuesday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },

  // Wednesday
  {
    id: 'tt-10a-wed-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Wednesday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-wed-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Wednesday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-wed-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Wednesday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published'
  },
  {
    id: 'tt-10a-wed-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Wednesday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-wed-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Wednesday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published'
  },
  {
    id: 'tt-10a-wed-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Wednesday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-pe',
    subjectName: 'Physical Education & Athletics',
    teacherId: 't-7',
    teacherName: 'Coach David Roberts',
    room: 'Main Oval',
    status: 'Published'
  },

  // Thursday
  {
    id: 'tt-10a-thu-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Thursday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-thu-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Thursday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published'
  },
  {
    id: 'tt-10a-thu-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Thursday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-thu-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Thursday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published'
  },
  {
    id: 'tt-10a-thu-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Thursday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-thu-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Thursday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 301',
    status: 'Published'
  },

  // Friday
  {
    id: 'tt-10a-fri-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Friday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published'
  },
  {
    id: 'tt-10a-fri-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Friday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-fri-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Friday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-fri-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Friday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 301',
    status: 'Published'
  },
  {
    id: 'tt-10a-fri-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Friday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published'
  },
  {
    id: 'tt-10a-fri-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10a',
    section: 'A',
    dayOfWeek: 'Friday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 301',
    status: 'Published'
  },

  // ===================== GRADE 10B (class-10b) =====================
  // Monday
  {
    id: 'tt-10b-mon-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Monday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-mon-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Monday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-mon-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Monday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-mon-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Monday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-mon-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Monday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-mon-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Monday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published'
  },

  // Tuesday
  {
    id: 'tt-10b-tue-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Tuesday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-tue-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Tuesday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-tue-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Tuesday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-tue-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Tuesday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Room 302',
    status: 'Published'
  },
  {
    id: 'tt-10b-tue-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Tuesday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published'
  },
  {
    id: 'tt-10b-tue-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-10b',
    section: 'B',
    dayOfWeek: 'Tuesday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 302',
    status: 'Published'
  },

  // ===================== GRADE 8A (class-8a) - Aarav's Class =====================
  {
    id: 'tt-8a-mon-1',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-1',
    periodName: 'Period 1',
    startTime: '08:30',
    endTime: '09:15',
    subjectId: 'sub-soc',
    subjectName: 'Social Sciences & Civics',
    teacherId: 't-4',
    teacherName: 'Ms. Anita Desai',
    room: 'Room 108',
    status: 'Published'
  },
  {
    id: 'tt-8a-mon-2',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-2',
    periodName: 'Period 2',
    startTime: '09:20',
    endTime: '10:05',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & AI',
    teacherId: 't-3',
    teacherName: 'Mr. Rajesh Nair',
    room: 'CS Lab 1',
    status: 'Published'
  },
  {
    id: 'tt-8a-mon-3',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-3',
    periodName: 'Period 3',
    startTime: '10:25',
    endTime: '11:10',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-5',
    teacherName: 'Mrs. Meera Patel',
    room: 'Room 108',
    status: 'Published'
  },
  {
    id: 'tt-8a-mon-4',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-4',
    periodName: 'Period 4',
    startTime: '11:15',
    endTime: '12:00',
    subjectId: 'sub-sci',
    subjectName: 'Science (Physics & Chemistry)',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    room: 'Science Lab 2',
    status: 'Published'
  },
  {
    id: 'tt-8a-mon-5',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-5',
    periodName: 'Period 5',
    startTime: '12:45',
    endTime: '13:30',
    subjectId: 'sub-eng',
    subjectName: 'English & World Literature',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    room: 'Room 108',
    status: 'Published'
  },
  {
    id: 'tt-8a-mon-6',
    academicYearId: 'ay-2026-2027',
    classId: 'class-8a',
    section: 'A',
    dayOfWeek: 'Monday',
    periodId: 'p-6',
    periodName: 'Period 6',
    startTime: '13:35',
    endTime: '14:20',
    subjectId: 'sub-pe',
    subjectName: 'Physical Education & Athletics',
    teacherId: 't-7',
    teacherName: 'Coach David Roberts',
    room: 'Main Oval',
    status: 'Published'
  }
];

export const AVAILABLE_ROOMS = [
  'Room 301',
  'Room 302',
  'Room 205',
  'Room 108',
  'Room 102',
  'Junior Block 12',
  'Science Lab 2',
  'Science Lab 1',
  'CS Lab 1',
  'CS Lab 2',
  'Main Oval',
  'Auditorium',
  'Library Study Hall'
];

/**
 * Checks for timetable conflicts according to enterprise school scheduling rules
 */
export function checkTimetableConflict(
  entry: Omit<TimetableEntry, 'id'>,
  allEntries: TimetableEntry[],
  currentEntryId?: string
): TimetableConflict[] {
  const conflicts: TimetableConflict[] = [];

  // Filter out the entry being updated if editing
  const otherEntries = allEntries.filter((e) => e.id !== currentEntryId);

  // Time conversion helper
  const parseMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const startA = parseMin(entry.startTime);
  const endA = parseMin(entry.endTime);

  if (endA <= startA) {
    conflicts.push({
      type: 'TimeRange',
      severity: 'blocking',
      title: 'Invalid Time Interval',
      message: `Lesson end time (${entry.endTime}) must be strictly after start time (${entry.startTime}).`
    });
  }

  for (const other of otherEntries) {
    // Only check if it's the same academic year and day of week
    if (other.academicYearId === entry.academicYearId && other.dayOfWeek === entry.dayOfWeek) {
      const startB = parseMin(other.startTime);
      const endB = parseMin(other.endTime);

      // Overlap condition: startA < endB && endA > startB
      const hasTimeOverlap = startA < endB && endA > startB;

      if (hasTimeOverlap) {
        // 1. Teacher Conflict: teacher cannot teach two classes simultaneously
        if (entry.teacherId && other.teacherId === entry.teacherId && entry.classId !== other.classId) {
          conflicts.push({
            type: 'Teacher',
            severity: 'blocking',
            title: 'Teacher Schedule Conflict',
            message: `${entry.teacherName} is already scheduled with another class during this time slot (${other.periodName}, ${other.startTime}–${other.endTime}).`,
            conflictingEntryId: other.id
          });
        }

        // 2. Class Conflict: same class cannot have 2 simultaneous lessons
        if (entry.classId === other.classId) {
          conflicts.push({
            type: 'Class',
            severity: 'blocking',
            title: 'Class Double-Booking Conflict',
            message: `This class already has ${other.subjectName} scheduled with ${other.teacherName} in ${other.room} during this time slot (${other.periodName}).`,
            conflictingEntryId: other.id
          });
        }

        // 3. Room Conflict: same physical room cannot host 2 different classes
        if (entry.room && other.room && entry.room === other.room && entry.classId !== other.classId) {
          conflicts.push({
            type: 'Room',
            severity: 'blocking',
            title: 'Classroom Space Conflict',
            message: `${entry.room} is already reserved by another class during this period (${other.startTime}–${other.endTime}).`,
            conflictingEntryId: other.id
          });
        }
      }

      // 4. Period Duplicate Check in same class
      if (entry.periodId === other.periodId && entry.classId === other.classId) {
        // If not already flagged by class conflict
        if (!conflicts.some((c) => c.type === 'Class' || c.type === 'Duplicate')) {
          conflicts.push({
            type: 'Duplicate',
            severity: 'blocking',
            title: 'Duplicate Period Assignment',
            message: `Period '${entry.periodName}' is already occupied in this class schedule on ${entry.dayOfWeek}.`,
            conflictingEntryId: other.id
          });
        }
      }
    }
  }

  return conflicts;
}
