
**Recordatorio importante:**

Para que las aplicaciones funcionen correctamente, es imprescindible definir las variables de entorno necesarias en los archivos `.env` correspondientes de cada app:
- `apps/frontend/.env` para el frontend (Next.js)
- `apps/api/.env` para el backend (Express)

Asegúrate de crear y mantener estos archivos con las variables requeridas antes de ejecutar cada aplicación.

En este monorepo, donde se tiene una aplicación frontend (Next.js) y una API backend (Express), cada una maneja sus propias variables de entorno de forma independiente. Aquí te explico cómo funciona generalmente:

### Variables de Entorno del Frontend (Next.js en `apps/frontend`)

*   **Carga de archivos `.env`**: Next.js tiene un sistema incorporado para cargar variables de entorno desde archivos `.env` en la raíz de la aplicación frontend (`apps/frontend/.env`, `apps/frontend/.env.local`, etc.).
*   **Prefijo `NEXT_PUBLIC_`**: Para que una variable de entorno esté disponible en el código del navegador (cliente), debe tener el prefijo `NEXT_PUBLIC_`. Por ejemplo, `NEXT_PUBLIC_API_URL=http://localhost:3000/api`.
*   **Variables del lado del servidor (Node.js en Next.js)**: Las variables sin el prefijo `NEXT_PUBLIC_` solo están disponibles en el entorno de Node.js de Next.js (por ejemplo, durante la compilación, en rutas API de Next.js, o en funciones `getServerSideProps` / `getStaticProps`).
*   **Proceso de compilación**: Durante el proceso de compilación de Next.js, estas variables se empaquetan o se hacen disponibles según su prefijo y uso.

### Variables de Entorno del Backend (Express en `apps/api`)

*   **Carga de archivos `.env`**: Tu aplicación Express (que se ejecuta con Bun en tu caso) normalmente usa una librería como `dotenv` para cargar variables de entorno desde un archivo `.env` ubicado en la raíz de la aplicación backend (`apps/api/.env`).
*   **Disponibilidad**: Estas variables están disponibles solo para el proceso del servidor backend. El frontend no tiene acceso directo a ellas, a menos que el backend las exponga explícitamente a través de una API.

### ¿Cómo se diferencian?

La diferenciación ocurre porque son **procesos y entornos de ejecución separados**:

1.  **Aislamiento de Procesos**: Cuando ejecutas `bun run dev` (o similar) para tu frontend y `bun run dev` para tu backend, se inician dos procesos distintos. Cada proceso carga su propio conjunto de variables de entorno desde su respectivo directorio y archivo `.env`.
2.  **Contexto de Ejecución**: 
    *   El código del **frontend** (JavaScript que se ejecuta en el navegador del usuario) solo tiene acceso a las variables que Next.js ha expuesto explícitamente (las que tienen `NEXT_PUBLIC_`).
    *   El código del **backend** (JavaScript/TypeScript que se ejecuta en tu servidor con Bun/Node.js) tiene acceso a las variables definidas en su propio archivo `.env` (`apps/api/.env`).

Finalizando, no hay una "confusión" porque cada aplicación (frontend y backend) opera en su propio contexto y carga sus variables de entorno desde sus archivos `.env` específicos. El sistema de compilación de Next.js y la forma en que Node.js/Bun carga las variables en el backend aseguran este aislamiento.
