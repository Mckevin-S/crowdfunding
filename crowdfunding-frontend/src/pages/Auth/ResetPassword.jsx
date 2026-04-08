import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import authService from '../../services/authService';
import Button from '../../components/common/Button';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [token, setToken] = useState(searchParams.get('token') || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.info("Veuillez utiliser le code reçu par email.");
            navigate('/forgot-password');
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Les mots de passe ne correspondent pas");
        }
        setLoading(true);
        try {
            await authService.resetPassword(token, newPassword);
            toast.success("Mot de passe réinitialisé avec succès !");
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Lien invalide ou expiré");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
             {/* Background patterns */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-12 right-1/4 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-20"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100 shadow-sm">
                            <ShieldCheck className="w-8 h-8 text-primary-600" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Réinitialisation</h2>
                        <p className="text-slate-500 font-medium mt-2">Dernière étape pour sécuriser votre compte.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Code de confirmation</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={token}
                                    className="w-full px-4 py-4 rounded-2xl border-2 border-slate-50 bg-slate-100/50 text-slate-400 font-black tracking-widest outline-none cursor-not-allowed"
                                />
                            </div>

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
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirmer le nouveau mot de passe</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
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
                            Changer mon mot de passe
                        </Button>
                    </form>

                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full mt-6 flex items-center justify-center gap-2 text-slate-400 hover:text-primary-600 font-bold text-sm transition-colors py-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Annuler et retourner
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;