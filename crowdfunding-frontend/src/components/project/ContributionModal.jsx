import React, { useState, useEffect } from 'react';
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
  Gift,
  Lock,
  ChevronRight,
  SmartphoneIcon
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatCurrency } from '@utils/formatters';
import contributionService from '@services/contributionService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ContributionModal = ({ isOpen, onClose, project, user, onSuccess }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState('MOBILE_MONEY');
  const [step, setStep] = useState('AMOUNT'); // AMOUNT -> PAYMENT -> SIMULATION -> SUCCESS
  const [loading, setLoading] = useState(false);
  const [contributionId, setContributionId] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);

  // Rewards logic
  const rewards = project?.rewards || [];

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleInitiate = async () => {
    setLoading(true);
    try {
      const response = await contributionService.initiateContribution({
        projetId: project.id,
        utilisateurId: user?.id,
        amount: amount,
        paiementType: paymentMethod,
        currency: 'XAF',
        rewardId: selectedReward?.id
      });
      
      const { data } = response;
      setContributionId(data.id);
      setStep('SIMULATION');
      
      // Verification logic: 
      // This is where real integration would happen.
      // For simulation, we wait for a few seconds.
    } catch (err) {
      console.error('Erreur initiation:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de l’initiation du paiement';
      
      if (errorMessage.includes('KYC')) {
        toast.warning("Limite d'investissement atteinte. Redirection vers la vérification KYC...");
        setTimeout(() => {
          onClose();
          navigate('/kyc');
        }, 3000);
      } else {
        toast.error(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleConfirmSimulation = async () => {
    setLoading(true);
    try {
      await contributionService.confirmContribution(contributionId);
      setStep('SUCCESS');
      if (onSuccess) onSuccess();
      toast.success('Contribution confirmée ! Merci pour votre soutien.');
    } catch (err) {
      console.error('Erreur confirmation:', err);
      toast.error('Échec de la simulation de paiement.');
      setStep('PAYMENT');
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

            {/* Reward Display */}
            <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-white/50">
               <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-amber-50 rounded-2xl">
                     <Gift className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-black text-slate-900">Contreparties éligibles</p>
                     <p className="text-xs text-slate-500 font-medium">Récompense pour votre soutien</p>
                  </div>
               </div>
               
               {rewards.length > 0 ? (
                 <div className="space-y-3">
                   {rewards.filter(r => amount >= r.montantMinimum).map(r => (
                     <div key={r.id} className="bg-white p-4 rounded-xl border border-emerald-100 flex items-center justify-between group">
                        <div className="flex-1">
                          <p className="text-xs font-black text-slate-900 mb-1">{r.titre}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{r.description}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-100" />
                     </div>
                   ))}
                   {rewards.filter(r => amount < r.montantMinimum).length > 0 && (
                     <p className="text-[10px] text-center text-slate-400 font-bold italic">
                       Augmentez votre don pour débloquer d'autres récompenses.
                     </p>
                   )}
                 </div>
               ) : (
                 <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 italic">"Remerciements sur nos réseaux sociaux et accès anticipé au produit."</p>
                 </div>
               )}
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
                 { id: 'STRIPE', name: 'Carte Bancaire', icon: CreditCard, desc: 'Visa, Mastercard (Frais Stripe applicables)' }
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

      case 'SIMULATION':
        return (
          <div className="py-8 text-center animate-in zoom-in duration-500">
             {paymentMethod === 'MOBILE_MONEY' ? (
               <div className="space-y-6">
                  <div className="w-20 h-32 bg-slate-900 rounded-3xl mx-auto border-4 border-slate-800 relative p-4 flex flex-col justify-center items-center gap-2 overflow-hidden shadow-2xl">
                     <div className="absolute top-1 w-8 h-1 bg-slate-800 rounded-full" />
                     <SmartphoneIcon className="w-8 h-8 text-emerald-500 animate-bounce" />
                     <div className="w-full space-y-1">
                        <div className="h-1 bg-white/20 rounded w-full" />
                        <div className="h-1 bg-white/20 rounded w-2/3 mx-auto" />
                     </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Validation Mobile</h3>
                    <p className="text-sm text-slate-500 font-medium px-4">
                      Veuillez valider l'opération de <span className="text-slate-900 font-bold">{formatCurrency(amount)}</span> sur votre téléphone en saisissant votre code secret.
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 max-w-xs mx-auto">
                     <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                     <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">En attente de validation USSD...</span>
                  </div>
                  <Button 
                    variant="emerald" 
                    size="sm" 
                    className="rounded-xl px-10" 
                    onClick={handleConfirmSimulation}
                    loading={loading}
                  >
                    Simuler Validation (OK)
                  </Button>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="max-w-xs mx-auto bg-gradient-to-br from-slate-800 to-black p-6 rounded-2xl text-white text-left shadow-2xl relative overflow-hidden h-44 flex flex-col justify-between">
                     <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                     <div className="flex justify-between items-start">
                        <div className="w-10 h-8 bg-amber-400/80 rounded-md" />
                        <CreditCard className="w-8 h-8 text-white/50" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-mono tracking-widest">**** **** **** 4242</p>
                        <div className="flex justify-between text-[8px] uppercase font-bold text-slate-400">
                           <span>{user?.nom || 'CARD HOLDER'}</span>
                           <span>12/26</span>
                        </div>
                     </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Authentification 3D Secure</h3>
                    <p className="text-sm text-slate-500 font-medium px-4">
                      Votre banque demande une confirmation pour le paiement par carte.
                    </p>
                  </div>
                  <Button 
                    variant="emerald" 
                    size="sm" 
                    className="rounded-xl px-10" 
                    onClick={handleConfirmSimulation}
                    loading={loading}
                  >
                    Simuler Succès 3DS
                  </Button>
               </div>
             )}
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
             <Button variant="emerald" className="w-full py-4 rounded-2xl font-black" onClick={onClose}>
               Fermer l'espace paiement
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
