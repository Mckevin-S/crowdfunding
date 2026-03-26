import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Settings, Save, AlertCircle, ServerCrash, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import { configService } from '../../services/configService';

const defaultConfigs = [
  { configKey: 'PLATEFORM_FEE_PERCENTAGE', configValue: '5', description: 'Commission de la plateforme sur chaque projet réussi (en %)' },
  { configKey: 'MAINTENANCE_MODE', configValue: 'false', description: 'Désactiver les nouvelles inscriptions et contributions (true/false)' },
  { configKey: 'MAX_FILE_SIZE_MB', configValue: '10', description: 'Taille maximale des fichiers KYC autorisée (en Mo)' },
  { configKey: 'SUPPORT_EMAIL', configValue: 'support@crowdfund.cm', description: 'Adresse de contact global pour le support technique' },
];

export default function AdminConfig() {
  const [configs, setConfigs] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await configService.getAllConfigs();
      
      const configMap = {};
      const serverConfigs = res.data || [];
      
      // Merge with defaults to ensure keys exist even if DB is empty
      defaultConfigs.forEach(def => {
          const found = serverConfigs.find(c => c.configKey === def.configKey);
          configMap[def.configKey] = {
              value: found ? found.configValue : def.configValue,
              description: found ? found.description : def.description,
              isDirty: false
          };
      });

      setConfigs(configMap);
    } catch (error) {
      toast.error("Erreur de récupération des paramètres système.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (key, newValue) => {
      setConfigs(prev => ({
          ...prev,
          [key]: { ...prev[key], value: newValue, isDirty: true }
      }));
  };

  const handleSave = async () => {
      setSaving(true);
      try {
          // Identify dirty configs and save them via Promise.all
          const updates = Object.entries(configs)
              .filter(([_, configItem]) => configItem.isDirty)
              .map(([key, configItem]) => configService.updateConfig(key, configItem.value, configItem.description));
              
          if (updates.length === 0) {
             toast.info("Aucune modification à sauvegarder.");
             setSaving(false);
             return;
          }

          await Promise.all(updates);
          toast.success("Configurations mondiales mises à jour.");
          
          // Reset dirty state
          setConfigs(prev => {
              const newState = { ...prev };
              Object.keys(newState).forEach(k => { newState[k].isDirty = false; });
              return newState;
          });
      } catch (error) {
          toast.error("Erreur lors de l'enregistrement d'une de vos variables.");
      } finally {
          setSaving(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Configuration Système</h2>
          <p className="text-slate-500 mt-1">Gérez les variables d'environnement globales et les paramètres de la plateforme.</p>
        </div>
      </div>

      <Card className="max-w-4xl p-6 sm:p-8 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
           <div className="p-3 bg-slate-100 text-slate-600 rounded-xl flex-shrink-0">
               <ServerCrash className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-lg font-semibold text-slate-800">Variables Globales</h3>
              <p className="text-sm text-slate-500">Ces variables affectent directement la logique comportementale de la plateforme.</p>
           </div>
        </div>

        {loading ? (
             <div className="py-12 text-center text-slate-500 animate-pulse">
                Chargement des paramètres depuis la base de données...
             </div>
        ) : (
            <div className="space-y-6">
              {Object.entries(configs).map(([key, configItem]) => (
                <div key={key} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50/50 transition-colors">
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-slate-800 font-mono tracking-tight bg-slate-100 px-2 py-0.5 rounded text-xs">{key}</label>
                    <p className="text-sm text-slate-500 mt-1.5">{configItem.description}</p>
                  </div>
                  <div className="sm:w-1/3">
                    <input
                      type={key.includes('PASSWORD') || key.includes('SECRET') ? 'password' : 'text'}
                      value={configItem.value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${configItem.isDirty ? 'border-primary-300 bg-primary-50/30' : 'border-slate-200 bg-white'}`}
                      placeholder={`Valeur pour ${key}`}
                    />
                  </div>
                </div>
              ))}
            </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200/50 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
            <p className="text-sm leading-relaxed">
               Les modifications des variables telles que les frais ou les courriels prennent effet immédiatement sans redémarrage. Toute modification est journalisée pour des questions d'audit (Audit Logs).
            </p>
        </div>

        {/* Action Bar */}
        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button 
              onClick={fetchConfigs}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Restaurer
            </button>
            <button 
              onClick={handleSave}
              disabled={loading || saving || !Object.values(configs).some(c => c.isDirty)}
              className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-slate-900/10"
            >
              <Save className="w-4 h-4" /> 
              {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
            </button>
        </div>
      </Card>
    </div>
  );
}
