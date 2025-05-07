# 12. Guía: Persistencia en el backend con SQLite, better-sqlite3 y Prisma

Esta guía explica cómo implementar persistencia de datos en el backend Express (`apps/api`) usando dos enfoques: acceso directo con `better-sqlite3` y acceso mediante ORM con Prisma.

---

## Índice

1. Instalación de dependencias
2. Ejemplo con better-sqlite3
3. Ejemplo con Prisma
4. Buenas prácticas y recomendaciones

---

## 1. Instalación de dependencias

### Opción A: better-sqlite3

```sh
bun add better-sqlite3 --workspace=apps/api
```

Si usas TypeScript:

```sh
bun add -d @types/better-sqlite3 --workspace=apps/api
```

> **Recomendación:** La base de datos debe guardarse fuera del código fuente, por ejemplo en `apps/api/data/images.db`. Si la carpeta `data` no existe, créala manualmente.

### Opción B: Prisma + SQLite

```sh
bun add prisma @prisma/client --workspace=apps/api
```

Inicializa Prisma:

```sh
cd apps/api
bunx prisma init --datasource-provider sqlite
```

---

## 2. Ejemplo de uso con better-sqlite3

Crea el servicio en `apps/api/src/services/db.service.ts`:

```typescript
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Ruta recomendada para la base de datos
const dbDir = path.resolve(__dirname, "../../data");
const dbPath = path.join(dbDir, "images.db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS processed_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export function saveProcessedImage(filename: string) {
  const stmt = db.prepare("INSERT INTO processed_images (filename) VALUES (?)");
  stmt.run(filename);
}

export function getProcessedImages() {
  return db
    .prepare("SELECT * FROM processed_images ORDER BY processed_at DESC")
    .all();
}
```

### Ejemplo de uso en un controlador

Supón que tienes un controlador en `apps/api/src/controllers/remove-background.controller.ts`:

```typescript
import { saveProcessedImage, getProcessedImages } from "../services/db.service";

// Guardar un archivo procesado
default async function handleProcessedFile(filename: string) {
  saveProcessedImage(filename);
}

// Obtener archivos procesados
default async function listProcessedFiles() {
  return getProcessedImages();
}
```

---

## 3. Ejemplo de uso con Prisma

1. Edita `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model ProcessedImage {
  id          Int      @id @default(autoincrement())
  filename    String
  processedAt DateTime @default(now())
}
```

2. Ejecuta la migración y genera el cliente:

```sh
bunx prisma migrate dev --name init
bunx prisma generate
```

3. Usa Prisma en tu servicio:

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function saveProcessedImage(filename: string) {
  return prisma.processedImage.create({ data: { filename } });
}

export async function getProcessedImages() {
  return prisma.processedImage.findMany({ orderBy: { processedAt: "desc" } });
}
```

---

## 4. Buenas prácticas y recomendaciones

- Usa better-sqlite3 para operaciones simples y alto rendimiento sin ORM.
- Usa Prisma si prefieres tipado fuerte, migraciones y relaciones complejas.
- Mantén la base de datos fuera de la carpeta de código fuente (por ejemplo, en `/data` o `apps/api/data`).
- **Agrega `/data/*.db` y/o `apps/api/data/*.db` a tu `.gitignore` para evitar subir archivos de base de datos.**
- En desarrollo, puedes usar rutas relativas; en producción, asegúrate de tener backups y rutas absolutas si es necesario.
- Para probar la integración, crea un test en `apps/api/src/__tests__/db.service.test.ts` que verifique la inserción y consulta de registros.

---

**Referencias:**

- [better-sqlite3 docs](https://github.com/WiseLibs/better-sqlite3)
- [Prisma docs](https://www.prisma.io/docs)
