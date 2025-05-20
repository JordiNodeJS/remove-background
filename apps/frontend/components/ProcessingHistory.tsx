"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Import Next.js Image component
import toast from "react-hot-toast";
import { FiClock, FiImage } from "react-icons/fi";
import "../lib/events"; // Importamos los tipos para el evento personalizado

interface HistoryItem {
  originalUrl: string;
  processedUrl: string;
  date: string;
  hasError?: boolean;
}

interface ProcessingHistoryProps {
  onSelectImage: (originalUrl: string, processedUrl: string) => void;
}

export default function ProcessingHistory({
  onSelectImage,
}: ProcessingHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Cargar historial desde localStorage al montar el componente
    try {
      const savedHistory = localStorage.getItem("imageProcessingHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Error loading history:", error);
      toast.error("Error al cargar el historial");
    }
  }, []);

  // Wrap addToHistory in useCallback to prevent it from changing on every render
  const addToHistory = useCallback(
    (originalUrl: string, processedUrl: string, hasError: boolean = false) => {
      const newItem: HistoryItem = {
        originalUrl,
        processedUrl,
        date: new Date().toLocaleString(),
        hasError,
      };

      const updatedHistory = [newItem, ...history].slice(0, 10); // Limitamos a 10 elementos
      setHistory(updatedHistory);

      try {
        localStorage.setItem(
          "imageProcessingHistory",
          JSON.stringify(updatedHistory)
        );
      } catch (error) {
        console.error("Error saving history:", error);
      }
    },
    [history] // Add history as a dependency
  );

  useEffect(() => {
    // Registrar un listener global para capturar nuevas imágenes procesadas
    const handleImageProcessed = (
      event: CustomEvent<{
        originalUrl: string;
        processedUrl: string;
        hasError?: boolean;
      }>
    ) => {
      addToHistory(
        event.detail.originalUrl,
        event.detail.processedUrl,
        event.detail.hasError
      );
    };

    window.addEventListener(
      "imageProcessed",
      handleImageProcessed as EventListener
    );

    return () => {
      window.removeEventListener(
        "imageProcessed",
        handleImageProcessed as EventListener
      );
    };
  }, [history, addToHistory]);

  if (history.length === 0) return null;
  return (
    <div className="mt-8 border rounded-lg p-4 bg-white dark:bg-[#0c1219] border-white/20 dark:border-pink-900/30">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        {" "}
        <div className="flex items-center gap-2">
          <FiClock className="text-pink-500 dark:text-pink-400" />
          <h3 className="font-semibold text-base text-gray-700 dark:text-gray-200 tracking-tight">
            Historial de imágenes ({history.length})
          </h3>
        </div>
        <button className="text-sm font-semibold px-3 py-1 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-[#18283e] dark:text-pink-300 dark:hover:bg-[#1a2c3f] transition-colors">
          {expanded ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl overflow-hidden cursor-pointer hover:border-pink-500 transition-colors bg-gray-50 dark:bg-[#0c1219] shadow-sm group border-white/30 dark:border-pink-900/30"
              onClick={() => {
                onSelectImage(item.originalUrl, item.processedUrl);
              }}
            >
              <div className="aspect-square relative flex items-center justify-center">
                <FiImage
                  size={28}
                  className="text-blue-200 group-hover:text-blue-400 absolute z-10 left-2 top-2"
                />
                {/* Use Next.js Image component for optimization */}
                <Image
                  src={item.processedUrl}
                  alt={`Processed image ${index}`}
                  fill // Use fill to cover the parent div
                  style={{ objectFit: "cover" }} // Use style prop for object-fit
                  className="rounded-t-xl" // Apply border radius
                  onError={(e) => {
                    // Handle error by hiding the image if it fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
                {item.hasError && (
                  <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-tl-xl shadow z-20">
                    {" "}
                    {/* Add z-index to ensure it's above the image */}
                    Error
                  </div>
                )}
              </div>
              <div className="p-2 text-xs text-gray-700 dark:text-gray-300 flex justify-between items-center font-medium">
                <span className="truncate max-w-[70%]">{item.date}</span>
                {item.hasError && (
                  <span className="text-red-500 font-bold">
                    Procesamiento fallido
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
