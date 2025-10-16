import express from 'express';
import { AssignmentController } from '../../controllers/courses/assignmentController.js';
import { authenticateToken, requireRole } from '../../middleware/auth/auth.js';
import { validateAssignmentCreation, validateUUID } from '../../middleware/validation/validation.js';

const router = express.Router();
const assignmentController = new AssignmentController();

// Public routes
router.get('/:assignmentId', validateUUID, assignmentController.getAssignmentById);

// Authenticated routes
router.use(authenticateToken);

// Student routes
router.get('/courses/:courseId/my-submissions', assignmentController.getMySubmissions);
router.post('/:assignmentId/submit', validateUUID, assignmentController.submitAssignment);

// Trainer and Admin routes
router.get('/courses/:courseId', validateUUID, assignmentController.getCourseAssignments);
router.post('/courses/:courseId', requireRole(['trainer', 'admin']), validateAssignmentCreation, assignmentController.createAssignment);
router.put('/:assignmentId', validateUUID, requireRole(['trainer', 'admin']), assignmentController.updateAssignment);
router.delete('/:assignmentId', validateUUID, requireRole(['trainer', 'admin']), assignmentController.deleteAssignment);
router.put('/submissions/:submissionId/grade', requireRole(['trainer', 'admin']), assignmentController.gradeAssignment);
router.get('/courses/:courseId/analytics', validateUUID, requireRole(['trainer', 'admin']), assignmentController.getAssignmentAnalytics);

export default router;



