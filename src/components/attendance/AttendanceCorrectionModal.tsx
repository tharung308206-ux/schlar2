import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentAttendanceStatus, AttendanceRecord, Student } from '../../types';
import { X, AlertCircle, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AttendanceCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord;
  preselectedStudentId?: string;
}

export const AttendanceCorrectionModal: React.FC<AttendanceCorrectionModalProps> = ({
  isOpen,
  onClose,
  record,
  preselectedStudentId
}) => {
  const { currentRole, userProfiles, requestAttendanceCorrection, classes, addToast } = useApp();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preselectedStudentId || record.records[0]?.studentId || ''
  );
  const [requestedStatus, setRequestedStatus] = useState<StudentAttendanceStatus>('Present');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedEntry = record.records.find((r) => r.studentId === selectedStudentId);
  const targetClass = classes.find((c) => c.id === record.classId);
  const className = targetClass?.name || record.classId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A substantive administrative or medical reason is strictly required for attendance corrections.');
      return;
    }

    if (selectedEntry && selectedEntry.status === requestedStatus) {
      setError('Requested status must be different from the currently recorded status.');
      return;
    }

    const res = requestAttendanceCorrection({
      attendanceRecordId: record.id,
      studentId: selectedStudentId,
      studentName: selectedEntry?.studentName || 'Student',
      classId: record.classId,
      className,
      date: record.date,
      period: record.period,
      originalStatus: selectedEntry?.status || 'Present',
      requestedStatus,
      reason: reason.trim(),
      requestedByRole: currentRole,
      requestedByName: userProfiles[currentRole]?.name || userProfiles[currentRole]?.fullName || currentRole
    });

    if (res.success) {
      addToast({
        type: 'success',
        title: 'Correction Request Submitted',
        message: `Correction requested for ${selectedEntry?.studentName}. Sent to Vice Principal / Principal for approval.`
      });
      onClose();
    } else {
      setError(res.error || 'Failed to submit correction request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Request Attendance Correction</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {className} · {record.period} · {record.date}
              </p>
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

          {/* Student Selector */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Enrolled Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setError(null);
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {record.records.map((r) => (
                <option key={r.studentId} value={r.studentId}>
                  {r.studentName} (Currently: {r.status})
                </option>
              ))}
            </select>
          </div>

          {/* Current vs Requested Status */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                Currently Recorded
              </span>
              <span className="text-sm font-bold text-slate-800 mt-1 block">
                {selectedEntry?.status || 'Unknown'}
              </span>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-1">
                Requested Status
              </label>
              <select
                value={requestedStatus}
                onChange={(e) => {
                  setRequestedStatus(e.target.value as StudentAttendanceStatus);
                  setError(null);
                }}
                className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-emerald-800 text-xs"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late (Tardy)</option>
                <option value="Excused">Excused Absence</option>
                <option value="Half Day">Half Day</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Substantive Reason / Supporting Context <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Student arrived at 08:42 AM with official delayed school bus slip; teacher mistakenly marked absent during morning roll call."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              All correction submissions are logged to the school administrative audit trail.
            </p>
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
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
