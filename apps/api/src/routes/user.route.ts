/**
 * Express router for user authentication and information.
 * Provides endpoints to get current user information.
 *
 * @module UserRoute
 * @requires express
 */

import { Router } from "express";

export const router = Router();

/**
 * GET /user
 * Returns information about the currently authenticated user
 */
// @ts-ignore - Ignoramos errores de tipos conocidos con Express 5 + TypeScript
router.get("/", (_req, res) => {
  try {
    // En un entorno real, aquí obtendrías el usuario desde la sesión o token JWT
    // Aquí simulamos una respuesta basada en la cabecera de autenticación
    const authHeader = _req.headers.authorization;

    // Si no hay cabecera de autorización, el usuario no está autenticado
    if (!authHeader) {
      return res.status(401).json({
        status: 401,
        message: "Usuario no autenticado",
        id: null,
      });
    }

    // En un sistema real, aquí verificarías el token JWT
    // Como simulación, extraemos un ID simple del token
    const token = authHeader.split(" ")[1];
    const userId = token || "user-123"; // ID predeterminado si el token está presente pero no es válido

    return res.json({
      status: 200,
      message: "Usuario autenticado",
      id: userId,
      firstName: "Usuario", // Estos serían valores reales en un sistema con autenticación
      lastName: "Ejemplo",
      email: "usuario@ejemplo.com",
    });
  } catch (error) {
    console.error("Error obteniendo información del usuario:", error);
    return res.status(500).json({
      status: 500,
      message: "Error interno del servidor",
      id: null,
    });
  }
});
