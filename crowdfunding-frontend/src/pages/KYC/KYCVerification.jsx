import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldCheck, UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '@components/common/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '@services/api';

const KYCVerification = () => {
  const { user } = useSelector(state => state.auth);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docType || !file) {
      toast.error('Veuillez sélectionner un type de document et uploader un fichier.');
      return;
    }

    setLoading(true);
    try {
      // Simulation d'upload pour le moment puisque nous utilisons documentUrl
      const documentUrl = "https://storage.investafrika.com/mock-kyc-" + Math.random().toString(36).substr(2, 9) + ".pdf";

      const payload = {
        utilisateurId: user.id,
        typeDocument: docType,
        documentUrl: documentUrl
      };

      await api.post('/kyc-documents', payload);
      
      toast.success('Document soumis avec succès. En attente de validation.');
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la soumission du document KYC.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.kycStatus === 'APPROVED') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[3rem] p-12 max-w-lg w-full text-center shadow-2xl border border-emerald-100">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-900 mb-4">Profil Vérifié</h1>
          <p className="text-slate-500 mb-8">
            Félicitations ! Votre identité a été validée. Vous pouvez désormais investir sans limite sur tous nos projets (Prêt & Capital).
          </p>
          <Button fullWidth onClick={() => navigate('/projects')}>
            Explorer les projets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="container mx-auto px-4">
        
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center text-slate-900">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 text-primary-600 rounded-full mb-6 relative">
              <ShieldCheck className="w-10 h-10" />
              <div className="absolute top-0 right-0 w-4 h-4 bg-amber-400 rounded-full border-2 border-white"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-4 tracking-tight">
              Vérification d'Identité
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
              Conformément à la réglementation UEMOA, nous devons vérifier votre identité pour débloquer les investissements participatifs.
            </p>
          </div>

          {/* Alert */}
          {user?.kycStatus === 'PENDING' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-900">Vérification en cours</h3>
                <p className="text-sm text-amber-800 mt-1">
                  Vos documents sont en cours d'analyse par notre équipe de conformité. Ce processus prend généralement de 24h à 48h.
                </p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Type Document */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Type de document
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['PASSPORT', 'CNI', 'DRIVERS_LICENSE', 'RESIDENCE_PERMIT'].map(type => (
                    <label 
                      key={type}
                      className={`relative flex items-center p-4 cursor-pointer rounded-2xl border-2 transition-all ${
                        docType === type 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-slate-100 hover:border-primary-200'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="docType" 
                        value={type}
                        className="sr-only"
                        onChange={(e) => setDocType(e.target.value)}
                      />
                      <div className="flex-1">
                        <span className={`block font-bold ${docType === type ? 'text-primary-900' : 'text-slate-700'}`}>
                          {type === 'CNI' && 'Carte d\'Identité'}
                          {type === 'PASSPORT' && 'Passeport'}
                          {type === 'DRIVERS_LICENSE' && 'Permis de conduire'}
                          {type === 'RESIDENCE_PERMIT' && 'Titre de séjour'}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        docType === type ? 'border-primary-500' : 'border-slate-300'
                      }`}>
                        {docType === type && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Document Numérisé
                </label>
                <div className="relative group">
                  <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-primary-600 to-emerald-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm ${file ? 'opacity-20' : ''}`} />
                  <div className="relative border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center bg-slate-50 transition-all group-hover:bg-white group-hover:border-primary-300">
                    <input 
                      type="file" 
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-slate-900 mb-1">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4 text-primary-500">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-slate-900 mb-1">
                          Glissez et déposez votre fichier ici
                        </p>
                        <p className="text-xs text-slate-500 mb-4">
                          Supporte: JPG, PNG, PDF (Max 5MB)
                        </p>
                        <Button variant="outline" size="sm" className="pointer-events-none">
                          Parcourir les fichiers
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-50 rounded-2xl p-6 flex gap-4 text-sm mt-8">
                <FileText className="w-6 h-6 text-slate-400 flex-shrink-0" />
                <div className="text-slate-600">
                  <span className="font-bold text-slate-900 block mb-1">Critères d'acceptation</span>
                  Assurez-vous que le document est <span className="font-medium text-slate-900">en cours de validité</span>, que tous les coins sont visibles, et qu'il n'y a <span className="font-medium text-slate-900">aucun reflet</span> masquant les informations.
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  fullWidth 
                  loading={loading}
                  className="h-16 text-lg rounded-2xl shadow-xl shadow-primary-900/20"
                  rightIcon={!loading && <ArrowRight className="w-5 h-5" />}
                >
                  Soumettre pour vérification
                </Button>
              </div>

            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default KYCVerification;