import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Rocket, 
  Target, 
  FileText, 
  Calendar, 
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Button from '../../components/common/Button';
import clsx from 'clsx';
import StepBasics from '../../components/project/ProjectForm/StepBasics';
import StepStory from '../../components/project/ProjectForm/StepStory';
import StepFinance from '../../components/project/ProjectForm/StepFinance';
import StepReview from '../../components/project/ProjectForm/StepReview';
import { createProject } from '../../store/slices/projectSlice';
import { toast } from 'react-toastify';

const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { id: 1, name: 'Les Bases', icon: <Target className="w-5 h-5" /> },
    { id: 2, name: 'L\'Histoire', icon: <FileText className="w-5 h-5" /> },
    { id: 3, name: 'Finances', icon: <Calendar className="w-5 h-5" /> },
    { id: 4, name: 'Récapitulatif', icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const validationSchemas = [
    Yup.object({
      titre: Yup.string().required('Le titre est requis').min(5, 'Minimum 5 caractères'),
      objectifFinancier: Yup.number().positive('Doit être positif').min(1000, 'Minimum 1000 XAF').required('L\'objectif est requis'),
    }),
    Yup.object({
      description: Yup.string().required('Le résumé est requis').max(200, 'Maximum 200 caractères'),
      contenu: Yup.string().required('L\'histoire complète est requise').min(50, 'Soyez plus descriptif (50 chars min)'),
    }),
    Yup.object({
      dateFin: Yup.date().required('La date de fin est requise').min(new Date(), 'La date doit être dans le futur'),
    }),
    Yup.object({}), // Review step
  ];

  const formik = useFormik({
    initialValues: {
      titre: '',
      categorie: 'Technologie',
      typeFinancement: 'REWARD',
      objectifFinancier: 1000000,
      description: '',
      contenu: '',
      imageCouverture: '',
      dateFin: '',
    },
    validationSchema: validationSchemas[currentStep - 1],
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
        return;
      }
      
      // Final submission
      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          porteurId: user.id, // Mandatory for backend
          dateDebut: new Date().toISOString().split('T')[0] // or new Date().toISOString() depending on backend expectations
        };
        const result = await dispatch(createProject(payload));
        if (createProject.fulfilled.match(result)) {
          toast.success('Félicitations ! Votre projet est en cours de révision.');
          navigate('/dashboard');
        }
      } catch (err) {
        toast.error('Erreur lors de la création du projet.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getCurrentStepComponent = () => {
    const props = {
      formData: formik.values,
      setFormData: (fn) => {
        const nextValues = typeof fn === 'function' ? fn(formik.values) : fn;
        formik.setValues(nextValues);
      },
      errors: formik.errors,
      touched: formik.touched,
      handleBlur: formik.handleBlur
    };

    switch (currentStep) {
      case 1: return <StepBasics {...props} />;
      case 2: return <StepStory {...props} />;
      case 3: return <StepFinance {...props} />;
      case 4: return <StepReview formData={formik.values} />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary-900/10 rotate-12 group-hover:rotate-0 transition-transform">
            <Rocket className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-primary-900 mb-4 tracking-tighter">Lancez votre vision.</h1>
          <p className="text-slate-500 text-lg font-medium opacity-80 italic">Racontez votre histoire et financez vos rêves africains.</p>
        </div>

        {/* Stepper Navigation */}
        <div className="flex justify-between items-center mb-16 relative px-4 md:px-0">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-50 -z-10 -translate-y-1/2 rounded-full" />
          {steps.map(step => (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <div 
                className={clsx(
                  "w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10",
                  currentStep === step.id 
                    ? "bg-primary-600 border-primary-600 text-white shadow-2xl shadow-primary-500/40 scale-110" 
                    : currentStep > step.id 
                      ? "bg-secondary-500 border-secondary-500 text-white" 
                      : "bg-white border-gray-100 text-gray-300"
                )}
              >
                {currentStep > step.id ? <CheckCircle className="w-6 h-6" /> : step.icon}
              </div>
              <span className={clsx(
                "hidden md:block text-[10px] font-black uppercase tracking-[0.2em]",
                currentStep === step.id ? "text-primary-600" : "text-gray-300"
              )}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] p-8 md:p-16 border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <form onSubmit={formik.handleSubmit}>
            <div className="min-h-[400px]">
              {getCurrentStepComponent()}
            </div>

            {/* Controls */}
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
                {currentStep === 4 ? 'Publier mon projet' : 'Continuer'}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CreateProject;