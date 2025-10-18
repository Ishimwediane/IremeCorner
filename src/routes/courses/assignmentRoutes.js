import express from 'express';
import { AssignmentController } from '../../controllers/courses/assignmentController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateAssignmentCreation, validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const assignmentController = new AssignmentController();

/**
 * @swagger
 * components:
 *   schemas:
 *     AssignmentRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - instructions
 *         - dueDate
 *         - maxPoints
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: Assignment title
 *           example: JavaScript Variables Assignment
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           description: Assignment description
 *           example: Create variables using different data types and demonstrate their usage
 *         instructions:
 *           type: string
 *           minLength: 10
 *           maxLength: 5000
 *           description: Detailed instructions
 *           example: Write JavaScript code that demonstrates the use of var, let, and const keywords
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Assignment due date
 *           example: 2024-02-15T23:59:59Z
 *         maxPoints:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           description: Maximum points for assignment
 *           example: 100
 *         type:
 *           type: string
 *           enum: [assignment, quiz, project]
 *           description: Assignment type
 *           example: assignment
 *     
 *     AssignmentSubmission:
 *       type: object
 *       required:
 *         - submission
 *       properties:
 *         submission:
 *           type: string
 *           description: Assignment submission content
 *           example: Here is my JavaScript code...
 *         notes:
 *           type: string
 *           description: Additional notes
 *           example: I completed the assignment as requested
 *     
 *     AssignmentGrade:
 *       type: object
 *       required:
 *         - grade
 *       properties:
 *         grade:
 *           type: number
 *           minimum: 0
 *           description: Grade received
 *           example: 85
 *         feedback:
 *           type: string
 *           description: Instructor feedback
 *           example: Good work! You correctly used all three variable types
 */

/**
 * @swagger
 * /assignments/{assignmentId}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 */
router.get('/:assignmentId', validateUUID, assignmentController.getAssignmentById);

/**
 * @swagger
 * /assignments/courses/{courseId}/my-submissions:
 *   get:
 *     summary: Get my submissions for course assignments
 *     tags: [Assignments]
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
 *         description: Submissions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 */
router.get('/courses/:courseId/my-submissions', assignmentController.getMySubmissions);

/**
 * @swagger
 * /assignments/{assignmentId}/submit:
 *   post:
 *     summary: Submit assignment
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentSubmission'
 *     responses:
 *       201:
 *         description: Assignment submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Assignment not found
 *       409:
 *         description: Already submitted
 */
router.post('/:assignmentId/submit', validateUUID, assignmentController.submitAssignment);

/**
 * @swagger
 * /assignments/courses/{courseId}:
 *   get:
 *     summary: Get course assignments (Trainer/Admin only)
 *     tags: [Assignments]
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
 *         description: Course assignments retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Course not found
 */
router.get('/courses/:courseId', validateUUID, assignmentController.getCourseAssignments);

/**
 * @swagger
 * /assignments/courses/{courseId}:
 *   post:
 *     summary: Create assignment for course (Trainer/Admin only)
 *     tags: [Assignments]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentRequest'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Course not found
 */
router.post('/courses/:courseId', requireRole(['trainer', 'admin']), validateAssignmentCreation, assignmentController.createAssignment);

/**
 * @swagger
 * /assignments/{assignmentId}:
 *   put:
 *     summary: Update assignment (Trainer/Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentRequest'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Assignment not found
 */
router.put('/:assignmentId', validateUUID, requireRole(['trainer', 'admin']), assignmentController.updateAssignment);

/**
 * @swagger
 * /assignments/{assignmentId}:
 *   delete:
 *     summary: Delete assignment (Trainer/Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Assignment not found
 */
router.delete('/:assignmentId', validateUUID, requireRole(['trainer', 'admin']), assignmentController.deleteAssignment);

/**
 * @swagger
 * /assignments/submissions/{submissionId}/grade:
 *   put:
 *     summary: Grade assignment submission (Trainer/Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentGrade'
 *     responses:
 *       200:
 *         description: Assignment graded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Submission not found
 */
router.put('/submissions/:submissionId/grade', requireRole(['trainer', 'admin']), assignmentController.gradeAssignment);

/**
 * @swagger
 * /assignments/courses/{courseId}/analytics:
 *   get:
 *     summary: Get assignment analytics for course (Trainer/Admin only)
 *     tags: [Assignments]
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
 *         description: Assignment analytics retrieved successfully
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
 *                     totalAssignments:
 *                       type: integer
 *                     averageGrade:
 *                       type: number
 *                     submissionRate:
 *                       type: number
 *                     gradeDistribution:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Trainer/Admin role required
 *       404:
 *         description: Course not found
 */
router.get('/courses/:courseId/analytics', validateUUID, requireRole(['trainer', 'admin']), assignmentController.getAssignmentAnalytics);

export default router;






