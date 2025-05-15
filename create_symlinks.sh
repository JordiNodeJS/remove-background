#!/bin/bash

# Script para crear el directorio y el enlace simbólico necesarios para @imgly/background-removal-node en el subpaquete apps/api

# Ruta base del proyecto (asumiendo que el script se ejecuta desde la raíz)
PROJECT_ROOT=$(pwd)

# Ruta al subpaquete de la API
API_PATH="${PROJECT_ROOT}/apps/api"

# Directorio a crear dentro de node_modules del subpaquete
TARGET_DIR="${API_PATH}/node_modules/@imgly"

# Nombre del paquete para el enlace simbólico
PACKAGE_NAME="background-removal-node"

# Ruta completa al enlace simbólico que se creará
SYMLINK_PATH="${TARGET_DIR}/${PACKAGE_NAME}"

# Ruta al paquete real en el node_modules de la raíz
# La ruta relativa es desde la ubicación del enlace simbólico (SYMLINK_PATH)
# apps/api/node_modules/@imgly/background-removal-node -> ../../../../node_modules/@imgly/background-removal-node
SOURCE_PACKAGE_PATH_RELATIVE_TO_SYMLINK_LOCATION="../../../../node_modules/@imgly/${PACKAGE_NAME}"

# 1. Crear la carpeta node_modules/@imgly en apps/api si no existe
echo "Creando directorio ${TARGET_DIR}..."
mkdir -p "${TARGET_DIR}"

# 2. Crear el enlace simbólico
echo "Creando enlace simbólico desde ${SYMLINK_PATH} hacia ${SOURCE_PACKAGE_PATH_RELATIVE_TO_SYMLINK_LOCATION}..."

# Nos movemos al directorio donde se creará el enlace para que la ruta relativa sea correcta
cd "${TARGET_DIR}"
ln -sfn "${SOURCE_PACKAGE_PATH_RELATIVE_TO_SYMLINK_LOCATION}" "${PACKAGE_NAME}"
cd "${PROJECT_ROOT}" # Volver al directorio raíz

echo "Proceso completado."
echo "Verifica el enlace simbólico con: ls -l ${SYMLINK_PATH}"

