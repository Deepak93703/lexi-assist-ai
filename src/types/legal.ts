export type ReadingLevel = 'eli5' | 'professional';

export type RiskLevel = 'safe' | 'moderate' | 'high' | 'critical';

export interface ClauseAnalysis {
  id: string;
  originalClause: string;
  title: string;
  simplifiedExplanation: {
    eli5: string;
    professional: string;
  };
  category: 'payment' | 'liability' | 'termination' | 'intellectual_property' | 'confidentiality' | 'general';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  riskReason?: string;
  counterProposal?: string;
  pageOrSection?: string;
}

export interface ContractAnalysis {
  documentTitle: string;
  documentType: 'residential_lease' | 'commercial_lease' | 'freelance_contract' | 'nda' | 'terms_of_service' | 'other';
  executiveSummary: {
    eli5: string;
    professional: string;
  };
  overallRiskScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  keyObligations: {
    party: string;
    obligation: string;
    deadlineOrFrequency?: string;
  }[];
  criticalDates: {
    event: string;
    dateOrTimeline: string;
    consequence?: string;
  }[];
  financialLiabilities: {
    item: string;
    amountOrCalculation: string;
    terms: string;
  }[];
  clauses: ClauseAnalysis[];
}

export interface ComparisonDiff {
  sectionTitle: string;
  doc1Clause: string;
  doc2Clause: string;
  changeType: 'added' | 'removed' | 'modified' | 'identical';
  imbalanceAnalysis: {
    favorsParty: 'Doc A / Landlord / Client' | 'Doc B / Tenant / Contractor' | 'Neutral';
    explanation: string;
    riskDelta: number; // Positive means Doc B increased risk
  };
}

export interface DocumentComparisonResult {
  doc1Title: string;
  doc2Title: string;
  summaryOfKeyDifferences: string;
  overallPowerShift: string;
  diffs: ComparisonDiff[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  citations?: {
    clauseTitle: string;
    quote: string;
    section: string;
  }[];
}

export interface FormalNotice {
  id: string;
  type: 'security_deposit_refund' | 'lease_termination' | 'nda_breach_notice' | 'payment_dispute' | 'custom';
  title: string;
  recipient: string;
  sender: string;
  date: string;
  subject: string;
  body: string;
  relevantClausesCited: string[];
}
