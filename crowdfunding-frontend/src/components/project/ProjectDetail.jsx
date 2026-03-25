import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Target, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Heart, 
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import ProjectProgress from '@components/project/ProjectProgress';
import clsx from 'clsx';
import ContributionModal from './ContributionModal';

const ProjectDetail = ({ project }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('histoire');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { isAuthenticated, user: activeUser } = useSelector(state => state.auth);

  const {
    id,
    titre,
    description,
    contenu,
    montantActuel = 0,
    objectifFinancier = 1,
    dateFin,
    imageCouverture,
    categorie = 'AGRICULTURE',
    createurNom = 'InvestAFRIKA Partner',
  } = project;

  const percentage = Math.min(Math.round((montantActuel / objectifFinancier) * 100), 100);
  const daysLeft = Math.ceil((new Date(dateFin) - new Date()) / (1000 * 60 * 60 * 24)) || 0;

  const tabs = [
    { id: 'histoire', label: 'L\'Histoire' },
    { id: 'actualites', label: 'Actualités' },
    { id: 'commentaires', label: 'Commentaires' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Info */}
      <div className="mb-12">
        <Badge variant="secondary" className="mb-6">{categorie}</Badge>
        <h1 className="text-4xl md:text-6xl font-display font-black text-primary-900 mb-6 tracking-tighter leading-tight">
          {titre}
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-3xl leading-relaxed italic">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Cover Image */}
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 aspect-video">
            <img 
              src={imageCouverture || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200'}
              className="w-full h-full object-cover"
              alt={titre}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 gap-10">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "pb-4 text-xs font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-slate-300 hover:text-slate-500"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
            {activeTab === 'histoire' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="whitespace-pre-wrap text-lg">
                  {contenu || "Découvrez bientôt l'histoire complète de ce projet visionnaire."}
                </p>
              </div>
            )}
            {activeTab === 'actualites' && (
              <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <TrendingUp className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 italic font-bold">Aucune actualité pour le moment.</p>
              </div>
            )}
            {activeTab === 'commentaires' && (
              <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                <MessageCircle className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 italic font-bold">Soyez le premier à commenter !</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="!p-8 !rounded-[2.5rem] border-none shadow-2xl shadow-primary-900/5 bg-primary-900 text-white relative overflow-hidden sticky top-32">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative z-10 space-y-8">
              <div>
                 <span className="text-5xl font-display font-black truncate block mb-1">
                   {montantActuel.toLocaleString()}
                 </span>
                 <span className="text-emerald-300 font-bold uppercase tracking-widest text-xs">FCFA Collectés</span>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest text-emerald-200">
                   <span>{percentage}% complété</span>
                   <span>Objectif {objectifFinancier.toLocaleString()} FCFA</span>
                 </div>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-2xl font-black">{daysLeft}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Jours restants</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black">128</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Contributeurs</span>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                fullWidth 
                className={clsx(
                  "h-16 rounded-xl shadow-xl text-lg transition-all",
                  isAuthenticated 
                    ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                    : "bg-slate-700 hover:bg-slate-800 shadow-slate-900/10"
                )}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(`/login?redirect=/projects/${id}`);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
              >
                {isAuthenticated ? "Soutenir ce projet" : "Connectez-vous pour contribuer"}
              </Button>

              <div className="flex items-center gap-4">
                 <button className="flex-1 h-12 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-xs font-bold hover:bg-white/5 transition-all">
                    <Share2 className="w-4 h-4" /> Partager
                 </button>
                 <button className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all">
                    <Heart className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                 <ShieldCheck className="w-6 h-6 text-emerald-400" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Paiement Sécurisé</p>
                    <p className="text-[9px] text-emerald-200 font-medium">PCI-DSS & UEMOA Compliant</p>
                 </div>
              </div>
            </div>
          </Card>

          {/* Creator Info */}
          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
             <div>
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Porteur de Projet</h4>
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {createurNom.charAt(0)}
                  </div>
                  <div>
                     <p className="font-bold text-slate-900">{createurNom}</p>
                     <p className="text-xs text-slate-400 font-medium">Partenaire Certifié</p>
                  </div>
               </div>
             </div>
             
             {activeUser?.id !== project.porteurId && (
               <Button 
                variant="outline" 
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(`/login?redirect=/projects/${id}`);
                    return;
                  }
                  navigate('/messages');
                }}
               >
                 Contacter
               </Button>
             )}
          </div>
        </div>
      </div>
      {/* Contribution Modal */}
      {project && (
        <ContributionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={project}
          user={activeUser}
        />
      )}
    </div>
  );
};

export default ProjectDetail;