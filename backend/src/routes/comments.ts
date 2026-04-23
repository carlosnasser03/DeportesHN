import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "../middleware/auth.middleware";
import { authzMiddleware } from "../middleware/authz.middleware";
import commentController from "../controllers/comment.controller";

const router = Router();

// 🔒 Rate limit específico para POST de comentarios (5 por 15 minutos)
const commentsPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Has enviado demasiados comentarios. Espera 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rutas de comentarios
 * POST   /api/comments                      - Crear comentario
 * DELETE /api/comments/:commentId           - Eliminar comentario
 * GET    /api/comments/category/:categoryId - Obtener comentarios por categoría
 * GET    /api/comments/match/:matchId       - Obtener comentarios por partido
 * GET    /api/comments/stats                - Obtener estadísticas
 */

// Crear comentario (con rate limit estricto)
router.post(
  "/",
  commentsPostLimiter,
  commentController.createComment.bind(commentController)
);

// Eliminar comentario
router.delete(
  "/:commentId",
  commentController.deleteComment.bind(commentController)
);

// Obtener comentarios por categoría
router.get(
  "/category/:categoryId",
  commentController.getCommentsByCategory.bind(commentController)
);

// Obtener comentarios por partido
router.get(
  "/match/:matchId",
  commentController.getCommentsByMatch.bind(commentController)
);

// Estadísticas (admin) — Protegido con JWT + Autorización
router.get(
  "/stats",
  authMiddleware,
  authzMiddleware(['admin']),
  commentController.getStats.bind(commentController)
);

export default router;
