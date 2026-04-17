import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import aiChatService from '../../services/aiChatService';

const AIChatBot = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: `Bonjour ! Je suis l'assistant IA d'InvestAFRIKA. Comment puis-je vous aider concernant le projet "${project?.titre || 'ce projet'}" ?` 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Préparation de l'historique pour le backend
      const history = messages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await aiChatService.sendMessage(input, project?.id, history);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Désolé, je rencontre une petite difficulté technique. Pourriez-vous reformuler votre question ?" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '60px' : '500px',
              width: isMinimized ? '300px' : '380px'
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={clsx(
              "bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col mb-4 transition-all duration-300",
              isMinimized && "cursor-pointer"
            )}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {/* Header */}
            <div className="bg-primary-900 p-4 flex items-center justify-between text-white px-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight leading-none">InvestCopilot IA</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-200/80 uppercase">En ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={clsx(
                        "flex gap-3 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                        msg.role === 'assistant' ? "bg-white text-primary-600" : "bg-primary-900 text-white"
                      )}>
                        {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <div className={clsx(
                        "p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm border",
                        msg.role === 'assistant' 
                          ? "bg-white border-slate-100 text-slate-700" 
                          : "bg-primary-900 border-primary-900 text-white rounded-tr-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 max-w-[85%] animate-pulse">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                      </div>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Copilote réfléchit...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-2 pl-4 border border-slate-100 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                    <input 
                      type="text"
                      className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-slate-700 placeholder:text-slate-400"
                      placeholder="Posez votre question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="w-10 h-10 bg-primary-900 rounded-xl flex items-center justify-center text-white hover:bg-black transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[9px] text-center text-slate-400 mt-2 font-bold uppercase tracking-tight flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    Propulsé par InvestAFRIKA Expert IA
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center self-end transition-all duration-500 overflow-hidden relative group",
          isOpen ? "bg-white text-primary-900 rotate-90" : "bg-primary-900 text-white"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default AIChatBot;
