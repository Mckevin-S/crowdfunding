import api from './api';

export const analyseService = {
  getProjectAnalysis: (projectId) => api.get(`/analyse-ia/projet/${projectId}`),
  getAnalysisById: (analysisId) => api.get(`/analyse-ia/${analysisId}`),
  generateAnalysis: (projectId, analysisData) => api.post('/analyse-ia', { ...analysisData, projectId }),
};
