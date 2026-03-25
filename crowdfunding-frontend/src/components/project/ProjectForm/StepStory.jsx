import React from 'react';
import Textarea from '../../common/Textarea';
import Input from '../../common/Input';
import { Image as ImageIcon, FileText } from 'lucide-react';
import uploadService from '../../../services/uploadService';

const StepStory = ({ formData, setFormData, errors, touched, handleBlur }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Textarea
        label="Résumé court"
        name="description"
        placeholder="Décrivez votre projet en 2 phrases accrocheuses..."
        value={formData.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        touched={touched.description}
        rows={3}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-neutral-rich ml-1">L'Histoire complète du projet</label>
        <Textarea
          name="contenu"
          placeholder="Racontez votre parcours, votre mission et comment les fonds seront utilisés. Soyez convaincant !"
          value={formData.contenu}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.contenu}
          touched={touched.contenu}
          rows={10}
        />
      </div>

      <div className="flex flex-col gap-1.5 mt-8">
        <label className="text-sm font-bold text-slate-800 ml-1">Image de couverture (Optimisée)</label>
        
        {formData.imageCouverture ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-primary-100 group aspect-[21/9]">
            <img 
              src={formData.imageCouverture.startsWith('/') ? `http://localhost:8080${formData.imageCouverture}` : formData.imageCouverture} 
              alt="Couverture du projet" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, imageCouverture: '' }))}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
              >
                Changer d'image
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  try {
                    // Start uploading UI feedback
                    setFormData(prev => ({ ...prev, _isUploading: true }));
                    const response = await uploadService.uploadImage(file);
                    setFormData(prev => ({ ...prev, imageCouverture: response.url, _isUploading: false }));
                  } catch (error) {
                    console.error('Erreur lors de l\'upload :', error);
                    setFormData(prev => ({ ...prev, _isUploading: false }));
                    alert("Erreur lors de l'envoi de l'image.");
                  }
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={formData._isUploading}
            />
            
            <div className={`w-full border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center text-center transition-colors ${formData._isUploading ? 'border-primary-300 bg-primary-50' : 'border-slate-200 hover:border-primary-400 bg-slate-50 hover:bg-slate-50/50'}`}>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-primary-500">
                {formData._isUploading ? (
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">
                {formData._isUploading ? 'Optimisation en cours...' : 'Cliquez ou glissez une image ici'}
              </h4>
              <p className="text-sm font-medium text-slate-500">
                Format supporté : PNG, JPG, WEBP. L'image sera encodée et redimensionnée automatiquement.
              </p>
            </div>
          </div>
        )}
        {(errors.imageCouverture && touched.imageCouverture) && (
          <p className="text-sm text-red-500 mt-1">{errors.imageCouverture}</p>
        )}
      </div>
    </div>
  );
};

export default StepStory;
