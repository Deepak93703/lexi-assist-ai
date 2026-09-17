import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Bookmark, Volume2, Sparkles, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types/legal';
import { askLegalAssistant } from '../services/geminiService';

interface GroundedChatProps {
  contractText: string;
}

const SUGGESTIONS = [
  "Can my landlord enter my apartment without advance notice?",
  "What happens to my security deposit if I break the lease early?",
  "Does the contractor agreement have a non-compete clause?",
  "Who is responsible for repairs and plumbing issues?"
];

export const GroundedChat: React.FC<GroundedChatProps> = ({ contractText }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: "Hello! I am your LexiAssist Legal Navigator. Ask me anything about the uploaded contract, and I will explain your rights with direct clause citations.",
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: q
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const reply = await askLegalAssistant(q, contractText, messages);
      setMessages(prev => [...prev, reply]);
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: "Sorry, I encountered an issue processing that query. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[650px] overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Grounded Legal Q&A Assistant</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                RAG Citation Enabled
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Directly citing uploaded clauses to prevent legal hallucination
            </p>
          </div>
        </div>

        <div className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Informational only • Not attorney counsel</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs ${
                isUser ? 'bg-indigo-600' : 'bg-blue-600'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                isUser
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-1 text-[10px] opacity-70">
                  <span>{isUser ? 'You' : 'LexiAssist AI'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="font-bold text-[10px] uppercase text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                      <Bookmark className="w-3 h-3" />
                      <span>Grounded Legal Citations:</span>
                    </span>
                    {msg.citations.map((cite, i) => (
                      <div key={i} className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-blue-200 dark:border-blue-900 text-[11px] text-slate-700 dark:text-slate-300">
                        <strong className="block text-blue-700 dark:text-blue-300">{cite.clauseTitle}</strong>
                        <span className="italic font-mono">{cite.quote}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!isUser && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="mt-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center space-x-1 text-[10px]"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs italic p-2">
            <Sparkles className="w-4 h-4 animate-spin text-blue-500" />
            <span>Consulting contract clauses with Gemini...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center space-x-2 no-scrollbar">
        <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">Ask:</span>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full border border-slate-200 dark:border-slate-600 whitespace-nowrap transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about this contract (e.g. 'Can they deduct my deposit without notice?')..."
            className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
