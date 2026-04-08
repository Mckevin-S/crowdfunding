import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  Wallet, 
  Briefcase, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  ArrowUpRight, 
  ExternalLink,
  ChevronRight,
  Target
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { contributionService } from '../../services/contributionService';
import { toast } from 'react-toastify';

const ContributorDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvested: 0,
    projectCount: 0,
    pendingAmount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await contributionService.getUserContributions(user.id);
        const data = res.data || [];
        setContributions(data);
        
        // Calculate stats
        const completed = data.filter(c => c.status === 'COMPLETED');
        const total = completed.reduce((sum, c) => sum + (c.amount || 0), 0);
        const uniqueProjects = new Set(data.map(c => c.projetId)).size;
        
        setStats({
          totalInvested: total,
          projectCount: uniqueProjects,
          pendingAmount: data.filter(c => c.status === 'PENDING').length
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        toast.error('Impossible de charger vos statistiques');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user?.id]);

  const kycStatus = user?.kycStatus || 'PENDING';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">
            Bonjour, {user?.prenom || 'Investisseur'} 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Voici l'aperçu de votre impact et de vos investissements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/projects">
            <Button variant="primary" size="sm" className="rounded-xl shadow-lg shadow-primary-500/20" rightIcon={<ChevronRight className="w-4 h-4"/>}>
              Découvrir des projets
            </Button>
          </Link>
        </div>
      </div>

      {/* KYC Status Banner */}
      {kycStatus !== 'APPROVED' && (
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white shadow-xl shadow-amber-500/20 group">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Vérifiez votre identité</h3>
                <p className="text-amber-50/80 font-medium mt-1 max-w-xl">
                  {kycStatus === 'PENDING' 
                    ? "Soumettez vos documents KYC pour débloquer les investissements au-delà de 500,000 XAF et participer aux projets en Capital/Prêt."
                    : "Votre demande de vérification est en cours d'examen par nos équipes. Vous serez notifié par email."}
                </p>
              </div>
            </div>
            {kycStatus === 'PENDING' ? (
              <Button 
                onClick={() => navigate('/kyc')}
                className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-8 py-4 rounded-xl shadow-lg"
              >
                Vérifier maintenant
              </Button>
            ) : (
              <Badge variant="warning" className="bg-white/20 text-white border-white/30 px-6 py-2 text-sm">
                En attente de validation
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 relative group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Investi</p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {stats.totalInvested.toLocaleString()} <span className="text-lg text-slate-400 font-bold ml-1">XAF</span>
          </p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-4 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
            <ArrowUpRight className="w-3 h-3" />
            +12.5% ce mois
          </div>
        </Card>

        <Card className="p-6 relative group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Projets Soutenus</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats.projectCount}</p>
          <p className="text-xs text-slate-500 font-medium mt-4">Dans {new Set(contributions.map(c => c.categorie)).size || 0} catégories différentes</p>
        </Card>

        <Card className="p-6 relative group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">En Attente</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{stats.pendingAmount}</p>
          <Link to="/profile/transactions" className="text-xs text-primary-600 font-bold mt-4 flex items-center gap-1 hover:underline">
            Voir les détails <ExternalLink className="w-3 h-3"/>
          </Link>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Contributions */}
        <div className="lg:col-span-2">
          <Card className="p-0 border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-black text-xl text-slate-900">Contributions Récentes</h3>
              <Link to="/profile/contributions" className="text-sm font-bold text-primary-600 hover:text-primary-700">
                Voir tout
              </Link>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-slate-400">Chargement...</div>
              ) : contributions.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium italic">Vous n'avez pas encore contribué à des projets.</p>
                  <Link to="/projects">
                    <Button variant="outline" size="sm" className="mt-4">Explorer les projets</Button>
                  </Link>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Projet</th>
                      <th className="px-6 py-4">Montant</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {contributions.slice(0, 5).map((contribution) => (
                      <tr key={contribution.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                              Projet #{contribution.projetId}
                            </span>
                            <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Contribution ID: {contribution.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">
                          {contribution.amount?.toLocaleString()} XAF
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          {new Date(contribution.dateContribution || contribution.dateCreation).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={contribution.status === 'COMPLETED' ? 'success' : 'warning'}>
                            {contribution.status === 'COMPLETED' ? 'Confirmé' : 'En attente'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar help/status */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-900 text-white border-none shadow-xl overflow-hidden relative">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl" />
            <h3 className="font-display font-black text-xl mb-4">Besoin d'aide ?</h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Consultez notre guide de l'investisseur pour comprendre comment fonctionnent les financements par capital et par prêt.
            </p>
            <Button fullWidth variant="primary" size="sm" className="bg-primary-600 border-none">
              Consulter le guide
            </Button>
          </Card>

          <Card className="p-6 border-none shadow-sm bg-primary-50/30">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900">Engagement Qualité</h4>
             </div>
             <p className="text-xs text-slate-600 leading-relaxed font-medium">
               Tous les projets sur notre plateforme sont analysés par notre IA et nos experts financiers pour maximiser votre sécurité.
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContributorDashboard;