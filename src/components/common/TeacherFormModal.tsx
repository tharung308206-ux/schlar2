import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types';
import { useApp } from '../../context/AppContext';
import { canEditTeacherField } from '../../data/permissions';
import { X, Save, AlertCircle, ShieldAlert } from 'lucide-react';

interface TeacherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherToEdit?: Teacher | null; // If null, mode is Add
}

export const TeacherFormModal: React.FC<TeacherFormModalProps> = ({
  isOpen,
  onClose,
  teacherToEdit
}) => {
  const { classes, teachers, currentRole, addTeacher, updateTeacher } = useApp();
  const isEditMode = !!teacherToEdit;

  const [formData, setFormData] = useState<Partial<Teacher>>({
    staffId: `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    email: '',
    phone: '',
    roleTitle: 'Subject Faculty',
    department: 'Mathematics & STEM',
    qualification: 'M.Sc., B.Ed',
    subjects: ['Mathematics'],
    classes: ['Grade 10A'],
    classTeacherOf: '',
    workloadHours: 20,
    room: 'Faculty Block B-101',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    reportingManager: 'Dr. Arthur Campbell (Principal)',
    experienceYears: 5,
    address: 'Greenfield Campus Residential Area',
    emergencyContact: ''
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'teaching'>('personal');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<'Active' | 'On Leave' | 'Inactive' | null>(null);

  // Available subjects pool in school
  const allSubjects = [
    'Mathematics',
    'Advanced Statistics',
    'Physics',
    'Chemistry',
    'General Science',
    'Computer Science',
    'Robotics & AI',
    'English Literature',
    'Social Science',
    'History & Civics',
    'Environmental Science',
    'Art & Craft'
  ];

  useEffect(() => {
    if (teacherToEdit) {
      setFormData({ ...teacherToEdit });
      setIsDirty(false);
    } else {
      setFormData({
        staffId: `FAC-2026-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        email: '',
        phone: '',
        roleTitle: 'Subject Faculty',
        department: 'Mathematics & STEM',
        qualification: 'M.Sc., B.Ed',
        subjects: ['Mathematics'],
        classes: ['Grade 10A'],
        classTeacherOf: '',
        workloadHours: 20,
        room: 'Faculty Block B-101',
        employmentType: 'Full-time',
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0],
        reportingManager: 'Dr. Arthur Campbell (Principal)',
        experienceYears: 5,
        address: 'Greenfield Campus Area',
        emergencyContact: ''
      });
      setIsDirty(false);
    }
    setErrors({});
  }, [teacherToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Teacher, value: any) => {
    if (isEditMode && !canEditTeacherField(currentRole, field)) {
      return; // Locked for role
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

  const toggleSubject = (subj: string) => {
    if (isEditMode && !canEditTeacherField(currentRole, 'subjects')) return;
    const current = formData.subjects || [];
    const next = current.includes(subj) ? current.filter((s) => s !== subj) : [...current, subj];
    handleChange('subjects', next.length > 0 ? next : [subj]);
  };

  const toggleClass = (clsName: string) => {
    if (isEditMode && !canEditTeacherField(currentRole, 'classes')) return;
    const current = formData.classes || [];
    const next = current.includes(clsName) ? current.filter((c) => c !== clsName) : [...current, clsName];
    handleChange('classes', next.length > 0 ? next : [clsName]);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name?.trim()) errs.name = 'Faculty full name is required';
    if (!formData.email?.trim()) errs.email = 'Official work email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address';

    if (!formData.phone?.trim()) errs.phone = 'Contact telephone is required';

    // Duplicate email or staffId check
    const duplicateEmail = teachers.some(
      (t) =>
        (!teacherToEdit || t.id !== teacherToEdit.id) &&
        t.email.trim().toLowerCase() === formData.email?.trim().toLowerCase()
    );
    if (duplicateEmail) {
      errs.email = 'This email address is already assigned to another faculty member';
    }

    if (formData.staffId) {
      const duplicateStaffId = teachers.some(
        (t) =>
          (!teacherToEdit || t.id !== teacherToEdit.id) &&
          t.staffId?.trim().toLowerCase() === formData.staffId?.trim().toLowerCase()
      );
      if (duplicateStaffId) {
        errs.staffId = 'This Employee ID is already assigned to another teacher';
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

    if (isEditMode && teacherToEdit) {
      success = updateTeacher(teacherToEdit.id, formData);
    } else {
      success = addTeacher(formData as any);
    }

    setIsSubmitting(false);
    if (success) {
      setIsDirty(false);
      onClose();
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes in the teacher profile. Discard?')) {
        setIsDirty(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const isFieldDisabled = (fieldName: string) => {
    if (!isEditMode) return false;
    return !canEditTeacherField(currentRole, fieldName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                {isEditMode ? 'Faculty Profile & Allocation' : 'Appoint New Teacher'}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                SCHLAR Faculty Roster
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold mt-0.5">
              {isEditMode ? `Edit Faculty: ${teacherToEdit?.name}` : 'Appoint Faculty to Greenfield International'}
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
        {currentRole === 'vice_principal' && (
          <div className="px-4 sm:px-6 py-2 bg-blue-50 border-b border-blue-200 text-blue-900 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              Academic Coordinator: Authorized to modify assigned subjects, classes, room, and weekly workload hours. Employment and personal details are managed by Principal Governance.
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. Personal & Contact</span>
            {errors.name || errors.email || errors.phone ? <span className="w-2 h-2 rounded-full bg-rose-500" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('employment')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'employment'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. Employment & Role</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('teaching')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'teaching'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>3. Teaching Allocations</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: PERSONAL & CONTACT */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Staff / Employee ID *
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
                    Teacher Full Name *
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('name')}
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Dr. Vikram Sharma"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                      errors.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email Address *
                  </label>
                  <input
                    type="email"
                    disabled={isFieldDisabled('email')}
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="vikram.sharma@greenfield.edu"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                      errors.email ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    disabled={isFieldDisabled('phone')}
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 201-4411"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                      errors.phone ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('emergencyContact')}
                    value={formData.emergencyContact || ''}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="Spouse / Family Contact Number"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Highest Educational Qualification *
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('qualification')}
                    value={formData.qualification || ''}
                    onChange={(e) => handleChange('qualification', e.target.value)}
                    placeholder="e.g. Ph.D. Applied Mathematics, M.Sc., B.Ed"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('address')}
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Faculty Quarters / Street address"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EMPLOYMENT INFORMATION */}
          {activeTab === 'employment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation / Role Title *
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('roleTitle')}
                    value={formData.roleTitle || ''}
                    onChange={(e) => handleChange('roleTitle', e.target.value)}
                    placeholder="e.g. Head of STEM / Senior Physics Faculty"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-semibold disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Department *
                  </label>
                  <select
                    disabled={isFieldDisabled('department')}
                    value={formData.department || 'Mathematics & STEM'}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100 font-medium"
                  >
                    <option value="Mathematics & STEM">Mathematics & STEM</option>
                    <option value="Physical Sciences">Physical Sciences</option>
                    <option value="Biological Sciences">Biological Sciences</option>
                    <option value="Computer Science & ICT">Computer Science & ICT</option>
                    <option value="Languages & Literature">Languages & Literature</option>
                    <option value="Social Studies & Humanities">Social Studies & Humanities</option>
                    <option value="Primary Education Wing">Primary Education Wing</option>
                  </select>
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
                    <option value="Full-time">Full-time Tenured</option>
                    <option value="Contract">Contract / Visiting</option>
                    <option value="Part-time">Part-time Adjunct</option>
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
                    Teaching Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={isFieldDisabled('experienceYears')}
                    value={formData.experienceYears || 5}
                    onChange={(e) => handleChange('experienceYears', Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
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
                    <option value="Active">Active (On Campus)</option>
                    <option value="On Leave">On Sabbatical / Leave</option>
                    <option value="Inactive">Inactive / Separated</option>
                  </select>
                </div>
              </div>

              {/* Account Linkage Info */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800 block">Security & Access Provisioning:</span>
                This teacher profile links automatically to the <strong>Teacher Role</strong> and <strong>Teacher Mobile App</strong>. Teacher profiles do not have administrative or finance privileges.
              </div>
            </div>
          )}

          {/* TAB 3: TEACHING ALLOCATIONS */}
          {activeTab === 'teaching' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class Teacher Responsibility
                  </label>
                  <select
                    disabled={isFieldDisabled('classTeacherOf')}
                    value={formData.classTeacherOf || ''}
                    onChange={(e) => handleChange('classTeacherOf', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100 font-semibold"
                  >
                    <option value="">None (Subject Teacher Only)</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        Class Teacher of {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">Assigning class teacher responsibility syncs directly with the class roster and roll call console.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Weekly Teaching Workload (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="45"
                    disabled={isFieldDisabled('workloadHours')}
                    value={formData.workloadHours || 20}
                    onChange={(e) => handleChange('workloadHours', Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Standard full-time quota: 20-24 contact hours/week.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Faculty Desk / Staff Room Location
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('room')}
                    value={formData.room || ''}
                    onChange={(e) => handleChange('room', e.target.value)}
                    placeholder="e.g. Faculty Block B-102 or Science Lab Annex"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Subject Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assigned Teaching Subjects * (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allSubjects.map((subj) => {
                    const isSelected = (formData.subjects || []).includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        disabled={isFieldDisabled('subjects')}
                        onClick={() => toggleSubject(subj)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-theme-primary text-white font-bold shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        } disabled:opacity-60`}
                      >
                        {subj} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class Divisions Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Assigned Teaching Classes * (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {classes.map((cls) => {
                    const isSelected = (formData.classes || []).includes(cls.name);
                    return (
                      <button
                        key={cls.id}
                        type="button"
                        disabled={isFieldDisabled('classes')}
                        onClick={() => toggleClass(cls.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white font-bold shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        } disabled:opacity-60`}
                      >
                        {cls.name} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

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
                <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Faculty Profile' : 'Appoint Faculty'}</span>
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
              <span>Confirm Faculty Status Change</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Changing this teacher's status to <strong>{pendingStatusChange}</strong> will flag their scheduled classes and prevent them from marking daily morning roll calls. Are you sure?
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
