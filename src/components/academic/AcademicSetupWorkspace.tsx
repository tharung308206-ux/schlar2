import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AcademicYear, TermInfo } from '../../types';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Archive,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Layers,
  CalendarDays
} from 'lucide-react';

export const AcademicSetupWorkspace: React.FC = () => {
  const {
    academicYears,
    activeAcademicYearId,
    setActiveAcademicYearId,
    addAcademicYear,
    updateAcademicYear,
    archiveAcademicYear,
    classes,
    addToast
  } = useApp();

  // Modal states
  const [showYearModal, setShowYearModal] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Upcoming' | 'Archived'>('Upcoming');
  const [formWorkingDays, setFormWorkingDays] = useState<string[]>([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ]);
  const [formHolidaysCount, setFormHolidaysCount] = useState(24);
  const [formTerms, setFormTerms] = useState<TermInfo[]>([
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
  ]);

  // Validation error state
  const [formError, setFormError] = useState<string | null>(null);

  const activeYear = academicYears.find((y) => y.id === activeAcademicYearId) || academicYears[0];

  const handleOpenAdd = () => {
    setEditingYear(null);
    setFormName('Academic Year 2027–2028');
    setFormStartDate('2027-08-15');
    setFormEndDate('2028-05-30');
    setFormStatus('Upcoming');
    setFormWorkingDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setFormHolidaysCount(24);
    setFormTerms([
      {
        id: 'term-1-new',
        name: 'Term 1',
        startDate: '2027-08-15',
        endDate: '2027-12-20',
        examStartDate: '2027-11-20',
        examEndDate: '2027-12-05'
      },
      {
        id: 'term-2-new',
        name: 'Term 2',
        startDate: '2028-01-10',
        endDate: '2028-05-30',
        examStartDate: '2028-05-01',
        examEndDate: '2028-05-18'
      }
    ]);
    setFormError(null);
    setShowYearModal(true);
  };

  const handleOpenEdit = (year: AcademicYear) => {
    setEditingYear(year);
    setFormName(year.name);
    setFormStartDate(year.startDate);
    setFormEndDate(year.endDate);
    setFormStatus(year.status);
    setFormWorkingDays(year.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    setFormHolidaysCount(year.holidaysCount || 24);
    setFormTerms(year.terms || []);
    setFormError(null);
    setShowYearModal(true);
  };

  const handleToggleWorkingDay = (day: string) => {
    if (formWorkingDays.includes(day)) {
      if (formWorkingDays.length <= 1) {
        setFormError('At least one working day must be configured.');
        return;
      }
      setFormWorkingDays(formWorkingDays.filter((d) => d !== day));
    } else {
      setFormWorkingDays([...formWorkingDays, day]);
    }
  };

  const handleUpdateTerm = (index: number, field: keyof TermInfo, val: string) => {
    const updated = [...formTerms];
    updated[index] = { ...updated[index], [field]: val };
    setFormTerms(updated);
  };

  const handleAddTerm = () => {
    const newTerm: TermInfo = {
      id: `term-${formTerms.length + 1}-${Date.now().toString().slice(-4)}`,
      name: `Term ${formTerms.length + 1}`,
      startDate: formStartDate,
      endDate: formEndDate,
      examStartDate: formStartDate,
      examEndDate: formEndDate
    };
    setFormTerms([...formTerms, newTerm]);
  };

  const handleRemoveTerm = (index: number) => {
    if (formTerms.length <= 1) {
      setFormError('At least one academic term must be defined.');
      return;
    }
    setFormTerms(formTerms.filter((_, i) => i !== index));
  };

  const handleSaveYear = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation 1: End date must be strictly after start date
    if (new Date(formEndDate) <= new Date(formStartDate)) {
      setFormError('Academic Year end date must be strictly after the start date.');
      return;
    }

    // Validation 2: Term dates must be within academic year and valid
    for (const term of formTerms) {
      if (new Date(term.endDate) <= new Date(term.startDate)) {
        setFormError(`Term "${term.name}" end date must be after its start date.`);
        return;
      }
      if (new Date(term.startDate) < new Date(formStartDate) || new Date(term.endDate) > new Date(formEndDate)) {
        setFormError(`Term "${term.name}" dates must fall within the Academic Year bounds (${formStartDate} to ${formEndDate}).`);
        return;
      }
      if (term.examStartDate && term.examEndDate) {
        if (new Date(term.examEndDate) < new Date(term.examStartDate)) {
          setFormError(`Exam period for "${term.name}" has invalid dates (end before start).`);
          return;
        }
        if (new Date(term.examStartDate) < new Date(term.startDate) || new Date(term.examEndDate) > new Date(term.endDate)) {
          setFormError(`Exam dates for "${term.name}" must fall inside the term date interval.`);
          return;
        }
      }
    }

    const yearData: Omit<AcademicYear, 'id'> = {
      name: formName.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      status: formStatus,
      workingDays: formWorkingDays,
      holidaysCount: Number(formHolidaysCount),
      terms: formTerms
    };

    if (editingYear) {
      const res = updateAcademicYear(editingYear.id, yearData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Academic Year Updated',
          message: `${yearData.name} details have been saved.`
        });
        setShowYearModal(false);
      } else {
        setFormError(res.error || 'Failed to update academic year.');
      }
    } else {
      const res = addAcademicYear(yearData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Academic Year Created',
          message: `${yearData.name} has been added to the institutional setup.`
        });
        setShowYearModal(false);
      } else {
        setFormError(res.error || 'Failed to create academic year.');
      }
    }
  };

  const handleSetActive = (year: AcademicYear) => {
    if (year.id === activeAcademicYearId) return;
    setActiveAcademicYearId(year.id);
    addToast({
      type: 'info',
      title: 'Active Year Changed',
      message: `Switched operational context to ${year.name}. All historical records remain intact.`
    });
  };

  const handleArchive = (year: AcademicYear) => {
    if (year.id === activeAcademicYearId) {
      addToast({
        type: 'error',
        title: 'Action Blocked',
        message: 'Cannot archive the currently active academic year. Switch active year first.'
      });
      return;
    }
    const ok = archiveAcademicYear(year.id);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Academic Year Archived',
        message: `${year.name} has been moved to archive status.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Year & Term Setup</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional operational periods, semester structures, examination windows, and working calendar rules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic Year</span>
        </button>
      </div>

      {/* Active Academic Year Hero Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-emerald-900/60 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded">
                Current Operational Year
              </span>
              <span className="text-xs font-mono text-emerald-300">ID: {activeYear.id}</span>
            </div>
            <h2 className="text-2xl font-extrabold mt-2">{activeYear.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {activeYear.startDate} — {activeYear.endDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeYear.workingDays?.join(', ')}
              </span>
              <span>•</span>
              <span>{activeYear.holidaysCount} Official Holidays</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenEdit(activeYear)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors"
            >
              Configure Year & Terms
            </button>
          </div>
        </div>

        {/* Term Cards Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-emerald-800/50">
          {activeYear.terms.map((term, idx) => (
            <div key={term.id} className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">{term.name}</span>
                <span className="text-[10px] uppercase font-mono bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded">
                  Term {idx + 1}
                </span>
              </div>
              <div className="text-xs text-emerald-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-emerald-300">Teaching Duration:</span>
                  <span className="font-mono">{term.startDate} to {term.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-300">Examinations:</span>
                  <span className="font-mono text-amber-200">{term.examStartDate} to {term.examEndDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Years Directory List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">All Academic Cycles</h3>
          <span className="text-xs text-slate-500">{academicYears.length} Cycles Registered</span>
        </div>

        <div className="divide-y divide-slate-100">
          {academicYears.map((year) => {
            const isActive = year.id === activeAcademicYearId;

            return (
              <div
                key={year.id}
                className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isActive ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{year.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        year.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : year.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {year.status}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected Active
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500">
                    Dates: <span className="font-mono text-slate-700">{year.startDate}</span> to{' '}
                    <span className="font-mono text-slate-700">{year.endDate}</span> ·{' '}
                    <span>{year.terms.length} Terms defined</span> ·{' '}
                    <span>{year.workingDays.length} working days/week</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {!isActive && year.status !== 'Archived' && (
                    <button
                      onClick={() => handleSetActive(year)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Set Active
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(year)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Academic Year"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {!isActive && year.status !== 'Archived' && (
                    <button
                      onClick={() => handleArchive(year)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Archive Academic Year"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT ACADEMIC YEAR ================= */}
      {showYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="text-base font-bold">
                    {editingYear ? 'Configure Academic Year' : 'Create New Academic Year'}
                  </h3>
                  <p className="text-xs text-emerald-300">Set term intervals, exam windows, and working calendar rules.</p>
                </div>
              </div>
              <button onClick={() => setShowYearModal(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveYear} className="p-6 space-y-4 overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Academic Year Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Academic Year 2026–2027"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lifecycle Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  >
                    <option value="Active">Active (Current Operations)</option>
                    <option value="Upcoming">Upcoming (Planning Phase)</option>
                    <option value="Archived">Archived (Historical Record)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Configured Holidays</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formHolidaysCount}
                    onChange={(e) => setFormHolidaysCount(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              {/* Working Days Selector */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Institutional Working Days (Weekly Rotations)
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                    const isSelected = formWorkingDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleWorkingDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-emerald-900 text-white border-emerald-900'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms Builder */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Terms & Examination Windows</h4>
                  <button
                    type="button"
                    onClick={handleAddTerm}
                    className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Term
                  </button>
                </div>

                <div className="space-y-3">
                  {formTerms.map((term, i) => (
                    <div key={term.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          required
                          value={term.name}
                          onChange={(e) => handleUpdateTerm(i, 'name', e.target.value)}
                          placeholder="Term Name"
                          className="font-bold text-xs bg-white border border-slate-200 rounded px-2 py-1 w-2/3"
                        />
                        {formTerms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTerm(i)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
                          >
                            Remove Term
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div>
                          <label className="text-slate-500 block">Term Start</label>
                          <input
                            type="date"
                            required
                            value={term.startDate}
                            onChange={(e) => handleUpdateTerm(i, 'startDate', e.target.value)}
                            className="w-full p-1 bg-white border border-slate-200 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block">Term End</label>
                          <input
                            type="date"
                            required
                            value={term.endDate}
                            onChange={(e) => handleUpdateTerm(i, 'endDate', e.target.value)}
                            className="w-full p-1 bg-white border border-slate-200 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block">Exams Start</label>
                          <input
                            type="date"
                            value={term.examStartDate}
                            onChange={(e) => handleUpdateTerm(i, 'examStartDate', e.target.value)}
                            className="w-full p-1 bg-white border border-slate-200 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-500 block">Exams End</label>
                          <input
                            type="date"
                            value={term.examEndDate}
                            onChange={(e) => handleUpdateTerm(i, 'examEndDate', e.target.value)}
                            className="w-full p-1 bg-white border border-slate-200 rounded font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowYearModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  {editingYear ? 'Update Academic Year' : 'Create Academic Year'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
