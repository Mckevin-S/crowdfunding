import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Info,
  RefreshCcw,
  BarChart3,
  ShieldAlert
} from 'lucide-react';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import aiChatService from '../../services/aiChatService';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const AIAnalysisSection = ({ project, user }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const data = await aiChatService.getAnalysesByProject(project.id);
      if (data && data.length > 0) {
        setAnalysis(data[data.length - 1]); // Get latest
      }
    } catch (err) {
      console.error('Error fetching AI analysis', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project.id) fetchAnalysis();
  }, [project.id]);

  const handleRunAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const newAnalysis = await aiChatService.analyzeProject(project.id);
      setAnalysis(newAnalysis);
      toast.success('Analyse IA terminée avec succès !');
    } catch (err) {
      setError("Désolé, l'IA est momentanément indisponible.");
      toast.error("Échec de l'analyse.");
    } finally {
      setLoading(false);
    }
  };

  if (!analysis && !loading) {
    return (
      <Card className="!p-10 border-dashed border-2 border-slate-200 bg-slate-50 text-center">
        <Cpu className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-display font-black text-slate-900 mb-2">Analyse Strategique IA</h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
          Obtenez une évaluation complète des risques et du potentiel de ce projet grâce à l'intelligence artificielle GPT-4.
        </p>
        <Button 
          onClick={handleRunAnalysis} 
          className="bg-primary-900 hover:bg-black text-white px-8"
        >
          Lancer l'analyse experte
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
              <Cpu className="w-5 h-5" />
           </div>
           <div>
              <h3 className="text-lg font-black text-slate-900 leading-none">Rapport d'Expertise IA</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Propulsé par OpenAI GPT-4</p>
           </div>
        </div>
        <button 
          onClick={handleRunAnalysis} 
          disabled={loading}
          className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
          title="Rafraîchir l'analyse"
        >
          <RefreshCcw className={clsx("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Success Score */}
        <Card className="!p-6 !rounded-3xl border-none bg-indigo-50/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-20 h-20 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 block">Potentiel de Réussite</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-indigo-600">{analysis?.scoreSucces || 0}%</span>
              <span className="text-xs font-bold text-indigo-400">Score global</span>
            </div>
          </div>
        </Card>

        {/* Risk Score */}
        <Card className="!p-6 !rounded-3xl border-none bg-amber-50/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-20 h-20 text-amber-600" />
          </div>
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-2 block">Indice de Risque</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-amber-600">{analysis?.scoreRisque || 0}%</span>
              <span className="text-xs font-bold text-amber-400">Plafond estimé</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analysis Text */}
      <Card className="!p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm relative">
         <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
              {analysis?.analyse}
            </p>
         </div>
      </Card>

      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-400 font-medium">
         <Info className="w-4 h-4" />
         Cette analyse est générée automatiquement et ne constitue pas un conseil financier officiel. 
         Faites toujours vos propres recherches (DYOR).
      </div>
    </div>
  );
};

export default AIAnalysisSection;
