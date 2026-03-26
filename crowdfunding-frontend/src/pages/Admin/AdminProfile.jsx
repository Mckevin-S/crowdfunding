import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { MapPin, Mail, Phone, User, Save, ShieldCheck } from 'lucide-react';
import Card from '../../components/common/Card';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

export default function AdminProfile() {
  const { user } = useAuth();
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
        toast.error('Erreur lors du chargement du profil administrateur');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user?.id]);

  const validationSchema = Yup.object({
    email: Yup.string().email('Email invalide').required('L\'email est requis'),
    prenom: Yup.string().required('Le prénom est requis'),
    nom: Yup.string().required('Le nom est requis'),
    telephone: Yup.string().nullable(),
  });

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      const response = await userService.updateProfile(user.id, values);
      setProfile(response.data);
      toast.success('Profil administrateur mis à jour avec succès');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card className="p-8 text-center text-slate-500">
        Impossible de charger le profil de l'administrateur.
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Profil d'Administration</h2>
          <p className="text-slate-500 mt-1">Gérez vos informations de super-utilisateur.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Résumé Profil */}
        <Card className="p-6 md:col-span-1 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-100 shadow-md flex items-center justify-center text-3xl font-bold text-white uppercase overflow-hidden">
             {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{profile.prenom?.charAt(0)}{profile.nom?.charAt(0)}</span>
              )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{profile.prenom} {profile.nom}</h3>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-500" /> ADMIN
            </div>
          </div>
          <div className="w-full h-px bg-slate-100 my-4" />
          <div className="w-full space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase">Adresse Email</p>
                <p className="text-sm font-medium text-slate-800 break-all">{profile.email}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Edition Profil */}
        <Card className="p-6 md:col-span-2">
          <Formik
            initialValues={{
              email: profile.email || '',
              prenom: profile.prenom || '',
              nom: profile.nom || '',
              telephone: profile.telephone || '',
              bio: profile.bio || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Prénom</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-slate-400"/>
                      </div>
                      <Field
                        name="prenom"
                        type="text"
                        className="pl-10 w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <ErrorMessage name="prenom" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-slate-400"/>
                      </div>
                      <Field
                        name="nom"
                        type="text"
                        className="pl-10 w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <ErrorMessage name="nom" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (Contact principal)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-slate-400"/>
                      </div>
                      <Field
                        name="email"
                        type="email"
                        className="pl-10 w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Téléphone d'urgence (Optionnel)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-slate-400"/>
                      </div>
                      <Field
                        name="telephone"
                        type="tel"
                        className="pl-10 w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <ErrorMessage name="telephone" component="div" className="text-red-500 text-xs mt-1" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 px-6 rounded-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Sauvegarde...' : 'Mettre à jour'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>

      <Card className="p-6 bg-red-50 border-red-100">
         <h3 className="text-red-800 font-bold mb-2">Sécurité du compte administrateur</h3>
         <p className="text-sm text-red-700 mb-4">
           En tant qu'administrateur, votre compte possède des droits critiques sur la plateforme. Il est recommandé de modifier votre mot de passe régulièrement.
         </p>
         <button className="px-4 py-2 bg-white text-red-600 border border-red-200 font-semibold rounded-lg shadow-sm hover:bg-red-100 transition-colors text-sm">
            Changer mon mot de passe
         </button>
      </Card>
    </div>
  );
}
