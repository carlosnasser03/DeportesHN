"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";

interface AuthToken {
  token: string;
  expiresAt: number;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener token del backend (requiere admin_key)
  const getToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_KEY;
      if (!adminKey) {
        throw new Error("Admin key no configurada");
      }

      const response = await api.post("/auth/token", {
        admin_key: adminKey,
      });

      if (response.data.success && response.data.data.token) {
        const tokenData: AuthToken = response.data.data;
        
        // Guardar en sessionStorage con expiración
        sessionStorage.setItem(
          "auth_token",
          JSON.stringify({
            token: tokenData.token,
            expiresAt: tokenData.expiresAt,
          })
        );
        
        setToken(tokenData.token);
        return tokenData.token;
      } else {
        throw new Error("No se pudo obtener el token");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || err.message || "Error de autenticación";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Recuperar token guardado y validar expiración
  const getStoredToken = useCallback((): string | null => {
    try {
      const stored = sessionStorage.getItem("auth_token");
      if (!stored) return null;

      const { token: storedToken, expiresAt } = JSON.parse(stored);
      
      // Si expiró, retornar null
      if (Date.now() > expiresAt) {
        sessionStorage.removeItem("auth_token");
        return null;
      }

      return storedToken;
    } catch {
      return null;
    }
  }, []);

  // Obtener token (del almacenamiento o solicitar uno nuevo)
  const getValidToken = useCallback(async (): Promise<string | null> => {
    // Primero intentar obtener del almacenamiento
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
      return storedToken;
    }

    // Si no hay token válido, obtener uno nuevo
    return await getToken();
  }, [getToken, getStoredToken]);

  // Al montar, intentar cargar token guardado
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
    }
  }, [getStoredToken]);

  return {
    token,
    loading,
    error,
    getToken,
    getValidToken,
  };
};
