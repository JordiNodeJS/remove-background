"use client";

import { useEffect } from "react";

// Este componente inicializa la aplicación haciendo una petición al endpoint de inicialización
export default function AppInit() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar los directorios de la aplicación
        await fetch("/api/_init");
      } catch (error) {
        console.error("Error al inicializar la aplicación:", error);
      }
    };

    initializeApp();
  }, []);

  return null; // Este componente no renderiza nada
}
