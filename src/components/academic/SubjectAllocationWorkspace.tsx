import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectItem, SubjectAllocation } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Users,
  Layers,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Search,
  Filter,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const SubjectAllocationWorkspace: React.FC = () => {
  const {
    subjects,
    subjectAllocations,
    classes,
    teachers,
    availableRooms,
    activeAcademicYearId,
    addSubject,
    updateSubject,
    deleteSubject,
    addSubjectAllocation,
    updateSubjectAllocation,
    deleteSubjectAllocation,
    addToast
  } = useApp();

  // Active view: 'subjects' or 'allocations'
  const [activeTab, setActiveTab] = useState<'subjects' | 'allocations'>('allocations');

  // Search & filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  // Subject Modal states
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);

  // Subject Form Fields
  const [formSubCode, setFormSubCode] = useState('');
  const [formSubName, setFormSubName] = useState('');
  const [formSubCategory, setFormSubCategory] = useState<SubjectItem['category']>('Core Academic');
  const [formSubGrades, setFormSubGrades] = useState<string[]>(['8', '9', '10']);
  const [formSubHodId, setFormSubHodId] = useState('t-1');
  const [formSubPeriods, setFormSubPeriods] = useState(5);
  const [formSubTextbook, setFormSubTextbook] = useState('');
  const [formSubDesc, setFormSubDesc] = useState('');
  const [formSubError, setFormSubError] = useState<string | null>(null);

  // Allocation Modal states
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [editingAlloc, setEditingAlloc] = useState<SubjectAllocation | null>(null);

  // Allocation Form Fields
  const [allocClassId, setAllocClassId] = useState('class-10a');
  const [allocSubjectId, setAllocSubjectId] = useState(subjects[0]?.id || 'sub-math');
  const [allocTeacherId, setAllocTeacherId] = useState(teachers[0]?.id || 't-1');
  const [allocPeriods, setAllocPeriods] = useState(5);
  const [allocRoom, setAllocRoom] = useState('Room 301');
  const [allocError, setAllocError] = useState<string | null>(null);

  // Filtered Subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [subjects, searchTerm, categoryFilter]);

  // Filtered Allocations
  const filteredAllocations = useMemo(() => {
    return subjectAllocations.filter((a) => {
      if (a.academicYearId !== activeAcademicYearId) return false;
      const matchSearch =
        a.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.room && a.room.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchClass = classFilter === 'all' || a.classId === classFilter;
      return matchSearch && matchClass;
    });
  }, [subjectAllocations, activeAcademicYearId, searchTerm, classFilter]);

  // Missing allocations detector: Check every class's declared subjects to see if an allocation exists
  const missingAllocations = useMemo(() => {
    const missing: { classId: string; className: string; subjectName: string }[] = [];

    classes.forEach((cls) => {
      cls.subjects?.forEach((subName) => {
        const hasAlloc = subjectAllocations.some(
          (a) =>
            a.classId === cls.id &&
            a.academicYearId === activeAcademicYearId &&
            a.subjectName.toLowerCase() === subName.toLowerCase() &&
            a.teacherId
        );
        if (!hasAlloc) {
          missing.push({
            classId: cls.id,
            className: cls.name,
            subjectName: subName
          });
        }
      });
    });

    return missing;
  }, [classes, subjectAllocations, activeAcademicYearId]);

  // Subject Modal Actions
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setFormSubCode('HIST-10');
    setFormSubName('World History & Civics');
    setFormSubCategory('Humanities');
    setFormSubGrades(['9', '10']);
    setFormSubHodId(teachers[3]?.id || teachers[0]?.id || 't-4');
    setFormSubPeriods(4);
    setFormSubTextbook('Modern Civilizations and Global Systems');
    setFormSubDesc('Comprehensive study of socio-political movements and democratic frameworks.');
    setFormSubError(null);
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (sub: SubjectItem) => {
    setEditingSubject(sub);
    setFormSubCode(sub.code);
    setFormSubName(sub.name);
    setFormSubCategory(sub.category);
    setFormSubGrades(sub.applicableGrades);
    setFormSubHodId(sub.departmentHodId || teachers[0]?.id || 't-1');
    setFormSubPeriods(sub.periodsPerWeek);
    setFormSubTextbook(sub.textbook || '');
    setFormSubDesc(sub.description || '');
    setFormSubError(null);
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubError(null);

    const hod = teachers.find((t) => t.id === formSubHodId);

    const subData: Omit<SubjectItem, 'id'> = {
      code: formSubCode.trim().toUpperCase(),
      name: formSubName.trim(),
      category: formSubCategory,
      applicableGrades: formSubGrades,
      departmentHodId: formSubHodId,
      departmentHodName: hod?.name || 'Department Faculty',
      periodsPerWeek: Number(formSubPeriods),
      textbook: formSubTextbook.trim(),
      description: formSubDesc.trim(),
      status: 'Active'
    };

    if (editingSubject) {
      const res = updateSubject(editingSubject.id, subData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Subject Updated',
          message: `${subData.name} (${subData.code}) saved successfully.`
        });
        setShowSubjectModal(false);
      } else {
        setFormSubError(res.error || 'Failed to update subject.');
      }
    } else {
      const res = addSubject(subData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Subject Created',
          message: `${subData.name} has been added to academic courses.`
        });
        setShowSubjectModal(false);
      } else {
        setFormSubError(res.error || 'Failed to create subject.');
      }
    }
  };

  // Allocation Modal Actions
  const handleOpenAddAlloc = (prefillClassId?: string, prefillSubName?: string) => {
    setEditingAlloc(null);
    const targetClass = prefillClassId || (classes[0]?.id || 'class-10a');
    setAllocClassId(targetClass);

    let foundSub = subjects[0];
    if (prefillSubName) {
      const matched = subjects.find(
        (s) => s.name.toLowerCase() === prefillSubName.toLowerCase()
      );
      if (matched) foundSub = matched;
    }
    setAllocSubjectId(foundSub?.id || 'sub-math');
    setAllocTeacherId(teachers[0]?.id || 't-1');
    setAllocPeriods(foundSub?.periodsPerWeek || 5);

    const cls = classes.find((c) => c.id === targetClass);
    setAllocRoom(cls?.room || 'Room 301');
    setAllocError(null);
    setShowAllocModal(true);
  };

  const handleOpenEditAlloc = (alloc: SubjectAllocation) => {
    setEditingAlloc(alloc);
    setAllocClassId(alloc.classId);
    setAllocSubjectId(alloc.subjectId);
    setAllocTeacherId(alloc.teacherId);
    setAllocPeriods(alloc.periodsPerWeek);
    setAllocRoom(alloc.room || 'Room 301');
    setAllocError(null);
    setShowAllocModal(true);
  };

  const handleSaveAlloc = (e: React.FormEvent) => {
    e.preventDefault();
    setAllocError(null);

    const currentSub = subjects.find((s) => s.id === allocSubjectId);
    const currentTeach = teachers.find((t) => t.id === allocTeacherId);

    // Prevent duplicate allocation for the same class and subject
    const duplicate = subjectAllocations.find(
      (a) =>
        a.classId === allocClassId &&
        a.subjectId === allocSubjectId &&
        a.academicYearId === activeAcademicYearId &&
        a.id !== editingAlloc?.id
    );

    if (duplicate) {
      setAllocError(`Subject '${currentSub?.name}' is already allocated to this class.`);
      return;
    }

    const allocData: Omit<SubjectAllocation, 'id'> = {
      academicYearId: activeAcademicYearId,
      classId: allocClassId,
      subjectId: allocSubjectId,
      subjectName: currentSub?.name || 'Subject',
      teacherId: allocTeacherId,
      teacherName: currentTeach?.name || 'Teacher',
      periodsPerWeek: Number(allocPeriods),
      room: allocRoom
    };

    if (editingAlloc) {
      const res = updateSubjectAllocation(editingAlloc.id, allocData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Allocation Updated',
          message: `${allocData.subjectName} assigned to ${allocData.teacherName}.`
        });
        setShowAllocModal(false);
      } else {
        setAllocError(res.error || 'Failed to update allocation.');
      }
    } else {
      const res = addSubjectAllocation(allocData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Allocation Created',
          message: `${allocData.subjectName} assigned to ${allocData.teacherName}.`
        });
        setShowAllocModal(false);
      } else {
        setAllocError(res.error || 'Failed to create allocation.');
      }
    }
  };

  const handleDeleteAlloc = (alloc: SubjectAllocation) => {
    const ok = deleteSubjectAllocation(alloc.id);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Allocation Removed',
        message: `Removed ${alloc.subjectName} allocation.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Subjects & Teacher Allocations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curriculum subject catalogs, department leadership, faculty class assignments, and weekly period quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'allocations' ? (
            <button
              onClick={() => handleOpenAddAlloc()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Allocate Teacher</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddSubject}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Missing Assignments Alert Box */}
      {missingAllocations.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Unassigned Subjects Detected ({missingAllocations.length})</span>
            </div>
            <span className="text-[11px] text-amber-700">Immediate faculty assignment required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
            {missingAllocations.map((m, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-white border border-amber-200 rounded-lg flex items-center justify-between gap-2 shadow-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{m.subjectName}</span>
                  <span className="text-[11px] text-slate-500">{m.className}</span>
                </div>
                <button
                  onClick={() => handleOpenAddAlloc(m.classId, m.subjectName)}
                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-bold text-[10px] shrink-0"
                >
                  Assign →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Switcher & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('allocations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'allocations'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher Class Allocations ({subjectAllocations.length})
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'subjects'
                  ? 'bg-emerald-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              Master Subject Catalog ({subjects.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={
                activeTab === 'allocations'
                  ? 'Search by teacher, subject, room...'
                  : 'Search by subject code, name...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {activeTab === 'allocations' ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter by Class:</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Filter Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-800"
              >
                <option value="all">All Categories</option>
                <option value="Core Academic">Core Academic</option>
                <option value="Science & Lab">Science & Lab</option>
                <option value="Humanities">Humanities</option>
                <option value="Technology">Technology</option>
                <option value="Arts & Physical Ed">Arts & Physical Ed</option>
              </select>
            </div>
          )}

          <span className="text-slate-400">
            Showing{' '}
            <strong className="text-slate-800">
              {activeTab === 'allocations' ? filteredAllocations.length : filteredSubjects.length}
            </strong>{' '}
            records
          </span>
        </div>
      </div>

      {/* ================= TAB 1: ALLOCATIONS TABLE ================= */}
      {activeTab === 'allocations' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-4">Class Division</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Assigned Instructor</th>
                  <th className="py-3 px-4">Weekly Load</th>
                  <th className="py-3 px-4">Designated Room</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAllocations.map((alloc) => {
                  const cls = classes.find((c) => c.id === alloc.classId);
                  const teacher = teachers.find((t) => t.id === alloc.teacherId);

                  return (
                    <tr key={alloc.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <span className="font-extrabold text-slate-900 block">{cls?.name || alloc.classId}</span>
                        <span className="text-[10px] text-slate-400">Home: {cls?.room}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{alloc.subjectName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {alloc.subjectId}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{alloc.teacherName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block pl-5.5">
                          {teacher?.department || 'Faculty'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {alloc.periodsPerWeek} periods/wk
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {alloc.room || cls?.room || 'Assigned Room'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditAlloc(alloc)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                            title="Edit Allocation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAlloc(alloc)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete Allocation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SUBJECTS DIRECTORY ================= */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {sub.code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {sub.periodsPerWeek} Periods/wk
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{sub.name}</h3>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">{sub.category}</span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{sub.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Head of Department:</span>
                    <strong className="text-slate-800">{sub.departmentHodName || 'Assigned HOD'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Grades Offered:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      Grades {sub.applicableGrades.join(', ')}
                    </span>
                  </div>
                  {sub.textbook && (
                    <div className="truncate">
                      <span className="text-slate-400">Textbook: </span>
                      <span className="text-slate-700 italic">{sub.textbook}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    handleOpenAddAlloc(undefined, sub.name);
                  }}
                  className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Allocate to Class</span>
                </button>

                <button
                  onClick={() => handleOpenEditSubject(sub)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                  title="Edit Subject"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SUBJECT ALLOCATION ================= */}
      {showAllocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingAlloc ? 'Edit Subject Allocation' : 'Allocate Subject & Teacher'}
                </h3>
                <p className="text-xs text-emerald-300">Assign faculty instructor and room to class curriculum.</p>
              </div>
              <button onClick={() => setShowAllocModal(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlloc} className="p-6 space-y-4 overflow-y-auto text-xs">
              {allocError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{allocError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Class Cohort</label>
                <select
                  value={allocClassId}
                  onChange={(e) => setAllocClassId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.room})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Subject</label>
                <select
                  value={allocSubjectId}
                  onChange={(e) => setAllocSubjectId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Designated Faculty Instructor</label>
                <select
                  value={allocTeacherId}
                  onChange={(e) => setAllocTeacherId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Periods / Week</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={allocPeriods}
                    onChange={(e) => setAllocPeriods(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Default Room</label>
                  <select
                    value={allocRoom}
                    onChange={(e) => setAllocRoom(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  >
                    {availableRooms.map((rm) => (
                      <option key={rm} value={rm}>
                        {rm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAllocModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SUBJECT ================= */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingSubject ? 'Edit Subject Details' : 'Add Academic Subject'}
                </h3>
                <p className="text-xs text-emerald-300">Configure subject code, category, and periods quota.</p>
              </div>
              <button onClick={() => setShowSubjectModal(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-6 space-y-4 overflow-y-auto text-xs">
              {formSubError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{formSubError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Subject Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubCode}
                    onChange={(e) => setFormSubCode(e.target.value)}
                    placeholder="e.g. MTH-10"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold uppercase focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Subject Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubName}
                    onChange={(e) => setFormSubName(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formSubCategory}
                    onChange={(e) => setFormSubCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  >
                    <option value="Core Academic">Core Academic</option>
                    <option value="Science & Lab">Science & Lab</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Technology">Technology</option>
                    <option value="Arts & Physical Ed">Arts & Physical Ed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Weekly Periods</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formSubPeriods}
                    onChange={(e) => setFormSubPeriods(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department Head (HOD)</label>
                <select
                  value={formSubHodId}
                  onChange={(e) => setFormSubHodId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary Textbook</label>
                <input
                  type="text"
                  value={formSubTextbook}
                  onChange={(e) => setFormSubTextbook(e.target.value)}
                  placeholder="e.g. Oxford Advanced Mathematics Edition IV"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Curriculum Scope / Description</label>
                <textarea
                  rows={2}
                  value={formSubDesc}
                  onChange={(e) => setFormSubDesc(e.target.value)}
                  placeholder="Summary of syllabus and learning outcomes..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  {editingSubject ? 'Update Subject' : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
