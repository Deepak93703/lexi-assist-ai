import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProblemStatementBanner } from './components/ProblemStatementBanner';
import { DocumentIntake } from './components/DocumentIntake';
import { LegaleseDemystifier } from './components/LegaleseDemystifier';
import { RiskMeter } from './components/RiskMeter';
import { DocumentCompare } from './components/DocumentCompare';
import { GroundedChat } from './components/GroundedChat';
import { NoticeGenerator } from './components/NoticeGenerator';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import { analyzeContractLocally } from './services/riskEngine';
import { analyzeLegalDocument, getStoredApiKey } from './services/geminiService';
import { ContractAnalysis } from './types/legal';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'understand' | 'risk' | 'compare' | 'chat' | 'notices'>('understand');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Gemini API Key state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getStoredApiKey());

  // Active contract state
  const [currentText, setCurrentText] = useState<string>(SAMPLE_CONTRACTS[0].text);
  const [currentTitle, setCurrentTitle] = useState<string>(SAMPLE_CONTRACTS[0].title);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const [analysis, setAnalysis] = useState<ContractAnalysis>(() =>
    analyzeContractLocally(SAMPLE_CONTRACTS[0].text, SAMPLE_CONTRACTS[0].title)
  );

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDocumentLoaded = async (text: string, title: string, sampleId?: string) => {
    setCurrentText(text);
    setCurrentTitle(title);
    setIsAnalyzing(true);

    try {
      const result = await analyzeLegalDocument(text, title, apiKey);
      setAnalysis(result);
    } catch {
      setAnalysis(analyzeContractLocally(text, title));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Challenge Problem Statement & Alignment Banner */}
      <ProblemStatementBanner />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Step 0: Intake & Template Selection */}
        <DocumentIntake
          onDocumentLoaded={handleDocumentLoaded}
          currentTitle={currentTitle}
          isAnalyzing={isAnalyzing}
        />

        {/* Tab Navigation Controls (Mobile visible) */}
        <div className="flex md:hidden overflow-x-auto space-x-2 py-2 no-scrollbar">
          {[
            { id: 'understand', label: '1. Understand' },
            { id: 'risk', label: '2. Risk & Red Flags' },
            { id: 'compare', label: '3. Compare' },
            { id: 'chat', label: '4. Q&A Chat' },
            { id: 'notices', label: '5. Notice Drafts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="transition-all">
          {activeTab === 'understand' && <LegaleseDemystifier analysis={analysis} />}
          {activeTab === 'risk' && <RiskMeter analysis={analysis} />}
          {activeTab === 'compare' && <DocumentCompare />}
          {activeTab === 'chat' && <GroundedChat contractText={currentText} />}
          {activeTab === 'notices' && <NoticeGenerator analysis={analysis} />}
        </div>

      </main>

      {/* Footer with Legal Disclaimer and Attribution */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">LexiAssist AI</span>
            <span>•</span>
            <span>Built for PromptWars Virtual (Exclusive Edition)</span>
          </div>
          <div className="text-center md:text-right max-w-lg leading-tight">
            <strong>Ethical & Safety Notice:</strong> LexiAssist AI provides algorithmic summarization and assistive legal analysis. It does not provide formal legal representation, attorney-client relationship, or jurisdictional statutory filings.
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        onKeySaved={(newKey) => setApiKey(newKey)}
      />

    </div>
  );
};

export default App;
