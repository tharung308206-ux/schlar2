import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry, RoleType } from '../../types';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Clock,
  User,
  Eye,
  X,
  Layers,
  ArrowUpDown,
  Lock
} from 'lucide-react';

export const SharedAuditTrail: React.FC = () => {
  const { auditLogs, currentRole, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SUCCESS' | 'DENIED' | 'FLAGGED'>('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filtered entries
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((entry) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        entry.action.toLowerCase().includes(q) ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.module.toLowerCase().includes(q) ||
        entry.recordRef.toLowerCase().includes(q) ||
        (entry.reason && entry.reason.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (moduleFilter !== 'all' && entry.module.toLowerCase() !== moduleFilter.toLowerCase()) {
        return false;
      }

      if (statusFilter !== 'all' && entry.status !== statusFilter) {
        return false;
      }

      if (roleFilter !== 'all' && entry.actorRole !== roleFilter) {
        return false;
      }

      return true;
    });
  }, [auditLogs, searchQuery, moduleFilter, statusFilter, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  // Metrics
  const totalSuccess = auditLogs.filter((l) => l.status === 'SUCCESS').length;
  const totalDenied = auditLogs.filter((l) => l.status === 'DENIED').length;
  const totalFlagged = auditLogs.filter((l) => l.status === 'FLAGGED').length;
  const uniqueModules = Array.from(new Set(auditLogs.map((l) => l.module)));

  // Real CSV Export
  const exportAuditLogsCSV = () => {
    const headers = ['Event ID', 'Timestamp', 'Actor Role', 'Actor Name', 'Module', 'Action', 'Record Ref', 'Status', 'Reason/Notes'];
    const rows = filteredLogs.map((l) => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.actorRole}"`,
      `"${l.actorName.replace(/"/g, '""')}"`,
      `"${l.module}"`,
      `"${l.action}"`,
      `"${l.recordRef}"`,
      `"${l.status}"`,
      `"${(l.reason || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `greenfield_audit_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Audit Ledger Exported',
      message: `Downloaded ${filteredLogs.length} verified audit records to CSV.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Audit Trail</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident system activity history logging administrative mutations, permission validations, and data lifecycle events.
          </p>
        </div>

        <button
          onClick={exportAuditLogsCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV ({filteredLogs.length})</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Events</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black font-mono text-slate-900 mt-2 block">
            {auditLogs.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Across {uniqueModules.length} school subsystems</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Authorized</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black font-mono text-emerald-800 mt-2 block">
            {totalSuccess}
          </span>
          <span className="text-[11px] text-emerald-700/80 mt-0.5 block">
            {Math.round((totalSuccess / (auditLogs.length || 1)) * 100)}% execution rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Access Denied</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-black font-mono text-rose-800 mt-2 block">
            {totalDenied}
          </span>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">RBAC policy interventions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Flagged Events</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black font-mono text-amber-800 mt-2 block">
            {totalFlagged}
          </span>
          <span className="text-[11px] text-amber-700/80 mt-0.5 block">Requires supervisory review</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by actor name, action (e.g. RECORD_ATTENDANCE), or record ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">All Modules</option>
              {uniqueModules.map((m) => (
                <option key={m} value={m}>
                  Module: {m.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="DENIED">DENIED</option>
              <option value="FLAGGED">FLAGGED</option>
            </select>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="all">All Actor Roles</option>
              <option value="principal">Principal</option>
              <option value="vice_principal">Vice Principal</option>
              <option value="teacher">Teacher</option>
              <option value="accountant">Accountant</option>
              <option value="hr">HR Manager</option>
              <option value="librarian">Librarian</option>
              <option value="transport">Transport</option>
              <option value="receptionist">Receptionist</option>
              <option value="exam_coordinator">Exam Coordinator</option>
              <option value="parent">Parent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Record Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-slate-400">
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((entry) => {
                  const statusColors = {
                    SUCCESS: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                    DENIED: 'bg-rose-50 text-rose-800 border-rose-200',
                    FLAGGED: 'bg-amber-50 text-amber-800 border-amber-200'
                  };

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                        {new Date(entry.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{entry.actorName}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">
                          {entry.actorRole}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {entry.action}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 uppercase font-mono">
                          {entry.module}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-600">
                        {entry.recordRef}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            statusColors[entry.status]
                          }`}
                        >
                          {entry.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                          {entry.status === 'DENIED' && <XCircle className="w-3 h-3" />}
                          {entry.status === 'FLAGGED' && <AlertTriangle className="w-3 h-3" />}
                          <span>{entry.status}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedEntry(entry)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Inspect Audit Entry"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredLogs.length)} of {filteredLogs.length} events
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 disabled:opacity-40 font-semibold"
            >
              Prev
            </button>
            <span className="px-2 font-mono font-bold text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 disabled:opacity-40 font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold">Audit Record Inspector</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedEntry.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedEntry.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Execution Status</span>
                  <span className="font-bold text-slate-900">{selectedEntry.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Actor Name</span>
                  <span className="font-bold text-slate-900">{selectedEntry.actorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Actor Role</span>
                  <span className="font-mono text-slate-800 uppercase">{selectedEntry.actorRole}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Subsystem Module</span>
                  <span className="font-mono text-slate-800">{selectedEntry.module}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Record Reference</span>
                  <span className="font-mono text-slate-800">{selectedEntry.recordRef}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                  Action Executed
                </span>
                <div className="p-2.5 bg-slate-100 rounded-lg font-mono font-bold text-slate-900">
                  {selectedEntry.action}
                </div>
              </div>

              {selectedEntry.reason && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                    System Reasoning / Notes
                  </span>
                  <p className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
                    {selectedEntry.reason}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
