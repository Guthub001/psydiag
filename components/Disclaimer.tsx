import React, { useState } from 'react';
import { UserProfession } from '../types';

interface DisclaimerProps {
  onAccept: (profession: UserProfession) => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [profession, setProfession] = useState<UserProfession | ''>('');

  const handleAccept = () => {
    if (isChecked && profession) {
      onAccept(profession as UserProfession);
    }
  };

  return (
    <div className="min-h-full w-full bg-slate-50">
      {/* Hero Section / Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center">
          
          {/* Logo Large */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-medical-700 to-medical-500 rounded-3xl flex items-center justify-center text-white shadow-xl transform rotate-3 mb-8">
             <span className="font-serif font-black text-6xl italic tracking-tighter">Ψ</span>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full border-4 border-white"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            PSY<span className="text-medical-600">DIAG</span> <span className="text-slate-400 font-light">Pro</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl font-bold leading-tight">
            Die KI-gestützte Revolution in der psychotherapeutischen Befundung.
          </p>
          <p className="text-slate-400 mt-2 font-medium">Ihr genialer Diagnosefinder. Schnell, logisch, sicher.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        
        {/* Value Proposition Grid (3 Columns for direct punch) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Blitzschnelle Analyse</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Versteht Symptome sofort. Kein langes Suchen, sondern direkter Abgleich mit ICD-10 F Kriterien. Findet Muster, wo andere nur Listen sehen.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Ihr KI-Supervisor</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nutzen Sie den Experten-Modus zur Absicherung. Die KI hinterfragt Ihre Hypothesen kritisch und deckt übersehene Komorbiditäten auf.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Geniale Struktur</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Vergessen Sie starre Checklisten. Diese App denkt mit und führt Sie logisch und strukturiert direkt zur Diagnose.
            </p>
          </div>
        </div>

        {/* Legal Gate / Disclaimer Box - UPDATED TO MEDICAL GREEN/BLUE */}
        <div className="bg-gradient-to-br from-medical-800 to-medical-900 rounded-2xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden ring-1 ring-medical-700">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-medical-400 opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/3 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-medical-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Zugang für Fachkreise
            </h2>

            <div className="space-y-4 text-medical-50 text-sm mb-8 bg-medical-950/30 p-6 rounded-lg border border-medical-700/50">
               <p>
                 <strong className="text-white">Haftungsausschluss:</strong> Diese Anwendung ist ein "Clinical Decision Support System" und ersetzt keine ärztliche oder psychotherapeutische Diagnose. Ergebnisse basieren auf Wahrscheinlichkeiten.
               </p>
               <p>
                 <strong className="text-white">Zielgruppe:</strong> Der Zugang ist beschränkt auf Ärzte, Psychologische Psychotherapeuten, KJP und Heilpraktiker für Psychotherapie.
               </p>
            </div>

            <div className="space-y-6">
              {/* Profession Selector */}
              <div>
                <label className="block text-xs font-bold text-medical-200 uppercase tracking-wide mb-2">
                  Bitte wählen Sie Ihre Profession
                </label>
                <select 
                  value={profession}
                  onChange={(e) => setProfession(e.target.value as UserProfession)}
                  className="w-full bg-medical-900/50 border border-medical-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-medical-400 outline-none hover:bg-medical-900/70 transition-colors"
                >
                  <option value="" disabled className="text-slate-500">-- Bitte wählen --</option>
                  <option value="Facharzt (Psychiatrie/Neurologie)" className="text-slate-900">Facharzt (Psychiatrie/Neurologie)</option>
                  <option value="Arzt (Andere Fachrichtung)" className="text-slate-900">Arzt (Andere Fachrichtung)</option>
                  <option value="Psychologischer Psychotherapeut" className="text-slate-900">Psychologischer Psychotherapeut / PP</option>
                  <option value="KJP" className="text-slate-900">KJP (Kinder- & Jugendlichenpsychotherapeut)</option>
                  <option value="Heilpraktiker für Psychotherapie" className="text-slate-900">Heilpraktiker für Psychotherapie</option>
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center pt-2">
                <label className="flex items-start cursor-pointer group flex-1">
                  <div className="relative flex items-center h-6 mt-0.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="w-5 h-5 text-medical-500 border-medical-400 rounded focus:ring-medical-400 bg-medical-900/50 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm text-medical-100 group-hover:text-white transition-colors">
                    Ich bestätige meine Zugehörigkeit zur gewählten Berufsgruppe und akzeptiere den Haftungsausschluss.
                  </div>
                </label>

                <button
                  onClick={handleAccept}
                  disabled={!isChecked || !profession}
                  className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg whitespace-nowrap
                    ${isChecked && profession
                      ? 'bg-white text-medical-800 hover:bg-medical-50 transform hover:-translate-y-1 shadow-xl' 
                      : 'bg-medical-900/50 text-medical-400/50 cursor-not-allowed border border-medical-800'
                    }`}
                >
                  Applikation Starten
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-slate-400 text-xs pb-8">
           &copy; {new Date().getFullYear()} PSYDIAG Pro v1.4 • Clinical AI Systems
        </div>

      </div>
    </div>
  );
};

export default Disclaimer;