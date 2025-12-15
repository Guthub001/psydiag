import React, { useState, useEffect } from 'react';
import { AppStep, PatientData, ApiResponse, Diagnosis, SavedCase, ChatMessage, UserProfession } from './types';
import * as geminiService from './services/geminiService';
import * as storageService from './services/storageService';
import Disclaimer from './components/Disclaimer';
import SymptomInput from './components/SymptomInput';
import QuestionInterface from './components/QuestionInterface';
import DiagnosisResults from './components/DiagnosisResults';
import Sidebar from './components/Sidebar';
import ColleagueChat from './components/ColleagueChat';
import ConclusionModal from './components/ConclusionModal';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.DISCLAIMER);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [missingApiKey, setMissingApiKey] = useState<boolean>(false);
  
  // User Settings & History
  const [userProfession, setUserProfession] = useState<UserProfession | null>(null);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Chat & Conclusion State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showConclusionModal, setShowConclusionModal] = useState(false);
  const [hasShownConclusion, setHasShownConclusion] = useState(false);

  useEffect(() => {
    // Check for API Key on mount
    if (!process.env.API_KEY) {
      setMissingApiKey(true);
      setStep(AppStep.ERROR);
    }

    // Load Cases
    setSavedCases(storageService.getCases());
    
    // Load Settings (Remember Me)
    const settings = storageService.getUserSettings();
    if (settings && settings.hasAcceptedDisclaimer) {
      setUserProfession(settings.profession);
      if (process.env.API_KEY) {
        setStep(AppStep.INPUT);
      }
    }

    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const handleDisclaimerAccept = (profession: UserProfession) => {
    setUserProfession(profession);
    storageService.saveUserSettings(profession);
    setStep(AppStep.INPUT);
  };

  const handleSymptomSubmit = async (data: PatientData) => {
    if (!userProfession) return;
    
    // Runtime check
    if (!process.env.API_KEY) {
      setMissingApiKey(true);
      return;
    }

    setPatientData(data);
    setIsLoading(true);
    setStep(AppStep.ANALYZING);
    setError(null);
    setHasUnsavedChanges(true);
    setChatHistory([]); 
    setQuestionCount(1);
    setDiagnoses([]); // Clear old diagnoses
    setHasShownConclusion(false); // Reset conclusion flag
    setShowConclusionModal(false);

    try {
      const response: ApiResponse = await geminiService.sendSymptomAnalysis(data, userProfession);
      processApiResponse(response);
    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
      setStep(AppStep.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomUpdate = (newSymptoms: string) => {
    if (!patientData) return;
    const updatedData = { ...patientData, symptoms: newSymptoms };
    handleSymptomSubmit(updatedData);
  };

  const handleBack = () => {
    if (step === AppStep.QUESTIONING) {
      setStep(AppStep.INPUT);
    } else if (step === AppStep.RESULTS) {
      setStep(AppStep.INPUT); 
    }
  };

  const handleAnswer = async (answer: boolean | string) => {
    setIsLoading(true);
    setError(null);
    setQuestionCount(prev => prev + 1);
    
    try {
      const response: ApiResponse = await geminiService.answerQuestion(answer);
      processApiResponse(response);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Verarbeiten der Antwort.');
      setStep(AppStep.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSend = async (message: string) => {
    if (!userProfession) return;

    const userMsg: ChatMessage = { role: 'user', content: message, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await geminiService.sendConsultationMessage(message, patientData, userProfession);
      
      if (response.results && response.results.length > 0) {
         setDiagnoses(response.results);
         setHasUnsavedChanges(true);
      }

      const content = response.content || (response.type === 'diagnosis' ? "Diagnosen aktualisiert." : "...");
      const aiMsg: ChatMessage = { role: 'assistant', content: content, timestamp: Date.now() };
      setChatHistory(prev => [...prev, aiMsg]);

    } catch (err: any) {
      const errorMsg: ChatMessage = { 
        role: 'assistant', 
        content: "⚠️ Verbindungsproblem. Bitte versuchen Sie es erneut.", 
        timestamp: Date.now() 
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const processApiResponse = (response: ApiResponse) => {
    if (response.results && Array.isArray(response.results) && response.results.length > 0) {
      setDiagnoses(response.results);
      
      // Check for High Confidence Conclusion (>95%)
      const topDiagnosis = response.results[0];
      if (topDiagnosis && topDiagnosis.probability >= 95 && !hasShownConclusion) {
        setShowConclusionModal(true);
        setHasShownConclusion(true);
      }
    }
    
    if (response.type === 'diagnosis' && response.results && response.results.length > 0) {
      setStep(AppStep.RESULTS);
    } else {
      const content = response.content || "Analyse läuft... (Keine Frage erhalten)";
      setCurrentQuestion(content);
      setStep(AppStep.QUESTIONING);
    }
  };

  const handleSaveCase = () => {
    if (patientData && diagnoses.length > 0) {
      const saved = storageService.saveCase(patientData, diagnoses, chatHistory);
      setSavedCases(storageService.getCases());
      setCurrentCaseId(saved.id);
      setHasUnsavedChanges(false);
    }
  };

  const handleLoadCase = (c: SavedCase) => {
    setPatientData(c.patientData);
    setDiagnoses(c.diagnoses);
    setCurrentCaseId(c.id);
    setError(null);
    setChatHistory(c.chatHistory || []);
    setStep(AppStep.INPUT);
    setHasShownConclusion(true); // Don't show conclusion for loaded cases immediately
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteCase = (id: string) => {
    storageService.deleteCase(id);
    setSavedCases(storageService.getCases());
    if (currentCaseId === id) handleReset();
  };

  const handleReset = () => {
    setPatientData(null);
    setCurrentQuestion('');
    setDiagnoses([]);
    setError(null);
    setCurrentCaseId(null);
    setHasUnsavedChanges(false);
    setChatHistory([]);
    setQuestionCount(0);
    setHasShownConclusion(false);
    setShowConclusionModal(false);
    setStep(AppStep.INPUT);
    if (userProfession) {
       geminiService.initializeDiagnosticSession(userProfession);
    }
  };

  const handleGoHome = () => {
    // Resets to disclaimer/lock screen (acting as a "Pause" or "Exit")
    handleReset();
    setStep(AppStep.DISCLAIMER);
  };

  // Specific Error Screen for Missing Key
  if (missingApiKey) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border-t-8 border-red-500">
          {/* Error content same as before */}
          <h2 className="text-2xl font-bold text-slate-800 mb-3">API Konfiguration fehlt</h2>
           {/* ... */}
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors">
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
      {/* Sidebar */}
      {step !== AppStep.DISCLAIMER && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          savedCases={savedCases}
          onLoadCase={handleLoadCase}
          onDeleteCase={handleDeleteCase}
        />
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {step !== AppStep.DISCLAIMER && (
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>
                </button>
              
              {/* Clickable Logo to go to INPUT (Dashboard) */}
              <div 
                className="flex items-center gap-3 select-none cursor-pointer group"
                onClick={() => setStep(AppStep.INPUT)}
                title="Zur Übersicht"
              >
                <div className="relative w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-medical-700 to-medical-500 rounded-xl flex items-center justify-center text-white shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                   <span className="font-serif font-black text-xl md:text-2xl italic tracking-tighter">Ψ</span>
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-amber-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="leading-tight">
                  <h1 className="text-base md:text-lg font-bold text-slate-800 tracking-tight group-hover:text-medical-700 transition-colors">
                    PSY<span className="text-medical-600">DIAG</span>
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Global Actions Right */}
            <div className="flex items-center gap-2 md:gap-3">
               <button
                 onClick={handleReset}
                 className="hidden md:flex items-center gap-2 px-3 py-2 bg-medical-50 text-medical-700 rounded-lg text-sm font-bold border border-medical-100 hover:bg-medical-100 transition-colors"
                 title="Alles zurücksetzen"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                 Neuer Fall
               </button>

               <button
                 onClick={handleGoHome}
                 className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                 title="Zurück zum Start / Ausloggen"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                 <span className="hidden sm:inline">Startseite</span>
               </button>
            </div>
          </header>
        )}

        <main className={`flex-1 overflow-y-auto relative ${step === AppStep.DISCLAIMER ? 'p-0' : 'p-4 md:p-8 bg-slate-100'}`}>
          {step === AppStep.DISCLAIMER && (
            <Disclaimer onAccept={handleDisclaimerAccept} />
          )}

          {(step === AppStep.INPUT || step === AppStep.ANALYZING) && (
            <SymptomInput 
              onSubmit={handleSymptomSubmit} 
              isLoading={isLoading} 
              initialData={patientData} 
            />
          )}

          {step === AppStep.QUESTIONING && patientData && (
            <QuestionInterface 
              question={currentQuestion} 
              onAnswer={handleAnswer} 
              isLoading={isLoading} 
              initialSymptoms={patientData.symptoms}
              onUpdateSymptoms={handleSymptomUpdate}
              onBack={handleBack}
              questionCount={questionCount}
              currentDiagnoses={diagnoses}
            />
          )}

          {step === AppStep.RESULTS && (
            <DiagnosisResults 
              results={diagnoses} 
              patientData={patientData} 
              onReset={handleReset} 
              onSave={handleSaveCase}
              hasSaved={!hasUnsavedChanges}
              onStartChat={() => setShowChatModal(true)}
            />
          )}

          {step === AppStep.ERROR && (
            <div className="max-w-md mx-auto mt-20 w-full bg-white border-l-4 border-red-500 rounded-r-lg shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <h3 className="text-red-800 font-bold text-xl">Systemfehler</h3>
              </div>
              <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={handleReset}
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 font-bold transition-colors shadow-lg"
              >
                Diagnostik neu starten
              </button>
            </div>
          )}
          
          <div className="h-10"></div>
        </main>
        
        {/* Modals */}
        {showChatModal && (
          <ColleagueChat 
            chatHistory={chatHistory}
            onSendMessage={handleChatSend}
            isLoading={isLoading}
            onClose={() => setShowChatModal(false)}
          />
        )}

        {showConclusionModal && diagnoses.length > 0 && (
           <ConclusionModal 
              diagnosisName={diagnoses[0].name}
              probability={diagnoses[0].probability}
              onDiscuss={() => { 
                setShowConclusionModal(false); 
                // Ensure we are on results screen or chat
                if (step !== AppStep.RESULTS) setStep(AppStep.RESULTS);
                setShowChatModal(true); 
              }}
              onNewCase={handleReset}
              onHome={handleGoHome}
           />
        )}
      </div>
    </div>
  );
};

export default App;