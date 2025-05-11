"use client";

import { useState } from "react";
import { Toaster } from "react-hot-toast";
import UploadButton from "./UploadButton";
import ImageComparison from "./ImageComparison";
import ProcessingHistory from "./ProcessingHistory";

export default function ImageProcessor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageProcessed = (originalUrl: string, processedUrl: string) => {
    setOriginalImage(originalUrl);
    setProcessedImage(processedUrl);

    // Dispara un evento personalizado para notificar al componente de historial
    const event = new CustomEvent("imageProcessed", {
      detail: { originalUrl, processedUrl },
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Toaster position="top-center" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Eliminador de fondos</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Sube una imagen y automáticamente eliminaremos el fondo
        </p>
      </div>
      <div className="space-y-8">
        <UploadButton
          onImageProcessed={handleImageProcessed}
          onLoading={setIsLoading}
        />

        {isLoading ? (
          <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">
                Procesando imagen...
              </p>
            </div>
          </div>
        ) : (
          <ImageComparison
            originalImage={originalImage}
            processedImage={processedImage}
          />
        )}

        {/* Componente de historial de imágenes procesadas */}
        <ProcessingHistory onSelectImage={handleImageProcessed} />
      </div>
    </div>
  );
}
