import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  ChevronRight, 
  Rocket,
  Compass,
  Wallet,
  ArrowLeft
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import NotificationDropdown from '../common/NotificationDropdown';
import clsx from 'clsx';

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const isPorteur = user?.role === 'PORTEUR_PROJET' || user?.role === 'ADMIN';
  const roleColor = isPorteur ? 'primary' : 'emerald';

  const porteurNavigation = [
    { name: 'Dashboard', href: '/porteur/dashboard', icon: LayoutDashboard },
    { name: 'Mes Projets', href: '/porteur/mes-projets', icon: Briefcase },
    { name: 'Lancer un Projet', href: '/projects/create', icon: PlusCircle },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Mon Profil', href: '/profile', icon: User },
    { name: 'Paramètres', href: '/profile/edit', icon: Settings },
  ];

  const investisseurNavigation = [
    { name: 'Dashboard', href: '/investisseur/dashboard', icon: LayoutDashboard },
    { name: 'Explorer', href: '/investisseur/explorer', icon: Compass },
    { name: 'Mes Contributions', href: '/investisseur/mes-contributions', icon: Wallet },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Mon Profil', href: '/profile', icon: User },
    { name: 'Paramètres', href: '/profile/edit', icon: Settings },
  ];

  const navigation = isPorteur ? porteurNavigation : investisseurNavigation;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl border-r border-slate-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={clsx(
                "w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-0",
                isPorteur ? "bg-primary-600 rotate-[-8deg]" : "bg-emerald-600 rotate-6"
            )}>
              <Rocket className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-display font-black text-slate-900 tracking-tight">
              Invest<span className={isPorteur ? "text-primary-600" : "text-emerald-600"}>AFRIKA</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-6">
            <div className={clsx(
                "p-4 rounded-2xl border flex items-center gap-3",
                isPorteur ? "bg-primary-50/50 border-primary-100" : "bg-emerald-50/50 border-emerald-100"
            )}>
                <div className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm",
                    isPorteur ? "bg-primary-600" : "bg-emerald-600"
                )}>
                    {user?.prenom?.[0]}{user?.nom?.[0]}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user?.prenom} {user?.nom}</p>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-tighter truncate">
                        {isPorteur ? 'Porteur de Projet' : 'Investisseur'}
                    </p>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                  isActive
                    ? isPorteur 
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                        : "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={clsx("w-5 h-5 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                {item.name}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group font-medium text-sm"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopBar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-3 text-slate-400">
               <Link to="/" className="hover:text-slate-600 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
               </Link>
               <div className="h-4 w-px bg-slate-200 mx-1"></div>
               <h1 className="text-sm font-bold text-slate-900">
                  {navigation.find(n => n.href === location.pathname)?.name || 'Espace Personnel'}
               </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
             <div className="hidden md:flex relative group">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="pl-9 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all w-48 lg:w-64"
                />
             </div>

             <NotificationDropdown />

             <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                <Settings className="w-5 h-5" />
             </button>

             <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>

             <Link to="/profile" className="flex items-center gap-3 group">
                <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-transform group-hover:-translate-y-0.5",
                    isPorteur ? "bg-primary-600" : "bg-emerald-600"
                )}>
                   {user?.prenom?.[0]}
                </div>
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 bg-slate-50/50">
           <div className="max-w-6xl mx-auto pb-12">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
