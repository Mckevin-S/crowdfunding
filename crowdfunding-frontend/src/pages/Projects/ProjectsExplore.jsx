import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProjects } from '@store/slices/projectSlice';
import ProjectCard from '@components/project/ProjectCard';
import Loader from '@components/common/Loader';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

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
    <div className="container mx-auto px-4 py-8">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-display font-extrabold text-neutral-rich mb-4">
            Explorez les projets <br />
            <span className="text-primary-600">africains</span> révolutionnaires.
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <Input
              placeholder="Rechercher une idée, une technologie ou un projet..."
              className="pl-12 h-12 rounded-xl border-gray-100 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-primary-500 hover:text-primary-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-center md:justify-end gap-3">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trier par :</span>
             <select 
               value={selectedSort}
               onChange={(e) => setSelectedSort(e.target.value)}
               className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer"
             >
               {sortOptions.map(opt => (
                 <option key={opt.value} value={opt.value}>{opt.label}</option>
               ))}
             </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50/50 rounded-[2rem]">
          <Loader size="xl" text="Filtrage des pépites en cours..." />
        </div>
      ) : error ? (
        <div className="py-24 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <p className="text-xl text-gray-600 mb-6">{error}</p>
          <Button onClick={() => dispatch(fetchProjects())}>Réessayer</Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-lg font-bold text-neutral-rich">
              {filteredProjects?.length || 0}
            </span>
            <span className="text-gray-500">projets trouvés pour votre recherche</span>
          </div>

          {projects && projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {paginatedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 rounded-xl p-6">
                  <div className="text-sm text-gray-600">
                    Affichage de <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> à <strong>{Math.min(currentPage * ITEMS_PER_PAGE, projects.length)}</strong> sur <strong>{projects.length}</strong> projets
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </button>

                    <div className="flex items-center gap-2">
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
                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                              isActive 
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-500'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 5 && <span className="text-gray-500">...</span>}
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-500 hover:text-primary-600'
                      }`}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm font-semibold text-gray-700">
                    Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="col-span-full py-24 text-center bg-gray-50/50 rounded-[2rem]">
              <p className="text-xl text-gray-500 font-medium">Bientôt de nouveaux projets ici. Revenez vite !</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                Effacer les filtres
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsExplore;