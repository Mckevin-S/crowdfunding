import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Check, AlertCircle, Loader2 } from 'lucide-react';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import contributionService from '@services/contributionService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ContributionModal = ({ isOpen, onClose, project, user }) => {
  const [amount, setAmount] = useState('25000');
  const [paymentMethod, setPaymentMethod] = useState('STRIPE'); // STRIPE or MOBILE_MONEY
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Processing
  const navigate = useNavigate();

  const suggestedAmounts = ['10000', '25000', '50000', '100000'];

  if (!isOpen) return null;

  const calculateFees = () => {
    const amt = parseFloat(amount) || 0;
    if (paymentMethod === 'STRIPE') {
      return (amt * 0.029) + 100;
    } else {
      return (amt * 0.02) + 200;
    }
  };

  const total = parseFloat(amount) + calculateFees();

  const handleInitiate = async () => {
    if (!amount || parseFloat(amount) < 500) {
      toast.error('Le montant minimum est de 500 XAF');
      return;
    }

    const requiresKyc = parseFloat(amount) > 500000 || project.typeFinancement === 'LOAN' || project.typeFinancement === 'EQUITY';

    if (requiresKyc && user?.kycStatus !== 'APPROVED') {
      toast.warning('Veuillez valider votre profil KYC pour investir en capital/prêt ou plus de 500,000 XAF.');
      onClose();
      navigate('/kyc');
      return;
    }

    setLoading(true);
    try {
      // Simulation pour tous les modes de paiement comme demandé par l'utilisateur
      setStep(3); // Étape de chargement/simulation
      
      // Delai de simulation (2.5 secondes)
      setTimeout(async () => {
        try {
          // On notifie tout de même le backend pour créer une trace de contribution (si besoin)
          const data = {
            projetId: project.id,
            utilisateurId: user.id,
            amount: parseFloat(amount),
            paiementType: paymentMethod,
            currency: 'XAF'
          };
          
          await contributionService.initiate(data);
          
          toast.success('Paiement simulé avec succès !');
          onClose();
          navigate(`/payment/success?status=simulated&amount=${amount}`);
        } catch (err) {
          // Même en simulation, on gère les erreurs potentielles du backend
          toast.error('Simulation échouée (erreur serveur)');
          setStep(2);
        } finally {
          setLoading(false);
        }
      }, 2500);

    } catch (error) {
      toast.error('Une erreur est survenue pendant la simulation');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-rich/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-display font-black text-neutral-rich">
              {project.typeFinancement === 'DON' || project.typeFinancement === 'REWARD' ? 'Soutenir ce projet' : 'Investir dans ce projet'}
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{project.titre}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                  {project.typeFinancement === 'DON' || project.typeFinancement === 'REWARD' ? 'Montant de votre don (XAF)' : 'Montant de votre investissement (XAF)'}
                </label>
                <div className="relative">
                  <Input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-black h-16 pl-8"
                    placeholder="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">FCFA</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {suggestedAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-3 rounded-2xl border-2 font-black text-sm transition-all ${
                      amount === amt 
                      ? 'border-primary-500 bg-primary-50 text-primary-600' 
                      : 'border-gray-100 hover:border-primary-200 text-gray-400'
                    }`}
                  >
                    {parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 flex gap-3 border border-emerald-100">
                <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                  100% de votre don est versé directement au porteur du projet. Les frais de transaction sont calculés séparément.
                </p>
              </div>

              <Button fullWidth className="h-14 mt-4" onClick={() => setStep(2)}>Continuer</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Moyen de paiement</label>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`w-full p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${
                    paymentMethod === 'STRIPE' ? 'border-primary-500 bg-primary-50/50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${paymentMethod === 'STRIPE' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <CreditCard size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-rich">Carte Bancaire</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Visa / Mastercard (Stripe)</p>
                    </div>
                  </div>
                  {paymentMethod === 'STRIPE' && <Check className="text-primary-500" />}
                </button>

                <button 
                  onClick={() => setPaymentMethod('MOBILE_MONEY')}
                  className={`w-full p-6 rounded-[2rem] border-2 flex items-center justify-between transition-all ${
                    paymentMethod === 'MOBILE_MONEY' ? 'border-primary-500 bg-primary-50/50' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${paymentMethod === 'MOBILE_MONEY' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Smartphone size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-neutral-rich">Mobile Money</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Orange / MTN Money</p>
                    </div>
                  </div>
                  {paymentMethod === 'MOBILE_MONEY' && <Check className="text-primary-500" />}
                </button>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-[2rem] p-6 space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">
                    {project.typeFinancement === 'DON' || project.typeFinancement === 'REWARD' ? 'Montant du don' : 'Montant investi'}
                  </span>
                  <span className="text-neutral-rich font-bold">{parseFloat(amount).toLocaleString()} XAF</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-400">Frais de traitement</span>
                  <span className="text-neutral-rich font-bold">{calculateFees().toLocaleString()} XAF</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-black text-neutral-rich">TOTAL</span>
                  <span className="text-xl font-black text-primary-600">{total.toLocaleString()} XAF</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-14" onClick={() => setStep(1)}>Retour</Button>
                <Button className="flex-[2] h-14" onClick={handleInitiate} loading={loading}>
                  Confirmer le paiement
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center relative">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
              </div>
              <div>
                <h4 className="text-xl font-display font-black text-neutral-rich">Traitement en cours...</h4>
                <p className="text-sm text-gray-400 font-medium mt-2 max-w-xs">
                  {paymentMethod === 'STRIPE' 
                    ? "Connexion sécurisée avec Stripe..." 
                    : "Veuillez confirmer la transaction sur votre mobile."}
                </p>
              </div>
              <div className="w-full max-w-[200px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 animate-progress-fast" />
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-8 pb-8 flex items-center justify-center gap-2">
            <CreditCard size={14} className="text-gray-300" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Paiement 100% sécurisé via passerelle cryptée</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionModal;
