# Remove Background

## Descripción

Este proyecto es una aplicación web para eliminar fondos de imágenes de manera automática utilizando técnicas avanzadas de procesamiento de imágenes e inteligencia artificial. Permite a los usuarios subir imágenes, eliminar sus fondos y descargar el resultado con fondo transparente o personalizado.

## Estructura del Proyecto

Este es un proyecto monorepo que integra Next.js 15 para el frontend y Express con Bun para el backend:

```
remove-background/
├── apps/
│   ├── frontend/     # Aplicación Next.js 15 (interfaz de usuario)
│   └── api/          # Servidor Express (servicios REST)
├── packages/         # Paquetes compartidos (tipos, utilidades, UI)
├── package.json      # Configuración raíz (workspaces)
└── bun.lockb         # Lockfile de Bun
```

## Características Principales

- **Eliminación de fondos**: Procesamiento automático de imágenes para eliminar fondos
- **Personalización**: Opciones para ajustar la precisión y calidad del resultado
- **Previsualización en tiempo real**: Visualización instantánea del resultado
- **Exportación flexible**: Descarga en diferentes formatos (PNG, JPG) y resoluciones
- **API REST**: Endpoints para integración con otros servicios

## Requisitos Técnicos

- [Bun](https://bun.sh/) 1.0.0 o superior
- Node.js 18.0.0 o superior

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/remove-background.git
cd remove-background

# Instalar dependencias con Bun
bun install
```

## Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
bun dev

# O iniciar servicios individualmente
bun --filter frontend dev  # Iniciar solo el frontend
bun --filter api start     # Iniciar solo el backend
```

## Despliegue

```bash
# Construir todos los paquetes
bun run build

# Iniciar en modo producción
bun start
```

## Contribución

Si deseas contribuir a este proyecto, por favor:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
