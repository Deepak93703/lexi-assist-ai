import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Building2, Briefcase, FileCode } from 'lucide-react';
import { SAMPLE_CONTRACTS, SampleContract } from '../data/sampleContracts';

interface DocumentIntakeProps {
  onDocumentLoaded: (text: string, title: string, sampleId?: string) => void;
  currentTitle: string;
  isAnalyzing: boolean;
}

export const DocumentIntake: React.FC<DocumentIntakeProps> = ({
  onDocumentLoaded,
  currentTitle,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('residential_lease');

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onDocumentLoaded(content, file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = (sample: SampleContract) => {
    setSelectedSampleId(sample.id);
    onDocumentLoaded(sample.text, sample.title, sample.id);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Document Intake & Pre-loaded Templates</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload any contract (PDF, DOCX, TXT) or choose a pre-loaded sample agreement to test immediately.
          </p>
        </div>

        {currentTitle && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl text-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
              Active: {currentTitle}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Drag & Drop Box (5 Cols) */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`lg:col-span-5 border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept=".txt,.md,.pdf,.docx,.doc"
            className="hidden"
          />
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Drag & drop contract here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Supports TXT, Markdown, legal contracts up to 50 pages
          </p>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-slate-700"
          >
            Browse from Device
          </button>
        </div>

        {/* 1-Click Sample Contracts (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Or Test with 1-Click Curated Legal Templates:
              </span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Pre-filled with real clauses</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_CONTRACTS.map((sample) => {
                const isSelected = selectedSampleId === sample.id && currentTitle === sample.title;
                const Icon = sample.id === 'residential_lease'
                  ? Building2
                  : sample.id === 'freelance_contract'
                  ? Briefcase
                  : FileCode;

                return (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="p-1.5 rounded-lg bg-blue-100/70 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {sample.category.split('/')[0]}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                      {sample.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                      {sample.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero data retained on servers (Client privacy protected)</span>
            </span>
            {isAnalyzing && (
              <span className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Gemini Analyzing Contract...</span>
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
