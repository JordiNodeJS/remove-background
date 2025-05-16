"use client";

// import { useState, useEffect, useRef } from "react";
import ReactCompareImage from "react-compare-image"; // Añadido

interface ImageComparisonProps {
  originalImage: string | null;
  processedImage: string | null;
}

export default function ImageComparison({
  originalImage,
  processedImage,
}: ImageComparisonProps) {
  // const [sliderPosition, setSliderPosition] = useState(50); // Eliminado
  // const containerRef = useRef<HTMLDivElement>(null); // Eliminado

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
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative bg-white dark:bg-[#18181b] shadow-lg flex items-center justify-center">
      {/* Etiquetas flotantes para las imágenes */}
      <span className="absolute left-6 top-4 z-20 bg-white/90 dark:bg-gray-900/90 text-blue-700 dark:text-blue-200 font-bold px-4 py-1 rounded-full shadow text-base tracking-tight border border-blue-100 dark:border-blue-900 select-none pointer-events-none">
        Original
      </span>
      <span className="absolute right-6 bottom-4 z-20 bg-blue-600 text-white font-bold px-4 py-1 rounded-full shadow text-base tracking-tight border border-blue-700 select-none pointer-events-none">
        Sin fondo
      </span>
      <ReactCompareImage
        leftImage={originalImage}
        rightImage={processedImage}
        sliderLineColor="#2563eb"
        sliderLineWidth={4}
        leftImageCss={{
          height: "100%",
          objectFit: "scale-down",
          background: "#f1f5f9",
        }}
        rightImageCss={{
          height: "100%",
          objectFit: "scale-down",
          background: "#f1f5f9",
        }}
        vertical={true}
      />
      {processedImage && (
        <a
          href={processedImage}
          download
          className="absolute bottom-4 right-4 btn-secondary shadow-xl text-base px-6 py-3 rounded-full bg-gradient-to-r from-blue-400 via-blue-600 to-blue-500 text-white font-bold border-0 hover:from-blue-500 hover:to-blue-700 hover:scale-105 transition-transform duration-200 flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
          style={{ boxShadow: '0 4px 24px #2563eb33' }}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16.5a1 1 0 0 1-1-1V6.91l-2.3 2.3a1 1 0 1 1-1.4-1.42l4-4a1 1 0 0 1 1.4 0l4 4a1 1 0 1 1-1.4 1.42l-2.3-2.3v8.59a1 1 0 0 1-1 1Z"/><path fill="currentColor" d="M5 18a1 1 0 0 1 0-2h14a1 1 0 1 1 0 2H5Z"/></svg>
          Descargar imagen sin fondo
        </a>
      )}
    </div>
  );
}
