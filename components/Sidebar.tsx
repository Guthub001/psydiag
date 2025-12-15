import React from 'react';
import { SavedCase } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedCases: SavedCase[];
  onLoadCase: (c: SavedCase) => void;
  onDeleteCase: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, savedCases, onLoadCase, onDeleteCase }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-none'}
      `}>
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Patientenakte</h2>
          <button onClick={onClose} className="md:hidden text-slate-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {savedCases.length === 0 ? (
            <div className="text-center text-slate-400 text-sm mt-10">
              Keine gespeicherten Fälle vorhanden.
            </div>
          ) : (
            savedCases.map((c) => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow group relative">
                <div 
                  onClick={() => onLoadCase(c)}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-medical-700 truncate">{c.patientData.pseudonym}</span>
                    <span className="text-xs text-slate-400">{new Date(c.lastModified).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2 mb-2 italic">
                    {c.patientData.symptoms.substring(0, 60)}...
                  </div>
                  {c.diagnoses.length > 0 && (
                     <div className="inline-block bg-slate-100 px-2 py-0.5 rounded text-xs font-mono font-semibold text-slate-700">
                       {c.diagnoses[0].code} ({c.diagnoses[0].probability}%)
                     </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCase(c.id); }}
                  className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Löschen"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;