"use client";

import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

interface ImageComparisonProps {
  originalImage: string | null;
  processedImage: string | null;
}

export default function ImageComparison({
  originalImage,
  processedImage,
}: ImageComparisonProps) {
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

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
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-background shadow-lg flex items-center justify-center">
      {/* Etiquetas flotantes para las imágenes */}
      <span className="absolute left-6 top-4 z-20 bg-white/90 dark:bg-green-900/90 text-green-900 dark:text-green-100 font-bold px-4 py-1 rounded-full shadow text-base tracking-tight border border-green-200 dark:border-green-800 select-none pointer-events-none">
        Original
      </span>
      <span className="absolute right-6 bottom-20 z-20 bg-green-600 text-white font-bold px-4 py-1 rounded-full shadow text-base tracking-tight border border-green-700 select-none pointer-events-none">
        Sin fondo
      </span>
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={originalImage}
            alt="Original"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
              background: "#f1f5f9",
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
              background: isDark ? "#000000" : "#ffffff",
            }}
          />
        }
        style={{
          width: "100%",
          height: 400,
          borderRadius: 16,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
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
