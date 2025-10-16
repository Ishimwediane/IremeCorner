import express from 'express';
import { AnalyticsController } from '../../controllers/analytics/analyticsController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const analyticsController = new AnalyticsController();

// Public tracking endpoint
router.post('/track', analyticsController.trackEvent);

// Authenticated analytics routes
router.use(authenticateToken);

// User-specific analytics
router.get('/sales', analyticsController.getSalesAnalytics);
router.get('/revenue', analyticsController.getRevenueAnalytics);
router.get('/dashboard', analyticsController.getAnalyticsDashboard);

// Product analytics
router.get('/products', analyticsController.getProductAnalytics);

// Course analytics
router.get('/courses', analyticsController.getCourseAnalytics);

// Admin analytics
router.get('/users', requireRole(['admin']), analyticsController.getUserAnalytics);
router.get('/engagement', requireRole(['admin']), analyticsController.getEngagementAnalytics);
router.get('/conversion', requireRole(['admin']), analyticsController.getConversionAnalytics);
router.get('/performance', requireRole(['admin']), analyticsController.getPerformanceAnalytics);
router.get('/real-time', requireRole(['admin']), analyticsController.getRealTimeAnalytics);

// Custom analytics
router.post('/custom', analyticsController.getCustomAnalytics);
router.get('/export', analyticsController.exportAnalytics);

export default router;



