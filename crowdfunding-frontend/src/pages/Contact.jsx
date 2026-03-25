import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Contact = () => {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-gray-50/50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-black text-primary-900 mb-6 tracking-tighter">
            Parlons de votre <span className="text-primary-500">prochain succès.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">
            Une question sur un projet ? Un besoin d'accompagnement IA ? Notre équipe d'experts est à votre écoute.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Info Column */}
            <div className="lg:col-span-5 space-y-12">
               <div>
                  <h2 className="text-3xl font-display font-black text-slate-900 mb-8">Nos Bureaux</h2>
                  <div className="space-y-8">
                     {[
                       { icon: <MapPin />, label: "Adresse", value: "Plateau, Dakar, Sénégal" },
                       { icon: <Phone />, label: "Téléphone", value: "+221 33 800 00 00" },
                       { icon: <Mail />, label: "Email", value: "contact@investafrika.cm" },
                     ].map((info, i) => (
                       <div key={i} className="flex gap-6 items-start group">
                          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:bg-primary-900 group-hover:text-white transition-all shadow-sm">
                             {React.cloneElement(info.icon, { size: 20 })}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                             <p className="text-lg font-bold text-slate-700">{info.value}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-10 bg-[#022c22] rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <MessageSquare className="w-12 h-12 text-primary-400 mb-6" />
                  <h4 className="text-2xl font-black mb-4">Support IA 24/7</h4>
                  <p className="text-emerald-100/60 leading-relaxed font-medium mb-8">
                    Nos algorithmes de support sont disponibles à tout moment pour répondre à vos questions techniques.
                  </p>
                  <Button className="bg-white text-primary-900">Lancer le chat</Button>
               </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-[3.5rem] p-8 md:p-12 shadow-2xl shadow-slate-900/5 border border-gray-50">
               <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Input label="Votre Nom" placeholder="Diallo" />
                     <Input label="Votre Email" placeholder="nom@exemple.com" />
                  </div>
                  <Input label="Sujet" placeholder="Comment puis-je investir ?" />
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                     <textarea 
                       className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-6 min-h-[200px] text-slate-600 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                       placeholder="Décrivez votre besoin..."
                     />
                  </div>
                  <Button size="lg" fullWidth className="h-16 bg-primary-900 shadow-xl" rightIcon={<Send className="w-5 h-5" />}>
                     Envoyer le message
                  </Button>
               </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
