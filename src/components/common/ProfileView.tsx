import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Globe,
  Palette,
  CheckCircle2,
  Edit3,
  X,
  Save,
  LogOut,
  RefreshCw,
  Building,
  Mail,
  Phone,
  BookOpen,
  Users,
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ProfileViewProps {
  onBackToDashboard?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBackToDashboard }) => {
  const {
    currentRole,
    userProfiles,
    updateUserProfile,
    setIsWelcomeScreen,
    switchRoleAndNavigate,
    addToast
  } = useApp();

  const profile = userProfiles[currentRole] || userProfiles.principal;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);

  // Password demo state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });

  // Sync formData when profile or role changes
  useEffect(() => {
    setFormData(profile);
    setIsEditing(false);
  }, [profile, currentRole]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentRole, formData);
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.next || passForm.next !== passForm.confirm) {
      addToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.'
      });
      return;
    }

    addToast({
      type: 'success',
      title: 'Password Updated',
      message: 'Your account credentials have been securely updated.'
    });
    setShowPasswordModal(false);
    setPassForm({ current: '', next: '', confirm: '' });
  };

  const isParent = currentRole === 'parent_mobile';

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 text-white relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800/80 border-2 border-emerald-500/40 text-emerald-100 flex items-center justify-center font-black text-2xl shadow-inner tracking-tight">
                {profile.avatarText}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                    {profile.fullName}
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {profile.accountStatus}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-0.5">
                  {profile.title}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {profile.schoolName} · ID: <span className="font-mono text-slate-300">{profile.userId}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-xs font-medium transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Personal & Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Personal Information
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs font-semibold ${
                    isEditing
                      ? 'bg-slate-50 border-emerald-500 text-slate-900 focus:outline-none'
                      : 'bg-slate-50/60 border-slate-200 text-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Primary Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs ${
                      isEditing
                        ? 'bg-slate-50 border-emerald-500 text-slate-900 focus:outline-none'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Contact Telephone</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-mono ${
                      isEditing
                        ? 'bg-slate-50 border-emerald-500 text-slate-900 focus:outline-none'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              {formData.emergencyContact && (
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs ${
                      isEditing
                        ? 'bg-slate-50 border-emerald-500 text-slate-900 focus:outline-none'
                        : 'bg-slate-50/60 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Account & Credentials
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">
                  {isParent ? 'Parent ID' : 'Employee ID'}
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.userId}
                  className="w-full p-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Assigned Role Designation</label>
                <input
                  type="text"
                  disabled
                  value={formData.title}
                  className="w-full p-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">Affiliated Institution</label>
                <input
                  type="text"
                  disabled
                  value={formData.schoolName}
                  className="w-full p-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-800 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                  <span>Change Password (Security Demo)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Role-Specific Profile Information */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isParent ? 'Family & Student Record' : 'Departmental Responsibilities & Clearances'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {formData.department && (
              <div>
                <span className="text-slate-400 block mb-1">Department / Faculty</span>
                <span className="font-semibold text-slate-800">{formData.department}</span>
              </div>
            )}

            {formData.officeLocation && (
              <div>
                <span className="text-slate-400 block mb-1">Office / Station Location</span>
                <span className="font-semibold text-slate-800">{formData.officeLocation}</span>
              </div>
            )}

            {formData.qualifications && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Academic Credentials & Qualifications</span>
                <span className="font-medium text-slate-800">{formData.qualifications}</span>
              </div>
            )}

            {formData.specialization && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Core Focus Area / Specialization</span>
                <span className="font-medium text-slate-800">{formData.specialization}</span>
              </div>
            )}

            {formData.assignedClasses && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Assigned Classes</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.assignedClasses.map((cls, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[11px]"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.subjects && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Instructional Subjects</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200 text-[11px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.approvalLimit && (
              <div>
                <span className="text-slate-400 block mb-1">Disbursement Authority Limit</span>
                <span className="font-mono font-bold text-emerald-800">{formData.approvalLimit}</span>
              </div>
            )}

            {formData.shiftHours && (
              <div>
                <span className="text-slate-400 block mb-1">Duty Roster / Shift Hours</span>
                <span className="font-mono text-slate-800 font-semibold">{formData.shiftHours}</span>
              </div>
            )}

            {formData.administrativeScope && (
              <div className="sm:col-span-2">
                <span className="text-slate-400 block mb-1">Administrative Jurisdiction</span>
                <span className="font-semibold text-slate-800">{formData.administrativeScope}</span>
              </div>
            )}

            {/* Parent-Specific Information */}
            {isParent && (
              <>
                <div>
                  <span className="text-slate-400 block mb-1">Relationship to Students</span>
                  <span className="font-semibold text-slate-800">{formData.relationship}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Residential Address</span>
                  <span className="text-slate-800">{formData.residentialAddress}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 block mb-1">Registered Children</span>
                  <div className="space-y-1 mt-1">
                    {formData.childrenNames?.map((child, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800"
                      >
                        {child}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 3: Preferences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              System Preferences & Communication
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Email Alerts</span>
                <span className="text-[11px] text-slate-500">Official circulars & digests</span>
              </div>
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={formData.preferences.notificationsEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, notificationsEmail: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-emerald-700"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">SMS Alerts</span>
                <span className="text-[11px] text-slate-500">Urgent campus bulletins</span>
              </div>
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={formData.preferences.notificationsSms}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, notificationsSms: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-emerald-700"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Push Notifications</span>
                <span className="text-[11px] text-slate-500">In-app real-time updates</span>
              </div>
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={formData.preferences.notificationsPush}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, notificationsPush: e.target.checked }
                  })
                }
                className="w-4 h-4 accent-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Actions Bar */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsWelcomeScreen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch Role</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWelcomeScreen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Sign Out</span>
            </button>
          </div>

          {isEditing && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => {
                  setFormData(profile);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Password Change Modal Demo */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl text-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passForm.current}
                  onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passForm.next}
                  onChange={(e) => setPassForm({ ...passForm, next: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passForm.confirm}
                  onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
