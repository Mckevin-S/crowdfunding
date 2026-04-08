import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-12 left-1/4 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-20"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold transition-all group">
                        <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        Retour à la connexion
                    </Link>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <ForgotPasswordForm />
            </div>

            <div className="mt-12 text-center relative z-10">
                <p className="text-sm font-medium text-slate-500">
                    Vous avez besoin d'aide ? <a href="mailto:support@exemple.com" className="text-primary-600 font-bold hover:underline">Contactez le support</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;