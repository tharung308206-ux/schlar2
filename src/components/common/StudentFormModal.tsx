import React, { useState, useEffect } from 'react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';
import { canEditStudentField } from '../../data/permissions';
import { X, AlertCircle, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToEdit?: Student | null; // If null, mode is Add
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  studentToEdit
}) => {
  const { classes, students, currentRole, addStudent, updateStudent } = useApp();
  const isEditMode = !!studentToEdit;

  // Form state
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '',
    admissionId: `GIS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    admissionDate: new Date().toISOString().split('T')[0],
    academicYear: 'AY 2026–2027',
    classId: 'class-10a',
    section: 'A',
    rollNo: 1,
    dob: '2012-05-15',
    gender: 'Male',
    parentName: '',
    guardianRelation: 'Father',
    parentPhone: '',
    parentEmail: '',
    secondaryGuardianName: '',
    secondaryGuardianPhone: '',
    secondaryGuardianRelation: 'Mother',
    address: '',
    bloodGroup: 'O+',
    emergencyContact: '',
    medicalAlerts: '',
    authorizedPickup: '',
    academicStatus: 'On Track',
    status: 'Active'
  });

  const [activeTab, setActiveTab] = useState<'personal' | 'admission' | 'guardian' | 'medical'>('personal');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<'Active' | 'Inactive' | null>(null);

  // Populate data on open / studentToEdit change
  useEffect(() => {
    if (studentToEdit) {
      setFormData({ ...studentToEdit });
      setIsDirty(false);
    } else {
      setFormData({
        name: '',
        admissionId: `GIS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        admissionDate: new Date().toISOString().split('T')[0],
        academicYear: 'AY 2026–2027',
        classId: classes[0]?.id || 'class-10a',
        section: 'A',
        rollNo: students.length + 1,
        dob: '2012-05-15',
        gender: 'Male',
        parentName: '',
        guardianRelation: 'Father',
        parentPhone: '',
        parentEmail: '',
        secondaryGuardianName: '',
        secondaryGuardianPhone: '',
        secondaryGuardianRelation: 'Mother',
        address: '',
        bloodGroup: 'O+',
        emergencyContact: '',
        medicalAlerts: '',
        authorizedPickup: '',
        academicStatus: 'On Track',
        status: 'Active'
      });
      setIsDirty(false);
    }
    setErrors({});
  }, [studentToEdit, isOpen, classes]);

  if (!isOpen) return null;

  const handleChange = (field: keyof Student, value: any) => {
    // Check field permission
    if (isEditMode && !canEditStudentField(currentRole, field)) {
      return; // Protected
    }

    // If changing status to Inactive, prompt confirmation
    if (field === 'status' && value === 'Inactive' && formData.status === 'Active') {
      setPendingStatusChange('Inactive');
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

    if (!formData.name?.trim()) errs.name = 'Full name is required';
    if (!formData.admissionId?.trim()) errs.admissionId = 'Admission number is required';
    if (!formData.dob) errs.dob = 'Date of birth is required';
    if (!formData.classId) errs.classId = 'Enrolled class is required';

    // Admission ID Uniqueness
    const duplicateId = students.some(
      (s) =>
        (!studentToEdit || s.id !== studentToEdit.id) &&
        s.admissionId.trim().toLowerCase() === formData.admissionId?.trim().toLowerCase()
    );
    if (duplicateId) {
      errs.admissionId = 'This admission number is already assigned to another student';
    }

    // Guardian contact validation
    if (!formData.parentName?.trim()) errs.parentName = 'Primary guardian name is required';
    if (!formData.parentPhone?.trim()) errs.parentPhone = 'Guardian contact phone is required';

    // Email format validation if provided
    if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      errs.parentEmail = 'Enter a valid email address';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (isEditMode && studentToEdit) {
      success = updateStudent(studentToEdit.id, formData);
    } else {
      success = addStudent(formData as any);
    }

    setIsSubmitting(false);
    if (success) {
      setIsDirty(false);
      onClose();
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Discard without saving?')) {
        setIsDirty(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const isFieldDisabled = (fieldName: string) => {
    if (!isEditMode) return false;
    return !canEditStudentField(currentRole, fieldName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[94vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {isEditMode ? 'Student Record Modification' : 'New Student Enrollment'}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                SCHLAR ERP
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold mt-0.5">
              {isEditMode ? `Edit Profile: ${studentToEdit?.name}` : 'Enrol Student to Greenfield International'}
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

        {/* Role Permission Notice Banner */}
        {currentRole !== 'principal' && (
          <div className="px-4 sm:px-6 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              Role Notice: Logged in as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong>. Only authorized fields are editable for your security profile.
            </span>
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 sm:px-6 gap-1.5 sm:gap-2 text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'personal'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>1. Personal Details</span>
            {errors.name || errors.dob ? <span className="w-2 h-2 rounded-full bg-rose-500" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admission')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'admission'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>2. Admission & Class</span>
            {errors.admissionId || errors.classId ? <span className="w-2 h-2 rounded-full bg-rose-500" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guardian')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guardian'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>3. Parent & Guardian</span>
            {errors.parentName || errors.parentPhone ? <span className="w-2 h-2 rounded-full bg-rose-500" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medical')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'medical'
                ? 'border-theme-primary text-theme-primary font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>4. Health & Security</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('name')}
                    value={formData.name || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parts = val.trim().split(' ');
                      setFormData((prev) => ({
                        ...prev,
                        name: val,
                        firstName: parts[0] || '',
                        lastName: parts.slice(1).join(' ') || ''
                      }));
                      setIsDirty(true);
                      if (errors.name) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.name;
                          return next;
                        });
                      }
                    }}
                    placeholder="e.g. Aarav Sharma"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                      errors.name ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100 disabled:text-slate-500`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Name
                  </label>
                  <input
                    type="text"
                    value={formData.preferredName || ''}
                    onChange={(e) => handleChange('preferredName', e.target.value)}
                    placeholder="e.g. Aarav"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    disabled={isFieldDisabled('dob')}
                    value={formData.dob || ''}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100 disabled:text-slate-500"
                  />
                  {errors.dob && <p className="text-[11px] text-rose-600 mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    disabled={isFieldDisabled('gender')}
                    value={formData.gender || 'Male'}
                    onChange={(e) => handleChange('gender', e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    disabled={isFieldDisabled('bloodGroup')}
                    value={formData.bloodGroup || 'O+'}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    value={formData.nationality || 'Indian'}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    placeholder="e.g. Indian"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Residential Street Address
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('address')}
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="e.g. 42 Pine Crest Avenue, Campus Sector"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city || 'Greenfield'}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Greenfield"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state || 'Karnataka'}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode || '560102'}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    placeholder="560102"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSION & ACADEMIC DETAILS */}
          {activeTab === 'admission' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Number (Unique) *
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('admissionId')}
                    value={formData.admissionId || ''}
                    onChange={(e) => handleChange('admissionId', e.target.value)}
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono font-bold ${
                      errors.admissionId ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.admissionId && <p className="text-[11px] text-rose-600 mt-1">{errors.admissionId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission Date
                  </label>
                  <input
                    type="date"
                    disabled={isFieldDisabled('admissionDate')}
                    value={formData.admissionDate || ''}
                    onChange={(e) => handleChange('admissionDate', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrolled Class *
                  </label>
                  <select
                    disabled={isFieldDisabled('classId')}
                    value={formData.classId || ''}
                    onChange={(e) => handleChange('classId', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100 font-semibold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.room})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class Section
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('section')}
                    value={formData.section || 'A'}
                    onChange={(e) => handleChange('section', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary uppercase font-mono disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class Roll Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    disabled={isFieldDisabled('rollNo')}
                    value={formData.rollNo || 1}
                    onChange={(e) => handleChange('rollNo', Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('academicYear')}
                    value={formData.academicYear || 'AY 2026–2027'}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Academic Standing
                  </label>
                  <select
                    disabled={isFieldDisabled('academicStatus')}
                    value={formData.academicStatus || 'On Track'}
                    onChange={(e) => handleChange('academicStatus', e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100 font-semibold"
                  >
                    <option value="Exceeding">Exceeding</option>
                    <option value="On Track">On Track</option>
                    <option value="Needs Attention">Needs Attention</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enrollment Status
                  </label>
                  <select
                    disabled={isFieldDisabled('status')}
                    value={formData.status || 'Active'}
                    onChange={(e) => handleChange('status', e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100 font-bold"
                  >
                    <option value="Active">Active (Attending)</option>
                    <option value="Inactive">Inactive (Suspended)</option>
                    <option value="Transferred">Transferred (Moved)</option>
                    <option value="Withdrawn">Withdrawn (Formal exit)</option>
                    <option value="Archived">Archived Record</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous School (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.previousSchool || ''}
                    onChange={(e) => handleChange('previousSchool', e.target.value)}
                    placeholder="e.g. St. Xavier Primary Academy"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous Transfer / TC Ref
                  </label>
                  <input
                    type="text"
                    value={formData.previousAdmissionRef || ''}
                    onChange={(e) => handleChange('previousAdmissionRef', e.target.value)}
                    placeholder="e.g. TC-2023-P08"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PARENT & GUARDIAN DETAILS */}
          {activeTab === 'guardian' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200/60 text-xs text-blue-900">
                <strong>Guardian Notice:</strong> A guardian account is linked to the student records. Changes to contact details take effect across the Parent Portal immediately.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Guardian Full Name *
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('parentName')}
                    value={formData.parentName || ''}
                    onChange={(e) => handleChange('parentName', e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border ${
                      errors.parentName ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.parentName && <p className="text-[11px] text-rose-600 mt-1">{errors.parentName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Relationship
                  </label>
                  <select
                    disabled={isFieldDisabled('guardianRelation')}
                    value={formData.guardianRelation || 'Father'}
                    onChange={(e) => handleChange('guardianRelation', e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary bg-white disabled:bg-slate-100"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Legal Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guardian Phone *
                  </label>
                  <input
                    type="tel"
                    disabled={isFieldDisabled('parentPhone')}
                    value={formData.parentPhone || ''}
                    onChange={(e) => handleChange('parentPhone', e.target.value)}
                    placeholder="+1 (555) 349-2180"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                      errors.parentPhone ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.parentPhone && <p className="text-[11px] text-rose-600 mt-1">{errors.parentPhone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Guardian Email
                  </label>
                  <input
                    type="email"
                    disabled={isFieldDisabled('parentEmail')}
                    value={formData.parentEmail || ''}
                    onChange={(e) => handleChange('parentEmail', e.target.value)}
                    placeholder="guardian@example.com"
                    className={`w-full px-3.5 py-2 text-xs rounded-xl border font-mono ${
                      errors.parentEmail ? 'border-rose-500 bg-rose-50' : 'border-slate-200'
                    } focus:outline-none focus:border-theme-primary disabled:bg-slate-100`}
                  />
                  {errors.parentEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.parentEmail}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.parentOccupation || ''}
                    onChange={(e) => handleChange('parentOccupation', e.target.value)}
                    placeholder="e.g. Software Engineer, Architect"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Secondary Contact & Emergency Protocol
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Secondary Guardian Name
                      </label>
                      <input
                        type="text"
                        disabled={isFieldDisabled('secondaryGuardianName')}
                        value={formData.secondaryGuardianName || ''}
                        onChange={(e) => handleChange('secondaryGuardianName', e.target.value)}
                        placeholder="e.g. Pooja Sharma"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Secondary Guardian Phone
                      </label>
                      <input
                        type="tel"
                        disabled={isFieldDisabled('secondaryGuardianPhone')}
                        value={formData.secondaryGuardianPhone || ''}
                        onChange={(e) => handleChange('secondaryGuardianPhone', e.target.value)}
                        placeholder="+1 (555) 349-2181"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HEALTH & SECURITY DETAILS */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School Health & Medical Alerts
                </label>
                <textarea
                  rows={2}
                  disabled={isFieldDisabled('medicalAlerts')}
                  value={formData.medicalAlerts || ''}
                  onChange={(e) => handleChange('medicalAlerts', e.target.value)}
                  placeholder="Record documented food allergies (e.g. Peanut allergy), asthma, or medication guidelines..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                />
                <p className="text-[11px] text-slate-400 mt-1">Medical alerts are accessible only to authorized administrative and medical personnel.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact Person
                  </label>
                  <input
                    type="text"
                    disabled={isFieldDisabled('emergencyContact')}
                    value={formData.emergencyContactPerson || ''}
                    onChange={(e) => handleChange('emergencyContactPerson', e.target.value)}
                    placeholder="e.g. Ramesh Sharma (Father)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    disabled={isFieldDisabled('emergencyContact')}
                    value={formData.emergencyContact || ''}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="+1 (555) 349-2180"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary font-mono disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Authorized Campus Pickup Escorts
                </label>
                <input
                  type="text"
                  disabled={isFieldDisabled('authorizedPickup')}
                  value={formData.authorizedPickup || ''}
                  onChange={(e) => handleChange('authorizedPickup', e.target.value)}
                  placeholder="e.g. Ramesh Sharma (Father), Pooja Sharma (Mother)"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Internal Administrative Notes (Authorized Staff Only)
                </label>
                <textarea
                  rows={2}
                  value={formData.internalNotes || ''}
                  onChange={(e) => handleChange('internalNotes', e.target.value)}
                  placeholder="Internal admissions notes, fee considerations, or scholarship details..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-theme-primary disabled:bg-slate-100"
                />
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
                <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Save Student Changes' : 'Enrol New Student'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation modal for consequential status change (e.g. Setting to Inactive) */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white p-5 rounded-2xl max-w-sm w-full space-y-3 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Confirm Student Inactivation</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setting this student to <strong>Inactive</strong> withdraws them from daily attendance roll calls and active class allocations. Are you sure you wish to proceed?
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
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Confirm Inactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
