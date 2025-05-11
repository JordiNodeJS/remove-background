"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Este componente inicializa la aplicación haciendo una petición al endpoint de inicialización
// y verifica la conectividad con el backend
export default function AppInit() {
  // Estado para rastrear la conectividad del backend
  const [backendStatus, setBackendStatus] = useState<"unknown" | "online" | "offline">("unknown");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar los directorios de la aplicación
        console.log("Inicializando directorios de la aplicación...");
        
        // Usamos un AbortController para manejar el timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        try {
          const initResponse = await fetch("/api/init", {
            cache: "no-store", // Evitar caché
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
            signal: controller.signal
          });
          
          // Limpiar el timeout si la petición se completa
          clearTimeout(timeoutId);
          
          if (!initResponse.ok) {
            console.error("Error al inicializar directorios. Estado:", initResponse.status);
          } else {
            console.log("Directorios inicializados correctamente");
          }
        } catch (fetchError) {
          // Limpiar el timeout
          clearTimeout(timeoutId);
          
          console.error("Error al inicializar la aplicación:", fetchError);
          // No mostramos toast aquí porque no es crítico para el usuario
        }
      } catch (error) {
        console.error("Error general en la inicialización:", error);
        // No mostramos toast aquí porque no es crítico para el usuario
      }

      // Verificar que el backend está respondiendo
      if (process.env.NEXT_PUBLIC_USE_MOCK_API !== "true") {
        try {
          console.log("Verificando conexión con el backend...");
          const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
          console.log("URL del backend:", backendUrl);
          
          // Usar un enfoque más robusto para el timeout que funcione en todos los navegadores
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            // Intentar conectar con el endpoint de health check
            console.log(`Intentando conectar a: ${backendUrl}/health`);
            const response = await fetch(`${backendUrl}/health`, {
              method: "GET",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
              // Usar un signal del AbortController para el timeout
              signal: controller.signal,
              // Forzar la no redirección para evitar problemas
              redirect: "manual"
            });
            
            // Limpiar el timeout si la petición se completa antes
            clearTimeout(timeoutId);
            
            if (response.ok) {
              setBackendStatus("online");
              console.log("Backend conectado correctamente");
            } else {
              setBackendStatus("offline");
              console.error("El backend no responde correctamente. Estado:", response.status);
              toast.error(
                "No se pudo conectar con el servicio de procesamiento. Se usará el modo de respaldo local.",
                { duration: 10000 }
              );
            }
          } catch (error) {
            // Limpiar el timeout
            clearTimeout(timeoutId);
            
            setBackendStatus("offline");
            console.error("Error al verificar el estado del backend:", error);
            
            // Detectar si es un error de timeout/abort
            const errorMessage = error instanceof Error && error.name === 'AbortError' 
              ? "Timeout al conectar con el servicio de procesamiento. Se usará el modo de respaldo local."
              : "No se pudo conectar con el servicio de procesamiento. Se usará el modo de respaldo local.";
            
            toast.error(errorMessage, { duration: 10000 });
          }
        } catch (error) {
          console.error("Error general al verificar el backend:", error);
          setBackendStatus("offline");
          toast.error("Error al verificar el servicio de procesamiento. Se usará el modo de respaldo local.", { 
            duration: 10000 
          });
        }
      }
    };

    initializeApp();
  }, []);

  return null; // Este componente no renderiza nada
}
