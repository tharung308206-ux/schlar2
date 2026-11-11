import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  ShieldAlert,
  Users,
  Calendar,
  BookOpen,
  DollarSign,
  FileSpreadsheet,
  Award,
  Layers,
  History
} from 'lucide-react';

export const ScenarioRunnerModal: React.FC = () => {
  const {
    activeScenarioModal,
    setActiveScenarioModal,
    runScenario,
    currentRole,
    examModerationStatus,
    submitMarksForReview,
    approveMarks,
    publishResults,
    switchRoleAndNavigate,
    executePermissionCheck,
    enrolApplicant,
    enquiries
  } = useApp();

  if (activeScenarioModal === null) return null;

  const scenarios = [
    {
      id: 1,
      title: 'Scenario 1: Student Admissions Pipeline',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      role: 'Receptionist → Admin',
      summary: 'Prospective applicant enquiry registered, reviewed, and matriculated into the official active student roster.',
      steps: [
        'Receptionist receives prospective enquiry for Vihaan Deshmukh.',
        'Review documents & admission test clearances.',
        'School Admin approves and confirms matriculation.',
        'Vihaan Deshmukh appears as active student in directory and fee ledger.'
      ],
      actionLabel: 'Execute Enrolment Workflow',
      action: () => {
        const enq = enquiries.find((e) => e.status !== 'Converted') || enquiries[0];
        if (enq) enrolApplicant(enq.id);
        switchRoleAndNavigate('principal', 'students');
      }
    },
    {
      id: 2,
      title: 'Scenario 2: Real-time Attendance Synchronization',
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      role: 'Teacher Mobile ↔ Web ↔ Parent',
      summary: 'Marking attendance on handheld mobile immediately updates Teacher Web workstation, Admin analytics, and the Parent Portal.',
      steps: [
        'Open Teacher Mobile roll call register for Grade 10A.',
        'Toggle student status (Present / Absent / Late).',
        'Save roll call register.',
        'Switch to Teacher Web or Parent Mobile to observe live synchronized metrics.'
      ],
      actionLabel: 'Open Teacher Mobile Attendance',
      action: () => {
        switchRoleAndNavigate('teacher_mobile', 'attendance');
      }
    },
    {
      id: 3,
      title: 'Scenario 3: Assignment Creation & Scoped Delivery',
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      role: 'Teacher Web → Parent Mobile',
      summary: 'Faculty member publishes coursework for Grade 10A. Only linked parents receive the task notification and due date.',
      steps: [
        'Teacher creates and publishes new digital homework.',
        'Task is registered for Grade 10A roster.',
        'Aarav Sharma (Grade 8A) family feed remains scoped.',
        'Grade 10A parents receive instantaneous submission tracker.'
      ],
      actionLabel: 'Launch Teacher Assignments',
      action: () => {
        switchRoleAndNavigate('teacher', 'assignments');
      }
    },
    {
      id: 4,
      title: 'Scenario 4: Exam Moderation & Official Results Release',
      icon: <Award className="w-5 h-5 text-amber-600" />,
      role: 'Teacher → Vice Principal → Principal → Parent',
      summary: 'Marks entered by faculty are submitted for academic moderation, certified by Vice Principal, and published by Principal to Parents.',
      steps: [
        `Current Status: [${examModerationStatus}]`,
        '1. Teacher submits Term 1 assessment marks for academic moderation.',
        '2. Vice Principal verifies standard deviation & approves bell curve.',
        '3. Principal authorizes official publication to student/parent portals.'
      ],
      actionLabel:
        examModerationStatus === 'Draft'
          ? 'Step 1: Teacher Submit Marks'
          : examModerationStatus === 'Submitted'
          ? 'Step 2: Vice Principal Approve'
          : examModerationStatus === 'Approved'
          ? 'Step 3: Principal Publish'
          : 'Results Published (View Parent Portal)',
      action: () => {
        if (examModerationStatus === 'Draft') {
          submitMarksForReview();
          switchRoleAndNavigate('vice_principal', 'marks');
        } else if (examModerationStatus === 'Submitted') {
          approveMarks();
          switchRoleAndNavigate('principal', 'academics');
        } else if (examModerationStatus === 'Approved') {
          publishResults();
          switchRoleAndNavigate('parent_mobile', 'academics');
        } else {
          switchRoleAndNavigate('parent_mobile', 'academics');
        }
      }
    },
    {
      id: 5,
      title: 'Scenario 5: Bursar Payment & Receipt Generation',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      role: 'Accountant → Parent Mobile',
      summary: 'Recording a simulated payment immediately updates the student ledger balance, recalculates dues, and produces an official receipt.',
      steps: [
        'Accountant selects student and logs fee collection.',
        'Payment ledger balance immediately decrements.',
        'Official computer-generated receipt popup appears.',
        'Parent sees updated outstanding balance in real-time.'
      ],
      actionLabel: 'Open Fee Collection Ledger',
      action: () => {
        switchRoleAndNavigate('accountant', 'fees');
      }
    },
    {
      id: 6,
      title: 'Scenario 6: Library Circulation & Stock Decrement',
      icon: <BookOpen className="w-5 h-5 text-rose-600" />,
      role: 'Librarian Commons',
      summary: 'Issuing a physical book title validates available inventory, decrements copy count, creates transaction, and restores on return.',
      steps: [
        'Librarian checks copy availability (prevents zero-stock checkout).',
        'Issues title to student with 14-day loan duration.',
        'Available copies drop (e.g. 5 → 4).',
        'Return book restores stock and reconciles overdue fines.'
      ],
      actionLabel: 'Open Library Circulation',
      action: () => {
        switchRoleAndNavigate('librarian', 'issue_return');
      }
    },
    {
      id: 7,
      title: 'Scenario 7: Timetable Scheduling & Conflict Prevention',
      icon: <Calendar className="w-5 h-5 text-teal-600" />,
      role: 'Vice Principal / Coordinator',
      summary: 'Academic coordinator schedules classroom timetable. Real-time conflict engine ensures faculty and room double-booking is prohibited.',
      steps: [
        'Vice Principal creates or updates period allocations.',
        'Conflict engine checks room and faculty availability.',
        'Valid schedule published to faculty and students.'
      ],
      actionLabel: 'View Timetable Matrix',
      action: () => {
        switchRoleAndNavigate('vice_principal', 'timetable');
      }
    },
    {
      id: 8,
      title: 'Scenario 8: Strict RBAC Boundary Enforcement',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      role: 'Security & Permission Engine',
      summary: 'Demonstrates security enforcement: unauthorized actions are denied, logged to audit ledger, and user feedback is delivered.',
      steps: [
        'Test 1: Teacher attempting to alter tuition fee rates (Denied).',
        'Test 2: Teacher attempting to mark unassigned grade attendance (Denied).',
        'Test 3: Parent attempting to access unlinked family child (Denied).',
        'All violations trigger security audit entries.'
      ],
      actionLabel: 'Run Permission Violation Test',
      action: () => {
        // Run test violation
        executePermissionCheck('fees', 'configure');
      }
    },
    {
      id: 9,
      title: 'Scenario 9: Browser Local Persistence',
      icon: <History className="w-5 h-5 text-indigo-600" />,
      role: 'Data Persistence Engine',
      summary: 'All changes across attendance, marks, fees, library, and students are saved in localStorage with versioned keys.',
      steps: [
        'Make edits to any student, fee, or attendance record.',
        'Refresh browser (F5 / Cmd+R).',
        'Confirm records remain intact.',
        'Reset demo data button restores factory defaults when needed.'
      ],
      actionLabel: 'Test Persistence Ready',
      action: () => {
        setActiveScenarioModal(null);
      }
    },
    {
      id: 10,
      title: 'Scenario 10: Institutional Audit Trail',
      icon: <History className="w-5 h-5 text-slate-700" />,
      role: 'Principal & Governance',
      summary: 'Every sensitive operation logs the actor, timestamp, action type, record reference, and operational reason into an immutable audit ledger.',
      steps: [
        'Every payment, result release, enrolment, and permission check is logged.',
        'View chronological event trail with status tags.',
        'Search and filter by actor or module.'
      ],
      actionLabel: 'Inspect Security Audit Log',
      action: () => {
        switchRoleAndNavigate('principal', 'reports');
      }
    }
  ];

  const currentScenario = scenarios.find((s) => s.id === activeScenarioModal) || scenarios[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn"
      onClick={() => setActiveScenarioModal(null)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
              {currentScenario.icon}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-theme-primary">
                {currentScenario.role}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                {currentScenario.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setActiveScenarioModal(null)}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            {currentScenario.summary}
          </p>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Operational Sequence
            </span>
            <div className="space-y-2">
              {currentScenario.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setActiveScenarioModal(num)}
                className={`w-6 h-6 shrink-0 rounded-md text-[11px] font-bold transition-all ${
                  activeScenarioModal === num
                    ? 'bg-theme-primary text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={`Scenario ${num}`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveScenarioModal(null)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                currentScenario.action();
                setActiveScenarioModal(null);
              }}
              className="px-4 py-2 rounded-xl bg-theme-primary text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentScenario.actionLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
