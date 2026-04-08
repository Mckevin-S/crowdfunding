import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minus, 
  Maximize2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import aiChatService from '../../services/aiChatService';
import clsx from 'clsx';

const GlobalChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis l\'assistant IA de la plateforme. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const { id: projetId } = useParams();
  const location = useLocation();

  // Scroll to bottom when history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message.trim();
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Pass projetId if we are on a project details page
      const currentProjetId = location.pathname.includes('/projects/') ? projetId : null;
      const response = await aiChatService.sendMessage(userMsg, currentProjetId);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Désolé, je rencontre une petite difficulté technique. Veuillez réessayer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-primary-900 border-4 border-white text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative animate-in zoom-in duration-300"
        >
          <div className="absolute inset-0 rounded-full border-4 border-emerald-400 opacity-20 group-hover:animate-ping" />
          <Bot className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={clsx(
          "bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden transition-all duration-500 ease-out flex flex-col",
          isMinimized ? "w-[300px] h-[72px]" : "w-[380px] h-[580px] max-h-[80vh]"
        )}>
          {/* Header */}
          <div className="bg-primary-900 p-5 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Bot className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black tracking-tight leading-none">Assistant IA</h4>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-100/60 uppercase">GPT-4 En ligne</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </button>
              <button 
                onClick={toggleChat} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div 
                ref={scrollRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 scroll-smooth bg-slate-50/30"
              >
                {chatHistory.map((chat, idx) => (
                  <div 
                    key={idx} 
                    className={clsx(
                      "flex gap-3",
                      chat.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={clsx(
                      "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center shadow-sm",
                      chat.role === 'user' ? "bg-white text-slate-400 border border-slate-100" : "bg-primary-100 text-primary-600"
                    )}>
                      {chat.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className={clsx(
                      "px-4 py-3 rounded-2xl max-w-[80%] text-sm font-medium leading-relaxed shadow-sm",
                      chat.role === 'user' 
                        ? "bg-primary-900 text-white rounded-tr-none" 
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                    )}>
                      {chat.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                       <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <span className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 focus-within:border-primary-600/30 transition-all shadow-inner"
                >
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 bg-transparent border-none outline-none text-sm py-2 font-medium placeholder:text-slate-400"
                  />
                  <button 
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="w-10 h-10 bg-primary-900 text-white rounded-xl flex items-center justify-center hover:bg-black active:scale-90 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-lg shadow-primary-900/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-3 text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                    Propulsé par InvestAFRIKA IA & GPT-4
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalChatbot;
