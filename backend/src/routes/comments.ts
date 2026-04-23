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

// 🔒 Rate limit para PATCH de comentarios (10 por 15 minutos)
const commentsPatchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Has editado demasiados comentarios. Espera 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rutas de comentarios
 * POST   /api/comments                          - Crear comentario
 * PATCH  /api/comments/:commentId               - Editar comentario
 * DELETE /api/comments/:commentId               - Eliminar comentario
 * PUT    /api/comments/:commentId/approval      - Aprobar/Rechazar (admin)
 * GET    /api/comments/moderation/pending       - Comentarios pendientes (admin)
 * GET    /api/comments/category/:categoryId     - Obtener por categoría
 * GET    /api/comments/match/:matchId           - Obtener por partido
 * GET    /api/comments/stats                    - Obtener estadísticas (admin)
 */

// Crear comentario (con rate limit estricto)
router.post(
  "/",
  commentsPostLimiter,
  commentController.createComment.bind(commentController)
);

// Editar comentario
router.patch(
  "/:commentId",
  commentsPatchLimiter,
  commentController.updateComment.bind(commentController)
);

// Eliminar comentario
router.delete(
  "/:commentId",
  commentController.deleteComment.bind(commentController)
);

// Comentarios pendientes de aprobación (admin)
router.get(
  "/moderation/pending",
  authMiddleware,
  authzMiddleware(['admin']),
  commentController.getPendingComments.bind(commentController)
);

// Aprobar/Rechazar comentario (admin)
router.put(
  "/:commentId/approval",
  authMiddleware,
  authzMiddleware(['admin']),
  commentController.updateApprovalStatus.bind(commentController)
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

// Estadísticas (admin)
router.get(
  "/stats",
  authMiddleware,
  authzMiddleware(['admin']),
  commentController.getStats.bind(commentController)
);

export default router;
