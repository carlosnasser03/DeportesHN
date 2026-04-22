import { Router } from "express";
import commentController from "../controllers/comment.controller";

const router = Router();

/**
 * Rutas de comentarios
 * POST   /api/comments                      - Crear comentario
 * DELETE /api/comments/:commentId           - Eliminar comentario
 * GET    /api/comments/category/:categoryId - Obtener comentarios por categoría
 * GET    /api/comments/match/:matchId       - Obtener comentarios por partido
 * GET    /api/comments/stats                - Obtener estadísticas
 */

// Crear comentario
router.post("/", commentController.createComment.bind(commentController));

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

// Estadísticas (admin)
router.get(
  "/stats",
  commentController.getStats.bind(commentController)
);

export default router;
