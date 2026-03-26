import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from '../../components/auth/LoginForm';
import { ShieldCheck, ArrowUpRight, CheckCircle2, Sparkles, Award, Globe, Lock } from 'lucide-react';
import Button from '@components/common/Button';
import Alert from '@components/common/Alert';
import { GoogleLogin } from '@react-oauth/google';
import { googleLogin, clearError } from '@store/slices/authSlice';
import { toast } from 'react-toastify';

const stats = [
  { label: 'FCFA Financés', value: '150M+', icon: <Award className="w-4 h-4" /> },
  { label: 'Projets Actifs', value: '1.2k', icon: <Globe className="w-4 h-4" /> },
  { label: 'Taux Réussite', value: '98%', icon: <Sparkles className="w-4 h-4" /> },
];

const trustBadges = [
  { icon: <ShieldCheck className="w-4 h-4" />, label: 'Sécurité Bancaire', description: 'AES-256 & JWT' },
  { icon: <Lock className="w-4 h-4" />, label: 'Transactions Sécurisées', description: 'FCFA Direct' },
  { icon: <Sparkles className="w-4 h-4" />, label: 'Protection IA', description: 'Anti-fraude' },
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Only redirect if they organically visit /login while already logged in
    // LoginForm handles explicit login submission routing
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* Left Side - Brand Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 xl:p-12 overflow-hidden">
        {/* Background with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200"
            alt="African innovation and technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/95 to-primary-800/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Invest<span className="text-primary-400">AFRIKA</span>
            </span>
          </Link>
        </div>

        {/* Main Message */}
        <div className="relative z-10 max-w-xl mx-auto text-center lg:text-left">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Propulsez l'avenir de
            <span className="block text-primary-400 mt-2">l'Afrique</span>
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            Connectez-vous à votre espace sécurisé pour gérer vos projets ou
            suivre vos portefeuilles d'investissements en temps réel.
          </p>

          {/* Stats */}
          <div className="flex justify-center lg:justify-start gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  {stat.icon}
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="text-xs font-medium text-primary-200 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Footer */}
        <div className="relative z-10 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-primary-300">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {badge.icon}
              <span className="font-medium">{badge.label}</span>
              <span className="text-primary-400">•</span>
              <span className="text-primary-200">{badge.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-primary-900">
                Invest<span className="text-primary-600">AFRIKA</span>
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900">Bienvenue</h2>
            <p className="text-slate-500 mt-1">Connectez-vous à votre compte</p>
          </div>

          {/* Form Header */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">De retour parmi nous</h2>
            <p className="text-slate-500">
              Connectez-vous pour continuer à propulser l'excellence africaine.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-xl mb-8">
            <button
              className="py-2.5 px-4 text-sm font-semibold rounded-lg bg-white text-primary-700 shadow-sm border border-slate-200 transition-all"
            >
              Connexion
            </button>
            <Link
              to="/register"
              className="py-2.5 px-4 text-sm font-semibold rounded-lg text-slate-500 hover:text-slate-700 text-center transition-all"
            >
              Inscription
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-6"
              onClose={() => dispatch(clearError())}
            />
          )}

          {/* Login Form */}
          <LoginForm />

          {/* Additional Options */}
          <div className="mt-6 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-600">Se souvenir de moi</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">Ou continuer avec</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="flex flex-col gap-3">
            <GoogleLogin
              onSuccess={credentialResponse => {
                dispatch(googleLogin(credentialResponse.credential))
                  .unwrap()
                  .then((payload) => {
                    toast.success('Bienvenue !');
                    if (payload.role === 'ADMIN') {
                      navigate('/admin/dashboard');
                    } else if (payload.role === 'PORTEUR_PROJET') {
                      navigate('/porteur/dashboard');
                    } else {
                      navigate('/investisseur/dashboard');
                    }
                  });
              }}
              onError={() => toast.error('Échec de la connexion Google')}
              theme="outline"
              shape="pill"
              size="large"
              text="continue_with"
              locale="fr"
            />
            
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">Continuer avec LinkedIn</span>
            </button>
          </div>

          {/* Mobile Trust Badges */}
          <div className="lg:hidden mt-8 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap justify-center gap-4">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div className="text-primary-500">{badge.icon}</div>
                  <span className="text-xs text-slate-500">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-500 mt-8 lg:hidden">
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;