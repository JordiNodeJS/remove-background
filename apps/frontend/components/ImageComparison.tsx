"use client";

import { useState, useEffect, useRef } from "react";
import Split from "react-split";

interface ImageComparisonProps {
  originalImage: string | null;
  processedImage: string | null;
}

export default function ImageComparison({
  originalImage,
  processedImage,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
      <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
          <span>Original</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">vs</span>
          <span>Sin Fondo</span>
        </div>
      </div>
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
            <img
              src={processedImage}
              alt="Imagen Procesada"
              className="w-full h-full object-contain"
            />
          )}
          <div className="absolute top-0 right-0 bg-black/50 text-white px-2 py-1 text-xs rounded-bl-md">
            Sin Fondo
          </div>
        </div>
      </Split>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs">
          Desliza para comparar
        </div>
      </div>
    </div>
  );
}
