import React from 'react';
import Input from '../../common/Input';
import { Calendar, Clock, Shield } from 'lucide-react';

const StepFinance = ({ formData, setFormData, errors, touched, handleBlur }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="p-6 bg-primary-50 rounded-[2rem] border border-primary-100 mb-8">
        <div className="flex items-center gap-3 text-primary-700 mb-2">
          <Shield className="w-5 h-5" />
          <h4 className="font-bold">Planification Stratégique</h4>
        </div>
        <p className="text-sm text-primary-600 italic">
          Choisissez avec soin votre date de fin. Les campagnes de 30 à 45 jours ont statistiquement plus de chances de succès.
        </p>
      </div>

      <Input
        label="Date de fin de campagne"
        name="dateFin"
        type="date"
        leftIcon={<Calendar className="w-5 h-5 text-gray-400" />}
        value={formData.dateFin}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.dateFin}
        touched={touched.dateFin}
        required
      />

      {formData.typeFinancement === 'LOAN' && (
        <div className="p-6 border-2 border-emerald-100 bg-emerald-50 rounded-[2rem]">
          <h4 className="font-bold text-emerald-900 mb-4">Configuration du Prêt</h4>
          <Input
            label="Taux d'intérêt proposé (%)"
            name="tauxInteret"
            type="number"
            placeholder="Ex: 5"
            value={formData.tauxInteret || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.tauxInteret}
            touched={touched.tauxInteret}
            required
          />
        </div>
      )}

      {formData.typeFinancement === 'EQUITY' && (
        <div className="p-6 border-2 border-blue-100 bg-blue-50 rounded-[2rem]">
          <h4 className="font-bold text-blue-900 mb-4">Détails du Capital</h4>
          <Input
            label="Part du capital ouverte aux investisseurs (%)"
            name="partCapitalOuverte"
            type="number"
            placeholder="Ex: 10"
            value={formData.partCapitalOuverte || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.partCapitalOuverte}
            touched={touched.partCapitalOuverte}
            required
          />
        </div>
      )}

      {formData.typeFinancement === 'REWARD' && (
        <div className="p-8 border-2 border-dashed border-gray-100 rounded-[2rem] text-center">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h4 className="font-bold text-gray-400 mb-2">Configuration des Récompenses</h4>
          <p className="text-xs text-gray-400 max-w-xs mx-auto italic">
            Vous pourrez configurer les paliers de récompense après la création de la campagne.
          </p>
        </div>
      )}
    </div>
  );
};

export default StepFinance;
