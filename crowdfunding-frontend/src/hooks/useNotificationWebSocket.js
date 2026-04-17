import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

export function useNotificationWebSocket(userId, onNotification) {
  const stompClient = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-notifications',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/notifications/${userId}`, (message) => {
          if (message.body) {
            onNotification(JSON.parse(message.body));
          }
        });
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

