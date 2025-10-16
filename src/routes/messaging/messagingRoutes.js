import express from 'express';
import { MessagingController } from '../../controllers/messaging/messagingController.js';
import { authenticateToken } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const messagingController = new MessagingController();

// All routes require authentication
router.use(authenticateToken);

// Conversation management
router.get('/conversations', messagingController.getConversations);
router.get('/conversations/:userId', validateUUID, messagingController.getOrCreateConversation);
router.get('/conversations/:conversationId/messages', validateUUID, messagingController.getConversationMessages);
router.put('/conversations/:conversationId/archive', validateUUID, messagingController.archiveConversation);

// Message management
router.post('/send', messagingController.sendMessage);
router.put('/messages/:messageId', validateUUID, messagingController.editMessage);
router.delete('/messages/:messageId', validateUUID, messagingController.deleteMessage);
router.put('/conversations/:conversationId/read', validateUUID, messagingController.markMessagesAsRead);

// User management
router.post('/block/:userId', validateUUID, messagingController.blockUser);
router.post('/unblock/:userId', validateUUID, messagingController.unblockUser);

// Statistics and search
router.get('/unread-count', messagingController.getUnreadCount);
router.get('/search', messagingController.searchMessages);
router.get('/stats', messagingController.getMessagingStats);

export default router;



