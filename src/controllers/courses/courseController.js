import { CourseService } from '../../services/courses/courseService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class CourseController {
  constructor() {
    this.courseService = new CourseService();
  }

  createCourse = asyncHandler(async (req, res) => {
    const course = await this.courseService.createCourse(req.body, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  });

  getCourses = asyncHandler(async (req, res) => {
    const result = await this.courseService.getCourses(req.query);

    res.json({
      success: true,
      data: result
    });
  });

  getCourseById = asyncHandler(async (req, res) => {
    const course = await this.courseService.getCourseById(req.params.id);

    res.json({
      success: true,
      data: course
    });
  });

  updateCourse = asyncHandler(async (req, res) => {
    const course = await this.courseService.updateCourse(
      req.params.id,
      req.body,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  });

  deleteCourse = asyncHandler(async (req, res) => {
    const result = await this.courseService.deleteCourse(req.params.id, req.user.id);

    res.json({
      success: true,
      message: result.message
    });
  });

  enrollInCourse = asyncHandler(async (req, res) => {
    const enrollment = await this.courseService.enrollInCourse(
      req.params.id,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment
    });
  });

  getMyEnrollments = asyncHandler(async (req, res) => {
    const result = await this.courseService.getStudentEnrollments(req.user.id, req.query);

    res.json({
      success: true,
      data: result
    });
  });

  updateEnrollmentProgress = asyncHandler(async (req, res) => {
    const { lessonIndex, totalLessons } = req.body;
    const enrollment = await this.courseService.updateEnrollmentProgress(
      req.params.enrollmentId,
      lessonIndex,
      totalLessons,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: enrollment
    });
  });

  markLessonComplete = asyncHandler(async (req, res) => {
    const { lessonId } = req.body;
    const enrollment = await this.courseService.markLessonComplete(
      req.params.enrollmentId,
      lessonId,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Lesson marked as complete',
      data: enrollment
    });
  });

  getFeaturedCourses = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await this.courseService.getFeaturedCourses(limit);

    res.json({
      success: true,
      data: courses
    });
  });

  getPopularCourses = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await this.courseService.getPopularCourses(limit);

    res.json({
      success: true,
      data: courses
    });
  });

  getNewCourses = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await this.courseService.getNewCourses(limit);

    res.json({
      success: true,
      data: courses
    });
  });

  updateCourseRating = asyncHandler(async (req, res) => {
    const { rating } = req.body;
    const course = await this.courseService.updateCourseRating(req.params.id, rating);

    res.json({
      success: true,
      message: 'Course rating updated successfully',
      data: course
    });
  });

  getCourseStatistics = asyncHandler(async (req, res) => {
    const statistics = await this.courseService.getCourseStatistics();

    res.json({
      success: true,
      data: statistics
    });
  });
}
