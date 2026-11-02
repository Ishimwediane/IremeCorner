import express from 'express';
import { ContactController } from '../../controllers/contact/contactController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { contactLimiter } from '../../middleware/rateLimit/rateLimit.js';
import {
  validateContactMessage,
  validateContactStatus,
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const contactController = new ContactController();

// Public route: contact form submissions
router.post('/', contactLimiter, validateContactMessage, contactController.createMessage);

// Admin routes
router.use(authenticateToken, requireRole('admin'));

router.get('/', validatePagination, contactController.getMessages);
router.patch('/:id', validateUUID, validateContactStatus, contactController.updateStatus);
router.delete('/:id', validateUUID, contactController.deleteMessage);

export default router;
