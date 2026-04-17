import api from './api';

export const notificationService = {
  // Récupérer les notifications de l'utilisateur actuel
  getNotificationsByUser: (userId) => {
    return api.get(`/notifications/user/${userId}`);
  },

  // Marquer une notification comme lue
  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  // Créer une notification (principalement pour l'admin ou usage système)
  createNotification: (data) => {
    return api.post('/notifications', data);
  },

  // Supprimer une notification
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  }
};

export default notificationService;
