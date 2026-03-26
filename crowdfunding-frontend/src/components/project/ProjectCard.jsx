import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Heart, MessageCircle, Wallet } from 'lucide-react';
import socialService from '../../services/socialService';
import { useSelector } from 'react-redux';
import Card from '../common/Card';
import ProjectProgress from './ProjectProgress';
import Button from '../common/Button';
import clsx from 'clsx';
import ContributionModal from './ContributionModal';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    id,
    titre = 'Sans titre',
    description = 'Aucune description.',
    montantActuel = 0,
    objectifFinancier = 1000000,
    imageCouverture: _imageCouverture,
    categorie: _categorie,
    nombreContributeurs = 0,
    programmeIA = true,
  } = project;

  const [socialStats, setSocialStats] = useState({ likesCount: 0, commentsCount: 0, isLikedByCurrentUser: false });

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const stats = await socialService.getSocialStats(id, user?.id);
        setSocialStats(stats);
      } catch (err) {
        console.error('Error fetching social stats', err);
      }
    };
    if (id) fetchSocialData();
  }, [id, user?.id]);

  const imageCouverture = _imageCouverture;
  const categorie = _categorie || 'INNOVATION';

  const resolveImageUrl = (img) => {
    const fallback = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800';
    if (!img) return fallback;

    if (/^https?:\/\//.test(img)) return img;

    if (img.startsWith('/api/v1/files/images/')) {
      return `http://localhost:8080${img.replace('/api/v1', '')}`;
    }

    if (img.startsWith('/files/images/')) {
      return `http://localhost:8080${img}`;
    }

    if (img.startsWith('/uploads/images/')) {
      const filename = img.split('/').pop();
      return `http://localhost:8080/files/images/${filename}`;
    }

    if (img.startsWith('/')) {
      return `http://localhost:8080${img}`;
    }

    return img;
  };

  const displayImage = resolveImageUrl(imageCouverture);

  const percentage = Math.min(Math.round((montantActuel / objectifFinancier) * 100), 100);

  const handleContributeClick = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login?redirect=/investisseur/explorer');
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <Card 
        padding="none"
        hoverable 
        className="flex flex-col h-full group !rounded-3xl border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500"
        onClick={() => navigate(`/projects/${id}`)}
      >
        {/* Target/Badge Overlay */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={displayImage}
            alt={titre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-primary-900/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              {categorie}
            </span>
            {percentage >= 80 && (
              <span className="px-3 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                BIENTÔT FINI
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-display font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors flex-1">
                  {titre}
              </h3>
              <div className="flex flex-col items-end gap-1 ml-4 transition-opacity">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-400">
                      <Heart className={clsx("w-3.5 h-3.5", socialStats.isLikedByCurrentUser ? "fill-red-500 text-red-500" : "")} />
                      <span>{socialStats.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{socialStats.commentsCount}</span>
                  </div>
              </div>
          </div>
          
          <div className="mt-4 mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-black text-slate-800">
                {montantActuel.toLocaleString()} <span className="text-xs text-gray-400 font-bold italic">FCFA</span>
              </span>
              <span className="text-sm font-black text-primary-500">{percentage}% ({nombreContributeurs} contrib.)</span>
            </div>
            <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1 italic block">Objectif: {objectifFinancier.toLocaleString()} FCFA</span>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${project.porteurId || '1'}`);
                }}
                className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
              >
                <ShieldCheck className="w-4 h-4 fill-emerald-50" />
                <span className="text-[10px] font-black uppercase tracking-widest">Voir Profil</span>
              </button>
              <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${id}`);
                    }}
                    className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-all flex items-center gap-1"
                  >
                      Détails <ArrowUpRight className="w-3 h-3" />
                  </button>
              </div>
            </div>

            <Button 
              variant="emerald" 
              fullWidth
              size="sm"
              className="rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/10"
              onClick={handleContributeClick}
            >
              <Wallet className="w-4 h-4 mr-2" /> Contribuer
            </Button>
          </div>
        </div>
      </Card>

      <ContributionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={project}
        user={user}
      />
    </>
  );
};

export default ProjectCard;