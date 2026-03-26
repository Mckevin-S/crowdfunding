import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Wallet,
  ArrowUpRight,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  Award,
  Bell,
  Settings,
  LogOut,
  Eye,
  Zap,
  Activity
} from 'lucide-react';
import Button from '@components/common/Button';
import { fetchUserContributions } from '@store/slices/contributionSlice';
import { logoutUser } from '@store/slices/authSlice';
import { formatDate, formatCurrency } from '@utils/formatters';

const DashboardInvestisseur = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { contributions, loading } = useSelector((state) => state.contribution);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.id) {
      dispatch(fetchUserContributions(user.id));
    }
  }, [dispatch, user, isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const totalInvested = contributions?.reduce((acc, c) => acc + (c.amount || 0), 0) || 0;

  const stats = [
    {
      label: 'Total Investi',
      value: formatCurrency(totalInvested),
      icon: <Wallet className="text-emerald-600" />,
      trend: '+12%',
      trendUp: true,
      description: 'Portefeuille'
    },
    {
      label: 'Projets Soutenus',
      value: contributions?.length.toString() || '0',
      icon: <Users className="text-primary-600" />,
      trend: contributions?.length > 0 ? 'Actif' : '0',
      trendUp: contributions?.length > 0,
      description: 'Investissements'
    },
    {
      label: 'Rendement Estimé',
      value: '8.5%',
      icon: <TrendingUp className="text-green-600" />,
      trend: '+1.2%',
      trendUp: true,
      description: 'Projection IA'
    },
    {
      label: 'Récompenses',
      value: '3',
      icon: <Award className="text-amber-600" />,
      trend: 'À venir',
      trendUp: false,
      description: 'Prochainement'
    },
  ];

  const recentActivities = contributions?.slice(0, 3).map((contribution) => ({
    id: contribution.id,
    type: 'contribution',
    title: `Investissement de ${formatCurrency(contribution.amount)}`,
    description: `Projet #${contribution.projetId}`,
    date: new Date(contribution.createdAt),
    icon: <CheckCircle2 className="w-4 h-4" />,
    amount: contribution.amount
  })) || [];

  return (
    <div className="bg-transparent">

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Bienvenue, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{user?.prenom}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 font-bold border border-emerald-200 px-4 py-1.5 rounded-full shadow-sm text-sm">
                  Investisseur
                </span>
                <span className="text-sm text-slate-500 font-medium">Membre depuis <span className="font-bold text-slate-700">{user?.createdAt ? formatDate(user.createdAt) : 'récemment'}</span></span>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                size="sm"
                onClick={() => navigate('/projects')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all flex-1 lg:flex-none"
              >
                Explorer des projets
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                    <div className="text-2xl">{stat.icon}</div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${stat.trendUp ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-slate-500 bg-slate-50 border border-slate-100'}`}>
                    <ArrowUpRight className={`w-3.5 h-3.5 ${!stat.trendUp && 'rotate-90'}`} />
                    {stat.trend}
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xs text-slate-400 font-medium">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  Projets Soutenus
                </h2>
                <Link to="/projects" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl transition-all">
                  Découvrir plus →
                </Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-slate-100 rounded-2xl p-6 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded-xl w-1/4 mb-3" />
                      <div className="h-6 bg-slate-200 rounded-xl w-3/4 mb-2" />
                      <div className="h-4 bg-slate-200 rounded-xl w-full" />
                    </div>
                  ))}
                </div>
              ) : contributions?.length > 0 ? (
                <div className="space-y-4">
                  {contributions.slice(0, 3).map((contribution) => (
                    <div
                      key={contribution.id}
                      onClick={() => navigate(`/projects/${contribution.projetId}`)}
                      className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 border border-emerald-200">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
                            Investissement de {formatCurrency(contribution.amount)}
                          </h3>
                          <p className="text-sm text-slate-500 font-medium">Projet #{contribution.projetId}</p>
                          <p className="text-xs text-slate-400 mt-2 font-medium">
                            {formatDate(contribution.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 hover:border-emerald-200 transition-all">
                  <PlusCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2 font-semibold">Vous n'avez pas encore investi</p>
                  <p className="text-slate-400 text-sm mb-6">Explorez notre catalogue et participez à l'innovation</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/projects')}
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    Voir les projets
                  </Button>
                </div>
              )}
            </div>

            {recentActivities.length > 0 && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-6 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-amber-600" />
                  </div>
                  Transactions récentes
                </h2>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all group">
                      <div className="w-11 h-11 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center text-slate-500 flex-shrink-0 border border-amber-200 group-hover:shadow-md transition-all">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-500 font-medium">{activity.description}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-8 border border-emerald-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-lg text-emerald-900">Conseil IA du jour</h3>
              </div>
              <p className="text-sm text-emerald-800 mb-4 font-medium leading-relaxed">
                Diversifiez vos investissements pour maximiser vos rendements et réduire les risques.
              </p>
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 w-full font-semibold">
                Stratégies d'investissement
              </Button>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all">
              <h3 className="font-bold text-lg text-slate-900 mb-6 pb-4 border-b border-gray-100">En un coup d'œil</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-transparent transition-all">
                  <span className="text-sm font-medium text-slate-600">Investissements Réussis</span>
                  <span className="font-bold text-lg text-emerald-600">{contributions?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all">
                  <span className="text-sm font-medium text-slate-600">Rappels en attente</span>
                  <span className="font-bold text-lg text-red-600">0</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardInvestisseur;
