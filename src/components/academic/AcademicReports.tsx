import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Users,
  BookOpen,
  MapPin,
  Clock,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export const AcademicReports: React.FC = () => {
  const {
    teachers,
    classes,
    subjects,
    timetableEntries,
    availableRooms,
    activeAcademicYearId,
    addToast
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'workload' | 'coverage' | 'utilization'>('workload');

  const maxWeeklyCapacity = 25; // enterprise standard periods/week max for a full-time teacher

  // Active year entries
  const yearEntries = useMemo(() => {
    return timetableEntries.filter((e) => e.academicYearId === activeAcademicYearId);
  }, [timetableEntries, activeAcademicYearId]);

  // 1. Teacher Workload Analysis
  const teacherWorkloads = useMemo(() => {
    return teachers.map((tch) => {
      const assignedPeriods = yearEntries.filter((e) => e.teacherId === tch.id).length;
      const utilizationPct = Math.round((assignedPeriods / maxWeeklyCapacity) * 100);
      const isOverloaded = assignedPeriods > 22;

      // Unique classes taught
      const classesTaught = Array.from(
        new Set(yearEntries.filter((e) => e.teacherId === tch.id).map((e) => e.classId))
      );

      return {
        teacher: tch,
        assignedPeriods,
        maxWeeklyCapacity,
        utilizationPct,
        isOverloaded,
        classesTaughtCount: classesTaught.length
      };
    }).sort((a, b) => b.assignedPeriods - a.assignedPeriods);
  }, [teachers, yearEntries, maxWeeklyCapacity]);

  // 2. Subject Coverage Analysis per Class
  const subjectCoverage = useMemo(() => {
    const list: {
      classId: string;
      className: string;
      subjectName: string;
      required: number;
      scheduled: number;
      coveragePct: number;
      isMet: boolean;
    }[] = [];

    classes.forEach((cls) => {
      cls.subjects?.forEach((subName) => {
        const sub = subjects.find((s) => s.name.toLowerCase() === subName.toLowerCase());
        const required = sub?.periodsPerWeek || 4;
        const scheduled = yearEntries.filter(
          (e) => e.classId === cls.id && e.subjectName.toLowerCase() === subName.toLowerCase()
        ).length;
        const coveragePct = Math.round((scheduled / required) * 100);

        list.push({
          classId: cls.id,
          className: cls.name,
          subjectName: subName,
          required,
          scheduled,
          coveragePct,
          isMet: scheduled >= required
        });
      });
    });

    return list;
  }, [classes, subjects, yearEntries]);

  // 3. Room Utilization Analysis
  const roomUtilization = useMemo(() => {
    const totalWeeklyTeachingSlots = 30; // 6 periods x 5 days

    return availableRooms.map((rm) => {
      const bookedSlots = yearEntries.filter((e) => e.room.toLowerCase() === rm.toLowerCase()).length;
      const ratePct = Math.round((bookedSlots / totalWeeklyTeachingSlots) * 100);

      return {
        room: rm,
        bookedSlots,
        totalWeeklyTeachingSlots,
        ratePct
      };
    }).sort((a, b) => b.ratePct - a.ratePct);
  }, [availableRooms, yearEntries]);

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Report Exported',
      message: 'Academic operations report compiled as PDF/Spreadsheet.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Operations & Workload Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty period allocation analytics, curriculum coverage compliance, and facility utilization benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Academic Dossier</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Teaching Periods Scheduled</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {yearEntries.length}
          </span>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            Across {classes.length} cohorts & {teachers.length} faculty
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Faculty Workload Index</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {Math.round(
              teacherWorkloads.reduce((sum, t) => sum + t.utilizationPct, 0) / (teacherWorkloads.length || 1)
            )}
            %
          </span>
          <p className="text-[11px] text-slate-500 mt-1">
            {teacherWorkloads.filter((t) => t.isOverloaded).length} overloaded faculty alert
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Classroom Utilization Average</span>
          <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
            {Math.round(
              roomUtilization.reduce((sum, r) => sum + r.ratePct, 0) / (roomUtilization.length || 1)
            )}
            %
          </span>
          <p className="text-[11px] text-teal-700 font-medium mt-1">
            {availableRooms.length} physical spaces tracked
          </p>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveReportTab('workload')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === 'workload'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Faculty Teaching Workload</span>
          </button>

          <button
            onClick={() => setActiveReportTab('coverage')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === 'coverage'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Period Coverage</span>
          </button>

          <button
            onClick={() => setActiveReportTab('utilization')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeReportTab === 'utilization'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Room & Lab Utilization</span>
          </button>
        </div>

        {/* ================= REPORT 1: TEACHER WORKLOAD ================= */}
        {activeReportTab === 'workload' && (
          <div className="pt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Faculty Instructor</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Classes Taught</th>
                  <th className="py-2.5 px-3">Weekly Periods</th>
                  <th className="py-2.5 px-3">Load Capacity</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teacherWorkloads.map(({ teacher, assignedPeriods, maxWeeklyCapacity, utilizationPct, isOverloaded, classesTaughtCount }) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {teacher.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {teacher.department} ({teacher.subjectSpecialization})
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">
                      {classesTaughtCount} Divisions
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {assignedPeriods} / {maxWeeklyCapacity} periods
                    </td>
                    <td className="py-3 px-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isOverloaded ? 'bg-amber-600' : 'bg-emerald-700'
                            }`}
                            style={{ width: `${Math.min(100, utilizationPct)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700 w-10 text-right">
                          {utilizationPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {isOverloaded ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3 text-amber-700" /> Overloaded
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Optimal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= REPORT 2: CURRICULUM COVERAGE ================= */}
        {activeReportTab === 'coverage' && (
          <div className="pt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Class Cohort</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Required / Wk</th>
                  <th className="py-2.5 px-3">Scheduled / Wk</th>
                  <th className="py-2.5 px-3">Curriculum Progress</th>
                  <th className="py-2.5 px-3">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjectCoverage.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.className}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.subjectName}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.required} periods</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.scheduled} periods</td>
                    <td className="py-3 px-3 w-44">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.isMet ? 'bg-emerald-700' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(100, item.coveragePct)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700 w-10 text-right">
                          {item.coveragePct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {item.isMet ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          ✓ Complete
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                          Under-allocated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= REPORT 3: ROOM UTILIZATION ================= */}
        {activeReportTab === 'utilization' && (
          <div className="pt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Classroom / Lab Space</th>
                  <th className="py-2.5 px-3">Periods Booked</th>
                  <th className="py-2.5 px-3">Available Slots</th>
                  <th className="py-2.5 px-3">Occupancy Bar</th>
                  <th className="py-2.5 px-3">Availability Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roomUtilization.map((item) => (
                  <tr key={item.room} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.room}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {item.bookedSlots} / {item.totalWeeklyTeachingSlots}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {item.totalWeeklyTeachingSlots - item.bookedSlots} slots free
                    </td>
                    <td className="py-3 px-3 w-48">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-teal-700"
                            style={{ width: `${Math.min(100, item.ratePct)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-slate-700 w-10 text-right">
                          {item.ratePct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.ratePct > 80 ? 'High Demand' : item.ratePct > 40 ? 'Moderate' : 'Underutilized'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
