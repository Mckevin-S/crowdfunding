import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { loginUser, googleLogin, clearError } from '../../store/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email invalide').required('Requis'),
      password: Yup.string().required('Requis'),
    }),
    onSubmit: async (values) => {
      dispatch(clearError());
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        toast.success('Bon retour parmi nous !');
        if (result.payload.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (result.payload.role === 'PORTEUR_PROJET') {
          navigate('/porteur/dashboard');
        } else {
          navigate('/investisseur/dashboard');
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      <Input
        label="Adresse Email"
        name="email"
        type="email"
        placeholder="nom@exemple.com"
        leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.email}
        touched={formik.touched.email}
      />

      <div className="relative">
        <Input
          label="Mot de passe"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-1 text-[11px] font-black text-primary-600 hover:text-primary-700 hover:underline"
        >
          {showPassword ? 'Masquer' : 'AFFICHER'}
        </button>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400 cursor-pointer" />
          <span className="text-xs text-slate-500 font-bold group-hover:text-slate-700 transition-colors uppercase tracking-widest">Rester connecté</span>
        </label>
        <button type="button" className="text-[11px] font-black text-primary-600 hover:underline underline-offset-4 decoration-2">
           MOT DE PASSE OUBLIÉ ?
        </button>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={loading}
        className="h-14 text-md font-bold bg-primary-900 hover:bg-black shadow-xl rounded-xl"
        rightIcon={<ArrowRight className="w-5 h-5" />}
      >
        Entrer dans mon espace
      </Button>
    </form>
  );
};

export default LoginForm;