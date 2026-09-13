import React, { useRef, useState } from 'react';
import { MarksSheetData, SubjectRow } from '../types';
import { PRESETS, SAMPLE_CANDIDATE_PHOTO } from '../data/defaultData';
import { calculateGrade, numberToWords } from '../utils/numberToWords';
import {
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Calculator,
  User,
  BookOpen,
  Settings2,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface EditorFormProps {
  data: MarksSheetData;
  onChange: (data: MarksSheetData) => void;
  onPrint: () => void;
  onDownloadPdf?: () => void;
  isDownloading?: boolean;
}

export const EditorForm: React.FC<EditorFormProps> = ({
  data,
  onChange,
  onPrint,
  onDownloadPdf,
  isDownloading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'subjects' | 'footer'>(
    'student'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Text field changes
  const handleFieldChange = (field: keyof MarksSheetData, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Handle Totals field changes
  const handleTotalChange = (totalField: keyof MarksSheetData['totals'], value: string) => {
    onChange({
      ...data,
      totals: {
        ...data.totals,
        [totalField]: value,
      },
    });
  };

  // Handle Image Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...data,
            candidatePhoto: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop photo handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...data,
            candidatePhoto: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Subject row field change
  const handleSubjectChange = (
    id: string,
    field: keyof SubjectRow,
    value: string
  ) => {
    const updatedSubjects = data.subjects.map((sub) => {
      if (sub.id === id) {
        const updated = { ...sub, [field]: value };

        // If updating theory/practical, auto compute combined if user hasn't overridden
        if (
          field === 'part1SecTh' ||
          field === 'part2SecTh' ||
          field === 'part1MaxTh' ||
          field === 'part2MaxTh'
        ) {
          const p1 = parseFloat(field === 'part1SecTh' ? value : sub.part1SecTh) || 0;
          const p2 = parseFloat(field === 'part2SecTh' ? value : sub.part2SecTh) || 0;
          const p1Max = parseFloat(field === 'part1MaxTh' ? value : sub.part1MaxTh) || 0;
          const p2Max = parseFloat(field === 'part2MaxTh' ? value : sub.part2MaxTh) || 0;

          if (p1 > 0 || p2 > 0) {
            const combinedSec = p1 + p2;
            const combinedMax = p1Max + p2Max || (parseFloat(sub.combinedMaxTh) || 0);

            if (combinedMax > 0) {
              const pct = ((combinedSec / combinedMax) * 100).toFixed(1);
              updated.percentage = pct.endsWith('.0') ? pct.slice(0, -2) : pct;
              updated.remarks = parseFloat(updated.percentage) >= 33 ? 'Pass' : 'Fail';
            }
          }
        }

        return updated;
      }
      return sub;
    });

    onChange({
      ...data,
      subjects: updatedSubjects,
    });
  };

  // Add Subject Row
  const addSubjectRow = () => {
    const newSubject: SubjectRow = {
      id: Date.now().toString(),
      subject: 'NEW SUBJECT',
      part1MaxTh: '-',
      part1MaxPr: '-',
      part1SecTh: '-',
      part1SecPr: '-',
      part2MaxTh: '-',
      part2MaxPr: '-',
      part2SecTh: '-',
      part2SecPr: '-',
      combinedMaxTh: '100',
      combinedMaxPr: '-',
      combinedSecTh: '50',
      combinedSecPr: '-',
      percentage: '50',
      remarks: 'Pass',
    };

    onChange({
      ...data,
      subjects: [...data.subjects, newSubject],
    });
  };

  // Delete Subject Row
  const removeSubjectRow = (id: string) => {
    onChange({
      ...data,
      subjects: data.subjects.filter((s) => s.id !== id),
    });
  };

  // Auto Calculate Totals, Overall %, Grade, and In Words
  const handleAutoCalculate = () => {
    let totalMax1 = 0;
    let totalSec1 = 0;
    let totalMax2 = 0;
    let totalSec2 = 0;
    let totalCombinedMax = 0;
    let totalCombinedSec = 0;

    data.subjects.forEach((s) => {
      // Part I
      const p1MaxTh = parseFloat(s.part1MaxTh) || 0;
      const p1MaxPr = parseFloat(s.part1MaxPr) || 0;
      const p1SecTh = parseFloat(s.part1SecTh) || 0;
      const p1SecPr = parseFloat(s.part1SecPr) || 0;
      totalMax1 += p1MaxTh + p1MaxPr;
      totalSec1 += p1SecTh + p1SecPr;

      // Part II
      const p2MaxTh = parseFloat(s.part2MaxTh) || 0;
      const p2MaxPr = parseFloat(s.part2MaxPr) || 0;
      const p2SecTh = parseFloat(s.part2SecTh) || 0;
      const p2SecPr = parseFloat(s.part2SecPr) || 0;
      totalMax2 += p2MaxTh + p2MaxPr;
      totalSec2 += p2SecTh + p2SecPr;

      // Combined
      const cMaxTh = parseFloat(s.combinedMaxTh) || 0;
      const cMaxPr = parseFloat(s.combinedMaxPr) || 0;
      const cSecTh = parseFloat(s.combinedSecTh) || 0;
      const cSecPr = parseFloat(s.combinedSecPr) || 0;
      totalCombinedMax += cMaxTh + cMaxPr;
      totalCombinedSec += cSecTh + cSecPr;
    });

    // If Part I / Part II details aren't broken down (like in the original humanities sheet),
    // default standard values:
    const finalTotalMax = totalCombinedMax > 0 ? totalCombinedMax : 1100;
    const finalTotalSec = totalCombinedSec > 0 ? totalCombinedSec : 438;
    const finalMax1 = totalMax1 > 0 ? totalMax1 : 550;
    const finalSec1 = totalSec1 > 0 ? totalSec1 : Math.round(finalTotalSec * 0.45);
    const finalMax2 = totalMax2 > 0 ? totalMax2 : 550;
    const finalSec2 = totalSec2 > 0 ? totalSec2 : finalTotalSec - finalSec1;

    const overallPct = ((finalTotalSec / finalTotalMax) * 100).toFixed(2);
    const grade = calculateGrade(parseFloat(overallPct));
    const words = numberToWords(finalTotalSec);

    onChange({
      ...data,
      totals: {
        maxMarks1: finalMax1.toString(),
        secMarks1: finalSec1.toString(),
        maxMarks2: finalMax2.toString(),
        secMarks2: finalSec2.toString(),
        totalMaxMarks: finalTotalMax.toString(),
        totalSecMarks: finalTotalSec.toString(),
        overallPercentage: overallPct,
        grade,
      },
      inWords: words,
    });
  };

  // Load Preset
  const handleLoadPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    // Calculate marks for preset
    let totalCombinedMax = 0;
    let totalCombinedSec = 0;
    let totalMax1 = 0;
    let totalSec1 = 0;
    let totalMax2 = 0;
    let totalSec2 = 0;

    preset.subjects.forEach((s) => {
      totalMax1 += (parseFloat(s.part1MaxTh) || 0) + (parseFloat(s.part1MaxPr) || 0);
      totalSec1 += (parseFloat(s.part1SecTh) || 0) + (parseFloat(s.part1SecPr) || 0);
      totalMax2 += (parseFloat(s.part2MaxTh) || 0) + (parseFloat(s.part2MaxPr) || 0);
      totalSec2 += (parseFloat(s.part2SecTh) || 0) + (parseFloat(s.part2SecPr) || 0);
      totalCombinedMax += (parseFloat(s.combinedMaxTh) || 0) + (parseFloat(s.combinedMaxPr) || 0);
      totalCombinedSec += (parseFloat(s.combinedSecTh) || 0) + (parseFloat(s.combinedSecPr) || 0);
    });

    const finalTotalMax = totalCombinedMax || 1100;
    const finalTotalSec = totalCombinedSec || (presetKey === 'HUMANITIES' ? 438 : 780);
    const overallPct = ((finalTotalSec / finalTotalMax) * 100).toFixed(2);
    const grade = calculateGrade(parseFloat(overallPct));

    onChange({
      ...data,
      group: preset.group,
      subjects: preset.subjects,
      totals: {
        maxMarks1: (totalMax1 || 550).toString(),
        secMarks1: (totalSec1 || 182).toString(),
        maxMarks2: (totalMax2 || 550).toString(),
        secMarks2: (totalSec2 || 256).toString(),
        totalMaxMarks: finalTotalMax.toString(),
        totalSecMarks: finalTotalSec.toString(),
        overallPercentage: overallPct,
        grade,
      },
      inWords: numberToWords(finalTotalSec),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Top Header Bar with Print CTA */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            Marks Sheet Editor
          </h2>
          <p className="text-xs text-slate-300">
            Edit details, upload candidate photo, and print official marksheet
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onDownloadPdf && (
            <button
              id="btn-download-pdf-primary"
              onClick={onDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-lg font-semibold text-sm shadow-md transition cursor-pointer disabled:opacity-50"
            >
              <span>📥</span>
              {isDownloading ? 'Generating PDF...' : 'Download PDF (1 Page)'}
            </button>
          )}

          <button
            id="btn-print-primary"
            onClick={onPrint}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white rounded-lg font-semibold text-sm transition cursor-pointer"
          >
            <span>🖨️</span>
            Print Dialog
          </button>
        </div>
      </div>

      {/* Quick Group Presets */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Quick Presets:
        </span>
        <button
          onClick={() => handleLoadPreset('HUMANITIES')}
          className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-medium text-slate-700 shrink-0 cursor-pointer shadow-2xs"
        >
          Humanities (User Image)
        </button>
        <button
          onClick={() => handleLoadPreset('PRE_ENGINEERING')}
          className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-medium text-slate-700 shrink-0 cursor-pointer shadow-2xs"
        >
          Pre-Engineering
        </button>
        <button
          onClick={() => handleLoadPreset('PRE_MEDICAL')}
          className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-medium text-slate-700 shrink-0 cursor-pointer shadow-2xs"
        >
          Pre-Medical
        </button>
        <button
          onClick={() => handleLoadPreset('COMMERCE')}
          className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 font-medium text-slate-700 shrink-0 cursor-pointer shadow-2xs"
        >
          Commerce
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-100 px-2 pt-2 gap-1 text-sm font-semibold">
        <button
          id="tab-student"
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition cursor-pointer ${
            activeTab === 'student'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <User className="w-4 h-4" />
          1. Student & Photo
        </button>

        <button
          id="tab-subjects"
          onClick={() => setActiveTab('subjects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition cursor-pointer ${
            activeTab === 'subjects'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          2. Subjects & Marks ({data.subjects.length})
        </button>

        <button
          id="tab-footer"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-white text-emerald-700 border-t-2 border-emerald-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          3. Totals & Signatures
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-4 overflow-y-auto flex-1 space-y-6">
        {/* TAB 1: STUDENT & EXAM DETAILS + PHOTO */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            {/* Photo Upload Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Candidate Photo (Passport Size)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Photo Preview */}
                <div className="w-24 h-32 border-2 border-slate-700 rounded-sm bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center relative">
                  {data.candidatePhoto ? (
                    <img
                      src={data.candidatePhoto}
                      alt="Candidate"
                      className="w-full h-full object-cover grayscale contrast-115"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">No Photo</span>
                  )}
                </div>

                {/* Dropzone & Actions */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="flex-1 w-full border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-3 text-center transition bg-white"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="candidate-photo-input"
                  />
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    <p className="text-xs font-semibold text-slate-700">
                      Drag & Drop photo here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-emerald-700 underline font-bold cursor-pointer"
                      >
                        Browse file
                      </button>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WebP. Automatically fits the official frame.
                    </p>
                  </div>
                </div>

                {/* Reset button */}
                <button
                  type="button"
                  onClick={() => handleFieldChange('candidatePhoto', SAMPLE_CANDIDATE_PHOTO)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Reset to sample avatar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Photo
                </button>
              </div>
            </div>

            {/* Student Info Inputs Grid */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200">
                Student & Registration Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Name (Full Name)
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleFieldChange('name', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
                    placeholder="e.g. DOST MUHAMMAD"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={data.fatherName}
                    onChange={(e) => handleFieldChange('fatherName', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
                    placeholder="e.g. ZAHIM KHAN"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Roll No.
                  </label>
                  <input
                    type="text"
                    value={data.rollNo}
                    onChange={(e) => handleFieldChange('rollNo', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. 33454"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Marks Sheet No.
                  </label>
                  <input
                    type="text"
                    value={data.marksSheetNo}
                    onChange={(e) => handleFieldChange('marksSheetNo', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. 00197151-"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enrolment / Registration No
                  </label>
                  <input
                    type="text"
                    value={data.enrolmentNo}
                    onChange={(e) => handleFieldChange('enrolmentNo', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g. KMFD/HT/R-0008/2020"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Group / Faculty
                  </label>
                  <input
                    type="text"
                    value={data.group}
                    onChange={(e) => handleFieldChange('group', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
                    placeholder="e.g. HUMANITIES"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    College / Private Institution
                  </label>
                  <input
                    type="text"
                    value={data.college}
                    onChange={(e) => handleFieldChange('college', e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 uppercase"
                    placeholder="e.g. << PRIVATE >> or GOVT. DEGRE COLLEGE"
                  />
                </div>
              </div>
            </div>

            {/* Document Header Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 pb-1 border-b border-slate-200">
                Sheet Header & Serial
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Top Serial Code
                  </label>
                  <input
                    type="text"
                    value={data.serialNo}
                    onChange={(e) => handleFieldChange('serialNo', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono font-bold uppercase"
                    placeholder="e.g. A548012"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Examination Subheading
                  </label>
                  <input
                    type="text"
                    value={data.examSession}
                    onChange={(e) => handleFieldChange('examSession', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-semibold"
                    placeholder="e.g. ( Annual - 2025 )"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Barcode Value
                  </label>
                  <input
                    type="text"
                    value={data.barcodeValue}
                    onChange={(e) => handleFieldChange('barcodeValue', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md font-mono text-slate-700"
                    placeholder="e.g. 00197151-33454"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBJECTS & MARKS TABLE */}
        {activeTab === 'subjects' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Subject Marks Configuration
                </h3>
                <p className="text-[11px] text-slate-500">
                  Enter Part I, Part II, or Combined marks. Click 'Auto Calculate' to refresh totals & percentage.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAutoCalculate}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Auto Calculate Totals
                </button>
                <button
                  type="button"
                  onClick={addSubjectRow}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Subject
                </button>
              </div>
            </div>

            {/* Subject Rows List */}
            <div className="space-y-3">
              {data.subjects.map((sub, idx) => (
                <div
                  key={sub.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-bold text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={sub.subject}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'subject', e.target.value.toUpperCase())
                        }
                        className="font-bold text-slate-900 bg-white px-2 py-1 border border-slate-300 rounded flex-1 uppercase"
                        placeholder="SUBJECT NAME"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubjectRow(sub.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                      title="Remove subject"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Marks Inputs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <label className="block text-[10px] text-slate-500">Pt I Sec (Th)</label>
                      <input
                        type="text"
                        value={sub.part1SecTh}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'part1SecTh', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-mono"
                        placeholder="-"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500">Pt II Sec (Th)</label>
                      <input
                        type="text"
                        value={sub.part2SecTh}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'part2SecTh', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-mono"
                        placeholder="-"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold">Comb Max (Th)</label>
                      <input
                        type="text"
                        value={sub.combinedMaxTh}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'combinedMaxTh', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded text-center font-mono font-bold bg-white"
                        placeholder="200"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold">Comb Sec (Th)</label>
                      <input
                        type="text"
                        value={sub.combinedSecTh}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'combinedSecTh', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-300 rounded text-center font-mono font-bold bg-white"
                        placeholder="74"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500">% Percentage</label>
                      <input
                        type="text"
                        value={sub.percentage}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'percentage', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-mono font-bold"
                        placeholder="37"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500">Remarks</label>
                      <select
                        value={sub.remarks}
                        onChange={(e) =>
                          handleSubjectChange(sub.id, 'remarks', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-slate-200 rounded text-center font-semibold bg-white"
                      >
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="Ex">Ex</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TOTALS, SIGNATURES & ENDORSEMENT */}
        {activeTab === 'footer' && (
          <div className="space-y-6 text-xs">
            {/* Summary Row Details */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Total Summary & Aggregate Marks
                </h3>
                <button
                  type="button"
                  onClick={handleAutoCalculate}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Recalculate
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Max Marks I</label>
                  <input
                    type="text"
                    value={data.totals.maxMarks1}
                    onChange={(e) => handleTotalChange('maxMarks1', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Secured Marks I</label>
                  <input
                    type="text"
                    value={data.totals.secMarks1}
                    onChange={(e) => handleTotalChange('secMarks1', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Max Marks II</label>
                  <input
                    type="text"
                    value={data.totals.maxMarks2}
                    onChange={(e) => handleTotalChange('maxMarks2', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Secured Marks II</label>
                  <input
                    type="text"
                    value={data.totals.secMarks2}
                    onChange={(e) => handleTotalChange('secMarks2', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Total Max Marks
                  </label>
                  <input
                    type="text"
                    value={data.totals.totalMaxMarks}
                    onChange={(e) => handleTotalChange('totalMaxMarks', e.target.value)}
                    className="w-full px-2 py-1.5 border border-emerald-500 rounded font-mono font-bold bg-emerald-50/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Total Secured Marks
                  </label>
                  <input
                    type="text"
                    value={data.totals.totalSecMarks}
                    onChange={(e) => handleTotalChange('totalSecMarks', e.target.value)}
                    className="w-full px-2 py-1.5 border border-emerald-500 rounded font-mono font-bold bg-emerald-50/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Overall %</label>
                  <input
                    type="text"
                    value={data.totals.overallPercentage}
                    onChange={(e) => handleTotalChange('overallPercentage', e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Grade</label>
                  <input
                    type="text"
                    value={data.totals.grade}
                    onChange={(e) => handleTotalChange('grade', e.target.value.toUpperCase())}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded font-bold text-center uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Marks in Words
                </label>
                <input
                  type="text"
                  value={data.inWords}
                  onChange={(e) => handleFieldChange('inWords', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium italic"
                  placeholder="Four Hundred Thirty Eight Only"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Grace/Grade Raised Remark
                </label>
                <input
                  type="text"
                  value={data.graceNote}
                  onChange={(e) => handleFieldChange('graceNote', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
                  placeholder="*= Grade Raised by 02 Marks"
                />
              </div>
            </div>

            {/* Signatures & Settings */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Endorsements, Signatures & Date
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={data.issueDate}
                    onChange={(e) => handleFieldChange('issueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-medium"
                    placeholder="September 01, 2025"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={data.showWatermark}
                      onChange={(e) => handleFieldChange('showWatermark', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800">
                      Show Official BIEK Watermark Pattern
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="block font-semibold text-slate-800 mb-2">
                  Signature Stamps:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.preparedBySig}
                      onChange={(e) => handleFieldChange('preparedBySig', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Prepared By (IT Dept)</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.checkedBySig}
                      onChange={(e) => handleFieldChange('checkedBySig', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Checked By</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.controllerSig}
                      onChange={(e) => handleFieldChange('controllerSig', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-medium text-slate-700">Controller of Exams</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
