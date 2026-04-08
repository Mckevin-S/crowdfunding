import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Rocket, 
  BarChart3, 
  Users, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import projectService from '../../services/projectService';
import { toast } from 'react-toastify';

const CreatorDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeProjects: 0,
    totalBackers: 0
  });

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);
        const res = await projectService.getProjetsByPorteur(user.id);
        const data = res.data || [];
        setProjects(data);

        // Stats calculation
        const totalRaised = data.reduce((sum, p) => sum + (p.montantActuel || 0), 0);
        const activeCount = data.filter(p => p.statut === 'ACTIVE' || p.statut === 'EN_COURS').length;
        const totalBackers = data.reduce((sum, p) => sum + (p.nombreContributeurs || 0), 0);

        setStats({
          totalRaised,
          activeProjects: activeCount,
          totalBackers
        });
      } catch (error) {
        console.error('Error loading creator dashboard', error);
        toast.error('Échec du chargement de vos projets');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchCreatorData();
  }, [user?.id]);

  const kycStatus = user?.kycStatus || 'PENDING';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-900/20">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">Espace Créateur</h1>
            <p className="text-slate-500 font-medium">Gérez vos campagnes et suivez vos financements.</p>
          </div>
        </div>
        <Link to="/projets/create">
          <Button variant="primary" className="h-14 px-8 rounded-2xl shadow-xl shadow-primary-600/20" leftIcon={<Plus className="w-5 h-5"/>}>
            Lancer un projet
          </Button>
        </Link>
      </div>

      {/* KYC Alert for Creators - Even more critical as they will receive money */}
      {kycStatus !== 'APPROVED' && (
        <div className="bg-white border-2 border-amber-100 rounded-[2.5rem] p-4 shadow-sm">
           <div className="bg-amber-50 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-100/50">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-black text-amber-900">Validation Requise</h3>
                  <p className="text-amber-800/70 font-medium mt-1">
                    {kycStatus === 'PENDING' 
                      ? "Votre compte doit être vérifié avant de pouvoir recevoir des fonds ou publier de nouveaux projets."
                      : "Dossier en cours d'examen. Vous pourrez gérer vos retraits dès la validation."}
                  </p>
                </div>
              </div>
              {kycStatus === 'PENDING' && (
                <Button 
                  onClick={() => navigate('/kyc')}
                  className="bg-amber-500 hover:bg-amber-600 text-white border-none shadow-lg shadow-amber-500/20 font-bold px-10 h-14 rounded-2xl"
                >
                  Vérifier mon identité
                </Button>
              )}
           </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-8 border-none bg-emerald-50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="w-32 h-32 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">Total Récolté</p>
            <h4 className="text-4xl font-display font-black text-emerald-900">{stats.totalRaised.toLocaleString()} XAF</h4>
            <div className="flex items-center gap-2 mt-4 text-emerald-600 font-bold text-sm bg-white/50 w-fit px-3 py-1 rounded-full border border-emerald-100">
               <ShieldCheck className="w-4 h-4" /> Fonds sécurisés
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none bg-primary-50 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Rocket className="w-32 h-32 text-primary-600" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">Projets Actifs</p>
            <h4 className="text-4xl font-display font-black text-primary-900">{stats.activeProjects}</h4>
            <div className="mt-4 flex -space-x-2">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
               <div className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600">+{stats.activeProjects}</div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none bg-slate-900 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Users className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Contributeurs</p>
            <h4 className="text-4xl font-display font-black text-white">{stats.totalBackers}</h4>
            <p className="text-slate-400 text-sm font-medium mt-4 italic opacity-80">Merci pour votre confiance.</p>
          </div>
        </Card>
      </div>

      {/* Projects Table */}
      <Card className="p-0 border-none shadow-sm overflow-hidden bg-white">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-display font-black text-2xl text-slate-900">Mes Projets</h3>
          <Button variant="ghost" size="sm" className="font-bold text-primary-600" rightIcon={<ChevronRight className="w-4 h-4"/>}>
            Voir tout l'historique
          </Button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-slate-400 font-medium">Recherche de vos ambitions...</div>
          ) : projects.length === 0 ? (
            <div className="p-20 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Rocket className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-bold text-slate-800 mb-2">Prêt à changer l'Afrique ?</h4>
               <p className="text-slate-500 mb-8 max-w-sm mx-auto">Vous n'avez pas encore créé de projet. C'est le moment de présenter votre vision au monde.</p>
               <Link to="/projets/create">
                  <Button variant="primary" className="rounded-xl px-10 shadow-lg shadow-primary-500/20">Créer mon premier projet</Button>
               </Link>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                  <th className="px-8 py-5">Projet</th>
                  <th className="px-8 py-5">Progression</th>
                  <th className="px-8 py-5">Collecté</th>
                  <th className="px-8 py-5">Statut</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.map((project) => {
                  const progress = Math.min(Math.round((project.montantActuel / project.objectifFinancier) * 100), 100);
                  return (
                    <tr key={project.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                             {project.imageCouverture && <img src={project.imageCouverture} alt="" className="w-full h-full object-cover" />}
                           </div>
                           <div className="flex flex-col">
                             <span className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                               {project.titre}
                             </span>
                             <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Créé le {new Date(project.dateCreation).toLocaleDateString()}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-32">
                           <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-black text-slate-900">{progress}%</span>
                           </div>
                           <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="font-bold text-slate-900">{project.montantActuel?.toLocaleString()} XAF</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase transition-colors">Objectif: {project.objectifFinancier?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={project.statut === 'ACTIVE' || project.statut === 'EN_COURS' ? 'success' : 'warning'}>
                          {project.statut}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <Button variant="outline" size="xs" className="rounded-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50" onClick={() => navigate(`/projects/${project.id}`)}>
                            Gérer
                         </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CreatorDashboard;