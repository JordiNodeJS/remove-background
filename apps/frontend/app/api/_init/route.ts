// app/api/_init/route.ts
// Este endpoint se ejecuta al iniciar la aplicación para asegurarse de que todas las carpetas necesarias existan
import { NextRequest, NextResponse } from "next/server";
import { ensureDirectoriesExist } from "@/lib/file-system-init";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
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
