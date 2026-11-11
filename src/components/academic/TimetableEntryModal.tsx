import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableEntry, TimetableConflict } from '../../types';
import { checkTimetableConflict } from '../../data/academicData';
import {
  X,
  Clock,
  BookOpen,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface TimetableEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryToEdit?: TimetableEntry | null;
  initialClassId?: string;
  initialDay?: TimetableEntry['dayOfWeek'];
  initialPeriodId?: string;
}

export const TimetableEntryModal: React.FC<TimetableEntryModalProps> = ({
  isOpen,
  onClose,
  entryToEdit,
  initialClassId,
  initialDay,
  initialPeriodId
}) => {
  const {
    activeAcademicYearId,
    classes,
    subjects,
    teachers,
    periods,
    availableRooms,
    subjectAllocations,
    timetableEntries,
    addTimetableEntry,
    updateTimetableEntry,
    addToast
  } = useApp();

  const isEditing = !!entryToEdit;

  // Form state
  const [classId, setClassId] = useState<string>(initialClassId || 'class-10a');
  const [dayOfWeek, setDayOfWeek] = useState<TimetableEntry['dayOfWeek']>(initialDay || 'Monday');
  const [periodId, setPeriodId] = useState<string>(initialPeriodId || 'p-1');
  const [subjectId, setSubjectId] = useState<string>('sub-math');
  const [teacherId, setTeacherId] = useState<string>('t-1');
  const [room, setRoom] = useState<string>('Room 301');
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Published');

  // Live conflicts detected
  const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);

  // Selected period config details
  const selectedPeriodConfig = periods.find((p) => p.id === periodId) || periods[0];
  const selectedClass = classes.find((c) => c.id === classId);

  // Initialize or reset form when entryToEdit or props change
  useEffect(() => {
    if (entryToEdit) {
      setClassId(entryToEdit.classId);
      setDayOfWeek(entryToEdit.dayOfWeek);
      setPeriodId(entryToEdit.periodId);
      setSubjectId(entryToEdit.subjectId);
      setTeacherId(entryToEdit.teacherId);
      setRoom(entryToEdit.room);
      setNotes(entryToEdit.notes || '');
      setStatus(entryToEdit.status);
    } else {
      if (initialClassId) setClassId(initialClassId);
      if (initialDay) setDayOfWeek(initialDay);
      if (initialPeriodId) setPeriodId(initialPeriodId);

      // Auto-populate subject/teacher from allocations if available
      const clsId = initialClassId || classId;
      const classAlloc = subjectAllocations.find((a) => a.classId === clsId);
      if (classAlloc) {
        setSubjectId(classAlloc.subjectId);
        setTeacherId(classAlloc.teacherId);
        if (classAlloc.room) setRoom(classAlloc.room);
      }
      setNotes('');
      setStatus('Published');
    }
  }, [entryToEdit, initialClassId, initialDay, initialPeriodId, isOpen]);

  // When class changes in add mode, auto-suggest first allocation
  const handleClassChange = (newClassId: string) => {
    setClassId(newClassId);
    const alloc = subjectAllocations.find((a) => a.classId === newClassId);
    if (alloc) {
      setSubjectId(alloc.subjectId);
      setTeacherId(alloc.teacherId);
      if (alloc.room) setRoom(alloc.room);
    }
  };

  // When subject changes, try to auto-select teacher allocated for this class & subject
  const handleSubjectChange = (newSubjectId: string) => {
    setSubjectId(newSubjectId);
    const match = subjectAllocations.find(
      (a) => a.classId === classId && a.subjectId === newSubjectId
    );
    if (match) {
      setTeacherId(match.teacherId);
      if (match.room) setRoom(match.room);
    } else {
      // Suggest subject department HOD if defined
      const sub = subjects.find((s) => s.id === newSubjectId);
      if (sub?.departmentHodId) {
        setTeacherId(sub.departmentHodId);
      }
    }
  };

  // Real-time conflict validation
  useEffect(() => {
    if (!isOpen) return;

    const currentSub = subjects.find((s) => s.id === subjectId);
    const currentTeach = teachers.find((t) => t.id === teacherId);

    const candidateEntry: Omit<TimetableEntry, 'id'> = {
      academicYearId: activeAcademicYearId,
      classId,
      section: selectedClass?.section || 'A',
      dayOfWeek,
      periodId,
      periodName: selectedPeriodConfig.name,
      startTime: selectedPeriodConfig.startTime,
      endTime: selectedPeriodConfig.endTime,
      subjectId,
      subjectName: currentSub?.name || 'Subject',
      teacherId,
      teacherName: currentTeach?.name || 'Teacher',
      room,
      notes,
      status
    };

    const detected = checkTimetableConflict(
      candidateEntry,
      timetableEntries,
      entryToEdit?.id
    );

    setConflicts(detected);
  }, [
    isOpen,
    classId,
    dayOfWeek,
    periodId,
    subjectId,
    teacherId,
    room,
    notes,
    status,
    activeAcademicYearId,
    timetableEntries,
    entryToEdit,
    selectedPeriodConfig,
    selectedClass,
    subjects,
    teachers
  ]);

  if (!isOpen) return null;

  const currentSub = subjects.find((s) => s.id === subjectId);
  const currentTeach = teachers.find((t) => t.id === teacherId);
  const blockingConflicts = conflicts.filter((c) => c.severity === 'blocking');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (blockingConflicts.length > 0) {
      addToast({
        type: 'error',
        title: 'Scheduling Conflict',
        message: blockingConflicts[0].message
      });
      return;
    }

    const entryData: Omit<TimetableEntry, 'id'> = {
      academicYearId: activeAcademicYearId,
      classId,
      section: selectedClass?.section || 'A',
      dayOfWeek,
      periodId,
      periodName: selectedPeriodConfig.name,
      startTime: selectedPeriodConfig.startTime,
      endTime: selectedPeriodConfig.endTime,
      subjectId,
      subjectName: currentSub?.name || 'Subject',
      teacherId,
      teacherName: currentTeach?.name || 'Teacher',
      room,
      notes: notes.trim(),
      status
    };

    if (isEditing && entryToEdit) {
      const res = updateTimetableEntry(entryToEdit.id, entryData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Lesson Updated',
          message: `${entryData.subjectName} on ${entryData.dayOfWeek} (${selectedPeriodConfig.name}) saved successfully.`
        });
        onClose();
      } else {
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: res.error || 'Could not update timetable entry.'
        });
      }
    } else {
      const res = addTimetableEntry(entryData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Lesson Scheduled',
          message: `${entryData.subjectName} on ${entryData.dayOfWeek} (${selectedPeriodConfig.name}) added to timetable.`
        });
        onClose();
      } else {
        addToast({
          type: 'error',
          title: 'Scheduling Failed',
          message: res.error || 'Could not add timetable entry.'
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Edit Timetable Lesson' : 'Schedule Timetable Period'}
              </h3>
              <p className="text-xs text-emerald-300">
                Greenfield Academic Timetable · {dayOfWeek}, {selectedPeriodConfig.name} ({selectedPeriodConfig.startTime}–{selectedPeriodConfig.endTime})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Real-time Conflict Alert Box */}
          {conflicts.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Scheduling Conflicts Detected ({conflicts.length})</span>
              </div>
              <ul className="space-y-1 text-rose-700 pl-6 list-disc text-[11px]">
                {conflicts.map((c, i) => (
                  <li key={i}>
                    <strong>{c.title}:</strong> {c.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Time & Day Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Class / Section <span className="text-rose-500">*</span>
              </label>
              <select
                value={classId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.room})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Day of Week <span className="text-rose-500">*</span>
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as TimetableEntry['dayOfWeek'])}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Period Slot <span className="text-rose-500">*</span>
              </label>
              <select
                value={periodId}
                onChange={(e) => setPeriodId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {periods
                  .filter((p) => p.type === 'Teaching')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.startTime}–{p.endTime})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Subject & Teacher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>Subject <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Category: {currentSub?.category || 'Core'}
                </span>
              </label>
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.code}) - {sub.periodsPerWeek} periods/wk
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>Assigned Instructor <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Dept: {currentTeach?.department || 'Faculty'}
                </span>
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {teachers.map((tch) => (
                  <option key={tch.id} value={tch.id}>
                    {tch.name} ({tch.subjectSpecialization || tch.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Classroom / Lab Location <span className="text-rose-500">*</span>
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                {availableRooms.map((rm) => (
                  <option key={rm} value={rm}>
                    {rm}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Publication State</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Draft' | 'Published')}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="Published">Published (Live in Student & Teacher portals)</option>
                <option value="Draft">Draft (Internal academic planning only)</option>
              </select>
            </div>
          </div>

          {/* Lesson Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Curriculum Unit or Topic Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 5: Trigonometry Identities & Problem Set"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Conflict-free badge */}
          {conflicts.length === 0 && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-emerald-800 text-[11px] font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Verified conflict-free: Both {currentTeach?.name || 'teacher'} and {room} are completely available during this time slot.
              </span>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={blockingConflicts.length > 0}
              className={`px-5 py-2 rounded-lg font-bold text-xs text-white shadow-xs transition-all ${
                blockingConflicts.length > 0
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-emerald-900 hover:bg-emerald-800'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Schedule Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
