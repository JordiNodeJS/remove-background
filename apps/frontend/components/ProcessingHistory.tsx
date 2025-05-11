"use client";

import { useState, useEffect } from "react";
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
  const addToHistory = (
    originalUrl: string,
    processedUrl: string,
    hasError: boolean = false
  ) => {
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
  }; // Exponer método para agregar al historial
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
    <div className="mt-8 border rounded-lg p-4 bg-white dark:bg-gray-800">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <FiClock className="text-blue-500" />
          <h3 className="font-medium">
            Historial de imágenes ({history.length})
          </h3>
        </div>
        <button className="text-sm text-blue-500 hover:underline">
          {expanded ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => onSelectImage(item.originalUrl, item.processedUrl)}
            >
              {" "}
              <div className="aspect-square relative bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <FiImage size={24} className="text-gray-400" />
                <img
                  src={item.processedUrl}
                  alt={`Processed image ${index}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {item.hasError && (
                  <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-tl-md">
                    Error
                  </div>
                )}
              </div>
              <div className="p-2 text-xs text-gray-500 flex justify-between">
                <span>{item.date}</span>
                {item.hasError && (
                  <span className="text-red-500">Procesamiento fallido</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
