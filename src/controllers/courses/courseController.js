import { CourseService } from '../../services/courses/courseService.js';
import { FileUploadService } from '../../services/fileUpload/fileUploadService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class CourseController {
  constructor() {
    this.courseService = new CourseService();
  }

  createCourse = asyncHandler(async (req, res) => {
    // Handle thumbnail upload to Cloudinary
    let thumbnailData = null;
    if (req.file) {
      try {
        thumbnailData = await FileUploadService.uploadCourseThumbnailToCloudinary(req.file, 'temp');
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Thumbnail upload failed',
          error: error.message
        });
      }
    }

    // Add thumbnail URL to course data
    const courseData = {
      ...req.body,
      thumbnail: thumbnailData ? thumbnailData.url : null
    };

    const course = await this.courseService.createCourse(courseData, req.user.id);

    // Update thumbnail with actual course ID
    if (thumbnailData && course.id) {
      try {
        // Re-upload with proper course ID folder structure
        const updatedThumbnail = await FileUploadService.uploadCourseThumbnailToCloudinary(req.file, course.id);
        course.thumbnail = updatedThumbnail.url;
        await this.courseService.updateCourse(course.id, { thumbnail: updatedThumbnail.url }, req.user.id);
      } catch (error) {
        console.error('Error updating thumbnail with course ID:', error);
      }
    }

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
    // Handle file uploads to Cloudinary
    let updateData = { ...req.body };

    // Handle thumbnail update
    if (req.file) {
      try {
        const thumbnailData = await FileUploadService.uploadCourseThumbnailToCloudinary(req.file, req.params.id);
        updateData.thumbnail = thumbnailData.url;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Thumbnail upload failed',
          error: error.message
        });
      }
    }

    const course = await this.courseService.updateCourse(
      req.params.id,
      updateData,
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

  uploadCourseImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    try {
      const imagesData = await FileUploadService.uploadCourseImagesToCloudinary(req.files, req.params.id);
      
      res.json({
        success: true,
        message: 'Course images uploaded successfully',
        data: imagesData
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Course images upload failed',
        error: error.message
      });
    }
  });

  uploadCourseVideos = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No videos provided'
      });
    }

    try {
      const videosData = await FileUploadService.uploadCourseVideosToCloudinary(req.files, req.params.id);
      
      res.json({
        success: true,
        message: 'Course videos uploaded successfully',
        data: videosData
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Course videos upload failed',
        error: error.message
      });
    }
  });

  uploadCourseDocuments = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No documents provided'
      });
    }

    try {
      const documentsData = await FileUploadService.uploadCourseDocumentsToCloudinary(req.files, req.params.id);
      
      res.json({
        success: true,
        message: 'Course documents uploaded successfully',
        data: documentsData
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Course documents upload failed',
        error: error.message
      });
    }
  });

  deleteCourseFile = asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    
    try {
      const result = await FileUploadService.deleteFileFromCloudinary(publicId);
      
      res.json({
        success: true,
        message: 'File deleted successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'File deletion failed',
        error: error.message
      });
    }
  });

  getCourseStatistics = asyncHandler(async (req, res) => {
    const statistics = await this.courseService.getCourseStatistics();

    res.json({
      success: true,
      data: statistics
    });
  });
}