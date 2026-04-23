import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface Notification {
  type: string;
  data?: any;
  timestamp: Date;
  id?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Conectar a WebSocket en el mount
  useEffect(() => {
    // Determinar URL del servidor
    const serverUrl = typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "http://localhost:3000";

    // Conectar al servidor WebSocket
    socketRef.current = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Listeners de conexión
    socketRef.current.on("connect", () => {
      console.log("✅ Conectado a WebSocket:", socketRef.current?.id);
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔌 Desconectado de WebSocket");
      setIsConnected(false);
    });

    // Escuchar eventos de comentarios
    socketRef.current.on("comment:created", (message) => {
      console.log("📝 Nuevo comentario:", message);
      addNotification({
        type: message.type,
        data: message.data,
        timestamp: new Date(message.timestamp),
        id: `created_${Date.now()}`,
      });
    });

    socketRef.current.on("comment:approved", (message) => {
      console.log("✅ Comentario aprobado:", message);
      addNotification({
        type: message.type,
        timestamp: new Date(message.timestamp),
        id: `approved_${message.commentId}`,
      });
    });

    socketRef.current.on("comment:rejected", (message) => {
      console.log("❌ Comentario rechazado:", message);
      addNotification({
        type: message.type,
        timestamp: new Date(message.timestamp),
        id: `rejected_${message.commentId}`,
      });
    });

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    const id = notification.id || `notif_${Date.now()}`;
    const notificationWithId = { ...notification, id };

    setNotifications((prev) => [notificationWithId, ...prev].slice(0, 10));

    // Auto-dismiss después de 5 segundos
    const timeout = setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Suscribirse a una categoría específica
  const subscribeToCategory = useCallback((categoryId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("subscribe_category", categoryId);
      console.log(`✅ Suscrito a categoría: ${categoryId}`);
    }
  }, []);

  // Desuscribirse de una categoría
  const unsubscribeFromCategory = useCallback((categoryId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("unsubscribe_category", categoryId);
      console.log(`❌ Desuscrito de categoría: ${categoryId}`);
    }
  }, []);

  return {
    notifications,
    addNotification,
    isConnected,
    subscribeToCategory,
    unsubscribeFromCategory,
  };
};
