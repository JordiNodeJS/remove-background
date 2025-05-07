# Troubleshooting: Enlaces simbólicos (symlinks) en monorepos Bun

## ¿Por qué ocurre este problema?

Cuando usas Bun en un monorepo (por ejemplo, con apps/frontend y apps/api), Bun instala todas las dependencias en el `node_modules` de la raíz del proyecto. Sin embargo, algunas librerías nativas o que requieren recursos internos (como `@imgly/background-removal-node`) buscan sus archivos relativos a su propia ubicación en `node_modules` dentro de cada subpaquete (por ejemplo, `apps/api/node_modules/@imgly/background-removal-node`).

Si ese directorio no existe, la librería falla con errores tipo:

```
ENOENT: no such file or directory, open '.../apps/api/node_modules/@imgly/background-removal-node/dist/resources.json'
```

## ¿Cómo se soluciona?

### 1. Crear enlaces simbólicos manualmente

Debes crear un symlink desde el `node_modules` local del subpaquete hacia el paquete real en la raíz. Por ejemplo, para `apps/api`:

```sh
cd apps/api
mkdir -p node_modules/@imgly
ln -s ../../../../node_modules/@imgly/background-removal-node node_modules/@imgly/background-removal-node
```

- Ajusta la ruta relativa según la profundidad de tu estructura.
- El comando `mkdir -p` crea la carpeta si no existe.

### 2. Instalar la dependencia localmente (alternativa)

Puedes instalar la dependencia directamente en el subpaquete:

```sh
cd apps/api
bun add @imgly/background-removal-node
```

Esto creará el `node_modules` local y copiará los archivos necesarios.

### 3. Verificar el symlink

Comprueba que el symlink existe y apunta correctamente:

```sh
ls -l node_modules/@imgly
```

Deberías ver algo como:

```
background-removal-node -> ../../../../node_modules/@imgly/background-removal-node
```

## ¿Por qué Bun no lo resuelve automáticamente?

Bun optimiza la instalación de dependencias para velocidad y espacio, centralizando los paquetes en la raíz. Sin embargo, no todas las librerías soportan esta estructura y algunas esperan estar en un `node_modules` local, especialmente si usan rutas relativas para cargar recursos internos.

## Resumen

- El error ocurre porque la librería busca recursos en un `node_modules` local que no existe.
- Solución: crea un symlink manual o instala la dependencia en el subpaquete.
- Esto es común en monorepos con Bun y dependencias que usan recursos internos.

---

Incluye esta guía en tu documentación para ayudar a otros desarrolladores a resolver este problema rápidamente.
