import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice, RoleType } from '../../types';
import {
  Bell,
  Search,
  Filter,
  Plus,
  Calendar,
  User,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  X,
  ChevronRight,
  Eye,
  Check,
  Send,
  Sparkles,
  Info
} from 'lucide-react';

interface SharedNoticeBoardProps {
  forcedCategory?: string;
  onNoticeClick?: (notice: Notice) => void;
  showCreateButton?: boolean;
}

export const SharedNoticeBoard: React.FC<SharedNoticeBoardProps> = ({
  forcedCategory,
  onNoticeClick,
  showCreateButton = true
}) => {
  const {
    notices,
    addNotice,
    currentRole,
    addToast,
    logAuditEvent
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(forcedCategory || 'all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [acknowledgedNotices, setAcknowledgedNotices] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    category: 'School' as Notice['category'],
    priority: 'Normal' as Notice['priority'],
    targetAudience: 'All School Community',
    content: ''
  });

  // Check if role is authorized to publish notices
  const canPublish = ['principal', 'vice_principal', 'teacher'].includes(currentRole);

  // Role-based Audience filtering
  const visibleNotices = useMemo(() => {
    return notices.filter((n) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        n.targetAudience.toLowerCase().includes(q);

      const matchCategory =
        selectedCategory === 'all' || n.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchPriority =
        selectedPriority === 'all' || n.priority.toLowerCase() === selectedPriority.toLowerCase();

      // Audience scope check for Parents and Teachers
      let matchAudience = true;
      if (currentRole === 'parent' || currentRole === 'parent_mobile') {
        const aud = n.targetAudience.toLowerCase();
        matchAudience =
          aud.includes('all') ||
          aud.includes('parent') ||
          aud.includes('community') ||
          aud.includes('students');
      } else if (currentRole === 'teacher' || currentRole === 'teacher_mobile') {
        const aud = n.targetAudience.toLowerCase();
        matchAudience =
          aud.includes('all') ||
          aud.includes('faculty') ||
          aud.includes('teacher') ||
          aud.includes('staff') ||
          aud.includes('students');
      }

      return matchSearch && matchCategory && matchPriority && matchAudience;
    });
  }, [notices, searchQuery, selectedCategory, selectedPriority, currentRole]);

  // Handle Create Notice
  const handleCreateNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title.trim() || !noticeForm.content.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Notice title and content are required.'
      });
      return;
    }

    const authorMap: Record<string, string> = {
      principal: 'Dr. Arthur Campbell (Principal)',
      vice_principal: 'Mrs. Evelyn Hayes (Vice Principal)',
      teacher: 'Dr. Vikram Sharma (Senior Faculty)',
      default: 'School Administration'
    };

    addNotice({
      title: noticeForm.title.trim(),
      content: noticeForm.content.trim(),
      category: noticeForm.category,
      targetAudience: noticeForm.targetAudience,
      author: authorMap[currentRole] || authorMap.default,
      priority: noticeForm.priority
    });

    logAuditEvent({
      action: 'PUBLISH',
      module: 'notices',
      recordRef: `notice-${Date.now()}`,
      actorRole: currentRole,
      actorName: authorMap[currentRole] || 'School Administration',
      reason: `Broadcasted notice '${noticeForm.title}' to audience: ${noticeForm.targetAudience}`,
      status: 'SUCCESS'
    });

    addToast({
      type: 'success',
      title: 'Notice Published',
      message: `Circular '${noticeForm.title}' posted successfully to ${noticeForm.targetAudience}.`
    });

    setIsCreateModalOpen(false);
    setNoticeForm({
      title: '',
      category: 'School',
      priority: 'Normal',
      targetAudience: 'All School Community',
      content: ''
    });
  };

  const handleAcknowledge = (id: string, title: string) => {
    setAcknowledgedNotices((prev) => ({ ...prev, [id]: true }));
    addToast({
      type: 'success',
      title: 'Acknowledged',
      message: `You marked '${title}' as read and acknowledged.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-theme-primary bg-theme-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Notice Board
            </span>
            <span className="text-xs text-slate-400">· Official Institutional Circulars</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            School Announcements & Circulars
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified academic bulletins, administrative directives, examination schedules, and event circulars.
          </p>
        </div>

        {canPublish && showCreateButton && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-theme-primary text-white hover:opacity-90 rounded-xl text-xs font-bold shadow-xs transition-opacity self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Announcement</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search circular title, author, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="all">All Categories</option>
            <option value="School">School Policy</option>
            <option value="Exam">Examinations</option>
            <option value="Event">Events & Sports</option>
            <option value="Class">Class Academic</option>
            <option value="Important">Important Directives</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent Priority</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Priority</option>
          </select>
        </div>
      </div>

      {/* Notice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleNotices.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-slate-700 text-sm">No Circulars Found</h4>
            <p className="text-xs text-slate-500 mt-1">There are no announcements matching your filters.</p>
          </div>
        ) : (
          visibleNotices.map((n) => {
            const isAcknowledged = acknowledgedNotices[n.id];
            return (
              <div
                key={n.id}
                onClick={() => {
                  setSelectedNotice(n);
                  if (onNoticeClick) onNoticeClick(n);
                }}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          n.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : n.priority === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {n.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {n.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAcknowledged && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <Check className="w-3 h-3" /> Read
                        </span>
                      )}
                      <span className="font-mono text-xs text-slate-400">{n.date}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-theme-primary transition-colors">
                    {n.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {n.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="truncate mr-2">
                    <span>Issued By: </span>
                    <strong className="text-slate-800">{n.author}</strong>
                  </div>
                  <span className="text-theme-primary font-semibold flex items-center gap-0.5 shrink-0 group-hover:underline">
                    Read Circular <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================== */}
      {/* NOTICE DETAIL MODAL                                            */}
      {/* ============================================================== */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 text-slate-800">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedNotice.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedNotice.priority === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {selectedNotice.priority} Priority
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-light text-theme-primary">
                  {selectedNotice.category}
                </span>
                <span className="font-mono text-xs text-slate-400 ml-auto">{selectedNotice.date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{selectedNotice.title}</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p className="whitespace-pre-line text-xs leading-relaxed text-slate-800">
                {selectedNotice.content}
              </p>

              <div className="pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span className="block text-slate-400">Target Audience:</span>
                  <strong className="text-slate-800 font-semibold">{selectedNotice.targetAudience}</strong>
                </div>
                <div>
                  <span className="block text-slate-400">Authorizing Official:</span>
                  <strong className="text-slate-800 font-semibold">{selectedNotice.author}</strong>
                </div>
              </div>
            </div>

            {/* Simulated In-App Delivery Status Notice */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Simulated In-App Bulletin Delivery Active</span>
              </div>
              <span className="font-mono text-slate-400">Status: Published</span>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Circular Print Manifest',
                    message: `Sending '${selectedNotice.title}' to physical printer.`
                  });
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Document</span>
              </button>

              <div className="flex items-center gap-2">
                {!acknowledgedNotices[selectedNotice.id] && (
                  <button
                    onClick={() => handleAcknowledge(selectedNotice.id, selectedNotice.title)}
                    className="flex items-center gap-1 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge Receipt</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CREATE NOTICE MODAL (AUTHORIZED ROLES ONLY)                   */}
      {/* ============================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 text-slate-800">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Post Institutional Notice</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Broadcast an official school announcement to students, faculty, or parents.
              </p>
            </div>

            <form onSubmit={handleCreateNoticeSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="e.g. Annual Inter-House Science & Robotics Fair"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="School">School Policy</option>
                    <option value="Exam">Examinations</option>
                    <option value="Event">Events & Sports</option>
                    <option value="Class">Class Academic</option>
                    <option value="Important">Important Directive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={noticeForm.priority}
                    onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={noticeForm.targetAudience}
                  onChange={(e) => setNoticeForm({ ...noticeForm, targetAudience: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                >
                  <option value="All School Community">All School Community (Everyone)</option>
                  <option value="All Faculty & Teachers">All Faculty & Teachers</option>
                  <option value="All Parents">All Parents</option>
                  <option value="High School Students & Parents">High School Students & Parents</option>
                  <option value="Middle School Students">Middle School Students</option>
                  <option value="Administrative Staff">Administrative Staff</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Circular Content Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Provide full text of circular, dates, rules, or instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-theme-primary leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-theme-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
