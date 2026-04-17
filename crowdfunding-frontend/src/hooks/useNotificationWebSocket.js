import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Hook WebSocket pour recevoir les notifications en temps réel.
 * Se connecte au broker STOMP via SockJS sur /ws-notifications.
 *
 * @param {number|string} userId  - ID de l'utilisateur connecté
 * @param {function}      onNotification - callback appelé à chaque notification reçue
 */
export function useNotificationWebSocket(userId, onNotification) {
  const stompClient = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      // URL relative → passe par le proxy Vite en dev (ws: true configuré dans vite.config.js)
      webSocketFactory: () => new SockJS('/ws-notifications'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.info(`[WS] Connecté — abonné à /topic/notifications/${userId}`);
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          if (message.body) {
            try {
              const notif = JSON.parse(message.body);
              console.info(`[WS] Reçu ! : ${notif.message}`, notif);
              onNotification(notif);
            } catch (e) {
              console.error('[WS] Impossible de parser la notification :', e);
            }
          }
        });
      },
      onDisconnect: () => {
        console.info('[WS] Déconnecté du broker de notifications.');
      },
      onStompError: (frame) => {
        console.error('[WS] Erreur STOMP :', frame);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current?.active) {
        stompClient.current.deactivate();
      }
    };
  }, [userId, onNotification]);
}


