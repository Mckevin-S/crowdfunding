import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { fetchProjects } from '@store/slices/projectSlice';
import ProjectCard from '@components/project/ProjectCard';
import Loader from '@components/common/Loader';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

const ProjectsExplore = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { projects, loading, error } = useSelector(state => state.project);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  const categories = ['All', 'Don', 'Récompense', 'Prêt', 'Capital'];
  const sortOptions = [
    { label: 'Plus récents', value: 'newest' },
    { label: 'Plus populaires', value: 'popular' },
    { label: 'Bientôt terminés', value: 'ending_soon' },
    { label: 'Objectif financier', value: 'goal' },
  ];
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    const params = {};
    if (searchTerm) params.q = searchTerm;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    
    dispatch(fetchProjects(params));
  }, [dispatch, searchTerm, selectedCategory]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') newParams.delete('category');
    else newParams.set('category', cat);
    setSearchParams(newParams);
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
              {projects?.length || 0}
            </span>
            <span className="text-gray-500">projets trouvés pour votre recherche</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects && projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
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
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsExplore;