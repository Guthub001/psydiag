import React from 'react';

interface ConclusionModalProps {
  diagnosisName: string;
  probability: number;
  onDiscuss: () => void;
  onNewCase: () => void;
  onHome: () => void;
}

const ConclusionModal: React.FC<ConclusionModalProps> = ({ diagnosisName, probability, onDiscuss, onNewCase, onHome }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transform scale-100 transition-all">
        
        {/* Success Header */}
        <div className="bg-emerald-600 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold">Diagnoseziel erreicht!</h2>
            <p className="text-emerald-100 mt-1 text-sm font-medium uppercase tracking-wider">Sicherheit: {probability}%</p>
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-slate-600 text-lg mb-6 leading-relaxed">
            Wir haben eine sehr hohe Wahrscheinlichkeit für <strong className="text-slate-900">{diagnosisName}</strong> ermittelt.
          </p>
          
          <p className="text-slate-500 text-sm mb-8">
            Wie möchten Sie fortfahren?
          </p>

          <div className="space-y-3">
            <button 
              onClick={onDiscuss}
              className="w-full py-4 px-6 bg-white border-2 border-medical-600 text-medical-700 rounded-xl font-bold hover:bg-medical-50 transition-colors flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
              <span>Weiter diskutieren / Details klären</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={onNewCase}
                className="py-3 px-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg"
              >
                Neuer Patient
              </button>
              
              <button 
                onClick={onHome}
                className="py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Pause / Startseite
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ConclusionModal;