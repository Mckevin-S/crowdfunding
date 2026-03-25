import React from 'react';
import { ShieldCheck, Target, Zap, Users, Globe, Award } from 'lucide-react';
import Button from '../components/common/Button';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-[#022c22] overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-900/50 rounded-bl-[10rem] -z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Démocratiser l'investissement <br />
              <span className="text-primary-400">par l'intelligence.</span>
            </h1>
            <p className="text-xl text-emerald-100/80 leading-relaxed font-medium mb-12 italic">
              InvestAFRIKA est née d'une vision simple : connecter le génie entrepreneurial africain aux capitaux mondiaux grâce à une technologie de confiance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div>
                <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.3em] mb-4">Notre Vision</h2>
                <h3 className="text-4xl font-display font-black text-slate-900 mb-8 tracking-tight">
                  Construire le pont technologique du futur.
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  Nous croyons que l'Afrique de l'Ouest regorge de talents et d'idées capables de transformer le monde. Notre mission est d'éliminer les barrières de confiance et de distance entre les épargnants et les porteurs de projets innovants.
                </p>
                <div className="space-y-4">
                   {[
                     "Transparence totale via la Blockchain & IA",
                     "Sécurité bancaire certifiée UEMOA",
                     "Impact social et économique mesurable",
                     "Accompagnement personnalisé des talents"
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-slate-800 font-bold">{item}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="relative">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl">
                   <img 
                     src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                     alt="Team working"
                     className="w-full h-full object-cover aspect-square"
                   />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-xs">
                   <Award className="w-12 h-12 text-primary-500 mb-4" />
                   <p className="text-sm font-black text-slate-900 mb-2 uppercase">Certifié Hub de Confiance</p>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">Reconnu par les régulateurs comme la plateforme la plus sûre pour le financement de proximité.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
           <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl font-display font-black text-primary-900 mb-6 tracking-tighter">Nos piliers fondamentaux</h2>
              <p className="text-slate-500 font-medium italic">Une approche rigoureuse pour des résultats durables.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'IA Éthique', icon: <Zap />, desc: 'Notre algorithme évalue les projets sur leur viabilité et leur impact réel, sans biais.' },
                { title: 'Proximité', icon: <Globe />, desc: 'Nous sommes ancrés localement pour comprendre les réalités du terrain ouest-africain.' },
                { title: 'Sécurité', icon: <ShieldCheck />, desc: 'Chaque transaction est protégée par les protocoles les plus stricts du marché.' },
              ].map((value, i) => (
                <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                   <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                      {value.icon}
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 mb-4">{value.title}</h4>
                   <p className="text-slate-500 leading-relaxed font-medium">{value.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-black text-primary-900 mb-12 leading-tight max-w-3xl mx-auto">
               Faites partie de la révolution de l'investissement en Afrique.
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Button size="lg" className="rounded-xl px-12 h-16 text-lg bg-primary-900">Ouvrir un compte</Button>
               <Button size="lg" variant="outline" className="rounded-xl px-12 h-16 text-lg">Devenir partenaire</Button>
            </div>
         </div>
      </section>
    </div>
  );
};

// Helper components - CheckCircle2 was missing in the icon imports above but used
import { CheckCircle2 } from 'lucide-react';

export default About;
