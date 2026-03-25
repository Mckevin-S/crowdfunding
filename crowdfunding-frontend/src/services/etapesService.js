import api from './api';

export const etapesService = {
  getProjectEtapes: (projectId) => api.get(`/etapes/projet/${projectId}`),
  createEtape: (projectId, etapeData) => api.post('/etapes', { ...etapeData, projectId }),
  updateEtape: (etapeId, data) => api.put(`/etapes/${etapeId}`, data),
  deleteEtape: (etapeId) => api.delete(`/etapes/${etapeId}`),
  getEtapeById: (etapeId) => api.get(`/etapes/${etapeId}`),
};
