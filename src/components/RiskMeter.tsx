import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Copy, Check, ExternalLink, Info } from 'lucide-react';
import { ContractAnalysis } from '../types/legal';

interface RiskMeterProps {
  analysis: ContractAnalysis;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ analysis }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const flaggedClauses = analysis.clauses.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical');
  const safeClauses = analysis.clauses.filter(c => c.riskLevel === 'safe' || c.riskLevel === 'moderate');

  // Meter color logic
  let meterBg = 'bg-emerald-500';
  let meterTextColor = 'text-emerald-600 dark:text-emerald-400';
  let verdictText = 'Low Risk Agreement: Balanced terms aligned with consumer standards.';

  if (analysis.overallRiskScore >= 75) {
    meterBg = 'bg-red-500';
    meterTextColor = 'text-red-600 dark:text-red-400';
    verdictText = 'Critical Risk Detected: Contains aggressive, one-sided clauses that require renegotiation.';
  } else if (analysis.overallRiskScore >= 50) {
    meterBg = 'bg-amber-500';
    meterTextColor = 'text-amber-600 dark:text-amber-400';
    verdictText = 'Moderate Risk: Several non-standard liability covenants warrant attention.';
  }

  return (
    <div className="space-y-6">
      
      {/* Risk Score Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex-1 text-center md:text-left">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Step 2: Risk & Red Flag Detector
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              Contract Risk Assessment
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {verdictText}
            </p>
          </div>

          {/* Circular / Gauge Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[200px]">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
              Overall Risk Score
            </span>
            <div className={`text-4xl font-extrabold ${meterTextColor}`}>
              {analysis.overallRiskScore}<span className="text-base font-normal text-slate-400">/100</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${meterBg} transition-all duration-1000`}
                style={{ width: `${analysis.overallRiskScore}%` }}
              ></div>
            </div>
            <span className={`mt-2 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              analysis.overallRiskLevel === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
              analysis.overallRiskLevel === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
            }`}>
              {analysis.overallRiskLevel} Risk
            </span>
          </div>

        </div>
      </div>

      {/* Flagged Predatory Clauses */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            High-Risk & Predatory Clauses Identified ({flaggedClauses.length})
          </h4>
        </div>

        {flaggedClauses.length === 0 ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="font-semibold text-sm">No severe predatory clauses detected in this agreement.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedClauses.map((clause) => (
              <div
                key={clause.id}
                className="bg-white dark:bg-slate-900 border-l-4 border-l-red-500 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                      {clause.title}
                    </h5>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 rounded border border-red-200 dark:border-red-900">
                    Severity: {clause.riskScore}
                  </span>
                </div>

                {/* Why is it dangerous */}
                <div className="text-xs bg-red-50/60 dark:bg-red-950/20 p-3 rounded-xl text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/30">
                  <strong className="block mb-0.5 text-red-900 dark:text-red-200">Legal Risk Explanation:</strong>
                  {clause.riskReason}
                </div>

                {/* Verbatim quote */}
                <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl font-mono">
                  &ldquo;{clause.originalClause}&rdquo;
                </div>

                {/* Counter Proposal */}
                {clause.counterProposal && (
                  <div className="text-xs bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="block mb-0.5 text-emerald-800 dark:text-emerald-300">Recommended Renegotiation Language:</strong>
                      <span>{clause.counterProposal}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(clause.counterProposal!, clause.id)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-slate-700 shrink-0 font-medium flex items-center space-x-1"
                    >
                      {copiedId === clause.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === clause.id ? 'Copied' : 'Copy Counter-Clause'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
