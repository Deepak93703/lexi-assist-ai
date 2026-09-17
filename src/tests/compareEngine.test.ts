import { describe, it, expect } from 'vitest';
import { compareDocumentsLocally } from '../services/compareEngine';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

describe('Document Comparison & Diff Engine', () => {
  it('correctly compares original and revised tenant-friendly leases', () => {
    const sample = SAMPLE_CONTRACTS[0];
    const result = compareDocumentsLocally(
      sample.text,
      sample.comparisonCounterpart!.text,
      sample.title,
      sample.comparisonCounterpart!.title
    );

    expect(result.diffs.length).toBeGreaterThan(0);
    expect(result.overallPowerShift).toContain('Document B');

    // Check for modified clauses
    const modifiedDiffs = result.diffs.filter(d => d.changeType === 'modified');
    expect(modifiedDiffs.length).toBeGreaterThan(0);
  });

  it('identifies identical documents as neutral power shift', () => {
    const sample = SAMPLE_CONTRACTS[0];
    const result = compareDocumentsLocally(sample.text, sample.text, 'Doc A', 'Doc A Copy');

    const nonIdentical = result.diffs.filter(d => d.changeType !== 'identical');
    expect(nonIdentical.length).toBe(0);
  });
});
