# 📚 Índice y Tabla de Contenido de la Documentación

Bienvenido a la documentación del proyecto **Remove Background**. Aquí encontrarás guías, tutoriales y referencias técnicas para trabajar con el monorepo Next.js 15 + Express + Bun.

---

## Tabla de Contenido

1. [Estructura recomendada para una API REST en el monorepo](./07_estructura-api-rest.md)
   - Organización de carpetas y archivos
   - Buenas prácticas
2. [Análisis arquitectónico y control de la comunicación frontend-backend](./api_communication.md#análisis-arquitectónico-y-control-de-la-comunicación-en-el-monorepo)
   - Inspección de la estructura
   - Flujo de comunicación
   - Evaluación de patrones y recomendaciones
3. [Tutorial básico: Lectura y escritura de archivos en Node.js con fs/promises](./01_tutorial-lectura-escritura-archivos.md)
   - Importar el módulo necesario
   - Asegurar la existencia de un directorio
   - Leer un archivo (por ejemplo, una imagen)
   - Escribir un archivo
   - Eliminar un archivo
   - Ejemplo completo: Procesar una imagen
   - Buenas prácticas y advertencias
   - Manejo de rutas de archivos de forma portable
   - Recursos adicionales
4. [📜 Leer archivos en Node.js con ES Modules: ¿Por qué es mejor `URL()` que `path.resolve()`?](./02_abosolute-paths.md)
   - Ventajas de `new URL()` sobre `path.resolve()`
   - Requisitos
   - Ejemplo recomendado
5. [Comandos de Instalación para Remove Background](./03_comandos-instalacion.md)
   - Estructura del Proyecto
   - Comandos para Bash y PowerShell
   - Instalación de dependencias y scripts útiles
6. [Comandos Backend (Express 5)](./04_comandos-backend.md)
   - Iniciar servidor en desarrollo
   - Configuración clave
7. [Comandos Frontend (Next.js 15)](./05_comandos-frontend.md)
   - Desarrollo y alternativas
   - Características clave
8. [Comparativa Técnica: npm vs Bun](./06_comparativa-npm-bun.md)
   - Diferencias clave en el contexto del monorepo
   - Tabla comparativa
9. [Guía de Despliegue en Producción](./08_guia-produccion.md)
   - Variables de entorno
   - Configuración de servidores
   - Configuración en Frontend (Next.js)
   - Configuración en Backend (Express)
   - Diferencias y consideraciones
   - Build optimizado
   - Variables de entorno
   - Configuración de servidores
10. [Banco de Memoria y Progreso del Proyecto](./09_memory-bank.md)
    - Última actualización
    - Checkpoints y progreso
11. [Troubleshooting: Enlaces simbólicos (symlinks) en monorepos Bun](./10_troubleshooting.md)
    - Problemas comunes y soluciones
12. [Convenciones y Buenas Prácticas para Mensajes de Commit](./11_convenciones-mensajes-commit.md)
    - Reglas, ejemplos y recursos
13. [Guía: Persistencia en el backend con SQLite, better-sqlite3 y Prisma](./12_sqlite-prisma-backend.md)
    - Instalación de dependencias
    - Ejemplo con better-sqlite3
    - Ejemplo con Prisma
    - Buenas prácticas y recomendaciones
14. [Guía: Variables de Entorno en el Monorepo](./13_variables-entorno.md)
    - Configuración en Frontend (Next.js)
    - Configuración en Backend (Express)
    - Diferencias y consideraciones

---

# Documentación principal Remove Background

## Arquitectura

- Monorepo Bun
- Frontend Next.js 15 (apps/frontend)
- Backend Express (apps/api)
- Clerk para autenticación (login, registro, recuperación)

## Rutas y autenticación

- `/` — Landing/login (catch-all, Clerk SignIn)
- `/sign-up` — Registro
- `/forgot-password` — Recuperación
- `/dashboard` — Protegida, procesamiento de imágenes

## Middleware Clerk

- Solo protege rutas privadas.
- Excluye `/`, `/sign-up`, `/forgot-password` y variantes.

## Troubleshooting

- Si el login no funciona, revisa que solo exista `[[...rest]]/page.tsx` y no `page.tsx`.
- Si falla el health check, asegúrate de que el backend esté corriendo y el endpoint `/api/health` responda.

## Estructura recomendada

Ver README.md para detalles de carpetas y scripts.

Cada documento contiene ejemplos prácticos, comandos y recomendaciones específicas para el entorno de desarrollo y producción.

> **Sugerencia:** Utiliza este índice como punto de partida para navegar y comprender rápidamente la documentación del proyecto.
