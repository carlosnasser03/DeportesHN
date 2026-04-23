import { useEffect, useState, useCallback } from "react";

export interface Notification {
  type: string;
  data?: any;
  timestamp: Date;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 10));
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.timestamp !== notification.timestamp));
    }, 5000);
  }, []);

  return { notifications, addNotification };
};
