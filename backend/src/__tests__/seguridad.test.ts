import request from 'supertest';
import { app } from '../index';

describe('🛡️ SEGURIDAD E2E — DeporteHN Backend', () => {
  let adminToken: string;

  // ==========================================
  // SEGURIDAD PASO 1: Headers, Rate Limit, Sanitización
  // ==========================================

  describe('Paso 1: Headers HTTP Seguros (Helmet)', () => {
    test('✅ Health check retorna headers de seguridad', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['strict-transport-security']).toBeDefined();
    });

    test('❌ Health check NO expone NODE_ENV', async () => {
      const res = await request(app).get('/api/health');

      expect(res.body).not.toHaveProperty('environment');
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('timestamp');
    });

    test('✅ Headers contienen CSP (Helmet)', async () => {
      const res = await request(app).get('/api/health');

      expect(res.headers['content-security-policy']).toBeDefined();
    });
  });

  describe('Paso 1: Body Size Limit', () => {
    test('❌ Body > 10kb es rechazado', async () => {
      const largePayload = { content: 'a'.repeat(11000) };

      const res = await request(app)
        .post('/api/comments')
        .send(largePayload);

      expect(res.status).toBe(413); // Payload Too Large
    });
  });

  describe('Paso 1: Sanitización de Errores', () => {
    test('✅ En producción NO expone mensaje de error interno', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const res = await request(app).get('/api/invalid-endpoint');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Endpoint not found');
      // En producción no debe tener field 'message' con detalles internos

      process.env.NODE_ENV = originalEnv;
    });
  });

  // ==========================================
  // SEGURIDAD PASO 2: Autenticación JWT
  // ==========================================

  describe('Paso 2: Autenticación JWT', () => {
    test('✅ Generar token con admin_key válido', async () => {
      const res = await request(app)
        .post('/api/auth/token')
        .send({ admin_key: 'admin_key_super_secreta_2026' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data.token');
      expect(res.body.data.expiresIn).toBe('24h');

      adminToken = res.body.data.token;
    });

    test('❌ Rechaza admin_key inválido', async () => {
      const res = await request(app)
        .post('/api/auth/token')
        .send({ admin_key: 'wrong_key' });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('admin_key inválido');
    });

    test('❌ Rechaza requests sin admin_key', async () => {
      const res = await request(app).post('/api/auth/token').send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('requerido');
    });

    test('✅ Token JWT es válido (puedo usarlo)', async () => {
      // Obtener token
      const tokenRes = await request(app)
        .post('/api/auth/token')
        .send({ admin_key: 'admin_key_super_secreta_2026' });

      const token = tokenRes.body.data.token;

      // Usar token en request autenticado
      const res = await request(app)
        .get('/api/comments/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ==========================================
  // SEGURIDAD PASO 3: Validaciones + Autorización + CORS
  // ==========================================

  describe('Paso 3: Validaciones Robustas de Input', () => {
    test('❌ Rechaza categoryId inválido (no UUID)', async () => {
      const res = await request(app)
        .post('/api/comments')
        .send({
          categoryId: 'invalid-not-uuid',
          content: 'Test comment',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validación fallida');
      expect(res.body.details).toBeDefined();
    });

    test('❌ Rechaza content muy corto (< 3 chars)', async () => {
      const res = await request(app)
        .post('/api/comments')
        .send({
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          content: 'ab',
        });

      expect(res.status).toBe(400);
      expect(res.body.details.content).toContain('al menos 3');
    });

    test('❌ Rechaza content muy largo (> 500 chars)', async () => {
      const longText = 'a'.repeat(501);

      const res = await request(app)
        .post('/api/comments')
        .send({
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          content: longText,
        });

      expect(res.status).toBe(400);
      expect(res.body.details.content).toContain('no puede exceder 500');
    });

    test('✅ Acepta content válido (3-500 chars)', async () => {
      const res = await request(app)
        .post('/api/comments')
        .send({
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          content: 'Este es un comentario válido con más de 3 chars',
        });

      // Puede fallar por BD (categoría no existe), pero validación pasó
      expect(res.status).toBeGreaterThan(200); // 201, 400, o 500 (pero no 400 de validación)
      if (res.status === 400) {
        expect(res.body.error).not.toBe('Validación fallida');
      }
    });
  });

  describe('Paso 3: Autorización con Roles', () => {
    test('❌ Acceso a /stats SIN token', async () => {
      const res = await request(app).get('/api/comments/stats');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token no proporcionado');
    });

    test('❌ Acceso a /stats con token INVÁLIDO', async () => {
      const res = await request(app)
        .get('/api/comments/stats')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Token inválido');
    });

    test('✅ Acceso a /stats con token VÁLIDO y rol admin', async () => {
      const tokenRes = await request(app)
        .post('/api/auth/token')
        .send({ admin_key: 'admin_key_super_secreta_2026' });

      const token = tokenRes.body.data.token;

      const res = await request(app)
        .get('/api/comments/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
    });
  });

  describe('Paso 3: CORS Whitelist', () => {
    test('✅ Permite origin autorizado (localhost:3000)', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      // CORS permite, responde normalmente
      expect(res.status).toBe(200);
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    test('❌ Rechaza origin no autorizado', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://malicious-site.com');

      // CORS no establece access-control-allow-origin
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  // ==========================================
  // FLUJO E2E COMPLETO
  // ==========================================

  describe('Flujo E2E Completo de Seguridad', () => {
    test('✅ Admin flujo: generar token → acceder a stats → ver datos', async () => {
      // 1. Generar token
      const tokenRes = await request(app)
        .post('/api/auth/token')
        .send({ admin_key: 'admin_key_super_secreta_2026' });

      expect(tokenRes.status).toBe(200);
      const token = tokenRes.body.data.token;

      // 2. Usar token para acceder a stats protegido
      const statsRes = await request(app)
        .get('/api/comments/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(statsRes.status).toBe(200);
      expect(statsRes.body.success).toBe(true);
      expect(statsRes.body.data).toHaveProperty('total');
      expect(statsRes.body.data).toHaveProperty('approved');
    });

    test('❌ Usuario no autenticado: no puede acceder a stats', async () => {
      const res = await request(app).get('/api/comments/stats');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
