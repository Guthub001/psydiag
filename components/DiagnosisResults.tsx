import React, { useState, useEffect } from 'react';
import { Diagnosis, PatientData } from '../types';

interface DiagnosisResultsProps {
  results: Diagnosis[];
  patientData: PatientData | null;
  onReset: () => void;
  onSave: () => void;
  hasSaved: boolean;
  onStartChat: () => void;
}

const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({ results, patientData, onReset, onSave, hasSaved, onStartChat }) => {
  const [showAutoPrompt, setShowAutoPrompt] = useState(false);
  const safeResults = results && results.length > 0 ? results : [];

  // Automatic suggestion for supervision after 2 seconds
  useEffect(() => {
    if (safeResults.length > 0) {
      const timer = setTimeout(() => {
        setShowAutoPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [safeResults.length]);

  return (
    <div className="max-w-5xl mx-auto w-full pb-20 relative animate-in fade-in duration-700">
      
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold text-medical-600 uppercase tracking-widest bg-medical-50 px-2 py-1 rounded mb-2 inline-block">Ergebnisbericht</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Diagnostische Einschätzung</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
             <div className="flex items-center gap-1.5">
               <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               <span className="font-mono font-bold text-slate-700">{patientData?.pseudonym || 'N/A'}</span>
             </div>
             <span className="text-slate-300">|</span>
             <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button
             onClick={onSave}
             disabled={hasSaved || safeResults.length === 0}
             className={`flex items-center px-5 py-2.5 rounded-xl font-bold transition-all border text-sm shadow-sm
                ${hasSaved 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default pl-4' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-medical-300 hover:text-medical-600 hover:shadow-md'
                }`}
           >
             {hasSaved && <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
             {hasSaved ? 'Gespeichert' : 'In Akte speichern'}
           </button>

           <button
            onClick={onReset}
            className="flex items-center px-5 py-2.5 bg-slate-800 text-white border border-transparent rounded-xl font-bold hover:bg-slate-900 transition-colors text-sm shadow-md"
          >
            Neuer Fall
          </button>
        </div>
      </div>

      {safeResults.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-12 text-center text-yellow-800">
          <svg className="w-12 h-12 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <h3 className="text-lg font-bold mb-2">Kein eindeutiges Ergebnis</h3>
          <p>Bitte starten Sie den Prozess erneut oder nutzen Sie den Experten-Modus zur manuellen Abklärung.</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Primary Diagnosis (Hero Card) */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-medical-100 relative overflow-hidden ring-1 ring-medical-50">
             <div className="absolute top-0 right-0 w-32 h-32 bg-medical-500/10 rounded-bl-full pointer-events-none"></div>
             <div className="absolute top-6 right-6">
                <span className="bg-medical-100 text-medical-700 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide border border-medical-200">
                  Hauptverdachtsdiagnose
                </span>
             </div>

             <div className="flex flex-col md:flex-row gap-6 md:items-start relative z-10">
                <div className="bg-medical-50 text-medical-700 border border-medical-100 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px] text-center">
                   <span className="text-4xl font-black font-mono tracking-tighter">{safeResults[0].code}</span>
                   <span className="text-xs font-bold uppercase mt-1 text-medical-600/70">ICD-10 Code</span>
                </div>
                
                <div className="flex-1">
                   <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">{safeResults[0].name}</h3>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="h-2.5 flex-1 bg-slate-100 rounded-full overflow-hidden max-w-sm">
                        <div className="h-full bg-gradient-to-r from-medical-500 to-medical-400 rounded-full" style={{ width: `${safeResults[0].probability}%` }}></div>
                      </div>
                      <span className="font-bold text-medical-600 text-lg">{safeResults[0].probability}%</span>
                   </div>
                   
                   <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Herleitung & Begründung</h4>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm">
                        {safeResults[0].reasoning}
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Differential Diagnoses (Grid) */}
          {safeResults.length > 1 && (
            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 Differentialdiagnosen & Komorbiditäten
                 <span className="text-xs font-normal text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">{safeResults.length - 1}</span>
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safeResults.slice(1).map((diagnosis, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                       <div className="flex justify-between items-start mb-3">
                          <span className="bg-slate-100 text-slate-600 font-mono font-bold px-2 py-1 rounded text-sm">{diagnosis.code}</span>
                          <span className={`text-sm font-bold ${diagnosis.probability > 50 ? 'text-slate-700' : 'text-slate-400'}`}>{diagnosis.probability}%</span>
                       </div>
                       <h4 className="font-bold text-slate-800 mb-2 line-clamp-1">{diagnosis.name}</h4>
                       <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-3">
                         {diagnosis.reasoning}
                       </p>
                       <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-slate-400 h-full rounded-full" style={{ width: `${diagnosis.probability}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Expert Mode Callout - CHANGED TO MEDICAL GREEN */}
      <div className="mt-16 bg-gradient-to-br from-medical-800 to-medical-900 rounded-3xl p-1 shadow-2xl overflow-hidden">
         <div className="bg-medical-900/50 backdrop-blur-sm p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-medical-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold uppercase tracking-wide mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Human-in-the-loop
               </div>
               <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Fragen Sie mir Löcher in den Bauch!</h3>
               <p className="text-medical-100 leading-relaxed">
                 Ich bin Ihr Supervisor und Professor, der mit Ihnen den Fall lösen will. Nutzen Sie mich, um Hypothesen zu härten, Differentialdiagnosen auszuschließen oder komplexe Zusammenhänge zu diskutieren.
               </p>
            </div>

            <button
               onClick={onStartChat}
               className="relative z-10 group bg-white text-medical-900 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-medical-50 transition-all transform hover:-translate-y-1 flex items-center gap-3 whitespace-nowrap"
             >
               <span>Supervision starten</span>
               <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </button>
         </div>
      </div>

      {/* Automatic Suggestion Modal (Popup) */}
      {showAutoPrompt && (
        <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
          <div className="bg-white border border-medical-200 shadow-2xl rounded-2xl p-5 w-80 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-medical-500"></div>
             <button onClick={() => setShowAutoPrompt(false)} className="absolute top-3 right-3 text-slate-300 hover:text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>

             <div className="flex items-center gap-3 mb-3">
               <div className="w-8 h-8 rounded-full bg-medical-50 text-medical-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
               </div>
               <h4 className="font-bold text-slate-800 text-sm">Kollegialer Austausch?</h4>
             </div>
             <p className="text-xs text-slate-500 mb-4 leading-relaxed">
               Ich habe weitere Differentialdiagnosen im Hinterkopf. Wollen wir diese kurz durchgehen?
             </p>
             <button 
               onClick={() => { setShowAutoPrompt(false); onStartChat(); }}
               className="w-full bg-medical-700 text-white text-xs font-bold py-2 rounded-lg hover:bg-medical-800 transition-colors"
             >
               Chat öffnen
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosisResults;