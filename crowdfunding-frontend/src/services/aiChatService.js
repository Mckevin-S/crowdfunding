import axios from 'axios';

const API_IA = 'http://localhost:8080/api/v1/analyses-ia';
const API_CHAT = 'http://localhost:8080/api/v1/ai/chat';

const aiChatService = {
  // Déclencher une nouvelle analyse
  analyzeProject: async (projetId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_IA, { projetId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Récupérer les analyses existantes
  getAnalysesByProject: async (projetId) => {
    const response = await axios.get(`${API_IA}/projet/${projetId}`);
    return response.data;
  },

  // Discuter avec le chatbot (avec historique pour la mémoire)
  sendMessage: async (message, projetId = null, history = []) => {
    const response = await axios.post(API_CHAT, { message, projetId, history });
    return response.data.response;
  }
};

export default aiChatService;
