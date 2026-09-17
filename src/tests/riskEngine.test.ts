import { describe, it, expect } from 'vitest';
import { analyzeContractLocally } from '../services/riskEngine';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

describe('Legal Risk Engine', () => {
  it('detects high-risk predatory clauses in standard residential lease', () => {
    const lease = SAMPLE_CONTRACTS.find(c => c.id === 'residential_lease')!;
    const analysis = analyzeContractLocally(lease.text, lease.title);

    expect(analysis.overallRiskScore).toBeGreaterThanOrEqual(60);
    expect(analysis.overallRiskLevel).toBe('critical');

    // Should detect unilateral entry
    const entryClause = analysis.clauses.find(c => c.title.includes('Unrestricted Landlord Entry'));
    expect(entryClause).toBeDefined();
    expect(entryClause?.counterProposal).toContain('24 hours advance');

    // Should detect automatic deposit forfeiture
    const depositClause = analysis.clauses.find(c => c.title.includes('Deposit Forfeiture'));
    expect(depositClause).toBeDefined();
    expect(depositClause?.riskScore).toBeGreaterThanOrEqual(50);
  });

  it('detects worldwide non-compete and background IP loss in freelance contract', () => {
    const freelance = SAMPLE_CONTRACTS.find(c => c.id === 'freelance_contract')!;
    const analysis = analyzeContractLocally(freelance.text, freelance.title);

    expect(analysis.overallRiskScore).toBeGreaterThanOrEqual(70);

    const nonCompeteClause = analysis.clauses.find(c => c.title.includes('Non-Compete'));
    expect(nonCompeteClause).toBeDefined();
    expect(nonCompeteClause?.riskReason).toContain('Blocks you from earning a livelihood');

    const ipClause = analysis.clauses.find(c => c.title.includes('Pre-Existing & Background IP'));
    expect(ipClause).toBeDefined();
  });

  it('generates both ELI5 and Professional simplified explanations', () => {
    const lease = SAMPLE_CONTRACTS[0];
    const analysis = analyzeContractLocally(lease.text, lease.title);

    expect(analysis.executiveSummary.eli5).toBeDefined();
    expect(analysis.executiveSummary.professional).toBeDefined();
    expect(analysis.clauses[0].simplifiedExplanation.eli5.length).toBeGreaterThan(10);
    expect(analysis.clauses[0].simplifiedExplanation.professional.length).toBeGreaterThan(10);
  });
});
