import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Headphones, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#022c22] pt-24 pb-12 text-white border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2 mb-8">
              {/* Re-using the logo style from Login/Register for consistency */}
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                 <svg className="w-6 h-6 fill-current rotate-[-8deg]" viewBox="0 0 24 24">
                    <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                 </svg>
              </div>
              <span className="text-2xl font-display font-black text-white tracking-tighter">
                Invest<span className="text-primary-400">AFRIKA</span>
              </span>
            </Link>
            <p className="text-emerald-100/60 text-sm leading-relaxed font-medium italic">
              La première plateforme de financement participatif propulsée par l'Intelligence Artificielle en Afrique de l'Ouest.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-grow justify-end">
             <div>
               <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-8">Plateforme</h4>
               <ul className="space-y-4 text-xs font-bold text-white/50">
                  <li><Link to="/projects" className="hover:text-primary-400 transition-colors">Explorer les projets</Link></li>
                  <li><Link to="/about" className="hover:text-primary-400 transition-colors">Notre vision IA</Link></li>
                  <li><Link to="/invest" className="hover:text-primary-400 transition-colors">Comment Investir</Link></li>
               </ul>
             </div>
             <div>
               <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-8">Légalité</h4>
               <ul className="space-y-4 text-xs font-bold text-white/50">
                  <li><Link to="/terms" className="hover:text-primary-400 transition-colors">Conditions Générales</Link></li>
                  <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">Politique de Sécurité</Link></li>
                  <li><Link to="/cookies" className="hover:text-primary-400 transition-colors">Confidentialité</Link></li>
               </ul>
             </div>
             <div>
               <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-8">Ressources</h4>
               <ul className="space-y-4 text-xs font-bold text-white/50">
                  <li><Link to="/blog" className="hover:text-primary-400 transition-colors">Actualités Tech</Link></li>
                  <li><Link to="/help" className="hover:text-primary-400 transition-colors">Centre d'aide</Link></li>
                  <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Nous contacter</Link></li>
               </ul>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/10 text-[10px] font-black text-emerald-100/20 uppercase tracking-[0.2em]">
           <p>© 2024 InvestAfrika. Technologie de confiance par l'IA.</p>
           <div className="flex items-center gap-8 mt-6 md:mt-0">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> SECURE SSL</span>
              <span className="flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-500" /> WEST AFRICA</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;