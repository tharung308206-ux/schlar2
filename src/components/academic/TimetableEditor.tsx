import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableEntry, TimetableConflict } from '../../types';
import { TimetableEntryModal } from './TimetableEntryModal';
import { checkTimetableConflict } from '../../data/academicData';
import {
  Clock,
  Calendar,
  Layers,
  Users,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  FileSpreadsheet,
  Printer,
  Info,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const TimetableEditor: React.FC = () => {
  const {
    activeAcademicYearId,
    academicYears,
    classes,
    teachers,
    subjects,
    periods,
    availableRooms,
    timetableEntries,
    timetableVersions,
    deleteTimetableEntry,
    publishTimetable,
    createTimetableRevision,
    addToast
  } = useApp();

  // Active view states
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'room' | 'day'>('class');
  const [selectedClassId, setSelectedClassId] = useState<string>('class-10a');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || 't-1');
  const [selectedRoom, setSelectedRoom] = useState<string>('Room 301');
  const [selectedDay, setSelectedDay] = useState<TimetableEntry['dayOfWeek']>('Monday');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Entry Modal States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<TimetableEntry | null>(null);
  const [slotPrefill, setSlotPrefill] = useState<{
    classId: string;
    day: TimetableEntry['dayOfWeek'];
    periodId: string;
  }>({
    classId: 'class-10a',
    day: 'Monday',
    periodId: 'p-1'
  });

  // Delete Confirmation State
  const [entryToDelete, setEntryToDelete] = useState<TimetableEntry | null>(null);

  // Publish / Revision Modal State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishNotes, setPublishNotes] = useState('Official approved schedule revision.');

  // Print view modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  const activeAcademicYear = academicYears.find((y) => y.id === activeAcademicYearId) || academicYears[0];
  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  const currentClassVersion = timetableVersions.find(
    (v) => v.classId === selectedClassId && v.academicYearId === activeAcademicYearId
  ) || {
    versionNumber: '1.0',
    status: 'Published',
    lastUpdated: '2026-08-12 14:30',
    updatedBy: 'Mrs. Evelyn Hayes'
  };

  const workingDays: TimetableEntry['dayOfWeek'][] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  // Comprehensive audit across all entries for this academic year
  const globalConflicts = useMemo(() => {
    const list: TimetableConflict[] = [];
    const yearEntries = timetableEntries.filter((e) => e.academicYearId === activeAcademicYearId);

    yearEntries.forEach((entry) => {
      const detected = checkTimetableConflict(entry, yearEntries, entry.id);
      detected.forEach((c) => {
        // De-duplicate symmetric conflicts
        if (!list.some((existing) => existing.message === c.message)) {
          list.push(c);
        }
      });
    });

    return list;
  }, [timetableEntries, activeAcademicYearId]);

  // Filter entries based on the current active view mode
  const displayedEntries = useMemo(() => {
    return timetableEntries.filter((entry) => {
      if (entry.academicYearId !== activeAcademicYearId) return false;
      if (selectedSubjectFilter !== 'all' && entry.subjectId !== selectedSubjectFilter) return false;

      if (viewMode === 'class') {
        return entry.classId === selectedClassId;
      }
      if (viewMode === 'teacher') {
        return entry.teacherId === selectedTeacherId;
      }
      if (viewMode === 'room') {
        return entry.room.toLowerCase() === selectedRoom.toLowerCase();
      }
      if (viewMode === 'day') {
        return entry.classId === selectedClassId && entry.dayOfWeek === selectedDay;
      }
      return true;
    });
  }, [
    timetableEntries,
    activeAcademicYearId,
    viewMode,
    selectedClassId,
    selectedTeacherId,
    selectedRoom,
    selectedDay,
    selectedSubjectFilter
  ]);

  // Lookup helper for a specific cell in the grid
  const getCellEntry = (day: TimetableEntry['dayOfWeek'], periodId: string): TimetableEntry | undefined => {
    if (viewMode === 'class') {
      return displayedEntries.find((e) => e.dayOfWeek === day && e.periodId === periodId && e.classId === selectedClassId);
    }
    if (viewMode === 'teacher') {
      return displayedEntries.find((e) => e.dayOfWeek === day && e.periodId === periodId && e.teacherId === selectedTeacherId);
    }
    if (viewMode === 'room') {
      return displayedEntries.find((e) => e.dayOfWeek === day && e.periodId === periodId && e.room === selectedRoom);
    }
    return undefined;
  };

  // Subject color styling helper
  const getSubjectColorClasses = (subjectName: string) => {
    const sub = subjects.find((s) => s.name.toLowerCase() === subjectName.toLowerCase());
    const cat = sub?.category;

    if (cat === 'Core Academic') return 'bg-blue-50 text-blue-900 border-blue-200';
    if (cat === 'Science & Lab') return 'bg-teal-50 text-teal-900 border-teal-200';
    if (cat === 'Humanities') return 'bg-amber-50 text-amber-900 border-amber-200';
    if (cat === 'Technology') return 'bg-purple-50 text-purple-900 border-purple-200';
    if (cat === 'Arts & Physical Ed') return 'bg-rose-50 text-rose-900 border-rose-200';
    return 'bg-slate-50 text-slate-800 border-slate-200';
  };

  // Cell click handlers
  const handleOpenAdd = (day: TimetableEntry['dayOfWeek'], periodId: string) => {
    setEntryToEdit(null);
    setSlotPrefill({
      classId: selectedClassId,
      day,
      periodId
    });
    setIsEntryModalOpen(true);
  };

  const handleOpenEdit = (entry: TimetableEntry) => {
    setEntryToEdit(entry);
    setIsEntryModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!entryToDelete) return;
    const ok = deleteTimetableEntry(entryToDelete.id);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Lesson Removed',
        message: `${entryToDelete.subjectName} on ${entryToDelete.dayOfWeek} (${entryToDelete.periodName}) was removed.`
      });
    }
    setEntryToDelete(null);
  };

  const handlePublish = () => {
    publishTimetable(selectedClassId, publishNotes);
    setShowPublishModal(false);
  };

  const handleCreateRevision = () => {
    createTimetableRevision(selectedClassId, 'Draft revision created for upcoming academic cycle.');
  };

  // Subject coverage stats for currently selected class
  const classStats = useMemo(() => {
    const entries = timetableEntries.filter(
      (e) => e.classId === selectedClassId && e.academicYearId === activeAcademicYearId
    );
    const subjectCounts: Record<string, number> = {};
    entries.forEach((e) => {
      subjectCounts[e.subjectName] = (subjectCounts[e.subjectName] || 0) + 1;
    });
    return {
      totalPeriods: entries.length,
      subjectCounts
    };
  }, [timetableEntries, selectedClassId, activeAcademicYearId]);

  return (
    <div className="space-y-6">
      {/* Header with Title and Mode Switchers */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {activeAcademicYear.name}
            </span>
            <span
              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                currentClassVersion.status === 'Published'
                  ? 'bg-teal-50 text-teal-800 border-teal-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              v{currentClassVersion.versionNumber} {currentClassVersion.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Academic Timetable Editor
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized master scheduling matrix with real-time faculty, room, and cohort conflict detection.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Grid</span>
          </button>

          <button
            onClick={handleCreateRevision}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>New Draft Revision</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Schedule</span>
          </button>

          <button
            onClick={() => {
              setEntryToEdit(null);
              setSlotPrefill({
                classId: selectedClassId,
                day: 'Monday',
                periodId: 'p-1'
              });
              setIsEntryModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Period</span>
          </button>
        </div>
      </div>

      {/* Audit Banner */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
          globalConflicts.length === 0
            ? 'bg-teal-50 border-teal-200 text-teal-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {globalConflicts.length === 0 ? (
            <CheckCircle2 className="w-5 h-5 text-teal-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <span className="font-bold block">
              {globalConflicts.length === 0
                ? 'Master Timetable Audit Passed: 0 Scheduling Conflicts'
                : `Timetable Audit Warning: ${globalConflicts.length} Conflict(s) Detected`}
            </span>
            <span className="text-[11px] opacity-80 block">
              {globalConflicts.length === 0
                ? 'All classroom allocations, teacher period assignments, and time slots are strictly non-overlapping.'
                : 'Overlapping bookings exist for instructors or physical spaces. Open cell to resolve.'}
            </span>
          </div>
        </div>

        {globalConflicts.length > 0 && (
          <div className="text-[11px] font-bold text-rose-800 underline cursor-pointer">
            View Conflict Details
          </div>
        )}
      </div>

      {/* Perspective & Filter Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        {/* Top selector row: View mode pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('class')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'class'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Class Timetable</span>
            </button>

            <button
              onClick={() => setViewMode('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'teacher'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teacher Schedule</span>
            </button>

            <button
              onClick={() => setViewMode('room')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'room'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Classroom / Lab</span>
            </button>

            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-emerald-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Day-by-Day</span>
            </button>
          </div>

          {/* Contextual Target Dropdown based on viewMode */}
          <div className="flex items-center gap-2">
            {viewMode === 'class' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Select Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.room})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewMode === 'teacher' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Select Faculty:</span>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} ({tch.department})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewMode === 'room' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Select Room:</span>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  {availableRooms.map((rm) => (
                    <option key={rm} value={rm}>
                      {rm}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewMode === 'day' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Class:</span>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-500 font-semibold">Day:</span>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as TimetableEntry['dayOfWeek'])}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                >
                  {workingDays.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Info & Subject Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            {viewMode === 'class' && (
              <>
                <div>
                  <span className="text-slate-400">Class Mentor:</span>{' '}
                  <strong className="text-slate-800">{selectedClass?.classTeacherName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Home Room:</span>{' '}
                  <strong className="text-slate-800">{selectedClass?.room}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Total Periods:</span>{' '}
                  <strong className="text-emerald-800 font-mono font-bold">
                    {classStats.totalPeriods} / 30 slots
                  </strong>
                </div>
              </>
            )}

            {viewMode === 'teacher' && (
              <>
                <div>
                  <span className="text-slate-400">Specialization:</span>{' '}
                  <strong className="text-slate-800">{selectedTeacher?.subjectSpecialization}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Weekly Workload:</span>{' '}
                  <strong className="text-emerald-800 font-mono font-bold">
                    {displayedEntries.length} teaching periods/week
                  </strong>
                </div>
              </>
            )}

            {viewMode === 'room' && (
              <>
                <div>
                  <span className="text-slate-400">Location:</span>{' '}
                  <strong className="text-slate-800">{selectedRoom}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Occupancy:</span>{' '}
                  <strong className="text-emerald-800 font-mono font-bold">
                    {displayedEntries.length} periods booked / 30 total
                  </strong>
                </div>
              </>
            )}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Highlight Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ================= THE MAIN TIMETABLE GRID ================= */}
      {viewMode !== 'day' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px] text-xs">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-3.5 w-36 border-r border-slate-200">Time / Period</th>
                  {workingDays.map((day) => (
                    <th key={day} className="py-3 px-3.5 text-center border-r border-slate-200 last:border-r-0">
                      <div className="font-extrabold text-slate-900">{day}</div>
                      <div className="text-[10px] text-slate-400 font-normal">Working Day</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {periods.map((period) => {
                  const isBreakOrLunch = period.type === 'Break' || period.type === 'Lunch';

                  if (isBreakOrLunch) {
                    return (
                      <tr key={period.id} className="bg-slate-50/70 border-y border-slate-200">
                        <td className="py-2.5 px-3.5 border-r border-slate-200 font-bold text-slate-500 font-mono text-[11px]">
                          {period.startTime} - {period.endTime}
                        </td>
                        <td
                          colSpan={workingDays.length}
                          className="py-2 px-4 text-center font-bold text-slate-500 tracking-wider text-xs uppercase bg-slate-100/50"
                        >
                          ☕ {period.name} ({period.startTime} – {period.endTime})
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={period.id} className="hover:bg-slate-50/40 transition-colors">
                      {/* Period Header Column */}
                      <td className="py-3 px-3.5 border-r border-slate-200 align-top bg-slate-50/40">
                        <div className="font-extrabold text-slate-900">{period.name}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {period.startTime} – {period.endTime}
                        </div>
                      </td>

                      {/* Day Columns */}
                      {workingDays.map((day) => {
                        const entry = getCellEntry(day, period.id);

                        return (
                          <td
                            key={day}
                            className="p-1.5 border-r border-slate-200 last:border-r-0 align-top h-24 min-w-[150px] relative group"
                          >
                            {entry ? (
                              <div
                                onClick={() => handleOpenEdit(entry)}
                                className={`h-full p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] ${getSubjectColorClasses(
                                  entry.subjectName
                                )}`}
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="font-bold text-xs leading-tight line-clamp-1">
                                      {entry.subjectName}
                                    </span>
                                    {entry.status === 'Draft' && (
                                      <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-1 py-0.2 rounded shrink-0">
                                        Draft
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-1">
                                    <Users className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span className="truncate">
                                      {viewMode === 'teacher'
                                        ? classes.find((c) => c.id === entry.classId)?.name || entry.section
                                        : entry.teacherName}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{entry.room}</span>
                                  </div>
                                </div>

                                {entry.notes && (
                                  <div className="text-[10px] text-slate-500 italic truncate mt-1 border-t border-slate-200/50 pt-1">
                                    "{entry.notes}"
                                  </div>
                                )}

                                {/* Hover overlay action bar */}
                                <div className="hidden group-hover:flex items-center justify-end gap-1 mt-1 pt-1 border-t border-slate-200/60">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenEdit(entry);
                                    }}
                                    title="Edit Period"
                                    className="p-1 hover:bg-white/80 rounded text-slate-600 hover:text-slate-900"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEntryToDelete(entry);
                                    }}
                                    title="Remove Period"
                                    className="p-1 hover:bg-rose-100 rounded text-slate-600 hover:text-rose-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Empty Cell Slot with hover Add button */
                              <div
                                onClick={() => handleOpenAdd(day, period.id)}
                                className="h-full min-h-[78px] rounded-lg border border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer transition-all group/btn"
                              >
                                <span className="text-[11px] font-semibold text-slate-400 group-hover/btn:text-emerald-700 flex items-center gap-1">
                                  <Plus className="w-3 h-3" />
                                  <span>Add Lesson</span>
                                </span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= DAY-BY-DAY VIEW ================= */
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Schedule for {selectedDay} ({selectedClass?.name})
            </h3>
            <button
              onClick={() => {
                setEntryToEdit(null);
                setSlotPrefill({
                  classId: selectedClassId,
                  day: selectedDay,
                  periodId: 'p-1'
                });
                setIsEntryModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 text-white rounded-lg text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lesson to {selectedDay}</span>
            </button>
          </div>

          <div className="space-y-3">
            {periods
              .filter((p) => p.type === 'Teaching')
              .map((period) => {
                const entry = displayedEntries.find((e) => e.periodId === period.id);

                return (
                  <div
                    key={period.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-left">
                        <span className="text-xs font-extrabold text-slate-900 block">{period.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 block">
                          {period.startTime}–{period.endTime}
                        </span>
                      </div>

                      {entry ? (
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{entry.subjectName}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getSubjectColorClasses(
                                entry.subjectName
                              )}`}
                            >
                              {entry.room}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Teacher: <strong className="text-slate-800">{entry.teacherName}</strong>
                            {entry.notes && ` · "${entry.notes}"`}
                          </p>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">No lesson scheduled for this slot.</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {entry ? (
                        <>
                          <button
                            onClick={() => handleOpenEdit(entry)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setEntryToDelete(entry)}
                            className="px-2.5 py-1 text-rose-600 hover:text-rose-800 border border-slate-200 rounded text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenAdd(selectedDay, period.id)}
                          className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs font-bold hover:bg-emerald-100"
                        >
                          + Assign Lesson
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Curriculum Coverage Summary Bar */}
      {viewMode === 'class' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>Subject Period Allocation Coverage ({selectedClass?.name})</span>
            </h3>
            <span className="text-xs text-slate-500">
              {classStats.totalPeriods} of 30 weekly periods scheduled
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {subjects.map((sub) => {
              const count = classStats.subjectCounts[sub.name] || 0;
              const req = sub.periodsPerWeek;
              const isMet = count >= req;

              return (
                <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-800 truncate" title={sub.name}>
                      {sub.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isMet
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {count}/{req}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                    <div
                      className={`h-1.5 rounded-full ${isMet ? 'bg-emerald-700' : 'bg-amber-600'}`}
                      style={{ width: `${Math.min(100, Math.round((count / req) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {isMet ? '✓ Allocation met' : `${req - count} more required`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT TIMETABLE ENTRY ================= */}
      <TimetableEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        entryToEdit={entryToEdit}
        initialClassId={slotPrefill.classId}
        initialDay={slotPrefill.day}
        initialPeriodId={slotPrefill.periodId}
      />

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {entryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Remove Timetable Lesson?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong>{entryToDelete.subjectName}</strong> scheduled on{' '}
                <strong>{entryToDelete.dayOfWeek}</strong> ({entryToDelete.periodName}) with{' '}
                <strong>{entryToDelete.teacherName}</strong> in <strong>{entryToDelete.room}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setEntryToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PUBLISH SCHEDULE ================= */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Publish Official Timetable</h3>
                <p className="text-xs text-emerald-300">{selectedClass?.name} · Academic Year 2026–2027</p>
              </div>
              <button onClick={() => setShowPublishModal(false)} className="text-emerald-300 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 space-y-1">
                <span className="font-bold block">Live Synchronisation</span>
                <p className="text-[11px] leading-relaxed">
                  Publishing this schedule will push the latest verified lessons to student portals, parent mobile notifications, and faculty workstations immediately.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Revision Changelog / Notes</label>
                <textarea
                  rows={3}
                  value={publishNotes}
                  onChange={(e) => setPublishNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  placeholder="e.g. Approved by Vice Principal. Swapped Period 4 lab session."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Publish & Notify All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINT PREVIEW ================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden p-6 text-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Printable Schedule Card</h3>
                <p className="text-xs text-slate-500">
                  Greenfield International School · {selectedClass?.name} ({selectedClass?.room})
                </p>
              </div>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50 text-xs font-mono space-y-2 max-h-80 overflow-y-auto">
              <div className="text-center font-bold text-sm text-slate-900 font-sans pb-2 border-b border-slate-200">
                GREENFIELD INTERNATIONAL SCHOOL — MASTER TIMETABLE 2026–2027
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans pb-2">
                <div>Class: {selectedClass?.name}</div>
                <div>Class Mentor: {selectedClass?.classTeacherName}</div>
                <div>Room: {selectedClass?.room}</div>
                <div>Effective: August 15, 2026</div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-[10px]">
                <thead>
                  <tr className="bg-slate-200">
                    <th className="border border-slate-300 p-1">Period</th>
                    <th className="border border-slate-300 p-1">Time</th>
                    {workingDays.map((d) => (
                      <th key={d} className="border border-slate-300 p-1">{d.slice(0, 3)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p) => (
                    <tr key={p.id}>
                      <td className="border border-slate-300 p-1 font-bold">{p.name}</td>
                      <td className="border border-slate-300 p-1">{p.startTime}-{p.endTime}</td>
                      {p.type === 'Teaching' ? (
                        workingDays.map((d) => {
                          const e = getCellEntry(d, p.id);
                          return (
                            <td key={d} className="border border-slate-300 p-1">
                              {e ? `${e.subjectName.slice(0, 10)} (${e.room})` : '—'}
                            </td>
                          );
                        })
                      ) : (
                        <td colSpan={5} className="border border-slate-300 p-1 text-center bg-slate-100 font-bold">
                          {p.name}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Schedule Dispatched',
                    message: `Official print copy generated for ${selectedClass?.name}.`
                  });
                  setShowPrintModal(false);
                }}
                className="px-5 py-2 bg-emerald-900 text-white rounded-lg font-bold text-xs"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
