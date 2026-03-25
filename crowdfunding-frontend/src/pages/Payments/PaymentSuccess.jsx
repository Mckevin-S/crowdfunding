import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Download, ArrowRight, Share2, PartyPopper } from 'lucide-react';
import Button from '@components/common/Button';
// import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get('id');
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Fire confetti!
    /*
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    // ... rest of confetti logic ...
    */

    setTimeout(() => setIsLoaded(true), 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 flex items-center justify-center">
      <div className={`max-w-2xl w-full transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/5 p-12 text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-emerald-500 to-primary-600" />
          
          <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 shadow-sm border border-emerald-100/50">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>

          <h1 className="text-4xl font-display font-black text-neutral-rich mb-4">Contribution Réussie !</h1>
          <p className="text-lg text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
            Merci pour votre générosité. Votre soutien contribue directement à l'impact positif de ce projet.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">ID TRANSACTION</span>
               <span className="text-sm font-black text-neutral-rich">#CONTRIB-{contributionId || '7891'}</span>
            </div>
            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">STATUT</span>
               <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-2">
                 CONFIRMÉ <PartyPopper size={14} />
               </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <Button className="h-16 rounded-2xl flex items-center justify-center gap-3">
                <Download size={20} /> Télécharger le Reçu PDF
             </Button>
             
             <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-14 rounded-2xl flex items-center justify-center gap-2" onClick={() => navigate('/dashboard')}>
                   Dashboard
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl flex items-center justify-center gap-2 bg-neutral-rich text-white border-neutral-rich hover:bg-black">
                   <Share2 size={18} /> Partager
                </Button>
             </div>
          </div>
        </div>

        <div className="mt-12 text-center">
           <Link to="/projects" className="text-sm font-black text-primary-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-2">
              Découvrir d'autres projets <ArrowRight size={16} />
           </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
