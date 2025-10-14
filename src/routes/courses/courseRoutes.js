import express from 'express';
import { CourseController } from '../../controllers/courses/courseController.js';
import { authenticateToken, requireRole, optionalAuth } from '../../middleware/auth/auth.js';
import { uploadCourseImages, uploadCourseThumbnail } from '../../services/fileUpload/fileUploadService.js';
import {
  validateCourseCreation,
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const courseController = new CourseController();

// Public routes
router.get('/', validatePagination, courseController.getCourses);
router.get('/featured', courseController.getFeaturedCourses);
router.get('/popular', courseController.getPopularCourses);
router.get('/new', courseController.getNewCourses);
router.get('/:id', validateUUID, courseController.getCourseById);

// Protected routes
router.use(authenticateToken);

// Student routes
router.post('/:id/enroll', validateUUID, courseController.enrollInCourse);
router.get('/my-enrollments', validatePagination, courseController.getMyEnrollments);
router.put('/enrollments/:enrollmentId/progress', courseController.updateEnrollmentProgress);
router.put('/enrollments/:enrollmentId/complete-lesson', courseController.markLessonComplete);

// Instructor routes
router.post('/', requireRole('artisan'), uploadCourseThumbnail, validateCourseCreation, courseController.createCourse);
router.put('/:id', validateUUID, uploadCourseImages, courseController.updateCourse);
router.delete('/:id', validateUUID, courseController.deleteCourse);

// Admin routes
router.put('/:id/rating', requireRole('admin'), validateUUID, courseController.updateCourseRating);
router.get('/statistics', requireRole('admin'), courseController.getCourseStatistics);

export default router;
