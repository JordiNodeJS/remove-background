"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

// Esta función compone una clave para localStorage basada en el ID de usuario
const getUserHistoryKey = (userId: string | null) => {
  return userId ? `imageProcessingHistory_${userId}` : "imageProcessingHistory";
};

// Esta función maneja la transición del historial cuando un usuario inicia o cierra sesión
const handleUserTransition = (
  previousUserId: string | null,
  currentUserId: string | null
) => {
  // Si es el mismo usuario o ambos son nulos, no hacemos nada
  if (previousUserId === currentUserId) return;

  console.log(
    `Manejando transición de usuario: ${previousUserId || "anónimo"} -> ${
      currentUserId || "anónimo"
    }`
  );

  try {
    // Si estamos pasando de usuario anónimo a autenticado
    if (!previousUserId && currentUserId) {
      // Intentamos migrar el historial anónimo al usuario autenticado
      const anonymousHistory = localStorage.getItem("imageProcessingHistory");
      if (anonymousHistory) {
        localStorage.setItem(
          getUserHistoryKey(currentUserId),
          anonymousHistory
        );
        console.log(`Historial anónimo migrado al usuario ${currentUserId}`);
      }
    }

    // Preparamos un evento para notificar que el historial debe actualizarse
    const event = new CustomEvent("historyUpdated", {
      detail: {
        userId: currentUserId,
      },
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error("Error manejando la transición de usuario:", error);
  }
};

export function UserHistoryManager() {
  const { userId, isLoaded } = useAuth();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!initialized) {
      setInitialized(true);

      // Obtener el usuario anterior de localStorage
      const prevUserId = localStorage.getItem("currentUserId");

      // Si hay un cambio de usuario
      if (prevUserId !== userId) {
        handleUserTransition(prevUserId, userId);

        // Actualizar el usuario actual en localStorage
        if (userId) {
          localStorage.setItem("currentUserId", userId);
        } else {
          localStorage.removeItem("currentUserId");
        }
      }

      // También escuchamos el evento userChanged desde otros componentes
      const handleUserChanged = (
        e: CustomEvent<{ previousUserId?: string; currentUserId?: string }>
      ) => {
        const { previousUserId, currentUserId } = e.detail;
        handleUserTransition(previousUserId || null, currentUserId || null);
      };

      window.addEventListener(
        "userChanged",
        handleUserChanged as EventListener
      );

      return () => {
        window.removeEventListener(
          "userChanged",
          handleUserChanged as EventListener
        );
      };
    }
  }, [userId, isLoaded, initialized]);

  // Este componente no renderiza nada
  return null;
}

export default UserHistoryManager;
