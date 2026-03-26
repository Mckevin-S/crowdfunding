import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  CheckCircle2,
  Users,
  Target,
  BarChart3,
  Globe,
  PlusCircle,
  Headphones,
  Sparkles,
  ArrowUpRight,
  Lightbulb,
  Building2,
  Sprout
} from 'lucide-react';
import Button from '@components/common/Button';
import ProjectCard from '@components/project/ProjectCard';
import { fetchFeaturedProjects } from '@store/slices/projectSlice';
import Loader from '@components/common/Loader';
import clsx from 'clsx';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredProjects, loading } = useSelector(state => state.project);
  const [activeTab, setActiveTab] = useState('investor');

  useEffect(() => {
    dispatch(fetchFeaturedProjects());
  }, [dispatch]);

  const stats = [
    { label: 'Capitaux Mobilisés', value: '150M+', suffix: 'FCFA', desc: 'Soutien direct à l\'économie locale' },
    { label: 'Projets Accompagnés', value: '1.2k', suffix: '+', desc: 'Innovation & Impact Social' },
    { label: 'Success Rate (IA)', value: '98%', suffix: 'Succès', hasIcon: true, desc: 'Fiabilité algorithmique' },
  ];

  const categories = [
    { name: 'Agriculture', icon: <Sprout />, count: '450+', color: 'emerald' },
    { name: 'Technologie', icon: <Zap />, count: '320+', color: 'primary' },
    { name: 'Infrastructure', icon: <Building2 />, count: '180+', color: 'blue' },
    { name: 'Éducation', icon: <Lightbulb />, count: '120+', color: 'amber' },
  ];

  return (
    <div className="relative bg-white overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-40 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] bg-[#f8fafc] rounded-bl-[20rem] -z-10 rotate-1 shadow-inner" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-primary-100/30 rounded-full blur-[120px] -z-20 animate-pulse" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none -z-10" style={{ backgroundImage: 'radial-gradient(#064e3b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

            {/* Content Left */}
            <div className="lg:col-span-6 space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white shadow-xl shadow-primary-900/5 rounded-2xl border border-gray-100 group transition-all hover:border-primary-100 cursor-default">
                <div className="p-1.5 bg-primary-900 rounded-lg text-white">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-900/60">
                  L'Innovation Crowdfunding <span className="text-primary-900">Propulsée par l'IA</span>
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-display font-black text-primary-900 leading-[0.9] tracking-tighter">
                Investissez dans <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-emerald-600 to-primary-900">
                   l'Émergence Africaine.
                </span>
              </h1>

              <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed opacity-90">
                La première plateforme de financement participatif en zone UEMOA qui utilise l'intelligence prédictive pour sécuriser vos investissements et maximiser votre impact local.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Button
                  size="lg"
                  className="rounded-2xl px-12 h-20 text-xl bg-primary-900 shadow-2xl shadow-primary-900/20 group hover:scale-[1.02] transition-all"
                  onClick={() => navigate('/projects')}
                  rightIcon={<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                >
                  Explorer les Opportunités
                </Button>
                <Link to="/projects/create" className="flex items-center justify-center px-10 h-20 font-black text-slate-400 hover:text-primary-600 transition-all uppercase tracking-widest text-xs group">
                  Soumettre un Projet
                  <ArrowUpRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-10 flex items-center gap-8 border-t border-gray-100 mt-16 overflow-x-auto no-scrollbar">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200">
                      <img src={`https://i.pravatar.cc/40?img=${i+10}`} alt="user" className="rounded-full" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-900 flex items-center justify-center text-white text-[10px] font-bold">
                    +12k
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-100" />
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                   Approuvé par <span className="text-primary-900">InvestAFRIKA Governance</span>
                </p>
              </div>
            </div>

            {/* Visual Right */}
            <div className="lg:col-span-6 relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <div className="relative rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(6,78,59,0.15)] group">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"
                  alt="African Entrepreneur"
                  className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition-transform duration-[20s]"
                />
                
                {/* AI Overlay Card - High Gloss */}
                <div className="absolute bottom-10 left-8 right-8 p-10 bg-white/80 backdrop-blur-2xl rounded-[3rem] border border-white/50 shadow-2xl transform hover:-translate-y-2 transition-transform duration-500">
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Analyse en cours...</span>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[10px] font-black">CONFIDENCE 98.4%</div>
                   </div>
                   
                   <h3 className="text-xl font-display font-black text-primary-900 mb-4 tracking-tighter">Projet "Sénégal Vert"</h3>
                   <p className="text-sm text-slate-500 font-medium italic mb-6 leading-relaxed">
                     "La structure de financement actuelle et les données satellites confirment un rendement prévisionnel triple impact."
                   </p>
                   
                   <div className="flex items-center gap-6 pt-6 border-t border-gray-100/50">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ROI Prévu</p>
                        <p className="text-lg font-bold text-primary-900">+14% / an</p>
                      </div>
                      <div className="w-px h-8 bg-gray-100" />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risque</p>
                        <p className="text-lg font-bold text-emerald-600">FAIBLE</p>
                      </div>
                   </div>
                </div>

                {/* Decorative Badges */}
                <div className="absolute top-12 left-12 w-16 h-16 bg-white/90 backdrop-blur-lg rounded-2xl flex items-center justify-center text-primary-900 shadow-xl">
                   <ShieldCheck className="w-8 h-8" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FLOATING STATS BAR --- */}
      <div className="container mx-auto px-6 -mt-24 relative z-20">
        <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-50 overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 p-10 md:p-14 transition-all hover:bg-gray-50/50 group">
              <div className="flex flex-col">
                <span className="text-5xl md:text-6xl font-display font-black text-primary-900 mb-2 truncate flex items-center gap-4">
                  {stat.value}
                  <small className="text-xl text-slate-300 font-bold -ml-2">{stat.suffix}</small>
                  {stat.hasIcon && <CheckCircle2 className="w-8 h-8 text-emerald-500 group-hover:rotate-12 transition-transform" />}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-600 mb-4">{stat.label}</span>
                <p className="text-xs text-slate-400 font-bold opacity-60 max-w-[180px] leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CATEGORIES SECTION --- */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-primary-900 mb-6 tracking-tighter italic">L'Afrique qui gagne.</h2>
            <div className="h-1.5 w-20 bg-secondary-500 mx-auto rounded-full mb-6" />
            <p className="text-slate-500 font-medium">Explorez les secteurs porteurs sélectionnés pour leur potentiel d'impact social et financier.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <button key={i} className="group relative p-10 bg-gray-50 rounded-[3rem] border border-transparent hover:border-primary-100 hover:bg-white hover:shadow-2xl transition-all duration-500 text-left overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 text-primary-900 group-hover:bg-primary-900 group-hover:text-white transition-all scale-110">
                  {cat.icon}
                </div>
                <h4 className="text-xl font-display font-black text-primary-900 mb-2">{cat.name}</h4>
                <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">{cat.count} Opportunités</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS --- */}
      <section className="py-32 bg-[#F9FBFA] relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 -z-10" />

        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
               <div className="flex items-center gap-3 mb-6">
                 <div className="h-px w-10 bg-primary-900" />
                 <span className="text-xs font-black uppercase tracking-[0.3em] text-primary-900">La Sélection</span>
               </div>
              <h2 className="text-5xl md:text-6xl font-display font-black text-primary-900 mb-6 tracking-tighter">
                Projets <span className="text-emerald-600 underline decoration-primary-900/10 underline-offset-12">Certifiés</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium italic opacity-80">
                Nos analystes et algorithmes ont présélectionné ces campagnes pour leur viabilité technique et leur solidité financière.
              </p>
            </div>
            
            <Link 
              to="/projects" 
              className="group flex items-center gap-3 px-8 h-16 border-2 border-primary-900/5 hover:border-primary-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-primary-900 transition-all hover:bg-white"
            >
              Voir tout le catalogue
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader size="xl" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Chargement des pépites...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredProjects && featuredProjects.length > 0 ? (
                featuredProjects.slice(0, 3).map(project => (
                  <div key={project.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ProjectCard project={project} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-24 bg-white/50 border border-dashed border-gray-100 rounded-[3rem] text-center">
                   <Target className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                   <p className="text-2xl font-display font-black text-slate-300 italic">Aucun projet actif. Soyez le premier pionnier !</p>
                   <Link to="/projects/create" className="text-primary-600 font-bold underline mt-4 inline-block">Lancer ma campagne</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* --- HOW IT WORKS (REWORKED) --- */}
      <section className="py-40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-display font-black text-primary-900 mb-6 tracking-tighter leading-none">
              Simple. <span className="text-secondary-500">Transparent.</span> <br />
              Démocratique.
            </h2>
          </div>

          <div className="flex justify-center mb-20">
            <div className="p-2 bg-gray-50 rounded-2xl flex gap-2">
              <button 
                onClick={() => setActiveTab('investor')}
                className={clsx(
                  "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === 'investor' ? "bg-primary-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Investisseurs
              </button>
              <button 
                onClick={() => setActiveTab('creator')}
                className={clsx(
                  "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === 'creator' ? "bg-primary-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Entrepreneurs
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { id: '01', title: 'Certification', icon: <ShieldCheck />, desc: 'Validation de votre profil via KYC sécurisé par IA.' },
              { id: '02', title: 'Intelligence', icon: <Zap />, desc: 'Découvrez des projets alignés sur votre profil de risque.' },
              { id: '03', title: 'Action', icon: <PlusCircle />, desc: 'Financement sécurisé via Mobile Money & Cartes.' },
              { id: '04', title: 'Impact', icon: <BarChart3 />, desc: 'Suivi transparent des étapes & dividendes en temps réel.' },
            ].map((step, i) => (
              <div key={i} className="group flex flex-col items-center text-center space-y-8 p-10 rounded-[3rem] hover:bg-gray-50/50 transition-all">
                <div className="relative">
                  <span className="absolute -top-6 -right-6 text-7xl font-black text-gray-100 group-hover:text-primary-50 transition-colors z-0">{step.id}</span>
                  <div className="w-20 h-20 bg-primary-900 rounded-[1.5rem] flex items-center justify-center text-white scale-110 shadow-2xl z-10 relative">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-2xl font-display font-black text-primary-900 pt-4">{step.title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA POSTER STYLE --- */}
      <section className="py-40 px-6 bg-white relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#064e3b 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
        
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary-900 rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-[0_60px_100px_-20px_rgba(6,78,59,0.3)]">
            {/* Animated Light Blobs */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl md:text-8xl font-display font-black leading-[0.85] tracking-tighter">
                Le futur ne <br /> <span className="text-emerald-400">s'attend pas.</span> <br />
                Il se finance.
              </h2>
              
              <p className="text-xl md:text-2xl text-emerald-100 max-w-2xl mx-auto italic font-medium opacity-80 leading-relaxed">
                Rejoignez 12,000+ visionnaires qui façonnent la souveraineté économique de l'Afrique.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button
                  className="bg-white text-primary-900 h-20 px-16 rounded-2xl text-xl font-black shadow-2xl hover:bg-gray-100 border-none transition-all hover:scale-105 active:scale-95"
                  onClick={() => navigate('/register')}
                >
                  Ouvrir un compte
                </Button>
                <Link to="/about" className="h-20 flex items-center px-12 text-white/50 hover:text-white font-black uppercase tracking-[0.2em] text-xs transition-colors">
                  Consulter notre livre blanc
                </Link>
              </div>
            </div>
            
            {/* Floating Icons Background */}
            <Globe className="absolute top-20 right-20 w-32 h-32 opacity-[0.03] rotate-12" />
            <Users className="absolute bottom-20 left-20 w-40 h-40 opacity-[0.03] -rotate-12" />
          </div>
        </div>
      </section>

      {/* --- TRUST BAR (LOGOS) --- */}
      <section className="py-24 border-t border-gray-100 grayscale hover:grayscale-0 transition-all duration-1000">
        <div className="container mx-auto px-6 text-center">
            <h5 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-12">Nos protocoles de confiance</h5>
            <div className="flex flex-wrap justify-center items-center gap-16 md:gap-32">
              {['PCI-DSS COMPLIANT', 'UEMOA GOVERNANCE', 'ISO 27001 SECURED', 'AI CERTIFIED'].map(brand => (
                <div key={brand} className="flex items-center gap-4 text-slate-300">
                   <ShieldCheck className="w-6 h-6" />
                   <span className="text-[11px] font-black uppercase tracking-[0.2em]">{brand}</span>
                </div>
              ))}
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;