import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Edit3,
  Trash2,
  Eye,
  BarChart2
} from 'lucide-react';
import { fetchUserProjects } from '../../store/slices/projectSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import clsx from 'clsx';

const MyProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { userProjects, loading } = useSelector(state => state.project);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProjects(user.id));
    }
  }, [dispatch, user?.id]);

  // KPIs Calculations
  const stats = useMemo(() => {
    if (!userProjects) return { totalRaised: 0, totalBackers: 0, activeProjects: 0, successRate: 0 };
    
    const totalRaised = userProjects.reduce((acc, p) => acc + (p.montantActuel || 0), 0);
    const totalBackers = userProjects.reduce((acc, p) => acc + (p.nombreContributeurs || 0), 0);
    const activeProjects = userProjects.filter(p => p.statut === 'ACTIVE' || p.statut === 'EN_COURS').length;
    const completed = userProjects.filter(p => p.statut === 'TERMINE').length;
    const successRate = userProjects.length > 0 ? Math.round((completed / userProjects.length) * 100) : 0;

    return { totalRaised, totalBackers, activeProjects, successRate };
  }, [userProjects]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    if (!userProjects) return [];
    return userProjects.filter(project => {
      const matchesSearch = project.titre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || project.statut === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [userProjects, searchTerm, statusFilter]);

  const kpiCards = [
    { label: 'Total Récolté', value: formatCurrency(stats.totalRaised), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Contributeurs', value: stats.totalBackers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Projets Actifs', value: stats.activeProjects, icon: Target, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Taux de Succès', value: `${stats.successRate}%`, icon: BarChart2, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mes Projets</h1>
          <p className="text-slate-500 font-medium">Gérez vos campagnes et suivez vos performances en temps réel.</p>
        </div>
        <Button 
          onClick={() => navigate('/projects/create')}
          leftIcon={<PlusCircle className="w-5 h-5" />}
          className="shadow-xl shadow-primary-600/20"
        >
          Lancer un Projet
        </Button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", card.bg)}>
                <card.icon className={clsx("w-6 h-6", card.color)} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
                <p className="text-2xl font-black text-slate-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-2xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-slate-100"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['ALL', 'BROUILLON', 'EN_COURS', 'PUBLIE', 'TERMINE', 'REJETE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={clsx(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
              )}
            >
              {status === 'ALL' ? 'Tous' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-64" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const progress = (project.montantActuel / project.objectifFinancier) * 100;
            return (
              <div 
                key={project.id} 
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image Placeholder or Actual Image */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 italic text-sm">Aperçu indisponible</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant={
                      project.statut === 'ACTIVE' || project.statut === 'PUBLIE' ? 'success' : 
                      project.statut === 'REJETE' ? 'danger' : 'secondary'
                    } className="shadow-lg backdrop-blur-md bg-white/90">
                      {project.statut}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-primary-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-primary-600 text-[10px] font-black uppercase tracking-widest mb-2">
                    <TrendingUp className="w-3 h-3" />
                    {project.categorie}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-1">{project.titre}</h3>
                  
                  {/* Progress Section */}
                  <div className="mt-auto space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-500">Collecté</span>
                        <span className="text-slate-900">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            progress >= 100 ? "bg-emerald-500" : "bg-primary-600"
                          )}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-slate-50">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Récolté</p>
                        <p className="font-black text-slate-900">{formatCurrency(project.montantActuel)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Objectif</p>
                        <p className="font-bold text-slate-600">{formatCurrency(project.objectifFinancier)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="soft" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        Voir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-3"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-6 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mb-2">
            <PlusCircle className="w-12 h-12" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              {searchTerm || statusFilter !== 'ALL' 
                ? "Aucun de vos projets ne correspond à vos critères de recherche actuels." 
                : "Vous n'avez pas encore publié de projet sur InvestAFRIKA. C'est peut-être le moment de lancer votre première campagne !"}
            </p>
          </div>
          <Button 
            onClick={() => navigate('/projects/create')}
            leftIcon={<PlusCircle className="w-5 h-5" />}
            size="lg"
            className="mt-4"
          >
            Lancer mon premier projet
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyProjects;