import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Gift
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatCurrency } from '@utils/formatters';
import contributionService from '@services/contributionService';
import { toast } from 'react-toastify';

const ContributionModal = ({ isOpen, onClose, project, user, onRewardSelect }) => {
  const [amount, setAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState('MOBILE_MONEY');
  const [step, setStep] = useState('AMOUNT'); // AMOUNT -> PAYMENT -> PROCESSING -> SUCCESS
  const [loading, setLoading] = useState(false);
  const [contributionId, setContributionId] = useState(null);

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleInitiate = async () => {
    setLoading(true);
    try {
      const { data } = await contributionService.initiateContribution({
        projetId: project.id,
        utilisateurId: user?.id,
        amount: amount,
        paiementType: paymentMethod,
        currency: 'XAF'
      });
      setContributionId(data.id);
      setStep('PROCESSING');
      
      // Simulate real payment processing (Mobile Money / Stripe)
      setTimeout(async () => {
        await handleConfirm(data.id);
      }, 3000);
      
    } catch (err) {
      console.error('Erreur initiation:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de l’initiation du paiement');
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await contributionService.confirmContribution(id);
      setStep('SUCCESS');
      toast.success('Contribution confirmée ! Merci pour votre soutien.');
    } catch (err) {
      console.error('Erreur confirmation:', err);
      toast.error('Erreur lors de la confirmation du paiement');
      setStep('AMOUNT');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'AMOUNT':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block underline decoration-emerald-500/30">
                 Montant de votre impact
               </label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-300 group-focus-within:text-emerald-500">FCFA</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] py-6 pl-24 pr-8 text-3xl font-black text-slate-900 focus:border-emerald-500 focus:ring-0 transition-all shadow-inner"
                  />
               </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-10">
               {quickAmounts.map(val => (
                 <button
                   key={val}
                   onClick={() => setAmount(val)}
                   className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${
                     amount === val ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105' : 'bg-white border border-slate-100 text-slate-500 hover:border-emerald-200'
                   }`}
                 >
                   {val / 1000}k
                 </button>
               ))}
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-white/50">
               <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-amber-50 rounded-2xl">
                     <Gift className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-slate-900">Récompense Éligible</p>
                     <p className="text-xs text-slate-500 font-medium">Pour {formatCurrency(amount)}, vous recevrez :</p>
                  </div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-100">
                  <p className="text-sm font-bold text-slate-700 italic">"Remerciements sur nos réseaux sociaux et accès anticipé au produit."</p>
               </div>
            </div>

            <Button 
              variant="emerald" 
              className="w-full py-5 rounded-[1.8rem] text-lg font-black shadow-xl shadow-emerald-500/20 group"
              onClick={() => setStep('PAYMENT')}
            >
              Continuer vers le paiement <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        );

      case 'PAYMENT':
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-emerald-500/30">Choisir un mode sécurisé</h3>
            
            <div className="space-y-4 mb-10">
               {[
                 { id: 'MOBILE_MONEY', name: 'Mobile Money', icon: Smartphone, desc: 'Orange, MTN, Wave (Partout en Afrique)' },
                 { id: 'STRIPE', name: 'Carte Bancaire', icon: CreditCard, desc: 'Visa, Mastercard (Frais Stripe applicables)' },
                 { id: 'CRYPTO', name: 'Crypto Assets', icon: Zap, desc: 'USDT, BTC (Via CryptoPay Africa)' }
               ].map(method => (
                 <button
                   key={method.id}
                   onClick={() => setPaymentMethod(method.id)}
                   className={`w-full flex items-center gap-4 p-5 rounded-[1.8rem] border-2 transition-all ${
                     paymentMethod === method.id ? 'border-emerald-500 bg-emerald-50/50 shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200'
                   }`}
                 >
                   <div className={`p-4 rounded-2xl ${paymentMethod === method.id ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <method.icon className="w-6 h-6" />
                   </div>
                   <div className="text-left">
                      <p className="text-sm font-black text-slate-900">{method.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{method.desc}</p>
                   </div>
                   {paymentMethod === method.id && <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto" />}
                 </button>
               ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 py-4 rounded-2xl font-bold" onClick={() => setStep('AMOUNT')}>Retour</Button>
              <Button 
                variant="emerald" 
                className="flex-[2] py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20"
                onClick={handleInitiate}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Confirmer ${formatCurrency(amount)}`}
              </Button>
            </div>
          </div>
        );

      case 'PROCESSING':
        return (
          <div className="py-16 text-center animate-in zoom-in duration-500">
             <div className="relative w-32 h-32 mx-auto mb-10">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                <div className="absolute inset-4 rounded-full bg-emerald-50 flex items-center justify-center">
                   <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </div>
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Sécurisation du transfert...</h3>
             <p className="text-slate-500 font-medium italic mb-2">Simulation du flux {paymentMethod === 'MOBILE_MONEY' ? 'USSD' : 'Stripe Gateway'}.</p>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Ne fermez pas cette fenêtre</p>
          </div>
        );

      case 'SUCCESS':
        return (
          <div className="py-10 text-center animate-in zoom-in duration-700">
             <div className="w-24 h-24 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
             </div>
             <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Contribution Réussie ! 🎉</h3>
             <p className="text-slate-500 font-medium mb-10 max-w-xs mx-auto text-lg leading-relaxed">
               Vous venez de soutenir <span className="text-slate-900 font-black">"{project.titre}"</span> à hauteur de <span className="text-emerald-600 font-black">{formatCurrency(amount)}</span>.
             </p>
             <div className="bg-slate-50 p-6 rounded-[2rem] mb-10 border border-white">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Numéro de Reçu</p>
                <p className="text-sm font-black text-slate-900 font-mono">IA-{contributionId}-2026</p>
             </div>
             <Button variant="emerald" className="w-full py-4 rounded-2xl font-black" onClick={() => {
               onClose();
               window.location.reload(); // Quick refresh to update stats
             }}>
               Retour au projet
             </Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-600 to-teal-700 -z-10" />
        
        <div className="p-8 pb-4 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                 <Wallet className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-black text-white tracking-tight">Soutenir ce Projet</h2>
           </div>
           <button 
             onClick={onClose}
             className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors text-white"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        <div className="p-8 pt-6">
           {renderStep()}
        </div>

        <div className="bg-slate-50/80 p-6 border-t border-slate-100 flex items-center justify-center gap-6">
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Paiement 100% Sécurisé</span>
           </div>
           <div className="h-4 w-px bg-slate-200" />
           <div className="flex items-center gap-2 opacity-50">
              <Badge variant="outline" className="!text-[8px] px-2 py-0.5 !rounded-lg border-slate-200">MODE SIMULATION</Badge>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionModal;
