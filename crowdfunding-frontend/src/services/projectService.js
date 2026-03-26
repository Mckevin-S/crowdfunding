import axios from './api';

const projectService = {
  getAllProjects: (params) => axios.get('/projets', { params }),
  getFeaturedProjects: () => axios.get('/projets/active'),
  getProjectById: (id) => axios.get(`/projets/${id}`),
  createProject: (data) => axios.post('/projets', data),
  getProjetsByPorteur: (porteurId) => axios.get(`/projets/porteur/${porteurId}`),
  updateProject: (id, data) => axios.put(`/projets/${id}`, data),
  deleteProject: (id) => axios.delete(`/projets/${id}`),
  updateProjectStatus: (id, data) => axios.patch(`/projets/${id}/statut`, data),
};

export default projectService;