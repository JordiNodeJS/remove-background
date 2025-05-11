// lib/file-system-init.ts
import fs from "fs";
import path from "path";

/**
 * Inicializa los directorios necesarios para la aplicación
 */
export function ensureDirectoriesExist() {
  const requiredDirs = [
    path.join(process.cwd(), "public/images-input"),
    path.join(process.cwd(), "public/images-output"),
    path.join(process.cwd(), "tmp"),
  ];

  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directorio creado: ${dir}`);
    }
  }
}
