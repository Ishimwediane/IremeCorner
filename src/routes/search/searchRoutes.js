import express from 'express';
import { SearchController } from '../../controllers/search/searchController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';

const router = express.Router();
const searchController = new SearchController();

// Public search routes
router.get('/global', searchController.globalSearch);
router.get('/products', searchController.searchProducts);
router.get('/courses', searchController.searchCourses);
router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/popular', searchController.getPopularSearches);
router.get('/filters', searchController.getSearchFilters);

// Save search (optional authentication)
router.post('/save', searchController.saveSearch);

// Admin search routes
router.get('/users', authenticateToken, requireRole(['admin']), searchController.searchUsers);
router.get('/analytics', authenticateToken, requireRole(['admin']), searchController.getSearchAnalytics);

// Advanced search (authenticated)
router.post('/advanced', authenticateToken, searchController.advancedSearch);

export default router;
