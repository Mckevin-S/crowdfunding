import React from 'react';
import { 
  Target, 
  FileText, 
  Calendar, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const StepReview = ({ formData }) => {
  const sections = [
    { label: 'Informations de Base', icon: <Target className="w-4 h-4" />, data: [
      { key: 'Titre', value: formData.titre },
      { key: 'Catégorie', value: formData.categorie },
      { key: 'Type', value: formData.typeFinancement },
      { key: 'Objectif', value: `${Number(formData.objectifFinancier).toLocaleString()} XAF` },
    ]},
    { label: 'Histoire & Visuel', icon: <FileText className="w-4 h-4" />, data: [
      { key: 'Résumé', value: formData.description, fullWidth: true },
      { key: 'Image (URL)', value: formData.imageCouverture || 'Non définie', italic: true },
    ]},
    { label: 'Planification', icon: <Calendar className="w-4 h-4" />, data: [
      { key: 'Fin de campagne', value: formData.dateFin || 'Non définie' },
    ]},
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-4 bg-secondary-50 border border-secondary-100 rounded-2xl flex items-center gap-3 text-secondary-600 mb-8">
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-bold italic">Presque terminé ! Vérifiez vos informations une dernière fois avant la publication.</p>
      </div>

      <div className="space-y-10">
        {sections.map((section, idx) => (
          <div key={idx} className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                {section.icon}
              </div>
              <h4 className="font-display font-black text-neutral-rich uppercase tracking-widest text-xs">{section.label}</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
              {section.data.map((item, i) => (
                <div key={i} className={item.fullWidth ? 'md:col-span-2 border-b border-gray-100 pb-2' : ''}>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-1">{item.key}</span>
                  <span className={`text-neutral-rich font-bold leading-relaxed ${item.italic ? 'italic text-gray-500 text-xs truncate' : 'text-sm'}`}>
                    {item.value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
        <div className="text-xs text-amber-800 leading-relaxed font-medium italic">
          En confirmant, vous acceptez que votre projet soit soumis à une vérification par nos équipes avant d'être officiellement ouvert aux investissements. 
          Assurez-vous que toutes les informations sont exactes par rapport à la législation locale.
        </div>
      </div>
    </div>
  );
};

export default StepReview;
