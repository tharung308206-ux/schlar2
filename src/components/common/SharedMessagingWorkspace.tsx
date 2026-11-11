import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Message, RoleType } from '../../types';
import {
  MessageSquare,
  Search,
  Send,
  Plus,
  User,
  Paperclip,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Users,
  Filter,
  X,
  Smile,
  Info
} from 'lucide-react';

interface RecipientOption {
  id: string;
  name: string;
  role: string;
  roleType: RoleType;
  subtitle: string;
}

export const SharedMessagingWorkspace: React.FC = () => {
  const {
    messages,
    sendMessage,
    currentRole,
    teachers,
    staff,
    students,
    userProfiles,
    logAuditEvent,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeThreadId, setActiveThreadId] = useState<string>('parent-teacher-aarav');
  const [messageInput, setMessageInput] = useState('');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientOption | null>(null);
  const [newThreadFirstMsg, setNewThreadFirstMsg] = useState('');
  const [threadCategoryFilter, setThreadCategoryFilter] = useState<'all' | 'faculty' | 'parent' | 'admin'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group messages into distinct threads
  const threads = useMemo(() => {
    const threadMap: Record<
      string,
      {
        id: string;
        participants: { role: string; name: string }[];
        lastMessage: Message;
        messageCount: number;
        unreadCount: number;
      }
    > = {};

    messages.forEach((msg) => {
      if (!threadMap[msg.threadId]) {
        threadMap[msg.threadId] = {
          id: msg.threadId,
          participants: [
            { role: msg.senderRole, name: msg.senderName },
            { role: msg.recipientRole, name: msg.recipientName }
          ],
          lastMessage: msg,
          messageCount: 1,
          unreadCount: 0
        };
      } else {
        threadMap[msg.threadId].lastMessage = msg;
        threadMap[msg.threadId].messageCount += 1;
      }
    });

    return Object.values(threadMap);
  }, [messages]);

  // Filtered threads
  const filteredThreads = useMemo(() => {
    return threads.filter((t) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.lastMessage.text.toLowerCase().includes(q) ||
        t.participants.some(
          (p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
        );

      if (!matchSearch) return false;

      if (threadCategoryFilter === 'parent') {
        return t.participants.some((p) => p.role.toLowerCase().includes('parent'));
      }
      if (threadCategoryFilter === 'faculty') {
        return t.participants.some((p) => p.role.toLowerCase().includes('teacher'));
      }
      if (threadCategoryFilter === 'admin') {
        return t.participants.some(
          (p) =>
            p.role.toLowerCase().includes('principal') ||
            p.role.toLowerCase().includes('accountant') ||
            p.role.toLowerCase().includes('receptionist')
        );
      }
      return true;
    });
  }, [threads, searchQuery, threadCategoryFilter]);

  // Current active thread messages
  const currentThreadMessages = useMemo(() => {
    return messages.filter((m) => m.threadId === activeThreadId);
  }, [messages, activeThreadId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentThreadMessages]);

  // Active thread details
  const activeThread = useMemo(() => {
    return (
      threads.find((t) => t.id === activeThreadId) || {
        id: activeThreadId,
        participants: [
          { role: 'teacher', name: 'Dr. Vikram Sharma' },
          { role: 'parent', name: 'Ramesh Sharma' }
        ],
        lastMessage: currentThreadMessages[currentThreadMessages.length - 1] || null,
        messageCount: currentThreadMessages.length,
        unreadCount: 0
      }
    );
  }, [threads, activeThreadId, currentThreadMessages]);

  // Determine allowed recipients based on the logged-in role
  const availableRecipients = useMemo((): RecipientOption[] => {
    const list: RecipientOption[] = [];

    // Principal & VP can message everyone
    const isExecutive = currentRole === 'principal' || currentRole === 'vice_principal';

    // Faculty members
    teachers.forEach((t) => {
      list.push({
        id: t.id,
        name: t.name,
        role: t.roleTitle,
        roleType: 'teacher',
        subtitle: `${t.subjects.join(', ')} • ${t.classes.join(', ')}`
      });
    });

    // Administrative Staff
    staff.forEach((s) => {
      list.push({
        id: s.id,
        name: s.name,
        role: s.role,
        roleType: 'receptionist',
        subtitle: `${s.department} • ${s.phone}`
      });
    });

    // Parents
    if (isExecutive || currentRole === 'teacher' || currentRole === 'receptionist') {
      const parentMap = new Map<string, string>();
      students.forEach((st) => {
        if (!parentMap.has(st.parentEmail)) {
          parentMap.set(st.parentEmail, st.name);
          list.push({
            id: `parent-${st.id}`,
            name: `${st.parentName} (Parent of ${st.name})`,
            role: 'Parent / Guardian',
            roleType: 'parent',
            subtitle: `${st.parentEmail} • ${st.parentPhone}`
          });
        }
      });
    }

    // Executives
    if (!isExecutive) {
      list.unshift(
        {
          id: 'admin-principal',
          name: 'Dr. Arthur Campbell',
          role: 'Principal Office',
          roleType: 'principal',
          subtitle: 'Institutional Leadership & Direct Escalations'
        },
        {
          id: 'admin-vp',
          name: 'Mrs. Evelyn Hayes',
          role: 'Vice Principal (Academics)',
          roleType: 'vice_principal',
          subtitle: 'Curriculum & Examination Supervision'
        }
      );
    }

    return list;
  }, [currentRole, teachers, staff, students]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const targetRecipient = activeThread.participants.find(
      (p) => p.role !== currentRole
    ) || { role: 'teacher', name: 'Faculty Member' };

    sendMessage(
      activeThreadId,
      messageInput.trim(),
      targetRecipient.role,
      targetRecipient.name
    );

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Institutional User',
      action: 'SEND_INTERNAL_MESSAGE',
      module: 'communication',
      recordRef: activeThreadId,
      status: 'SUCCESS'
    });

    setMessageInput('');
  };

  const handleStartNewThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || !newThreadFirstMsg.trim()) return;

    const newThreadId = `th-${Date.now()}-${selectedRecipient.roleType}`;
    sendMessage(
      newThreadId,
      newThreadFirstMsg.trim(),
      selectedRecipient.roleType,
      selectedRecipient.name
    );

    logAuditEvent({
      actorRole: currentRole,
      actorName: userProfiles[currentRole]?.fullName || 'Institutional User',
      action: 'CREATE_MESSAGE_THREAD',
      module: 'communication',
      recordRef: newThreadId,
      status: 'SUCCESS'
    });

    setActiveThreadId(newThreadId);
    setShowNewThreadModal(false);
    setSelectedRecipient(null);
    setNewThreadFirstMsg('');
    addToast({
      type: 'success',
      title: 'Thread Created',
      message: `Direct channel initiated with ${selectedRecipient.name}.`
    });
  };

  const cannedTemplates = [
    'Regarding upcoming term assessment preparations and study timetable.',
    'Confirming our consultation appointment for the scheduled Parent-Teacher conference.',
    'Please review the student leave excuse request submitted for verification.',
    'Reminder: Kindly complete the coursework grading milestone by tomorrow afternoon.'
  ];

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Internal Messaging Desk</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-theme-light text-theme-primary border border-theme-primary/20">
              Role-Scoped & Audited
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure intra-school communication log connecting leadership, faculty, administrative staff, and authorized guardians.
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-theme-primary hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Compose New Message</span>
        </button>
      </div>

      {/* Main Messaging Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[620px] max-h-[750px]">
        {/* Left Column: Thread List */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          {/* Thread Search & Filters */}
          <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] pb-1 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'faculty', label: 'Faculty' },
                  { id: 'parent', label: 'Parents' },
                  { id: 'admin', label: 'Admin' }
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setThreadCategoryFilter(f.id)}
                  className={`px-2.5 py-0.5 rounded-full font-semibold transition-colors shrink-0 ${
                    threadCategoryFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Threads Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <span>No conversations found matching query.</span>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                const otherParty = thread.participants.find(
                  (p) => p.role !== currentRole
                ) || thread.participants[0];

                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 hover:bg-white ${
                      isActive ? 'bg-white border-l-4 border-theme-primary shadow-xs' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                      {otherParty.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {otherParty.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {thread.lastMessage.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        <span className="px-1.5 py-0.2 bg-slate-100 rounded text-[10px] text-slate-600 uppercase font-mono mr-1">
                          {otherParty.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-1">
                        {thread.lastMessage.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Thread Stream & Composer */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-theme-light text-theme-primary font-bold flex items-center justify-center text-xs border border-theme-primary/20">
                <Users className="w-5 h-5 text-theme-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    {activeThread.participants.map((p) => p.name).join(' & ')}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Verified Channel
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thread ID: <span className="font-mono">{activeThread.id}</span> • Greenfield Encrypted Internal Routing
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>Retention Period: 36 Months</span>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/40">
            {currentThreadMessages.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <span>No messages in this conversation yet. Send the first greeting below.</span>
              </div>
            ) : (
              currentThreadMessages.map((msg, idx) => {
                const isMe = msg.isMine || msg.senderRole === currentRole;

                return (
                  <div
                    key={msg.id || idx}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700">{msg.senderName}</span>
                      <span className="text-[10px] uppercase font-mono px-1 bg-slate-200/60 rounded">
                        {msg.senderRole}
                      </span>
                      <span>•</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[75%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                        isMe
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Canned Templates Toolbar */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
            <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0 text-[10px]">
              Templates:
            </span>
            {cannedTemplates.map((tmpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMessageInput(tmpl)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-md truncate max-w-[200px] border border-slate-200 shrink-0 text-left transition-colors"
                title={tmpl}
              >
                {tmpl}
              </button>
            ))}
          </div>

          {/* Message Composer */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Attach File (PDF, Slip, Medical Record)"
              onClick={() => {
                addToast({
                  type: 'info',
                  title: 'Attachment Attached',
                  message: 'Mock document "Term1_Review_Notes.pdf" attached to message.'
                });
              }}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder="Type your official message (Enter to send)..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-theme-primary font-medium"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="px-4 py-2.5 bg-theme-primary hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Initiate Authorized Communication</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a recipient within your role's communication boundary.
                </p>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartNewThread} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Recipient Directory ({availableRecipients.length} Available)
                </label>
                <select
                  required
                  value={selectedRecipient?.id || ''}
                  onChange={(e) => {
                    const match = availableRecipients.find((r) => r.id === e.target.value);
                    setSelectedRecipient(match || null);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="">-- Choose recipient --</option>
                  {availableRecipients.map((rec) => (
                    <option key={rec.id} value={rec.id}>
                      {rec.name} — {rec.role}
                    </option>
                  ))}
                </select>
                {selectedRecipient && (
                  <p className="text-[11px] text-slate-500 mt-1 italic">
                    {selectedRecipient.subtitle}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="State the purpose of your communication..."
                  value={newThreadFirstMsg}
                  onChange={(e) => setNewThreadFirstMsg(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-theme-primary font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-[11px] text-amber-800">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Notice: All messages sent across the Greenfield platform are recorded in the institutional audit ledger for safety and compliance.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedRecipient || !newThreadFirstMsg.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-theme-primary hover:opacity-90 disabled:opacity-50 rounded-xl shadow-xs transition-all"
                >
                  Open Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
