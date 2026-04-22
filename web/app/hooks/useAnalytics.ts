"use client";

import { useEffect, useCallback } from "react";
import { ANALYTICS_CONFIG } from "@/lib/config";

interface AnalyticsEvent {
  type: "pageview" | "click" | "search" | "view_category" | "view_match" | "custom";
  page: string;
  timestamp: string;
  data?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  userId: string;
  startTime: string;
  lastActive: string;
  events: AnalyticsEvent[];
  pageViews: string[];
}

/**
 * Hook para rastrear eventos de usuario
 * Guarda información sobre quién entra, qué busca y dónde navega
 */
export function useAnalytics() {
  // Inicializar o recuperar sesión
  const getOrCreateSession = useCallback((): UserSession => {
    if (!ANALYTICS_CONFIG.ENABLED) return null as any;

    const stored = localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEY);
    const now = new Date().toISOString();

    if (stored) {
      const session = JSON.parse(stored) as UserSession;

      // Si la sesión expiró, crear una nueva
      const lastActiveTime = new Date(session.lastActive).getTime();
      const currentTime = new Date(now).getTime();
      const elapsed = currentTime - lastActiveTime;

      if (elapsed > ANALYTICS_CONFIG.SESSION_DURATION_MS) {
        return createNewSession();
      }

      // Actualizar último acceso
      session.lastActive = now;
      localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEY, JSON.stringify(session));
      return session;
    }

    return createNewSession();
  }, []);

  // Crear nueva sesión
  const createNewSession = (): UserSession => {
    const session: UserSession = {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: `user_${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      events: [],
      pageViews: [],
    };

    localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEY, JSON.stringify(session));
    return session;
  };

  // Registrar evento
  const trackEvent = useCallback(
    (
      type: AnalyticsEvent["type"],
      page: string,
      data?: Record<string, any>
    ) => {
      if (!ANALYTICS_CONFIG.ENABLED || !ANALYTICS_CONFIG.TRACK_EVENTS) return;

      const session = getOrCreateSession();
      if (!session) return;

      const event: AnalyticsEvent = {
        type,
        page,
        timestamp: new Date().toISOString(),
        data,
      };

      session.events.push(event);
      session.lastActive = new Date().toISOString();

      // Mantener solo últimos 100 eventos
      if (session.events.length > 100) {
        session.events = session.events.slice(-100);
      }

      localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEY, JSON.stringify(session));

      // Log en consola (desarrollo)
      if (process.env.NODE_ENV === "development") {
        console.log(`📊 [Analytics] ${type}:`, { page, data });
      }
    },
    [getOrCreateSession]
  );

  // Rastrear vista de página
  const trackPageView = useCallback(
    (page: string) => {
      if (!ANALYTICS_CONFIG.ENABLED || !ANALYTICS_CONFIG.TRACK_PAGEVIEWS) return;

      const session = getOrCreateSession();
      if (!session) return;

      session.pageViews.push(page);
      session.lastActive = new Date().toISOString();

      localStorage.setItem(ANALYTICS_CONFIG.STORAGE_KEY, JSON.stringify(session));

      if (process.env.NODE_ENV === "development") {
        console.log(`📊 [PageView]`, page);
      }
    },
    [getOrCreateSession]
  );

  // Rastrear búsqueda
  const trackSearch = useCallback(
    (query: string, results: number) => {
      trackEvent("search", "search", { query, results });
    },
    [trackEvent]
  );

  // Rastrear vista de categoría
  const trackCategoryView = useCallback(
    (categoryId: string, categoryName: string) => {
      trackEvent("view_category", "categories", { categoryId, categoryName });
    },
    [trackEvent]
  );

  // Rastrear vista de partido
  const trackMatchView = useCallback(
    (matchId: string, categoryId: string) => {
      trackEvent("view_match", "matches", { matchId, categoryId });
    },
    [trackEvent]
  );

  // Rastrear clic
  const trackClick = useCallback(
    (element: string, page: string) => {
      trackEvent("click", page, { element });
    },
    [trackEvent]
  );

  // Obtener sesión actual
  const getCurrentSession = useCallback((): UserSession | null => {
    const stored = localStorage.getItem(ANALYTICS_CONFIG.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }, []);

  // Obtener estadísticas
  const getAnalytics = useCallback(() => {
    const session = getCurrentSession();
    if (!session) return null;

    const eventCounts = session.events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const pageStats = session.pageViews.reduce(
      (acc, page) => {
        acc[page] = (acc[page] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      sessionId: session.sessionId,
      userId: session.userId,
      duration: new Date(session.lastActive).getTime() - new Date(session.startTime).getTime(),
      totalEvents: session.events.length,
      totalPageViews: session.pageViews.length,
      eventCounts,
      pageStats,
      topPages: Object.entries(pageStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([page, count]) => ({ page, count })),
    };
  }, [getCurrentSession]);

  // Rastrear página al montar
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackCategoryView,
    trackMatchView,
    trackClick,
    getCurrentSession,
    getAnalytics,
  };
}
