import api from './api';

const messageService = {
  // Envoyer un message
  sendMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },

  // Récupérer une conversation entre deux utilisateurs
  getConversation: async (user1Id, user2Id) => {
    const response = await api.get(`/messages/conversation`, {
      params: { user1Id, user2Id }
    });
    return response.data;
  },

  // Récupérer les conversations récentes d'un utilisateur
  getRecentConversations: async (userId) => {
    const response = await api.get(`/messages/recent/${userId}`);
    return response.data;
  },

  // Marquer un message comme lu
  markAsRead: async (messageId, userId) => {
    const response = await api.patch(`/messages/${messageId}/read`, null, {
      params: { userId }
    });
    return response.data;
  },

  // Obtenir le nombre de messages non lus
  getUnreadCount: async (userId) => {
    const response = await api.get(`/messages/unread/${userId}`);
    return response.data;
  }
};

export default messageService;
