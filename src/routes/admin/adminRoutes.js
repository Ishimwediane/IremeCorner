import express from 'express';
import { AdminController } from '../../controllers/admin/adminController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const adminController = new AdminController();

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireRole(['admin']));

// System logs
router.get('/logs', adminController.getSystemLogs);
router.get('/logs/:logId', validateUUID, adminController.getSystemLog);
router.put('/logs/:logId/resolve', validateUUID, adminController.markLogAsResolved);

// System settings
router.get('/settings', adminController.getSystemSettings);
router.get('/settings/:key', adminController.getSystemSetting);
router.put('/settings/:key', adminController.updateSystemSetting);
router.post('/settings/bulk-update', adminController.bulkUpdateSettings);
router.put('/settings/:key/reset', adminController.resetSettingToDefault);

// System dashboard and health
router.get('/dashboard', adminController.getSystemDashboard);
router.get('/health', adminController.getSystemHealth);
router.get('/statistics', adminController.getSystemStatistics);
router.get('/performance', adminController.getSystemPerformance);

// User management
router.get('/users', adminController.getUserManagement);
router.put('/users/:userId/status', validateUUID, adminController.updateUserStatus);

// System backups
router.get('/backups', adminController.getSystemBackups);
router.post('/backups', adminController.createSystemBackup);
router.post('/backups/restore', adminController.restoreSystemBackup);

// System maintenance
router.get('/maintenance', adminController.getSystemMaintenance);
router.post('/maintenance/schedule', adminController.scheduleMaintenance);

// System alerts
router.get('/alerts', adminController.getSystemAlerts);
router.put('/alerts/:alertId/dismiss', validateUUID, adminController.dismissSystemAlert);

// System utilities
router.post('/cache/clear', adminController.clearSystemCache);

export default router;
