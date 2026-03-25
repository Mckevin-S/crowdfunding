import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Headphones
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

  useEffect(() => {
    dispatch(fetchFeaturedProjects());
  }, [dispatch]);

  const stats = [
    { label: 'Financés à ce jour', value: '+150M FCFA' },
    { label: 'Actifs sur la plateforme', value: '1.2k Projets' },
    { label: 'Taux de réussite (IA)', value: '98% Succès', hasIcon: true },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[60%] h-full bg-[#f8fafc]/50 rounded-bl-[15rem]" />

        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left Column: Text */}
            <div className="lg:col-span-6 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8 border border-gray-200">
                <PlusCircle className="w-3.5 h-3.5" />
                Crowdfunding Intelligent
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-black text-primary-900 leading-[1.05] mb-10 tracking-tighter">
                Propulsez le futur de l'Afrique par l'innovation intelligente
              </h1>

              <p className="text-xl text-slate-600 mb-12 max-w-lg leading-relaxed font-medium">
                Connectez-vous aux projets les plus prometteurs du continent grâce à une IA prédictive qui sécurise vos investissements et maximise l'impact local.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <Button
                  size="lg"
                  className="rounded-xl px-10 h-16 text-lg bg-primary-900"
                  onClick={() => navigate('/projects')}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Découvrir les projets
                </Button>
                <button
                  onClick={() => navigate('/projects/create')}
                  className="px-10 h-16 font-black text-slate-700 hover:text-primary-600 transition-colors uppercase tracking-widest text-sm"
                >
                  Soumettre un projet
                </button>
              </div>
            </div>

            {/* Right Column: Image with AI Insight */}
            <div className="lg:col-span-6 relative animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-primary-900/10 mt-12 lg:mt-0">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"
                  alt="African Entrepreneur"
                  className="w-full h-full aspect-[4/5] object-cover"
                />
                {/* AI Insight Card Overlay */}
                <div className="absolute bottom-10 left-6 right-6 p-6 bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IA INSIGHT</span>
                      <span className="text-sm font-black text-slate-900 mt-1 uppercase">Agriculture Durable</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Optimal</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed italic mb-1">
                    "Analyse prévisionnelle terminée : Le projet AgriTech au Sénégal présente un potentiel de croissance de 24% sur les 18 prochains mois."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col group">
                <span className="text-4xl md:text-5xl font-display font-black text-primary-900 mb-2 truncate group-hover:text-primary-500 transition-colors">
                  {stat.value}
                  {stat.hasIcon && <CheckCircle2 className="inline w-6 h-6 ml-2 text-primary-500" />}
                </span>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs opacity-70">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 bg-[#FDFCFB]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-display font-black text-primary-900 mb-4 tracking-tighter">
                Projets en vedette
              </h2>
              <p className="text-slate-500 text-lg font-medium italic">
                Découvrez les opportunités d'investissement sélectionnées par notre algorithme pour leur impact et leur viabilité.
              </p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary-500 pb-2 border-b-2 border-transparent hover:border-primary-500 transition-all"
            >
              Voir tout le catalogue
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><Loader size="xl" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProjects && featuredProjects.length > 0 ? (
                featuredProjects.slice(0, 3).map(project => <ProjectCard key={project.id} project={project} />)
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-xl text-slate-500 italic">Aucun projet actif pour le moment. Soyez le premier à lancer une campagne !</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features / IA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              { title: 'IA Prédictive', icon: <Zap className="w-6 h-6" />, desc: 'Notre algorithme analyse plus de 200 points de données en temps réel pour évaluer les risques et prédire les rendements potentiels avec une précision inégalée.' },
              { title: 'Paiements Sécurisés', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Investissez en toute sérénité via Mobile Money, cartes locales ou virements internationaux. Toutes les transactions sont opérées en FCFA avec une sécurité de niveau bancaire.' },
              { title: 'Accompagnement Expert', icon: <Headphones className="w-6 h-6" />, desc: 'Accédez à un assistant IA dédié pour structurer votre projet ou optimiser votre portefeuille d\'investissements selon vos objectifs financiers.' },
            ].map((feature, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-gray-50/50 hover:bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500">
                <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-black text-slate-900 mb-6">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-black text-primary-900 mb-16 underline decoration-emerald-100 underline-offset-8">Comment ça marche ?</h2>

          <div className="flex justify-center gap-4 mb-16">
            <button className="px-8 py-3 bg-primary-900 text-white rounded-full font-bold text-sm">Pour les Investisseurs</button>
            <button className="px-8 py-3 bg-gray-100 text-slate-500 rounded-full font-bold text-sm">Pour les Porteurs de Projet</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            <div className="hidden lg:block absolute top-[40px] left-[15%] right-[15%] h-1 bg-gray-50 -z-10" />
            {[
              { id: '01', title: 'Inscription', desc: 'Créez votre profil d\'investisseur certifié en quelques minutes.' },
              { id: '02', title: 'Sélection IA', desc: 'Recevez des recommandations personnalisées basées sur votre profil de risque.' },
              { id: '03', title: 'Financement', desc: 'Investissez la somme souhaitée en FCFA via nos canaux sécurisés.' },
              { id: '04', title: 'Suivi d\'impact', desc: 'Suivez l\'évolution du projet et vos dividendes en temps réel.' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-6xl font-black text-gray-100 mb-6 group-hover:text-primary-50 transition-colors">{step.id}</span>
                <h4 className="text-xl font-bold bg-white px-4 py-1 z-10 mb-4">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 border-y border-gray-50 opacity-40 grayscale hover:grayscale-0 transition-all">
        <div className="container mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {['PCI-DSS COMPLIANT', 'BANK PARTNER', 'AI CERTIFIED', 'UEMOA SECURED'].map(trust => (
            <div key={trust} className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{trust}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-6xl font-display font-black mb-12 leading-tight">
              Prêt à transformer votre vision en réalité ?
            </h2>
            <p className="text-emerald-100 text-lg mb-12 max-w-2xl mx-auto italic font-medium">
              Rejoignez une communauté d'investisseurs et d'entrepreneurs qui façonnent l'Afrique de demain.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                className="bg-white text-primary-900 h-16 px-12 rounded-xl text-lg hover:bg-gray-50 border-none shadow-none"
                onClick={() => navigate('/register')}
              >
                Commencer maintenant
              </Button>
              <Button
                variant="outline"
                className="h-16 px-12 text-white border-white/20 hover:bg-white/10"
              >
                Contacter un expert
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;