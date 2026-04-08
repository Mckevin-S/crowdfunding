import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  Send,
  Trash2
} from 'lucide-react';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import ProjectProgress from '@components/project/ProjectProgress';
import clsx from 'clsx';
import ContributionModal from './ContributionModal';
import socialService from '../../services/socialService';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

import AIAnalysisSection from './AIAnalysisSection';

const ProjectDetail = ({ project }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('histoire');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [socialStats, setSocialStats] = useState({ likesCount: 0, commentsCount: 0, sharesCount: 0, isLikedByCurrentUser: false });
  const [loadingComments, setLoadingComments] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);
  
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
    porteurId
  } = project || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await socialService.getSocialStats(id, activeUser?.id);
        setSocialStats(stats);
        
        setLoadingComments(true);
        const fetchedComments = await socialService.getCommentsByProject(id);
        setComments(fetchedComments);

        // Vérifier si l'utilisateur a contribué
        if (isAuthenticated && activeUser?.id) {
          const res = await api.get(`/contributions/utilisateur/${activeUser.id}`);
          const contributed = (res.data || []).some(c => c.projetId === id && c.status === 'COMPLETED');
          setHasContributed(contributed);
        }
      } catch (err) {
        console.error('Error fetching social data', err);
      } finally {
        setLoadingComments(false);
      }
    };
    if (id) fetchData();
  }, [id, activeUser?.id, isAuthenticated]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await socialService.toggleLike(id, activeUser.id);
      const newStats = await socialService.getSocialStats(id, activeUser.id);
      setSocialStats(newStats);
      if (!socialStats.isLikedByCurrentUser) {
        toast.success('Pépites aimée !');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'interaction');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await socialService.addComment({
        projetId: id,
        utilisateurId: activeUser.id,
        contenu: commentText
      });
      setCommentText('');
      const updatedComments = await socialService.getCommentsByProject(id);
      setComments(updatedComments);
      toast.success('Commentaire publié !');
    } catch (err) {
      toast.error('Erreur lors de la publication');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (isAuthenticated) {
        await socialService.trackShare(id, activeUser.id);
      }
      toast.success('Lien du projet copié !');
    } catch (err) {
      toast.error('Impossible de copier le lien');
    }
  };


  const percentage = Math.min(Math.round((montantActuel / objectifFinancier) * 100), 100);
  const daysLeft = Math.ceil((new Date(dateFin) - new Date()) / (1000 * 60 * 60 * 24)) || 0;

  const tabs = [
    { id: 'histoire', label: 'L\'Histoire' },
    { id: 'actualites', label: 'Actualités' },
    { id: 'commentaires', label: `Commentaires (${comments.length})` },
    { id: 'ia-analyse', label: 'Analyse IA 🤖' },
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Formulaire de commentaire */}
                <form onSubmit={handleComment} className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                      {activeUser?.prenom?.[0] || '?'}
                    </div>
                    <div className="flex-1 space-y-3">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Qu'en pensez-vous ?"
                        className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-none"
                      />
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          size="sm" 
                          disabled={!commentText.trim()}
                        >
                          Publier
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Liste des commentaires */}
                <div className="space-y-6">
                  {loadingComments ? (
                    <p className="text-center text-gray-400 italic">Chargement des avis...</p>
                  ) : comments.length > 0 ? (
                    comments.map(comment => (
                      <div key={comment.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                          {comment.utilisateurNom?.[0] || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group-hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-slate-900 text-sm">{comment.utilisateurNom}</span>
                              <span className="text-[10px] font-bold text-slate-400">
                                {formatDistanceToNow(new Date(comment.dateCreation), { addSuffix: true, locale: fr })}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                              {comment.contenu}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                      <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 italic font-bold">Soyez le premier à commenter !</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'ia-analyse' && (
              <AIAnalysisSection project={project} user={activeUser} />
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
                 <button 
                  onClick={handleShare}
                  className="flex-1 h-12 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-xs font-bold hover:bg-white/5 transition-all text-white/90"
                 >
                    <Share2 className="w-4 h-4" /> Partager
                 </button>
                 <button 
                  onClick={handleLike}
                  className={clsx(
                    "w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center transition-all",
                    socialStats.isLikedByCurrentUser ? "bg-red-500/20 text-red-500 border-red-500/30" : "hover:bg-white/5"
                  )}
                 >
                    <Heart className={clsx("w-4 h-4", socialStats.isLikedByCurrentUser ? "fill-current" : "")} />
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
               <div className="flex flex-col gap-2 w-full">
                 <Button 
                   variant={hasContributed ? "primary" : "outline"}
                   fullWidth
                   onClick={() => {
                     if (!isAuthenticated) {
                       navigate(`/login?redirect=/projects/${id}`);
                       return;
                     }
                     if (!hasContributed && activeUser?.role !== 'ADMIN') {
                       toast.info("Soutenez ce projet pour pouvoir contacter le porteur.");
                       return;
                     }
                     navigate('/messages', { 
                       state: { 
                         userId: activeUser.id,
                         partnerId: porteurId, 
                         partnerName: createurNom, 
                         projectId: id, 
                         projectTitle: titre 
                       } 
                     });
                   }}
                   leftIcon={<MessageCircle className="w-4 h-4" />}
                 >
                   {hasContributed ? "Contacter le porteur" : "Contribuer pour contacter"}
                 </Button>
                 {!hasContributed && activeUser?.role !== 'ADMIN' && (
                   <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                     Réservé aux contributeurs du projet
                   </p>
                 )}
               </div>
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