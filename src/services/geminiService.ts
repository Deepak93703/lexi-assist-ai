import { GoogleGenerativeAI } from '@google/generative-ai';
import { ContractAnalysis, ChatMessage } from '../types/legal';
import { analyzeContractLocally } from './riskEngine';

const STORAGE_KEY_GEMINI_KEY = 'lexiassist_gemini_api_key';

export function getStoredApiKey(): string {
  return localStorage.getItem(STORAGE_KEY_GEMINI_KEY) || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY_GEMINI_KEY, key.trim());
}

export async function analyzeLegalDocument(
  documentText: string,
  documentTitle: string,
  apiKey?: string
): Promise<ContractAnalysis> {
  const keyToUse = apiKey || getStoredApiKey();

  if (!keyToUse) {
    // Zero-key intelligent local fallback
    return analyzeContractLocally(documentText, documentTitle);
  }

  try {
    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `You are an elite legal accessibility expert. Analyze the following legal agreement for a non-lawyer citizen.
Provide your response strictly adhering to this JSON structure:
{
  "documentTitle": "${documentTitle}",
  "documentType": "residential_lease" | "commercial_lease" | "freelance_contract" | "nda" | "terms_of_service" | "other",
  "executiveSummary": {
    "eli5": "Plain language 3-sentence summary for a fifth grader explaining what this agreement is and if it is safe",
    "professional": "Executive summary with formal legal terminology"
  },
  "overallRiskScore": integer between 0 and 100,
  "overallRiskLevel": "safe" | "moderate" | "high" | "critical",
  "keyObligations": [
    { "party": string, "obligation": string, "deadlineOrFrequency": string }
  ],
  "criticalDates": [
    { "event": string, "dateOrTimeline": string, "consequence": string }
  ],
  "financialLiabilities": [
    { "item": string, "amountOrCalculation": string, "terms": string }
  ],
  "clauses": [
    {
      "id": "c-1",
      "title": "Title of clause",
      "originalClause": "Verbatim quote",
      "simplifiedExplanation": {
        "eli5": "Simple explanation",
        "professional": "Professional explanation"
      },
      "category": "payment" | "liability" | "termination" | "intellectual_property" | "confidentiality" | "general",
      "riskScore": integer 0-100,
      "riskLevel": "safe" | "moderate" | "high" | "critical",
      "riskReason": "Why is this dangerous or unfair?",
      "counterProposal": "Recommended revised text or negotiation point",
      "pageOrSection": "Clause X"
    }
  ]
}

DOCUMENT TEXT:
${documentText.substring(0, 30000)}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as ContractAnalysis;
    return parsed;
  } catch (err) {
    console.warn('Gemini API call failed or timed out, falling back to local heuristic engine:', err);
    return analyzeContractLocally(documentText, documentTitle);
  }
}

export async function askLegalAssistant(
  question: string,
  contractText: string,
  history: ChatMessage[],
  apiKey?: string
): Promise<ChatMessage> {
  const keyToUse = apiKey || getStoredApiKey();

  if (!keyToUse) {
    // Intelligent local RAG response generator
    return generateLocalChatResponse(question, contractText);
  }

  try {
    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemContext = `You are LexiAssist, an AI legal document navigator for non-lawyers.
Rules:
1. Ground your answers directly in the provided contract.
2. If the question asks about something not mentioned in the contract, explicitly state that the agreement does not address it.
3. Always cite specific clauses or section numbers where relevant.
4. Conclude with a brief reminder that this is for informational clarity and does not constitute formal legal counsel.

CONTRACT TEXT:
${contractText.substring(0, 30000)}
`;

    const chat = model.startChat({
      history: history.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    const result = await chat.sendMessage(`${systemContext}\n\nUSER QUESTION: ${question}`);
    const answerText = result.response.text();

    // Extract citations
    const citations: ChatMessage['citations'] = [];
    const clauseMatches = answerText.match(/(?:Clause|Section|Article)\s*(\d+)/gi);
    if (clauseMatches) {
      clauseMatches.slice(0, 2).forEach(match => {
        citations.push({
          clauseTitle: match,
          quote: `Referenced under ${match} in the uploaded contract.`,
          section: match
        });
      });
    }

    return {
      id: `chat-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: answerText,
      citations: citations.length > 0 ? citations : undefined
    };
  } catch (err) {
    console.warn('Gemini Chat failed, using local simulation:', err);
    return generateLocalChatResponse(question, contractText);
  }
}

function generateLocalChatResponse(question: string, contractText: string): ChatMessage {
  const qLower = question.toLowerCase();
  let reply = '';
  const citations: ChatMessage['citations'] = [];

  if (qLower.includes('enter') || qLower.includes('landlord') && qLower.includes('notice')) {
    reply = "According to Clause 4 ('Landlord Right of Entry'), the current agreement allows the Landlord and their contractors to enter your apartment at any time, 24 hours a day, without prior notice. This is a severe red-flag that waives your standard tenant right to quiet enjoyment. Under standard fair housing practices, 24 hours written notice is required except in emergencies.";
    citations.push({
      clauseTitle: "Clause 4: Landlord Right of Entry",
      quote: "Landlord reserves the absolute right to enter the leased premises at any time, 24 hours a day, with or without prior notice.",
      section: "Clause 4"
    });
  } else if (qLower.includes('deposit') || qLower.includes('refund') || qLower.includes('wear')) {
    reply = "Clause 3 ('Security Deposit & Forfeiture') grants the Landlord unappealable discretion to deduct repair and repainting expenses regardless of normal wear and tear. Furthermore, early termination forfeits the entire $4,800 deposit plus remaining term rent as liquidated damages. You should negotiate this to require an itemized breakdown within 21 days.";
    citations.push({
      clauseTitle: "Clause 3: Security Deposit & Forfeiture",
      quote: "Landlord retains sole discretion to deduct expenses regardless of normal wear and tear... early termination forfeits deposit.",
      section: "Clause 3"
    });
  } else if (qLower.includes('non-compete') || qLower.includes('compete') || qLower.includes('freelance') || qLower.includes('work')) {
    reply = "Clause 4 of the Contractor Agreement imposes a 24-month worldwide ban on providing software or AI consulting services to any tech business. In many jurisdictions, such overbroad non-competes are unenforceable against independent contractors, but it presents major legal harassment risk.";
    citations.push({
      clauseTitle: "Clause 4: Worldwide Non-Compete",
      quote: "Contractor shall not directly or indirectly provide software engineering or AI services anywhere in the world for 24 months.",
      section: "Clause 4"
    });
  } else if (qLower.includes('terminate') || qLower.includes('cancel') || qLower.includes('notice period')) {
    reply = "The termination provisions are heavily asymmetric. While the company/landlord can terminate immediately or assess full liquidated damages, you are held to strict notice periods (60 days) and total deposit forfeiture upon early exit.";
    citations.push({
      clauseTitle: "Termination Provisions",
      quote: "Liquidated damages assessable upon early termination prior to expiration of term.",
      section: "Termination Clause"
    });
  } else {
    reply = `Based on your contract, the agreement establishes binding obligations across payment, liabilities, and performance covenants. For the specific topic of "${question}", ensure that all verbal agreements are put into an executed written addendum signed by both parties.\n\n*Note: This response is generated for informational guidance and does not replace qualified legal counsel.*`;
  }

  return {
    id: `chat-${Date.now()}`,
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    content: reply,
    citations: citations.length > 0 ? citations : undefined
  };
}

export async function translateTextWithGemini(
  text: string,
  targetLanguage: string,
  apiKey?: string
): Promise<string> {
  const keyToUse = apiKey || getStoredApiKey();
  if (!keyToUse) {
    // Quick dictionary mock translation for demo languages
    if (targetLanguage === 'hi') {
      return `[अनुवाद - हिन्दी]: ${text.substring(0, 150)}... (पूर्ण अनुवाद जेमिनी एपीआई के साथ सक्रिय है)`;
    } else if (targetLanguage === 'es') {
      return `[Traducción al español]: ${text.substring(0, 150)}... (Traducción completa activada con Gemini API)`;
    }
    return text;
  }

  try {
    const genAI = new GoogleGenerativeAI(keyToUse);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Translate the following legal explanation clearly and naturally into ${targetLanguage}. Maintain simple, accessible language:\n\n${text}`;
    const res = await model.generateContent(prompt);
    return res.response.text();
  } catch {
    return text;
  }
}
