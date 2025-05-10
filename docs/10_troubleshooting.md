# Troubleshooting: Enlaces simbólicos (symlinks) en monorepos Bun

## ¿Por qué ocurre este problema?

Cuando usas Bun en un monorepo (por ejemplo, con apps/frontend y apps/api), Bun instala todas las dependencias en el `node_modules` de la raíz del proyecto. Sin embargo, algunas librerías nativas o que requieren recursos internos (como `@imgly/background-removal-node`) buscan sus archivos relativos a su propia ubicación en `node_modules` dentro de cada subpaquete (por ejemplo, `apps/api/node_modules/@imgly/background-removal-node`).

Si ese directorio no existe, la librería falla con errores tipo:

```
ENOENT: no such file or directory, open '.../apps/api/node_modules/@imgly/background-removal-node/dist/resources.json'
```

## ¿Cómo se soluciona?

### 1. Usar el script automatizado (Recomendado)

Se ha creado un script en la raíz del proyecto llamado `create_symlinks.sh` que automatiza este proceso.

Para ejecutarlo:

1.  Abre una terminal en la raíz de tu proyecto.
2.  Asegúrate de que el script tenga permisos de ejecución:
    ```sh
    chmod +x create_symlinks.sh
    ```
3.  Ejecuta el script:
    ```sh
    ./create_symlinks.sh
    ```

El script creará el directorio `apps/api/node_modules/@imgly` (si no existe) y luego el enlace simbólico necesario desde `apps/api/node_modules/@imgly/background-removal-node` hacia `../../../../node_modules/@imgly/background-removal-node`.

### 2. Crear enlaces simbólicos manualmente (Alternativa)

Si prefieres hacerlo manualmente o necesitas entender el proceso, puedes crear un symlink desde el `node_modules` local del subpaquete hacia el paquete real en la raíz. Por ejemplo, para `apps/api`:

```sh
cd apps/api
mkdir -p node_modules/@imgly
ln -s ../../../../node_modules/@imgly/background-removal-node node_modules/@imgly/background-removal-node
```

- Ajusta la ruta relativa según la profundidad de tu estructura.
- El comando `mkdir -p` crea la carpeta si no existe.

### 3. Instalar la dependencia localmente (Otra alternativa)

Puedes instalar la dependencia directamente en el subpaquete:

```sh
cd apps/api
bun add @imgly/background-removal-node
```

Esto creará el `node_modules` local y copiará los archivos necesarios.

### 4. Verificar el symlink

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
- Solución recomendada: ejecutar el script `create_symlinks.sh` proporcionado en la raíz del proyecto.
- Alternativas: crear un symlink manual o instalar la dependencia directamente en el subpaquete.
- Esto es común en monorepos con Bun y dependencias que usan recursos internos.

---

Incluye esta guía en tu documentación para ayudar a otros desarrolladores a resolver este problema rápidamente.
