import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Mail, ShieldCheck, Lock, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../common/Button';

const ForgotPasswordForm = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            toast.success("Un code de vérification a été envoyé à votre email.");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de l'envoi du code");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.verifyCode(email, code);
            toast.success("Code vérifié avec succès !");
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || "Code invalide ou expiré");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Les mots de passe ne correspondent pas");
        }
        setLoading(true);
        try {
            // Dans notre backend, le 'token' attendu par resetPassword est le code qu'on vient de vérifier
            await authService.resetPassword(code, newPassword);
            toast.success("Votre mot de passe a été réinitialisé avec succès !");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la réinitialisation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Progress indicator */}
            <div className="flex justify-between mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                {[1, 2, 3].map((s) => (
                    <div 
                        key={s} 
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 shadow-sm ${
                            step >= s ? 'bg-primary-600 text-white scale-110 shadow-primary-200' : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                    >
                        {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                    </div>
                ))}
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
                
                {step === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Mot de passe oublié ?</h2>
                            <p className="text-slate-500 font-medium">Entrez votre email pour recevoir un code.</p>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium bg-slate-50/50"
                                    placeholder="nom@exemple.com"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            fullWidth 
                            loading={loading}
                            rightIcon={<ArrowRight className="w-5 h-5" />}
                            className="py-4 shadow-xl shadow-primary-500/25"
                        >
                            Envoyer le code
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Vérification</h2>
                            <p className="text-slate-500 font-medium">Saisissez le code de 6 chiffres envoyé à <br/><span className="text-primary-600 font-bold">{email}</span></p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Code de sécurité</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-black text-xl tracking-[0.5em] text-center bg-slate-50/50"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            fullWidth 
                            loading={loading}
                            className="py-4 shadow-xl shadow-primary-500/25"
                        >
                            Vérifier le code
                        </Button>

                        <button 
                            type="button" 
                            onClick={handleSendCode}
                            className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-sm transition-colors py-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Renvoyer le code
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Nouveau mot de passe</h2>
                            <p className="text-slate-500 font-medium">Choisissez un mot de passe robuste.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Nouveau mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium bg-slate-50/50"
                                        placeholder="Min. 6 caractères"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirmer le mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium bg-slate-50/50"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            fullWidth 
                            loading={loading}
                            className="py-4 shadow-xl shadow-primary-500/25"
                        >
                            Réinitialiser maintenant
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordForm;