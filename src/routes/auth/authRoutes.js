import express from 'express';
import { AuthController } from '../../controllers/auth/authController.js';
import { authenticateToken, requireRole, requireEmailVerification } from '../../middleware/auth/auth.js';
import { authLimiter, passwordResetLimiter } from '../../middleware/rateLimit/rateLimit.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateUUID
} from '../../middleware/validation/validation.js';

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', authLimiter, validateUserRegistration, authController.register);
router.post('/login', authLimiter, validateUserLogin, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/reset-password', passwordResetLimiter, authController.resetPassword);
router.post('/confirm-password-reset', passwordResetLimiter, authController.confirmPasswordReset);
router.get('/verify-email/:userId', validateUUID, authController.verifyEmail);

// Protected routes
router.use(authenticateToken);

router.get('/profile', authController.getProfile);
router.put('/profile', validateUserUpdate, authController.updateProfile);
router.put('/change-password', authController.changePassword);
router.delete('/deactivate', authController.deactivateAccount);

export default router;



