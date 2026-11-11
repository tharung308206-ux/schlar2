import React, { useState } from 'react';
import { Staff } from '../../types';
import { useApp } from '../../context/AppContext';
import { canViewStaffSection, checkPermission } from '../../data/permissions';
import {
  X,
  User,
  Briefcase,
  Clock,
  Phone,
  Mail,
  Award,
  FileCheck,
  Activity,
  Edit,
  Printer,
  CheckCircle2,
  Building,
  ShieldCheck
} from 'lucide-react';

interface StaffProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  onEdit?: (staff: Staff) => void;
}

export const StaffProfileModal: React.FC<StaffProfileModalProps> = ({
  isOpen,
  onClose,
  staff,
  onEdit
}) => {
  const { currentRole, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<string>('overview');

  if (!isOpen || !staff) return null;

  const staffAuditLogs = auditLogs.filter(
    (log) =>
      log.module === 'staff' &&
      (log.recordRef.includes(staff.name) || (staff.staffId && log.recordRef.includes(staff.staffId)))
  );

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'personal', label: 'Contact & Address', icon: <Phone className="w-3.5 h-3.5" /> },
    { id: 'employment', label: 'Employment & Shift', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { id: 'responsibilities', label: 'Work Scope', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'qualifications', label: 'Credentials', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'documents', label: 'Documents', icon: <FileCheck className="w-3.5 h-3.5" /> },
    { id: 'activity', label: 'Audit Trail', icon: <Activity className="w-3.5 h-3.5" /> }
  ];

  const visibleTabs = allTabs.filter((tab) => canViewStaffSection(currentRole, tab.id));
  const selectedTab = visibleTabs.some((t) => t.id === activeTab) ? activeTab : visibleTabs[0]?.id || 'overview';

  const canEdit = checkPermission(currentRole, 'staff', 'edit').allowed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Header Ribbon */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-700 to-slate-800 text-white flex items-center justify-center font-black text-xl shadow-md border border-white/10 shrink-0">
                {staff.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-white">{staff.name}</h2>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      staff.status === 'Active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : staff.status === 'On Leave'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-700 text-slate-300 border border-slate-600'
                    }`}
                  >
                    {staff.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-300 mt-1.5 font-mono flex-wrap">
                  <span className="font-semibold text-white">{staff.staffId || 'STF-2026-001'}</span>
                  <span>·</span>
                  <span className="text-indigo-300">{staff.role}</span>
                  <span>·</span>
                  <span>{staff.department}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              {canEdit && onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(staff);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Edit Staff</span>
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Print Profile"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Close Profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto gap-1 text-xs font-semibold">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                selectedTab === tab.id
                  ? 'border-theme-primary text-theme-primary font-bold bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-slate-700 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Department</span>
                  <span className="text-base font-bold text-slate-900 mt-1 block truncate">
                    {staff.department}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Operational Division</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Shift Schedule</span>
                  <span className="text-sm font-bold text-indigo-900 mt-1 block truncate">
                    {staff.shift || 'Standard Shift'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Campus Roster</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Employment Type</span>
                  <span className="text-base font-bold text-emerald-800 mt-1 block">
                    {staff.employmentType || 'Full-time'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Joined: {staff.joinDate}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Position Particulars</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Staff ID:</span>
                    <span className="font-mono font-bold text-slate-900">{staff.staffId || 'STF-2026-001'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Role / Position:</span>
                    <span className="font-semibold text-slate-800">{staff.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Campus Email:</span>
                    <span className="font-mono text-slate-800">{staff.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Telephone:</span>
                    <span className="font-mono text-slate-800">{staff.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Reporting Manager:</span>
                    <span className="font-medium text-slate-800">{staff.reportingManager || 'Dr. Arthur Campbell (Principal)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Campus Location:</span>
                    <span className="font-medium text-slate-800">{staff.address || 'Greenfield Campus District'}</span>
                  </div>
                </div>
              </div>

              {staff.responsibilities && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">Core Duties & Operational Scope</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{staff.responsibilities}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTACT & ADDRESS */}
          {selectedTab === 'personal' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Channels & Emergency Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Official Work Email</span>
                    <span className="font-mono font-medium text-slate-800">{staff.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Telephone</span>
                    <span className="font-mono font-medium text-slate-800">{staff.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                    <span className="font-mono font-medium text-slate-800">{staff.emergencyContact || staff.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Campus Residential District</span>
                    <span className="font-medium text-slate-800">{staff.address || 'Greenfield Campus Area'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMPLOYMENT & SHIFT */}
          {selectedTab === 'employment' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Operational Shift & Contract</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Assigned Shift Window</span>
                    <span className="font-bold text-indigo-900">{staff.shift || 'Standard Day (08:00 - 16:30)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contract Status</span>
                    <span className="font-bold text-emerald-700">{staff.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Department Division</span>
                    <span className="font-semibold text-slate-800">{staff.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Supervising Officer</span>
                    <span className="font-medium text-slate-800">{staff.reportingManager || 'Dr. Arthur Campbell (Principal)'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORK SCOPE */}
          {selectedTab === 'responsibilities' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Charter of Responsibilities</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {staff.responsibilities || 'Provides administrative, operational, and support functions for the department.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: CREDENTIALS */}
          {selectedTab === 'qualifications' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Credentials & Certifications</h3>
                <div className="p-3 bg-slate-50 rounded-lg text-xs">
                  <span className="font-bold text-slate-900 block">{staff.qualifications || 'Degree / Diploma on file'}</span>
                  <span className="text-[11px] text-slate-500">Verified in campus employee archives.</span>
                </div>
                {staff.certifications && staff.certifications.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-semibold text-slate-800 block">Certifications</span>
                    {staff.certifications.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/50 p-2 rounded-lg border border-emerald-200/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: DOCUMENTS */}
          {selectedTab === 'documents' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Verified Staff Documentation</h3>
                <p className="text-xs text-slate-500">Employment contract, identity proof, and campus clearance.</p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                      <th className="py-2.5 px-4">Document Title</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(staff.documents && staff.documents.length > 0
                      ? staff.documents
                      : [
                          { id: 'ds-1', name: 'Identity Proof (Aadhar / Passport)', type: 'PDF', status: 'Verified' as const },
                          { id: 'ds-2', name: 'Employment Agreement', type: 'PDF', status: 'Verified' as const },
                          { id: 'ds-3', name: 'Statutory Background Clearance', type: 'PDF', status: 'Verified' as const }
                        ]
                    ).map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 font-bold text-slate-900">{doc.name}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-600">{doc.type}</td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT TRAIL */}
          {selectedTab === 'activity' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Staff Member Action Audit Log</h3>
                <p className="text-xs text-slate-500">Immutable operations log referencing {staff.name}.</p>
              </div>

              {staffAuditLogs.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                  No recorded modifications for this staff member in the current session.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px]">
                        <th className="py-2.5 px-4">Timestamp</th>
                        <th className="py-2.5 px-4">Action</th>
                        <th className="py-2.5 px-4">Actor</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staffAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{log.action}</td>
                          <td className="py-2.5 px-4 text-slate-700">{log.actorName}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 text-[11px]">{log.reason || 'Staff record updated'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>General Staff Register · Greenfield International School</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
