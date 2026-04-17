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
        setAnalysis(data[data.length - 1]);
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

  // Helper to structure SWOT if possible
  const renderAnalysisContent = (text) => {
    if (!text) return null;

    // Basic logic to detect SWOT headers
    const sections = text.split(/\n(?=(?:Forces|Faiblesses|Opportunités|Menaces|SWOT|Conclusion):)/i);

    if (sections.length > 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, idx) => {
            const [title, ...content] = section.split(':');
            const cleanTitle = title.trim();
            const cleanContent = content.join(':').trim();

            const colors = {
              'Forces': 'bg-emerald-50 text-emerald-700 border-emerald-100',
              'Faiblesses': 'bg-rose-50 text-rose-700 border-rose-100',
              'Opportunités': 'bg-sky-50 text-sky-700 border-sky-100',
              'Menaces': 'bg-amber-50 text-amber-700 border-amber-100'
            };

            const bgColor = colors[Object.keys(colors).find(k => cleanTitle.includes(k))] || 'bg-slate-50 text-slate-700 border-slate-100';

            return (
              <div key={idx} className={clsx("p-5 rounded-2xl border transition-all hover:shadow-md", bgColor)}>
                <h4 className="font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-current rounded-full opacity-50" />
                  {cleanTitle}
                </h4>
                <p className="text-sm font-medium leading-relaxed opacity-90">{cleanContent}</p>
              </div>
            );
          })}
        </div>
      );
    }

    return <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{text}</p>;
  };

  if (!analysis && !loading) {
    return (
      <Card className="!p-16 border-dashed border-2 border-primary-200 bg-primary-50/30 text-center rounded-[3rem] animate-pulse-slow">
        <div className="w-20 h-20 bg-primary-100 rounded-[2rem] flex items-center justify-center text-primary-600 mx-auto mb-6 shadow-xl shadow-primary-500/10">
          <Cpu className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">Analyse Stratégique IA</h3>
        <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium text-lg leading-relaxed">
          Propulsez votre investissement avec notre intelligence artificielle. Analyse SWOT, risques financiers et potentiel de marché en un clic.
        </p>
        <Button 
          onClick={handleRunAnalysis} 
          size="lg"
          className="bg-primary-900 hover:bg-black text-white px-12 h-16 rounded-2xl shadow-2xl shadow-primary-900/20 text-lg group"
        >
          Générer l'expertise <Zap className="ml-2 w-5 h-5 group-hover:text-yellow-400 transition-colors" />
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary-900 flex items-center justify-center text-emerald-400 shadow-lg shadow-primary-900/20">
              <Cpu className="w-6 h-6" />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">Rapport d'Expertise IA</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Dernière mise à jour : {new Date().toLocaleDateString()}
              </p>
           </div>
        </div>
        <button 
          onClick={handleRunAnalysis} 
          disabled={loading}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all active:scale-95"
          title="Rafraîchir l'analyse"
        >
          <RefreshCcw className={clsx("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Success Score */}
        <div className="group">
          <Card className="!p-8 !rounded-[2.5rem] border-none bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden h-full">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <TrendingUp className="w-10 h-10 text-indigo-200 mb-6" />
              <span className="text-xs font-black uppercase tracking-widest text-indigo-200 mb-2 block">Probabilité de succès</span>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-display font-black">{analysis?.scoreSucces || 0}%</span>
              </div>
              <div className="mt-6 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${analysis?.scoreSucces}%` }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Risk Score */}
        <div className="group">
          <Card className="!p-8 !rounded-[2.5rem] border-none bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden h-full">
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <ShieldAlert className="w-10 h-10 text-amber-400 mb-6" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Niveau de risque</span>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-display font-black text-amber-500">{analysis?.scoreRisque || 0}%</span>
              </div>
              <div className="mt-6 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${analysis?.scoreRisque}%` }} />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="space-y-6">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Analyse Détaillée (SWOT)</h4>
        {renderAnalysisContent(analysis?.analyse)}
      </div>

      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4 shadow-sm">
         <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
         </div>
         <p className="text-xs text-amber-800 font-bold leading-relaxed">
           <span className="block mb-1 uppercase tracking-wider text-[10px]">Avertissement Légal</span>
           Cette analyse est générée par intelligence artificielle à titre informatif. Elle ne remplace en aucun cas un audit financier ou un conseil d'investissement professionnel.
         </p>
      </div>
    </div>
  );
};

export default AIAnalysisSection;
