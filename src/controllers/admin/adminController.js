import { AdminService } from '../../services/admin/adminService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class AdminController {
  constructor() {
    this.adminService = new AdminService();
  }

  // Get system logs
  getSystemLogs = asyncHandler(async (req, res) => {
    const { page = 1, limit = 50, level, category, userId } = req.query;
    const logs = await this.adminService.getSystemLogs({
      page: parseInt(page),
      limit: parseInt(limit),
      level,
      category,
      userId
    });

    res.json({
      success: true,
      data: logs
    });
  });

  // Get system log by ID
  getSystemLog = asyncHandler(async (req, res) => {
    const log = await this.adminService.getSystemLog(req.params.logId);

    res.json({
      success: true,
      data: log
    });
  });

  // Mark log as resolved
  markLogAsResolved = asyncHandler(async (req, res) => {
    const log = await this.adminService.markLogAsResolved(req.params.logId);

    res.json({
      success: true,
      message: 'Log marked as resolved',
      data: log
    });
  });

  // Get system settings
  getSystemSettings = asyncHandler(async (req, res) => {
    const { category, isPublic } = req.query;
    const settings = await this.adminService.getSystemSettings({
      category,
      isPublic: isPublic === 'true'
    });

    res.json({
      success: true,
      data: settings
    });
  });

  // Get system setting by key
  getSystemSetting = asyncHandler(async (req, res) => {
    const setting = await this.adminService.getSystemSetting(req.params.key);

    res.json({
      success: true,
      data: setting
    });
  });

  // Update system setting
  updateSystemSetting = asyncHandler(async (req, res) => {
    const { value } = req.body;
    const setting = await this.adminService.updateSystemSetting(
      req.params.key,
      value,
      req.user.id
    );

    res.json({
      success: true,
      message: 'System setting updated successfully',
      data: setting
    });
  });

  // Bulk update system settings
  bulkUpdateSettings = asyncHandler(async (req, res) => {
    const { settings } = req.body;
    const result = await this.adminService.bulkUpdateSettings(
      settings,
      req.user.id
    );

    res.json({
      success: true,
      message: 'System settings updated successfully',
      data: result
    });
  });

  // Reset setting to default
  resetSettingToDefault = asyncHandler(async (req, res) => {
    const setting = await this.adminService.resetSettingToDefault(
      req.params.key
    );

    res.json({
      success: true,
      message: 'Setting reset to default',
      data: setting
    });
  });

  // Get system dashboard
  getSystemDashboard = asyncHandler(async (req, res) => {
    const dashboard = await this.adminService.getSystemDashboard();

    res.json({
      success: true,
      data: dashboard
    });
  });

  // Get system health
  getSystemHealth = asyncHandler(async (req, res) => {
    const health = await this.adminService.getSystemHealth();

    res.json({
      success: true,
      data: health
    });
  });

  // Get system statistics
  getSystemStatistics = asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    const stats = await this.adminService.getSystemStatistics(period);

    res.json({
      success: true,
      data: stats
    });
  });

  // Get user management data
  getUserManagement = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, role, status } = req.query;
    const users = await this.adminService.getUserManagement({
      page: parseInt(page),
      limit: parseInt(limit),
      role,
      status
    });

    res.json({
      success: true,
      data: users
    });
  });

  // Update user status
  updateUserStatus = asyncHandler(async (req, res) => {
    const { status, reason } = req.body;
    const user = await this.adminService.updateUserStatus(
      req.params.userId,
      status,
      reason,
      req.user.id
    );

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  });

  // Get system backups
  getSystemBackups = asyncHandler(async (req, res) => {
    const backups = await this.adminService.getSystemBackups();

    res.json({
      success: true,
      data: backups
    });
  });

  // Create system backup
  createSystemBackup = asyncHandler(async (req, res) => {
    const { type, description } = req.body;
    const backup = await this.adminService.createSystemBackup(
      type,
      description,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'System backup created successfully',
      data: backup
    });
  });

  // Restore system backup
  restoreSystemBackup = asyncHandler(async (req, res) => {
    const { backupId } = req.body;
    const result = await this.adminService.restoreSystemBackup(
      backupId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'System backup restored successfully',
      data: result
    });
  });

  // Get system maintenance
  getSystemMaintenance = asyncHandler(async (req, res) => {
    const maintenance = await this.adminService.getSystemMaintenance();

    res.json({
      success: true,
      data: maintenance
    });
  });

  // Schedule system maintenance
  scheduleMaintenance = asyncHandler(async (req, res) => {
    const { scheduledAt, duration, description } = req.body;
    const maintenance = await this.adminService.scheduleMaintenance(
      scheduledAt,
      duration,
      description,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'System maintenance scheduled successfully',
      data: maintenance
    });
  });

  // Get system alerts
  getSystemAlerts = asyncHandler(async (req, res) => {
    const alerts = await this.adminService.getSystemAlerts();

    res.json({
      success: true,
      data: alerts
    });
  });

  // Dismiss system alert
  dismissSystemAlert = asyncHandler(async (req, res) => {
    await this.adminService.dismissSystemAlert(req.params.alertId);

    res.json({
      success: true,
      message: 'System alert dismissed'
    });
  });

  // Clear system cache
  clearSystemCache = asyncHandler(async (req, res) => {
    const result = await this.adminService.clearSystemCache();

    res.json({
      success: true,
      message: 'System cache cleared successfully',
      data: result
    });
  });

  // Get system performance
  getSystemPerformance = asyncHandler(async (req, res) => {
    const performance = await this.adminService.getSystemPerformance();

    res.json({
      success: true,
      data: performance
    });
  });
}
