import React, { useRef } from 'react';
import {
  Student,
  Exam,
  MarkEntry,
  ClassInfo,
  GradeBoundary
} from '../../types';
import { DEFAULT_GRADING_SCALE, calculateGradeFromPercentage } from '../../data/examinationData';
import {
  X,
  Printer,
  Download,
  Award,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ReportCardModalProps {
  student: Student;
  exam: Exam;
  marksList: MarkEntry[];
  classInfo?: ClassInfo;
  isOpen: boolean;
  onClose: () => void;
  gradingScale?: GradeBoundary[];
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  student,
  exam,
  marksList,
  classInfo,
  isOpen,
  onClose,
  gradingScale = DEFAULT_GRADING_SCALE
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Filter marks for this student and exam
  const studentMarks = marksList.filter(
    (m) => m.studentId === student.id && (m.examId === exam.id || !m.examId)
  );

  // Calculate totals
  const totalMaxMarks = studentMarks.reduce((acc, curr) => acc + (curr.totalMarks || 100), 0) || 100;
  const totalObtainedMarks = studentMarks.reduce(
    (acc, curr) => acc + (curr.assessmentStatus === 'Absent' ? 0 : (curr.marksObtained || 0)),
    0
  );
  const aggregatePercentage = totalMaxMarks > 0 ? (totalObtainedMarks / totalMaxMarks) * 100 : 0;
  const overallGradeInfo = calculateGradeFromPercentage(aggregatePercentage, gradingScale);
  const matchedScale = gradingScale.find((b) => b.grade === overallGradeInfo.grade);
  const overallGpa = matchedScale?.gpa ?? 3.8;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const headers = ['Subject', 'Max Written', 'Max Practical', 'Max Internal', 'Total Max', 'Marks Obtained', 'Percentage', 'Grade', 'Teacher Remarks'];
    const rows = studentMarks.map((m) => [
      `"${m.subject}"`,
      m.writtenMarks ?? 0,
      m.practicalMarks ?? 0,
      m.internalMarks ?? 0,
      m.totalMarks,
      m.assessmentStatus === 'Absent' ? 'ABSENT' : m.marksObtained ?? 0,
      `${m.percentage ?? Math.round(((m.marksObtained ?? 0) / m.totalMarks) * 100)}%`,
      m.grade,
      `"${(m.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      `GREENFIELD INTERNATIONAL SCHOOL - OFFICIAL STUDENT REPORT CARD`,
      `Student Name:,"${student.name}",Admission No:,${student.admissionId || student.id}`,
      `Class:,${classInfo?.name || student.classId},Examination:,"${exam.name}"`,
      `Aggregate:,${aggregatePercentage.toFixed(1)}%,Overall Grade:,${overallGradeInfo.grade}`,
      '',
      headers.join(','),
      ...rows.map((r) => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ReportCard_${student.name.replace(/\s+/g, '_')}_${exam.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Toolbar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900 text-white shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold tracking-wide">Official Scholastic Transcript & Report Card</span>
            <span className="text-[11px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
              {exam.status === 'Published' ? 'Official & Released' : 'Provisional Draft'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700"
              title="Print Official Document"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print Transcript</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
              title="Export Report CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-200" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors ml-2"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div ref={printRef} className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-8 print:overflow-visible">
          
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900 text-white flex flex-col items-center justify-center font-extrabold text-xl shadow-md border-2 border-emerald-600 shrink-0">
                <span>GIS</span>
                <span className="text-[8px] font-mono tracking-widest text-emerald-300">EST. 1998</span>
              </div>

              <div className="flex-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase font-serif">
                  Greenfield International School
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Affiliated to Central Board of Secondary Education & Cambridge Assessment International Education
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Campus: Sector 14, Knowledge Corridor · Tel: +91 80 4920 8800 · www.greenfield-intl.sch.edu
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold uppercase tracking-wider text-slate-800 border border-slate-200">
                  Academic Progress Report — {exam.term || 'Term 1'} · 2026-2027
                </div>
              </div>

              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-[10px] font-mono shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mb-0.5" />
                <span className="text-[8px] font-bold text-slate-600">VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Student Profile & Examination Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Student Name</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Admission No.</span>
              <span className="font-mono font-bold text-slate-800 text-sm block mt-0.5">{student.admissionId || student.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Class & Section</span>
              <span className="font-bold text-slate-800 text-sm block mt-0.5">{classInfo?.name || student.classId} (Roll #{student.rollNo})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Term Attendance</span>
              <span className="font-mono font-bold text-emerald-800 text-sm block mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {student.attendanceRate || 94.8}% Present
              </span>
            </div>
          </div>

          {/* Subject Performance Marks Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-3 text-center">Written (Max)</th>
                  <th className="py-3 px-3 text-center">Practical (Max)</th>
                  <th className="py-3 px-3 text-center">Internal (Max)</th>
                  <th className="py-3 px-3 text-center">Total (Max)</th>
                  <th className="py-3 px-3 text-center">Obtained</th>
                  <th className="py-3 px-3 text-center">Percentage</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {studentMarks.length > 0 ? (
                  studentMarks.map((m, idx) => {
                    const isAbs = m.assessmentStatus === 'Absent';
                    const isEx = m.assessmentStatus === 'Exempt';
                    const obtained = isAbs ? 'ABSENT' : isEx ? 'EXEMPT' : (m.marksObtained ?? 0);
                    const pct = isAbs ? 0 : isEx ? 100 : m.percentage ?? Math.round(((m.marksObtained ?? 0) / m.totalMarks) * 100);

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="py-3 px-4 font-bold text-slate-900">{m.subject}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{m.writtenMarks !== undefined ? m.writtenMarks : '—'}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{m.practicalMarks !== undefined ? m.practicalMarks : '—'}</td>
                        <td className="py-3 px-3 text-center font-mono text-slate-600">{m.internalMarks !== undefined ? m.internalMarks : '—'}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">{m.totalMarks}</td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-slate-900">
                          {isAbs ? (
                            <span className="text-rose-600 font-bold">ABSENT</span>
                          ) : isEx ? (
                            <span className="text-blue-600 font-bold">EXEMPT</span>
                          ) : (
                            obtained
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">
                          {isAbs ? '0%' : isEx ? 'Exempt' : `${pct}%`}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              m.grade === 'A+' || m.grade === 'A'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : m.grade === 'B'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : m.grade === 'C'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {m.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 italic text-[11px] max-w-xs truncate">
                          {m.remarks || 'Consistent academic performance demonstrated.'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-slate-400 italic">
                      No assessment marks recorded for this examination session yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Scholastic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Grand Total</span>
              <span className="text-xl font-extrabold font-mono text-slate-900 mt-1 block">
                {totalObtainedMarks} <span className="text-xs text-slate-400 font-normal">/ {totalMaxMarks}</span>
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Aggregate Percentage</span>
              <span className="text-xl font-extrabold font-mono text-emerald-800 mt-1 block">
                {aggregatePercentage.toFixed(1)}%
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Overall Grade & GPA</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-extrabold font-mono text-slate-900">Grade {overallGradeInfo.grade}</span>
                <span className="text-xs font-mono font-bold text-slate-500">({overallGpa.toFixed(1)} / 4.0)</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Academic Standing</span>
              <span className="text-xs font-bold text-slate-800 mt-1.5 block line-clamp-2">
                {overallGradeInfo.description}
              </span>
            </div>
          </div>

          {/* Grading Scale Legend */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px]">
            <span className="font-bold text-slate-700 block mb-1 text-[10px] uppercase tracking-wider">Standard Grading Benchmark:</span>
            <div className="flex flex-wrap gap-2 text-slate-600">
              {gradingScale.map((b) => (
                <span key={b.grade} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                  <strong>{b.grade}</strong>: {b.minPercentage}%–{b.maxPercentage}% (GPA {b.gpa.toFixed(1)})
                </span>
              ))}
            </div>
          </div>

          {/* Official Signatures & Seal Section */}
          <div className="pt-8 border-t border-slate-300 mt-6 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center font-serif italic text-slate-700 font-bold text-base pb-1">
                Dr. Vikram Sharma
              </div>
              <div className="w-40 border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                Class Mentor / Teacher
              </div>
              <span className="text-[10px] text-slate-400">Greenfield Faculty</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center font-serif italic text-slate-700 font-bold text-base pb-1">
                Mrs. Evelyn Hayes
              </div>
              <div className="w-40 border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                Academic Coordinator
              </div>
              <span className="text-[10px] text-slate-400">Vice Principal</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center font-serif italic text-emerald-900 font-extrabold text-base pb-1">
                Dr. Sarah Jenkins
              </div>
              <div className="w-40 border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                Principal & Head of School
              </div>
              <span className="text-[10px] text-slate-400">Official Stamp & Seal</span>
            </div>
          </div>

          {/* Watermark / Footer */}
          <div className="text-center text-[10px] text-slate-400 pt-4 font-mono">
            Document generated electronically via SCHLAR School Management System · Verification Key: GIS-{student.id}-{exam.id}-TRANSCRIPT
          </div>
        </div>
      </div>
    </div>
  );
};
