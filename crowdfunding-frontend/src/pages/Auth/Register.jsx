import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import RegisterForm from '../../components/auth/RegisterForm';
import { ShieldCheck, Sparkles, Award, Globe, Lock } from 'lucide-react';
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

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      
      {/* Left Side: Brand Experience */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-8 xl:p-12 overflow-hidden">
        {/* Background with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=1200" 
            alt="African innovation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-900/95 to-primary-800/90" />
        </div>

        {/* Logo */}
        <div className="relative z-10 text-center lg:text-left">
          <Link to="/" className="inline-flex items-center gap-3 group">
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
        <div className="relative z-10 max-w-md mx-auto">
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            L'excellence <br />
            <span className="text-primary-400 mt-2 block">africaine</span> commence ici.
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-12">
            Rejoignez une communauté d'investisseurs et d'entrepreneurs visionnaires pour bâtir le continent de demain.
          </p>

          <div className="flex gap-8 justify-center lg:justify-start">
            {stats.slice(0, 2).map((stat, idx) => (
              <div key={idx}>
                <span className="block text-3xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-xs font-medium text-primary-200 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badge */}
        <div className="relative z-10 flex items-center gap-2 text-primary-300 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
           <ShieldCheck className="w-4 h-4" />
           Plateforme certifiée AES-256
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
           {/* Form Header */}
           <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Créer un compte</h1>
            <p className="text-slate-500 font-medium">Bâtissons ensemble l'avenir de l'Afrique.</p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-xl mb-8">
             <Link to="/login" className="py-2.5 px-4 text-sm font-semibold rounded-lg text-slate-500 hover:text-slate-700 text-center transition-all">Se connecter</Link>
             <div className="py-2.5 px-4 text-sm font-semibold rounded-lg bg-white text-primary-700 shadow-sm border border-slate-200 text-center">S'inscrire</div>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-6"
              onClose={() => dispatch(clearError())}
            />
          )}

          <RegisterForm />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">Ou s'inscrire avec</span>
            </div>
          </div>

          {/* Social Register */}
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
                text="signup_with"
                locale="fr"
              />
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            Vous avez déjà un compte ?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;