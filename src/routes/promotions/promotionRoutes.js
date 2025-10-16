import express from 'express';
import { PromotionController } from '../../controllers/promotions/promotionController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const promotionController = new PromotionController();

// Public promotion routes
router.get('/', promotionController.getPromotions);
router.get('/code/:code', promotionController.getPromotionByCode);
router.post('/validate', promotionController.validatePromotionCode);
router.get('/available', promotionController.getAvailablePromotions);

// Authenticated routes
router.use(authenticateToken);

// User promotion usage
router.get('/:promotionId/usage', validateUUID, promotionController.getUserPromotionUsage);
router.post('/apply', promotionController.applyPromotion);

// Admin promotion management
router.post('/', requireRole(['admin']), promotionController.createPromotion);
router.put('/:promotionId', validateUUID, requireRole(['admin']), promotionController.updatePromotion);
router.delete('/:promotionId', validateUUID, requireRole(['admin']), promotionController.deletePromotion);
router.put('/:promotionId/activate', validateUUID, requireRole(['admin']), promotionController.activatePromotion);
router.put('/:promotionId/pause', validateUUID, requireRole(['admin']), promotionController.pausePromotion);

// Admin analytics and templates
router.get('/:promotionId/analytics', validateUUID, requireRole(['admin']), promotionController.getPromotionAnalytics);
router.get('/:promotionId/stats', validateUUID, requireRole(['admin']), promotionController.getPromotionStats);
router.get('/templates', requireRole(['admin']), promotionController.getPromotionTemplates);
router.post('/from-template', requireRole(['admin']), promotionController.createFromTemplate);

export default router;



