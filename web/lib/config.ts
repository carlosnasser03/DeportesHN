/**
 * Configuración global de DeportesHN
 * Variables centralizadas para fácil mantenimiento
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 10000,
};

// UI Configuration
export const UI_CONFIG = {
  // Colores
  COLORS: {
    primary: "#2563eb",      // Azul
    success: "#10b981",      // Verde
    warning: "#f59e0b",      // Naranja
    danger: "#ef4444",       // Rojo
    neutral: "#6b7280",      // Gris
  },

  // Espaciado
  SPACING: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  // Border Radius
  RADIUS: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },
};

// Content Configuration
export const CONTENT_CONFIG = {
  // Grid de noticias
  NEWS_GRID: {
    COLS_DESKTOP: 3,
    COLS_TABLET: 2,
    COLS_MOBILE: 1,
    ITEMS_PER_PAGE: 12,
  },

  // Próximos partidos
  UPCOMING_MATCHES: {
    ITEMS_TO_SHOW: 5,
    CAROUSEL_ITEMS: 3,
  },

  // Tabla de posiciones
  STANDINGS: {
    ITEMS_TO_SHOW: 8,
  },

  // Búsqueda
  SEARCH: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    DEBOUNCE_MS: 300,
  },
};

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  ENABLED: true,
  TRACK_EVENTS: true,
  TRACK_PAGEVIEWS: true,
  STORAGE_KEY: "deportehn_user_analytics",
  SESSION_DURATION_MS: 30 * 60 * 1000, // 30 minutos
};

// Feature Flags
export const FEATURES = {
  COMMENTS_ENABLED: false,        // Deshabilitado por ahora
  NEWS_SECTION: true,
  STANDINGS: true,
  UPCOMING_MATCHES: true,
  SEARCH: true,
  USER_FAVORITES: true,
  ANALYTICS: true,
};
