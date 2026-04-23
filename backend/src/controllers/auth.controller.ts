import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export class AuthController {
  /**
   * POST /api/auth/token
   * Generar JWT usando admin API key
   * Body: { admin_key: string }
   */
  async generateToken(req: Request, res: Response) {
    try {
      const { admin_key } = req.body;

      // Validar que admin_key fue proporcionado
      if (!admin_key) {
        return res.status(400).json({
          success: false,
          error: 'admin_key es requerido',
        });
      }

      // Obtener admin key del .env
      const expectedKey = process.env.ADMIN_API_KEY;

      if (!expectedKey) {
        console.error('ADMIN_API_KEY no configurado en .env');
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor',
        });
      }

      // Verificar que la clave coincide
      if (admin_key !== expectedKey) {
        return res.status(401).json({
          success: false,
          error: 'admin_key inválido',
        });
      }

      // Generar JWT
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error('JWT_SECRET no configurado en .env');
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor',
        });
      }

      const token = jwt.sign(
        { role: 'admin' },
        jwtSecret,
        { expiresIn: '24h' } // Token válido por 24 horas
      );

      return res.status(200).json({
        success: true,
        message: 'Token generado exitosamente',
        data: {
          token,
          expiresIn: '24h',
          type: 'Bearer',
        },
      });
    } catch (error) {
      console.error('Error en generateToken:', error);
      const isDev = process.env.NODE_ENV === 'development';
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        ...(isDev && { message: (error as Error).message }),
      });
    }
  }
}

export default new AuthController();
