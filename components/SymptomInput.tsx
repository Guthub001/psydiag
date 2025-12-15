import React, { useState, useEffect } from 'react';
import { PatientData } from '../types';

interface SymptomInputProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
  initialData: PatientData | null;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState<PatientData>({
    pseudonym: '',
    age: '',
    gender: '',
    suicideHistory: '',
    substanceHistory: '',
    symptoms: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        pseudonym: '',
        age: '',
        gender: '',
        suicideHistory: '',
        substanceHistory: '',
        symptoms: ''
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pseudonym && formData.symptoms && formData.age) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Neuer Fall</h1>
        <p className="text-slate-500 mt-1">Bitte erfassen Sie die Basisdaten und den klinischen Eindruck.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Demographics & Risks */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Stammdaten */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-medical-500"></div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Stammdaten
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pseudonym / ID</label>
                <input
                  type="text"
                  name="pseudonym"
                  required
                  value={formData.pseudonym}
                  onChange={handleChange}
                  placeholder="z.B. P-2024-X"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:bg-white outline-none transition-all font-mono text-sm"
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Alter</label>
                  <input
                    type="number"
                    name="age"
                    required
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Jahre"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:bg-white outline-none transition-all text-sm"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Geschlecht</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:bg-white outline-none transition-all text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Wählen...</option>
                    <option value="Weiblich">Weiblich</option>
                    <option value="Männlich">Männlich</option>
                    <option value="Divers">Divers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Risikofaktoren */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-400 group-hover:bg-red-500 transition-colors"></div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              CAVE / Risiken
            </h3>
            
            <div className="space-y-4">
               <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Suizidalität / SVV</label>
                <input
                  type="text"
                  name="suicideHistory"
                  value={formData.suicideHistory}
                  onChange={handleChange}
                  placeholder="Gedanken, Impulse, Historie..."
                  className="w-full px-4 py-2.5 bg-red-50/50 border border-red-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition-all text-sm placeholder-red-300 text-red-900"
                  disabled={isLoading}
                />
               </div>
               <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Substanzgebrauch</label>
                <input
                  type="text"
                  name="substanceHistory"
                  value={formData.substanceHistory}
                  onChange={handleChange}
                  placeholder="Alkohol, Drogen, Medikamente..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-medical-500 focus:bg-white outline-none transition-all text-sm"
                  disabled={isLoading}
                />
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Symptoms (Main Focus) */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex-1 flex flex-col overflow-hidden relative">
             <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <svg className="w-5 h-5 text-medical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   Befund, Symptome & Auffälligkeiten
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded">AMDP oder intuitiv</span>
             </div>
             
             <div className="flex-1 p-0 relative group">
                <textarea
                  name="symptoms"
                  required
                  value={formData.symptoms}
                  onChange={handleChange}
                  placeholder={`Hier können Sie den psychopathologischen Befund eingeben.

Flexibel & Intelligent:
• Entweder streng strukturiert nach AMDP
• Oder intuitiv alle Auffälligkeiten und Beobachtungen
• Auch unspezifische Eindrücke ("Patient wirkt fahrig")

Die KI filtert automatisch die relevanten Diagnose-Kriterien heraus.`}
                  className="w-full h-full p-6 text-slate-700 leading-relaxed outline-none resize-none placeholder-slate-400 focus:bg-blue-50/10 transition-colors text-base"
                  disabled={isLoading}
                />
                
                {/* Submit Area Overlay at Bottom */}
                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                   <div className="text-xs text-slate-400 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-slate-200 shadow-sm hidden sm:block">
                     Automatische Prüfung auf F-Diagnosen
                   </div>
                   <button
                    type="submit"
                    disabled={isLoading || !formData.pseudonym || !formData.symptoms}
                    className={`px-8 py-3 rounded-xl font-bold text-white shadow-xl transition-all transform flex items-center gap-2
                      ${isLoading || !formData.pseudonym || !formData.symptoms 
                        ? 'bg-slate-300 cursor-not-allowed scale-95 opacity-70' 
                        : 'bg-gradient-to-r from-medical-600 to-medical-500 hover:from-medical-500 hover:to-medical-400 hover:-translate-y-1 hover:shadow-medical-500/30'
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analysiere...</span>
                      </>
                    ) : (
                      <>
                        <span>Diagnostik Starten</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </button>
                </div>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SymptomInput;