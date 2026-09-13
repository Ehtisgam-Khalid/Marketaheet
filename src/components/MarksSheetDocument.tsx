import React from 'react';
import { MarksSheetData } from '../types';
import { BiekLogo } from './BiekLogo';
import { Barcode } from './Barcode';
import {
  PreparedBySignature,
  CheckedBySignature,
  ControllerSignature,
} from './SignatureStamps';

interface MarksSheetDocumentProps {
  data: MarksSheetData;
  scale?: number;
}

export const MarksSheetDocument: React.FC<MarksSheetDocumentProps> = ({
  data,
  scale = 1,
}) => {
  return (
    <div
      id="printable-marksheet"
      className="relative bg-white text-black font-sans shadow-2xl mx-auto overflow-hidden print:shadow-none print:m-0 print:border-none print:w-full select-text"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '10mm 12mm 12mm 12mm',
        boxSizing: 'border-box',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {/* Background Watermark Layer (Optional Toggle) */}
      {data.showWatermark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-[0.035] flex flex-col justify-around rotate-[-25deg] scale-125 select-none">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="text-[13px] font-bold tracking-widest whitespace-nowrap text-slate-800 uppercase"
            >
              BOARD OF INTERMEDIATE EDUCATION KARACHI &bull; STATEMENT OF MARKS &bull; BOARD OF INTERMEDIATE EDUCATION KARACHI &bull;
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <BiekLogo size={420} />
          </div>
        </div>
      )}

      {/* Sheet Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[273mm]">
        {/* TOP SECTION */}
        <div>
          {/* Header Section: Serial Number & Centered Official Logo */}
          <div className="relative mb-2">
            {/* Serial Number on the top left */}
            <div className="absolute left-0 top-1">
              <span className="font-mono text-xl md:text-2xl font-bold tracking-wider text-black">
                {data.serialNo || 'A548012'}
              </span>
            </div>

            {/* Official Logo centered in normal layout flow */}
            <div className="flex flex-col items-center justify-center pt-0 pb-1">
              <BiekLogo size={80} />
            </div>
          </div>

          {/* Board Title & Examination Heading */}
          <div className="text-center mb-2">
            <h1
              className="text-[22px] md:text-[23px] font-black tracking-wide uppercase text-black font-serif leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cinzel', serif" }}
            >
              BOARD OF INTERMEDIATE EDUCATION KARACHI
            </h1>
            <p className="text-[13px] font-bold text-black tracking-wide mt-0.5 uppercase">
              {data.examTitle} {data.examSession}
            </p>
            <div className="mt-1">
              <span
                className="inline-block text-[21px] font-bold text-black underline underline-offset-4 decoration-2 font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Statement of Marks
              </span>
            </div>
          </div>

          {/* STUDENT DETAILS & PHOTO SECTION */}
          <div className="flex justify-between items-start mt-3 mb-2 px-1">
            {/* Left Column: Student Details */}
            <div className="flex-1 pr-4">
              <table className="w-full text-[13.5px] leading-relaxed border-collapse">
                <tbody>
                  <tr className="align-baseline">
                    <td className="w-56 font-bold text-black py-0.5">Marks Sheet No.</td>
                    <td className="w-5 font-bold text-black">:</td>
                    <td className="font-mono font-bold text-black tracking-wider text-[14.5px]">
                      {data.marksSheetNo}
                    </td>
                  </tr>
                  <tr className="align-baseline">
                    <td className="font-bold text-black py-0.5">Group</td>
                    <td className="font-bold text-black">:</td>
                    <td className="font-bold text-black uppercase tracking-wide">
                      {data.group}
                    </td>
                  </tr>
                  <tr className="align-baseline">
                    <td className="font-bold text-black py-0.5">Roll No.</td>
                    <td className="font-bold text-black">:</td>
                    <td className="font-mono font-bold text-black tracking-wider text-[14.5px]">
                      {data.rollNo}
                    </td>
                  </tr>
                  <tr className="align-baseline">
                    <td className="font-bold text-black py-0.5">Enrolment /Registration No</td>
                    <td className="font-bold text-black">:</td>
                    <td className="font-mono font-bold text-black tracking-wider text-[13.5px]">
                      {data.enrolmentNo}
                    </td>
                  </tr>
                  <tr className="align-baseline">
                    <td className="font-bold text-black py-0.5">Name</td>
                    <td className="font-bold text-black">:</td>
                    <td className="font-bold text-black uppercase tracking-wide">
                      {data.name}
                    </td>
                  </tr>
                  <tr className="align-baseline">
                    <td className="font-bold text-black py-0.5">Father's Name</td>
                    <td className="font-bold text-black">:</td>
                    <td className="font-bold text-black uppercase tracking-wide">
                      {data.fatherName}
                    </td>
                  </tr>
                  <tr className="align-baseline">
                    <td className="font-bold text-black py-0.5">College / Private</td>
                    <td className="font-bold text-black">:</td>
                    <td className="font-bold text-black uppercase tracking-wide">
                      {data.college}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Column: Candidate Photo Frame */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-[102px] h-[126px] overflow-hidden flex items-center justify-center">
                {data.candidatePhoto ? (
                  <img
                    src={data.candidatePhoto}
                    alt="Candidate"
                    className="w-full h-full object-cover grayscale contrast-115"
                  />
                ) : (
                  <div className="text-[10px] text-center text-slate-400 font-bold uppercase">
                    Photo Space
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BARCODE SECTION */}
          <div className="my-1.5 px-1">
            <Barcode value={data.barcodeValue || `${data.marksSheetNo}${data.rollNo}`} />
          </div>

          {/* MARKS TABLE */}
          <div className="mt-1 border-2 border-black overflow-hidden bg-white">
            <table className="w-full border-collapse text-[11.5px]">
              <thead>
                {/* Level 1 Table Header */}
                <tr className="border-b-2 border-black bg-white text-black font-bold">
                  <th
                    rowSpan={3}
                    className="border-r-2 border-black px-2 py-1 text-center align-middle font-bold text-[13px] w-[32%]"
                  >
                    Subject
                  </th>
                  <th
                    colSpan={4}
                    className="border-r-2 border-black px-1 py-0.5 text-center font-bold text-[12px]"
                  >
                    Part I Marks
                  </th>
                  <th
                    colSpan={4}
                    className="border-r-2 border-black px-1 py-0.5 text-center font-bold text-[12px]"
                  >
                    Part II Marks
                  </th>
                  <th
                    colSpan={4}
                    className="border-r-2 border-black px-1 py-0.5 text-center font-bold text-[12px]"
                  >
                    Combined
                  </th>
                  <th
                    rowSpan={3}
                    className="border-r-2 border-black px-1 py-1 text-center align-middle font-bold text-[13px] w-[6%]"
                  >
                    %
                  </th>
                  <th
                    rowSpan={3}
                    className="px-1 py-1 text-center align-middle font-bold text-[12px] w-[10%]"
                  >
                    Remarks
                  </th>
                </tr>

                {/* Level 2 Sub-Headers: Max. & Secured */}
                <tr className="border-b border-black text-[11px] font-bold">
                  {/* Part I */}
                  <th colSpan={2} className="border-r border-black py-0.5 text-center">
                    Max.
                  </th>
                  <th colSpan={2} className="border-r-2 border-black py-0.5 text-center">
                    Secured
                  </th>
                  {/* Part II */}
                  <th colSpan={2} className="border-r border-black py-0.5 text-center">
                    Max.
                  </th>
                  <th colSpan={2} className="border-r-2 border-black py-0.5 text-center">
                    Secured
                  </th>
                  {/* Combined */}
                  <th colSpan={2} className="border-r border-black py-0.5 text-center">
                    Max.
                  </th>
                  <th colSpan={2} className="border-r-2 border-black py-0.5 text-center">
                    Secured
                  </th>
                </tr>

                {/* Level 3 Sub-Headers: Th. & Pr. */}
                <tr className="border-b-2 border-black text-[10px] font-bold">
                  {/* Part I */}
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Th.</th>
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Pr.</th>
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Th.</th>
                  <th className="border-r-2 border-black py-0.5 text-center w-[4.5%]">Pr.</th>

                  {/* Part II */}
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Th.</th>
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Pr.</th>
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Th.</th>
                  <th className="border-r-2 border-black py-0.5 text-center w-[4.5%]">Pr.</th>

                  {/* Combined */}
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Th.</th>
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Pr.</th>
                  <th className="border-r border-black py-0.5 text-center w-[4.5%]">Th.</th>
                  <th className="border-r-2 border-black py-0.5 text-center w-[4.5%]">Pr.</th>
                </tr>
              </thead>

              {/* SUBJECT ROWS */}
              <tbody className="divide-y divide-black font-normal text-[11px]">
                {data.subjects.map((row) => (
                  <tr key={row.id} className="h-6">
                    {/* Subject Name */}
                    <td className="border-r-2 border-black px-2 py-0.5 text-left font-bold uppercase tracking-tight truncate max-w-[210px]">
                      {row.subject}
                    </td>

                    {/* Part I */}
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.part1MaxTh}
                    </td>
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.part1MaxPr}
                    </td>
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.part1SecTh}
                    </td>
                    <td className="border-r-2 border-black text-center font-mono py-0.5">
                      {row.part1SecPr}
                    </td>

                    {/* Part II */}
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.part2MaxTh}
                    </td>
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.part2MaxPr}
                    </td>
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.part2SecTh}
                    </td>
                    <td className="border-r-2 border-black text-center font-mono py-0.5">
                      {row.part2SecPr}
                    </td>

                    {/* Combined */}
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.combinedMaxTh}
                    </td>
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.combinedMaxPr}
                    </td>
                    <td className="border-r border-black text-center font-mono py-0.5">
                      {row.combinedSecTh}
                    </td>
                    <td className="border-r-2 border-black text-center font-mono py-0.5">
                      {row.combinedSecPr}
                    </td>

                    {/* Percentage */}
                    <td className="border-r-2 border-black text-center font-mono py-0.5 font-bold">
                      {row.percentage}
                    </td>

                    {/* Remarks */}
                    <td className="text-center py-0.5 font-semibold text-[10.5px]">
                      {row.remarks}
                    </td>
                  </tr>
                ))}

                {/* TOTAL SUMMARY ROW */}
                <tr className="border-t-2 border-black bg-white font-bold text-[11px] h-7">
                  <td className="border-r-2 border-black px-2 py-1 text-center font-bold text-[13px]">
                    Total
                  </td>

                  {/* Part I Total Sub-Columns */}
                  <td
                    colSpan={2}
                    className="border-r border-black text-center py-0.5 font-semibold text-[9.5px] leading-tight"
                  >
                    <div>Max Marks I</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.maxMarks1}
                    </div>
                  </td>
                  <td
                    colSpan={2}
                    className="border-r-2 border-black text-center py-0.5 font-semibold text-[9.5px] leading-tight"
                  >
                    <div>Secured Marks I</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.secMarks1}
                    </div>
                  </td>

                  {/* Part II Total Sub-Columns */}
                  <td
                    colSpan={2}
                    className="border-r border-black text-center py-0.5 font-semibold text-[9.5px] leading-tight"
                  >
                    <div>Max Marks II</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.maxMarks2}
                    </div>
                  </td>
                  <td
                    colSpan={2}
                    className="border-r-2 border-black text-center py-0.5 font-semibold text-[9.5px] leading-tight"
                  >
                    <div>Secured Marks II</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.secMarks2}
                    </div>
                  </td>

                  {/* Combined Total Sub-Columns */}
                  <td
                    colSpan={2}
                    className="border-r border-black text-center py-0.5 font-semibold text-[9.5px] leading-tight"
                  >
                    <div>Total Max. Marks</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.totalMaxMarks}
                    </div>
                  </td>
                  <td
                    colSpan={2}
                    className="border-r-2 border-black text-center py-0.5 font-semibold text-[9.5px] leading-tight"
                  >
                    <div>Total Sec. Marks</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.totalSecMarks}
                    </div>
                  </td>

                  {/* Overall % */}
                  <td className="border-r-2 border-black text-center py-0.5 font-semibold text-[9px] leading-tight">
                    <div>Over All %</div>
                    <div className="font-mono text-[11px] font-bold mt-0.5">
                      {data.totals.overallPercentage}
                    </div>
                  </td>

                  {/* Grade */}
                  <td className="text-center py-0.5 font-semibold text-[10px] leading-tight">
                    <div>Grade</div>
                    <div className="font-bold text-[13px] mt-0.5">
                      {data.totals.grade}
                    </div>
                  </td>
                </tr>

                {/* IN WORDS ROW */}
                <tr className="border-t border-black bg-white text-[11.5px]">
                  <td className="border-r-2 border-black px-2 py-1 text-center font-bold">
                    In Words
                  </td>
                  <td colSpan={13} className="px-4 py-1 text-center font-bold italic tracking-wide">
                    {data.inWords}
                  </td>
                </tr>

                {/* GRACE / GRADE RAISED ROW */}
                <tr className="border-t border-black bg-white text-[11px]">
                  <td className="border-r-2 border-black px-2 py-0.5 text-center font-bold">
                    Grace/Grade Raised
                  </td>
                  <td colSpan={13} className="px-3 py-0.5 text-left font-semibold">
                    {data.graceNote}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM SECTION: E. & O.E., SIGNATURES & DATE */}
        <div className="mt-8 pt-4">
          {/* E. & O.E. Tag */}
          <div className="flex justify-end pr-10 mb-2">
            <span className="font-bold text-[13px] tracking-widest text-black">
              E. & O.E.
            </span>
          </div>

          {/* SIGNATURES ROW */}
          <div className="grid grid-cols-3 items-end gap-4 px-2">
            {/* Prepared By IT Department */}
            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center mb-1">
                {data.preparedBySig && <PreparedBySignature />}
              </div>
              <div className="w-full border-t-2 border-black pt-1 text-center">
                <span className="font-bold text-[12px] uppercase text-black block tracking-tight">
                  Prepared By IT Department
                </span>
              </div>
            </div>

            {/* Empty Center Spacer / Checked By */}
            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center mb-1">
                {data.checkedBySig && <CheckedBySignature />}
              </div>
              <div className="w-full max-w-[180px] border-t-2 border-black pt-1 text-center">
                <span className="font-bold text-[12px] uppercase text-black block tracking-tight">
                  Checked By
                </span>
              </div>
            </div>

            {/* Controller of Examinations */}
            <div className="flex flex-col items-center">
              <div className="h-12 flex items-end justify-center mb-1">
                {data.controllerSig && <ControllerSignature />}
              </div>
              <div className="w-full border-t-2 border-black pt-1 text-center">
                <span className="font-black text-[12px] uppercase text-black block tracking-tight">
                  CONTROLLER OF EXAMINATIONS
                </span>
              </div>
            </div>
          </div>

          {/* DATE ROW */}
          <div className="flex justify-between items-center mt-6 px-2 text-[12.5px] font-bold">
            <div>{/* Left spacer */}</div>
            <div className="pr-4">
              <span>Date : </span>
              <span className="font-bold">{data.issueDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
