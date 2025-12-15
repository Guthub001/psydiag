import React, { useState, useEffect } from 'react';
import { Diagnosis } from '../types';

interface QuestionInterfaceProps {
  question: string;
  onAnswer: (answer: boolean | string) => void;
  isLoading: boolean;
  initialSymptoms: string;
  onUpdateSymptoms: (newSymptoms: string) => void;
  onBack: () => void;
  questionCount: number;
  currentDiagnoses: Diagnosis[];
}

const QuestionInterface: React.FC<QuestionInterfaceProps> = ({ 
  question, 
  onAnswer, 
  isLoading, 
  initialSymptoms, 
  onUpdateSymptoms,
  onBack,
  questionCount,
  currentDiagnoses
}) => {
  const [textAnswer, setTextAnswer] = useState('');
  const [currentSymptoms, setCurrentSymptoms] = useState(initialSymptoms);
  const [isEditingSymptoms, setIsEditingSymptoms] = useState(false);
  const [showDiagnoses, setShowDiagnoses] = useState(true);

  useEffect(() => {
    setCurrentSymptoms(initialSymptoms);
  }, [initialSymptoms]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textAnswer.trim()) {
      onAnswer(textAnswer);
      setTextAnswer('');
    }
  };

  const handleSymptomUpdateTrigger = () => {
    if (currentSymptoms !== initialSymptoms) {
      onUpdateSymptoms(currentSymptoms);
      setIsEditingSymptoms(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full pb-12 h-full flex flex-col md:flex-row gap-6">
       
       {/* LEFT: Main Interaction Area */}
       <div className="flex-1 flex flex-col h-full">
          
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onBack}
              className="group flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-white"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Zurück
            </button>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Diagnostik-Schritt</span>
               <span className="flex items-center justify-center w-8 h-8 rounded-full bg-medical-100 text-medical-700 font-bold font-mono text-sm border-2 border-white shadow-sm">
                 {questionCount}
               </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative flex flex-col h-auto min-h-[500px]">
              
              {/* Decorative Header */}
              <div className="h-2 bg-gradient-to-r from-medical-400 via-medical-500 to-medical-600 w-full"></div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-4xl mx-auto w-full z-10">
                
                {isLoading ? (
                  <div className="flex flex-col items-center animate-pulse">
                     <div className="w-16 h-16 rounded-full bg-medical-50 text-medical-500 flex items-center justify-center mb-6">
                       <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                     </div>
                     <h3 className="text-2xl font-bold text-slate-700">Analysiere klinische Muster...</h3>
                     <p className="text-slate-400 mt-2">Prüfe Ausschlusskriterien und Komorbiditäten</p>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
                    <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                       Klinische Abklärung
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-12">
                      {question}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                      <button
                        onClick={() => onAnswer(true)}
                        className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
                      >
                         <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-emerald-600 group-hover:scale-110 transition-transform block">JA</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                         </div>
                         <span className="text-xs text-slate-400 mt-2 block group-hover:text-emerald-600/70">Kriterium erfüllt / Symptom vorhanden</span>
                      </button>

                      <button
                        onClick={() => onAnswer(false)}
                        className="group relative overflow-hidden p-6 rounded-2xl bg-white border-2 border-slate-100 hover:border-rose-500 hover:bg-rose-50 transition-all duration-200 text-left shadow-sm hover:shadow-xl hover:-translate-y-1"
                      >
                         <div className="flex items-center justify-between">
                            <span className="text-2xl font-black text-rose-600 group-hover:scale-110 transition-transform block">NEIN</span>
                            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                         </div>
                         <span className="text-xs text-slate-400 mt-2 block group-hover:text-rose-600/70">Trifft nicht zu / Unbekannt</span>
                      </button>
                    </div>

                    <div className="mt-10 w-full max-w-2xl mx-auto">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-xs font-medium text-slate-400 uppercase tracking-widest">Differenzierte Antwort</span>
                          </div>
                        </div>
                        
                        <form onSubmit={handleTextSubmit} className="mt-4 flex shadow-sm rounded-xl">
                           <input 
                             type="text" 
                             value={textAnswer}
                             onChange={(e) => setTextAnswer(e.target.value)}
                             placeholder="Präzisierung eingeben (z.B. 'Nur episodisch', 'Im Kontext von Substanzkonsum')..." 
                             className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-xl border-slate-300 bg-slate-50 focus:bg-white focus:ring-medical-500 focus:border-medical-500 sm:text-sm border outline-none transition-colors"
                           />
                           <button 
                             type="submit"
                             disabled={!textAnswer.trim()}
                             className="inline-flex items-center px-6 py-3 border border-l-0 border-transparent text-sm font-bold rounded-r-xl text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-colors"
                           >
                             Senden
                           </button>
                        </form>
                    </div>

                  </div>
                )}
              </div>
              
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-medical-400/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>
          </div>
       </div>

       {/* RIGHT: Live Sidebar (Collapsible on mobile?) */}
       <div className={`
         w-full md:w-80 flex flex-col gap-4 transition-all duration-500
         ${showDiagnoses ? 'opacity-100 translate-x-0' : 'opacity-50 translate-x-4'}
       `}>
          
          {/* Diagnostic Confidence Card */}
          <div className="bg-white/80 backdrop-blur-md border border-white/50 shadow-lg rounded-2xl p-5 flex flex-col h-full max-h-[60vh] overflow-hidden">
             <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                 Live-Hypothesen
               </h3>
               <span className="text-[10px] uppercase font-bold text-slate-400">KI-Modell 2.5</span>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {currentDiagnoses.length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    <span className="text-xs text-slate-400">Warte auf Daten...</span>
                  </div>
                ) : (
                  currentDiagnoses.map((diag, idx) => (
                    <div key={idx} className="group relative bg-white border border-slate-100 rounded-xl p-3 hover:shadow-md transition-all duration-300">
                       <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-slate-200 group-hover:bg-medical-500 transition-colors" style={{ opacity: diag.probability / 100 }}></div>
                       <div className="pl-3">
                          <div className="flex justify-between items-start">
                             <span className="font-mono font-bold text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded group-hover:text-medical-700 group-hover:bg-medical-50 transition-colors">{diag.code}</span>
                             <span className={`text-xs font-bold ${diag.probability > 70 ? 'text-emerald-600' : 'text-slate-400'}`}>{diag.probability}%</span>
                          </div>
                          <p className="text-xs font-medium text-slate-700 mt-1 leading-snug">{diag.name}</p>
                       </div>
                       <div className="absolute bottom-0 left-0 h-0.5 bg-medical-500 transition-all duration-500" style={{ width: `${diag.probability}%` }}></div>
                    </div>
                  ))
                )}
             </div>
          </div>

          {/* Quick Edit Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-inner">
             <div 
               className="flex justify-between items-center cursor-pointer mb-2"
               onClick={() => setIsEditingSymptoms(!isEditingSymptoms)}
             >
               <span className="text-xs font-bold text-slate-500 uppercase">Symptome / Kontext</span>
               <svg className={`w-4 h-4 text-slate-400 transition-transform ${isEditingSymptoms ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
             </div>
             
             {isEditingSymptoms ? (
               <div className="animate-in slide-in-from-top-2 duration-200">
                 <textarea
                    value={currentSymptoms}
                    onChange={(e) => setCurrentSymptoms(e.target.value)}
                    className="w-full text-xs p-2 border border-amber-300 bg-amber-50 rounded-lg outline-none focus:ring-1 focus:ring-amber-500 min-h-[100px]"
                 />
                 <button 
                   onClick={handleSymptomUpdateTrigger}
                   disabled={currentSymptoms === initialSymptoms}
                   className="mt-2 w-full py-1.5 bg-amber-500 text-white text-xs font-bold rounded shadow-sm hover:bg-amber-600 disabled:opacity-50"
                 >
                   Update
                 </button>
               </div>
             ) : (
               <p className="text-xs text-slate-400 line-clamp-3 italic cursor-pointer hover:text-slate-600" onClick={() => setIsEditingSymptoms(true)}>
                 "{currentSymptoms}"
               </p>
             )}
          </div>

       </div>
    </div>
  );
};

export default QuestionInterface;