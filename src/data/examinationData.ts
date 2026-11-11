import {
  Exam,
  MarkEntry,
  Assignment,
  Student,
  ClassInfo,
  Teacher
} from '../types';

export type ExamStatus =
  | 'Draft'
  | 'Scheduled'
  | 'Ongoing'
  | 'Completed'
  | 'Marks Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Published'
  | 'Archived';

export type StudentAssessmentStatus = 'Entered' | 'Not Entered' | 'Absent' | 'Exempt';

export interface ExamSession {
  id: string;
  examId: string;
  classId: string;
  className: string;
  section: string;
  subjectId: string;
  subjectName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  room: string;
  invigilatorTeacherId: string;
  invigilatorName: string;
  status: 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';
}

export interface SubjectAssessmentConfig {
  id: string;
  examId: string;
  classId: string;
  className: string;
  section: string;
  subjectId: string;
  subjectName: string;
  maxWrittenMarks: number;
  maxPracticalMarks: number;
  maxInternalMarks: number;
  totalMaxMarks: number;
  passingMarks: number;
  passingPercentage: number;
  assignedTeacherId: string;
  assignedTeacherName: string;
  status: 'Not Started' | 'Draft' | 'Submitted' | 'Under Review' | 'Returned' | 'Approved' | 'Published';
  submittedAt?: string;
  submittedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface DetailedExam extends Exam {
  academicYearId: string;
  applicableClassIds: string[];
  startDate: string;
  endDate: string;
  instructions: string;
  sessions: ExamSession[];
  subjectConfigs: SubjectAssessmentConfig[];
  publishedAt?: string;
  publishedBy?: string;
}

export interface DetailedMarkEntry extends MarkEntry {
  writtenMarks?: number;
  practicalMarks?: number;
  internalMarks?: number;
  assessmentStatus: StudentAssessmentStatus;
  isAbsent?: boolean;
  isExempt?: boolean;
  percentage?: number;
  admissionId?: string;
  rollNo?: number;
  updatedAt?: string;
  updatedBy?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: number;
  admissionId: string;
  status: 'Submitted' | 'Late' | 'Pending' | 'Graded';
  submittedDate?: string;
  marksObtained?: number;
  maxMarks?: number;
  grade?: string;
  feedback?: string;
  attachmentName?: string;
}

export interface DetailedAssignment extends Assignment {
  section?: string;
  maxMarks?: number;
  attachmentName?: string;
  attachmentSize?: string;
  instructions?: string;
  submissions: AssignmentSubmission[];
}

export interface GradeBoundary {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gpa: number;
  description: string;
  isPassing: boolean;
}

export const DEFAULT_GRADING_SCALE: GradeBoundary[] = [
  { grade: 'A+', minPercentage: 90, maxPercentage: 100, gpa: 4.0, description: 'Outstanding Academic Distinction', isPassing: true },
  { grade: 'A', minPercentage: 80, maxPercentage: 89, gpa: 3.7, description: 'Excellent Mastery of Concepts', isPassing: true },
  { grade: 'B', minPercentage: 70, maxPercentage: 79, gpa: 3.0, description: 'Proficient & Consistent', isPassing: true },
  { grade: 'C', minPercentage: 60, maxPercentage: 69, gpa: 2.3, description: 'Satisfactory Performance', isPassing: true },
  { grade: 'D', minPercentage: 40, maxPercentage: 59, gpa: 1.5, description: 'Minimum Passing Standard Met', isPassing: true },
  { grade: 'F', minPercentage: 0, maxPercentage: 39, gpa: 0.0, description: 'Below Minimum Standard — Remedial Recommended', isPassing: false }
];

export const calculateGradeFromPercentage = (
  percentage: number,
  scale: GradeBoundary[] = DEFAULT_GRADING_SCALE
): { grade: string; isPassing: boolean; description: string } => {
  const rounded = Math.round(percentage);
  const matched = scale.find(
    (b) => rounded >= b.minPercentage && rounded <= b.maxPercentage
  );
  if (matched) {
    return { grade: matched.grade, isPassing: matched.isPassing, description: matched.description };
  }
  return { grade: 'F', isPassing: false, description: 'Below standard' };
};

// ==========================================
// INITIAL DETAILED EXAMINATIONS
// ==========================================

export const INITIAL_DETAILED_EXAMS: DetailedExam[] = [
  {
    id: 'exam-term1-final',
    name: 'Term 1 Final Examination',
    term: 'Term 1',
    academicYearId: 'ay-2026-2027',
    applicableClassIds: ['class-10a', 'class-8a', 'class-5b'],
    startDate: '2026-10-12',
    endDate: '2026-10-24',
    instructions: 'Comprehensive summative assessment covering Term 1 syllabus. Calculators permitted for Mathematics Paper 2 only.',
    status: 'Published',
    publishedAt: '2026-10-01T09:00:00.000Z',
    publishedBy: 'Dr. Sarah Jenkins (Principal)',
    classId: 'class-10a',
    subject: 'All Core Subjects',
    date: '2026-10-12',
    time: '09:00 AM - 12:00 PM',
    room: 'Main Examination Hall',
    totalMarks: 100,
    sessions: [
      {
        id: 'sess-10a-math',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        date: '2026-10-12',
        startTime: '09:00',
        endTime: '12:00',
        durationMinutes: 180,
        room: 'Main Examination Hall',
        invigilatorTeacherId: 't-1',
        invigilatorName: 'Dr. Vikram Sharma',
        status: 'Completed'
      },
      {
        id: 'sess-10a-sci',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-sci',
        subjectName: 'Science (Physics & Chemistry)',
        date: '2026-10-14',
        startTime: '09:00',
        endTime: '12:00',
        durationMinutes: 180,
        room: 'Main Examination Hall',
        invigilatorTeacherId: 't-2',
        invigilatorName: 'Ms. Sunita Rao',
        status: 'Completed'
      },
      {
        id: 'sess-10a-eng',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-eng',
        subjectName: 'English & World Literature',
        date: '2026-10-16',
        startTime: '09:00',
        endTime: '11:30',
        durationMinutes: 150,
        room: 'Main Examination Hall',
        invigilatorTeacherId: 't-6',
        invigilatorName: 'Ms. Priya Sen',
        status: 'Completed'
      },
      {
        id: 'sess-10a-cs',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-cs',
        subjectName: 'Computer Science & AI',
        date: '2026-10-19',
        startTime: '09:00',
        endTime: '11:30',
        durationMinutes: 150,
        room: 'Computer Science Lab 1',
        invigilatorTeacherId: 't-3',
        invigilatorName: 'Mr. Rajesh Nair',
        status: 'Scheduled'
      },
      {
        id: 'sess-8a-math',
        examId: 'exam-term1-final',
        classId: 'class-8a',
        className: 'Grade 8A',
        section: 'A',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        date: '2026-10-12',
        startTime: '09:00',
        endTime: '11:30',
        durationMinutes: 150,
        room: 'Auditorium Annex',
        invigilatorTeacherId: 't-4',
        invigilatorName: 'Ms. Anita Desai',
        status: 'Completed'
      },
      {
        id: 'sess-5b-eng',
        examId: 'exam-term1-final',
        classId: 'class-5b',
        className: 'Grade 5B',
        section: 'B',
        subjectId: 'sub-eng',
        subjectName: 'English & Reading',
        date: '2026-10-14',
        startTime: '09:30',
        endTime: '11:00',
        durationMinutes: 90,
        room: 'Primary Wing 2',
        invigilatorTeacherId: 't-6',
        invigilatorName: 'Ms. Priya Sen',
        status: 'Completed'
      }
    ],
    subjectConfigs: [
      {
        id: 'cfg-t1-10a-math',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        maxWrittenMarks: 80,
        maxPracticalMarks: 0,
        maxInternalMarks: 20,
        totalMaxMarks: 100,
        passingMarks: 40,
        passingPercentage: 40,
        assignedTeacherId: 't-1',
        assignedTeacherName: 'Dr. Vikram Sharma',
        status: 'Published',
        submittedAt: '2026-10-15T14:30:00.000Z',
        submittedBy: 'Dr. Vikram Sharma',
        reviewedAt: '2026-10-16T10:00:00.000Z',
        reviewedBy: 'Mrs. Evelyn Hayes (Vice Principal)'
      },
      {
        id: 'cfg-t1-10a-sci',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-sci',
        subjectName: 'Science (Physics & Chemistry)',
        maxWrittenMarks: 70,
        maxPracticalMarks: 20,
        maxInternalMarks: 10,
        totalMaxMarks: 100,
        passingMarks: 40,
        passingPercentage: 40,
        assignedTeacherId: 't-2',
        assignedTeacherName: 'Ms. Sunita Rao',
        status: 'Published',
        submittedAt: '2026-10-16T11:00:00.000Z',
        submittedBy: 'Ms. Sunita Rao',
        reviewedAt: '2026-10-17T09:30:00.000Z',
        reviewedBy: 'Mrs. Evelyn Hayes (Vice Principal)'
      },
      {
        id: 'cfg-t1-10a-eng',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-eng',
        subjectName: 'English & World Literature',
        maxWrittenMarks: 80,
        maxPracticalMarks: 0,
        maxInternalMarks: 20,
        totalMaxMarks: 100,
        passingMarks: 40,
        passingPercentage: 40,
        assignedTeacherId: 't-6',
        assignedTeacherName: 'Ms. Priya Sen',
        status: 'Approved',
        submittedAt: '2026-10-17T15:00:00.000Z',
        submittedBy: 'Ms. Priya Sen',
        reviewedAt: '2026-10-18T11:20:00.000Z',
        reviewedBy: 'Mrs. Evelyn Hayes (Vice Principal)'
      },
      {
        id: 'cfg-t1-10a-cs',
        examId: 'exam-term1-final',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-cs',
        subjectName: 'Computer Science & AI',
        maxWrittenMarks: 60,
        maxPracticalMarks: 30,
        maxInternalMarks: 10,
        totalMaxMarks: 100,
        passingMarks: 40,
        passingPercentage: 40,
        assignedTeacherId: 't-3',
        assignedTeacherName: 'Mr. Rajesh Nair',
        status: 'Draft'
      },
      {
        id: 'cfg-t1-8a-math',
        examId: 'exam-term1-final',
        classId: 'class-8a',
        className: 'Grade 8A',
        section: 'A',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        maxWrittenMarks: 80,
        maxPracticalMarks: 0,
        maxInternalMarks: 20,
        totalMaxMarks: 100,
        passingMarks: 40,
        passingPercentage: 40,
        assignedTeacherId: 't-1',
        assignedTeacherName: 'Dr. Vikram Sharma',
        status: 'Published',
        submittedAt: '2026-10-15T16:00:00.000Z',
        submittedBy: 'Dr. Vikram Sharma',
        reviewedAt: '2026-10-16T11:00:00.000Z',
        reviewedBy: 'Mrs. Evelyn Hayes (Vice Principal)'
      },
      {
        id: 'cfg-t1-5b-eng',
        examId: 'exam-term1-final',
        classId: 'class-5b',
        className: 'Grade 5B',
        section: 'B',
        subjectId: 'sub-eng',
        subjectName: 'English & Reading',
        maxWrittenMarks: 80,
        maxPracticalMarks: 0,
        maxInternalMarks: 20,
        totalMaxMarks: 100,
        passingMarks: 40,
        passingPercentage: 40,
        assignedTeacherId: 't-6',
        assignedTeacherName: 'Ms. Priya Sen',
        status: 'Published',
        submittedAt: '2026-10-16T12:00:00.000Z',
        submittedBy: 'Ms. Priya Sen',
        reviewedAt: '2026-10-17T10:00:00.000Z',
        reviewedBy: 'Mrs. Evelyn Hayes (Vice Principal)'
      }
    ]
  },
  {
    id: 'exam-midterm',
    name: 'Mid-Term Progress Assessment',
    term: 'Mid-Term',
    academicYearId: 'ay-2026-2027',
    applicableClassIds: ['class-10a', 'class-8a'],
    startDate: '2026-09-18',
    endDate: '2026-09-25',
    instructions: 'Formative mid-term evaluation covering foundational modules.',
    status: 'Published',
    publishedAt: '2026-09-28T09:00:00.000Z',
    publishedBy: 'Dr. Sarah Jenkins (Principal)',
    classId: 'class-10a',
    subject: 'Core Science',
    date: '2026-09-18',
    time: '09:30 AM - 11:30 AM',
    room: 'Room 301',
    totalMarks: 50,
    sessions: [
      {
        id: 'sess-mid-10a-sci',
        examId: 'exam-midterm',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-sci',
        subjectName: 'Science',
        date: '2026-09-18',
        startTime: '09:30',
        endTime: '11:30',
        durationMinutes: 120,
        room: 'Room 301',
        invigilatorTeacherId: 't-2',
        invigilatorName: 'Ms. Sunita Rao',
        status: 'Completed'
      }
    ],
    subjectConfigs: [
      {
        id: 'cfg-mid-10a-sci',
        examId: 'exam-midterm',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-sci',
        subjectName: 'Science',
        maxWrittenMarks: 40,
        maxPracticalMarks: 10,
        maxInternalMarks: 0,
        totalMaxMarks: 50,
        passingMarks: 20,
        passingPercentage: 40,
        assignedTeacherId: 't-2',
        assignedTeacherName: 'Ms. Sunita Rao',
        status: 'Published'
      }
    ]
  },
  {
    id: 'exam-unit-test-2',
    name: 'Unit Test 2 (Algebra & Geometry)',
    term: 'Term 1',
    academicYearId: 'ay-2026-2027',
    applicableClassIds: ['class-8a'],
    startDate: '2026-09-22',
    endDate: '2026-09-22',
    instructions: 'One-hour classroom unit assessment testing coordinate geometry and linear systems.',
    status: 'Published',
    publishedAt: '2026-09-25T10:00:00.000Z',
    publishedBy: 'Dr. Sarah Jenkins (Principal)',
    classId: 'class-8a',
    subject: 'Mathematics',
    date: '2026-09-22',
    time: '10:00 AM - 11:00 AM',
    room: 'Room 108',
    totalMarks: 40,
    sessions: [
      {
        id: 'sess-ut2-8a-math',
        examId: 'exam-unit-test-2',
        classId: 'class-8a',
        className: 'Grade 8A',
        section: 'A',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        date: '2026-09-22',
        startTime: '10:00',
        endTime: '11:00',
        durationMinutes: 60,
        room: 'Room 108',
        invigilatorTeacherId: 't-1',
        invigilatorName: 'Dr. Vikram Sharma',
        status: 'Completed'
      }
    ],
    subjectConfigs: [
      {
        id: 'cfg-ut2-8a-math',
        examId: 'exam-unit-test-2',
        classId: 'class-8a',
        className: 'Grade 8A',
        section: 'A',
        subjectId: 'sub-math',
        subjectName: 'Mathematics',
        maxWrittenMarks: 35,
        maxPracticalMarks: 0,
        maxInternalMarks: 5,
        totalMaxMarks: 40,
        passingMarks: 16,
        passingPercentage: 40,
        assignedTeacherId: 't-1',
        assignedTeacherName: 'Dr. Vikram Sharma',
        status: 'Published'
      }
    ]
  },
  {
    id: 'exam-practical-sci',
    name: 'Senior Science Practical Examination',
    term: 'Term 1',
    academicYearId: 'ay-2026-2027',
    applicableClassIds: ['class-10a'],
    startDate: '2026-10-26',
    endDate: '2026-10-28',
    instructions: 'Laboratory practical evaluations: titration, optics bench experiments, and viva-voce.',
    status: 'Scheduled',
    classId: 'class-10a',
    subject: 'Science Practical',
    date: '2026-10-26',
    time: '01:30 PM - 03:30 PM',
    room: 'Physics & Chemistry Labs',
    totalMarks: 50,
    sessions: [
      {
        id: 'sess-prac-10a-sci',
        examId: 'exam-practical-sci',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-sci',
        subjectName: 'Science Practical',
        date: '2026-10-26',
        startTime: '13:30',
        endTime: '15:30',
        durationMinutes: 120,
        room: 'Science Lab 2',
        invigilatorTeacherId: 't-2',
        invigilatorName: 'Ms. Sunita Rao',
        status: 'Scheduled'
      }
    ],
    subjectConfigs: [
      {
        id: 'cfg-prac-10a-sci',
        examId: 'exam-practical-sci',
        classId: 'class-10a',
        className: 'Grade 10A',
        section: 'A',
        subjectId: 'sub-sci',
        subjectName: 'Science Practical',
        maxWrittenMarks: 10,
        maxPracticalMarks: 35,
        maxInternalMarks: 5,
        totalMaxMarks: 50,
        passingMarks: 20,
        passingPercentage: 40,
        assignedTeacherId: 't-2',
        assignedTeacherName: 'Ms. Sunita Rao',
        status: 'Not Started'
      }
    ]
  }
];

// ==========================================
// INITIAL DETAILED MARKS
// ==========================================

export const INITIAL_DETAILED_MARKS: DetailedMarkEntry[] = [
  // Grade 10A - Term 1 Final Mathematics (Max 100 = 80 Written + 20 Internal)
  {
    id: 'dmrk-10a-math-01',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Mathematics',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    admissionId: 'GIS-2024-001',
    rollNo: 1,
    writtenMarks: 74,
    practicalMarks: 0,
    internalMarks: 18,
    marksObtained: 92,
    totalMarks: 100,
    percentage: 92,
    grade: 'A+',
    assessmentStatus: 'Entered',
    remarks: 'Outstanding analytical proofs and calculus mastery.'
  },
  {
    id: 'dmrk-10a-math-02',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Mathematics',
    studentId: 'std-10a-02',
    studentName: 'Diya Kapoor',
    admissionId: 'GIS-2024-002',
    rollNo: 2,
    writtenMarks: 70,
    practicalMarks: 0,
    internalMarks: 18,
    marksObtained: 88,
    totalMarks: 100,
    percentage: 88,
    grade: 'A',
    assessmentStatus: 'Entered',
    remarks: 'Consistent precision in theorem formulation.'
  },
  {
    id: 'dmrk-10a-math-03',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Mathematics',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    admissionId: 'GIS-2024-003',
    rollNo: 3,
    writtenMarks: 48,
    practicalMarks: 0,
    internalMarks: 14,
    marksObtained: 62,
    totalMarks: 100,
    percentage: 62,
    grade: 'C',
    assessmentStatus: 'Entered',
    remarks: 'Shows progress; additional practice needed on quadratic roots.'
  },
  {
    id: 'dmrk-10a-math-04',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Mathematics',
    studentId: 'std-10a-04',
    studentName: 'Sara Khan',
    admissionId: 'GIS-2024-004',
    rollNo: 4,
    writtenMarks: 76,
    practicalMarks: 0,
    internalMarks: 19,
    marksObtained: 95,
    totalMarks: 100,
    percentage: 95,
    grade: 'A+',
    assessmentStatus: 'Entered',
    remarks: 'Exemplary problem-solving technique.'
  },

  // Grade 10A - Term 1 Final Science (Max 100 = 70 Written + 20 Practical + 10 Internal)
  {
    id: 'dmrk-10a-sci-01',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Science (Physics & Chemistry)',
    studentId: 'std-10a-01',
    studentName: 'Rohan Mehta',
    admissionId: 'GIS-2024-001',
    rollNo: 1,
    writtenMarks: 64,
    practicalMarks: 19,
    internalMarks: 9,
    marksObtained: 92,
    totalMarks: 100,
    percentage: 92,
    grade: 'A+',
    assessmentStatus: 'Entered',
    remarks: 'Excellent lab technique and analytical deduction.'
  },
  {
    id: 'dmrk-10a-sci-02',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Science (Physics & Chemistry)',
    studentId: 'std-10a-02',
    studentName: 'Diya Kapoor',
    admissionId: 'GIS-2024-002',
    rollNo: 2,
    writtenMarks: 66,
    practicalMarks: 20,
    internalMarks: 10,
    marksObtained: 96,
    totalMarks: 100,
    percentage: 96,
    grade: 'A+',
    assessmentStatus: 'Entered',
    remarks: 'Highest score in experimental optics lab.'
  },
  {
    id: 'dmrk-10a-sci-03',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Science (Physics & Chemistry)',
    studentId: 'std-10a-03',
    studentName: 'Kabir Verma',
    admissionId: 'GIS-2024-003',
    rollNo: 3,
    writtenMarks: 38,
    practicalMarks: 15,
    internalMarks: 7,
    marksObtained: 60,
    totalMarks: 100,
    percentage: 60,
    grade: 'C',
    assessmentStatus: 'Entered',
    remarks: 'Practical component completed satisfactorily; chemical balancing needs study.'
  },
  {
    id: 'dmrk-10a-sci-04',
    examId: 'exam-term1-final',
    classId: 'class-10a',
    subject: 'Science (Physics & Chemistry)',
    studentId: 'std-10a-04',
    studentName: 'Sara Khan',
    admissionId: 'GIS-2024-004',
    rollNo: 4,
    writtenMarks: 62,
    practicalMarks: 18,
    internalMarks: 9,
    marksObtained: 89,
    totalMarks: 100,
    percentage: 89,
    grade: 'A',
    assessmentStatus: 'Entered',
    remarks: 'Strong conceptual clarity across all sections.'
  },

  // Grade 8A - Term 1 Final Mathematics (Aarav Sharma - Linked Child)
  {
    id: 'dmrk-8a-math-01',
    examId: 'exam-term1-final',
    classId: 'class-8a',
    subject: 'Mathematics',
    studentId: 'std-8a-01',
    studentName: 'Aarav Sharma',
    admissionId: 'GIS-2024-008',
    rollNo: 1,
    writtenMarks: 75,
    practicalMarks: 0,
    internalMarks: 19,
    marksObtained: 94,
    totalMarks: 100,
    percentage: 94,
    grade: 'A+',
    assessmentStatus: 'Entered',
    remarks: 'Exceptional mathematical reasoning and rapid deduction.'
  },
  {
    id: 'dmrk-8a-math-02',
    examId: 'exam-term1-final',
    classId: 'class-8a',
    subject: 'Mathematics',
    studentId: 'std-8a-02',
    studentName: 'Meera Patel',
    admissionId: 'GIS-2024-009',
    rollNo: 2,
    writtenMarks: 68,
    practicalMarks: 0,
    internalMarks: 17,
    marksObtained: 85,
    totalMarks: 100,
    percentage: 85,
    grade: 'A',
    assessmentStatus: 'Entered',
    remarks: 'Solid grasp of linear expressions.'
  },
  {
    id: 'dmrk-8a-math-03',
    examId: 'exam-term1-final',
    classId: 'class-8a',
    subject: 'Mathematics',
    studentId: 'std-8a-03',
    studentName: 'Arjun Das',
    admissionId: 'GIS-2024-010',
    rollNo: 3,
    writtenMarks: 0,
    practicalMarks: 0,
    internalMarks: 0,
    marksObtained: null,
    totalMarks: 100,
    percentage: 0,
    grade: '—',
    assessmentStatus: 'Absent',
    isAbsent: true,
    remarks: 'Absent due to official regional sports tournament representation.'
  },
  {
    id: 'dmrk-8a-math-04',
    examId: 'exam-term1-final',
    classId: 'class-8a',
    subject: 'Mathematics',
    studentId: 'std-8a-04',
    studentName: 'Ananya Roy',
    admissionId: 'GIS-2024-011',
    rollNo: 4,
    writtenMarks: 71,
    practicalMarks: 0,
    internalMarks: 18,
    marksObtained: 89,
    totalMarks: 100,
    percentage: 89,
    grade: 'A',
    assessmentStatus: 'Entered',
    remarks: 'Very neat computation and thorough working steps.'
  },

  // Grade 5B - Term 1 Final English (Ananya Sharma - Linked Child)
  {
    id: 'dmrk-5b-eng-01',
    examId: 'exam-term1-final',
    classId: 'class-5b',
    subject: 'English & Reading',
    studentId: 'std-5b-01',
    studentName: 'Ananya Sharma',
    admissionId: 'GIS-2024-015',
    rollNo: 1,
    writtenMarks: 76,
    practicalMarks: 0,
    internalMarks: 19,
    marksObtained: 95,
    totalMarks: 100,
    percentage: 95,
    grade: 'A+',
    assessmentStatus: 'Entered',
    remarks: 'Wonderful creative prose and expressive comprehension.'
  },
  {
    id: 'dmrk-5b-eng-02',
    examId: 'exam-term1-final',
    classId: 'class-5b',
    subject: 'English & Reading',
    studentId: 'std-5b-02',
    studentName: 'Kunal Sen',
    admissionId: 'GIS-2024-016',
    rollNo: 2,
    writtenMarks: 65,
    practicalMarks: 0,
    internalMarks: 16,
    marksObtained: 81,
    totalMarks: 100,
    percentage: 81,
    grade: 'A',
    assessmentStatus: 'Entered',
    remarks: 'Good progress in spelling and story structuring.'
  },
  {
    id: 'dmrk-5b-eng-03',
    examId: 'exam-term1-final',
    classId: 'class-5b',
    subject: 'English & Reading',
    studentId: 'std-5b-03',
    studentName: 'Tara Nambiar',
    admissionId: 'GIS-2024-017',
    rollNo: 3,
    writtenMarks: 0,
    practicalMarks: 0,
    internalMarks: 0,
    marksObtained: null,
    totalMarks: 100,
    percentage: 0,
    grade: '—',
    assessmentStatus: 'Not Entered',
    remarks: 'Medical leave re-examination scheduled for next week.'
  }
];

// ==========================================
// INITIAL DETAILED ASSIGNMENTS & SUBMISSIONS
// ==========================================

export const INITIAL_DETAILED_ASSIGNMENTS: DetailedAssignment[] = [
  {
    id: 'asg-1',
    title: 'Linear Quadratic Systems Investigation',
    classId: 'class-10a',
    className: 'Grade 10A',
    section: 'A',
    subject: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    description: 'Solve the 12 quadratic equation modeling real-world parabolic trajectory problems with graphical representation.',
    dueDate: '2026-10-25',
    createdDate: '2026-10-10',
    status: 'Published',
    maxMarks: 20,
    attachmentName: 'Quadratic_Modeling_Worksheet_Ch4.pdf',
    attachmentSize: '1.2 MB',
    instructions: 'Submit handwritten step-by-step solutions with graph sheets attached. Mention axis scales clearly.',
    submissionsCount: 4,
    totalStudents: 4,
    submissions: [
      {
        id: 'sub-asg1-01',
        assignmentId: 'asg-1',
        studentId: 'std-10a-01',
        studentName: 'Rohan Mehta',
        rollNo: 1,
        admissionId: 'GIS-2024-001',
        status: 'Graded',
        submittedDate: '2026-10-18',
        marksObtained: 19,
        maxMarks: 20,
        grade: 'A+',
        feedback: 'Excellent parabolic coordinate plots.',
        attachmentName: 'Rohan_Mehta_Assignment_1.pdf'
      },
      {
        id: 'sub-asg1-02',
        assignmentId: 'asg-1',
        studentId: 'std-10a-02',
        studentName: 'Diya Kapoor',
        rollNo: 2,
        admissionId: 'GIS-2024-002',
        status: 'Graded',
        submittedDate: '2026-10-19',
        marksObtained: 18,
        maxMarks: 20,
        grade: 'A',
        feedback: 'Neat graph work and accurate vertex calculation.',
        attachmentName: 'Diya_Kapoor_Ch4_Math.pdf'
      },
      {
        id: 'sub-asg1-03',
        assignmentId: 'asg-1',
        studentId: 'std-10a-03',
        studentName: 'Kabir Verma',
        rollNo: 3,
        admissionId: 'GIS-2024-003',
        status: 'Submitted',
        submittedDate: '2026-10-20',
        maxMarks: 20,
        attachmentName: 'Kabir_Verma_Homework.pdf'
      },
      {
        id: 'sub-asg1-04',
        assignmentId: 'asg-1',
        studentId: 'std-10a-04',
        studentName: 'Sara Khan',
        rollNo: 4,
        admissionId: 'GIS-2024-004',
        status: 'Graded',
        submittedDate: '2026-10-18',
        marksObtained: 20,
        maxMarks: 20,
        grade: 'A+',
        feedback: 'Flawless modeling demonstration.',
        attachmentName: 'Sara_Khan_Maths_Task.pdf'
      }
    ]
  },
  {
    id: 'asg-2',
    title: 'Photosynthesis & Light Absorption Lab Report',
    classId: 'class-10a',
    className: 'Grade 10A',
    section: 'A',
    subject: 'Science',
    teacherId: 't-2',
    teacherName: 'Ms. Sunita Rao',
    description: 'Prepare a 3-page scientific investigation write-up analyzing chloroplast starch synthesis under LED wavelengths.',
    dueDate: '2026-10-28',
    createdDate: '2026-10-12',
    status: 'Published',
    maxMarks: 25,
    attachmentName: 'Lab_Protocol_Spectrophotometry.pdf',
    attachmentSize: '2.4 MB',
    instructions: 'Include hypothesis, apparatus list, observation table, absorption graphs, and safety protocol notes.',
    submissionsCount: 3,
    totalStudents: 4,
    submissions: [
      {
        id: 'sub-asg2-01',
        assignmentId: 'asg-2',
        studentId: 'std-10a-01',
        studentName: 'Rohan Mehta',
        rollNo: 1,
        admissionId: 'GIS-2024-001',
        status: 'Graded',
        submittedDate: '2026-10-17',
        marksObtained: 23,
        maxMarks: 25,
        grade: 'A',
        feedback: 'Well-structured lab report with accurate colorimetry analysis.',
        attachmentName: 'Rohan_Lab_Report_Photosynthesis.pdf'
      },
      {
        id: 'sub-asg2-02',
        assignmentId: 'asg-2',
        studentId: 'std-10a-02',
        studentName: 'Diya Kapoor',
        rollNo: 2,
        admissionId: 'GIS-2024-002',
        status: 'Graded',
        submittedDate: '2026-10-16',
        marksObtained: 25,
        maxMarks: 25,
        grade: 'A+',
        feedback: 'Publication-quality methodology and error margin calculation.',
        attachmentName: 'Diya_Kapoor_Biology_Lab.pdf'
      },
      {
        id: 'sub-asg2-03',
        assignmentId: 'asg-2',
        studentId: 'std-10a-03',
        studentName: 'Kabir Verma',
        rollNo: 3,
        admissionId: 'GIS-2024-003',
        status: 'Pending',
        maxMarks: 25
      },
      {
        id: 'sub-asg2-04',
        assignmentId: 'asg-2',
        studentId: 'std-10a-04',
        studentName: 'Sara Khan',
        rollNo: 4,
        admissionId: 'GIS-2024-004',
        status: 'Submitted',
        submittedDate: '2026-10-21',
        maxMarks: 25,
        attachmentName: 'Sara_Lab_Assignment.pdf'
      }
    ]
  },
  {
    id: 'asg-3',
    title: 'Linear Equations & Real Life Applications',
    classId: 'class-8a',
    className: 'Grade 8A',
    section: 'A',
    subject: 'Mathematics',
    teacherId: 't-1',
    teacherName: 'Dr. Vikram Sharma',
    description: 'Solve word problems involving distance-speed-time systems and age calculations.',
    dueDate: '2026-10-26',
    createdDate: '2026-10-15',
    status: 'Published',
    maxMarks: 15,
    attachmentName: 'Grade8_Word_Problems_Set2.pdf',
    attachmentSize: '850 KB',
    instructions: 'Show full step-by-step working. Late submissions will attract a 10% penalty.',
    submissionsCount: 3,
    totalStudents: 4,
    submissions: [
      {
        id: 'sub-asg3-01',
        assignmentId: 'asg-3',
        studentId: 'std-8a-01',
        studentName: 'Aarav Sharma',
        rollNo: 1,
        admissionId: 'GIS-2024-008',
        status: 'Graded',
        submittedDate: '2026-10-18',
        marksObtained: 15,
        maxMarks: 15,
        grade: 'A+',
        feedback: 'Rapid, precise algebraic formulation. Top mark!',
        attachmentName: 'Aarav_Algebra_HW.pdf'
      },
      {
        id: 'sub-asg3-02',
        assignmentId: 'asg-3',
        studentId: 'std-8a-02',
        studentName: 'Meera Patel',
        rollNo: 2,
        admissionId: 'GIS-2024-009',
        status: 'Graded',
        submittedDate: '2026-10-19',
        marksObtained: 13,
        maxMarks: 15,
        grade: 'A',
        feedback: 'Good work on distance-time formulas.',
        attachmentName: 'Meera_Patel_Math8.pdf'
      },
      {
        id: 'sub-asg3-03',
        assignmentId: 'asg-3',
        studentId: 'std-8a-03',
        studentName: 'Arjun Das',
        rollNo: 3,
        admissionId: 'GIS-2024-010',
        status: 'Pending',
        maxMarks: 15
      },
      {
        id: 'sub-asg3-04',
        assignmentId: 'asg-3',
        studentId: 'std-8a-04',
        studentName: 'Ananya Roy',
        rollNo: 4,
        admissionId: 'GIS-2024-011',
        status: 'Submitted',
        submittedDate: '2026-10-20',
        maxMarks: 15,
        attachmentName: 'Ananya_Roy_Linear_HW.pdf'
      }
    ]
  },
  {
    id: 'asg-4',
    title: 'Creative Story Writing: The Enchanted Forest',
    classId: 'class-5b',
    className: 'Grade 5B',
    section: 'B',
    subject: 'English',
    teacherId: 't-6',
    teacherName: 'Ms. Priya Sen',
    description: 'Write a 250-word fantasy adventure story utilizing five descriptive sensory adjectives and dialogue punctuation.',
    dueDate: '2026-10-27',
    createdDate: '2026-10-14',
    status: 'Published',
    maxMarks: 10,
    attachmentName: 'Creative_Writing_Prompts.pdf',
    attachmentSize: '500 KB',
    instructions: 'Draw a colorful cover illustration for your tale.',
    submissionsCount: 2,
    totalStudents: 3,
    submissions: [
      {
        id: 'sub-asg4-01',
        assignmentId: 'asg-4',
        studentId: 'std-5b-01',
        studentName: 'Ananya Sharma',
        rollNo: 1,
        admissionId: 'GIS-2024-015',
        status: 'Graded',
        submittedDate: '2026-10-17',
        marksObtained: 10,
        maxMarks: 10,
        grade: 'A+',
        feedback: 'Delightful imagination and vibrant descriptive prose!',
        attachmentName: 'Ananya_Fantasy_Story.pdf'
      },
      {
        id: 'sub-asg4-02',
        assignmentId: 'asg-4',
        studentId: 'std-5b-02',
        studentName: 'Kunal Sen',
        rollNo: 2,
        admissionId: 'GIS-2024-016',
        status: 'Submitted',
        submittedDate: '2026-10-19',
        maxMarks: 10,
        attachmentName: 'Kunal_Story.pdf'
      },
      {
        id: 'sub-asg4-03',
        assignmentId: 'asg-4',
        studentId: 'std-5b-03',
        studentName: 'Tara Nambiar',
        rollNo: 3,
        admissionId: 'GIS-2024-017',
        status: 'Pending',
        maxMarks: 10
      }
    ]
  }
];

// ==========================================
// EXAM CONFLICT DETECTION UTILITY (Section 5)
// ==========================================

export interface ExamConflict {
  type: 'Class' | 'Teacher' | 'Room' | 'Duration' | 'Date';
  severity: 'blocking' | 'warning';
  title: string;
  message: string;
  sessionId?: string;
  conflictingSessionId?: string;
}

export const detectExamScheduleConflicts = (
  session: ExamSession,
  allSessions: ExamSession[]
): ExamConflict[] => {
  const conflicts: ExamConflict[] = [];

  // Duration validation
  if (session.durationMinutes <= 0 || session.durationMinutes > 360) {
    conflicts.push({
      type: 'Duration',
      severity: 'blocking',
      title: 'Invalid Duration',
      message: `Duration (${session.durationMinutes} mins) must be between 15 and 360 minutes.`
    });
  }

  // Time format check
  if (session.startTime >= session.endTime) {
    conflicts.push({
      type: 'Duration',
      severity: 'blocking',
      title: 'Invalid Time Range',
      message: `Start time (${session.startTime}) cannot be equal to or after end time (${session.endTime}).`
    });
  }

  const parseTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };

  const startA = parseTime(session.startTime);
  const endA = parseTime(session.endTime);

  allSessions.forEach((other) => {
    if (other.id === session.id) return;
    if (other.date !== session.date) return;
    if (other.status === 'Cancelled') return;

    const startB = parseTime(other.startTime);
    const endB = parseTime(other.endTime);

    // Overlap condition: startA < endB && startB < endA
    const isOverlapping = startA < endB && startB < endA;

    if (isOverlapping) {
      // 1. Same Class overlap
      if (other.classId === session.classId) {
        conflicts.push({
          type: 'Class',
          severity: 'blocking',
          title: 'Class Double-Booking Conflict',
          message: `${session.className || 'Class'} already has ${other.subjectName} scheduled from ${other.startTime} to ${other.endTime}. Students cannot write two exams simultaneously.`,
          sessionId: session.id,
          conflictingSessionId: other.id
        });
      }

      // 2. Same Invigilator Teacher overlap
      if (
        session.invigilatorTeacherId &&
        other.invigilatorTeacherId &&
        session.invigilatorTeacherId === other.invigilatorTeacherId
      ) {
        conflicts.push({
          type: 'Teacher',
          severity: 'blocking',
          title: 'Invigilator Overlap Conflict',
          message: `${session.invigilatorName} is already assigned to invigilate ${other.subjectName} (${other.className}) in ${other.room} from ${other.startTime} to ${other.endTime}.`,
          sessionId: session.id,
          conflictingSessionId: other.id
        });
      }

      // 3. Same Room overlap
      if (
        session.room &&
        other.room &&
        session.room.toLowerCase().trim() === other.room.toLowerCase().trim() &&
        session.room !== 'Main Examination Hall' // Main Hall might seat multiple cohorts if specified
      ) {
        conflicts.push({
          type: 'Room',
          severity: 'blocking',
          title: 'Room Double-Booking Conflict',
          message: `${session.room} is already booked for ${other.subjectName} (${other.className}) from ${other.startTime} to ${other.endTime}.`,
          sessionId: session.id,
          conflictingSessionId: other.id
        });
      }
    }
  });

  return conflicts;
};

// ==========================================
// CSV EXPORT FOR MARKS & RESULTS (Section 19)
// ==========================================

export const exportMarksCSV = (
  exam: DetailedExam,
  subject: string,
  classInfo: ClassInfo,
  marksList: DetailedMarkEntry[]
) => {
  const headers = [
    'Roll No',
    'Student Name',
    'Admission ID',
    'Class',
    'Subject',
    'Written Marks',
    'Practical Marks',
    'Internal Marks',
    'Marks Obtained',
    'Total Maximum',
    'Percentage',
    'Grade',
    'Status',
    'Remarks'
  ];

  const rows = marksList.map((m) => [
    m.rollNo || '',
    `"${m.studentName}"`,
    m.admissionId || '',
    `"${classInfo.name}"`,
    `"${subject}"`,
    m.writtenMarks !== undefined ? m.writtenMarks : '',
    m.practicalMarks !== undefined ? m.practicalMarks : '',
    m.internalMarks !== undefined ? m.internalMarks : '',
    m.marksObtained !== null ? m.marksObtained : '—',
    m.totalMarks,
    m.percentage !== undefined ? `${m.percentage}%` : '',
    m.grade,
    m.assessmentStatus,
    `"${(m.remarks || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `SCHLAR_Marks_${exam.name.replace(/\s+/g, '_')}_${classInfo.name.replace(/\s+/g, '_')}_${subject.replace(/\s+/g, '_')}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
