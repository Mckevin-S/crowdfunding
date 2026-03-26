import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProjects } from '@store/slices/projectSlice';
import ProjectCard from '@components/project/ProjectCard';
import Loader from '@components/common/Loader';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Badge from '@components/common/Badge';

const ITEMS_PER_PAGE = 12;

const ProjectsExplore = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, loading, error } = useSelector(state => state.project);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['All', 'Don', 'Récompense', 'Prêt', 'Capital'];
  const sortOptions = [
    { label: 'Plus récents', value: 'newest' },
    { label: 'Plus populaires', value: 'popular' },
    { label: 'Bientôt terminés', value: 'ending_soon' },
    { label: 'Objectif financier', value: 'goal' },
  ];
  const [selectedSort, setSelectedSort] = useState('newest');

  const typeMap = {
    All: null,
    Don: 'DON',
    Récompense: 'REWARD',
    Prêt: 'LOAN',
    Capital: 'EQUITY',
  };

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    let filtered = [...projects];

    // Filtrer par type (local client-side) en cas de backend non supporté
    const typeFilter = typeMap[selectedCategory];
    if (typeFilter) {
      filtered = filtered.filter((project) => project.typeFinancement === typeFilter);
    }

    // Recherche
    if (searchTerm.trim()) {
      const lowerQuery = searchTerm.trim().toLowerCase();
      filtered = filtered.filter((project) =>
        (project.titre || '').toLowerCase().includes(lowerQuery) ||
        (project.description || '').toLowerCase().includes(lowerQuery)
      );
    }

    // Tri simple
    if (selectedSort === 'newest') {
      filtered.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
    } else if (selectedSort === 'popular') {
      filtered.sort((a, b) => (b.nombreContributeurs || 0) - (a.nombreContributeurs || 0));
    } else if (selectedSort === 'ending_soon') {
      filtered.sort((a, b) => new Date(a.dateFin) - new Date(b.dateFin));
    } else if (selectedSort === 'goal') {
      filtered.sort((a, b) => (a.objectifFinancier || 0) - (b.objectifFinancier || 0));
    }

    return filtered;
  }, [projects, searchTerm, selectedCategory, selectedSort]);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, endIndex);
  }, [filteredProjects, currentPage]);

  const totalPages = Math.ceil((filteredProjects.length || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.q = searchTerm;
    if (selectedCategory !== 'All') params.category = selectedCategory;

    dispatch(fetchProjects(params));
    setCurrentPage(1); // Reset to first page on filter change
  }, [dispatch, searchTerm, selectedCategory]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Social Header Section */}
      <div className="flex flex-col gap-10 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700">
            <Badge variant="emerald" className="mb-4 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase bg-emerald-50 text-emerald-600 border-none">
              Découvrir l'innovation
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-black text-slate-900 leading-[0.95] tracking-tighter mb-6">
              Façonnez l'avenir <br />
              <span className="text-emerald-600">de l'Afrique.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed italic">
              Parcourez le flux des pépites technologiques et entrepreneuriales qui transforment le continent.
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50 animate-in slide-in-from-right duration-700">
             <div className="px-6 py-3 border-r border-slate-100">
                <p className="text-2xl font-black text-slate-900">{filteredProjects?.length || 0}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pépites</p>
             </div>
             <div className="px-6 py-3">
                <p className="text-2xl font-black text-emerald-600">1.2B</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FCFA Collectés</p>
             </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-slate-200/40 p-4 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-4 sticky top-24 z-20">
          <div className="relative flex-1 w-full lg:w-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
            <input
              placeholder="Rechercher une idée, un porteur ou une vision..."
              className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[1.8rem] focus:ring-4 focus:ring-emerald-500/10 placeholder:text-slate-400 font-medium text-slate-900 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                  : 'bg-white text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-10 w-px bg-slate-100 hidden lg:block mx-2" />
          
          <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 rounded-2xl w-full lg:w-auto">
             <SlidersHorizontal className="w-4 h-4 text-slate-400" />
             <select 
               value={selectedSort}
               onChange={(e) => setSelectedSort(e.target.value)}
               className="bg-transparent border-none text-[10px] font-black text-slate-600 uppercase tracking-widest focus:ring-0 cursor-pointer p-0"
             >
               {sortOptions.map(opt => (
                 <option key={opt.value} value={opt.value}>{opt.label}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      {/* Results Feed Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
           <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Loader size="lg" />
           </div>
           <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Synchronisation du flux...</p>
        </div>
      ) : error ? (
        <div className="py-32 text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-red-100">
            <Filter className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">Oups ! Connexion perturbée.</h3>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
          <Button onClick={() => dispatch(fetchProjects())} className="rounded-2xl px-12 py-4">Actualiser le flux</Button>
        </div>
      ) : (
        <div className="animate-in fade-in duration-1000">
          {projects && projects.length > 0 ? (
            <>
              {/* Grid with Social Vibe */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 relative">
                {/* Visual accents */}
                <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-200/10 rounded-full -translate-x-1/2 blur-[100px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/10 rounded-full translate-x-1/2 blur-[100px] pointer-events-none" />

                {paginatedProjects.map(project => (
                  <div key={project.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/50 shadow-2xl">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Résultats <span className="text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProjects.length)}</span> / {filteredProjects.length}
                  </div>

                  <div className="flex items-center gap-6">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        currentPage === 1 
                          ? 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed' 
                          : 'bg-white text-slate-900 border border-slate-100 hover:border-emerald-500 hover:text-emerald-600 shadow-xl shadow-slate-200/50'
                      }`}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3">
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        const pageNum = i + 1;
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => {
                              setCurrentPage(pageNum);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-14 h-14 rounded-2xl text-sm font-black transition-all ${
                              isActive 
                                ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-600/40 scale-110' 
                                : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                        currentPage === totalPages 
                          ? 'bg-slate-100 text-slate-300 opacity-50 cursor-not-allowed' 
                          : 'bg-white text-slate-900 border border-slate-100 hover:border-emerald-500 hover:text-emerald-600 shadow-xl shadow-slate-200/50'
                      }`}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">
                    Page {currentPage} / {totalPages}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full py-40 text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white shadow-2xl">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Search className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Invention en cours...</h3>
              <p className="text-lg text-slate-400 font-medium italic mb-10">Aucun projet ne correspond à cet univers pour le moment.</p>
              <Button 
                variant="outline" 
                className="px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200 hover:border-emerald-500"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Réinitialiser le flux
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsExplore;