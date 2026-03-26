import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  ArrowUpRight,
  PlusCircle,
  Sparkles,
  Rocket,
  Activity,
  Zap,
  Wallet,
  Users,
  Bell,
  Settings,
  LogOut,
  Eye
} from 'lucide-react';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import { fetchUserProjects } from '@store/slices/projectSlice';
import { logoutUser } from '@store/slices/authSlice';
import { formatDate, formatCurrency } from '@utils/formatters';

const DashboardPorteur = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userProjects, loading } = useSelector((state) => state.project);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.id) {
      dispatch(fetchUserProjects(user.id));
    }
  }, [dispatch, user, isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  const totalRaised = userProjects?.reduce((acc, p) => acc + (p.montantActuel || 0), 0) || 0;
  const successRate = userProjects?.length
    ? ((userProjects.filter((p) => p.statut === 'COMPLETED').length / userProjects.length) * 100).toFixed(0)
    : '0';

  const stats = [
    {
      label: 'Total Récolté',
      value: formatCurrency(totalRaised),
      icon: <Wallet className="text-emerald-600" />,
      trend: '+15%',
      trendUp: true,
      description: 'Objectif global'
    },
    {
      label: 'Mes Campagnes',
      value: userProjects?.length.toString() || '0',
      icon: <Briefcase className="text-amber-600" />,
      trend: userProjects?.length > 0 ? 'Actif' : '0',
      trendUp: userProjects?.length > 0,
      description: 'Projets en cours'
    },
    {
      label: 'Taux de Succès',
      value: `${successRate}%`,
      icon: <Sparkles className="text-primary-600" />,
      trend: successRate > 80 ? 'Excellent' : 'En progression',
      trendUp: true,
      description: 'Précision IA'
    },
    {
      label: 'Impact Généré',
      value: '1.2k',
      icon: <Users className="text-blue-600" />,
      trend: '+32%',
      trendUp: true,
      description: 'Bénéficiaires'
    },
  ];

  const recentActivities = userProjects?.slice(0, 3).map((project) => ({
    id: project.id,
    type: 'project_update',
    title: project.titre,
    description: `${project.statut === 'ACTIVE' ? 'Campagne en cours' : 'Nouveau projet créé'}`,
    date: new Date(project.createdAt),
    icon: <Rocket className="w-4 h-4" />
  })) || [];

  const endingSoonProjects = userProjects?.filter((p) =>
    p.statut === 'ACTIVE' && p.dateFin && new Date(p.dateFin) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ) || [];

  return (
    <div className="bg-transparent">

      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                Bienvenue, <span className="bg-gradient-to-r from-primary-600 to-emerald-600 bg-clip-text text-transparent">{user?.prenom}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <Badge variant="secondary" className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-bold border border-primary-200 px-4 py-1.5 rounded-full shadow-sm">
                  Porteur de projet
                </Badge>
                <span className="text-sm text-slate-500 font-medium">Membre depuis <span className="font-bold text-slate-700">{user?.createdAt ? formatDate(user.createdAt) : 'récemment'}</span></span>
              </div>
            </div>
            <div className="flex gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/projects')}
                className="border-gray-200 text-slate-600 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50 flex-1 lg:flex-none"
              >
                Découvrir
              </Button>
              <Button
                size="sm"
                onClick={() => navigate('/projects/create')}
                leftIcon={<PlusCircle className="w-4 h-4" />}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all flex-1 lg:flex-none"
              >
                Nouveau projet
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
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
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                  </div>
                  Mes projets actifs
                </h2>
                <Link to="/profile" className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-xl transition-all">
                  Voir mes projets →
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
              ) : userProjects?.length > 0 ? (
                <div className="space-y-4">
                  {userProjects.slice(0, 3).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary" className="bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-semibold border border-primary-200">
                          {project.categorie}
                        </Badge>
                        <Badge variant={project.statut === 'ACTIVE' ? 'success' : 'secondary'} className={project.statut === 'ACTIVE' ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200' : ''}>
                          {project.statut === 'ACTIVE' ? '✓ En cours' : project.statut}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{project.titre}</h3>
                      <p className="text-sm text-slate-500 mb-5 line-clamp-2 font-medium">{project.description}</p>
                      <div className="space-y-3">
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((project.montantActuel / project.objectifFinancier) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-emerald-600 font-bold text-sm">
                              {formatCurrency(project.montantActuel || 0)}
                            </span>
                            <span className="text-slate-400 text-sm">/ {formatCurrency(project.objectifFinancier)}</span>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200 hover:border-primary-200 transition-all">
                  <PlusCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-2 font-semibold">Aucun projet pour le moment</p>
                  <p className="text-slate-400 text-sm mb-6">Commencez votre aventure dans le financement participatif</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/projects/create')}
                    className="border-primary-200 text-primary-600 hover:bg-primary-50"
                  >
                    Créer mon premier projet
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
                  Activité récente
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
            {endingSoonProjects.length > 0 && (
              <div className="rounded-3xl p-8 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white border border-primary-700/50 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                    <Rocket className="w-5 h-5 text-primary-300" />
                  </div>
                  <h3 className="font-bold text-lg">Se termine bientôt</h3>
                </div>
                <div className="space-y-4">
                  {endingSoonProjects.slice(0, 2).map((project) => (
                    <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="p-4 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/30 transition-all cursor-pointer group">
                      <p className="font-bold mb-3 text-white group-hover:text-primary-100">{project.titre}</p>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                        <div className="h-full bg-gradient-to-r from-primary-300 to-primary-200 rounded-full transition-all duration-500" style={{ width: `${Math.min((project.montantActuel / project.objectifFinancier) * 100, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-primary-100">
                        <span className="font-semibold">{formatCurrency(project.montantActuel)}</span>
                        <span className="font-medium">{formatCurrency(project.objectifFinancier)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-amber-50 to-amber-50/50 rounded-3xl p-8 border border-amber-200 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-bold text-lg text-amber-900">Conseil IA du jour</h3>
              </div>
              <p className="text-sm text-amber-800 mb-4 font-medium leading-relaxed">
                Les projets avec des vidéos de présentation ont 40% plus de chances d'atteindre leur objectif.
              </p>
              <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-100 w-full font-semibold">
                En savoir plus
              </Button>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all">
              <h3 className="font-bold text-lg text-slate-900 mb-6 pb-4 border-b border-gray-100">En un coup d'œil</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all">
                  <span className="text-sm font-medium text-slate-600">Projets suivis</span>
                  <span className="font-bold text-lg text-slate-900">12</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all">
                  <span className="text-sm font-medium text-slate-600">Notifications</span>
                  <span className="font-bold text-lg text-red-600">3 non lues</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPorteur;
