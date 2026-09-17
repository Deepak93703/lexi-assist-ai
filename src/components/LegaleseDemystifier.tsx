import React, { useState } from 'react';
import { BookOpen, Volume2, VolumeX, Shield, Calendar, DollarSign, CheckCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { ContractAnalysis, ReadingLevel } from '../types/legal';

interface LegaleseDemystifierProps {
  analysis: ContractAnalysis;
}

export const LegaleseDemystifier: React.FC<LegaleseDemystifierProps> = ({ analysis }) => {
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>('eli5');
  const [expandedClauseId, setExpandedClauseId] = useState<string | null>(analysis.clauses[0]?.id || null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Executive Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Step 1: Understand
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Plain-English Executive Summary</span>
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio Read-Aloud */}
            <button
              onClick={() => toggleSpeak(analysis.executiveSummary[readingLevel])}
              className={`p-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                isSpeaking
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title="Read Summary Aloud"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen Aloud'}</span>
            </button>

            {/* Reading Level Toggle */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setReadingLevel('eli5')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  readingLevel === 'eli5'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Simple (ELI5)
              </button>
              <button
                onClick={() => setReadingLevel('professional')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  readingLevel === 'professional'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Professional
              </button>
            </div>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
          {analysis.executiveSummary[readingLevel]}
        </p>
      </div>

      {/* 3 Pillars: Obligations, Dates, Financials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Obligations */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 mb-3 text-blue-600 dark:text-blue-400">
            <CheckCircle className="w-5 h-5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Key Obligations
            </h4>
          </div>
          <div className="space-y-3">
            {analysis.keyObligations.map((item, idx) => (
              <div key={idx} className="text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-blue-700 dark:text-blue-400 block mb-1">
                  {item.party}
                </span>
                <p className="text-slate-600 dark:text-slate-300 mb-1">{item.obligation}</p>
                {item.deadlineOrFrequency && (
                  <span className="text-[11px] text-slate-400">Timeline: {item.deadlineOrFrequency}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Critical Dates */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 mb-3 text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Crucial Deadlines
            </h4>
          </div>
          <div className="space-y-3">
            {analysis.criticalDates.map((item, idx) => (
              <div key={idx} className="text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1">
                  {item.event}
                </span>
                <p className="text-slate-700 dark:text-slate-200 font-mono text-[11px] mb-1">{item.dateOrTimeline}</p>
                {item.consequence && (
                  <span className="text-[11px] text-red-500 dark:text-red-400">Warning: {item.consequence}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Financial Liabilities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2 mb-3 text-emerald-600 dark:text-emerald-400">
            <DollarSign className="w-5 h-5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Financial Liabilities
            </h4>
          </div>
          <div className="space-y-3">
            {analysis.financialLiabilities.map((item, idx) => (
              <div key={idx} className="text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1">
                  {item.item}
                </span>
                <p className="text-slate-900 dark:text-white font-bold text-xs mb-1">{item.amountOrCalculation}</p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.terms}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Clause-by-Clause Demystification Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Clause-by-Clause Translation ({analysis.clauses.length} Sections)
        </h3>

        <div className="space-y-3">
          {analysis.clauses.map((clause) => {
            const isExpanded = expandedClauseId === clause.id;
            const isHighRisk = clause.riskLevel === 'high' || clause.riskLevel === 'critical';

            return (
              <div
                key={clause.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isHighRisk
                    ? 'border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40'
                }`}
              >
                <button
                  onClick={() => setExpandedClauseId(isExpanded ? null : clause.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      clause.riskLevel === 'critical'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300'
                        : clause.riskLevel === 'high'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    }`}>
                      {clause.riskLevel}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {clause.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span className="text-xs">{clause.pageOrSection}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3 text-xs border-t border-slate-100 dark:border-slate-800">
                    
                    {/* Simplified Translation */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <span className="font-semibold text-blue-700 dark:text-blue-400 block mb-1">
                        Plain English Meaning ({readingLevel === 'eli5' ? 'Simple ELI5' : 'Professional'}):
                      </span>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {clause.simplifiedExplanation[readingLevel]}
                      </p>
                    </div>

                    {/* Original Raw Legalese */}
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-500 uppercase text-[10px]">
                          Original Legal Text:
                        </span>
                        <button
                          onClick={() => copyToClipboard(clause.originalClause, clause.id)}
                          className="text-slate-400 hover:text-slate-600 flex items-center space-x-1 text-[11px]"
                        >
                          {copiedId === clause.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === clause.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed italic">
                        &ldquo;{clause.originalClause}&rdquo;
                      </p>
                    </div>

                    {/* Counter Proposal if Risk */}
                    {clause.counterProposal && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <span className="font-semibold text-emerald-800 dark:text-emerald-300 block mb-1">
                          Recommended Counter-Proposal Language:
                        </span>
                        <p className="text-slate-700 dark:text-slate-200 font-mono text-[11px]">
                          {clause.counterProposal}
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
