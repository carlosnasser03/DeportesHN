import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Cargar variables de entorno
dotenv.config();

// Inicializar Prisma
const prisma = new PrismaClient();

// Inicializar Express
const app: Express = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 🔌 WebSocket con Socket.io
// ==========================================
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || '',
    ].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Hacer io disponible globalmente para controllers
declare global {
  var socketIO: SocketIOServer;
}
globalThis.socketIO = io;

// ==========================================
// 🔒 CAPA 1: Helmet — Headers HTTP seguros
// ==========================================
app.use(helmet());

// ==========================================
// 🔒 CAPA 2: Body size limit
// ==========================================
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ==========================================
// 🔒 CAPA 3: Rate limit global (100 req/15min por IP)
// ==========================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: 'Demasiadas solicitudes. Intenta en 15 minutos.' },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
});

// ==========================================
// 🔒 CORS Avanzado — Whitelist + Headers
// ==========================================
const allowedOrigins = [
  'http://localhost:3000', // Frontend dev
  'http://localhost:3001', // Frontend alt port
  process.env.FRONTEND_URL, // Frontend producción
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas
}));

// Aplicar rate limit global a rutas API
app.use('/api/', globalLimiter);

// Middleware de logging simple
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (sin exponer NODE_ENV)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
import authRouter from '@/routes/auth';
import categoriesRouter from '@/routes/categories';
import teamsRouter from '@/routes/teams';
import matchesRouter from '@/routes/matches';
import usersRouter from '@/routes/users';
import standingsRouter from '@/routes/standings';
import commentsRouter from '@/routes/comments';

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/users', usersRouter);
app.use('/api/standings', standingsRouter);
app.use('/api/comments', commentsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==========================================
// WebSocket eventos básicos
// ==========================================
io.on('connection', (socket) => {
  console.log(`📱 Cliente conectado: ${socket.id}`);

  // El cliente puede suscribirse a un "room" por categoría
  socket.on('subscribe_category', (categoryId: string) => {
    socket.join(`category_${categoryId}`);
    console.log(`✅ Cliente ${socket.id} suscrito a categoría ${categoryId}`);
  });

  socket.on('unsubscribe_category', (categoryId: string) => {
    socket.leave(`category_${categoryId}`);
    console.log(`❌ Cliente ${socket.id} desuscrito de categoría ${categoryId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`);
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a BD
    await prisma.$connect();
    console.log('✅ Conectado a base de datos');

    httpServer.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔌 WebSocket disponible en ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⛔ Apagando servidor...');
  await prisma.$disconnect();
  io.close();
  process.exit(0);
});

startServer();

export { app, prisma, io };
