import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extender Request para incluir userData
declare global {
  namespace Express {
    interface Request {
      user?: { role: string; iat: number; exp: number };
    }
  }
}

/**
 * Middleware de autenticación JWT
 * Verifica que el token está presente y es válido
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token no proporcionado',
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET no configurado');
    }

    // Verificar y decodificar token
    const decoded = jwt.verify(token, secret) as { role: string; iat: number; exp: number };

    // Adjuntar usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        error: 'Token expirado',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
      });
    }

    res.status(401).json({
      success: false,
      error: 'No autorizado',
    });
  }
};
