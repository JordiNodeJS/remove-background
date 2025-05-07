# Convenciones y Buenas Prácticas para Mensajes de Commit

Para mantener la coherencia y claridad en el historial del proyecto, es fundamental seguir una convención estándar al escribir los mensajes de commit. Esto facilita la colaboración, la revisión de cambios y la automatización de procesos.

---

## Reglas Generales

- Escribe el mensaje en **español** y en **imperativo** (ejemplo: "Agrega validación de usuario").
- Limita la línea del título a **50 caracteres**.
- Deja una línea en blanco entre el título y el cuerpo (si lo hay).
- El cuerpo del commit debe explicar el "qué" y el "por qué" del cambio, no el "cómo".
- Usa el cuerpo solo si el cambio lo requiere (máximo 72 caracteres por línea).

---

## Estructura Recomendada

```
<tipo>(opcional: alcance): <descripción breve>

[opcional: cuerpo explicativo]
[opcional: referencias o issues]
```

### Tipos sugeridos
- feat: Nueva funcionalidad
- fix: Corrección de errores
- docs: Cambios en la documentación
- style: Formato, sin cambios de lógica (espacios, punto y coma, etc.)
- refactor: Refactorización de código
- test: Añadir o corregir tests
- chore: Tareas de mantenimiento

### Ejemplos

- feat(api): agrega endpoint para eliminar imágenes
- fix(frontend): corrige bug en el formulario de login
- docs: actualiza guía de instalación
- style: ajusta indentación en background-removal.service.ts
- refactor(api): simplifica lógica de procesamiento de imágenes
- test: añade pruebas para el servicio de autenticación
- chore: actualiza dependencias de Bun

---

## Recursos
- [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/)
- [Guía de mensajes de commit en español](https://carlosazaustre.es/como-escribir-buenos-commits/)

> **Sugerencia:** Antes de hacer push, revisa que tu mensaje de commit sea claro, breve y siga estas convenciones.