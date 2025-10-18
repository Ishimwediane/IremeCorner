import express from 'express';
import { AchievementController } from '../../controllers/courses/achievementController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const achievementController = new AchievementController();

// Public routes
router.get('/', achievementController.getAllAchievements);

// Authenticated routes
router.use(authenticateToken);

// Student routes
router.get('/my-achievements', achievementController.getMyAchievements);
router.post('/check/:courseId', validateUUID, achievementController.checkAchievements);

// Admin routes
router.post('/', requireRole(['admin']), achievementController.createAchievement);
router.put('/:achievementId', validateUUID, requireRole(['admin']), achievementController.updateAchievement);
router.delete('/:achievementId', validateUUID, requireRole(['admin']), achievementController.deleteAchievement);
router.post('/:achievementId/award', validateUUID, requireRole(['admin']), achievementController.awardAchievement);

export default router;






