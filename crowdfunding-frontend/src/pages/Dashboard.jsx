import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Wallet,
  Briefcase,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Sparkles,
  Heart,
  Rocket,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Eye,
  ThumbsUp,
  Award,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import { fetchUserProjects } from '@store/slices/projectSlice';
import { fetchUserContributions } from '@store/slices/contributionSlice';
import { logoutUser } from '@store/slices/authSlice';
import { formatDate, formatCurrency } from '@utils/formatters';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { userProjects, loading: projectsLoading } = useSelector((state) => state.project);
  const { contributions, loading: contribsLoading } = useSelector((state) => state.contribution);

  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.id) {
      if (user.role === 'PORTEUR_PROJET' || user.role === 'ADMIN') {
        dispatch(fetchUserProjects(user.id));
      } else {
        dispatch(fetchUserContributions(user.id));
      }
    }
  }, [dispatch, user, isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  // Calculate statistics based on user role
  const totalRaised = userProjects?.reduce((acc, p) => acc + (p.montantActuel || 0), 0) || 0;
  const totalInvested = contributions?.reduce((acc, c) => acc + (c.amount || 0), 0) || 0;
  const successRate = userProjects?.length
    ? ((userProjects.filter((p) => p.statut === 'COMPLETED').length / userProjects.length) * 100).toFixed(0)
    : '0';

  const stats = user?.role === 'PORTEUR_PROJET' || user?.role === 'ADMIN'
    ? [
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
    ]
    : [
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

  // Mock activities
  const recentActivities = user?.role === 'PORTEUR_PROJET'
    ? (userProjects?.slice(0, 3).map((project) => ({
      id: project.id,
      type: 'project_update',
      title: project.titre,
      description: `${project.statut === 'ACTIVE' ? 'Campagne en cours' : 'Nouveau projet créé'}`,
      date: new Date(project.createdAt),
      icon: <Rocket className="w-4 h-4" />
    })) || [])
    : (contributions?.slice(0, 3).map((contribution) => ({
      id: contribution.id,
      type: 'contribution',
      title: `Investissement de ${formatCurrency(contribution.amount)}`,
      description: `Projet #${contribution.projetId}`,
      date: new Date(contribution.createdAt),
      icon: <CheckCircle2 className="w-4 h-4" />,
      amount: contribution.amount
    })) || []);

  const endingSoonProjects = userProjects?.filter((p) =>
    p.statut === 'ACTIVE' && p.dateFin && new Date(p.dateFin) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-primary-900">Tableau de bord</h1>
              <div className="hidden md:flex gap-1">
                {['overview', 'projects', 'investments', 'rewards'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    {tab === 'overview' && 'Aperçu'}
                    {tab === 'projects' && 'Mes projets'}
                    {tab === 'investments' && 'Investissements'}
                    {tab === 'rewards' && 'Récompenses'}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link
                to="/settings"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Bonjour, {user?.prenom || 'Utilisateur'} !
              </h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary-100 text-primary-700 font-semibold">
                  {user?.role === 'ADMIN' ? 'Administrateur' : user?.role === 'PORTEUR_PROJET' ? 'Porteur de projet' : 'Investisseur'}
                </Badge>
                <span className="text-sm text-slate-500">
                  Membre depuis {user?.createdAt ? formatDate(user.createdAt) : 'récemment'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/projects')}
              >
                Explorer
              </Button>
              {(user?.role === 'PORTEUR_PROJET' || user?.role === 'ADMIN') && (
                <Button
                  size="sm"
                  onClick={() => navigate('/projects/create')}
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                >
                  Nouveau projet
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trendUp
                    ? 'text-green-600 bg-green-50'
                    : 'text-slate-500 bg-slate-50'
                  }`}>
                  <ArrowUpRight className={`w-3 h-3 ${!stat.trendUp && 'rotate-90'}`} />
                  {stat.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              {stat.description && (
                <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
              )}
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Projects/Investments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Projects Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" />
                  {user?.role === 'PORTEUR_PROJET' ? 'Mes projets actifs' : 'Recommandés pour vous'}
                </h2>
                <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Voir tout
                </Link>
              </div>

              {projectsLoading || contribsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
                      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {user?.role === 'PORTEUR_PROJET' && userProjects?.length > 0 ? (
                    userProjects.slice(0, 3).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="bg-primary-50 text-primary-700">
                            {project.categorie}
                          </Badge>
                          <Badge variant={project.statut === 'ACTIVE' ? 'success' : 'secondary'}>
                            {project.statut === 'ACTIVE' ? 'En cours' : project.statut}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.titre}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-emerald-600 font-semibold">
                              {formatCurrency(project.montantActuel || 0)}
                            </span>
                            <span className="text-slate-400">/ {formatCurrency(project.objectifFinancier)}</span>
                          </div>
                          <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
                        </div>
                      </div>
                    ))
                  ) : contributions?.length > 0 ? (
                    contributions.slice(0, 3).map((contribution) => (
                      <div
                        key={contribution.id}
                        className="bg-white rounded-xl p-6 border border-slate-100"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">
                              Investissement de {formatCurrency(contribution.amount)}
                            </h3>
                            <p className="text-sm text-slate-500">Projet #{contribution.projetId}</p>
                            <p className="text-xs text-slate-400 mt-2">
                              {formatDate(contribution.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-200">
                      <PlusCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-2">Aucun projet pour le moment</p>
                      {(user?.role === 'PORTEUR_PROJET' || user?.role === 'ADMIN') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/projects/create')}
                        >
                          Créer mon premier projet
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            {recentActivities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-slate-500" />
                  Activité récente
                </h2>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{activity.title}</p>
                        <p className="text-sm text-slate-500">{activity.description}</p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {formatDate(activity.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Urgent & Tips */}
          <div className="space-y-8">
            {/* Ending Soon */}
            {endingSoonProjects.length > 0 && (
              <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-primary-300" />
                  <h3 className="font-bold">Se termine bientôt</h3>
                </div>
                <div className="space-y-4">
                  {endingSoonProjects.slice(0, 2).map((project) => (
                    <div
                      key={project.id}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <p className="font-semibold mb-2">{project.titre}</p>
                      <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-primary-400 rounded-full"
                          style={{ width: `${(project.montantActuel / project.objectifFinancier) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-primary-200">
                        <span>{formatCurrency(project.montantActuel)}</span>
                        <span>{formatCurrency(project.objectifFinancier)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-amber-900">Conseil IA du jour</h3>
              </div>
              <p className="text-sm text-amber-800 mb-3">
                {user?.role === 'PORTEUR_PROJET'
                  ? "Les projets avec des vidéos de présentation ont 40% plus de chances d'atteindre leur objectif."
                  : "Diversifiez vos investissements pour maximiser vos rendements et réduire les risques."}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-200 text-amber-700 hover:bg-amber-100"
                fullWidth
              >
                En savoir plus
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">En un coup d'œil</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Projets suivis</span>
                  <span className="font-semibold text-slate-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Notifications</span>
                  <span className="font-semibold text-slate-900">3 non lues</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Prochaine échéance</span>
                  <span className="font-semibold text-slate-900">Dans 5 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;