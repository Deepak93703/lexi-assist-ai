import React, { useState } from 'react';
import { GitCompare, ArrowRight, ShieldCheck, Scale, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { compareDocumentsLocally } from '../services/compareEngine';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { DocumentComparisonResult } from '../types/legal';

export const DocumentCompare: React.FC = () => {
  const [doc1Text, setDoc1Text] = useState(SAMPLE_CONTRACTS[0].text);
  const [doc2Text, setDoc2Text] = useState(SAMPLE_CONTRACTS[0].comparisonCounterpart?.text || '');
  const [doc1Title, setDoc1Title] = useState('Landlord Standard Lease (Doc A)');
  const [doc2Title, setDoc2Title] = useState('Tenant-Protected Revised Lease (Doc B)');
  
  const [result, setResult] = useState<DocumentComparisonResult>(() =>
    compareDocumentsLocally(SAMPLE_CONTRACTS[0].text, SAMPLE_CONTRACTS[0].comparisonCounterpart!.text, 'Landlord Standard Lease', 'Fair Housing Revised Draft')
  );

  const handleCompare = () => {
    const res = compareDocumentsLocally(doc1Text, doc2Text, doc1Title, doc2Title);
    setResult(res);
  };

  const handleLoadSamplePair = (sampleId: string) => {
    const sample = SAMPLE_CONTRACTS.find(s => s.id === sampleId);
    if (sample && sample.comparisonCounterpart) {
      setDoc1Text(sample.text);
      setDoc2Text(sample.comparisonCounterpart.text);
      setDoc1Title(`${sample.title} (Original)`);
      setDoc2Title(sample.comparisonCounterpart.title);
      setResult(compareDocumentsLocally(sample.text, sample.comparisonCounterpart.text, sample.title, sample.comparisonCounterpart.title));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Step 3: Compare & Contrast
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Multi-Document Comparison & Diff Engine</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare two versions of a contract to detect hidden concessions, power shifts, and liability alterations.
            </p>
          </div>

          {/* Quick preset selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Load Comparison Pair:</span>
            <select
              aria-label="Load comparison contract pair"
              onChange={(e) => handleLoadSamplePair(e.target.value)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="residential_lease">Lease: Landlord vs Fair Tenant</option>
              <option value="freelance_contract">Contractor: Net-90 vs Balanced MSA</option>
              <option value="mutual_nda">NDA: One-Way Perpetual vs Mutual 2-Yr</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800">
        <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
          <Scale className="w-4 h-4" />
          <span>AI Power Balance & Concession Verdict</span>
        </div>
        <h4 className="text-lg font-bold mb-2">
          {result.overallPowerShift}
        </h4>
        <p className="text-xs text-slate-300">
          {result.summaryOfKeyDifferences}
        </p>
      </div>

      {/* Diff Table List */}
      <div className="space-y-4">
        {result.diffs.map((diff, index) => {
          let badgeColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
          if (diff.changeType === 'added') badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300';
          if (diff.changeType === 'removed') badgeColor = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300';
          if (diff.changeType === 'modified') badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300';

          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {diff.changeType}
                  </span>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                    {diff.sectionTitle}
                  </h5>
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Favors: {diff.imbalanceAnalysis.favorsParty}
                </div>
              </div>

              {/* Side-by-side columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                
                {/* Doc 1 */}
                <div className="p-3 bg-red-50/40 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                  <span className="font-sans font-bold text-[11px] text-red-800 dark:text-red-400 block mb-1">
                    {result.doc1Title}:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {diff.doc1Clause}
                  </p>
                </div>

                {/* Doc 2 */}
                <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <span className="font-sans font-bold text-[11px] text-emerald-800 dark:text-emerald-400 block mb-1">
                    {result.doc2Title}:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {diff.doc2Clause}
                  </p>
                </div>

              </div>

              {/* Explanation */}
              <div className="text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Legal Concession Analysis: </strong>
                  {diff.imbalanceAnalysis.explanation}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
