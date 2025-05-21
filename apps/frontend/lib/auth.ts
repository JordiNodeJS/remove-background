"use client";

/**
 * Utilidad para manejar la autenticación y gestión de tokens en el frontend.
 * Este archivo proporciona funciones para almacenar, recuperar y gestionar tokens de autenticación.
 */

// Claves para almacenamiento local
const AUTH_TOKEN_KEY = "authToken";
const USER_ID_KEY = "currentUserId";

/**
 * Guarda el token de autenticación en localStorage
 */
export const saveAuthToken = (token: string): void => {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error al guardar token de autenticación:", error);
  }
};

/**
 * Obtiene el token de autenticación de localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Error al recuperar token de autenticación:", error);
    return null;
  }
};

/**
 * Elimina el token de autenticación de localStorage
 */
export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Error al eliminar token de autenticación:", error);
  }
};

/**
 * Guarda el ID de usuario en localStorage
 */
export const saveUserId = (userId: string): void => {
  try {
    localStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error("Error al guardar ID de usuario:", error);
  }
};

/**
 * Obtiene el ID de usuario de localStorage
 */
export const getUserId = (): string | null => {
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (error) {
    console.error("Error al recuperar ID de usuario:", error);
    return null;
  }
};

/**
 * Elimina el ID de usuario de localStorage
 */
export const clearUserId = (): void => {
  try {
    localStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.error("Error al eliminar ID de usuario:", error);
  }
};

/**
 * Verifica si el usuario está autenticado (tiene un token guardado)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Realizar logout completo (eliminar token e ID de usuario)
 */
export const logout = (): void => {
  clearAuthToken();
  clearUserId();
};

/**
 * Obtiene los headers de autenticación para peticiones API
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
