import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolEvent } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  CalendarDays,
  FileSpreadsheet,
  Award,
  Sparkles,
  X,
  AlertTriangle
} from 'lucide-react';

export const AcademicCalendarEvents: React.FC = () => {
  const {
    events,
    activeAcademicYearId,
    academicYears,
    addEvent,
    updateEvent,
    deleteEvent,
    addToast,
    currentRole,
    logAuditEvent,
    userProfiles
  } = useApp();

  const canManageEvents =
    currentRole === 'principal' ||
    currentRole === 'vice_principal' ||
    currentRole === 'teacher' ||
    currentRole === 'exam_coordinator';

  const [activeView, setActiveView] = useState<'calendar' | 'agenda'>('agenda');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<SchoolEvent['category']>('Academic');
  const [formDate, setFormDate] = useState('2026-11-20');
  const [formTime, setFormTime] = useState('09:00 AM - 12:00 PM');
  const [formLocation, setFormLocation] = useState('Main Auditorium');
  const [formAudience, setFormAudience] = useState<SchoolEvent['targetAudience']>('All School Community');
  const [formDesc, setFormDesc] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const activeYear = academicYears.find((y) => y.id === activeAcademicYearId) || academicYears[0];

  // Combined events: User defined school events + Term starts/ends & exam windows from active academic year!
  const allEvents = useMemo(() => {
    const list: SchoolEvent[] = [...events];

    // Add milestones from active year if not present
    if (activeYear) {
      activeYear.terms?.forEach((term, idx) => {
        list.push({
          id: `ay-term-start-${term.id}`,
          title: `${term.name} Begins`,
          date: term.startDate,
          time: '08:00 AM',
          location: 'Campus Wide',
          category: 'Academic',
          targetAudience: 'All School Community',
          description: `Commencement of teaching syllabus and instructional sessions for ${term.name}.`
        });

        if (term.examStartDate) {
          list.push({
            id: `ay-exam-${term.id}`,
            title: `${term.name} Examinations Window`,
            date: term.examStartDate,
            time: '08:30 AM - 01:30 PM',
            location: 'Assigned Examination Halls',
            category: 'Exams',
            targetAudience: 'Students & Faculty',
            description: `Summative assessments and moderated board examination period ending ${term.examEndDate}.`
          });
        }
      });
    }

    return list.sort((a, b) => a.date.localeCompare(b.date));
  }, [events, activeYear]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      if (categoryFilter === 'all') return true;
      return evt.category === categoryFilter;
    });
  }, [allEvents, categoryFilter]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormTitle('Parent-Teacher Academic Review Conference');
    setFormCategory('Parent Meeting');
    setFormDate('2026-11-15');
    setFormTime('09:00 AM - 03:30 PM');
    setFormLocation('Central Quadrangle & Classrooms');
    setFormAudience('Parents & Faculty');
    setFormDesc('Term 1 progress discussions, portfolio showcases, and mentor consultations.');
    setFormError(null);
    setShowEventModal(true);
  };

  const handleOpenEdit = (evt: SchoolEvent) => {
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormCategory(evt.category);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormLocation(evt.location);
    setFormAudience(evt.targetAudience);
    setFormDesc(evt.description);
    setFormError(null);
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Check for scheduling conflict: same date and overlapping location
    const conflict = allEvents.find(
      (e) =>
        e.id !== editingEvent?.id &&
        e.date === formDate &&
        e.location.toLowerCase() === formLocation.trim().toLowerCase()
    );
    if (conflict) {
      setFormError(
        `Scheduling Conflict: "${conflict.title}" is already booked at "${formLocation}" on ${formDate} (${conflict.time}).`
      );
      return;
    }

    const eventData: Omit<SchoolEvent, 'id'> = {
      title: formTitle.trim(),
      category: formCategory,
      date: formDate,
      time: formTime.trim(),
      location: formLocation.trim(),
      targetAudience: formAudience,
      description: formDesc.trim()
    };

    if (editingEvent) {
      const res = updateEvent(editingEvent.id, eventData);
      if (res.success) {
        logAuditEvent({
          actorRole: currentRole,
          actorName: userProfiles[currentRole]?.fullName || 'Institutional User',
          action: 'UPDATE_CALENDAR_EVENT',
          module: 'calendar',
          recordRef: editingEvent.id,
          status: 'SUCCESS'
        });
        addToast({
          type: 'success',
          title: 'Event Updated',
          message: `${eventData.title} saved to school calendar.`
        });
        setShowEventModal(false);
      } else {
        setFormError(res.error || 'Failed to update event.');
      }
    } else {
      const res = addEvent(eventData);
      if (res.success) {
        logAuditEvent({
          actorRole: currentRole,
          actorName: userProfiles[currentRole]?.fullName || 'Institutional User',
          action: 'CREATE_CALENDAR_EVENT',
          module: 'calendar',
          recordRef: eventData.title,
          status: 'SUCCESS'
        });
        addToast({
          type: 'success',
          title: 'Event Scheduled',
          message: `${eventData.title} added to institutional schedule.`
        });
        setShowEventModal(false);
      } else {
        setFormError(res.error || 'Failed to schedule event.');
      }
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!canManageEvents) {
      addToast({
        type: 'error',
        title: 'Access Denied',
        message: 'Your role does not have authorization to delete school calendar events.'
      });
      return;
    }
    const ok = deleteEvent(id);
    if (ok) {
      logAuditEvent({
        actorRole: currentRole,
        actorName: userProfiles[currentRole]?.fullName || 'Institutional User',
        action: 'DELETE_CALENDAR_EVENT',
        module: 'calendar',
        recordRef: id,
        status: 'SUCCESS'
      });
      addToast({
        type: 'success',
        title: 'Event Removed',
        message: `${title} was removed from the calendar.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Calendar & Events</h1>
            {!canManageEvents ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                View Only
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Authorized Editor
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key school assemblies, athletic championships, exam schedules, and parent conferences.
          </p>
        </div>

        {canManageEvents ? (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-theme-primary hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add School Event</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Published Term Schedule</span>
          </div>
        )}
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic Milestones</option>
            <option value="Exams">Examinations</option>
            <option value="Assembly">School Assemblies</option>
            <option value="Sports">Athletics & Sports</option>
            <option value="Cultural">Arts & Cultural</option>
            <option value="Parent Meeting">Parent Conferences</option>
            <option value="Holiday">Holidays & Recess</option>
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('agenda')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeView === 'agenda' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Chronological Agenda
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeView === 'calendar' ? 'bg-white text-emerald-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            Month Grid
          </button>
        </div>
      </div>

      {/* Agenda List View */}
      {activeView === 'agenda' ? (
        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Date Box */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 text-slate-800 flex flex-col items-center justify-center shrink-0 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 leading-none mt-0.5">
                    {new Date(evt.date).getDate()}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {new Date(evt.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        evt.category === 'Academic' || evt.category === 'Exams'
                          ? 'bg-blue-100 text-blue-800'
                          : evt.category === 'Sports'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.category === 'Parent Meeting'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {evt.category}
                    </span>
                    <span className="text-[11px] text-slate-400">Audience: {evt.targetAudience}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{evt.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {evt.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              </div>

              {!evt.id.startsWith('ay-') && canManageEvents && (
                <div className="flex items-center gap-1 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => handleOpenEdit(evt)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    title="Edit Event"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(evt.id, evt.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Month Grid Preview */
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Autumn & Winter Term 2026</span>
            <span className="text-slate-500">{filteredEvents.length} Events on Record</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-emerald-800">{evt.date}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{evt.category}</span>
                </div>
                <h4 className="font-bold text-slate-900">{evt.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{evt.description}</p>
                <div className="text-[10px] text-slate-400 pt-1 flex justify-between">
                  <span>{evt.location}</span>
                  <span>{evt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT EVENT ================= */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingEvent ? 'Edit Calendar Event' : 'Schedule School Event'}
                </h3>
                <p className="text-xs text-emerald-300">Set event timings, venue, and target community audience.</p>
              </div>
              <button onClick={() => setShowEventModal(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4 overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Annual Inter-School Science Fair"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  >
                    <option value="Academic">Academic Milestones</option>
                    <option value="Exams">Examinations</option>
                    <option value="Assembly">School Assembly</option>
                    <option value="Sports">Athletics & Sports</option>
                    <option value="Cultural">Arts & Cultural</option>
                    <option value="Parent Meeting">Parent Conferences</option>
                    <option value="Holiday">Holidays & Recess</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Target Audience</label>
                  <select
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  >
                    <option value="All School Community">All School Community</option>
                    <option value="Students & Faculty">Students & Faculty</option>
                    <option value="Parents & Faculty">Parents & Faculty</option>
                    <option value="High School Grades 9-10">High School Grades 9-10</option>
                    <option value="Middle School Grades 7-8">Middle School Grades 7-8</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Time / Duration <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="e.g. 09:00 AM - 01:00 PM"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Main Auditorium / Sports Ground"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Event Description & Notes</label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Details regarding attendance, schedule, or preparations..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  {editingEvent ? 'Save Event' : 'Add to Calendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
