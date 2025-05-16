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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const handleImageProcessed = (originalUrl: string, processedUrl: string) => {
    console.log(
      "ImageProcessor: handleImageProcessed -> Original:",
      originalUrl,
      "Procesada:",
      processedUrl
    );
    setOriginalImage(originalUrl);
    setProcessedImage(processedUrl);

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
        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center card">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-muted font-medium">Procesando imagen...</p>
              <ProcessingTimer />
            </div>
          </div>
        ) : (
          <div className="card">
            <ImageComparison
              originalImage={originalImage}
              processedImage={processedImage}
            />
            {processingTime !== null &&
              processedImage &&
              processedImage !== "/placeholder-error.svg" && (
                <div
                  className="text-center mt-4 font-extralight text-lg"
                  style={{
                    color: "#059669",
                    background: "#fff", // fondo blanco sólido
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
        <div className="card">
          <ProcessingHistory onSelectImage={handleImageProcessed} />
        </div>
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
          minWidth: 180,
          textAlign: "center",
          marginTop: 8,
        }}
      >
        Tiempo transcurrido: {(elapsed / 1000).toFixed(1)}s
      </div>
      <svg
        width={250}
        height={48}
        viewBox="0 0 250 48"
        className="mt-2"
        style={{ maxWidth: 250 }}
      >
        {/* Rastro */}
        <rect
          x="24"
          y="32"
          width={trailWidth}
          height="6"
          rx="3"
          fill="#a3e635"
          opacity="0.5"
        />
        {/* Caracol (simple, estilizado) */}
        <g transform={`translate(${snailX}, 24)`}>
          {/* Cuerpo */}
          <ellipse cx="0" cy="8" rx="12" ry="8" fill="#a3e635" />
          {/* Concha */}
          <circle cx="-6" cy="4" r="7" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
          {/* Espiral de la concha */}
          <path d="M-6 4 q2 2 0 4 q-2 2 0 4" stroke="#b45309" strokeWidth="1.2" fill="none" />
          {/* Ojos */}
          <ellipse cx="7" cy="0" rx="2" ry="4" fill="#a3e635" />
          <ellipse cx="-7" cy="0" rx="2" ry="4" fill="#a3e635" />
          <circle cx="7" cy="-2" r="1" fill="#222" />
          <circle cx="-7" cy="-2" r="1" fill="#222" />
        </g>
      </svg>
    </div>
  );
}
