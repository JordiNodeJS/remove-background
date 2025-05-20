"use client";

import { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";
import UploadButton from "./UploadButton";
import ImageComparison from "./ImageComparison";
import ProcessingHistory from "./ProcessingHistory";
import SnailIcon from "./SnailIcon";

export default function ImageProcessor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const [serviceBusy, setServiceBusy] = useState(false);
  const [showBusyMessage, setShowBusyMessage] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const busyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleImageProcessed = (originalUrl: string, processedUrl: string) => {
    const isBusy = processedUrl === "/placeholder-busy.svg";
    setServiceBusy(isBusy);
    setOriginalImage(originalUrl);
    setProcessedImage(processedUrl);

    if (isBusy) {
      setShowBusyMessage(true);
      if (busyTimeoutRef.current) clearTimeout(busyTimeoutRef.current);
      busyTimeoutRef.current = setTimeout(() => {
        setShowBusyMessage(false);
        setServiceBusy(false);
      }, 3500); // Muestra el mensaje por 3.5 segundos
    } else {
      setShowBusyMessage(false);
      if (busyTimeoutRef.current) clearTimeout(busyTimeoutRef.current);
    }

    // Detener el cronómetro
    if (startTimeRef.current) {
      setProcessingTime(Date.now() - startTimeRef.current);
      startTimeRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Confeti solo si el procesamiento fue exitoso
    if (processedUrl && processedUrl !== "/placeholder-error.svg") {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.7 },
      });
    }

    // Dispara un evento personalizado para notificar al componente de historial
    const event = new CustomEvent("imageProcessed", {
      detail: {
        originalUrl,
        processedUrl,
        hasError: processedUrl === "/placeholder-error.svg",
      },
    });
    window.dispatchEvent(event);
  };

  // Iniciar el cronómetro cuando comienza el procesamiento
  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setProcessingTime(null);
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setProcessingTime(Date.now() - startTimeRef.current);
        }
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLoading]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <Toaster position="top-center" />

      <div className="mb-8 w-full text-center">
        <div className="relative mb-4 inline-flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-pink-500/20 to-pink-400/10 rounded-xl blur-xl transform scale-110"></div>
          <div className="px-4 py-3 backdrop-blur-lg bg-white/10 dark:bg-[var(--secondary)]/20 rounded-xl border-l-4 border-pink-500 shadow-lg relative z-10">
            <h1
              className="text-3xl font-bold text-center text-pink-600 dark:text-pink-500 relative"
              style={{ letterSpacing: "-0.5px" }}
            >
              Eliminador de fondos
            </h1>
          </div>
          <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-pink-600 dark:bg-pink-500 rounded-full opacity-30 blur-lg"></div>
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-pink-400 dark:bg-pink-300 rounded-full opacity-20 blur-lg"></div>
        </div>
        <div className="relative flex justify-center w-full mb-2">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/10 to-transparent rounded-lg blur-xl -z-10"></div>
          <p className="text-lg text-[var(--foreground)]/80 font-medium max-w-2xl">
            Sube una imagen y automáticamente eliminaremos el fondo para ti.{" "}
            <span className="text-pink-600 dark:text-pink-400">
              ¡Haz magia con tus fotos en un solo clic!
            </span>
          </p>
        </div>
      </div>
      <div className="space-y-8 w-full">
        <div className="rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-[var(--secondary)]/70 shadow-xl border border-white/30 dark:border-pink-900/30 p-8">
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-32 h-32 bg-pink-300/20 dark:bg-pink-800/10 rounded-full blur-2xl -z-10"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-400/20 dark:bg-pink-700/10 rounded-full blur-2xl -z-10"></div>

            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                  Sube una imagen
                </h2>
                <div className="flex items-start space-x-2 mb-2">
                  <div className="h-5 w-1 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
                  <p className="text-[var(--foreground)]/70">
                    Formato JPG o PNG hasta 10MB
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-5 w-1 bg-pink-500 rounded-full mt-1 flex-shrink-0"></div>
                  <p className="text-[var(--foreground)]/70">
                    Nuestra IA eliminará automáticamente el fondo
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <UploadButton
                  onImageProcessed={handleImageProcessed}
                  onLoading={setIsLoading}
                />
              </div>
            </div>
          </div>
        </div>
        {showBusyMessage ? (
          <div className="w-full h-[400px] flex items-center justify-center rounded-2xl backdrop-blur-xl bg-red-50/80 dark:bg-red-900/20 shadow-xl border border-red-200/50 dark:border-red-700/30 p-8">
            <div className="flex flex-col items-center backdrop-blur-md bg-white/50 dark:bg-[var(--secondary)]/50 p-6 rounded-xl border border-red-200/30 dark:border-red-700/20 shadow-lg">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4 shadow-inner">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="text-red-500 drop-shadow-sm"
                >
                  <path
                    fill="currentColor"
                    d="M20 14c0 5.5-5.8 8-13 8c-3.28 0-6.95-0.7-9.7-2.2l3.7-2.8H5c2.8 0 5-2.2 5-5v-1.2c0-2 1.6-3.6 3.6-3.6c1.5 0 2.8 0.9 3.3 2.2c3.3 0.6 5.8 2.8 5.8 4.6z"
                  />
                  <path
                    fill="currentColor"
                    d="M11 10c0 0.6-0.4 1-1 1s-1-0.4-1-1s0.4-1 1-1s1 0.4 1 1z"
                  />
                  <path
                    fill="currentColor"
                    d="M7 11.5c0 0.8-0.7 1.5-1.5 1.5S4 12.3 4 11.5S4.7 10 5.5 10S7 10.7 7 11.5z"
                  />
                  <path
                    fill="#ffffff"
                    d="M4 14c1.1 0 2-0.9 2-2s-0.9-2-2-2s-2 0.9-2 2s0.9 2 2 2z"
                  />
                </svg>
              </div>
              <p className="text-red-700 dark:text-red-200 font-semibold text-lg text-center">
                No se puede procesar la imagen porque el servicio está ocupado.
                Por favor, inténtalo de nuevo en unos minutos.
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-[var(--secondary)]/70 shadow-xl border border-white/30 dark:border-pink-900/30 p-8">
            <div className="flex flex-col items-center backdrop-blur-md bg-white/50 dark:bg-[var(--secondary)]/50 p-6 rounded-xl border border-white/30 dark:border-pink-900/20 shadow-lg">
              <div className="w-16 h-16 flex items-center justify-center relative mb-4">
                <div className="absolute inset-0 rounded-full bg-pink-500/10 animate-ping"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 dark:border-pink-400 relative z-10 drop-shadow-md"></div>
              </div>
              <p className="text-[var(--foreground)]/80 font-medium mb-2">
                Procesando imagen...
              </p>
              <ProcessingTimer />
            </div>
          </div>
        ) : (
          (originalImage || processedImage) && (
            <div className="rounded-3xl backdrop-blur-2xl bg-white/60 dark:bg-[var(--secondary)]/70 shadow-[0_8px_32px_0_rgba(0,0,0,0.12),_inset_0_1.5px_12px_rgba(255,255,255,0.13)] border border-white/40 dark:border-pink-900/30 p-10 w-full flex flex-col items-center transition-all duration-300">
              {processedImage && processedImage !== "/placeholder-error.svg" ? (
                <div className="rounded-lg overflow-hidden shadow-lg border border-white/50 dark:border-pink-900/40">
                  <ImageComparison
                    originalImage={originalImage}
                    processedImage={processedImage}
                  />
                </div>
              ) : null}
              {processingTime !== null &&
                processedImage &&
                processedImage !== "/placeholder-error.svg" &&
                !serviceBusy && (
                  <div className="text-center mt-6 font-medium text-lg px-6 py-2 rounded-full bg-gradient-to-r from-pink-500/80 to-pink-600/80 text-white shadow-lg backdrop-blur-md border border-white/30 transition-all hover:scale-[1.02] cursor-default">
                    ¡Procesamiento completado en{" "}
                    {(processingTime / 1000).toFixed(1)} segundos!
                  </div>
                )}
            </div>
          )
        )}
      </div>
      <div className="rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-[var(--secondary)]/70 shadow-xl border border-white/30 dark:border-pink-900/30 p-8 w-full relative overflow-hidden">
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-pink-400/10 dark:bg-pink-800/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -top-8 -left-8 w-36 h-36 bg-pink-300/10 dark:bg-pink-700/10 rounded-full blur-2xl -z-10"></div>
        <ProcessingHistory onSelectImage={handleImageProcessed} />
      </div>
    </div>
  );
}

function ProcessingTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Detectar modo oscuro
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  // Animación caracol SVG
  const progress = Math.min((elapsed % 30000) / 30000, 1); // 0 a 1 en 30s
  const snailX = 24 + progress * 200; // de 24 a 224 px
  const trailWidth = snailX - 24;

  return (
    <div className="mt-4 flex flex-col items-center">
      <div
        className="px-5 py-2.5 rounded-full font-mono text-base shadow-md backdrop-blur-md transition-all"
        style={{
          background: isDark
            ? "rgba(12, 18, 25, 0.7)"
            : "rgba(255, 255, 255, 0.8)",
          color: isDark ? "#ec4899" : "#db2777",
          display: "inline-block",
          fontWeight: 600,
          border: `1.5px solid ${isDark ? "#ec489960" : "#db277760"}`,
          letterSpacing: "0.01em",
          boxShadow: `0 4px 12px ${isDark ? "#ec489930" : "#db277730"}`,
        }}
      >
        {`Tiempo transcurrido: ${(elapsed / 1000).toFixed(1)}s`}
      </div>

      <div className="mt-2 p-2 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-black/5 border border-white/30 dark:border-pink-900/20">
        {/* Usamos el componente SnailIcon extraído */}
        <SnailIcon
          positionX={snailX}
          trailWidth={trailWidth}
          bg={isDark ? "rgba(15, 23, 42, 0.3)" : "rgba(255, 255, 255, 0.5)"}
          color={isDark ? "#ec4899" : "#db2777"}
        />
      </div>
    </div>
  );
}
