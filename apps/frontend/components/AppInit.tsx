"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";

// Este componente inicializa la aplicación haciendo una petición al endpoint de inicialización
// y verifica la conectividad con el backend
export default function AppInit() {
  // Estado para rastrear la conectividad del backend
  // const [backendStatus, setBackendStatus<
  //   "unknown" | "online" | "offline"
  // >("unknown");
  // TODO: Consider using backendStatus to provide user feedback or alter UI

  useEffect(() => {
    const performHealthCheckWithRetries = async () => {
      // Determine backend URL
      let backendUrl: string;

      console.log(
        "[AppInit] Valor de process.env.NODE_ENV en cliente:",
        process.env.NODE_ENV
      );
      // Priorizar variable de entorno NEXT_PUBLIC_APP_BASE_URL
      if (process.env.NEXT_PUBLIC_APP_BASE_URL) {
        backendUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
        console.log(
          `[AppInit] Usando NEXT_PUBLIC_APP_BASE_URL para health check: ${backendUrl}`
        );
      } else if (process.env.NODE_ENV === "development") {
        backendUrl = "http://localhost:3001";
        console.log(
          `[AppInit] Modo Desarrollo: Fallback a localhost: ${backendUrl}`
        );
      } else if (typeof window !== "undefined" && window.location.hostname) {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        // Siempre usar el puerto 3001 para la API
        const apiPort = 3001;

        // Construir la URL dinámicamente con el puerto correcto para la API
        backendUrl = `${protocol}//${hostname}:${apiPort}`;

        console.log(
          `[AppInit] Fallback (sin NEXT_PUBLIC_API_URL, con window): URL del backend (construida dinámicamente): ${backendUrl}`
        );
      } else {
        // Fallback para SSR o si window/hostname no está disponible y NEXT_PUBLIC_API_URL tampoco
        backendUrl = "http://localhost:3001"; // El fallback original, también útil para SSR en dev
        console.log(
          `[AppInit] Fallback (SSR/default sin NEXT_PUBLIC_API_URL): URL del backend: ${backendUrl}`
        );
      }
      console.log("Verificando conexión con el backend (desde el cliente)... ");

      // Asegurarse de que la URL no termina con una barra para la ruta /health
      if (backendUrl.endsWith("/")) {
        backendUrl = backendUrl.slice(0, -1);
      }

      // Asegurarse de que el puerto 3001 esté en la URL
      if (!backendUrl.includes(":3001")) {
        console.log("[AppInit] Añadiendo puerto 3001 a la URL");
        backendUrl = backendUrl.includes("://")
          ? `${backendUrl.split("://")[0]}://${backendUrl.split("://")[1].split("/")[0]}:3001`
          : `${backendUrl}:3001`;
      }

      const retries = 3;
      let lastError: Error | null = null;

      for (let i = 0; i < retries; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout per attempt

        try {
          console.log(
            `Intentando conectar a: ${backendUrl}/health (Intento ${
              i + 1
            }/${retries})`
          );
          const response = await fetch(`${backendUrl}/health`, {
            method: "GET",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
            signal: controller.signal,
            redirect: "manual",
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            // setBackendStatus("online");
            console.log("Backend conectado correctamente");
            return; // Success
          } else {
            // Non-OK response is also a form of "connection" but indicates backend issue
            // setBackendStatus("offline");
            console.error(
              "El backend no responde correctamente. Estado:",
              response.status
            );
            lastError = new Error(
              `Backend responded with status ${response.status}`
            );
            // Break here as backend is reachable but not healthy
            // Or continue retrying if specific statuses are considered retryable
            // For now, any non-ok response after a successful fetch is treated as a final state for this attempt.
          }
        } catch (error) {
          clearTimeout(timeoutId);
          console.error(
            `Error en intento ${i + 1} al verificar el estado del backend:`,
            error
          );
          lastError = error instanceof Error ? error : new Error(String(error));
        }

        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s before next retry
        }
      }

      // If all retries fail or backend is not healthy
      // setBackendStatus("offline");
      const errorMessage =
        lastError instanceof Error && lastError.name === "AbortError"
          ? "Timeout al conectar con el servicio de procesamiento. Se usará el modo de respaldo local."
          : "No se pudo conectar con el servicio de procesamiento. Se usará el modo de respaldo local.";
      toast.error(errorMessage, { duration: 10000 });
      console.error(
        "Todos los intentos de conexión al backend fallaron o el backend no está saludable.",
        lastError
      );
    };

    const initializeApp = async () => {
      try {
        // Inicializar los directorios de la aplicación
        console.log("Inicializando directorios de la aplicación...");
        const initController = new AbortController();
        const initTimeoutId = setTimeout(() => initController.abort(), 5000);

        try {
          const initResponse = await fetch("/api/init", {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
            signal: initController.signal,
          });
          clearTimeout(initTimeoutId);

          if (!initResponse.ok) {
            console.error(
              "Error al inicializar directorios. Estado:",
              initResponse.status
            );
          } else {
            console.log("Directorios inicializados correctamente");
          }
        } catch (fetchError) {
          clearTimeout(initTimeoutId);
          console.error(
            "Error al inicializar la aplicación (fetch /api/init):",
            fetchError
          );
        }
      } catch (error) {
        console.error(
          "Error general en la inicialización de directorios:",
          error
        );
      }

      // Verificar que el backend está respondiendo
      if (process.env.NEXT_PUBLIC_USE_MOCK_API !== "true") {
        await performHealthCheckWithRetries();
      }
    };

    initializeApp();
  }, []);

  return null; // Este componente no renderiza nada
}
