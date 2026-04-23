export class NotificationService {
  private subscribers: Map<string, (data: any) => void> = new Map();

  /**
   * Notificar que se creó un comentario
   * Emite a todos los clientes suscritos a esa categoría
   */
  notifyCommentCreated(comment: any) {
    const message = {
      type: 'COMMENT_CREATED',
      data: comment,
      timestamp: new Date(),
    };

    // Emitir vía WebSocket a la categoría específica
    if (globalThis.socketIO) {
      globalThis.socketIO.to(`category_${comment.categoryId}`).emit('comment:created', message);
    }

    // Legacy: broadcast a subscribers
    this.broadcast(message);
  }

  /**
   * Notificar que se aprobó un comentario
   * Emite a admins y a la categoría
   */
  notifyCommentApproved(commentId: string, categoryId: string) {
    const message = {
      type: 'COMMENT_APPROVED',
      commentId,
      timestamp: new Date(),
    };

    if (globalThis.socketIO) {
      // Enviar a la categoría específica
      globalThis.socketIO.to(`category_${categoryId}`).emit('comment:approved', message);
      // Enviar a admins
      globalThis.socketIO.to('admin_notifications').emit('comment:approved', message);
    }

    this.broadcast(message);
  }

  /**
   * Notificar que se rechazó un comentario
   * Emite a admins y a la categoría
   */
  notifyCommentRejected(commentId: string, categoryId: string) {
    const message = {
      type: 'COMMENT_REJECTED',
      commentId,
      timestamp: new Date(),
    };

    if (globalThis.socketIO) {
      globalThis.socketIO.to(`category_${categoryId}`).emit('comment:rejected', message);
      globalThis.socketIO.to('admin_notifications').emit('comment:rejected', message);
    }

    this.broadcast(message);
  }

  /**
   * Legacy: broadcast a subscribers locales
   */
  subscribe(id: string, callback: (data: any) => void) {
    this.subscribers.set(id, callback);
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  private broadcast(message: any) {
    this.subscribers.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error('Error broadcasting notification:', error);
      }
    });
  }
}

export default new NotificationService();
