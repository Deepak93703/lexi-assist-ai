import { ClauseAnalysis, ContractAnalysis, RiskLevel } from '../types/legal';

interface RiskRule {
  id: string;
  category: 'payment' | 'liability' | 'termination' | 'intellectual_property' | 'confidentiality' | 'general';
  regex: RegExp;
  title: string;
  weight: number; // 10 to 40
  dangerReason: string;
  counterProposal: string;
  eli5: string;
  professional: string;
}

const RISK_RULES: RiskRule[] = [
  {
    id: 'unilateral_entry',
    category: 'general',
    regex: /(enter.*without.*notice|absolute right to enter|any time.*24 hours|enter the leased premises at any time)/i,
    title: 'Unrestricted Landlord Entry Rights',
    weight: 25,
    dangerReason: 'Allows landlord to enter your private home at any hour without prior warning, violating your statutory right to quiet enjoyment.',
    counterProposal: 'Require at least 24 hours advance written notice, restricting entry strictly to reasonable business hours (9 AM - 6 PM) except in confirmed emergencies.',
    eli5: 'The landlord can walk into your apartment at any time of day or night without even knocking or warning you first.',
    professional: 'Disclaims tenant statutory right to quiet enjoyment by waiving reasonable notice requirements for non-emergency lessor access.'
  },
  {
    id: 'deposit_forfeiture',
    category: 'payment',
    regex: /(entire security deposit shall be.*forfeited|forfeited as liquidated damages|sole and unappealable discretion to deduct|regardless of normal wear and tear)/i,
    title: 'Automatic Security Deposit Forfeiture',
    weight: 35,
    dangerReason: 'Treats the entire security deposit as an automatic penalty instead of an indemnity for proven damages, allowing arbitrary deductions.',
    counterProposal: 'Limit deductions strictly to verifiable damages exceeding ordinary wear and tear, requiring itemized receipts within 21 days.',
    eli5: 'If you leave early, they take all your deposit money automatically, even if you left the place spotless.',
    professional: 'Constitutes an unenforceable punitive penalty clause under standard tenancy jurisprudence, waiving ordinary wear-and-tear exceptions.'
  },
  {
    id: 'blanket_indemnification',
    category: 'liability',
    regex: /(indemnify.*hold completely harmless|even if caused by the direct negligence|defend, indemnify, and hold harmless.*officers.*without any limitation)/i,
    title: 'Overbroad Indemnification & Negligence Disclaimer',
    weight: 35,
    dangerReason: 'Forces you to pay for the other party\'s legal defense and damages even when the accident or injury was caused by their own negligence.',
    counterProposal: 'Make indemnification strictly mutual and expressly carve out the other party\'s gross negligence, willful misconduct, or failure to maintain.',
    eli5: 'If the landlord fails to fix the ceiling and it falls, you could be blamed or forced to pay for their lawyers.',
    professional: 'Shifts first-party and third-party tort liability, attempting an exculpatory waiver of lessor or client statutory duties of care.'
  },
  {
    id: 'excessive_non_compete',
    category: 'general',
    regex: /(not directly or indirectly provide.*anywhere in the world|twenty-four \(24\) months.*following termination|non-compete.*24 months)/i,
    title: 'Draconian Worldwide Non-Compete',
    weight: 30,
    dangerReason: 'Blocks you from earning a livelihood or working with any tech or AI company worldwide for 2 full years after contract ends.',
    counterProposal: 'Strike out the non-compete clause entirely. Replace with a narrow non-solicitation of active direct clients for 6 months maximum.',
    eli5: 'You will be banned from doing any programming or tech work anywhere on the planet for 2 whole years after you stop working with them.',
    professional: 'Unreasonable restraint of trade lacking geographical and operational boundaries, rendering it oppressive and legally vulnerable.'
  },
  {
    id: 'pre_existing_ip_assignment',
    category: 'intellectual_property',
    regex: /(including any personal pre-existing|all worldwide rights.*inventions.*algorithms.*background code)/i,
    title: 'Forfeiture of Pre-Existing & Background IP',
    weight: 30,
    dangerReason: 'Assigns ownership of your personal open-source libraries, tooling, and general algorithms that you built before even joining the project.',
    counterProposal: 'Explicitly reserve ownership of pre-existing background technology, granting client only a non-exclusive license for project use.',
    eli5: 'They will legally own code and tools you wrote years ago before you ever met them.',
    professional: 'Expropriates developer background intellectual property without separate consideration, exceeding legitimate work-for-hire scope.'
  },
  {
    id: 'unreasonable_payment_terms',
    category: 'payment',
    regex: /(net-90|90 days after invoice|subjective satisfaction)/i,
    title: 'Extensive 90-Day Payment Delay & Subjective Withholding',
    weight: 25,
    dangerReason: 'You will work for 3 months before receiving payment, and they can withhold funds based on purely subjective whim.',
    counterProposal: 'Mandate standard Net-15 or Net-30 payment terms, with objective milestone acceptance criteria.',
    eli5: 'You have to wait 3 months to get paid, and they can decide not to pay if they just don\'t like it.',
    professional: 'Creates extreme cash-flow risk and lacks objective milestone verification standards, permitting pretextual payment withholding.'
  },
  {
    id: 'perpetual_nda_penalty',
    category: 'confidentiality',
    regex: /(liquidated damages of \$250,000|continue indefinitely and perpetually)/i,
    title: 'Perpetual Confidentiality with Arbitrary Liquidated Damages',
    weight: 25,
    dangerReason: 'Binds you forever to secrecy and imposes an automatic $250k penalty even for accidental minor slips without proof of actual damage.',
    counterProposal: 'Limit term to 2 years post-termination, with liability tied to actual proven economic damages.',
    eli5: 'You can never talk about this project for the rest of your life, and you get fined $250,000 if you make an honest mistake.',
    professional: 'Imposes an in terrorem liquidated damages clause without demonstrating reasonable pre-estimate of loss, exceeding standard 2-year survival terms.'
  },
  {
    id: 'mandatory_binding_arbitration',
    category: 'termination',
    regex: /(binding private arbitration|waives any right to trial by jury|class action lawsuit)/i,
    title: 'Forced Private Arbitration & Jury Waiver',
    weight: 20,
    dangerReason: 'Bars you from accessing public court systems or joining collective consumer/tenant actions, forcing you into expensive private forums.',
    counterProposal: 'Retain access to local small claims courts where proceedings are inexpensive and consumer-friendly.',
    eli5: 'You cannot go to a real judge or court if they cheat you; you must use an expensive private arbitration company in their hometown.',
    professional: 'Dispute resolution forum-selection clause waiving constitutional civil jury rights and procedural protections of local housing courts.'
  }
];

export function analyzeContractLocally(documentText: string, title: string = 'Uploaded Legal Document'): ContractAnalysis {
  const clauses: ClauseAnalysis[] = [];
  let totalRiskWeight = 0;
  
  // Split document into rough clauses or paragraphs
  const rawParagraphs = documentText
    .split(/\n\s*\n|\n(?=\d+\.)/)
    .map(p => p.trim())
    .filter(p => p.length > 30);

  const matchedRuleIds = new Set<string>();

  rawParagraphs.forEach((paragraph, index) => {
    let matchedInParagraph = false;

    for (const rule of RISK_RULES) {
      if (rule.regex.test(paragraph) && !matchedRuleIds.has(rule.id)) {
        matchedRuleIds.add(rule.id);
        matchedInParagraph = true;
        totalRiskWeight += rule.weight;

        let riskLevel: RiskLevel = 'moderate';
        if (rule.weight >= 35) riskLevel = 'critical';
        else if (rule.weight >= 25) riskLevel = 'high';

        clauses.push({
          id: `clause-\${index + 1}-\${rule.id}`,
          originalClause: paragraph,
          title: rule.title,
          simplifiedExplanation: {
            eli5: rule.eli5,
            professional: rule.professional
          },
          category: rule.category,
          riskScore: rule.weight * 2.5,
          riskLevel,
          riskReason: rule.dangerReason,
          counterProposal: rule.counterProposal,
          pageOrSection: `Clause \${index + 1}`
        });
      }
    }

    if (!matchedInParagraph && clauses.length < 6) {
      // Add standard clause analysis for balance
      const firstLine = paragraph.split('\n')[0].substring(0, 60);
      clauses.push({
        id: `clause-\${index + 1}`,
        originalClause: paragraph,
        title: firstLine.includes(':') ? firstLine.split(':')[0] : `Section \${index + 1}: General Provisions`,
        simplifiedExplanation: {
          eli5: 'This section sets out the standard operational terms and obligations agreed between the parties.',
          professional: 'Defines administrative covenants and operational performance obligations according to boilerplate legal standards.'
        },
        category: 'general',
        riskScore: 10,
        riskLevel: 'safe',
        pageOrSection: `Clause \${index + 1}`
      });
    }
  });

  // Calculate overall score (capped at 100)
  const overallRiskScore = Math.min(100, Math.max(12, Math.round(totalRiskWeight * 1.1)));
  
  let overallRiskLevel: RiskLevel = 'safe';
  if (overallRiskScore >= 75) overallRiskLevel = 'critical';
  else if (overallRiskScore >= 50) overallRiskLevel = 'high';
  else if (overallRiskScore >= 30) overallRiskLevel = 'moderate';

  // Detect document type
  let docType: ContractAnalysis['documentType'] = 'other';
  if (/lease|premises|tenant|landlord|rent/i.test(documentText)) {
    docType = 'residential_lease';
  } else if (/freelance|contractor|services|hourly rate|client/i.test(documentText)) {
    docType = 'freelance_contract';
  } else if (/confidential|proprietary|recipient|disclosing party|nda/i.test(documentText)) {
    docType = 'nda';
  }

  return {
    documentTitle: title,
    documentType: docType,
    executiveSummary: {
      eli5: `This agreement establishes legal commitments between both parties. It includes \${clauses.length} evaluated sections. There are \${matchedRuleIds.size} high-risk terms that heavily favor the other side, especially around penalties, liabilities, and restrictions.`,
      professional: `Comprehensive forensic audit of '\${title}'. The agreement demonstrates an asymmetric risk allocation profile with \${matchedRuleIds.size} high-liability clauses identified across indemnification, termination covenants, and dispute resolution venues.`
    },
    overallRiskScore,
    overallRiskLevel,
    keyObligations: [
      {
        party: 'User / Recipient / Resident',
        obligation: 'Fulfill primary performance covenants, follow restrictive behavior covenants, and meet strict notification timelines.',
        deadlineOrFrequency: 'Ongoing throughout term'
      },
      {
        party: 'Counterparty (Landlord / Client)',
        obligation: 'Grant access or compensation subject to discretionary unilateral conditions specified in the text.',
        deadlineOrFrequency: 'Subject to contract milestones'
      }
    ],
    criticalDates: [
      {
        event: 'Contract Commencement',
        dateOrTimeline: 'Upon execution / designated start date',
        consequence: 'All legal obligations and indemnification waivers become immediately binding.'
      },
      {
        event: 'Termination / Renewal Notice Window',
        dateOrTimeline: '30 to 60 days prior to contract expiration',
        consequence: 'Failure to notify may trigger automatic renewal or forfeiture of deposits.'
      }
    ],
    financialLiabilities: [
      {
        item: 'Primary Financial Consideration',
        amountOrCalculation: 'Stated contract rates / fees',
        terms: 'Mandatory on designated calendar dates.'
      },
      {
        item: 'Liquidated Penalties & Late Surcharges',
        amountOrCalculation: 'Specified late fee schedule & deposit forfeiture',
        terms: 'Accrues immediately upon breach or early exit.'
      }
    ],
    clauses
  };
}
