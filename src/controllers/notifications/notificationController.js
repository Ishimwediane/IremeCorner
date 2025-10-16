import { NotificationService } from '../../services/notifications/notificationService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  // Get user notifications
  getNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, type, isRead } = req.query;
    const notifications = await this.notificationService.getUserNotifications(
      req.user.id,
      { page: parseInt(page), limit: parseInt(limit), type, isRead }
    );

    res.json({
      success: true,
      data: notifications
    });
  });

  // Get unread count
  getUnreadCount = asyncHandler(async (req, res) => {
    const count = await this.notificationService.getUnreadCount(req.user.id);

    res.json({
      success: true,
      data: { unreadCount: count }
    });
  });

  // Mark notification as read
  markAsRead = asyncHandler(async (req, res) => {
    const notification = await this.notificationService.markAsRead(
      req.params.notificationId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  });

  // Mark all notifications as read
  markAllAsRead = asyncHandler(async (req, res) => {
    const count = await this.notificationService.markAllAsRead(req.user.id);

    res.json({
      success: true,
      message: `${count} notifications marked as read`,
      data: { count }
    });
  });

  // Delete notification
  deleteNotification = asyncHandler(async (req, res) => {
    await this.notificationService.deleteNotification(
      req.params.notificationId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  });

  // Send notification (Admin only)
  sendNotification = asyncHandler(async (req, res) => {
    const { userIds, title, message, type, priority, actionUrl } = req.body;
    
    const notifications = await this.notificationService.sendNotification({
      userIds,
      title,
      message,
      type,
      priority,
      actionUrl
    });

    res.status(201).json({
      success: true,
      message: 'Notifications sent successfully',
      data: notifications
    });
  });

  // Get notification statistics (Admin only)
  getNotificationStats = asyncHandler(async (req, res) => {
    const stats = await this.notificationService.getNotificationStats();

    res.json({
      success: true,
      data: stats
    });
  });

  // Create notification template (Admin only)
  createTemplate = asyncHandler(async (req, res) => {
    const template = await this.notificationService.createTemplate(req.body);

    res.status(201).json({
      success: true,
      message: 'Notification template created successfully',
      data: template
    });
  });

  // Send bulk notification (Admin only)
  sendBulkNotification = asyncHandler(async (req, res) => {
    const { templateId, filters, scheduledAt } = req.body;
    
    const result = await this.notificationService.sendBulkNotification({
      templateId,
      filters,
      scheduledAt
    });

    res.status(201).json({
      success: true,
      message: 'Bulk notification scheduled successfully',
      data: result
    });
  });
}




