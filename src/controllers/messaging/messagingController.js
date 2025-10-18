import { MessagingService } from '../../services/messaging/messagingService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class MessagingController {
  constructor() {
    this.messagingService = new MessagingService();
  }

  // Get user conversations
  getConversations = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;
    const conversations = await this.messagingService.getUserConversations(
      req.user.id,
      { page: parseInt(page), limit: parseInt(limit), status }
    );

    res.json({
      success: true,
      data: conversations
    });
  });

  // Start or get conversation
  getOrCreateConversation = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const conversation = await this.messagingService.getOrCreateConversation(
      req.user.id,
      userId
    );

    res.json({
      success: true,
      data: conversation
    });
  });

  // Get conversation messages
  getConversationMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await this.messagingService.getConversationMessages(
      conversationId,
      req.user.id,
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: messages
    });
  });

  // Send message
  sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content, type = 'text', attachments } = req.body;
    
    const message = await this.messagingService.sendMessage({
      senderId: req.user.id,
      receiverId,
      content,
      type,
      attachments
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message
    });
  });

  // Mark messages as read
  markMessagesAsRead = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const count = await this.messagingService.markMessagesAsRead(
      conversationId,
      req.user.id
    );

    res.json({
      success: true,
      message: `${count} messages marked as read`,
      data: { count }
    });
  });

  // Edit message
  editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    
    const message = await this.messagingService.editMessage(
      messageId,
      content,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Message edited successfully',
      data: message
    });
  });

  // Delete message
  deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    await this.messagingService.deleteMessage(messageId, req.user.id);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  });

  // Archive conversation
  archiveConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const conversation = await this.messagingService.archiveConversation(
      conversationId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Conversation archived successfully',
      data: conversation
    });
  });

  // Block user
  blockUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await this.messagingService.blockUser(req.user.id, userId);

    res.json({
      success: true,
      message: 'User blocked successfully',
      data: result
    });
  });

  // Unblock user
  unblockUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await this.messagingService.unblockUser(req.user.id, userId);

    res.json({
      success: true,
      message: 'User unblocked successfully',
      data: result
    });
  });

  // Get unread count
  getUnreadCount = asyncHandler(async (req, res) => {
    const count = await this.messagingService.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  });

  // Search messages
  searchMessages = asyncHandler(async (req, res) => {
    const { q, conversationId, page = 1, limit = 20 } = req.query;
    
    const results = await this.messagingService.searchMessages(
      req.user.id,
      q,
      { conversationId, page: parseInt(page), limit: parseInt(limit) }
    );

    res.json({
      success: true,
      data: results
    });
  });

  // Get messaging statistics
  getMessagingStats = asyncHandler(async (req, res) => {
    const stats = await this.messagingService.getMessagingStats(req.user.id);

    res.json({
      success: true,
      data: stats
    });
  });
}






