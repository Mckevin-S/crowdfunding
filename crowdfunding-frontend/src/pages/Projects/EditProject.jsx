import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Rocket, ChevronLeft, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import StepBasics from '../../components/project/ProjectForm/StepBasics';
import StepStory from '../../components/project/ProjectForm/StepStory';
import StepFinance from '../../components/project/ProjectForm/StepFinance';
import StepReview from '../../components/project/ProjectForm/StepReview';
import { fetchProjectById, updateProject } from '../../store/slices/projectSlice';
import Loader from '@components/common/Loader';
import { toast } from 'react-toastify';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector((state) => state.project);
  const { user } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentProject && user && currentProject.porteurId !== user.id) {
      toast.error("Vous n'etes pas autorise a modifier ce projet.");
      navigate(`/projects/${id}`);
    }
  }, [currentProject, user, navigate, id]);

  const validationSchemas = [
    Yup.object({
      titre: Yup.string().required('Le titre est requis').min(5, 'Minimum 5 caractères'),
      objectifFinancier: Yup.number().positive('Doit être positif').min(1000, 'Minimum 1000 XAF').required("L'objectif est requis"),
    }),
    Yup.object({
      description: Yup.string().required('Le résumé est requis').max(200, 'Maximum 200 caractères'),
      contenu: Yup.string().required("L'histoire complète est requise").min(50, 'Soyez plus descriptif (50 chars min)'),
    }),
    Yup.object({
      dateFin: Yup.date().required('La date de fin est requise').min(new Date(), 'La date doit être dans le futur'),
    }),
    Yup.object({}),
  ];

  const formik = useFormik({
    initialValues: {
      titre: currentProject?.titre || '',
      categorie: currentProject?.categorie || 'Technologie',
      typeFinancement: currentProject?.typeFinancement || 'DON',
      objectifFinancier: currentProject?.objectifFinancier || 1000000,
      description: currentProject?.description || '',
      contenu: currentProject?.contenu || '',
      imageCouverture: currentProject?.imageCouverture || '',
      dateDebut: currentProject?.dateDebut || new Date().toISOString().split('T')[0],
      dateFin: currentProject?.dateFin || '',
    },
    enableReinitialize: true,
    validationSchema: validationSchemas[currentStep - 1],
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (currentStep < 4) {
        setCurrentStep((prev) => prev + 1);
        return;
      }

      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          porteurId: user?.id,
        };
        const result = await dispatch(updateProject({ id, projectData: payload }));
        if (updateProject.fulfilled.match(result)) {
          toast.success('Votre projet a été mis à jour avec succès.');
          navigate(`/projects/${id}`);
        }
      } catch {
        toast.error('Erreur lors de la mise à jour du projet.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getCurrentStepComponent = () => {
    const props = {
      formData: formik.values,
      setFormData: (fn) => {
        const nextValues = typeof fn === 'function' ? fn(formik.values) : fn;
        formik.setValues(nextValues);
      },
      errors: formik.errors,
      touched: formik.touched,
      handleBlur: formik.handleBlur,
    };

    switch (currentStep) {
      case 1:
        return <StepBasics {...props} />;
      case 2:
        return <StepStory {...props} />;
      case 3:
        return <StepFinance {...props} />;
      case 4:
        return <StepReview formData={formik.values} />;
      default:
        return null;
    }
  };

  if (loading || !currentProject) {
    return (
      <div className="flex items-center justify-center min-h-screen py-24">
        <Loader size="xl" text="Chargement du projet..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Impossible de charger le projet</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => dispatch(fetchProjectById(id))}>Réessayer</Button>
      </div>
    );
  }

  if (currentProject?.porteurId !== user?.id) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
        <p className="text-slate-600">Vous ne pouvez modifier que les projets que vous avez créés.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-900/10 rotate-12 transition-transform">
            <Rocket className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary-900 mb-4 tracking-tighter">Modifier votre projet</h1>
          <p className="text-slate-500 text-lg font-medium opacity-80 italic">Apportez des corrections et améliorez votre campagne avant validation.</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] p-8 md:p-16 border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          <form onSubmit={formik.handleSubmit}>
            <div className="min-h-[400px]">{getCurrentStepComponent()}</div>
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                leftIcon={<ChevronLeft className="w-5 h-5" />}
                className="rounded-2xl px-8 hover:bg-gray-50 text-gray-400 font-bold"
              >
                Précédent
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                rightIcon={currentStep === 4 ? null : <ArrowRight className="w-5 h-5" />}
                className="rounded-xl px-12 h-14 text-lg bg-primary-900 shadow-xl shadow-primary-900/20"
              >
                {currentStep === 4 ? 'Enregistrer les modifications' : 'Continuer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
