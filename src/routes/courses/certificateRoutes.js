import express from 'express';
import { CertificateController } from '../../controllers/courses/certificateController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const certificateController = new CertificateController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CertificateVerification:
 *       type: object
 *       required:
 *         - certificateId
 *       properties:
 *         certificateId:
 *           type: string
 *           format: uuid
 *           description: Certificate ID to verify
 *           example: cert_123456789
 *     
 *     CertificateIssue:
 *       type: object
 *       required:
 *         - userId
 *         - courseId
 *         - grade
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *           description: User ID to issue certificate to
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Course ID
 *         grade:
 *           type: string
 *           description: Grade received
 *           example: A
 *         issuedDate:
 *           type: string
 *           format: date-time
 *           description: Issue date
 *           example: 2024-01-15T00:00:00Z
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Certificate expiry date
 *         notes:
 *           type: string
 *           description: Additional notes
 */

/**
 * @swagger
 * /certificates/verify:
 *   post:
 *     summary: Verify certificate (Public)
 *     tags: [Certificates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CertificateVerification'
 *     responses:
 *       200:
 *         description: Certificate verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                     certificate:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         userId:
 *                           type: string
 *                           format: uuid
 *                         courseId:
 *                           type: string
 *                           format: uuid
 *                         grade:
 *                           type: string
 *                         issuedDate:
 *                           type: string
 *                           format: date-time
 *                         expiryDate:
 *                           type: string
 *                           format: date-time
 *                         isRevoked:
 *                           type: boolean
 *       404:
 *         description: Certificate not found
 */
router.post('/verify', certificateController.verifyCertificate);

/**
 * @swagger
 * /certificates/my-certificates:
 *   get:
 *     summary: Get my certificates (Student only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Certificates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     certificates:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Certificate'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/my-certificates', certificateController.getMyCertificates);

/**
 * @swagger
 * /certificates/{certificateId}:
 *   get:
 *     summary: Get certificate by ID
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certificate ID
 *     responses:
 *       200:
 *         description: Certificate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Certificate'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 */
router.get('/:certificateId', validateUUID, certificateController.getCertificateById);

/**
 * @swagger
 * /certificates/{certificateId}/download:
 *   get:
 *     summary: Download certificate PDF
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certificate ID
 *     responses:
 *       200:
 *         description: Certificate PDF downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Certificate not found
 */
router.get('/:certificateId/download', validateUUID, certificateController.downloadCertificate);

/**
 * @swagger
 * /certificates/courses/{courseId}:
 *   get:
 *     summary: Get course certificates (Trainer/Admin only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course certificates retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Course not found
 */
router.get('/courses/:courseId', validateUUID, requireRole(['trainer', 'admin']), certificateController.getCourseCertificates);

/**
 * @swagger
 * /certificates/issue:
 *   post:
 *     summary: Issue certificate (Admin only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CertificateIssue'
 *     responses:
 *       201:
 *         description: Certificate issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Certificate issued successfully
 *                 data:
 *                   $ref: '#/components/schemas/Certificate'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: User or course not found
 *       409:
 *         description: Certificate already exists
 */
router.post('/issue', requireRole(['admin']), certificateController.issueCertificate);

/**
 * @swagger
 * /certificates/{certificateId}/revoke:
 *   put:
 *     summary: Revoke certificate (Admin only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Certificate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for revocation
 *                 example: Academic misconduct
 *     responses:
 *       200:
 *         description: Certificate revoked successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Certificate not found
 */
router.put('/:certificateId/revoke', validateUUID, requireRole(['admin']), certificateController.revokeCertificate);

export default router;






