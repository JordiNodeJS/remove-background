"use client";

import { useState, useRef, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { z } from "zod";

interface UploadButtonProps {
  onImageProcessed: (originalUrl: string, processedUrl: string) => void;
  onLoading: (loading: boolean) => void;
}

// Definimos el esquema de validación para el archivo
const imageSchema = z
  .instanceof(File)
  .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
    message: "Solo se permiten archivos JPEG y PNG",
  });

export default function UploadButton({
  onImageProcessed,
  onLoading,
}: UploadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [backendBusy, setBackendBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consulta periódica al backend para saber si está ocupado
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/processing-status");
        const data = await res.json();
        setBackendBusy(Boolean(data.processing));
      } catch {
        setBackendBusy(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validamos que el archivo sea una imagen de tipo permitido
      imageSchema.parse(file);

      setIsLoading(true);
      onLoading(true);

      // Creamos el FormData para enviarlo al servidor
      const formData = new FormData();
      formData.append("image", file); // Enviamos la imagen al servidor
      // Podemos alternar entre el endpoint real y el mock según necesidad
      const apiEndpoint =
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
          ? "/api/mock-remove-background"
          : "/api/remove-background";

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      // Manejo especial para la cola: 429 = servicio ocupado
      if (response.status === 429) {
        let errorJson: { message: string; lastProcessingTime?: number };
        try {
          errorJson = await response.json();
        } catch {
          errorJson = {
            message:
              "El servicio está ocupado. Intenta de nuevo en unos segundos.",
          };
        }
        let extra = "";
        if (typeof errorJson.lastProcessingTime === "number") {
          extra = `\nÚltima imagen procesada en ${(
            errorJson.lastProcessingTime / 1000
          ).toFixed(1)} segundos.`;
        }
        toast.error(`${errorJson.message}${extra}`, { duration: 7000 });
        setIsLoading(false);
        onLoading(false);
        setCooldown(true);
        setTimeout(() => setCooldown(false), 4000); // 4 segundos de espera
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }
      const result = await response.json();
      if (result.status === 200) {
        // Creamos una URL para la imagen original
        const originalImageUrl = URL.createObjectURL(file);

        console.log("URL de imagen procesada recibida:", result.data.url);

        // Verificar que la URL de la imagen procesada es válida
        if (!result.data || !result.data.url) {
          toast.error(
            "La respuesta del servidor no incluye la URL de la imagen procesada"
          );
          throw new Error("Respuesta de servidor inválida");
        }
        // Notificamos el mensaje del servidor (puede incluir información sobre fallbacks)
        if (result.message.includes("no se pudo")) {
          toast.error(result.message, { duration: 5000 });
        } else {
          toast.success(result.message || "Imagen procesada correctamente");
        }

        // Verificar que la URL de la imagen procesada es cargable
        try {
          const imgTest = new window.Image();
          const timeoutId = window.setTimeout(() => {
            // Si la imagen tarda más de 5 segundos, asumimos un error
            toast.error("Tiempo de espera agotado cargando la imagen", {
              duration: 5000,
            });
            onImageProcessed(originalImageUrl, result.data.url);
          }, 5000);

          imgTest.onload = () => {
            clearTimeout(timeoutId);
            console.log("Imagen procesada cargada correctamente");
            onImageProcessed(originalImageUrl, result.data.url);
          };

          imgTest.onerror = () => {
            clearTimeout(timeoutId);
            // Si la imagen da error, mostramos un mensaje pero igual actualizamos con la URL
            console.error(
              "Error al cargar la imagen procesada:",
              result.data.url
            );
            toast.error("La imagen procesada no se pudo cargar correctamente", {
              duration: 5000,
            });
            // Intentamos usar un placeholder
            onImageProcessed(originalImageUrl, "/placeholder-error.svg");
          };

          imgTest.src = result.data.url;
        } catch (err) {
          console.error("Error al verificar la imagen procesada:", err);
          onImageProcessed(originalImageUrl, "/placeholder-error.svg");
        }
      } else {
        throw new Error(result.message || "Error desconocido");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Solo se permiten archivos JPEG y PNG");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error al procesar la imagen");
      }
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        id="image-upload"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png"
        hidden
      />
      <button
        onClick={() => {
          if (!isLoading && !cooldown && !backendBusy) fileInputRef.current?.click();
        }}
        disabled={isLoading || cooldown || backendBusy}
        className={`btn-primary w-full flex items-center justify-center gap-2 text-lg shadow-xl relative overflow-hidden transition-transform duration-200 active:scale-95 ${
          isLoading || cooldown || backendBusy
            ? "opacity-60 cursor-not-allowed"
            : "hover:scale-[1.03]"
        }`}
        style={{
          background: undefined,
          color: isLoading || cooldown || backendBusy ? "#e5d3c0" : "#fff",
        }}
      >
        <span className="absolute left-0 top-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_30%_30%,#fff_0%,transparent_70%)] pointer-events-none" />
        <FiUpload size={22} />
        {isLoading
          ? "Procesando..."
          : cooldown
          ? "Espera a que el servidor esté libre..."
          : backendBusy
          ? "Servidor ocupado procesando otra imagen..."
          : "Subir imagen para quitar fondo"}
      </button>
      {cooldown && (
        <div className="text-center text-yellow-700 dark:text-yellow-400 mt-2 text-base font-medium">
          El servidor está ocupado procesando otra imagen. Espera unos segundos...
        </div>
      )}
      {backendBusy && !isLoading && !cooldown && (
        <div className="text-center text-yellow-700 dark:text-yellow-400 mt-2 text-base font-medium">
          El servidor está ocupado procesando otra imagen. Intenta de nuevo en unos
          segundos.
        </div>
      )}
      <p className="text-muted mt-3 text-center text-base">
        Solo formatos JPG y PNG. Tamaño máximo: 10MB
      </p>
    </div>
  );
}
