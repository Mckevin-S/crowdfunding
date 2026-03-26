import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter,
  Search,
  Download,
  Award
} from 'lucide-react';
import { fetchUserContributions } from '@store/slices/contributionSlice';
import { formatCurrency, formatDate } from '@utils/formatters';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';

const MyContributions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { contributions, loading, error } = useSelector((state) => state.contribution);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserContributions(user.id));
    }
  }, [dispatch, user]);

  const stats = useMemo(() => {
    if (!contributions) return { total: 0, count: 0, rewards: 0, projects: 0 };
    return {
      total: contributions.reduce((acc, curr) => acc + (curr.amount || 0), 0),
      count: contributions.length,
      rewards: 0, // Mock for now
      projects: new Set(contributions.map(c => c.projetId)).size
    };
  }, [contributions]);

  const filteredContributions = useMemo(() => {
    if (!contributions) return [];
    return contributions.filter(c => {
      const matchesSearch = c.projetTitre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.id.toString().includes(searchTerm);
      return matchesSearch;
    });
  }, [contributions, searchTerm]);

  if (loading && !contributions) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white/50 rounded-[2.5rem] backdrop-blur-sm border border-white/20 shadow-xl">
        <Loader size="xl" text="Récupération de votre portefeuille d'impact..." />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header & Impact Stats */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight mb-2">
              Mes <span className="text-emerald-600">Contributions</span>
            </h1>
            <p className="text-slate-500 font-medium">Visualisez l'impact de vos investissements sur le continent.</p>
          </div>
          <Button 
            variant="emerald" 
            onClick={() => navigate('/projects')}
            className="rounded-xl shadow-lg shadow-emerald-600/20 px-8 py-3 font-bold"
          >
            Nouveau Projet
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{formatCurrency(stats.total)}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Investi</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-primary-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stats.projects}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Projets Soutenus</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all group">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{stats.rewards}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Récompenses</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2rem] p-8 shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform" />
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-black text-white mb-1">8.4%</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Rendement Moyen</p>
             </div>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Rechercher par projet ou ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
            />
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
             <Button variant="outline" size="sm" className="whitespace-nowrap"><Filter className="w-4 h-4 mr-2" /> Trier par Date</Button>
             <Button variant="outline" size="sm" className="whitespace-nowrap"><Download className="w-4 h-4 mr-2" /> Exporter PDF</Button>
          </div>
        </div>

        {filteredContributions.length > 0 ? (
          <div className="space-y-4">
             {filteredContributions.map((c) => (
               <Card 
                 key={c.id} 
                 onClick={() => navigate(`/projects/${c.projetId}`)}
                 hoverable
                 className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 group !rounded-3xl border-slate-50 hover:border-emerald-100"
               >
                 <div className="flex items-center gap-6 flex-1 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black shadow-inner shadow-emerald-600/5 group-hover:scale-110 transition-transform flex-shrink-0">
                      #{c.id.toString().slice(-3)}
                    </div>
                    <div className="min-w-0 flex-1">
                       <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-emerald-600 transition-colors">Projet #{c.projetId}</h3>
                       <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1 uppercase tracking-widest">
                         <Clock className="w-3 h-3" /> {formatDate(c.createdAt)}
                       </p>
                    </div>
                 </div>

                 <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-center sm:text-right min-w-[120px]">
                       <p className="text-xl font-black text-slate-900">{formatCurrency(c.amount)}</p>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter italic">Investissement</p>
                    </div>
                    
                    <Badge variant={c.statut === 'VALIDE' ? 'success' : 'warning'} className="px-5 py-2 !rounded-xl !text-[10px] font-black tracking-widest uppercase">
                       {c.statut || 'VALIDÉ'}
                    </Badge>

                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-200 transition-all ml-4">
                       <ArrowRight className="w-4 h-4" />
                    </div>
                 </div>
               </Card>
             ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-100">
                <Search className="w-8 h-8 text-slate-200" />
             </div>
             <p className="text-xl font-black text-slate-400">Aucune contribution trouvée.</p>
             <p className="text-sm text-slate-300 mt-2 font-bold italic">Commencez à bâtir l'avenir de l'Afrique dès aujourd'hui.</p>
             <Button 
               variant="emerald" 
               className="mt-8 px-10 rounded-xl font-black"
               onClick={() => navigate('/projects')}
             >
               Explorer
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContributions;
