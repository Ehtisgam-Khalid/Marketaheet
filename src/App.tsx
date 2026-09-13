import { useState, useEffect } from 'react';
import { MarksSheetData } from './types';
import { DEFAULT_MARKS_SHEET } from './data/defaultData';
import { MarksSheetDocument } from './components/MarksSheetDocument';
import { EditorForm } from './components/EditorForm';
import { downloadMarksheetPDF } from './utils/downloadPdf';
import {
  Printer,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  Eye,
  Edit3,
  Download,
  Info,
  Loader2,
} from 'lucide-react';

export default function App() {
  const [data, setData] = useState<MarksSheetData>(() => {
    // Try to load saved data from localStorage if available
    try {
      const saved = localStorage.getItem('biek_marks_sheet_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_MARKS_SHEET;
  });

  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [zoomScale, setZoomScale] = useState<number>(0.92);
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('biek_marks_sheet_data', JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  // Adjust zoom automatically on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setZoomScale(0.48);
      } else if (window.innerWidth < 1200) {
        setZoomScale(0.72);
      } else {
        setZoomScale(0.9);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const fileName = `BIEK_Marksheet_${data.rollNo || '33762'}.pdf`;
      await downloadMarksheetPDF('printable-marksheet', fileName);
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all fields to original uploaded image data (DOST MUHAMMAD)?')) {
      setData(DEFAULT_MARKS_SHEET);
      try {
        localStorage.removeItem('biek_marks_sheet_data');
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* TOP APPLICATION BAR (Hidden in print) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Document Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
              <span className="text-xl">📜</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  BIEK Karachi Marks Sheet Generator
                </h1>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Exact Replica
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Board of Intermediate Education Karachi &bull; Statement of Marks &bull; Print Ready (A4)
              </p>
            </div>
          </div>

          {/* View Mode & Actions */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* View Mode Switcher */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-0.5 hidden sm:flex items-center gap-0.5">
              <button
                id="btn-view-split"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Split View
              </button>
              <button
                id="btn-view-edit"
                onClick={() => setViewMode('edit')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'edit'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editor
              </button>
              <button
                id="btn-view-preview"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Document
              </button>
            </div>

            {/* Reset to Original */}
            <button
              id="btn-reset-data"
              onClick={handleReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium transition cursor-pointer"
              title="Reset fields to the image sample"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Data</span>
            </button>

            {/* Download 1-Page PDF CTA */}
            <button
              id="btn-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold transition shadow-md cursor-pointer text-sm disabled:opacity-50"
              title="Download clean 1-page PDF without borders or headers"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : 'Download PDF (1 Page)'}</span>
            </button>

            {/* Print CTA */}
            <button
              id="btn-print-header"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 text-white font-bold transition shadow-xs cursor-pointer text-sm"
              title="Print directly or save through browser print dialog"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dialog</span>
            </button>
          </div>
        </div>
      </header>

      {/* Info Notice Banner */}
      {showInfoBanner && (
        <div className="no-print bg-emerald-950/70 border-b border-emerald-800/60 px-4 py-2 text-xs text-emerald-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Exact Match:</strong> All fields, student credentials, subjects table, candidate photo box, barcode, and signatures match the official Karachi Intermediate Board format. Upload your photo and click <strong>Print</strong>.
              </span>
            </div>
            <button
              onClick={() => setShowInfoBanner(false)}
              className="text-emerald-400 hover:text-white text-base leading-none px-1 cursor-pointer"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-x-hidden">
        <div className="max-w-[1700px] mx-auto">
          <div
            className={`grid gap-6 ${
              viewMode === 'split'
                ? 'grid-cols-1 lg:grid-cols-12'
                : viewMode === 'edit'
                ? 'grid-cols-1 max-w-4xl mx-auto'
                : 'grid-cols-1'
            }`}
          >
            {/* LEFT PANE: FORM EDITOR (Hidden in preview-only mode and print) */}
            {viewMode !== 'preview' && (
              <div
                className={`no-print ${
                  viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'w-full'
                }`}
              >
                <div className="sticky top-20">
                  <EditorForm
                    data={data}
                    onChange={setData}
                    onPrint={handlePrint}
                    onDownloadPdf={handleDownloadPdf}
                    isDownloading={isDownloading}
                  />
                </div>
              </div>
            )}

            {/* RIGHT PANE: DOCUMENT PREVIEW */}
            {viewMode !== 'edit' && (
              <div
                className={`flex flex-col items-center ${
                  viewMode === 'split'
                    ? 'lg:col-span-6 xl:col-span-7'
                    : 'w-full max-w-5xl mx-auto'
                }`}
              >
                {/* Preview Toolbar (Hidden in print) */}
                <div className="no-print w-full flex items-center justify-between bg-slate-800/90 border border-slate-700/80 rounded-t-xl px-4 py-2.5 mb-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="font-semibold text-white">Document Preview:</span>
                    <span className="text-[11px] text-slate-400">
                      Standard A4 (210mm &times; 297mm)
                    </span>
                  </div>

                  {/* Zoom Controls & Quick Download */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium cursor-pointer mr-2 disabled:opacity-50"
                      title="Download 1-Page PDF directly"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{isDownloading ? 'Saving...' : 'Download PDF'}</span>
                    </button>

                    <button
                      onClick={() => setZoomScale((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-slate-300 w-12 text-center">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale((prev) => Math.min(1.4, Number((prev + 0.1).toFixed(2))))}
                      className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setZoomScale(1)}
                      className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium cursor-pointer ml-1"
                      title="100% Actual Size"
                    >
                      100%
                    </button>
                  </div>
                </div>

                {/* Document Paper Container */}
                <div className="w-full flex justify-center overflow-x-auto pb-12 pt-2 print:p-0 print:m-0 print:overflow-visible">
                  <div className="print-only-sheet">
                    <MarksSheetDocument data={data} scale={zoomScale} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER BAR (Hidden in print) */}
      <footer className="no-print bg-slate-950 border-t border-slate-800/80 py-3 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Board of Intermediate Education Karachi (BIEK) Statement of Marks Generator &bull; Designed for print on A4 paper
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              Direct Print
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
