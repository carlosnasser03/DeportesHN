import { PrismaClient } from "@prisma/client";
import Filter from "bad-words";

const prisma = new PrismaClient();

// Inicializar filtro de malas palabras
// bad-words incluye palabras en inglés por defecto
// Agregamos palabras comunes en español
const badWords = new Filter();
const spanishBadWords = [
  "puta",
  "pinche",
  "pendejo",
  "culero",
  "mierda",
  "idiota",
  "imbecil",
  "cojudo",
  "boludo",
  "pelotudo",
  "gilipolla",
  "cabrón",
  "joder",
  "chingada",
  "gonorrea",
  "baboso",
  "desgraciado",
  "puto",
  "puta",
  "vete",
];

// Agregar palabras al filtro
badWords.addWords(...spanishBadWords);

export interface CreateCommentInput {
  categoryId: string;
  matchId?: string;
  content: string;
}

export class CommentService {
  /**
   * Crear comentario con filtro de malas palabras
   */
  async createComment(input: CreateCommentInput) {
    const { categoryId, matchId, content } = input;

    // Validar que la categoría exista
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("Categoría no encontrada");
    }

    // Si hay matchId, validar que el partido exista
    if (matchId) {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
      });

      if (!match) {
        throw new Error("Partido no encontrado");
      }
    }

    // Filtrar malas palabras (mejor-profanity censura automáticamente)
    const filteredContent = this.filterProfanity(content);

    // Validar que el contenido no esté vacío después de filtrar
    if (!filteredContent.trim()) {
      throw new Error("El comentario está vacío o contiene solo palabras censuradas");
    }

    // Validar longitud máxima
    if (filteredContent.length > 500) {
      throw new Error("El comentario es demasiado largo (máximo 500 caracteres)");
    }

    // Crear comentario en BD
    const comment = await prisma.comment.create({
      data: {
        categoryId,
        matchId: matchId || null,
        content: filteredContent,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            label: true,
          },
        },
        match: {
          select: {
            id: true,
            homeTeam: {
              select: {
                id: true,
                organization: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            awayTeam: {
              select: {
                id: true,
                organization: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            date: true,
            status: true,
          },
        },
      },
    });

    return comment;
  }

  /**
   * Obtener comentarios por categoría (paginado)
   */
  async getCommentsByCategory(categoryId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          categoryId,
          isApproved: true,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          match: {
            select: {
              id: true,
              homeTeam: {
                select: {
                  organization: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              awayTeam: {
                select: {
                  organization: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              date: true,
              status: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          categoryId,
          isApproved: true,
        },
      }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtener comentarios por partido
   */
  async getCommentsByMatch(matchId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Validar que el partido exista
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new Error("Partido no encontrado");
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          matchId,
          isApproved: true,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          matchId,
          isApproved: true,
        },
      }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Eliminar comentario (solo por ID)
   */
  async deleteComment(commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error("Comentario no encontrado");
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return { message: "Comentario eliminado correctamente" };
  }

  /**
   * Filtrar malas palabras usando bad-words
   * Censa palabras con asteriscos (*)
   */
  private filterProfanity(text: string): string {
    // Censurar palabras con asteriscos
    return badWords.clean(text);
  }

  /**
   * Obtener estadísticas de comentarios (admin)
   */
  async getCommentStats(categoryId?: string) {
    const where = categoryId ? { categoryId } : {};

    const total = await prisma.comment.count({ where });
    const approved = await prisma.comment.count({
      where: { ...where, isApproved: true },
    });
    const pending = await prisma.comment.count({
      where: { ...where, isApproved: false },
    });

    return {
      total,
      approved,
      pending,
    };
  }
}

export default new CommentService();
