# Resolución de Problemas Comunes

Si encuentras problemas al ejecutar la aplicación, aquí hay algunas soluciones a los problemas más comunes:

## Problemas de conectividad entre frontend y backend

### Síntomas:

- La aplicación muestra mensajes de error al intentar procesar imágenes
- Las imágenes se suben pero no aparecen procesadas
- El mensaje "Error al descargar la imagen procesada" aparece frecuentemente

### Soluciones:

1. **Verificar que ambos servicios estén funcionando correctamente**:

   ```bash
   bash check-services.sh
   ```

2. **Verificar la configuración del archivo .env.local**:

   - Comprobar que `NEXT_PUBLIC_API_URL` esté configurado correctamente (por defecto `http://localhost:3001`)
   - Si el backend no está disponible, establecer `NEXT_PUBLIC_USE_MOCK_API=true` para utilizar el modo mock

3. **Reiniciar ambos servicios**:
   ```bash
   bun stop:all
   bun dev
   ```

## Problemas con la eliminación de fondo

### Síntomas:

- La imagen se procesa pero el fondo no se elimina correctamente
- El procesamiento falla con errores técnicos

### Soluciones:

1. **Verificar formato de imagen**:

   - Usar solo imágenes JPG o PNG
   - Asegurar que la imagen tenga un tamaño adecuado (menos de 10MB)
   - Usar imágenes con contrastes claros entre el objeto principal y el fondo

2. **Comprobar los logs del backend**:
   ```bash
   bun run --filter=@remove-background/api dev
   ```
3. **Verificar que existan los directorios para el almacenamiento de imágenes**:

   ```bash
   # En el frontend
   mkdir -p apps/frontend/public/images-input apps/frontend/public/images-output

   # En el backend
   mkdir -p apps/api/uploads apps/api/images-output
   ```

## Errores de permisos en Windows

Si al ejecutar la aplicación en Windows aparecen errores de permisos:

1. Ejecutar PowerShell como administrador
2. Habilitar la ejecución de scripts:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Verificar permisos de escritura en las carpetas del proyecto

## Reportar un error

Si continúas teniendo problemas, por favor reporta el error incluyendo:

1. Capturas de pantalla del problema
2. Logs de la consola del navegador
3. Logs de los servidores (frontend y backend)
4. Sistema operativo y versión de Bun

Para más información sobre resolución de problemas, consulta el archivo [docs/10_troubleshooting.md](docs/10_troubleshooting.md).
