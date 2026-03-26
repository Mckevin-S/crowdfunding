import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { MapPin, Mail, Phone, User, Calendar, Shield, Edit3 } from 'lucide-react';
import Button from '../../components/common/Button';
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
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Profil Résumé */}
        <section className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="relative h-24 bg-gradient-to-r from-primary-900 to-emerald-800" />
          <div className="p-6 pt-12 text-center">
            <div className="w-28 h-28 rounded-full bg-white shadow-lg mx-auto flex items-center justify-center text-4xl font-black text-primary-900">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{(profile.prenom || profile.nom || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{profile.prenom} {profile.nom}</h2>
            <p className="text-sm uppercase tracking-widest text-slate-500 mt-1">{getRoleLabel(profile.role)}</p>
            <span className={`inline-flex items-center mt-3 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(profile.statut)}`}>
              {profile.statut}
            </span>

            <div className="mt-6 space-y-3 text-left text-sm">
              <p className="flex items-center gap-2 text-slate-500"><Mail className="w-4 h-4" /> {profile.email}</p>
              {profile.telephone && <p className="flex items-center gap-2 text-slate-500"><Phone className="w-4 h-4" /> {profile.telephone}</p>}
              {(profile.address || profile.ville) && <p className="flex items-center gap-2 text-slate-500"><MapPin className="w-4 h-4" /> {profile.address || ''} {profile.ville ? `, ${profile.ville}` : ''}</p>}
            </div>

            <Link to="/profile/edit" className="mt-8 block">
              <Button variant="secondary" className="w-full">Modifier le profil</Button>
            </Link>
          </div>
        </section>

        {/* Détails complets */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Détails du compte</h3>
            <span className="text-xs font-semibold tracking-wider text-slate-500">Dernière mise à jour : {new Date(profile.dateCreation).toLocaleDateString()}</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Biographie</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{profile.bio || 'Pas de biographie fournie.'}</p>
            </article>
            <article className="rounded-2xl bg-slate-50 p-4 border border-gray-100">
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Catégorie préférée</h4>
              <p className="text-slate-700 text-sm">{profile.categoriePreferee || 'Aucune catégorie définie'}</p>
            </article>
            <article className="rounded-2xl bg-slate-50 p-4 border border-gray-100 md:col-span-2">
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">KYC</h4>
              <p className="text-slate-700 text-sm">Statut : <strong>{profile.kycStatus || 'PENDING'}</strong></p>
            </article>
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-primary-100 p-4">
            <h4 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-2">Insights</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Le profil affiché ici est directement connecté à votre base de données. Tous les champs et le statut sont récupérés en temps réel.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;