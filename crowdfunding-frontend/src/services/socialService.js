import api from './api';

const SocialService = {
  addComment: async (data) => {
    const response = await api.post('/social/comments', data);
    return response.data;
  },

  getCommentsByProject: async (projectId) => {
    const response = await api.get(`/social/comments/project/${projectId}`);
    return response.data;
  },

  deleteComment: async (id) => {
    await api.delete(`/social/comments/${id}`);
  },

  toggleLike: async (projectId, userId) => {
    const response = await api.post(`/social/like/project/${projectId}/user/${userId}`);
    return response.data;
  },

  trackShare: async (projectId, userId) => {
    const response = await api.post(`/social/share/project/${projectId}/user/${userId}`);
    return response.data;
  },

  getSocialStats: async (projectId, userId = null) => {
    const url = userId 
      ? `/social/stats/project/${projectId}?utilisateurId=${userId}` 
      : `/social/stats/project/${projectId}`;
    const response = await api.get(url);
    return response.data;
  }
};

export default SocialService;
