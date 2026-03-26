import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, User, Save, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const response = await userService.getUserById(user.id);
          setProfile(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Email invalide')
      .required('L\'email est requis'),
    prenom: Yup.string()
      .required('Le prénom est requis')
      .max(100, 'Le prénom ne peut pas dépasser 100 caractères'),
    nom: Yup.string()
      .required('Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    telephone: Yup.string()
      .matches(/^(\+225|225)?[0-9]{8,10}$/, 'Numéro de téléphone invalide')
      .nullable(),
    bio: Yup.string()
      .max(1000, 'La biographie ne peut pas dépasser 1000 caractères')
      .nullable(),
    address: Yup.string()
      .max(255, 'L\'adresse ne peut pas dépasser 255 caractères')
      .nullable(),
    ville: Yup.string()
      .max(100, 'La ville ne peut pas dépasser 100 caractères')
      .nullable(),
    categoriePreferee: Yup.string()
      .max(50, 'La catégorie préférée ne peut pas dépasser 50 caractères')
      .nullable(),
  });

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      await userService.updateProfile(user.id, values);
      navigate('/profile');
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      alert('Erreur lors de la mise à jour du profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl p-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 text-center">
            <p className="text-red-600 mb-4">Profil non trouvé</p>
            <Button onClick={() => navigate('/profile')} variant="primary">
              Retour au profil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-900/5 border border-gray-50 p-12">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/profile')}
              variant="ghost"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-display font-black text-slate-900">
              Modifier le profil
            </h1>
          </div>

          <Formik
            initialValues={{
              email: profile.email || '',
              prenom: profile.prenom || '',
              nom: profile.nom || '',
              telephone: profile.telephone || '',
              bio: profile.bio || '',
              address: profile.address || '',
              ville: profile.ville || '',
              categoriePreferee: profile.categoriePreferee || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-8">
                {/* Informations personnelles */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">
                        Prénom *
                      </label>
                      <Field
                        name="prenom"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Votre prénom"
                      />
                      <ErrorMessage name="prenom" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">
                        Nom *
                      </label>
                      <Field
                        name="nom"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Votre nom"
                      />
                      <ErrorMessage name="nom" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email *
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="votre.email@example.com"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Téléphone
                      </label>
                      <Field
                        name="telephone"
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+225 01 02 03 04 05"
                      />
                      <ErrorMessage name="telephone" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Adresse
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-600 mb-2">
                        Adresse complète
                      </label>
                      <Field
                        name="address"
                        as="textarea"
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Votre adresse complète"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">
                        Ville
                      </label>
                      <Field
                        name="ville"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Votre ville"
                      />
                      <ErrorMessage name="ville" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-2">
                        Catégorie préférée
                      </label>
                      <Field
                        name="categoriePreferee"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Technologie, Agriculture, Éducation..."
                      />
                      <ErrorMessage name="categoriePreferee" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Biographie */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-6">
                    À propos de vous
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-2">
                      Biographie
                    </label>
                    <Field
                      name="bio"
                      as="textarea"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Parlez-nous de vous, de vos expériences, de vos passions..."
                    />
                    <ErrorMessage name="bio" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    onClick={() => navigate('/profile')}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;