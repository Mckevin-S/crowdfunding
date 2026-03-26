import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TrendingUp, Users, Briefcase, DollarSign, Activity, FileCheck, ArrowUpRight } from 'lucide-react';
import Card from '../../components/common/Card';
import projectService from '../../services/projectService';
import { userService } from '../../services/userService';
import { transactionService } from '../../services/transactionService';
import { printReport, downloadCSV } from '../../utils/exportUtils';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    totalFunding: 0,
    successRate: 0,
    pendingKYC: 0
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // We load them independently to calculate stats
      // Since it's an admin dashboard, we can afford parallel loading
      const [usersRes, projectsRes, txRes] = await Promise.all([
        userService.getAllUsers(),
        projectService.getAllProjects(),
        transactionService.getAllTransactions()
      ]);

      const users = usersRes.data || [];
      const projects = projectsRes.data || [];
      const transactions = txRes.data || [];

      const totalFunding = transactions
        .filter(t => t.typeTransaction === 'CONTRIBUTION' && t.statut === 'COMPLETED')
        .reduce((sum, t) => sum + (t.montant || 0), 0);
        
      const termines = projects.filter(p => p.statut === 'TERMINE').length;
      const ofWhichFailed = projects.filter(p => p.statut === 'ECHEC').length;
      const totalResolved = termines + ofWhichFailed;
      
      const successRate = totalResolved > 0 ? Math.round((termines / totalResolved) * 100) : 0;

      setStats({
        totalUsers: users.length,
        activeProjects: projects.filter(p => p.statut === 'EN_COURS').length,
        totalFunding,
        successRate,
        pendingKYC: users.filter(u => u.statut === 'EN_ATTENTE_VALIDATION').length || 0 // placeholder
      });

    } catch (error) {
      toast.error('Erreur de synchronisation des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, bg, subtitle }) => (
    <Card className="flex flex-col relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${bg} opacity-50 group-hover:scale-110 transition-transform duration-500`} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">
            {loading ? <span className="animate-pulse bg-slate-200 text-transparent rounded">0000</span> : value}
          </h3>
          {subtitle && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3 text-emerald-500"/> {subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Performances & Analytics</h2>
          <p className="text-slate-500 mt-1">Vue macroscopique de l'évolution de la plateforme.</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => printReport('Rapport_Analytique_Crowdfunding')}
                className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm"
            >
                Export PDF
            </button>
            <button 
                onClick={() => downloadCSV([stats], 'Rapport_Stats.csv')}
                className="px-4 py-2 bg-slate-900 text-white border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm shadow-sm"
            >
                Générer Rapport CSV
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Fonds Collectés (Total)"
          value={`${stats.totalFunding.toLocaleString('fr-FR')} FCFA`}
          icon={DollarSign}
          color="text-emerald-600"
          bg="bg-emerald-100"
          subtitle="Depuis la création"
        />
        <StatCard
          title="Utilisateurs Inscrits"
          value={stats.totalUsers}
          icon={Users}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <StatCard
          title="Projets Actifs"
          value={stats.activeProjects}
          icon={Briefcase}
          color="text-purple-600"
          bg="bg-purple-100"
        />
        <StatCard
          title="Taux de Succès"
          value={`${stats.successRate}%`}
          icon={TrendingUp}
          color="text-orange-600"
          bg="bg-orange-100"
          subtitle="Projets financés à 100%"
        />
      </div>

      {/* Basic Metrics Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-80 justify-center items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
               <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Évolution Mentuelle</h3>
            <p className="text-slate-500 text-sm max-w-sm mt-2">Le module de graphiques temporels sera disponible dès l'intégration des hooks Recharts.</p>
        </Card>
        
        <Card className="flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b pb-4">Activité Récente</h3>
            <div className="flex-1 space-y-4">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                            <FileCheck className="w-5 h-5"/>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-800">Validation Projet</p>
                            <p className="text-xs text-slate-500">Un projet a été validé par un administrateur.</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">Il y a {(i+1)*2}h</span>
                    </div>
                ))}
            </div>
        </Card>
      </div>

    </div>
  );
}
