import express from 'express';
import { NotificationController } from '../../controllers/notifications/notificationController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const notificationController = new NotificationController();

// All routes require authentication
router.use(authenticateToken);

// User notification routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:notificationId/read', validateUUID, notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:notificationId', validateUUID, notificationController.deleteNotification);

// Admin notification routes
router.post('/send', requireRole(['admin']), notificationController.sendNotification);
router.post('/bulk-send', requireRole(['admin']), notificationController.sendBulkNotification);
router.post('/templates', requireRole(['admin']), notificationController.createTemplate);
router.get('/stats', requireRole(['admin']), notificationController.getNotificationStats);

export default router;




