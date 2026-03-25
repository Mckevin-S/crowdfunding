import React from 'react';
import Input from '../../common/Input';
import Select from '../../common/Select';
import { Tag, Wallet } from 'lucide-react';

const StepBasics = ({ formData, setFormData, errors, touched, handleBlur }) => {
  const categories = [
    { value: 'Technologie', label: 'Technologie & Innovation' },
    { value: 'Art', label: 'Art & Culture' },
    { value: 'Social', label: 'Social & Communauté' },
    { value: 'Education', label: 'Éducation' },
    { value: 'Environnement', label: 'Environnement' },
  ];

  const fundingTypes = [
    { value: 'DON', label: 'Don (Générosité pure)' },
    { value: 'REWARD', label: 'Récompense (Produit/Service)' },
    { value: 'LOAN', label: 'Prêt (Taux d\'intérêt)' },
    { value: 'EQUITY', label: 'Capital (Parts sociales)' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Input
        label="Titre du projet"
        name="titre"
        placeholder="Donnez un nom percutant à votre vision"
        value={formData.titre}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.titre}
        touched={touched.titre}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Select
          label="Catégorie"
          name="categorie"
          options={categories}
          leftIcon={<Tag className="w-5 h-5" />}
          value={formData.categorie}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Select
          label="Type de financement"
          name="typeFinancement"
          options={fundingTypes}
          leftIcon={<Wallet className="w-5 h-5" />}
          value={formData.typeFinancement}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <Input
        label="Objectif financier (XAF)"
        name="objectifFinancier"
        type="number"
        placeholder="Ex: 5 000 000"
        value={formData.objectifFinancier}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.objectifFinancier}
        touched={touched.objectifFinancier}
        required
      />
    </div>
  );
};

export default StepBasics;
