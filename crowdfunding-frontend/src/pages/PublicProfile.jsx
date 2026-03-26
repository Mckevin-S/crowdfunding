import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Trophy, Users, Rocket, Mail, Phone, User } from 'lucide-react';
import Button from '../components/common/Button';
import { userService } from '../services/userService';
import projectService from '../services/projectService';

const PublicProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (id) {
          const [userResp, projetResp] = await Promise.all([
            userService.getUserById(id),
            projectService.getProjetsByPorteur(id),
          ]);

          setProfile(userResp.data);
          setProjects(projetResp.data || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil ou des projets:', err);
        setError('Profil non trouvé ou accès non autorisé');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl p-12">
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-gray-200 rounded-3xl mx-auto mb-8"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center">
            <p className="text-red-600 mb-4">{error || 'Profil non trouvé'}</p>
            <Link to="/projects">
              <Button variant="primary">Retour aux projets</Button>
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
      case 'ACTIVE': return 'text-green-600 bg-green-50';
      case 'SUSPENDED': return 'text-yellow-600 bg-yellow-50';
      case 'BANNED': return 'text-red-600 bg-red-50';
      case 'DELETED': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const totalProjects = projects.length;
  const totalContributors = projects.reduce((sum, project) => sum + (project.nombreContributeurs || 0), 0);
  const completedCount = projects.filter((project) => project.statut === 'COMPLETED').length;
  const successRate = totalProjects ? `${Math.round((completedCount / totalProjects) * 100)}%` : '0%';

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-900/5 border border-gray-50 p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-900 to-emerald-800" />

          <div className="relative z-10 pt-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-12">
              <div className="w-32 h-32 bg-white rounded-3xl shadow-xl border-4 border-white flex items-center justify-center text-4xl font-black text-primary-900">
                {profile.prenom?.charAt(0) || profile.nom?.charAt(0) || 'U'}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-display font-black text-slate-900">
                    {profile.prenom} {profile.nom}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(profile.statut)}`}>
                    {profile.statut}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    {getRoleLabel(profile.role)}
                  </span>
                  <span className="h-4 w-px bg-gray-200" />
                  <span className="text-primary-600">Membre depuis {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Informations de contact</h3>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-600">Email</p>
                    <p className="text-slate-900">{profile.email}</p>
                  </div>
                </div>

                {profile.telephone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Téléphone</p>
                      <p className="text-slate-900">{profile.telephone}</p>
                    </div>
                  </div>
                )}

                {profile.address && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Adresse</p>
                      <p className="text-slate-900">{profile.address}</p>
                    </div>
                  </div>
                )}

                {profile.ville && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                    <MapPin className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Ville</p>
                      <p className="text-slate-900">{profile.ville}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Informations supplémentaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Informations supplémentaires</h3>

                {profile.bio && (
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-semibold text-slate-600 mb-2">Biographie</p>
                    <p className="text-slate-900">{profile.bio}</p>
                  </div>
                )}

                {profile.categoriePreferee && (
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm font-semibold text-slate-600 mb-2">Catégorie préférée</p>
                    <p className="text-slate-900">{profile.categoriePreferee}</p>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-sm font-semibold text-slate-600 mb-2">Statut KYC</p>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    profile.kycStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    profile.kycStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.kycStatus || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistiques réelles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{totalProjects}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projets créés</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{successRate}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux de succès</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{totalContributors}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contributeurs</p>
                </div>
              </div>
            </div>

            <div className="text-center p-8 bg-primary-50 rounded-2xl border border-primary-100">
               <p className="text-sm font-bold text-primary-900 mb-4">Connectez-vous pour voir les projets de cet auteur</p>
               <Link to="/login">
                 <Button variant="primary">Se connecter</Button>
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
