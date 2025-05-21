"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { triggerUserChangedEvent } from "@/lib/events";
import {
  saveAuthToken,
  saveUserId,
  clearAuthToken,
  clearUserId,
  getUserId,
} from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, getToken } = useAuth();
  const [tokenSynced, setTokenSynced] = useState(false);

  // Gestionar cambio de usuario y actualizar localStorage + disparar eventos
  useEffect(() => {
    // Solo ejecutamos cuando isLoaded cambia a true
    if (!isLoaded) return;

    // Obtener el ID de usuario anterior
    const prevUserId = getUserId();

    // Si la autenticación está cargada y el ID de usuario cambió
    if (prevUserId !== userId) {
      console.log(
        `Detectado cambio de usuario: ${prevUserId || "anónimo"} -> ${
          userId || "anónimo"
        }`
      );

      // Almacenar el ID del usuario actual utilizando la utilidad
      if (userId) {
        saveUserId(userId);
      } else {
        clearUserId();
        clearAuthToken(); // También limpiamos el token si el usuario es null
      }

      // Disparar evento de cambio de usuario
      if (typeof window !== "undefined") {
        try {
          triggerUserChangedEvent(prevUserId || undefined, userId || undefined);
          console.log("Evento userChanged disparado correctamente");
        } catch (error) {
          console.error("Error al disparar evento userChanged:", error);
        }
      }
    }
  }, [userId, isLoaded]);

  // Obtener y almacenar el token JWT cuando el usuario cambia
  useEffect(() => {
    const syncToken = async () => {
      if (isLoaded && userId && !tokenSynced) {
        try {
          // Obtener el token JWT de Clerk
          const token = await getToken();
          if (token) {
            saveAuthToken(token);
            setTokenSynced(true);
            console.log("Token de autenticación sincronizado correctamente");
          }
        } catch (error) {
          console.error("Error al sincronizar token de autenticación:", error);
        }
      } else if (isLoaded && !userId) {
        // Si no hay usuario pero isLoaded es true, limpiar token
        clearAuthToken();
        setTokenSynced(false);
      }
    };

    syncToken();
  }, [userId, isLoaded, getToken, tokenSynced]);

  return <>{children}</>;
}

export default AuthProvider;
