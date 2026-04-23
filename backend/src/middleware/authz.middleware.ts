import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de autorización basado en roles
 * Verifica que el usuario tiene el rol requerido
 *
 * Uso: authzMiddleware(['admin']) para proteger ruta solo para admins
 */
export const authzMiddleware = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el usuario está autenticado (tiene req.user)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado',
      });
    }

    // Verificar que el usuario tiene uno de los roles requeridos
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tiene permisos para acceder a este recurso',
      });
    }

    next();
  };
};
