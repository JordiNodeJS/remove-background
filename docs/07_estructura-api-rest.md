# 1. Estructura recomendada para una API REST en el monorepo

Esta es la guía principal de arquitectura para el backend Express en el monorepo Next.js 15 + Express + Bun. Aquí se describe cómo organizar carpetas, archivos y responsabilidades para construir una API RESTful escalable y mantenible, siguiendo las mejores prácticas del proyecto.

## apps/api: organización del backend

```plaintext
apps/api/
├── src/
│   ├── routes/        # Definición de rutas Express (por recurso: users.ts, images.ts, etc.)
│   ├── controllers/   # Lógica de negocio separada de las rutas
│   ├── middlewares/   # Middlewares personalizados (autenticación, logging, etc.)
│   ├── models/        # Modelos de datos o validaciones (si aplica)
│   ├── utils/         # Funciones utilitarias y helpers
│   ├── index.ts       # Punto de entrada principal del servidor Express
│   └── remove.ts      # Scripts o módulos auxiliares (ej: eliminación de fondo)
├── images-output/     # Carpeta para archivos generados (imágenes procesadas, etc.)
├── package.json
├── tsconfig.json
└── README.md
```

### Descripción de carpetas y archivos

- **routes/**: Define los endpoints de la API agrupados por recurso. Ejemplo: `users.ts`, `images.ts`.
- **controllers/**: Contiene la lógica de negocio y controladores para cada recurso.
- **middlewares/**: Middlewares reutilizables para validación, autenticación, logging, etc.
- **models/**: Modelos de datos, esquemas o validaciones (por ejemplo, usando Zod, Joi o un ORM).
- **utils/**: Funciones auxiliares y utilidades generales.
- **index.ts**: Archivo principal que inicializa y arranca el servidor Express.
- **remove.ts**: Script o módulo específico para procesamiento de imágenes (puede moverse a `controllers/` o `utils/` si crece).
- **images-output/**: Carpeta para almacenar archivos generados por la API (por ejemplo, imágenes procesadas).

## Ejemplo de estructura de rutas

```plaintext
src/routes/
├── index.ts        # Rutas raíz o de salud (healthcheck)
├── users.ts        # Endpoints para usuarios
└── images.ts       # Endpoints para procesamiento de imágenes
```

Cada archivo de rutas importa su controlador correspondiente y define los endpoints:

```typescript
import { Router } from 'express';
import { getUsers, createUser } from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);

export default router;
```

## Ventajas de esta estructura

- Facilita la escalabilidad y el mantenimiento.
- Permite separar responsabilidades y reutilizar código.
- Sigue las convenciones modernas para proyectos Node.js/Express en monorepo.

---

Esta estructura está alineada con la guía general del monorepo y permite que el backend crezca de forma ordenada y sostenible.