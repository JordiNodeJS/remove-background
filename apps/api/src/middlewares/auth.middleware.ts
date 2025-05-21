/**
 * Middleware para autenticación en Express.
 * Este middleware verifica los tokens de autenticación en las solicitudes.
 *
 * @module AuthMiddleware
 */

import { Request, Response, NextFunction } from "express";

/**
 * Middleware para verificar si un usuario está autenticado.
 * En un entorno real, esto verificaría un JWT u otro token de autenticación.
 *
 * @param {Request} req - La solicitud HTTP
 * @param {Response} res - La respuesta HTTP
 * @param {NextFunction} next - La función para continuar al siguiente middleware
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // En un entorno real, aquí verificarías el token JWT de Clerk u otro proveedor
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 401,
      message: "Acceso no autorizado. Se requiere autenticación.",
    });
  }

  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      status: 401,
      message: "Formato de token inválido. Se espera: Bearer <token>",
    });
  }

  const token = parts[1];

  try {
    // En un sistema real, aquí verificarías la validez del token JWT
    // Por ejemplo, con jsonwebtoken: jwt.verify(token, SECRET_KEY)

    // Por ahora, solo comprobamos que hay un token
    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Token inválido",
      });
    }

    // Si llegamos aquí, el token es válido
    // En un sistema real, añadirías información del usuario a req.user
    next();
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).json({
      status: 401,
      message: "Token inválido o expirado",
    });
  }
};
