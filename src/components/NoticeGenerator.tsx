import React, { useState } from 'react';
import { FileSignature, Copy, Download, Check, Send, AlertCircle, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ContractAnalysis, FormalNotice } from '../types/legal';

interface NoticeGeneratorProps {
  analysis: ContractAnalysis;
}

export const NoticeGenerator: React.FC<NoticeGeneratorProps> = ({ analysis }) => {
  const [noticeType, setNoticeType] = useState<FormalNotice['type']>('security_deposit_refund');
  const [recipientName, setRecipientName] = useState('Oakwood Properties LLC');
  const [senderName, setSenderName] = useState('Alex Morgan (Resident)');
  const [address, setAddress] = useState('Apt 4B, 742 Evergreen Terrace');
  const [copied, setCopied] = useState(false);

  // Generate Notice Body
  const generateNoticeContent = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    if (noticeType === 'security_deposit_refund') {
      return {
        subject: `FORMAL DEMAND: Full Refund of Security Deposit & Rebuttal of Arbitrary Deductions`,
        body: `DATE: ${today}

TO: ${recipientName}
FROM: ${senderName}
PREMISES: ${address}

RE: DEMAND FOR RETURN OF SECURITY DEPOSIT PURSUANT TO STATUTORY TENANCY PROTECTIONS

Dear Property Manager / Landlord,

I am writing to demand the prompt accounting and full refund of my security deposit in the amount of $4,800.00, deposited in connection with the above-referenced premises.

Please be formally advised that under applicable state and municipal housing jurisprudence, a landlord may not disclaim responsibility for ordinary wear and tear or enforce unilateral liquidated forfeiture provisions. Clause 3 of our agreement attempting to assert unappealable forfeiture operates as an unlawful penalty clause.

The premises were vacated in a clean, undamaged condition. Under governing statute, you are required to furnish an itemized statement along with receipts for any permissible deductions within statutory deadlines (typically 21 days).

Failure to remit the full deposit within fourteen (14) business days of receipt of this notice will leave me no alternative but to initiate formal proceedings in the local Housing / Small Claims Court, where statutory bad-faith penalties up to three times (3x) the withheld amount may be claimed.

Sincerely,

${senderName}
Contact: resident@email.com`
      };
    } else if (noticeType === 'lease_termination') {
      return {
        subject: `FORMAL NOTICE OF LEASE TERMINATION & INTENT TO VACATE`,
        body: `DATE: ${today}

TO: ${recipientName}
FROM: ${senderName}
PREMISES: ${address}

RE: STATUTORY NOTICE OF INTENT TO VACATE

Dear Landlord,

Please accept this written communication as formal notification that I will be terminating my tenancy and completely vacating the premises situated at ${address} on [Designated Date].

Pursuant to fair housing standards and mitigating covenants, this notice is provided with adequate advance warning. Please schedule a joint move-out walk-through inspection during normal business hours between 9:00 AM and 5:00 PM.

All keys and remotes will be returned upon move-out. Please forward the full security deposit refund to the designated forwarding address upon completion.

Sincerely,

${senderName}`
      };
    } else {
      return {
        subject: `FORMAL REBUTTAL: Notice of Non-Enforceability of Overbroad Non-Compete & IP Covenant`,
        body: `DATE: ${today}

TO: ${recipientName}
FROM: ${senderName}

RE: FORMAL CLARIFICATION OF INDEPENDENT CONTRACTOR SCOPE & PRE-EXISTING IP

Dear Legal Representative,

This letter serves to formally address the Independent Contractor Agreement. Please take notice that Section 4 attempting to impose a worldwide 24-month ban across all technology and artificial intelligence services constitutes an unenforceable restraint of trade under prevailing statutory law.

Furthermore, all pre-existing tools, open-source libraries, and background algorithms authored prior to this engagement remain the exclusive intellectual property of the undersigned contractor.

I remain committed to satisfying all confidentiality obligations regarding proprietary non-public data, while reserving all statutory rights to earn a professional livelihood.

Sincerely,

${senderName}`
      };
    }
  };

  const notice = generateNoticeContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${notice.subject}\n\n${notice.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(notice.subject, 15, 20, { maxWidth: 180 });
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(notice.body, 180);
    doc.text(splitText, 15, 35);
    doc.save(`Legal_Notice_${noticeType}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Step 5: Actionable Workflows
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <FileSignature className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Formal Legal Notice & Demand Letter Generator</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Instantly generate legally sound demand letters, termination notices, or dispute rebuttals tailored to contract clauses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Notice Configuration
          </h4>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Select Notice Type
            </label>
            <select
              aria-label="Select Notice Type"
              value={noticeType}
              onChange={(e) => setNoticeType(e.target.value as any)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 dark:text-white"
            >
              <option value="security_deposit_refund">Security Deposit Refund Demand</option>
              <option value="lease_termination">Notice of Lease Termination</option>
              <option value="nda_breach_notice">Non-Compete / IP Rights Rebuttal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Recipient Name / Company
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Sender (Your Full Name)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Premises / Context Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 dark:text-white"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handleCopy}
              className="w-full py-2 px-3 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Notice Text'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="w-full py-2 px-3 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Letter</span>
            </button>

            <button
              onClick={handlePrint}
              className="w-full py-2 px-3 text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Letter</span>
            </button>
          </div>

        </div>

        {/* Notice Preview Column (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 font-mono text-xs">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
            <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-300 dark:border-slate-600">
              {notice.subject}
            </h4>
            {notice.body}
          </div>
        </div>

      </div>

    </div>
  );
};
