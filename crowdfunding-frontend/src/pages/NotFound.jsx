import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass, Search, MapPinOff, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 relative overflow-hidden bg-white">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-100/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Visual Composition (Without external image) */}
        <div className="order-2 lg:order-1 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-black rounded-[4rem] rotate-3 opacity-10 blur-xl" />
            <div className="absolute inset-0 bg-white rounded-[4rem] border border-gray-100 shadow-2xl flex items-center justify-center overflow-hidden">
              
              {/* Abstract African Pattern Background (CSS only) */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#064e3b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              
              <div className="relative z-10 flex flex-col items-center">
                {/* Large Stylized 404 Icon */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full" />
                  <div className="w-32 h-32 bg-primary-900 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl rotate-12 transition-transform hover:rotate-0 duration-700">
                    <MapPinOff className="w-16 h-16" />
                  </div>
                </div>
                
                <div className="text-center space-y-2">
                  <span className="text-8xl font-display font-black text-gray-100 tracking-tighter">404</span>
                  <div className="h-1.5 w-12 bg-secondary-500 mx-auto rounded-full" />
                </div>
              </div>

              {/* Decorative Floating Elements */}
              <div className="absolute top-12 right-12 animate-pulse">
                <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
              <div className="absolute bottom-16 left-12 animate-bounce duration-[4000ms]">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <Compass className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Orbiting Sparkle */}
            <div className="absolute -top-4 -left-4 animate-spin-slow">
               <Sparkles className="w-10 h-10 text-secondary-400 opacity-50" />
            </div>
          </div>
        </div>

        {/* Textual Content */}
        <div className="order-1 lg:order-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-2xl text-xs font-black uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Destination inconnue
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 mb-8 tracking-tighter leading-[0.9]">
            Perdu dans <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-emerald-600 to-secondary-600">le futur ?</span>
          </h1>
          
          <p className="text-xl text-slate-500 font-medium max-w-lg mb-12 opacity-80 leading-relaxed mx-auto lg:mx-0">
            Il semble que vous ayez bifurqué de la route principale. Aucune inquiétude, l'aventure continue sur de nouveaux projets !
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
            <Link to="/">
              <Button 
                size="lg"
                className="rounded-2xl px-12 h-16 text-lg bg-primary-900 shadow-xl shadow-primary-900/20 group hover:scale-[1.02] transition-all"
                leftIcon={<Home className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
              >
                Retour à l'Accueil
              </Button>
            </Link>
            
            <Button 
              size="lg"
              variant="ghost"
              onClick={() => window.history.back()}
              className="rounded-2xl px-8 h-16 text-slate-500 font-bold hover:bg-slate-50 border-2 border-transparent hover:border-slate-100"
              leftIcon={<ArrowLeft className="w-6 h-6" />}
            >
              Page précédente
            </Button>
          </div>

          {/* Quick Explore */}
          <div className="mt-20 pt-10 border-t border-gray-100">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Continuer l'exploration</h4>
            <div className="flex flex-wrap gap-x-10 gap-y-4 justify-center lg:justify-start font-bold text-sm text-slate-400">
              <Link to="/projects" className="hover:text-primary-600 transition-colors uppercase">Tous les Projets</Link>
              <RouteLink to="/about" text="L'Innovation" />
              <RouteLink to="/contact" text="Besoin d'aide ?" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const RouteLink = ({ to, text }) => (
  <Link to={to} className="hover:text-primary-600 transition-colors uppercase flex items-center gap-2 group">
    {text}
    <div className="w-0 h-0.5 bg-primary-600 group-hover:w-4 transition-all" />
  </Link>
);

export default NotFound;