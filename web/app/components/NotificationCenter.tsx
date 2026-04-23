"use client";

import React from "react";

interface Notification {
  type: string;
  data?: any;
  timestamp: Date;
}

export const NotificationCenter: React.FC<{ notifications: Notification[] }> = ({
  notifications,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "COMMENT_CREATED":
        return "💬";
      case "COMMENT_APPROVED":
        return "✅";
      case "COMMENT_REJECTED":
        return "❌";
      default:
        return "📢";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "COMMENT_CREATED":
        return "Nuevo comentario";
      case "COMMENT_APPROVED":
        return "Comentario aprobado";
      case "COMMENT_REJECTED":
        return "Comentario rechazado";
      default:
        return "Notificación";
    }
  };

  return (
    <div className="fixed top-24 right-4 space-y-2 max-w-xs z-50">
      {notifications.map((notif, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg animate-slide-in"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{getIcon(notif.type)}</span>
            <span className="text-sm font-medium text-gray-900">
              {getLabel(notif.type)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
