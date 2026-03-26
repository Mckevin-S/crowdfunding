import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Clock, Search, Filter, MoreVertical, Eye, FolderHeart, Activity, CheckCircle2, Clock3 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import projectService from '../../services/projectService';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Calendar, Target, Layout, FileText, X } from 'lucide-react';
import { downloadCSV } from '../../utils/exportUtils';

function ProjectReviewModal({ isOpen, onClose, onConfirm, project }) {
  const [action, setAction] = useState('VALIDATE');
  const [notes, setNotes] = useState('');
  
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300 border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Examen du Projet</h3>
        <p className="text-slate-500 mb-8 font-medium border-b border-slate-50 pb-4">
          Statut actuel : <span className="text-primary-600 uppercase text-xs font-bold bg-primary-50 px-2.5 py-1 rounded-full">{project.statut}</span>
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Décision Administrative</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setAction('VALIDATE')}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 border-2 transition-all ${action === 'VALIDATE' ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
              >
                <CheckCircle className="w-5 h-5" /> Approuver
              </button>
              <button 
                onClick={() => setAction('REJECT')}
                className={`py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 border-2 transition-all ${action === 'REJECT' ? 'bg-red-50 border-red-500 text-red-700 font-bold shadow-sm' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
              >
                <XCircle className="w-5 h-5" /> Rejeter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
              Note officielle (Sera visible par le porteur)
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required={action === 'REJECT'}
              className="w-full border-slate-200 rounded-2xl p-4 text-slate-700 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all min-h-[120px] font-medium"
              placeholder={action === 'REJECT' ? "Précisez les motifs du refus..." : "Félicitations ou recommandations..."}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-slate-50">
          <button onClick={onClose} className="flex-1 px-5 py-3.5 rounded-2xl text-slate-600 hover:bg-slate-100 font-bold transition-all">
            Annuler
          </button>
          <button 
            onClick={() => onConfirm(project.id, action, notes)} 
            disabled={action === 'REJECT' && !notes.trim()}
            className="flex-1 px-5 py-3.5 rounded-2xl font-bold text-white transition-all bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 disabled:opacity-50"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ isOpen, onClose, onSave, project = null }) {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    objectifFinancier: '',
    categorie: 'Agriculture',
    dateFin: '',
    statut: 'BROUILLON'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        titre: project.titre || '',
        description: project.description || '',
        objectifFinancier: project.objectifFinancier || '',
        categorie: project.categorie || 'Agriculture',
        dateFin: project.dateFin ? project.dateFin.split('T')[0] : '',
        statut: project.statut || 'BROUILLON'
      });
    } else {
      setFormData({
        titre: '',
        description: '',
        objectifFinancier: '',
        categorie: 'Agriculture',
        dateFin: '',
        statut: 'BROUILLON'
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full p-10 animate-in fade-in slide-in-from-bottom-12 duration-500 border border-slate-100 overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {project ? 'Modifier la campagne' : 'Nouvelle campagne'}
            </h3>
            <p className="text-slate-500 font-medium mt-1">Édition rapide des paramètres du projet</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors group">
            <X className="w-7 h-7 text-slate-400 group-hover:text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" /> Titre du projet
            </label>
            <input
              required
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300"
              placeholder="Ex: Construction d'une serre solaire"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" /> Objectif (FCFA)
              </label>
              <input
                type="number"
                required
                value={formData.objectifFinancier}
                onChange={(e) => setFormData({...formData, objectifFinancier: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-slate-800"
                placeholder="5 000 000"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-500" /> Catégorie
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none font-bold text-slate-800 appearance-none bg-slate-50/50"
              >
                <option>Agriculture</option>
                <option>Technologie</option>
                <option>Éducation</option>
                <option>Santé</option>
                <option>Art & Culture</option>
                <option>Environnement</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" /> Date de fin
            </label>
            <input
              type="date"
              required
              value={formData.dateFin}
              onChange={(e) => setFormData({...formData, dateFin: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-amber-500 outline-none font-bold text-slate-800"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-wider">Description courte</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary-500 outline-none font-medium text-slate-600 leading-relaxed"
              placeholder="Décrivez les objectifs principaux du projet..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 rounded-2xl text-slate-500 font-black hover:bg-slate-100 transition-all uppercase tracking-widest text-xs"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-black shadow-xl shadow-slate-200 active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isSubmitting ? 'Publication...' : project ? 'Mettre à jour' : 'Lancer la campagne'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModal, setReviewModal] = useState({ isOpen: false, project: null });
  const [projectModal, setProjectModal] = useState({ isOpen: false, project: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await projectService.getAllProjects();
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des projets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleReviewConfirm = async (id, action, notes) => {
    try {
      const statut = action === 'VALIDATE' ? 'EN_COURS' : 'ECHEC';
      await projectService.updateProjectStatus(id, { statut, adminNotes: notes });
      toast.success("Statut du projet mis à jour avec succès");
      fetchProjects();
    } catch (error) {
       toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setReviewModal({ isOpen: false, project: null });
    }
  };

  const handleSaveProject = async (formData) => {
    try {
      if (projectModal.project) {
        await projectService.updateProject(projectModal.project.id, formData);
        toast.success("Campagne mise à jour avec succès");
      } else {
        await projectService.createProject(formData);
        toast.success("Campagne créée avec succès");
      }
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
      throw error;
    }
  };

  const handleDeleteProject = async () => {
    try {
      await projectService.deleteProject(deleteModal.projectId);
      toast.success("Campagne supprimée définitivement");
      setDeleteModal({ isOpen: false, projectId: null });
      fetchProjects();
    } catch (error) {
      toast.error("Échec de la suppression");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const searchString = `${p.titre} ${p.statut} ${p.categorie}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const stats = [
    {
      label: 'Tous les projets',
      value: projects.length,
      icon: <FolderHeart className="w-6 h-6 text-slate-600" />,
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200'
    },
    {
      label: 'En Attente (KYC)',
      value: projects.filter(p => p.statut === 'EN_ATTENTE_VALIDATION' || p.statut === 'PENDING').length,
      icon: <Clock3 className="w-6 h-6 text-amber-600" />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      label: 'En Cours (Actifs)',
      value: projects.filter(p => p.statut === 'EN_COURS' || p.statut === 'ACTIVE').length,
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    {
      label: 'Terminés',
      value: projects.filter(p => p.statut === 'TERMINE' || p.statut === 'COMPLETED' || p.statut === 'SUCCESS').length,
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Projets</h2>
          <p className="text-slate-500 mt-1 font-medium">Gérez le statut et la validation des campagnes de financement.</p>
        </div>
        <button 
          onClick={() => setProjectModal({ isOpen: true, project: null })}
          className="bg-slate-900 hover:bg-black text-white px-7 py-3.5 rounded-2xl font-black shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2 uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Campagne
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`p-6 flex items-center gap-5 border ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
            <div className={`p-4 rounded-2xl ${stat.bgColor} shadow-sm`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800">{loading ? '...' : stat.value}</p>
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
              placeholder="Rechercher par titre ou statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => downloadCSV(filteredProjects, 'Liste_Projets.csv')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Exporter CSV
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Statuts
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-6 py-4">Projet</th>
                <th className="px-6 py-4">Objectif</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Durée</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Chargement des projets...
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Aucun projet à afficher.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((projet) => (
                  <tr key={projet.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 truncate max-w-[250px]">{projet.titre}</div>
                      <div className="text-sm text-slate-500 truncate max-w-[250px]">{projet.categorie}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {projet.objectifFinancier?.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          projet.statut === 'EN_COURS' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          projet.statut === 'BROUILLON' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                          projet.statut === 'TERMINE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {projet.statut === 'EN_COURS' && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          {projet.statut === 'TERMINE' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                          {projet.statut === 'BROUILLON' && <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
                          {(projet.statut !== 'EN_COURS' && projet.statut !== 'TERMINE' && projet.statut !== 'BROUILLON') && <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                          {projet.statut}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(projet.dateFin).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                           to={`/projects/${projet.id}`} 
                           target="_blank"
                           title="Visualiser"
                           className="p-2 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-xl transition-all"
                        >
                           <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => setProjectModal({ isOpen: true, project: projet })}
                          className="p-2 hover:bg-emerald-50 hover:text-emerald-600 text-slate-400 rounded-xl transition-all"
                          title="Modifier"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setReviewModal({ isOpen: true, project: projet })}
                          className="p-2 hover:bg-amber-50 hover:text-amber-600 text-slate-400 rounded-xl transition-all"
                          title="Statut / Review"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, projectId: projet.id })}
                          className="p-2 hover:bg-red-50 hover:text-red-600 text-slate-400 rounded-xl transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ProjectModal 
        isOpen={projectModal.isOpen}
        project={projectModal.project}
        onClose={() => setProjectModal({ isOpen: false, project: null })}
        onSave={handleSaveProject}
      />

      {/* Confirmation Suppression */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
               <Trash2 className="w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Supprimer le projet ?</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Cette action est irréversible. Toutes les données associées à cette campagne seront perdues.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteModal({ isOpen: false })} className="flex-1 py-3.5 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all">
                Annuler
              </button>
              <button onClick={handleDeleteProject} className="flex-1 py-3.5 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <ProjectReviewModal 
         isOpen={reviewModal.isOpen} 
         project={reviewModal.project} 
         onClose={() => setReviewModal({ isOpen: false, project: null })} 
         onConfirm={handleReviewConfirm}
      />
    </div>
  );
}
