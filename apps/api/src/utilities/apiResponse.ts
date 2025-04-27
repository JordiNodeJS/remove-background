export interface ApiResponse {
  status: number;
  message: string;
  data?: unknown;
  error?: string;
}

export const successResponse = (data: unknown, message = 'Operación exitosa'): ApiResponse => ({
  status: 200,
  message,
  data
});

export const errorResponse = (status: number, error: string): ApiResponse => ({
  status,
  error,
  message: 'Error en la solicitud'
});

export const serverErrorResponse = (error: Error): ApiResponse => ({
  status: 500,
  error: error.message,
  message: 'Error interno del servidor'
});