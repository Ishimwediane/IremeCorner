import express from 'express';
import { StoreController } from '../../controllers/stores/storeController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const storeController = new StoreController();

// Public store routes
router.get('/search', storeController.searchStores);
router.get('/featured', storeController.getFeaturedStores);
router.get('/:storeId', validateUUID, storeController.getStore);
router.get('/:storeId/products', validateUUID, storeController.getStoreProducts);
router.get('/:storeId/courses', validateUUID, storeController.getStoreCourses);
router.get('/:storeId/reviews', validateUUID, storeController.getStoreReviews);
router.get('/:storeId/stats', validateUUID, storeController.getStoreStats);
router.get('/:storeId/followers', validateUUID, storeController.getStoreFollowers);

// Authenticated routes
router.use(authenticateToken);

// Store management
router.get('/my-store', storeController.getMyStore);
router.post('/', storeController.createStore);
router.put('/:storeId', validateUUID, storeController.updateStore);
router.get('/:storeId/analytics', validateUUID, storeController.getStoreAnalytics);

// Store following
router.post('/:storeId/follow', validateUUID, storeController.followStore);
router.delete('/:storeId/follow', validateUUID, storeController.unfollowStore);

// Admin routes
router.put('/:storeId/verify', validateUUID, requireRole(['admin']), storeController.verifyStore);
router.put('/:storeId/suspend', validateUUID, requireRole(['admin']), storeController.suspendStore);

export default router;




