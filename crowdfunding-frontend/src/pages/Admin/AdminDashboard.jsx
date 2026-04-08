import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

import { userService } from '../../services/userService';
import projectService from '../../services/projectService';
import { transactionService } from '../../services/transactionService';
import { kycService } from '../../services/kycService';
import { printReport, downloadCSV } from '../../utils/exportUtils';

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState({
    activeProjects: 0,
    newUsers: 0,
    totalVolume: 0,
    pendingKYC: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, projectsRes, txRes, kycRes] = await Promise.all([
          userService.getAllUsers(),
          projectService.getAllProjects(),
          transactionService.getAllTransactions(),
          kycService.getAllKyc()
        ]);
        
        const users = usersRes.data || [];
        const projects = projectsRes.data || [];
        const transactions = txRes.data || [];
        const kycDocs = kycRes.data || [];

        // Calculate stats
        const activeProjects = projects.filter(p => p.statut === 'EN_COURS' || p.statut === 'ACTIVE').length;
        
        // Count users with kycStatus explicitly 'PENDING'
        const pendingKYCCount = users.filter(u => u.kycStatus === 'PENDING').length;
        
        // Filter REAL pending docs
        const pendingKycDocs = kycDocs.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'PENDING');

        const totalVolume = transactions
          .filter(t => t.typeTransaction === 'CONTRIBUTION' && t.statut === 'COMPLETED')
          .reduce((sum, t) => sum + (t.montant || 0), 0);

        setStatsData({
          activeProjects,
          newUsers: users.length,
          totalVolume,
          pendingKYC: pendingKYCCount,
          pendingKycDocs: pendingKycDocs.reverse(), // Newest first
          recentProjects: projects.reverse()
        });

      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: 'Projets Actifs',
      value: loading ? '...' : statsData.activeProjects.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Briefcase,
    },
    {
      name: 'Utilisateurs Inscrits',
      value: loading ? '...' : statsData.newUsers.toString(),
      change: '+18.5%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Volume Investi',
      value: loading ? '...' : `${statsData.totalVolume.toLocaleString()} FCFA`,
      change: '+24%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: 'KYC en Attente',
      value: loading ? '...' : statsData.pendingKYC.toString(),
      change: 'Urgent',
      changeType: statsData.pendingKYC === 0 ? 'positive' : 'negative',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Vue d'ensemble</h2>
        <div className="flex items-center gap-3">
          <select className="bg-white border text-sm text-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm cursor-pointer border-slate-200">
            <option>7 Derniers Jours</option>
            <option>30 Derniers Jours</option>
            <option>Cette Année</option>
          </select>
          <button 
            onClick={() => printReport('Rapport_Global_Crowdfunding')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm shadow-primary-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Exporter Rapport
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.name} className="p-6 flex flex-col justify-between group overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary-50 rounded-full blur-2xl group-hover:bg-primary-100 transition-colors" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-primary-600 shadow-sm">
                <item.icon className="w-6 h-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  item.changeType === 'positive'
                    ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                    : 'text-red-600 bg-red-50 border border-red-100'
                } px-2.5 py-1 rounded-full`}
              >
                {item.changeType === 'positive' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {item.change}
              </div>
            </div>
            
            <div className="mt-8 relative z-10">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.name}</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{item.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Projets Récents</h3>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase text-slate-400">
                   <tr>
                      <th className="py-3">Projet</th>
                      <th className="py-3">Objectif</th>
                      <th className="py-3">Statut</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {loading ? (
                      <tr><td colSpan="3" className="py-8 text-center text-slate-400">Chargement...</td></tr>
                   ) : statsData.recentProjects?.slice(0, 5).map(p => (
                      <tr key={p.id}>
                         <td className="py-4 font-bold text-slate-700">{p.titre}</td>
                         <td className="py-4 font-medium text-slate-500">{p.objectifFinancier?.toLocaleString()} XAF</td>
                         <td className="py-4">
                            <Badge variant={p.statut === 'ACTIVE' ? 'success' : 'warning'}>{p.statut}</Badge>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </Card>
        <Card className="p-6 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-4">À Valider (KYC)</h3>
          <div className="space-y-4">
             {loading ? (
                <p className="text-slate-400 text-sm">Chargement...</p>
             ) : statsData.pendingKycDocs?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                   <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2 opacity-20" />
                   <p className="text-slate-400 text-sm italic">Aucun document en attente</p>
                </div>
             ) : (
                statsData.pendingKycDocs?.slice(0, 5).map(doc => (
                   <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-slate-900 line-clamp-1">{doc.nomComplet || `ID: ${doc.utilisateurId}`}</span>
                         <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{doc.typeDocument}</span>
                      </div>
                      <Link to="/admin/kyc" className="p-2 bg-white text-primary-600 rounded-lg shadow-sm border border-slate-100 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                         <ChevronRight className="w-4 h-4" />
                      </Link>
                   </div>
                ))
             )}
             {statsData.pendingKycDocs?.length > 0 && (
                <Link to="/admin/kyc" className="block text-center text-xs font-bold text-primary-600 hover:underline pt-2">
                   Voir tous les dossiers ({statsData.pendingKycDocs.length})
                </Link>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
}
