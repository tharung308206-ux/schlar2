import { RoleType, PermissionCheckResult } from '../types';

export interface PermissionDefinition {
  module: string;
  action: string;
  description: string;
  allowedRoles: RoleType[];
  requiresApproval?: boolean;
  createsAuditEntry?: boolean;
}

export const PERMISSION_MATRIX: PermissionDefinition[] = [
  // Students
  { module: 'students', action: 'view', description: 'View student directory', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'receptionist'] },
  { module: 'students', action: 'create', description: 'Enrol new student record', allowedRoles: ['principal', 'receptionist'], createsAuditEntry: true },
  { module: 'students', action: 'edit', description: 'Modify student particulars', allowedRoles: ['principal', 'vice_principal', 'receptionist'], createsAuditEntry: true },
  { module: 'students', action: 'delete', description: 'Remove or withdraw student record', allowedRoles: ['principal'], createsAuditEntry: true },
  { module: 'students', action: 'archive', description: 'Archive withdrawn student', allowedRoles: ['principal'], createsAuditEntry: true },

  // Teachers
  { module: 'teachers', action: 'view', description: 'View faculty directory', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'receptionist'] },
  { module: 'teachers', action: 'create', description: 'Add new faculty / teacher profile', allowedRoles: ['principal'], createsAuditEntry: true },
  { module: 'teachers', action: 'edit', description: 'Modify teacher details & teaching allocations', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },
  { module: 'teachers', action: 'delete', description: 'Remove teacher record', allowedRoles: ['principal'], createsAuditEntry: true },

  // Staff
  { module: 'staff', action: 'view', description: 'View general staff directory', allowedRoles: ['principal', 'vice_principal', 'accountant', 'receptionist', 'librarian'] },
  { module: 'staff', action: 'create', description: 'Add new general staff member', allowedRoles: ['principal'], createsAuditEntry: true },
  { module: 'staff', action: 'edit', description: 'Modify staff member details', allowedRoles: ['principal'], createsAuditEntry: true },
  { module: 'staff', action: 'delete', description: 'Remove staff record', allowedRoles: ['principal'], createsAuditEntry: true },

  // Attendance
  { module: 'attendance', action: 'view', description: 'View attendance records & registers', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'parent_mobile'] },
  { module: 'attendance', action: 'mark', description: 'Mark classroom attendance roll call', allowedRoles: ['teacher', 'teacher_mobile'], createsAuditEntry: true },
  { module: 'attendance', action: 'correct', description: 'Correct historical submitted attendance', allowedRoles: ['principal', 'vice_principal'], requiresApproval: true, createsAuditEntry: true },

  // Marks & Exams
  { module: 'marks', action: 'view', description: 'View examination marks', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'parent_mobile'] },
  { module: 'marks', action: 'enter', description: 'Enter subject assessment marks', allowedRoles: ['teacher', 'teacher_mobile'] },
  { module: 'marks', action: 'submit', description: 'Submit marks roster for moderation', allowedRoles: ['teacher', 'teacher_mobile'], createsAuditEntry: true },
  { module: 'marks', action: 'approve', description: 'Approve marks moderation batch', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },
  { module: 'results', action: 'publish', description: 'Publish verified report card results to parents', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },

  // Assignments
  { module: 'assignments', action: 'view', description: 'View assignment tasks', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'parent_mobile'] },
  { module: 'assignments', action: 'create', description: 'Create and publish homework tasks', allowedRoles: ['teacher', 'teacher_mobile'], createsAuditEntry: true },
  { module: 'assignments', action: 'delete', description: 'Delete assigned coursework', allowedRoles: ['teacher', 'teacher_mobile', 'principal'], createsAuditEntry: true },

  // Fees & Bursar
  { module: 'fees', action: 'view', description: 'View fee ledger balances & dues', allowedRoles: ['principal', 'accountant', 'parent_mobile'] },
  { module: 'fees', action: 'configure', description: 'Configure school fee heads & structures', allowedRoles: ['principal', 'accountant'], createsAuditEntry: true },
  { module: 'payments', action: 'record', description: 'Record student tuition payment', allowedRoles: ['accountant'], createsAuditEntry: true },
  { module: 'payments', action: 'reverse', description: 'Reverse incorrect payment transaction', allowedRoles: ['accountant', 'principal'], requiresApproval: true, createsAuditEntry: true },
  { module: 'receipts', action: 'view', description: 'View & download official payment receipts', allowedRoles: ['accountant', 'principal', 'parent_mobile'] },

  // Admissions & Visitors
  { module: 'admissions', action: 'view', description: 'View applicant enquiries & pipeline', allowedRoles: ['principal', 'receptionist', 'vice_principal'] },
  { module: 'admissions', action: 'create', description: 'Register prospective admission enquiry', allowedRoles: ['receptionist', 'principal'], createsAuditEntry: true },
  { module: 'admissions', action: 'review', description: 'Review applicant documents & test scores', allowedRoles: ['receptionist', 'vice_principal', 'principal'] },
  { module: 'admissions', action: 'approve', description: 'Approve admission application for enrolment', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },
  { module: 'admissions', action: 'enrol', description: 'Convert approved applicant into active student', allowedRoles: ['principal'], createsAuditEntry: true },
  { module: 'visitors', action: 'manage', description: 'Register and check in/out campus visitors', allowedRoles: ['receptionist', 'principal'], createsAuditEntry: true },

  // Library
  { module: 'library', action: 'view', description: 'Browse library catalog and loans', allowedRoles: ['principal', 'librarian'] },
  { module: 'library', action: 'catalogue.manage', description: 'Add/edit book titles & ISBN details', allowedRoles: ['librarian'], createsAuditEntry: true },
  { module: 'library', action: 'issue', description: 'Issue book to borrower', allowedRoles: ['librarian'], createsAuditEntry: true },
  { module: 'library', action: 'return', description: 'Process book return and assess fines', allowedRoles: ['librarian'], createsAuditEntry: true },

  // Timetable
  { module: 'timetable', action: 'view', description: 'View class and faculty timetables', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'parent_mobile'] },
  { module: 'timetable', action: 'manage', description: 'Draft, detect conflicts & publish schedules', allowedRoles: ['vice_principal', 'principal'], createsAuditEntry: true },

  // Academic Setup, Classes & Subjects
  { module: 'academics', action: 'view', description: 'View academic year, terms and school operational matrix', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile'] },
  { module: 'academics', action: 'manage', description: 'Configure academic years, terms, and period bell schedules', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },
  { module: 'classes', action: 'view', description: 'View class directories and section assignments', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile', 'receptionist'] },
  { module: 'classes', action: 'manage', description: 'Create and edit classes, sections, and room assignments', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },
  { module: 'subjects', action: 'view', description: 'View curriculum subjects and syllabus', allowedRoles: ['principal', 'vice_principal', 'teacher', 'teacher_mobile'] },
  { module: 'subjects', action: 'manage', description: 'Add subjects and allocate teacher workloads', allowedRoles: ['principal', 'vice_principal'], createsAuditEntry: true },

  // Notices & Audit
  { module: 'notices', action: 'create', description: 'Draft and publish school notices', allowedRoles: ['principal', 'vice_principal', 'teacher'], createsAuditEntry: true },
  { module: 'audit', action: 'view', description: 'Inspect institutional security and action audit log', allowedRoles: ['principal', 'vice_principal'] }
];

export function checkPermission(
  role: RoleType,
  module: string,
  action: string,
  context?: {
    assignedClasses?: string[];
    targetClass?: string;
    linkedChildren?: string[];
    targetStudentId?: string;
    isResultPublished?: boolean;
  }
): PermissionCheckResult {
  // Normalize mobile roles to their base roles
  const effectiveRole = role === 'teacher_mobile' ? 'teacher' : role === 'parent_mobile' ? 'parent' : role;

  const rule = PERMISSION_MATRIX.find(
    (p) => p.module === module && p.action === action
  );

  if (!rule) {
    return {
      allowed: false,
      reason: `Action '${action}' on module '${module}' is undefined and denied by default.`
    };
  }

  // Check role authorization with fallback for new approved roles
  let roleAllowed = rule.allowedRoles.includes(role) || rule.allowedRoles.includes(effectiveRole);

  // Specialized role permissions
  if (effectiveRole === 'parent' && rule.allowedRoles.includes('parent_mobile')) {
    roleAllowed = true;
  }
  if (role === 'exam_coordinator' && ['exams', 'marks', 'results', 'timetable', 'academics', 'classes', 'subjects', 'reports', 'readiness', 'moderation', 'publication'].includes(module)) {
    roleAllowed = true;
  }
  if (role === 'exam_coordinator' && ['students', 'teachers', 'classes'].includes(module) && action === 'view') {
    roleAllowed = true;
  }
  if (role === 'receptionist' && ['visitors', 'enquiries', 'appointments', 'admissions', 'notices', 'communication', 'reports', 'directory', 'school'].includes(module)) {
    roleAllowed = true;
  }
  if (role === 'receptionist' && ['students', 'staff', 'teachers'].includes(module) && action === 'view') {
    roleAllowed = true;
  }
  if (role === 'hr' && ['staff', 'teachers', 'leaves', 'departments', 'recruitment', 'payroll', 'documents'].includes(module)) {
    roleAllowed = true;
  }
  if (role === 'accountant' && ['fees', 'payments', 'receipts', 'concessions', 'refunds', 'expenses', 'reports'].includes(module)) {
    roleAllowed = true;
  }
  if (role === 'librarian' && ['library', 'books', 'loans', 'members', 'transactions', 'reservations', 'inventory', 'reports'].includes(module)) {
    roleAllowed = true;
  }
  if (role === 'librarian' && ['students', 'staff', 'teachers'].includes(module) && action === 'view') {
    roleAllowed = true;
  }
  if (role === 'transport' && ['transport', 'vehicles', 'routes', 'stops', 'rosters', 'maintenance', 'incidents', 'drivers', 'reports', 'announcements'].includes(module)) {
    roleAllowed = true;
  }
  if (role === 'transport' && ['students', 'staff'].includes(module) && action === 'view') {
    roleAllowed = true;
  }

  if (!roleAllowed) {
    return {
      allowed: false,
      reason: `Access Denied: Role '${role}' lacks '${module}.${action}' permission.`
    };
  }

  // Context-specific validations:
  // 1. Teacher class scope restriction
  if ((role === 'teacher' || role === 'teacher_mobile') && context?.assignedClasses && context.targetClass) {
    if (!context.assignedClasses.includes(context.targetClass)) {
      return {
        allowed: false,
        reason: `Scope Violation: You are assigned to [${context.assignedClasses.join(', ')}]. Access to ${context.targetClass} is prohibited.`
      };
    }
  }

  // 2. Parent child link restriction
  if ((role === 'parent' || role === 'parent_mobile') && context?.linkedChildren && context.targetStudentId) {
    if (!context.linkedChildren.includes(context.targetStudentId)) {
      return {
        allowed: false,
        reason: `Privacy Violation: Student '${context.targetStudentId}' is not linked to your parent account.`
      };
    }
  }

  // 3. Parent unpublished results restriction
  if ((role === 'parent' || role === 'parent_mobile') && module === 'marks' && context?.isResultPublished === false) {
    return {
      allowed: false,
      reason: `Confidential: Examination marks are in draft/moderation review and not yet officially published.`
    };
  }

  return { allowed: true };
}

// Field-Level Permission Checks
export function canEditStudentField(role: RoleType, fieldName: string): boolean {
  if (role === 'principal') return true;
  if (role === 'vice_principal') {
    // Academic fields only
    return ['classId', 'section', 'rollNo', 'academicStatus'].includes(fieldName);
  }
  if (role === 'receptionist') {
    // Guardian, address, contact, and emergency fields only
    return [
      'parentName',
      'guardianRelation',
      'parentPhone',
      'parentEmail',
      'secondaryGuardianName',
      'secondaryGuardianPhone',
      'secondaryGuardianRelation',
      'address',
      'emergencyContact',
      'medicalAlerts',
      'authorizedPickup'
    ].includes(fieldName);
  }
  return false;
}

export function canEditTeacherField(role: RoleType, fieldName: string): boolean {
  if (role === 'principal') return true;
  if (role === 'vice_principal') {
    // Academic workload & allocation fields only
    return ['subjects', 'classes', 'workloadHours', 'room', 'classTeacherOf'].includes(fieldName);
  }
  return false;
}

export function canEditStaffField(role: RoleType, fieldName: string): boolean {
  if (role === 'principal') return true;
  return false;
}

// Section-Level Visibility for Student Profile
export function canViewStudentSection(role: RoleType, sectionId: string): boolean {
  if (role === 'principal') return true;
  if (role === 'vice_principal') {
    // Vice principal has academic oversight; fees restricted to summary
    return ['overview', 'personal', 'admission', 'guardian', 'academics', 'attendance', 'exams', 'documents', 'medical', 'lifecycle', 'activity'].includes(sectionId);
  }
  if (role === 'teacher' || role === 'teacher_mobile') {
    // Teachers have academic & attendance access; confidential medical alerts, fee ledgers, and institutional audit logs are restricted
    return ['overview', 'personal', 'admission', 'guardian', 'academics', 'attendance', 'exams'].includes(sectionId);
  }
  if (role === 'accountant') {
    // Accountant sees financial ledgers and basic enrollment identity
    return ['overview', 'admission', 'guardian', 'fees', 'documents'].includes(sectionId);
  }
  if (role === 'receptionist') {
    // Receptionist sees front office, guardian contacts, emergency pickups, documents, admission
    return ['overview', 'personal', 'admission', 'guardian', 'medical', 'documents'].includes(sectionId);
  }
  if (role === 'librarian') {
    // Librarian sees cardholder identification and basic class placement
    return ['overview', 'admission'].includes(sectionId);
  }
  if (role === 'parent' || role === 'parent_mobile') {
    return ['overview', 'academics', 'attendance', 'exams', 'fees'].includes(sectionId);
  }
  if (role === 'exam_coordinator') {
    return ['overview', 'academics', 'exams'].includes(sectionId);
  }
  if (role === 'hr') {
    return ['overview', 'admission'].includes(sectionId);
  }
  if (role === 'transport') {
    return ['overview', 'admission', 'guardian'].includes(sectionId);
  }
  return false;
}

// Section-Level Visibility for Teacher Profile
export function canViewTeacherSection(role: RoleType, sectionId: string): boolean {
  if (role === 'principal') return true;
  if (role === 'vice_principal') {
    // VP sees academic allocations, timetable, qualifications, overview
    return ['overview', 'qualifications', 'allocations', 'timetable', 'activity'].includes(sectionId);
  }
  if (role === 'hr') {
    return ['overview', 'qualifications', 'allocations', 'timetable', 'activity'].includes(sectionId);
  }
  if (role === 'teacher' || role === 'teacher_mobile') {
    // Teachers can view colleague overview, qualifications, and timetable (for substitutions)
    return ['overview', 'qualifications', 'allocations', 'timetable'].includes(sectionId);
  }
  if (role === 'receptionist') {
    return ['overview', 'allocations', 'timetable'].includes(sectionId);
  }
  return ['overview'].includes(sectionId);
}

// Section-Level Visibility for Staff Profile
export function canViewStaffSection(role: RoleType, sectionId: string): boolean {
  if (role === 'principal' || role === 'hr') return true;
  if (role === 'vice_principal') {
    return ['overview', 'employment', 'responsibilities', 'activity'].includes(sectionId);
  }
  return ['overview', 'employment', 'responsibilities'].includes(sectionId);
}


