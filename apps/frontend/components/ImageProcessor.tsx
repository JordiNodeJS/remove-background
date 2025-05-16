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
    console.log(
      "ImageProcessor: handleImageProcessed -> Original:",
      originalUrl,
      "Procesada:",
      processedUrl
    );
    setOriginalImage(originalUrl);
    setProcessedImage(processedUrl);

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
            </div>
          </div>
        ) : (
          <div className="card">
            <ImageComparison
              originalImage={originalImage}
              processedImage={processedImage}
            />
          </div>
        )}
        <div className="card">
          <ProcessingHistory onSelectImage={handleImageProcessed} />
        </div>
      </div>
    </div>
  );
}
