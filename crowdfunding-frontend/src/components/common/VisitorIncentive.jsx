import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, Gift, Rocket, Sparkles } from 'lucide-react';
import Button from './Button';

const VisitorIncentive = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    // Show after 30 seconds for non-authenticated users
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 30000); 
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isVisible || isAuthenticated) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-full duration-700">
      <div className="bg-white rounded-3xl shadow-2xl border border-primary-100 p-8 max-w-sm relative overflow-hidden group">
        {/* Background Sparkles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-50 rounded-full blur-2xl group-hover:bg-primary-100 transition-colors" />
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mb-6 font-black text-xl">
             <Sparkles className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-display font-black text-slate-900 mb-3 tracking-tight">
            Ne manquez pas la prochaine pépite !
          </h3>
          
          <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
            Créez un compte gratuitement pour sauvegarder vos projets favoris et recevoir des recommandations IA personnalisées.
          </p>

          <div className="flex flex-col gap-3">
            <Button 
              fullWidth 
              className="bg-primary-900 shadow-lg shadow-primary-900/20"
              onClick={() => window.location.href = '/register'}
            >
              Créer mon compte
            </Button>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500 transition-colors"
            >
              Peut-être plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorIncentive;
