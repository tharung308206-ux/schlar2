import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MovementType, Student, ClassInfo } from '../../types';
import { X, Clock, AlertCircle, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

interface StudentMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: MovementType;
}

export const StudentMovementModal: React.FC<StudentMovementModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'Late Arrival'
}) => {
  const { students, classes, currentRole, userProfiles, recordStudentMovement, addToast } = useApp();

  const [type, setType] = useState<MovementType>(defaultType);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [time, setTime] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState<string>('');
  const [authorizedByPerson, setAuthorizedByPerson] = useState<string>('');
  const [updateAttendance, setUpdateAttendance] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentClass = classes.find((c) => c.id === currentStudent?.classId);
  const className = studentClass?.name || currentStudent?.classId || 'Class';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A reason for gate entry or authorized departure is strictly required.');
      return;
    }

    if (type === 'Early Departure' && !authorizedByPerson.trim()) {
      setError('Authorized guardian / pickup contact identity is required for early departure safeguarding.');
      return;
    }

    const res = recordStudentMovement(
      {
        type,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        classId: currentStudent.classId,
        className,
        date,
        time,
        reason: reason.trim(),
        authorizedByPerson: authorizedByPerson.trim() || undefined,
        recordedByStaffName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || 'Front Office Staff',
        recordedByRole: currentRole,
        statusUpdatedInAttendance: updateAttendance
      },
      updateAttendance
    );

    if (res.success) {
      addToast({
        type: 'success',
        title: `${type} Recorded`,
        message: `${type} logged for ${currentStudent.name} at ${time}. ${updateAttendance ? 'Attendance register synchronized.' : ''}`
      });
      onClose();
    } else {
      setError(res.error || 'Failed to record student movement.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Record Daily Student Movement</h2>
              <p className="text-xs text-slate-400 mt-0.5">Campus Gate & Reception Daily Operations Register</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Movement Type Toggle */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Movement Event Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setType('Late Arrival');
                  setError(null);
                }}
                className={`py-2 px-3 rounded-lg font-bold transition-all ${
                  type === 'Late Arrival'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Late Arrival (Tardy Gate In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('Early Departure');
                  setError(null);
                }}
                className={`py-2 px-3 rounded-lg font-bold transition-all ${
                  type === 'Early Departure'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Authorized Early Departure
              </button>
            </div>
          </div>

          {/* Student Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Enrolled Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({classes.find((c) => c.id === s.classId)?.name || s.classId} · Roll #{s.rollNo})
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Gate Timestamp</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 08:45 AM"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Reason for {type} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                type === 'Late Arrival'
                  ? 'e.g. Bus breakdown, road construction traffic delay, morning medical appointment...'
                  : 'e.g. Scheduled dental surgery, family emergency, unwell at sick bay...'
              }
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Authorized By Person (Required for Early Departure) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              {type === 'Early Departure' ? (
                <span>Authorized Pickup / Guardian Contact Reference <span className="text-rose-500">*</span></span>
              ) : (
                <span>Accompanying Person / Bus Driver Slip (Optional)</span>
              )}
            </label>
            <input
              type="text"
              value={authorizedByPerson}
              onChange={(e) => setAuthorizedByPerson(e.target.value)}
              placeholder={
                type === 'Early Departure'
                  ? `e.g. Mother: ${currentStudent?.parentName || 'Parent'} (Govt Photo ID verified)`
                  : 'e.g. Bus #4 Driver Mohan Lal or Parent'
              }
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Attendance Synchronization Checkbox */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Synchronize with Attendance Register</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {type === 'Late Arrival'
                  ? 'Update student status to Late in today’s class register.'
                  : 'Tag early checkout note in daily register without overwriting morning presence.'}
              </p>
            </div>
            <input
              type="checkbox"
              checked={updateAttendance}
              onChange={(e) => setUpdateAttendance(e.target.checked)}
              className="w-4 h-4 text-emerald-800 rounded focus:ring-emerald-600"
            />
          </div>

          {/* Disclaimer */}
          <div className="p-2.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Safeguarding gate log simulation for Greenfield International School.</span>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Record {type}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
