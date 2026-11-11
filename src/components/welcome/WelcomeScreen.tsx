import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleType, PaletteId } from '../../types';
import { SCHLAR_PALETTES, DEFAULT_PALETTE_ID } from '../../data/themes';
import {
  ShieldCheck,
  GraduationCap,
  Users,
  DollarSign,
  PhoneCall,
  BookOpen,
  Smartphone,
  Globe,
  Sparkles,
  School,
  Calendar,
  ArrowRight,
  Palette,
  Sliders,
  Briefcase,
  Bus,
  Award,
  CheckCircle2,
  Info,
  X,
  PlayCircle
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const {
    switchRoleAndNavigate,
    activePaletteId,
    themeColors,
    setThemePalette,
    setIsThemeModalOpen,
    setActiveScenarioModal
  } = useApp();

  // Platform choice modal for Teacher or Parent
  const [platformModalRole, setPlatformModalRole] = useState<'teacher' | null>(null);

  interface ApprovedRoleConfig {
    id: RoleType;
    number: number;
    title: string;
    personName: string;
    designation: string;
    description: string;
    icon: React.ReactNode;
    badges: string[];
    isDualPlatform?: boolean;
    directRole?: RoleType;
  }

  const APPROVED_ROLES: ApprovedRoleConfig[] = [
    {
      id: 'principal',
      number: 1,
      title: 'Admin',
      personName: 'Dr. Arthur Campbell',
      designation: 'Principal & School Administrator',
      description: 'Institutional oversight, admission enrolment CRUD, faculty rosters, fee collections, timetable grids, and audit ledger.',
      icon: <ShieldCheck className="w-5 h-5 text-theme-primary" />,
      badges: ['School Governance', 'Admissions', 'Faculty Roster', 'Audit Ledger'],
      directRole: 'principal'
    },
    {
      id: 'vice_principal',
      number: 2,
      title: 'Vice Principal',
      personName: 'Mrs. Evelyn Hayes',
      designation: 'Academic Dean & Coordinator',
      description: 'Curricular progress, timetable conflict engine, teacher workload distribution, marks moderation workflow, and assessment policies.',
      icon: <GraduationCap className="w-5 h-5 text-theme-primary" />,
      badges: ['Academic Coordination', 'Timetable Conflict Engine', 'Marks Moderation'],
      directRole: 'vice_principal'
    },
    {
      id: 'teacher',
      number: 3,
      title: 'Teacher',
      personName: 'Dr. Vikram Sharma',
      designation: 'Senior Faculty (STEM Department)',
      description: 'Interactive classroom roll call, gradebook mark entry, automated grading scales, homework assignments, and student communication.',
      icon: <Users className="w-5 h-5 text-theme-primary" />,
      badges: ['Interactive Roll Call', 'Gradebook Marks', 'Assignments', 'Web & Mobile'],
      isDualPlatform: true
    },
    {
      id: 'parent',
      number: 4,
      title: 'Parent (Mobile App)',
      personName: 'Ramesh Sharma',
      designation: 'Guardian (Aarav 8A & Ananya 5B)',
      description: 'Phone-first mobile experience with multi-child switcher, live attendance percentage, downloadable report cards, tuition fee receipts, and homework tracking.',
      icon: <Users className="w-5 h-5 text-theme-primary" />,
      badges: ['Mobile-Only App', 'Multi-Child Switcher', 'Report Cards', 'Fee Invoices'],
      directRole: 'parent_mobile'
    },
    {
      id: 'accountant',
      number: 5,
      title: 'Accountant / Fee Manager',
      personName: 'Alok Saxena',
      designation: 'Bursar & Finance Officer',
      description: 'Tuition collection ledger, instant official receipt generator, fee balance reconciliation, payment history, and bursar ledger.',
      icon: <DollarSign className="w-5 h-5 text-theme-primary" />,
      badges: ['Collection Ledger', 'Official Receipts', 'Payment Reversal', 'Fee Heads'],
      directRole: 'accountant'
    },
    {
      id: 'hr',
      number: 6,
      title: 'HR / Staff Manager',
      personName: 'Meera Sen',
      designation: 'Head of Human Resources & Personnel',
      description: 'Staff directory, teacher credentials, leave request moderation, employee onboarding, workload allocations, and personnel records.',
      icon: <Briefcase className="w-5 h-5 text-theme-primary" />,
      badges: ['Faculty Directory', 'Leave Approvals', 'Workloads', 'Staff Records'],
      directRole: 'hr'
    },
    {
      id: 'librarian',
      number: 7,
      title: 'Librarian',
      personName: 'Nandini Krishnan',
      designation: 'Head of Library & Media Commons',
      description: 'ISBN catalog management, book circulation checkouts, return date calculations, overdue fine assessments, and inventory stock.',
      icon: <BookOpen className="w-5 h-5 text-theme-primary" />,
      badges: ['Title Catalog', 'Circulation Checkout', 'Overdue Tracking', 'Fines'],
      directRole: 'librarian'
    },
    {
      id: 'transport',
      number: 8,
      title: 'Transport Manager',
      personName: 'Rajesh Kumar',
      designation: 'Fleet & Logistics Supervisor',
      description: 'School bus routes, driver assignments, student pickup stop allocations, vehicle safety logs, and transport capacity tracking.',
      icon: <Bus className="w-5 h-5 text-theme-primary" />,
      badges: ['Bus Routes', 'Driver Rosters', 'Student Allocations', 'Fleet Logs'],
      directRole: 'transport'
    },
    {
      id: 'receptionist',
      number: 9,
      title: 'Receptionist / Front Office',
      personName: 'Kavita Chawla',
      designation: 'Front Desk Lead & Admissions Liaison',
      description: 'Visitor badges with printable gate passes, prospective admissions pipeline stages, appointments calendar, and campus enquiry logs.',
      icon: <PhoneCall className="w-5 h-5 text-theme-primary" />,
      badges: ['Visitor Badges', 'Admissions Pipeline', 'Appointments', 'Campus Log'],
      directRole: 'receptionist'
    },
    {
      id: 'exam_coordinator',
      number: 10,
      title: 'Exam Coordinator',
      personName: 'Prof. Arvind Deshmukh',
      designation: 'Controller of Examinations',
      description: 'Comprehensive exam setup, room schedules, conflict detector, marks roster approval, publication to parents, and report card generator.',
      icon: <Award className="w-5 h-5 text-theme-primary" />,
      badges: ['Exam Setup', 'Conflict Engine', 'Marks Moderation', 'Report Cards'],
      directRole: 'exam_coordinator'
    }
  ];

  const handleRoleCardClick = (roleCfg: ApprovedRoleConfig) => {
    if (roleCfg.isDualPlatform && roleCfg.id === 'teacher') {
      setPlatformModalRole('teacher');
    } else if (roleCfg.directRole) {
      switchRoleAndNavigate(roleCfg.directRole);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-theme-primary selection:text-white relative">
      {/* Background ambient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: themeColors.primary }}
        />
        <div
          className="absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-60"
          style={{ backgroundColor: themeColors.secondary }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ backgroundColor: themeColors.accent }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white font-black text-lg tracking-tight shadow-lg border border-white/10">
              SC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">SCHLAR</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  School Management SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400">One connected platform for smarter schools.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Demo institution badge */}
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <School className="w-3.5 h-3.5 text-theme-primary" />
              <span className="text-slate-200 font-medium">Greenfield International School</span>
              <span className="text-slate-500 hidden md:inline">· AY 2026–2027</span>
            </div>

            {/* Quick theme picker button */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-2xs"
              title="Open SCHLAR 12 Palettes & Theme Editor"
            >
              <div
                className="w-3.5 h-3.5 rounded-full ring-1 ring-white/30"
                style={{ backgroundColor: themeColors.primary }}
              />
              <span className="hidden sm:inline">Theme Palettes</span>
              <Sliders className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full flex flex-col justify-center">
        {/* Banner Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
            <span>Interactive Demo Foundation · 10 Approved Roles</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Role to Enter Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Choose any of the 10 authorized administrative, academic, operational, or parent roles.
            Every workspace is fully interactive and pre-populated with Greenfield International School demo records.
          </p>
        </div>

        {/* 10 Approved Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-10">
          {APPROVED_ROLES.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleCardClick(role)}
              className="group cursor-pointer rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-theme-primary transition-all p-4 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-0.5 relative overflow-hidden"
            >
              {/* Corner accent glow */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none" />

              <div>
                {/* Header with Role Number & Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center group-hover:border-theme-primary transition-colors">
                    {role.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                    Role #{role.number}
                  </span>
                </div>

                {/* Role Title & Person Name */}
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-theme-primary transition-colors flex items-center gap-1.5">
                    {role.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-slate-300 truncate">
                    {role.personName}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {role.designation}
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-3">
                  {role.description}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {role.badges.slice(0, 3).map((badge, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700/60"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                <span>{role.isDualPlatform ? 'Choose Platform' : 'Enter Workspace'}</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-theme-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* 12 Palettes Quick Bar */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-theme-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                12 System Color Palettes
              </span>
              <span className="text-[10px] text-slate-400">
                (Default: #{DEFAULT_PALETTE_ID === 'palette_7' ? '7' : ''} Petrol & Copper)
              </span>
            </div>
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1"
            >
              <span>Open Advanced Theme Customizer</span>
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {SCHLAR_PALETTES.map((pal) => {
              const isSelected = activePaletteId === pal.id;
              return (
                <button
                  key={pal.id}
                  onClick={() => setThemePalette(pal.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-slate-800 border-theme-primary ring-2 ring-theme'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="flex -space-x-1 shrink-0">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-900"
                      style={{ backgroundColor: pal.colors.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-slate-900"
                      style={{ backgroundColor: pal.colors.accent }}
                    />
                  </div>
                  <div className="truncate text-[11px] leading-tight">
                    <span className="font-semibold text-slate-200 block truncate">
                      {pal.number}. {pal.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 block truncate">
                      {pal.colors.primary}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Platform Selection Modal for Teacher or Parent */}
      {platformModalRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setPlatformModalRole(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-theme-primary flex items-center justify-center text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Teacher Workspace Selection</h3>
                <p className="text-xs text-slate-400">
                  Select your preferred presentation format for Dr. Vikram Sharma.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
              {/* Web Portal Option */}
              <div
                onClick={() => {
                  switchRoleAndNavigate('teacher');
                  setPlatformModalRole(null);
                }}
                className="cursor-pointer p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-theme-primary transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-theme-primary mb-3">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Web Workstation</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Full desktop workstation with classroom roll call, gradebook mark entry, and assignments.
                </p>
                <span className="text-[11px] font-bold text-theme-primary flex items-center gap-1 group-hover:underline">
                  Launch Web Workstation →
                </span>
              </div>

              {/* Mobile App Option */}
              <div
                onClick={() => {
                  switchRoleAndNavigate('teacher_mobile');
                  setPlatformModalRole(null);
                }}
                className="cursor-pointer p-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-theme-primary transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-theme-primary mb-3">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Mobile App Experience</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Handheld touchscreen simulation: 4-tab bottom navigation, quick attendance register, and schedule.
                </p>
                <span className="text-[11px] font-bold text-theme-primary flex items-center gap-1 group-hover:underline">
                  Launch Mobile Shell →
                </span>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setPlatformModalRole(null)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Honest Demo Notice Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-slate-950/70 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SCHLAR © 2026 Greenfield International School Demo · Prompt 1 Architecture Foundation
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Interactive demo session using browser-local storage. No real credentials required.
          </span>
        </div>
      </footer>
    </div>
  );
};
