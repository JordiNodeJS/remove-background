"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import { useState, useEffect } from "react"; // Import useState and useEffect

interface ImageComparisonProps {
  originalImage: string | null;
  processedImage: string | null;
}

export default function ImageComparison({
  originalImage,
  processedImage,
}: ImageComparisonProps) {
  // const isDark =
  //   typeof window !== "undefined" &&
  //   document.documentElement.classList.contains("dark");

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Ensure window is defined (runs only on client-side)
    if (typeof window !== "undefined") {
      const observer = new MutationObserver(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
      });

      // Initial check
      setIsDark(document.documentElement.classList.contains("dark"));

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  if (!originalImage || !processedImage) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          Carga una imagen para ver la comparación
        </p>
      </div>
    );
  }
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden relative flex items-center justify-center backdrop-blur-md bg-white/20 dark:bg-[var(--secondary)]/30">
      {/* Etiquetas flotantes para las imágenes con diseño neumórfico */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-30 px-4 py-2 rounded-2xl font-semibold text-base tracking-wide select-none pointer-events-none flex items-center gap-2 border shadow-lg"
        style={{
          background: isDark
            ? "rgba(30,34,54,0.96)"
            : "rgba(255,255,255,0.98)",
          color: isDark ? "#fff" : "#1a1d2d",
          borderColor: isDark ? "#3b4252" : "#cbd5e1",
          textShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.32)"
            : "0 1px 4px rgba(0,0,0,0.10)",
          boxShadow:
            "0 6px 32px 0 rgba(0,0,0,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.13)",
        }}
      >
        <span className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400/80 to-emerald-500/80 border border-white/60 shadow-inner"></span>
        <span>Original</span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 px-4 py-2 rounded-2xl font-semibold text-base tracking-wide select-none pointer-events-none flex items-center gap-2 border shadow-lg"
        style={{
          background: isDark
            ? "rgba(30,34,54,0.96)"
            : "rgba(255,255,255,0.98)",
          color: isDark ? "#fff" : "#1e40af",
          borderColor: isDark ? "#3b4252" : "#93c5fd",
          textShadow: isDark
            ? "0 2px 8px rgba(0,0,0,0.32)"
            : "0 1px 4px rgba(0,0,0,0.10)",
          boxShadow:
            "0 6px 32px 0 rgba(0,0,0,0.13), 0 1.5px 8px 0 rgba(255,255,255,0.13)",
        }}
      >
        <span>Sin fondo</span>
        <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400/80 to-indigo-500/80 border border-white/60 shadow-inner"></span>
      </div>
      <div className="absolute right-4 top-4 z-30 px-3 py-1.5 bg-gradient-to-r from-[var(--primary)]/90 to-[var(--primary-hover)]/90 rounded-lg text-white font-semibold shadow-lg text-sm tracking-wide border border-white/20 select-none pointer-events-none backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span>Sin fondo</span>
          <span className="size-2.5 rounded-full bg-white/70"></span>
        </div>
      </div>{" "}
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={originalImage}
            alt="Original"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(45deg, ${
                isDark ? "#1a1d2d" : "#f1f8f4"
              }, ${isDark ? "#162230" : "#f8f5f1"})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={processedImage}
            alt="Sin fondo"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              backgroundImage: isDark
                ? "linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.2) 1px, transparent 1px)"
                : "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundColor: isDark ? "#111" : "#fff",
              backgroundSize: "20px 20px",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
          />
        }
        style={{
          width: "100%",
          height: 400,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow:
            "0 4px 24px 0 rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.1)",
        }}
        handle={
          <div
            style={{
              width: 32,
              height: 32,
              background: "#2563eb",
              borderRadius: "50%",
              border: "3px solid #fff",
              boxShadow: "0 2px 8px #0002",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "ew-resize",
              zIndex: 50,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <circle
                cx="9"
                cy="9"
                r="8"
                fill="#2563eb"
                stroke="#fff"
                strokeWidth="2"
              />
              <rect x="8" y="4" width="2" height="10" rx="1" fill="#fff" />
            </svg>
          </div>
        }
        position={50}
        onlyHandleDraggable
        changePositionOnHover={false}
      />
      {processedImage && (
        <a
          href={processedImage}
          download
          className="absolute bottom-4 right-4 btn-download shadow-xl text-base px-6 py-3 flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 16.5a1 1 0 0 1-1-1V6.91l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 1 1-1.4 1.42l-2.3-2.3v8.59a1 1 0 0 1-1 1Z"
            />
            <path
              fill="currentColor"
              d="M5 18a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2H5Z"
            />
          </svg>
          Descargar imagen sin fondo
        </a>
      )}
    </div>
  );
}
