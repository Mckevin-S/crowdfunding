import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X, Rocket } from 'lucide-react';
import Button from '../common/Button';
import clsx from 'clsx';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Explorer', path: '/projects' },
    { name: 'À propos', path: '/about' },
  ];

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-vibrant rotate-[-8deg] group-hover:rotate-0 transition-transform">
            <Rocket className="w-6 h-6 fill-current" />
          </div>
          <span className="text-2xl font-display font-black text-slate-900 tracking-tighter">
            Invest<span className="text-primary-500">AFRIKA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'text-sm font-bold transition-all hover:text-primary-500 uppercase tracking-widest',
                location.pathname === link.path ? 'text-primary-500 underline underline-offset-8 decoration-2' : 'text-slate-600'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-black text-slate-800 hover:text-primary-600 transition-colors uppercase tracking-widest">
                Se connecter
              </Link>
              <Button 
                variant="secondary" 
                size="sm" 
                className="rounded-full px-8 bg-slate-900 shadow-xl"
                onClick={() => navigate('/register')}
              >
                S'inscrire
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-6">
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="text-sm font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-widest">
                    Administration
                  </Link>
                )}
               <Link to="/dashboard" className="text-sm font-black text-slate-800 hover:text-primary-600 transition-colors uppercase tracking-widest">
                 Mon Espace
               </Link>
               <Button 
                 variant="outline" 
                 size="sm" 
                 className="rounded-full px-8 border-slate-200 text-slate-600"
                 onClick={() => {
                   localStorage.removeItem('token');
                   window.location.href = '/login';
                 }}
               >
                 Déconnexion
               </Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bg-white border-t border-gray-100 p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-full duration-500">
           {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className="text-lg font-bold text-slate-900 border-b border-gray-50 pb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="grid grid-cols-2 gap-4 mt-4">
             <Button variant="outline" onClick={() => (window.location.href = '/login')}>Login</Button>
             <Button onClick={() => (window.location.href = '/register')}>S'inscrire</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;