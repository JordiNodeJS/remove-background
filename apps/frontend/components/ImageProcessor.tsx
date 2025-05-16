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
              <TypewriterProcessingMessage />
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

function TypewriterProcessingMessage() {
  const fullText =
    "Por favor, espera un momento mientras procesamos tu imagen.\nEsto puede tardar unos segundos dependiendo del tamaño de la imagen y la carga del servidor. En caso de que el procesamiento tarde más de lo esperado, alrededor de 30 segundos, intenta subir una imagen diferente o vuelve a intentarlo.";
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const totalDuration = 15000; // 15 segundos
    const interval = totalDuration / fullText.length;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  // Detectar modo oscuro usando la clase de Tailwind en <html>
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const bg = isDark
    ? "linear-gradient(90deg, #1e293b 80%, #334155 100%)" // slate-800 a slate-700
    : "linear-gradient(90deg, #fff 80%, #f1f5f9 100%)"; // blanco a slate-100
  const borderColor = isDark ? "#334155" : "#cbd5e1"; // slate-700 o slate-300

  return (
    <p
      className="text-sm whitespace-pre-line px-4 py-2 rounded-lg font-mono tracking-wide animate-fade-in"
      style={{
        minHeight: 90,
        letterSpacing: "0.01em",
        fontSize: "1.05em",
        background: bg,
        borderLeft: `4px solid ${borderColor}`,
        border: `1.5px solid ${borderColor}`,
        marginTop: 8,
        marginBottom: 8,
        boxShadow: isDark
          ? "0 2px 12px 0 rgba(0,0,0,0.25)"
          : "0 2px 12px 0 rgba(0,0,0,0.10)",
        color: isDark ? "#e0e7ef" : "#334155", // slate-100 o slate-700
        width: "fit-content",
        maxWidth: "100%",
        transition: "width 0.2s",
        display: "inline-block",
      }}
    >
      {displayed}
      <span
        className="inline-block animate-pulse"
        style={{ color: isDark ? "#38bdf8" : "#2563eb" }}
      >
        |
      </span>
    </p>
  );
}
