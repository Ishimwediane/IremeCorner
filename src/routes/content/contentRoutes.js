import express from 'express';
import { ContentController } from '../../controllers/content/contentController.js';
import { authenticateToken, requireRole, optionalAuth } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';
import { uploadMediaFile } from '../../services/fileUpload/fileUploadService.js';

const router = express.Router();
const contentController = new ContentController();

// Public routes
router.get('/pages', optionalAuth, contentController.getContentPages);
router.get('/pages/:slug', contentController.getContentPage);
router.get('/search', contentController.searchContent);

// Authenticated routes
router.use(authenticateToken);

// Content page management
router.post('/pages', requireRole(['admin', 'trainer']), contentController.createContentPage);
router.put('/pages/:pageId', validateUUID, requireRole(['admin', 'trainer']), contentController.updateContentPage);
router.delete('/pages/:pageId', validateUUID, requireRole(['admin']), contentController.deleteContentPage);
router.put('/pages/:pageId/publish', validateUUID, requireRole(['admin', 'trainer']), contentController.publishContentPage);
router.put('/pages/:pageId/schedule', validateUUID, requireRole(['admin', 'trainer']), contentController.scheduleContentPage);
router.put('/pages/:pageId/archive', validateUUID, requireRole(['admin', 'trainer']), contentController.archiveContentPage);

// Media file management
router.get('/media', contentController.getMediaFiles);
router.post('/media/upload', uploadMediaFile, contentController.uploadMediaFile);
router.get('/media/:fileId', validateUUID, contentController.getMediaFile);
router.put('/media/:fileId', validateUUID, contentController.updateMediaFile);
router.delete('/media/:fileId', validateUUID, contentController.deleteMediaFile);

// Templates and bulk operations
router.get('/templates', requireRole(['admin', 'trainer']), contentController.getContentTemplates);
router.post('/from-template', requireRole(['admin', 'trainer']), contentController.createFromTemplate);
router.post('/bulk-update', requireRole(['admin']), contentController.bulkUpdateContent);

// Analytics and export
router.get('/analytics', requireRole(['admin']), contentController.getContentAnalytics);
router.get('/export', requireRole(['admin']), contentController.exportContent);

export default router;






