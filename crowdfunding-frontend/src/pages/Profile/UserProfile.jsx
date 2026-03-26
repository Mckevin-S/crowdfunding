import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { MapPin, Mail, Phone, User, Calendar, Shield, Edit3, CheckCircle2, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const response = await userService.getUserById(user.id);
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="animate-pulse grid gap-4">
              <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">{error || 'Profil non trouvé'}</p>
            <Link to="/dashboard">
              <Button variant="primary">Retour au tableau de bord</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'PORTEUR_PROJET': return 'Porteur de Projet';
      case 'CONTRIBUTEUR': return 'Contributeur';
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'text-emerald-800 bg-emerald-100';
      case 'SUSPENDED': return 'text-amber-800 bg-amber-100';
      case 'BANNED': return 'text-red-800 bg-red-100';
      case 'DELETED': return 'text-slate-600 bg-slate-100';
      default: return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl animate-in fade-in duration-1000">
      <div className="flex flex-col gap-12">
        {/* Profile Hero Section */}
        <section className="relative bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden p-8 md:p-12">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/20 rounded-full -ml-48 -mb-48 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar with Ring */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
               <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-white p-2 shadow-2xl">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-6xl font-black text-slate-200">
                      {(profile.prenom || 'U')[0].toUpperCase()}
                    </div>
                  )}
               </div>
            </div>

            {/* Info and Actions */}
            <div className="flex-1 text-center md:text-left">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight mb-2">
                       {profile.prenom} <span className="text-primary-600">{profile.nom}</span>
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                       <Badge variant="secondary" className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 border-none">
                          {getRoleLabel(profile.role)}
                       </Badge>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(profile.statut)}`}>
                          {profile.statut}
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Link to="/profile/edit">
                       <Button variant="outline" className="rounded-xl border-slate-200 hover:border-primary-500 font-bold px-6">
                         <Edit3 className="w-4 h-4 mr-2" /> Modifier
                       </Button>
                    </Link>
                    <Button variant="primary" className="rounded-xl shadow-lg shadow-primary-600/20 px-6 font-bold">
                       Partager
                    </Button>
                  </div>
               </div>
               
               <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl italic mb-8">
                  "{profile.bio || 'Cet utilisateur n\'a pas encore rédigé sa vision du futur.'}"
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex items-center gap-4 text-slate-400 group">
                     <Mail className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
                     <span className="text-sm font-bold truncate">{profile.email}</span>
                  </div>
                  {profile.telephone && (
                    <div className="flex items-center gap-4 text-slate-400 group">
                       <Phone className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
                       <span className="text-sm font-bold truncate">{profile.telephone}</span>
                    </div>
                  )}
                  {(profile.address || profile.ville) && (
                    <div className="flex items-center gap-4 text-slate-400 group">
                       <MapPin className="w-5 h-5 group-hover:text-primary-600 transition-colors" />
                       <span className="text-sm font-bold truncate">{profile.ville || profile.address}</span>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </section>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Legacy / Impact */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                 <h3 className="text-xl font-display font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary-600" /> Vérification et Sécurité
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut KYC</p>
                       <div className="flex items-center justify-between">
                          <p className="text-xl font-black text-slate-900">{profile.kycStatus || 'VÉRIFIÉ'}</p>
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                       </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date d'inscription</p>
                       <div className="flex items-center justify-between">
                          <p className="text-xl font-black text-slate-900">{new Date(profile.dateCreation).getFullYear()}</p>
                          <Calendar className="w-6 h-6 text-primary-400" />
                       </div>
                    </div>
                 </div>
              </section>

              <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-900/10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                 <h3 className="relative z-10 text-xl font-display font-black mb-8 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary-400" /> Aperçu de l'activité
                 </h3>
                 <p className="relative z-10 text-slate-300 font-medium leading-relaxed italic opacity-80 mb-6">
                    "Votre profil est le reflet de votre engagement pour l'Afrique. Continuez à bâtir l'avenir."
                 </p>
                 <div className="relative z-10 flex flex-wrap gap-4">
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                       <p className="text-2xl font-black">12</p>
                       <p className="text-[9px] font-black text-primary-400 uppercase tracking-widest">Interactions</p>
                    </div>
                    <div className="px-6 py-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                       <p className="text-2xl font-black">5</p>
                       <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Projets Suivis</p>
                    </div>
                 </div>
              </section>
           </div>

           {/* Sidebar Preferences */}
           <div className="space-y-8">
              <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
                 <h3 className="text-xl font-display font-black text-slate-900 mb-8">Préférences</h3>
                 <div className="space-y-8">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Catégorie Fav.</p>
                       <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                          <Shield className="w-5 h-5 text-primary-600" />
                          <span className="font-bold text-primary-900">{profile.categoriePreferee || 'Innovation Tech'}</span>
                       </div>
                    </div>
                    
                    <div className="pt-8 border-t border-slate-100">
                       <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                          Toutes vos données sont sécurisées et cryptées conformément aux standards internationaux de protection des données.
                       </p>
                    </div>

                    <Button variant="outline" className="w-full rounded-xl border-slate-200 text-slate-500 font-bold hover:bg-slate-50">
                       Paramètres de confidentialité
                    </Button>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;