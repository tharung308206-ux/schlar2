import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaveType, Teacher, Staff } from '../../types';
import { X, Calendar, AlertCircle, FileText, Upload, Send, CheckCircle2 } from 'lucide-react';

interface StaffLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStaffId?: string;
}

export const StaffLeaveModal: React.FC<StaffLeaveModalProps> = ({
  isOpen,
  onClose,
  defaultStaffId
}) => {
  const { currentRole, userProfiles, teachers, staff, applyStaffLeave, addToast } = useApp();

  const allStaffMembers: (Teacher | Staff)[] = [...teachers, ...staff];

  // If role is teacher, default to current teacher (t-1 or matching profile)
  const initialStaffId = defaultStaffId || (currentRole === 'teacher' ? 't-1' : allStaffMembers[0]?.id || 't-1');
  const [selectedStaffId, setSelectedStaffId] = useState(initialStaffId);
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMember = allStaffMembers.find((m) => m.id === selectedStaffId) || allStaffMembers[0];
  const department = (currentMember as any)?.department || (currentMember as any)?.designation || 'Faculty';

  // Calculate total days
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const diffTime = endD.getTime() - startD.getTime();
  const calculatedDays = diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim()) {
      setError('Please provide a substantive reason for the leave application.');
      return;
    }

    if (calculatedDays <= 0) {
      setError('End date must be on or after the start date.');
      return;
    }

    const res = applyStaffLeave({
      staffId: currentMember.id,
      staffName: currentMember.name,
      staffRole: (currentMember as any)?.designation || (currentMember as any)?.subject || 'Staff Member',
      department,
      leaveType,
      startDate,
      endDate,
      totalDays: calculatedDays,
      reason: reason.trim(),
      attachmentName: attachmentName ? attachmentName : undefined,
      attachmentSize: attachmentName ? '450 KB (Mock File)' : undefined
    });

    if (res.success) {
      addToast({
        type: 'success',
        title: 'Leave Application Submitted',
        message: `${leaveType} request for ${currentMember.name} (${calculatedDays} day(s)) sent for administration review.`
      });
      onClose();
    } else {
      setError(res.error || 'Failed to submit leave application.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Staff Leave Application</h2>
              <p className="text-xs text-slate-400 mt-0.5">Greenfield Faculty & Administrative Operations</p>
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

          {/* Staff Member (Disabled or selectable based on role) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Staff Member</label>
            {currentRole === 'teacher' ? (
              <div className="p-2.5 bg-slate-100 rounded-xl font-bold text-slate-800 border border-slate-200">
                {currentMember?.name} · {department}
              </div>
            ) : (
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                {allStaffMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({(m as any).designation || (m as any).department || 'Staff'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">Leave Category</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Casual Leave">Casual Leave (Personal / Urgent Affairs)</option>
              <option value="Sick / Medical Leave">Sick / Medical Leave (Physician Advice)</option>
              <option value="Academic / Duty Leave">Academic / Duty Leave (Conferences / Symposiums)</option>
              <option value="Earned Leave">Earned Leave (Privileged Annual Quota)</option>
              <option value="Emergency Leave">Emergency Leave (Immediate Compassionate Care)</option>
              <option value="Maternity / Paternity Leave">Maternity / Paternity Leave</option>
            </select>
          </div>

          {/* Date Range & Total Days */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Total Days Indicator */}
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
            <span className="text-slate-600 font-semibold">Total Duration Requested:</span>
            <span className="font-mono font-extrabold text-emerald-900 text-sm">
              {calculatedDays > 0 ? `${calculatedDays} Calendar Day(s)` : 'Invalid Date Range'}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Reason / Medical Context <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the reason, substitute faculty arrangement notes, or travel details..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Optional Attachment Metadata */}
          <div>
            <label className="block text-slate-700 font-bold mb-1.5">
              Supporting Proof / Doctor Slip (Mock Attachment)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                placeholder="e.g. medical_prescription_hospital.pdf or duty_order.pdf"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={() => setAttachmentName('doctor_certified_fit_slip.pdf')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-semibold shrink-0"
              >
                Sample Slip
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Simulated document metadata stored in browser session.
            </p>
          </div>

          {/* Footer */}
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
              disabled={calculatedDays <= 0}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Apply for Leave</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
