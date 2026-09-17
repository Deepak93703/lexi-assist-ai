export interface SampleContract {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
  comparisonCounterpart?: {
    title: string;
    description: string;
    text: string;
  };
}

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'residential_lease',
    title: 'Standard Residential Apartment Lease',
    category: 'Real Estate / Tenancy',
    description: 'A typical tenancy agreement containing common pitfalls: unilateral entry, deposit forfeiture, and high early termination fees.',
    text: `RESIDENTIAL LEASE AGREEMENT

This Agreement is entered into on June 1, 2026, between Oakwood Properties LLC ("Landlord") and Tenant ("Resident").

1. PREMISES & TERM:
The Landlord hereby leases to the Resident the premises situated at Apt 4B, 742 Evergreen Terrace for a fixed term of 12 months commencing July 1, 2026.

2. RENT & LATE FEES:
The monthly rent shall be $2,400.00, payable on the 1st calendar day of each month. If rent is not received by 11:59 PM on the 2nd day of the month, a mandatory late charge of $150.00 shall be assessed, plus $25.00 for each additional day rent remains unpaid.

3. SECURITY DEPOSIT & FORFEITURE:
Resident shall deposit $4,800.00 as security deposit upon signing. Landlord retains the sole and unappealable discretion to deduct repair and repainting expenses regardless of normal wear and tear. If the Resident terminates this lease prior to the expiration of the 12-month term for any reason whatsoever, the entire security deposit shall be immediately forfeited as liquidated damages, in addition to any remaining monthly rent through the end of the full term.

4. LANDLORD RIGHT OF ENTRY:
Landlord and its authorized agents or contractors reserve the absolute right to enter the leased premises at any time, 24 hours a day, with or without prior verbal or written notice, for purposes of inspection, showing to prospective tenants, or general maintenance.

5. MAINTENANCE & REPAIRS:
Resident shall be exclusively responsible for all minor and major repairs within the premises, including HVAC repairs, plumbing leaks, and electrical fixtures under $500 per occurrence.

6. INDEMNIFICATION & LIABILITY WAIVER:
Resident agrees to defend, indemnify, and hold completely harmless the Landlord from and against any and all claims, personal injuries, property damage, or losses occurring on or within the leased premises, even if caused by the direct negligence or failure to maintain of the Landlord.

7. GOVERNING LAW & ARBITRATION:
Any dispute arising under this lease shall be resolved solely through binding private arbitration in the Landlord's home corporate county. Resident irrevocably waives any right to trial by jury or participation in a class action lawsuit.`,
    comparisonCounterpart: {
      title: 'Tenant-Friendly Fair Housing Lease Draft',
      description: 'A balanced revision protecting tenant rights, limiting deposit deductions to actual damages, requiring 24h entry notice, and capping late fees.',
      text: `FAIR RESIDENTIAL LEASE AGREEMENT (TENANT-PROTECTION DRAFT)

This Agreement is entered into on June 1, 2026, between Oakwood Properties LLC ("Landlord") and Resident ("Tenant").

1. PREMISES & TERM:
The Landlord leases to Resident Apt 4B, 742 Evergreen Terrace for a fixed term of 12 months commencing July 1, 2026.

2. RENT & LATE FEES:
Monthly rent is $2,400.00, payable on the 1st of each month with a 5-day statutory grace period. If rent is not received by the 6th day, a reasonable flat late fee of $50.00 shall apply. No daily compounding penalties.

3. SECURITY DEPOSIT & RETURN:
Resident deposits $2,400.00 (one month's rent) held in an interest-bearing escrow account. Landlord may not deduct for ordinary wear and tear. An itemized invoice of any actual damage must be provided within 21 days of move-out along with the refund of remaining funds. Early termination is permitted upon 60 days written notice and payment of a capped 1-month re-letting fee.

4. LANDLORD RIGHT OF ENTRY:
Landlord may enter premises only during reasonable business hours (9:00 AM - 6:00 PM) upon providing at least 24 hours advance written notice, except in genuine life-threatening emergencies.

5. MAINTENANCE & REPAIRS:
Landlord shall be responsible for all structural, plumbing, heating, ventilation, and appliance repairs, maintaining the premises in a clean, safe, and habitable condition as required by local housing codes.

6. MUTUAL LIABILITY:
Each party shall be responsible solely for their own gross negligence or willful misconduct. Landlord cannot disclaim statutory warranty of habitability.

7. DISPUTE RESOLUTION:
Disputes may be adjudicated in the local Small Claims Court or Municipal Housing Court where the property is located. Both parties retain all statutory civil remedies.`
    }
  },
  {
    id: 'freelance_contract',
    title: 'Freelance Software Developer Agreement',
    category: 'Employment / Independent Contractor',
    description: 'Contract with predatory clauses: indefinite worldwide non-compete, full IP ownership of pre-existing work, and 90-day delayed payment terms.',
    text: `INDEPENDENT CONTRACTOR & IP ASSIGNMENT AGREEMENT

This Agreement is made on March 15, 2026, between TechMega Corp ("Company") and Freelance Developer ("Contractor").

1. SERVICES & MILESTONES:
Contractor agrees to provide full-stack software development services as specified in Exhibit A.

2. PAYMENT & NET-90 TERMS:
Company shall pay Contractor an hourly rate of $75.00. Invoices shall be submitted monthly and paid under Net-90 terms (payment due 90 days after invoice approval). Company reserves the right to withhold payments if deliverables are not to Company's sole subjective satisfaction.

3. EXCLUSIVE INTELLECTUAL PROPERTY ASSIGNMENT:
Contractor irrevocably assigns and transfers to Company all worldwide rights, title, and interest in and to all code, inventions, algorithms, designs, patents, and work products developed during the term of this Agreement, including any personal pre-existing open-source libraries, tooling, or background code incorporated into the project.

4. WORLDWIDE NON-COMPETE & NON-SOLICITATION:
During the term of this Agreement and for a period of twenty-four (24) months following termination, Contractor shall not directly or indirectly provide software engineering, consulting, or advisory services to any business anywhere in the world that operates in the technology, cloud, or AI sector.

5. UNLIMITED INDEMNIFICATION:
Contractor agrees to defend, indemnify, and hold harmless Company, its officers, and affiliates from all losses, damages, legal fees, or claims arising from any bug, security flaw, downtime, or performance issue in the software provided by Contractor, without any limitation of liability cap.

6. TERMINATION AT WILL:
Company may terminate this Agreement immediately at any time for any reason with zero days notice. Contractor must provide 60 days advance written notice before terminating.`,
    comparisonCounterpart: {
      title: 'Balanced Contractor Master Services Agreement (MSA)',
      description: 'Fair terms with Net-15 payment, strict liability cap, protection of pre-existing background IP, and no non-compete restrictions.',
      text: `STANDARD PROFESSIONAL CONTRACTOR AGREEMENT (BALANCED TERMS)

This Agreement is made on March 15, 2026, between TechMega Corp ("Client") and Software Developer ("Contractor").

1. SERVICES:
Contractor will provide software development services as outlined in Statement of Work (SOW).

2. PAYMENT TERMS (NET-15):
Client agrees to pay invoices within fifteen (15) days of receipt. Overdue invoices accrue 1.5% interest per month.

3. INTELLECTUAL PROPERTY & BACKGROUND RIGHTS:
Upon full payment, Client receives ownership of the specific custom code written solely for Client. Contractor retains full ownership of all pre-existing libraries, general algorithms, tools, and background IP, granting Client a perpetual, non-exclusive license to use them.

4. NON-COMPETE & FREEDOM TO OPERATE:
Contractor is an independent contractor and retains the full freedom to render services to other clients and competitors, provided Contractor does not disclose Client's confidential information.

5. MUTUAL LIMITATION OF LIABILITY:
Neither party shall be liable for indirect or consequential damages. Each party's total aggregate liability under this agreement shall be strictly capped at the total amount paid to Contractor in the preceding 6 months.

6. EQUAL TERMINATION:
Either party may terminate this agreement upon 14 days written notice. Client will pay for all work completed up to the date of termination.`
    }
  },
  {
    id: 'mutual_nda',
    title: 'Commercial Non-Disclosure Agreement (NDA)',
    category: 'Corporate / Confidentiality',
    description: 'An aggressive one-sided NDA disguised as mutual, including perpetual obligations and harsh liquidated damage penalties.',
    text: `NON-DISCLOSURE AND RESTRICTIVE COVENANT AGREEMENT

This Agreement is entered into on January 10, 2026, between Apex Global Ventures ("Disclosing Party") and Partner ("Recipient").

1. CONFIDENTIAL INFORMATION DEFINITION:
Confidential Information includes any and all technical, commercial, financial, or strategic data shared by Disclosing Party, whether marked confidential or communicated orally, including ideas, concepts, and customer lists.

2. PERPETUAL NON-DISCLOSURE OBLIGATION:
The obligation of Recipient to maintain the absolute confidentiality of all Information shall continue indefinitely and perpetually into the future without any term limitation.

3. LIQUIDATED DAMAGES & PENALTY:
In the event of any unauthorized disclosure, even if inadvertent or accidental, Recipient agrees that actual damages would be difficult to ascertain and shall pay Disclosing Party liquidated damages of $250,000.00 per occurrence, in addition to all legal fees and injunctive relief without requirement of posting bond.

4. NON-SOLICITATION OF CLIENTS & STAFF:
Recipient shall not for a period of 3 years contact, solicit, or conduct business with any client, vendor, or prospective customer of Disclosing Party disclosed during discussions.`,
    comparisonCounterpart: {
      title: 'Standard Mutual 2-Year Confidentiality Agreement',
      description: 'Fair mutual NDA standard across tech startups: 2-year survival term, standard exclusions, and requirement of actual proven damages.',
      text: `MUTUAL NON-DISCLOSURE AGREEMENT (INDUSTRY STANDARD)

This Mutual Agreement is entered into on January 10, 2026, between Apex Global Ventures and Partner.

1. MUTUAL CONFIDENTIALITY:
Both parties acknowledge that they may exchange proprietary business information in connection with exploring a business collaboration. Information must be marked "Confidential" or confirmed in writing within 15 days.

2. TERM & DURATION:
The term of this Agreement is one (1) year. Confidentiality obligations shall survive for a period of two (2) years from the date of disclosure.

3. STANDARD EXCLUSIONS:
Information is not confidential if it: (a) was already known; (b) is publicly known through no breach; (c) is independently developed; or (d) is legally compelled by court order.

4. REMEDIES:
Each party may seek equitable injunctive relief or actual proven damages in a court of competent jurisdiction. No arbitrary liquidated damages.`
    }
  }
];
