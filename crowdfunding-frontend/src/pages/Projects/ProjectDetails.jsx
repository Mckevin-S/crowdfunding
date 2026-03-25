import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectById } from '@store/slices/projectSlice';
import ProjectDetail from '../../components/project/ProjectDetail';
import Loader from '@components/common/Loader';
import Button from '@components/common/Button';

const ProjectDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector(state => state.project);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader size="xl" text="Ouverture du dossier projet..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Oups !</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => dispatch(fetchProjectById(id))}>Réessayer</Button>
      </div>
    );
  }

  if (!currentProject) return null;

  return (
    <div className="bg-white min-h-screen">
      <ProjectDetail project={currentProject} />
    </div>
  );
};

export default ProjectDetails;