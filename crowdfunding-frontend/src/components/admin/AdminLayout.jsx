import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck,
  CreditCard,
  AlertTriangle,
  MessageSquare,
  Settings,
  Shield,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import NotificationDropdown from '../common/NotificationDropdown';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projets', href: '/admin/projects', icon: Briefcase },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'KYC & Audit', href: '/admin/kyc', icon: FileCheck },
  { name: 'Paiements', href: '/admin/payments', icon: CreditCard },
  { name: 'Litiges', href: '/admin/disputes', icon: AlertTriangle },
  { name: 'Contenu', href: '/admin/content', icon: MessageSquare },
  { name: 'Analytics', href: '/admin/analytics', icon: Settings },
  { name: 'Configuration', href: '/admin/settings', icon: Shield },
  { name: 'Mon Profil', href: '/admin/profile', icon: Users },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 shadow-2xl border-r border-slate-800/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md relative overflow-hidden">
          {/* subtle glow behind logo */}
          <div className="absolute top-1/2 left-10 -translate-y-1/2 w-12 h-12 bg-primary-500/20 rounded-full blur-xl pointer-events-none" />
          
          <Link to="/admin/dashboard" className="flex items-center gap-3 group relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black text-white tracking-tight font-display">
              Tuto<span className="text-primary-500">Admin</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 -mr-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar px-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-4">
            Menu Principal
          </div>
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/10 to-transparent text-primary-400 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full" />
                )}
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  {item.name}
                </div>
                {!isActive && (
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-slate-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-950/50 backdrop-blur-md">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.02)] flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {navigation.find((item) => location.pathname.startsWith(item.href))?.name || 'Administration'}
              </h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Espace sécurisé</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
             <div className="hidden md:flex relative group cursor-pointer">
               <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-primary-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Recherche rapide..." 
                 className="pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200 focus:border-primary-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all w-64 uppercase-placeholder"
               />
             </div>

             <div className="h-8 w-px bg-slate-200 hidden sm:block mx-2"></div>

             <NotificationDropdown />

             <Link to="/" className="text-sm font-bold text-slate-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-2.5 rounded-xl transition-all border border-slate-200 hover:border-primary-200 hidden sm:flex items-center gap-2 shadow-sm">
               Portail Public
             </Link>

             <Link to="/admin/profile" className="relative group">
               <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border-2 border-white shadow-md flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all">
                  AD
               </div>
               <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
