"use client";

import { useState, useRef } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          const imgTest = new Image();
          const timeoutId = setTimeout(() => {
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
        onClick={() => fileInputRef.current?.click()}
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-4 px-6 rounded-lg border-2 border-dashed 
          ${
            isLoading
              ? "bg-gray-100 border-gray-300 text-gray-400"
              : "bg-white border-blue-500 text-blue-600 dark:bg-gray-800 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 hover:dark:bg-gray-700 transition-colors"
          }`}
      >
        <FiUpload className="mr-2" size={20} />
        {isLoading ? "Procesando..." : "Subir imagen para quitar fondo"}
      </button>
      <p className="text-sm text-gray-500 mt-2 text-center dark:text-gray-400">
        Solo formatos JPG y PNG. Tamaño máximo: 10MB
      </p>
    </div>
  );
}
