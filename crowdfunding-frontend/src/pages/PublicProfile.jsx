import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Trophy, Users, Rocket } from 'lucide-react';
import Button from '../components/common/Button';

const PublicProfile = () => {
  const { id } = useParams();
  
  // Mock data for visitor view - would be fetched by ID in production
  const profile = {
    nom: "Amadou Diallo",
    bio: "Entrepreneur passionné par les solutions d'énergie renouvelable en Afrique de l'Ouest. Fondateur de plusieurs initiatives AgriTech.",
    localisation: "Dakar, Sénégal",
    projetsCrees: 3,
    tauxSucces: "100%",
    contributeurs: 450,
    photo: null
  };

  return (
    <div className="container mx-auto px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-900/5 border border-gray-50 p-12 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-900 to-emerald-800" />
          
          <div className="relative z-10 pt-12">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-12">
              <div className="w-32 h-32 bg-white rounded-3xl shadow-xl border-4 border-white flex items-center justify-center text-4xl font-black text-primary-900">
                {profile.nom.charAt(0)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-display font-black text-slate-900">{profile.nom}</h1>
                  <CheckCircle2 className="w-6 h-6 text-primary-500 fill-primary-50" />
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                   <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.localisation}</span>
                   <span className="h-4 w-px bg-gray-200" />
                   <span className="text-primary-600">Porteur Certifié IA</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
               {[
                 { label: 'Projets Créés', value: profile.projetsCrees, icon: <Rocket /> },
                 { label: 'Taux de Succès', value: profile.tauxSucces, icon: <Trophy /> },
                 { label: 'Contributeurs', value: profile.contributeurs, icon: <Users /> },
               ].map((stat, i) => (
                 <div key={i} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
                      {React.cloneElement(stat.icon, { size: 20 })}
                    </div>
                    <div>
                       <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mb-12">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">À propos</h3>
               <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                 "{profile.bio}"
               </p>
            </div>

            <div className="text-center p-8 bg-primary-50 rounded-2xl border border-primary-100">
               <p className="text-sm font-bold text-primary-900 mb-4">Connectez-vous pour voir les projets de cet auteur</p>
               <Button onClick={() => window.location.href='/login'}>Se connecter</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
