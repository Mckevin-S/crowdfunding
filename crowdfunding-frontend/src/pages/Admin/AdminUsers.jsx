import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import authService from '../../services/authService';
import { 
  UserPlus, UserCheck, UserX, Users as UsersIcon, Mail, Shield, User, 
  ShieldAlert, ShieldCheck, MoreVertical, Search, Filter, XCircle 
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { downloadCSV } from '../../utils/exportUtils';

// Modale de confirmation rapide
function ConfirmActionModal({ isOpen, onClose, onConfirm, title, description, confirmText, isDanger }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 border border-slate-100">
        <div className={`w-14 h-14 rounded-full ${isDanger ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'} flex items-center justify-center mb-6`}>
           {isDanger ? <ShieldAlert className="w-8 h-8"/> : <ShieldCheck className="w-8 h-8"/>}
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-3">{title}</h3>
        <p className="text-slate-600 mb-8 leading-relaxed font-medium">{description}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-all">
            Annuler
          </button>
          <button 
            onClick={onConfirm} 
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${isDanger ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function UserModal({ isOpen, onClose, onSave, user = null }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    role: 'CONTRIBUTEUR'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        prenom: user.prenom || '',
        nom: user.nom || '',
        email: user.email || '',
        password: '', // On ne pré-remplit pas le mot de passe
        role: user.role || 'CONTRIBUTEUR'
      });
    } else {
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        role: 'CONTRIBUTEUR'
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Erreur gérée dans le parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 animate-in fade-in slide-in-from-bottom-8 duration-500 border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {user ? 'Mettez à jour les informations du compte' : 'Créez un nouvel accès à la plateforme'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Prénom</label>
              <input
                required
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="Ex: Jean"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Nom</label>
              <input
                required
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="Ex: Dupont"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email professionnel</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                disabled={!!user}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="j.dupont@exemple.com"
              />
            </div>
          </div>

          {!user && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mot de passe initial</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Rôle et autorisations</label>
            <div className="grid grid-cols-3 gap-3">
              {['CONTRIBUTEUR', 'PORTEUR_PROJET', 'ADMIN'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({...formData, role: r})}
                  className={`py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all ${
                    formData.role === r 
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 text-slate-500'
                  }`}
                >
                  {r === 'ADMIN' ? 'Administrateur' : r === 'PORTEUR_PROJET' ? 'Porteur' : 'Investisseur'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-50">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Traitement...' : user ? 'Mettre à jour' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Action state
  const [actionModal, setActionModal] = useState({ isOpen: false, user: null, action: null });
  const [userModal, setUserModal] = useState({ isOpen: false, user: null });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      // On s'attend à recevoir une liste d'utilisateurs
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleActionClick = (user, action) => {
    setActionModal({ isOpen: true, user, action });
  };

  const executeAction = async () => {
    const { user, action } = actionModal;
    try {
      if (action === 'ban') {
        await userService.banUser(user.id);
        toast.success(`Le compte de ${user.prenom} a été suspendu.`);
      } else if (action === 'activate') {
        await userService.activateUser(user.id);
        toast.success(`Le compte de ${user.prenom} a été réactivé.`);
      }
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de l\'exécution de l\'action');
    } finally {
      setActionModal({ isOpen: false, user: null, action: null });
    }
  };

  const handleSaveUser = async (formData) => {
    try {
      if (userModal.user) {
        // Edit
        await userService.updateUser(userModal.user.id, formData);
        toast.success("Utilisateur mis à jour avec succès");
      } else {
        // Create
        await authService.register(formData);
        toast.success("Utilisateur créé avec succès");
      }
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
      throw error;
    }
  };

  const filteredUsers = users.filter((u) => {
    const searchString = `${u.prenom} ${u.nom} ${u.email} ${u.role}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const stats = [
    { label: 'Utilisateurs', value: users.length, icon: <UsersIcon className="w-5 h-5"/>, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Porteurs', value: users.filter(u => u.role === 'PORTEUR_PROJET').length, icon: <UserPlus className="w-5 h-5"/>, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Actifs', value: users.filter(u => u.statut === 'ACTIVE').length, icon: <UserCheck className="w-5 h-5"/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Bannis', value: users.filter(u => u.statut === 'BANNED').length, icon: <UserX className="w-5 h-5"/>, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Utilisateurs</h2>
          <p className="text-slate-500 mt-1 font-medium">Gérez les comptes et les accès à la plateforme.</p>
        </div>
        <button 
          onClick={() => setUserModal({ isOpen: true, user: null })}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 flex items-center gap-4 hover:shadow-lg transition-all border-none">
            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{loading ? '...' : stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => downloadCSV(filteredUsers, 'Liste_Utilisateurs.csv')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Exporter CSV
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date Inscription</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Chargement des utilisateurs...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-100 to-primary-200 flex flex-shrink-0 items-center justify-center text-primary-700 font-bold uppercase shadow-sm border border-white">
                          {user.prenom?.charAt(0) || ''}{user.nom?.charAt(0) || ''}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{user.prenom} {user.nom}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'ADMIN' ? 'primary' : user.role === 'PORTEUR_PROJET' ? 'success' : 'default'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.statut === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        user.statut === 'BANNED' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {user.statut === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        {user.statut === 'BANNED' && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        {user.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(user.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'ADMIN' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setUserModal({ isOpen: true, user })}
                            className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-lg transition-colors"
                            title="Modifier l'utilisateur"
                          >
                            <Shield className="w-5 h-5" />
                          </button>
                          {user.statut === 'ACTIVE' ? (
                            <button
                              onClick={() => handleActionClick(user, 'ban')}
                              className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors group"
                              title="Suspendre le compte"
                            >
                              <ShieldAlert className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActionClick(user, 'activate')}
                              className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 rounded-lg transition-colors"
                              title="Réactiver le compte"
                            >
                              <ShieldCheck className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <UserModal 
        isOpen={userModal.isOpen}
        user={userModal.user}
        onClose={() => setUserModal({ isOpen: false, user: null })}
        onSave={handleSaveUser}
      />

      <ConfirmActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, user: null, action: null })}
        onConfirm={executeAction}
        title={actionModal.action === 'ban' ? 'Suspendre l\'utilisateur' : 'Réactiver l\'utilisateur'}
        description={
          actionModal.action === 'ban'
            ? `Êtes-vous sûr de vouloir suspendre le compte de ${actionModal.user?.prenom} ${actionModal.user?.nom} ? Cet utilisateur ne pourra plus se connecter.`
            : `Voulez-vous vraiment réactiver le compte de ${actionModal.user?.prenom} ${actionModal.user?.nom} ?`
        }
        confirmText={actionModal.action === 'ban' ? 'Oui, suspendre' : 'Oui, réactiver'}
        isDanger={actionModal.action === 'ban'}
      />
    </div>
  );
}
