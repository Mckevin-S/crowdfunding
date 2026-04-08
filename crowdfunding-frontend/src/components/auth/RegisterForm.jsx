import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Heart, Lightbulb, ArrowRight } from 'lucide-react';
import { registerUser, googleLogin, clearError } from '../../store/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import clsx from 'clsx';

/**
 * Formulaire d'inscription premium InvestAFRIKA.
 * Gère l'inscription avec sélection de rôle (INVESTOR, ENTREPRENEUR).
 */
const RegisterForm = ({ onRoleChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const formik = useFormik({
    initialValues: {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'CONTRIBUTEUR',
      acceptTerms: false,
    },
    validationSchema: Yup.object({
      nom: Yup.string().required('Requis'),
      prenom: Yup.string().required('Requis'),
      email: Yup.string().email('Email invalide').required('Requis'),
      password: Yup.string().min(6, '6+ caractères').required('Requis'),
      acceptTerms: Yup.boolean().oneOf([true], 'Veuillez accepter les conditions'),
    }),
    onSubmit: async (values) => {
      dispatch(clearError());
      const { acceptTerms, ...registerData } = values;
      const result = await dispatch(registerUser(registerData));
      if (registerUser.fulfilled.match(result)) {
        toast.success('Bienvenue sur InvestAFRIKA !');
        navigate('/dashboard');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Sélection du Rôle */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <button
          type="button"
          onClick={() => {
            formik.setFieldValue('role', 'CONTRIBUTEUR');
            if (onRoleChange) onRoleChange('CONTRIBUTEUR');
          }}
          className={clsx(
            "p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1.5 text-left relative overflow-hidden group",
            formik.values.role === 'CONTRIBUTEUR' 
            ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10" 
            : "border-gray-50 bg-white hover:border-gray-100"
          )}
        >
          <div className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            formik.values.role === 'CONTRIBUTEUR' ? "bg-primary-500 text-white" : "bg-primary-50 text-primary-600"
          )}>
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight mt-2">Contributeur</span>
          <span className="text-[11px] text-slate-400 font-bold italic">Je souhaite investir</span>
        </button>
        
        <button
          type="button"
          onClick={() => {
            formik.setFieldValue('role', 'PORTEUR_PROJET');
            if (onRoleChange) onRoleChange('PORTEUR_PROJET');
          }}
          className={clsx(
            "p-5 rounded-2xl border-2 transition-all flex flex-col items-start gap-1.5 text-left relative overflow-hidden group",
            formik.values.role === 'PORTEUR_PROJET' 
            ? "border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10" 
            : "border-gray-50 bg-white hover:border-gray-100"
          )}
        >
          <div className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            formik.values.role === 'PORTEUR_PROJET' ? "bg-primary-500 text-white" : "bg-primary-50 text-primary-600"
          )}>
            <Lightbulb className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight mt-2">Porteur</span>
          <span className="text-[11px] text-slate-400 font-bold italic">Je cherche un financement</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Input
          label="Prénom"
          name="prenom"
          placeholder="Jean"
          value={formik.values.prenom}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.prenom}
          touched={formik.touched.prenom}
        />
        <Input
          label="Nom"
          name="nom"
          placeholder="Dupont"
          value={formik.values.nom}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.nom}
          touched={formik.touched.nom}
        />
      </div>

      <Input
        label="Adresse Email"
        name="email"
        type="email"
        placeholder="nom@exemple.com"
        leftIcon={<Mail className="w-4 h-4" />}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.email}
        touched={formik.touched.email}
      />

      <Input
        label="Mot de passe"
        name="password"
        type="password"
        placeholder="••••••••"
        leftIcon={<Lock className="w-4 h-4" />}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.password}
        touched={formik.touched.password}
      />

      {error && (
        <div className="p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100">
          {error}
        </div>
      )}

      <div className="flex items-start gap-3 p-1">
        <input 
          type="checkbox" 
          name="acceptTerms"
          checked={formik.values.acceptTerms}
          onChange={formik.handleChange}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 cursor-pointer" 
        />
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          J'accepte les <Link to="/terms" className="text-primary-600 font-bold underline-offset-4 decoration-1">conditions d'utilisation</Link>...
          {formik.errors.acceptTerms && formik.touched.acceptTerms && (
             <span className="block text-red-500 font-bold mt-1">{formik.errors.acceptTerms}</span>
          )}
        </p>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
        className="h-14 text-md font-bold bg-primary-900 hover:bg-black shadow-xl rounded-xl"
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Créer mon compte InvestAFRIKA
      </Button>
    </form>
  );
};

export default RegisterForm;