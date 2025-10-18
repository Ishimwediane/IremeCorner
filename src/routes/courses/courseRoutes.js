import express from 'express';
import { CourseController } from '../../controllers/courses/courseController.js';
import { authenticateToken, requireRole, optionalAuth } from '../../middleware/auth/auth.js';
import { uploadCourseImages, uploadCourseThumbnail, uploadCourseVideos, uploadCourseDocuments } from '../../services/fileUpload/fileUploadService.js';
import {
  validateCourseCreation,
  validateUUID,
  validatePagination
} from '../../middleware/validation/validation.js';

const router = express.Router();
const courseController = new CourseController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: Course title
 *           example: Learn JavaScript Fundamentals
 *         description:
 *           type: string
 *           minLength: 20
 *           maxLength: 2000
 *           description: Course description
 *           example: A comprehensive course covering JavaScript basics, ES6 features, and modern development practices
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Course price
 *           example: 49.99
 *         categoryId:
 *           type: string
 *           format: uuid
 *           description: Category ID
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Course difficulty level
 *           example: beginner
 *         duration:
 *           type: integer
 *           minimum: 0
 *           description: Course duration in minutes
 *           example: 120
 *     
 *     EnrollmentProgress:
 *       type: object
 *       required:
 *         - progress
 *       properties:
 *         progress:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: Progress percentage
 *           example: 50
 *     
 *     LessonComplete:
 *       type: object
 *       required:
 *         - lessonId
 *       properties:
 *         lessonId:
 *           type: string
 *           format: uuid
 *           description: Lesson ID
 *     
 *     CourseRating:
 *       type: object
 *       required:
 *         - rating
 *       properties:
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: Course rating
 *           example: 4.5
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by course level
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
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
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                     pagination:
 *                       type: object
 */
router.get('/', validatePagination, courseController.getCourses);

/**
 * @swagger
 * /courses/featured:
 *   get:
 *     summary: Get featured courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Featured courses retrieved successfully
 */
router.get('/featured', courseController.getFeaturedCourses);

/**
 * @swagger
 * /courses/popular:
 *   get:
 *     summary: Get popular courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Popular courses retrieved successfully
 */
router.get('/popular', courseController.getPopularCourses);

/**
 * @swagger
 * /courses/new:
 *   get:
 *     summary: Get new courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: New courses retrieved successfully
 */
router.get('/new', courseController.getNewCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 */
router.get('/:id', validateUUID, courseController.getCourseById);

// Protected routes
router.use(authenticateToken);

/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Enroll in course (Student only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course ID
 *     responses:
 *       201:
 *         description: Successfully enrolled in course
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
 *                   example: Successfully enrolled in course
 *                 data:
 *                   type: object
 *                   properties:
 *                     enrollment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         courseId:
 *                           type: string
 *                           format: uuid
 *                         userId:
 *                           type: string
 *                           format: uuid
 *                         enrolledAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course not found
 *       409:
 *         description: Already enrolled in course
 */
router.post('/:id/enroll', validateUUID, courseController.enrollInCourse);

/**
 * @swagger
 * /courses/my-enrollments:
 *   get:
 *     summary: Get my enrollments (Student only)
 *     tags: [Courses]
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
 *         description: Enrollments retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/my-enrollments', validatePagination, courseController.getMyEnrollments);

/**
 * @swagger
 * /courses/enrollments/{enrollmentId}/progress:
 *   put:
 *     summary: Update enrollment progress (Student only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentProgress'
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enrollment not found
 */
router.put('/enrollments/:enrollmentId/progress', courseController.updateEnrollmentProgress);

/**
 * @swagger
 * /courses/enrollments/{enrollmentId}/complete-lesson:
 *   put:
 *     summary: Mark lesson as complete (Student only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Enrollment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LessonComplete'
 *     responses:
 *       200:
 *         description: Lesson marked as complete
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Enrollment or lesson not found
 */
router.put('/enrollments/:enrollmentId/complete-lesson', courseController.markLessonComplete);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course (Instructor only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CourseRequest'
 *     responses:
 *       201:
 *         description: Course created successfully
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
 *                   example: Course created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor role required
 */
router.post('/', requireRole('artisan'), uploadCourseThumbnail, validateCourseCreation, courseController.createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update course (Instructor only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CourseRequest'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor role required
 *       404:
 *         description: Course not found
 */
router.put('/:id', validateUUID, uploadCourseThumbnail, courseController.updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete course (Instructor only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Instructor role required
 *       404:
 *         description: Course not found
 */
router.delete('/:id', validateUUID, courseController.deleteCourse);

// Course file upload routes
router.post('/:id/images', requireRole('artisan'), validateUUID, uploadCourseImages, courseController.uploadCourseImages);
router.post('/:id/videos', requireRole('artisan'), validateUUID, uploadCourseVideos, courseController.uploadCourseVideos);
router.post('/:id/documents', requireRole('artisan'), validateUUID, uploadCourseDocuments, courseController.uploadCourseDocuments);
router.delete('/files/:publicId', requireRole('artisan'), courseController.deleteCourseFile);

/**
 * @swagger
 * /courses/{id}/rating:
 *   put:
 *     summary: Update course rating (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             $ref: '#/components/schemas/CourseRating'
 *     responses:
 *       200:
 *         description: Course rating updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Course not found
 */
router.put('/:id/rating', requireRole('admin'), validateUUID, courseController.updateCourseRating);

/**
 * @swagger
 * /courses/statistics:
 *   get:
 *     summary: Get course statistics (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
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
 *                     totalCourses:
 *                       type: integer
 *                     totalEnrollments:
 *                       type: integer
 *                     coursesByLevel:
 *                       type: object
 *                     monthlyStats:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/statistics', requireRole('admin'), courseController.getCourseStatistics);

export default router;
