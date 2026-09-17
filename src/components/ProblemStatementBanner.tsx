import React, { useState } from 'react';
import { Award, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export const ProblemStatementBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-b border-indigo-800/60 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          
          <div className="flex items-start sm:items-center space-x-3">
            <div className="p-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase tracking-wider font-bold text-blue-300">
                  Google for Developers × Hack2skill PromptWars Virtual Challenge:
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.2 rounded-full font-mono">
                  Official Submission
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-100">
                AI for Legal Assistance & Access
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1.5 text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1 rounded-md transition-colors"
          >
            <span>{isExpanded ? 'Hide Challenge Rubric' : 'View Problem Statement & Rubrics'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-indigo-800/80 text-xs text-slate-300 space-y-3 animate-fadeIn">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <p className="italic text-slate-200">
                &ldquo;Legal information can often be complex, difficult to understand, and challenging to navigate without professional assistance. Build a GenAI-powered solution that makes legal information and basic legal assistance more accessible by helping users <strong>understand</strong>, <strong>compare</strong>, and <strong>navigate</strong> legal documents and information.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-start space-x-2 bg-blue-950/40 p-2.5 rounded-lg border border-blue-800/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">1. Understand</strong>
                  <span>Demystifies legalese into simple plain English with ELI5 toggle and key obligations breakdown.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-indigo-950/40 p-2.5 rounded-lg border border-indigo-800/40">
                <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">2. Compare & Audit Risk</strong>
                  <span>Side-by-side diffing showing power shifts between drafts + 0-100 risk score and predatory clause alerts.</span>
                </div>
              </div>

              <div className="flex items-start space-x-2 bg-purple-950/40 p-2.5 rounded-lg border border-purple-800/40">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-white block font-medium">3. Navigate & Action</strong>
                  <span>Grounded Gemini RAG Chatbot with exact clause citations + 1-click formal legal demand letter drafts.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
