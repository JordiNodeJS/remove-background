Implementa una API REST que devuelva una imagen en formato binario con el tipo MIME correcto. La respuesta debe incluir:

- Cabecera Content-Type ajustada al formato de la imagen (ej. image/jpeg, image/png).
- Datos binarios de la imagen en el cuerpo de la respuesta.
- Manejo de errores con códigos HTTP apropiados (ej. 404 si la imagen no existe).
- Usa buenas prácticas de estructuración de código y sigue patrones estándar para APIs RESTful 
(https://learn.microsoft.com/en-us/training/modules/prompt-engineering-with-github-copilot/ ) 
(https://learn.microsoft.com/en-us/azure/api-management/api-management-api-versions#specify-mime-types )."
Este prompt guía para generar código con:

Respuesta binaria optimizada (menor overhead)
Configuración correcta de cabeceras HTTP
Control de errores estructurado
Compatibilidad directa con elementos <img> en frontend