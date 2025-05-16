"use client";

import { useState, useEffect, useRef } from "react";
// import Split from "react-split"; // Eliminado
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
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
      {/* Las etiquetas "Original" y "Sin Fondo" pueden ser añadidas por react-compare-image o necesitar un overlay manual si no.
          Por ahora, se eliminan los overlays existentes para evitar duplicidad y se ajustarán según sea necesario. */}
      <ReactCompareImage
        leftImage={originalImage}
        rightImage={processedImage}
        leftImageLabel="Original"
        rightImageLabel="Sin Fondo"
        sliderLineColor="#FFF"
        sliderLineWidth={3}
        leftImageCss={{ height: "100%", objectFit: "scale-down" }}
        rightImageCss={{ height: "100%", objectFit: "scale-down" }}
        vertical={true}
      />
      {/* Botón para descargar la imagen procesada */}
      {processedImage && (
        <a
          href={processedImage}
          download
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition-colors z-20"
          target="_blank"
          rel="noopener noreferrer"
        >
          Descargar imagen sin fondo
        </a>
      )}
      {/* El componente ReactCompareImage puede que ya incluya etiquetas o un método para ellas.
          Se eliminarán los overlays manuales y se ajustará si es necesario.
      */}
      {/* 
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span>Original</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">vs</span>
          <span>Sin Fondo</span>
        </div>
      </div>
      */}
      {/* Ya no se necesita el componente Split ni sus divs hijos directos para las imágenes.
          ReactCompareImage maneja esto internamente.
      */}
      {/* 
      <Split
        className="flex h-[500px]"
        direction="horizontal"
        sizes={[sliderPosition, 100 - sliderPosition]}
        minSize={10}
        expandToMin={false}
        gutterSize={4}
        gutterAlign="center"
        snapOffset={0}
        dragInterval={1}
        onDragEnd={(sizes) => setSliderPosition(sizes[0])}
      >
        <div className="overflow-hidden relative h-full">
          {originalImage && (
            <img
              src={originalImage}
              alt="Imagen Original"
              className="w-full h-full object-contain"
            />
          )}
          <div className="absolute top-0 left-0 bg-black/50 text-white px-2 py-1 text-xs rounded-br-md">
            Original
          </div>
        </div>
        <div className="overflow-hidden relative h-full">
          {processedImage && (
            <>
              <img
                key={processedImage}
                src={processedImage}
                alt="Imagen Procesada"
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error(
                    "Error al cargar imagen procesada:",
                    processedImage
                  );
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = "/placeholder-error.svg";
                  const errorDiv = document.createElement("div");
                  errorDiv.className =
                    "absolute inset-0 flex items-center justify-center bg-black/40";
                  errorDiv.innerHTML =
                    '<p class="text-white bg-red-500 px-3 py-2 rounded">Error al cargar imagen procesada</p>';
                  target.parentElement?.appendChild(errorDiv);
                }}
              />
              <div className="absolute top-0 right-0 bg-black/50 text-white px-2 py-1 text-xs rounded-bl-md">
                Sin Fondo
              </div>
            </>
          )}
        </div>
      </Split>
      */}
      {/* El mensaje "Desliza para comparar" puede ser redundante si el handle del slider es obvio.
          Se puede mantener o eliminar según la preferencia visual. Por ahora lo comentaré.
      */}
      {/* 
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
          Desliza para comparar
        </div>
      </div>
      */}
    </div>
  );
}
