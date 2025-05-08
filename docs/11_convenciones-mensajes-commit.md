# 11. Convenciones y Buenas Prácticas para Mensajes de Commit

Esta guía define las reglas y ejemplos recomendados para escribir mensajes de commit claros y consistentes en el monorepo Remove Background. Sigue estas convenciones para facilitar la colaboración y la trazabilidad de cambios.

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

---

# Etiquetado y Tagging con Git

Este documento describe cómo etiquetar y agregar tags a tu proyecto utilizando Git. Los tags son útiles para marcar versiones específicas de tu código, como lanzamientos o puntos de referencia importantes.

## ¿Qué son los Tags?

Los tags en Git son punteros a un commit específico. A diferencia de los branches, los tags no se mueven. Son ideales para:

- **Lanzamientos:** Marcar la versión 1.0.0, 1.0.1, etc.
- **Puntos de referencia:** Marcar un estado particular del código en un momento dado.
- **Versiones de referencia:** Permitir que los usuarios se dirijan a una versión específica sin necesidad de clonar todo el repositorio.

## Tipos de Tags

- **Lightweight Tags:** Simples punteros a un commit. No tienen información adicional.
- **Annotated Tags:** Contienen información adicional, como el autor, la fecha y un mensaje. Se crean con `git tag -a <tag_name> -m "<message>"`.

## Creación de Tags

**1. Crear un Tag Ligero:**

```bash
git tag -a <tag_name>
```

Ejemplo:

```bash
git tag -a v1.0.0
```

Esto creará un tag llamado `v1.0.0` que apunta al commit más reciente.

**2. Crear un Tag Anotado:**

```bash
git tag -a <tag_name> -m "<message>"
```

Ejemplo:

```bash
git tag -a v1.0.0 -m "Primera versión estable del proyecto"
```

Esto creará un tag llamado `v1.0.0` con un mensaje asociado.

**3. Ver los Tags:**

```bash
git tag
```

Esto mostrará una lista de todos los tags en tu repositorio.

**4. Listar Tags con Detalles:**

```bash
git tag -v
```

Esto mostrará los tags con sus mensajes asociados.

**5. Ponerse en un Tag:**

```bash
git checkout <tag_name>
```

Esto te llevará al commit al que apunta el tag especificado.

**6. Crear un Tag para un Commit Específico:**

Si quieres etiquetar un commit que no es el más reciente, puedes usar su hash:

```bash
git tag <commit_hash> <tag_name>
```

Ejemplo:

```bash
git tag 0123456789abcdef0123456789abcdef0123456789abcdef v1.0.0
```

**7. Eliminar un Tag:**

```bash
git tag -d <tag_name>
```

Ejemplo:

```bash
git tag -d v1.0.0
```

**Consideraciones:**

- Es una buena práctica usar convenciones de nomenclatura de tags (como `v1.0.0`, `v1.0.1`, etc.) para facilitar la identificación y el seguimiento de las versiones.
- Los tags son permanentes, así que asegúrate de que la información que proporcionas sea precisa y relevante.
- Si necesitas modificar la información de un tag existente, puedes usar `git tag -a -m "<new_message>" <tag_name>`.
- Para obtener más información, consulta la documentación oficial de Git: [https://git-scm.com/docs/tags](https://git-scm.com/docs/tags)
