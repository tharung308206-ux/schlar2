import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassInfo, Student } from '../../types';
import { StudentProfileModal } from '../common/StudentProfileModal';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Edit2,
  Users,
  Eye,
  BookOpen,
  MapPin,
  Calendar,
  X,
  Clock,
  ArrowUpDown,
  GraduationCap,
  ShieldAlert,
  Archive,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ClassSectionWorkspace: React.FC = () => {
  const {
    classes,
    students,
    teachers,
    subjects,
    subjectAllocations,
    timetableEntries,
    activeAcademicYearId,
    addClass,
    updateClass,
    archiveClass,
    addToast
  } = useApp();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'studentCount' | 'attendanceToday'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Class Detail Drawer/Modal
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassInfo | null>(null);
  const [detailTab, setDetailTab] = useState<'students' | 'subjects' | 'timetable' | 'sections'>('students');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Add / Edit Class Modal
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);

  // Form Fields
  const [formGrade, setFormGrade] = useState('10');
  const [formSection, setFormSection] = useState('A');
  const [formRoom, setFormRoom] = useState('Room 301');
  const [formClassTeacherId, setFormClassTeacherId] = useState('t-1');
  const [formCapacity, setFormCapacity] = useState(35);
  const [formSubjects, setFormSubjects] = useState<string[]>([
    'Mathematics',
    'Science',
    'English',
    'Computer Science',
    'Social Science'
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered & Sorted Classes
  const filteredClasses = useMemo(() => {
    return classes
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.classTeacherName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = gradeFilter === 'all' || c.grade === gradeFilter;
        return matchesSearch && matchesGrade;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        if (sortBy === 'studentCount') {
          return sortAsc ? a.studentCount - b.studentCount : b.studentCount - a.studentCount;
        }
        if (sortBy === 'attendanceToday') {
          return sortAsc ? a.attendanceToday - b.attendanceToday : b.attendanceToday - a.attendanceToday;
        }
        return 0;
      });
  }, [classes, searchTerm, gradeFilter, sortBy, sortAsc]);

  // Unique grades for filter
  const uniqueGrades = useMemo(() => {
    return Array.from(new Set(classes.map((c) => c.grade))).sort();
  }, [classes]);

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormGrade('10');
    setFormSection('C');
    setFormRoom('Room 303');
    setFormClassTeacherId(teachers[0]?.id || 't-1');
    setFormCapacity(35);
    setFormSubjects(['Mathematics', 'Science', 'English', 'Computer Science']);
    setFormError(null);
    setShowClassModal(true);
  };

  const handleOpenEdit = (cls: ClassInfo) => {
    setEditingClass(cls);
    setFormGrade(cls.grade);
    setFormSection(cls.section);
    setFormRoom(cls.room);
    setFormClassTeacherId(cls.classTeacherId);
    setFormCapacity(cls.capacity);
    setFormSubjects(cls.subjects || []);
    setFormError(null);
    setShowClassModal(true);
  };

  const handleToggleSubject = (subjectName: string) => {
    if (formSubjects.includes(subjectName)) {
      if (formSubjects.length <= 1) {
        setFormError('Class must have at least one assigned subject.');
        return;
      }
      setFormSubjects(formSubjects.filter((s) => s !== subjectName));
    } else {
      setFormSubjects([...formSubjects, subjectName]);
    }
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Prevent duplicate section within the same grade and academic year
    const duplicate = classes.find(
      (c) =>
        c.grade === formGrade &&
        c.section.toLowerCase() === formSection.trim().toLowerCase() &&
        c.id !== editingClass?.id
    );

    if (duplicate) {
      setFormError(`Section '${formSection}' already exists for Grade ${formGrade}.`);
      return;
    }

    const assignedTeacher = teachers.find((t) => t.id === formClassTeacherId);

    const classData = {
      name: `Grade ${formGrade}${formSection.trim().toUpperCase()}`,
      grade: formGrade,
      section: formSection.trim().toUpperCase(),
      classTeacherId: formClassTeacherId,
      classTeacherName: assignedTeacher?.name || 'Assigned Faculty',
      room: formRoom.trim(),
      capacity: Number(formCapacity),
      subjects: formSubjects,
      academicYearId: activeAcademicYearId,
      status: 'Active' as const
    };

    if (editingClass) {
      const res = updateClass(editingClass.id, classData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Class Division Updated',
          message: `${classData.name} record saved successfully.`
        });
        setShowClassModal(false);
      } else {
        setFormError(res.error || 'Failed to update class.');
      }
    } else {
      const res = addClass(classData);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Class Division Created',
          message: `${classData.name} has been enrolled in academic registry.`
        });
        setShowClassModal(false);
      } else {
        setFormError(res.error || 'Failed to create class.');
      }
    }
  };

  const handleArchiveClass = (cls: ClassInfo) => {
    const ok = archiveClass(cls.id);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Class Archived',
        message: `${cls.name} division moved to archive status.`
      });
      if (selectedClassDetail?.id === cls.id) {
        setSelectedClassDetail(null);
      }
    }
  };

  // Enrolled students for detail drawer
  const classStudents = useMemo(() => {
    if (!selectedClassDetail) return [];
    return students.filter((s) => s.classId === selectedClassDetail.id);
  }, [students, selectedClassDetail]);

  // Timetable entries for detail drawer
  const classTimetable = useMemo(() => {
    if (!selectedClassDetail) return [];
    return timetableEntries.filter(
      (e) => e.classId === selectedClassDetail.id && e.academicYearId === activeAcademicYearId
    );
  }, [timetableEntries, selectedClassDetail, activeAcademicYearId]);

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Classes & Sections Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grade cohorts, section rosters, mentor faculty assignments, physical rooms, and occupancy levels.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Class Division</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by class name, mentor, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-emerald-700 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Grades</option>
              {uniqueGrades.map((g) => (
                <option key={g} value={g}>
                  Grade {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-medium text-slate-800"
          >
            <option value="name">Class Name</option>
            <option value="studentCount">Enrollment Count</option>
            <option value="attendanceToday">Attendance Rate</option>
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const occupancyPct = Math.round((cls.studentCount / (cls.capacity || 35)) * 100);

          return (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900">{cls.name}</h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        Sec {cls.section}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {cls.room}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {cls.attendanceToday}% Present
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Class Mentor:</span>
                    <strong className="text-slate-800">{cls.classTeacherName}</strong>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-[11px] mb-1">
                      <span className="text-slate-400">Seat Occupancy:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {cls.studentCount} / {cls.capacity} seats ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          occupancyPct > 95 ? 'bg-amber-600' : 'bg-emerald-700'
                        }`}
                        style={{ width: `${Math.min(100, occupancyPct)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Subjects Covered ({cls.subjects?.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {cls.subjects?.slice(0, 4).map((sub, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {sub}
                        </span>
                      ))}
                      {(cls.subjects?.length || 0) > 4 && (
                        <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
                          +{(cls.subjects?.length || 0) - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedClassDetail(cls);
                    setDetailTab('students');
                  }}
                  className="text-xs text-emerald-800 font-bold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details & Roster</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Class Info"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchiveClass(cls)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Archive Class"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: CLASS DETAIL DRAWER ================= */}
      {selectedClassDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800/60 border border-emerald-700/50 flex items-center justify-center text-emerald-200">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedClassDetail.name} Division Overview
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Room: {selectedClassDetail.room} · Mentor: {selectedClassDetail.classTeacherName} · Capacity: {selectedClassDetail.capacity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedClassDetail(null)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside Detail Modal */}
            <div className="bg-slate-100 px-6 pt-3 flex gap-2 border-b border-slate-200 shrink-0 text-xs font-bold">
              <button
                onClick={() => setDetailTab('students')}
                className={`px-3 py-2 border-b-2 transition-all ${
                  detailTab === 'students'
                    ? 'border-emerald-900 text-emerald-950 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Enrolled Students ({classStudents.length})
              </button>
              <button
                onClick={() => setDetailTab('subjects')}
                className={`px-3 py-2 border-b-2 transition-all ${
                  detailTab === 'subjects'
                    ? 'border-emerald-900 text-emerald-950 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Assigned Subjects & Faculty
              </button>
              <button
                onClick={() => setDetailTab('timetable')}
                className={`px-3 py-2 border-b-2 transition-all ${
                  detailTab === 'timetable'
                    ? 'border-emerald-900 text-emerald-950 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Class Weekly Schedule ({classTimetable.length} periods)
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto text-xs space-y-4">
              {/* TAB 1: Enrolled Students */}
              {detailTab === 'students' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Active student roster for {selectedClassDetail.name}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {classStudents.length} Students Registered
                    </span>
                  </div>

                  {classStudents.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Admission ID</th>
                            <th className="py-2.5 px-3">Parent / Contact</th>
                            <th className="py-2.5 px-3">Attendance</th>
                            <th className="py-2.5 px-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {classStudents.map((st) => (
                            <tr key={st.id} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{st.name}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{st.admissionId}</td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {st.parentName} ({st.parentPhone})
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                                  {st.attendanceRate}%
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => setViewingStudent(st)}
                                  className="text-xs font-semibold text-emerald-800 hover:underline flex items-center justify-end gap-1 ml-auto"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Profile</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500">
                      No students are currently allocated to this division.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Subjects & Faculty */}
              {detailTab === 'subjects' && (
                <div className="space-y-3">
                  <div className="text-slate-500 text-xs">
                    Allocated subjects and designated instructors for {selectedClassDetail.name}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedClassDetail.subjects?.map((subName, i) => {
                      const alloc = subjectAllocations.find(
                        (a) => a.classId === selectedClassDetail.id && a.subjectName === subName
                      );

                      return (
                        <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-slate-900 text-sm">{subName}</span>
                            <span className="text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                              {alloc ? `${alloc.periodsPerWeek} periods/wk` : 'Allocated'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Instructor:{' '}
                            <strong className="text-slate-800">
                              {alloc?.teacherName || 'Assigned Department Faculty'}
                            </strong>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Location: {alloc?.room || selectedClassDetail.room}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: Timetable Preview */}
              {detailTab === 'timetable' && (
                <div className="space-y-3">
                  <div className="text-slate-500 text-xs">
                    Scheduled periods for {selectedClassDetail.name} in current active academic year
                  </div>

                  {classTimetable.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                            <th className="py-2.5 px-3">Day</th>
                            <th className="py-2.5 px-3">Period</th>
                            <th className="py-2.5 px-3">Subject</th>
                            <th className="py-2.5 px-3">Teacher</th>
                            <th className="py-2.5 px-3">Room</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {classTimetable.slice(0, 12).map((entry) => (
                            <tr key={entry.id} className="hover:bg-slate-50/70">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{entry.dayOfWeek}</td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{entry.periodName}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{entry.subjectName}</td>
                              <td className="py-2.5 px-3 text-slate-600">{entry.teacherName}</td>
                              <td className="py-2.5 px-3 text-slate-500 font-mono">{entry.room}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-500">
                      No timetable periods have been published for this class yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Close Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CLASS DIVISION ================= */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
            <div className="bg-emerald-950 text-white p-5 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingClass ? 'Configure Class Division' : 'Add Class Division'}
                </h3>
                <p className="text-xs text-emerald-300">Set grade level, section label, classroom, and faculty mentor.</p>
              </div>
              <button onClick={() => setShowClassModal(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4 overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Grade Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                  >
                    {['5', '6', '7', '8', '9', '10', '11', '12'].map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Section Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={formSection}
                    onChange={(e) => setFormSection(e.target.value)}
                    placeholder="e.g. A, B, C"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold uppercase focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Home Classroom <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Room 301"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Seating Capacity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:ring-1 focus:ring-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Class Mentor / Teacher <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formClassTeacherId}
                  onChange={(e) => setFormClassTeacherId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-700 outline-none"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} ({tch.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subjects Checklist */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">
                  Assigned Subjects Curriculum
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {subjects.map((sub) => {
                    const isChecked = formSubjects.includes(sub.name);
                    return (
                      <label
                        key={sub.id}
                        className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 text-[11px]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSubject(sub.name)}
                          className="rounded text-emerald-800 focus:ring-emerald-700"
                        />
                        <span className="font-semibold text-slate-800 truncate">{sub.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  {editingClass ? 'Save Changes' : 'Create Division'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded Student Profile Modal */}
      <StudentProfileModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
      />
    </div>
  );
};
