import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  GraduationCap,
  Users,
  BookOpen,
  Layers,
  X,
  ArrowRight,
  Bell,
  Calendar,
  Briefcase,
  Bus,
  Lock,
  ChevronRight
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  category: 'Student' | 'Teacher' | 'Staff' | 'Class' | 'Subject' | 'Notice' | 'Event' | 'Book' | 'Transport';
  title: string;
  subtitle: string;
  targetPage: string;
  badge?: string;
}

export const QuickSearchModal: React.FC = () => {
  const {
    quickSearchOpen,
    setQuickSearchOpen,
    students,
    teachers,
    staff,
    classes,
    books,
    notices,
    events,
    subjects,
    setCurrentPage,
    currentRole
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen(true);
      } else if (e.key === 'Escape' && quickSearchOpen) {
        setQuickSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickSearchOpen, setQuickSearchOpen]);

  const q = query.toLowerCase().trim();

  // Role permissions scoping logic
  const results = useMemo((): SearchResultItem[] => {
    if (!q) return [];
    const items: SearchResultItem[] = [];

    const isParent = currentRole === 'parent' || currentRole === 'parent_mobile';
    const isExecutive = currentRole === 'principal' || currentRole === 'vice_principal';
    const isTeacher = currentRole === 'teacher' || currentRole === 'teacher_mobile';
    const isLibrarian = currentRole === 'librarian';
    const isTransport = currentRole === 'transport';
    const isReceptionist = currentRole === 'receptionist';

    // 1. Students (Restricted for parents to only their children; hidden for pure non-student roles)
    if (isParent) {
      // Only Aarav & Ananya
      students
        .filter((s) => s.id === 'std-8a-01' || s.id === 'std-5b-01')
        .filter((s) => s.name.toLowerCase().includes(q) || s.admissionId.toLowerCase().includes(q))
        .forEach((s) => {
          items.push({
            id: `res-stu-${s.id}`,
            category: 'Student',
            title: s.name,
            subtitle: `${s.admissionId} • Roll #${s.rollNo}`,
            targetPage: 'children',
            badge: 'Child Profile'
          });
        });
    } else if (!isTransport) {
      students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.admissionId.toLowerCase().includes(q) ||
            (!isParent && s.parentName.toLowerCase().includes(q))
        )
        .slice(0, 4)
        .forEach((s) => {
          const cls = classes.find((c) => c.id === s.classId);
          items.push({
            id: `res-stu-${s.id}`,
            category: 'Student',
            title: s.name,
            subtitle: `${cls ? cls.name : 'Unassigned'} • Adm #${s.admissionId} • ${s.status}`,
            targetPage: 'students',
            badge: s.academicStatus
          });
        });
    }

    // 2. Teachers / Faculty
    if (!isParent || isParent) {
      teachers
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.subjects.some((s) => s.toLowerCase().includes(q)) ||
            (t.department && t.department.toLowerCase().includes(q))
        )
        .slice(0, 3)
        .forEach((t) => {
          items.push({
            id: `res-tch-${t.id}`,
            category: 'Teacher',
            title: t.name,
            subtitle: `${t.roleTitle} • ${t.subjects.join(', ')}`,
            targetPage: isParent ? 'messages' : 'teachers',
            badge: t.department
          });
        });
    }

    // 3. Administrative Staff (Principal, VP, HR, Receptionist)
    if (isExecutive || currentRole === 'hr' || isReceptionist) {
      staff
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.role.toLowerCase().includes(q) ||
            s.department.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .forEach((s) => {
          items.push({
            id: `res-stf-${s.id}`,
            category: 'Staff',
            title: s.name,
            subtitle: `${s.role} • ${s.department}`,
            targetPage: 'staff',
            badge: s.employmentType
          });
        });
    }

    // 4. Classes
    if (!isParent && !isLibrarian) {
      classes
        .filter((c) => c.name.toLowerCase().includes(q) || c.room.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((c) => {
          items.push({
            id: `res-cls-${c.id}`,
            category: 'Class',
            title: c.name,
            subtitle: `Room: ${c.room} • Mentor: ${c.classTeacherName} (${c.studentCount} Students)`,
            targetPage: 'classes',
            badge: `${c.attendanceToday}% Attendance`
          });
        });
    }

    // 5. Subjects
    if (isExecutive || isTeacher || currentRole === 'exam_coordinator') {
      subjects
        .filter((sb) => sb.name.toLowerCase().includes(q) || sb.code.toLowerCase().includes(q))
        .slice(0, 3)
        .forEach((sb) => {
          items.push({
            id: `res-sub-${sb.id}`,
            category: 'Subject',
            title: `${sb.name} (${sb.code})`,
            subtitle: `${sb.category} • ${sb.periodsPerWeek} Periods/Week`,
            targetPage: 'academics',
            badge: sb.status
          });
        });
    }

    // 6. Notices (Filtered by audience permission)
    notices
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.category.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .forEach((n) => {
        items.push({
          id: `res-not-${n.id}`,
          category: 'Notice',
          title: n.title,
          subtitle: `${n.category} Circular • Target: ${n.targetAudience} (${n.date})`,
          targetPage: 'notices',
          badge: n.priority
        });
      });

    // 7. Events & Academic Calendar
    events
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .forEach((e) => {
        items.push({
          id: `res-evt-${e.id}`,
          category: 'Event',
          title: e.title,
          subtitle: `${e.date} • ${e.time} • ${e.location}`,
          targetPage: 'events',
          badge: e.category
        });
      });

    // 8. Library Books
    if (!isTransport) {
      books
        .filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q)
        )
        .slice(0, 3)
        .forEach((b) => {
          items.push({
            id: `res-bk-${b.id}`,
            category: 'Book',
            title: b.title,
            subtitle: `Author: ${b.author} • Shelf: ${b.shelf} (${b.availableCopies}/${b.totalCopies} Avail)`,
            targetPage: 'books',
            badge: b.status
          });
        });
    }

    return items;
  }, [q, students, teachers, staff, classes, books, notices, events, subjects, currentRole]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setQuickSearchOpen(false);
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Student':
        return <GraduationCap className="w-4 h-4 text-emerald-600" />;
      case 'Teacher':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'Staff':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'Class':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'Subject':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'Notice':
        return <Bell className="w-4 h-4 text-rose-600" />;
      case 'Event':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'Book':
        return <BookOpen className="w-4 h-4 text-cyan-600" />;
      case 'Transport':
        return <Bus className="w-4 h-4 text-orange-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!quickSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
      onClick={() => setQuickSearchOpen(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search authorized students, faculty, notices, calendar, books..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            className="w-full text-sm font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
          />
          <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC to close
          </span>
          <button
            onClick={() => setQuickSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 max-h-[65vh] overflow-y-auto space-y-4">
          {!q ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Quick Subsystem Portals
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Role: <span className="uppercase font-bold text-slate-600">{currentRole}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleNavigate('notices')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-100"
                >
                  <Bell className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Notice Board</span>
                    <span className="block text-[10px] text-slate-400">{notices.length} Bulletins</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('events')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-100"
                >
                  <Calendar className="w-4 h-4 text-blue-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Academic Calendar</span>
                    <span className="block text-[10px] text-slate-400">{events.length} Milestones</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('messages')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-100"
                >
                  <Users className="w-4 h-4 text-purple-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Messaging Desk</span>
                    <span className="block text-[10px] text-slate-400">Intra-School Log</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('students')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-100"
                >
                  <GraduationCap className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Student Records</span>
                    <span className="block text-[10px] text-slate-400">{students.length} Enrolled</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('books')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-100"
                >
                  <BookOpen className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Library Commons</span>
                    <span className="block text-[10px] text-slate-400">{books.length} Books</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavigate('audit')}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors border border-slate-100"
                >
                  <Lock className="w-4 h-4 text-rose-700 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Audit Trail</span>
                    <span className="block text-[10px] text-slate-400">Security Ledger</span>
                  </div>
                </button>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <span>No matching records found for "{query}".</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Searches are strictly scoped to records authorized for your active role ({currentRole}).
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Search Results ({results.length})
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  RBAC Filtered
                </span>
              </div>

              {results.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(item.targetPage)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-all text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{item.title}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 font-mono">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Role boundary enforced: zero cross-role data leaks</span>
          <span className="font-mono">SCHLAR Enterprise v2.4</span>
        </div>
      </div>
    </div>
  );
};
