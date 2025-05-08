# Banco de Memoria y Progreso del Proyecto

## Última actualización: 2025-05-02

---

## Checkpoints (PRD)

### 1.EM Estructura del Monorepo

- [x] 1.1.EM Estructura de carpetas creada según la guía (apps/frontend, apps/api, packages/shared)
- [x] 1.2.EM Configuración de workspaces en `package.json` raíz
- [x] 1.3.EM Uso de Bun como gestor de dependencias

---

### 2.B Backend (apps/api)

- [x] 2.1.B Configuración básica de Express
- [x] 2.2.B Endpoint para recibir imágenes con Multer
- [x] 2.3.B Servicio `background-removal.service.ts` creado
- [x] 2.4.B Carpeta `images-output` generada dinámicamente
- [x] 2.5.B Instalación de la librería `background-removal-node`
- [ ] 2.6.B Integración real de `background-removal-node` en el servicio
- [ ] 2.7.B Eliminación automática del archivo original tras procesar
- [x] 2.8.B Pruebas unitarias del servicio de imágenes (test creado)
- [x] 2.9.B Documentación de endpoints y comandos de test en docs

---

### 3.F Frontend (apps/frontend)

- [x] 3.1.F Proyecto Next.js 15 inicializado
- [ ] 3.2.F Página principal `/` para subir imágenes y mostrar resultados
- [ ] 3.3.F Configuración de proxy a backend en desarrollo
- [ ] 3.4.F Conexión real con el backend (API)
- [ ] 3.5.F Pruebas unitarias de componentes principales

---

### 4.PC Paquetes Compartidos (packages/shared)

- [ ] 4.1.PC Creación de módulo de tipos TypeScript compartidos
- [ ] 4.2.PC Helpers/utilidades reutilizables

---

### 5.CD Configuración y DevOps

- [x] 5.1.CD Scripts de desarrollo y arranque con Bun y concurrently
- [x] 5.2.CD Variables de entorno documentadas y configuradas en docs
- [ ] 5.3.CD Configuración de CI/CD para instalar con Bun y ejecutar tests

---

## Notas y Siguientes Pasos

- Actualizar los checkpoints a medida que se completen tareas.
- Mantener este documento como referencia rápida del estado y progreso.
- Consultar `.github/prompts/background-removal-node.promt.md` para detalles de integración de la librería de eliminación de fondo.

---