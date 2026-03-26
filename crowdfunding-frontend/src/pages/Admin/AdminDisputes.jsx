import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ShieldAlert, Search, Filter, MessageSquare, CheckCircle, XCircle, AlertTriangle, Scale, Clock, CheckCircle2 } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { disputeService } from '../../services/disputeService';
import { Link } from 'react-router-dom';
import { downloadCSV } from '../../utils/exportUtils';

function DisputeResolveModal({ isOpen, onClose, onConfirm, dispute }) {
  const [action, setAction] = useState('RESOLU');
  const [notes, setNotes] = useState('');

  if (!isOpen || !dispute) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-2xl">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Trancher le litige #{dispute.id}</h3>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg mb-4 text-sm text-slate-600">
          <p className="font-semibold text-slate-800 mb-1">{dispute.titre}</p>
          <p className="line-clamp-3">{dispute.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Décision</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setAction('RESOLU')}
                className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-colors ${action === 'RESOLU' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <CheckCircle className="w-4 h-4" /> Résoudre (Fondé)
              </button>
              <button 
                onClick={() => setAction('REJETE')}
                className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-colors ${action === 'REJETE' ? 'bg-slate-100 border-slate-500 text-slate-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <XCircle className="w-4 h-4" /> Rejeter (Non fondé)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Note interne (Raison de la décision)
            </label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="w-full border-slate-200 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow min-h-[100px]"
              placeholder="Expliquez la décision prise, y aura-t-il un remboursement etc..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors">
            Fermer
          </button>
          <button 
            onClick={() => onConfirm(dispute.id, action, notes)} 
            disabled={!notes.trim()}
            className="px-5 py-2.5 rounded-lg font-medium text-white transition-colors bg-primary-600 hover:bg-primary-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Appliquer la décision
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [resolveModal, setResolveModal] = useState({ isOpen: false, dispute: null });

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await disputeService.getAllDisputes();
      setDisputes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("Erreur lors de la récupération des litiges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolveConfirm = async (id, statut, decisionAdmin) => {
    try {
      await disputeService.resolveDispute(id, { statut, decisionAdmin });
      toast.success("Litige statué avec succès");
      fetchDisputes();
    } catch (error) {
       toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setResolveModal({ isOpen: false, dispute: null });
    }
  };

  const filteredDisputes = disputes.filter((d) => {
    const searchString = `${d.titre} ${d.type} ${d.plaignantNom}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const stats = [
    { label: 'Total Litiges', value: disputes.length, icon: <AlertTriangle className="w-5 h-5"/>, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Nouveaux', value: disputes.filter(d => d.statut === 'NOUVEAU').length, icon: <Clock className="w-5 h-5"/>, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'En Cours', value: disputes.filter(d => d.statut === 'EN_COURS' || d.statut === 'INVESTIGATION').length, icon: <Scale className="w-5 h-5"/>, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Résolus', value: disputes.filter(d => d.statut === 'RESOLU').length, icon: <CheckCircle2 className="w-5 h-5"/>, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Gestion des Litiges</h2>
          <p className="text-slate-500 mt-1 font-medium">Examinez les plaintes émises par les membres et tranchez en toute équité.</p>
        </div>
      </div>

      {/* KPI Cards */}
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
              placeholder="Rechercher par titre, type ou plaintif..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => downloadCSV(filteredDisputes, 'Liste_Litiges.csv')}
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
                <th className="px-6 py-4">Litige & Motif</th>
                <th className="px-6 py-4">Plaignant / Accusé</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Chargement des litiges...
                  </td>
                </tr>
              ) : filteredDisputes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Aucun litige signalé. La plateforme se porte bien !
                  </td>
                </tr>
              ) : (
                filteredDisputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 truncate max-w-[250px]">{dispute.titre}</div>
                      <div className="text-xs text-red-500 mt-1 font-semibold flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> {dispute.type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      <div>Plaignant : <span className="text-slate-900">{dispute.plaignantNom}</span></div>
                      {dispute.accuseNom && <div className="text-xs text-slate-500 mt-0.5">Visé : {dispute.accuseNom}</div>}
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={
                          dispute.statut === 'RESOLU' ? 'success' :
                          dispute.statut === 'REJETE' ? 'default' :
                          'warning'
                        }>
                          {dispute.statut}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(dispute.dateCreation).toLocaleDateString('fr-FR', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {dispute.statut === 'NOUVEAU' || dispute.statut === 'EN_COURS' ? (
                          <button
                            onClick={() => setResolveModal({ isOpen: true, dispute: dispute })}
                            className="px-3 py-1.5 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-medium shadow-sm transition-colors"
                          >
                            Trancher
                          </button>
                      ) : (
                          <button
                            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed font-medium"
                          >
                            Clôturé
                          </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <DisputeResolveModal 
         isOpen={resolveModal.isOpen} 
         dispute={resolveModal.dispute} 
         onClose={() => setResolveModal({ isOpen: false, dispute: null })} 
         onConfirm={handleResolveConfirm}
      />
    </div>
  );
}
