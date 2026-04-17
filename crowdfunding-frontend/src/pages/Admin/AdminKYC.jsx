import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Search, Filter, CheckCircle, XCircle, FileText, AlertCircle,
  Clock, ShieldCheck, ShieldX, Files, X, Download, ZoomIn, FileImage,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { kycService } from '../../services/kycService';
import { downloadCSV } from '../../utils/exportUtils';

// ─────────────────────────────────────────────────────────
// Modale de visualisation du document (PDF ou image)
// ─────────────────────────────────────────────────────────
function DocumentViewerModal({ isOpen, onClose, documentUrl, docType }) {
  if (!isOpen || !documentUrl) return null;

  // Résoudre l'URL relative vers le backend
  const resolvedUrl = documentUrl.startsWith('http')
    ? documentUrl
    : `http://localhost:8080${documentUrl}`;

  const isPdf = resolvedUrl.toLowerCase().endsWith('.pdf');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = resolvedUrl;
    a.download = `document-kyc-${docType || 'piece'}`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {isPdf ? (
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileImage className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div>
              <p className="font-bold text-slate-900 text-sm">{docType || 'Document KYC'}</p>
              <p className="text-xs text-slate-400">{isPdf ? 'Fichier PDF' : 'Image'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-100" style={{ minHeight: '60vh' }}>
          {isPdf ? (
            <iframe
              src={resolvedUrl}
              title="Document KYC"
              className="w-full"
              style={{ height: '70vh', border: 'none' }}
            />
          ) : (
            <div className="flex items-center justify-center p-6" style={{ minHeight: '60vh' }}>
              <img
                src={resolvedUrl}
                alt={`Document KYC - ${docType}`}
                className="max-w-full object-contain rounded-xl shadow-lg"
                style={{ maxHeight: '65vh' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  document.getElementById('kyc-doc-fallback').style.display = 'flex';
                }}
              />
              <div id="kyc-doc-fallback" className="flex-col items-center gap-4 text-slate-500" style={{ display: 'none' }}>
                <FileText className="w-16 h-16 text-slate-300" />
                <p className="font-medium">Impossible d'afficher le fichier.</p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Télécharger le document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Modale de révision (Approuver / Rejeter)
// ─────────────────────────────────────────────────────────
function KycReviewModal({ isOpen, onClose, onConfirm, document }) {
  const [action, setAction] = useState('APPROUVE');
  const [reason, setReason] = useState('');

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Vérification de Pièce d'Identité</h3>
        <p className="text-slate-600 mb-4 whitespace-nowrap overflow-hidden text-ellipsis border-b pb-4">
          Type : <span className="font-semibold text-slate-800">{document.typeDocument}</span>
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Décision</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAction('APPROUVE')}
                className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-colors ${action === 'APPROUVE' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <CheckCircle className="w-4 h-4" /> Approuver
              </button>
              <button
                onClick={() => setAction('REJETE')}
                className={`py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition-colors ${action === 'REJETE' ? 'bg-red-50 border-red-500 text-red-700 font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <XCircle className="w-4 h-4" /> Rejeter
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Note interne (Raison du rejet obligatoire)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required={action === 'REJETE'}
              className={`w-full border rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-shadow min-h-[100px] ${action === 'REJETE' && !reason.trim() ? 'border-red-300' : 'border-slate-200'}`}
              placeholder={action === 'REJETE' ? 'Expliquez pourquoi le document est invalide...' : 'Observation facultative...'}
            />
          </div>

          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg border border-blue-200 flex items-start gap-3 mt-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <p className="text-sm">
              Assurez-vous que le document correspond au nom de l'utilisateur. Toute validation est enregistrée dans les registres d'audit.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors">
            Fermer
          </button>
          <button
            onClick={() => onConfirm(document.id, action, reason)}
            disabled={action === 'REJETE' && !reason.trim()}
            className="px-5 py-2.5 rounded-lg font-medium text-white transition-colors bg-primary-600 hover:bg-primary-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirmer la décision
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Page principale AdminKYC
// ─────────────────────────────────────────────────────────
export default function AdminKYC() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModal, setReviewModal] = useState({ isOpen: false, document: null });
  const [viewerModal, setViewerModal] = useState({ isOpen: false, url: null, docType: null });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await kycService.getAllKyc();
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Erreur lors de la récupération des KYC');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleReviewConfirm = async (id, action, reason) => {
    try {
      await kycService.updateKycStatus(id, action, reason);
      toast.success('Document vérifié avec succès.');
      fetchDocuments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setReviewModal({ isOpen: false, document: null });
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const s = `${doc.typeDocument} ${doc.statut}`.toLowerCase();
    return s.includes(searchTerm.toLowerCase());
  });

  const stats = [
    { label: 'Total Dossiers', value: documents.length, icon: <Files className="w-5 h-5" />, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'En Attente', value: documents.filter(d => d.statut === 'EN_ATTENTE' || d.statut === 'PENDING').length, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approuvés', value: documents.filter(d => d.statut === 'APPROUVE').length, icon: <ShieldCheck className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Rejetés', value: documents.filter(d => d.statut === 'REJETE').length, icon: <ShieldX className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Vérification KYC</h2>
          <p className="text-slate-500 mt-1 font-medium">Examinez les documents d'identification soumis par les utilisateurs.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 flex items-center gap-4 hover:shadow-lg transition-all border-none">
            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shadow-sm`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{loading ? '...' : stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadCSV(filteredDocs, 'Liste_KYC.csv')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Exporter CSV
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filtrer par statut
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Type de Document</th>
                <th className="px-6 py-4">Fichier Soumis</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Chargement des documents...</td>
                </tr>
              ) : filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Aucun document KYC à afficher.</td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{doc.nomComplet || `Utilisateur #${doc.utilisateurId}`}</span>
                        <span className="text-xs text-slate-500">{doc.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <FileText className="w-4 h-4 text-slate-400" />
                        {doc.typeDocument}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {doc.documentUrl ? (
                        <button
                          onClick={() => setViewerModal({ isOpen: true, url: doc.documentUrl, docType: doc.typeDocument })}
                          className="flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <ZoomIn className="w-4 h-4" />
                          Voir la pièce
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-sm">Aucun fichier</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={doc.statut === 'APPROUVE' ? 'success' : doc.statut === 'REJETE' ? 'danger' : 'warning'}>
                        {doc.statut}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setReviewModal({ isOpen: true, document: doc })}
                        className="px-4 py-2 text-sm rounded-xl border border-primary-100 bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white font-bold transition-all duration-300 shadow-sm"
                      >
                        Examiner
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modale visualisation document */}
      <DocumentViewerModal
        isOpen={viewerModal.isOpen}
        documentUrl={viewerModal.url}
        docType={viewerModal.docType}
        onClose={() => setViewerModal({ isOpen: false, url: null, docType: null })}
      />

      {/* Modale révision */}
      <KycReviewModal
        isOpen={reviewModal.isOpen}
        document={reviewModal.document}
        onClose={() => setReviewModal({ isOpen: false, document: null })}
        onConfirm={handleReviewConfirm}
      />
    </div>
  );
}
