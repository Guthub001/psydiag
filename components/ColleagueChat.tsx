import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ColleagueChatProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onClose: () => void;
}

const ColleagueChat: React.FC<ColleagueChatProps> = ({ chatHistory, onSendMessage, isLoading, onClose }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header - UPDATED TO MEDICAL GREEN */}
        <div className="bg-gradient-to-r from-medical-800 to-medical-900 p-4 flex justify-between items-center text-white shadow-md border-b border-medical-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-lg shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
             </div>
             <div>
               <h3 className="font-bold text-lg tracking-tight">Experten-Modus</h3>
               <p className="text-xs text-medical-100 opacity-90">Fragen Sie mich Löcher in den Bauch!</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
           <div className="flex justify-center">
             <span className="text-xs bg-medical-50 text-medical-600 border border-medical-100 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">Sichere Verbindung</span>
           </div>
           
           {chatHistory.map((msg, idx) => (
             <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed
                 ${msg.role === 'user' 
                   ? 'bg-medical-700 text-white rounded-tr-none' 
                   : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                 }`}
               >
                 <p className="whitespace-pre-wrap">{msg.content}</p>
                 <span className={`text-[10px] block mt-2 text-right ${msg.role === 'user' ? 'text-medical-200' : 'text-slate-400'}`}>
                   {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </span>
               </div>
             </div>
           ))}
           
           {isLoading && (
             <div className="flex justify-start">
               <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-3 text-slate-500 text-sm">
                  <svg className="animate-spin h-5 w-5 text-medical-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Analysiere Fallkonstellation...</span>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Geben Sie neue Informationen ein oder stellen Sie eine kritische Frage..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-medical-500 outline-none transition-shadow"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-medical-700 text-white px-6 py-3 rounded-xl hover:bg-medical-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold shadow-md"
            >
              Senden
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ColleagueChat;