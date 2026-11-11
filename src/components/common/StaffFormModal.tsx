import React, { useState, useEffect } from 'react';
import { Staff } from '../../types';
import { useApp } from '../../context/AppContext';
import { canEditStaffField } from '../../data/permissions';
import { X, Save, AlertCircle, ShieldAlert } from 'lucide-react';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: Staff | null; // If null, mode is Add
}

export const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isOpen,
  onClose,
  staffToEdit
}) => {
  const { staff, currentRole, addStaff, updateStaff } = useApp();
  const isEditMode = !!staffToEdit;

  const [formData, setFormData] = useState<Partial<Staff>>({
    staffId: `STF-2026-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    department: 'Front Desk & Admissions',
    role: 'Front Office Associate',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    status: 'Active',
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    address: 'Greenfield Campus District',
    emergencyContact: '',
    shift: 'Standard Day (08:00 - 16:30)',
    responsibilities: 'Campus operations, administrative visitor logging, and department support'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<'Active' | 'On Leave' | 'Inactive' | null>(null);

  const departments = [
    'Front Desk & Admissions',
    'Accounts & Bursar Treasury',
    'Library Media Center',
    'IT & Technical Systems',
    'Campus Security & Safety',
    'Facilities & Campus Maintenance',
    'Health Center & Infirmary'
  ];

  useEffect(() => {
    if (staffToEdit) {
      setFormData({ ...staffToEdit });
      setIsDirty(false);
    } else {
      setFormData({
        staffId: `STF-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        department: 'Front Desk & Admissions',
        role: 'Front Office Associate',
        phone: '',
        email: '',
        joinDate: new Date().toISOString().split('T')[0],
        employmentType: 'Full-time',
        status: 'Active',
        reportingManager: 'Dr. Arthur Campbell (Principal)',
        address: 'Greenfield Campus District',
        emergencyContact: '',
        shift: 'Standard Day (08:00 - 16:30)',
        responsibilities: 'Campus operations, administrative visitor logging, and department support'
      });
      setIsDirty(false);
    }
    setErrors({});
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Staff, value: any) => {
    if (isEditMode && !canEditStaffField(currentRole, field)) {
      return;
    }

    if (field === 'status' && (value === 'Inactive' || value === 'On Leave') && formData.status === 'Active') {
      setPendingStatusChange(value);
      setShowStatusConfirm(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name?.trim()) errs.name = 'Full staff name is required';
    if (!formData.role?.trim()) errs.role = 'Role designation is required';
    if (!formData.email?.trim()) errs.email = 'Staff work email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address';

    if (!formData.phone?.trim()) errs.phone = 'Contact telephone is required';

    // Duplicate email or staffId check
    const duplicateEmail = staff.some(
      (s) =>
        (!staffToEdit || s.id !== staffToEdit.id) &&
        s.email.trim().toLowerCase() === formData.email?.trim().toLowerCase()
    );
    if (duplicateEmail) {
      errs.email = 'This email address is already assigned to another staff member';
    }

    if (formData.staffId) {
      const duplicateStaffId = staff.some(
        (s) =>
          (!staffToEdit || s.id !== staffToEdit.id) &&
          s.staffId?.trim().toLowerCase() === formData.staffId?.trim().toLowerCase()
      );
      if (duplicateStaffId) {
        errs.staffId = 'This Staff ID is already assigned to another employee';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    let success = false;

    if (isEditMode && staffToEdit) {
      success = updateStaff(staffToEdit.id, formData);
    } else {
      success = addStaff(formData as any);
    }

    setIsSubmitting(false);
    if (success) {
      setIsDirty(false);
      onClose();
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes in the staff profile. Discard?')) {
        setIsDirty(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const isFieldDisabled = (fieldName: string) => {
    if (!isEditMode) return false;
    return !canEditStaffField(currentRole, fieldName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[94vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isEditMode ? 'Staff Record Modification' : 'Enrol General Staff Member'}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                SCHLAR Operations
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold mt-0.5">
              {isEditMode ? `Edit Staff: ${staffToEdit?.name}` : 'Enrol Staff to Greenfield Operations'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCloseAttempt}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Notice */}
        {currentRole !== 'principal' && (
          <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Principal Governance: Modifying staff employment contracts requires administrator authorization.
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Staff ID *
              </label>
              <input
                type="text"
                disabled={isFieldDisabled('staffId')}
                value={formData.staffId || ''}
                onChange={(e) => handleChange('staffId', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono font-bold disabled:bg-slate-100"
              />
              {errors.staffId && <p className="text-[11px] text-rose-600 mt-1">{errors.staffId}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Employee Name *
              </label>
              <input
                type="text"
                disabled={isFieldDisabled('name')}
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Kavita Chawla"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                  errors.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department *
              </label>
              <select
                disabled={isFieldDisabled('department')}
                value={formData.department || 'Front Desk & Admissions'}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100 font-semibold"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Designation / Role Title *
              </label>
              <input
                type="text"
                disabled={isFieldDisabled('role')}
                value={formData.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="e.g. Head Receptionist / Lab Technician"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                  errors.role ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                } focus:outline-none focus:border-theme-primary disabled:bg-slate-100 font-medium`}
              />
              {errors.role && <p className="text-[11px] text-rose-600 mt-1">{errors.role}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                disabled={isFieldDisabled('email')}
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="kavita.frontdesk@greenfield.edu"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                  errors.email ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telephone Contact *
              </label>
              <input
                type="tel"
                disabled={isFieldDisabled('phone')}
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 500-1101"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                  errors.phone ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
              />
              {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employment Type
              </label>
              <select
                disabled={isFieldDisabled('employmentType')}
                value={formData.employmentType || 'Full-time'}
                onChange={(e) => handleChange('employmentType', e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100"
              >
                <option value="Full-time">Full-time Regular</option>
                <option value="Contract">Term Contract</option>
                <option value="Part-time">Part-time Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                disabled={isFieldDisabled('joinDate')}
                value={formData.joinDate || ''}
                onChange={(e) => handleChange('joinDate', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Operational Shift
              </label>
              <input
                type="text"
                disabled={isFieldDisabled('shift')}
                value={formData.shift || ''}
                onChange={(e) => handleChange('shift', e.target.value)}
                placeholder="e.g. Morning Shift (07:30 - 16:00)"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employment Status
              </label>
              <select
                disabled={isFieldDisabled('status')}
                value={formData.status || 'Active'}
                onChange={(e) => handleChange('status', e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white font-bold disabled:bg-slate-100"
              >
                <option value="Active">Active Duty</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Separated / Inactive</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Operational Responsibilities & Scope
              </label>
              <textarea
                rows={2}
                disabled={isFieldDisabled('responsibilities')}
                value={formData.responsibilities || ''}
                onChange={(e) => handleChange('responsibilities', e.target.value)}
                placeholder="Summarize primary departmental duties and campus coverage..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {isDirty && <span className="text-amber-600 font-semibold">● Unsaved modifications present</span>}
            </div>
            <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCloseAttempt}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-5 py-2.5 sm:py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-90 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 text-center"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Staff Record' : 'Enrol Staff Member'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation modal for status change */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white p-5 rounded-2xl max-w-sm w-full space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Staff Status Change</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Changing this staff member to <strong>{pendingStatusChange}</strong> will flag their shift duties and update departmental availability. Continue?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowStatusConfirm(false);
                  setPendingStatusChange(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, status: pendingStatusChange || 'Inactive' }));
                  setIsDirty(true);
                  setShowStatusConfirm(false);
                  setPendingStatusChange(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
