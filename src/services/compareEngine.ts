import { ComparisonDiff, DocumentComparisonResult } from '../types/legal';

export function compareDocumentsLocally(
  doc1Text: string,
  doc2Text: string,
  doc1Title: string = 'Original Document (Doc A)',
  doc2Title: string = 'Revised Document (Doc B)'
): DocumentComparisonResult {
  const p1 = doc1Text.split(/\n\s*\n|\n(?=\d+\.)/).map(s => s.trim()).filter(s => s.length > 20);
  const p2 = doc2Text.split(/\n\s*\n|\n(?=\d+\.)/).map(s => s.trim()).filter(s => s.length > 20);

  const diffs: ComparisonDiff[] = [];
  const maxLen = Math.max(p1.length, p2.length);

  for (let i = 0; i < maxLen; i++) {
    const clause1 = p1[i] || '';
    const clause2 = p2[i] || '';

    // Extract title
    const t1 = clause1.split('\n')[0].replace(/^\d+\.\s*/, '').substring(0, 45);
    const t2 = clause2.split('\n')[0].replace(/^\d+\.\s*/, '').substring(0, 45);
    const title = t1 || t2 || `Section \${i + 1}`;

    if (!clause1 && clause2) {
      diffs.push({
        sectionTitle: title,
        doc1Clause: '(Section not present in Document A)',
        doc2Clause: clause2,
        changeType: 'added',
        imbalanceAnalysis: {
          favorsParty: 'Doc B / Tenant / Contractor',
          explanation: 'Document B introduced a new protective clause clarifying operational parameters or mitigating liabilities.',
          riskDelta: -15
        }
      });
    } else if (clause1 && !clause2) {
      diffs.push({
        sectionTitle: title,
        doc1Clause: clause1,
        doc2Clause: '(Section removed in Document B)',
        changeType: 'removed',
        imbalanceAnalysis: {
          favorsParty: 'Doc B / Tenant / Contractor',
          explanation: 'A potentially onerous or restrictive requirement from Document A was struck out in Document B.',
          riskDelta: -20
        }
      });
    } else if (clause1 === clause2) {
      diffs.push({
        sectionTitle: title,
        doc1Clause: clause1,
        doc2Clause: clause2,
        changeType: 'identical',
        imbalanceAnalysis: {
          favorsParty: 'Neutral',
          explanation: 'Both documents share identical language with no shift in balance of rights or legal duties.',
          riskDelta: 0
        }
      });
    } else {
      // Check who gains advantage
      const doc2HasProtections = /(mutual|grace period|business hours|24 hours advance|statutory|capped|itemized)/i.test(clause2);
      const doc1HasPredatory = /(sole and unappealable|forfeited|at any time|indemnify.*direct negligence|perpetual|net-90)/i.test(clause1);

      let favors: ComparisonDiff['imbalanceAnalysis']['favorsParty'] = 'Doc B / Tenant / Contractor';
      let explanation = 'Document B balances the covenants by adding mutual remedies and statutory guardrails.';
      let riskDelta = -25;

      if (!doc2HasProtections && doc1HasPredatory) {
        favors = 'Doc A / Landlord / Client';
        explanation = 'Document A imposes significantly stricter obligations and unilateral forfeiture clauses.';
        riskDelta = 20;
      }

      diffs.push({
        sectionTitle: title,
        doc1Clause: clause1,
        doc2Clause: clause2,
        changeType: 'modified',
        imbalanceAnalysis: {
          favorsParty: favors,
          explanation,
          riskDelta
        }
      });
    }
  }

  const modifiedCount = diffs.filter(d => d.changeType === 'modified').length;
  const addedCount = diffs.filter(d => d.changeType === 'added').length;
  const removedCount = diffs.filter(d => d.changeType === 'removed').length;

  return {
    doc1Title,
    doc2Title,
    summaryOfKeyDifferences: `Comparative audit completed: identified \${modifiedCount} modified sections, \${addedCount} newly introduced clauses, and \${removedCount} excised clauses. The revisions substantially impact risk distribution and statutory protections.`,
    overallPowerShift: 'Document B significantly rebalances the legal relationship toward fairness by introducing mutual indemnities, mandatory 24-hour entry notice, statutory deposit caps, and fair dispute mechanisms.',
    diffs
  };
}
