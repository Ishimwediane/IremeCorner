import express from 'express';
import { CertificateController } from '../../controllers/courses/certificateController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const certificateController = new CertificateController();

// Public routes
router.post('/verify', certificateController.verifyCertificate);

// Authenticated routes
router.use(authenticateToken);

// Student routes
router.get('/my-certificates', certificateController.getMyCertificates);
router.get('/:certificateId', validateUUID, certificateController.getCertificateById);
router.get('/:certificateId/download', validateUUID, certificateController.downloadCertificate);

// Trainer and Admin routes
router.get('/courses/:courseId', validateUUID, requireRole(['trainer', 'admin']), certificateController.getCourseCertificates);

// Admin routes
router.post('/issue', requireRole(['admin']), certificateController.issueCertificate);
router.put('/:certificateId/revoke', validateUUID, requireRole(['admin']), certificateController.revokeCertificate);

export default router;
