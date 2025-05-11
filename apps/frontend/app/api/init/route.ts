// app/api/init/route.ts
// Este endpoint se ejecuta al iniciar la aplicación para asegurarse de que todas las carpetas necesarias existan

import { NextResponse } from "next/server";
import { ensureDirectoriesExist } from "@/lib/file-system-init";

// Configuración para forzar que esta ruta sea dinámica y no se ponga en caché
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// En Next.js 15, es importante exportar métodos HTTP específicos
export async function GET() {
  try {
    ensureDirectoriesExist();
    return NextResponse.json({
      status: "ok",
      message: "Directorios inicializados correctamente",
    });
  } catch (error) {
    console.error("Error al inicializar directorios:", error);
    return NextResponse.json(
      { status: "error", message: "Error al inicializar directorios" },
      { status: 500 }
    );
  }
}