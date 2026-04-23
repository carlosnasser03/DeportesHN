export class NotificationService {
  private subscribers: Map<string, (data: any) => void> = new Map();

  subscribe(id: string, callback: (data: any) => void) {
    this.subscribers.set(id, callback);
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  notifyCommentCreated(comment: any) {
    const message = {
      type: 'COMMENT_CREATED',
      data: comment,
      timestamp: new Date(),
    };
    this.broadcast(message);
  }

  notifyCommentApproved(commentId: string) {
    const message = {
      type: 'COMMENT_APPROVED',
      commentId,
      timestamp: new Date(),
    };
    this.broadcast(message);
  }

  notifyCommentRejected(commentId: string) {
    const message = {
      type: 'COMMENT_REJECTED',
      commentId,
      timestamp: new Date(),
    };
    this.broadcast(message);
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
