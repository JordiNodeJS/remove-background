"use client";

import { useState, useRef, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";
import UploadButton from "./UploadButton";
import ImageComparison from "./ImageComparison";
import ProcessingHistory from "./ProcessingHistory";

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
    <div className="w-full max-w-4xl mx-auto">
      <Toaster position="top-center" />

      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2 text-center"
          style={{ letterSpacing: "-1px" }}
        >
          Eliminador de fondos
        </h1>
        <p className="text-muted text-lg text-center font-medium max-w-2xl mx-auto">
          Sube una imagen y automáticamente eliminaremos el fondo para ti. ¡Haz
          magia con tus fotos en un solo clic!
        </p>
      </div>
      <div className="space-y-8">
        <div className="card">
          <UploadButton
            onImageProcessed={handleImageProcessed}
            onLoading={setIsLoading}
          />
        </div>
        {showBusyMessage ? (
          <div className="w-full h-[400px] flex items-center justify-center card bg-red-50 dark:bg-red-900/30">
            <div className="flex flex-col items-center">
              <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-4 text-red-500"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z"/></svg>
              <p className="text-red-700 dark:text-red-200 font-semibold text-lg text-center">No se puede procesar la imagen porque el servicio está ocupado. Por favor, inténtalo de nuevo en unos minutos.</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center card">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-muted font-medium">Procesando imagen...</p>
              <ProcessingTimer />
            </div>
          </div>
        ) : (
          <div className="card">
            {processedImage && processedImage !== "/placeholder-error.svg" ? (
              <ImageComparison
                originalImage={originalImage}
                processedImage={processedImage}
              />
            ) : null}
            {processingTime !== null &&
              processedImage &&
              processedImage !== "/placeholder-error.svg" &&
              !serviceBusy && (
                <div
                  className="text-center mt-4 font-extralight text-lg"
                  style={{
                    color: "#059669",
                    background: "#fff",
                    borderRadius: 8,
                    display: "inline-block",
                    padding: "0.25em 1em",
                    border: "2px solid #059669",
                    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
                    textShadow:
                      "0 1px 2px #fff, 0 0px 2px #059669, 0 0px 1px #000",
                  }}
                >
                  ¡Procesamiento completado en{" "}
                  {(processingTime / 1000).toFixed(1)} segundos!
                </div>
              )}
          </div>
        )}
      </div>
      <div className="card">
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
  const bg = isDark ? "#1e293b" : "#f1f5f9";
  const color = isDark ? "#38bdf8" : "#2563eb";

  // Animación caracol SVG
  const progress = Math.min((elapsed % 30000) / 30000, 1); // 0 a 1 en 30s
  const snailX = 24 + progress * 200; // de 24 a 224 px
  const trailWidth = snailX - 24;

  return (
    <div className="mt-2 flex flex-col items-center">
      <div
        className="px-4 py-2 rounded font-mono text-base shadow"
        style={{
          background: bg,
          color,
          display: "inline-block",
          fontWeight: 600,
          border: `1.5px solid ${color}`,
          letterSpacing: "0.01em",
        }}
      >
        {`Tiempo transcurrido: ${(elapsed / 1000).toFixed(1)}s`}
      </div>
      <svg width="240" height="32" viewBox="0 0 240 32" fill="none" className="mt-2">
        <rect x="24" y="14" width={trailWidth} height="4" rx="2" fill={color} opacity="0.2" />
        <circle cx={snailX} cy="16" r="8" fill={color} />
        <circle cx={snailX - 4} cy="14" r="2" fill={bg} />
        <circle cx={snailX + 4} cy="14" r="2" fill={bg} />
        <ellipse cx={snailX} cy="20" rx="3" ry="1.5" fill={bg} />
      </svg>
    </div>
  );
}
