import { AppDataSource } from '../../config/database.js';
import { CourseSchema, CourseStatus, CourseLevel } from '../../entities/courses/Course.js';
import { EnrollmentSchema, EnrollmentStatus } from '../../entities/courses/Enrollment.js';
import { CategorySchema } from '../../entities/products/Category.js';
import { UserSchema } from '../../entities/auth/User.js';
import { AppError } from '../../middleware/error/errorHandler.js';

export class CourseService {
  constructor() {
    this.courseRepository = AppDataSource.getRepository(CourseSchema);
    this.enrollmentRepository = AppDataSource.getRepository(EnrollmentSchema);
    this.categoryRepository = AppDataSource.getRepository(CategorySchema);
    this.userRepository = AppDataSource.getRepository(UserSchema);
  }

  async createCourse(courseData, instructorId) {
    const { categoryId, ...courseInfo } = courseData;

    // Verify instructor exists
    const instructor = await this.userRepository.findOne({ 
      where: { id: instructorId, role: 'artisan' } 
    });
    if (!instructor) {
      throw new AppError('Instructor not found', 404);
    }

    // Verify category exists
    const category = await this.categoryRepository.findOne({ 
      where: { id: categoryId, type: 'course' } 
    });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const course = this.courseRepository.create({
      ...courseInfo,
      instructorId,
      categoryId,
      status: CourseStatus.DRAFT
    });

    return await this.courseRepository.save(course);
  }

  async getCourses(filters = {}) {
    const {
      page = 1,
      limit = 20,
      categoryId,
      instructorId,
      level,
      status = CourseStatus.PUBLISHED,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('course.category', 'category')
      .where('course.isActive = :isActive', { isActive: true });

    // Apply filters
    if (categoryId) {
      queryBuilder.andWhere('course.categoryId = :categoryId', { categoryId });
    }

    if (instructorId) {
      queryBuilder.andWhere('course.instructorId = :instructorId', { instructorId });
    }

    if (level) {
      queryBuilder.andWhere('course.level = :level', { level });
    }

    if (status) {
      queryBuilder.andWhere('course.status = :status', { status });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('course.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('course.price <= :maxPrice', { maxPrice });
    }

    if (search) {
      queryBuilder.andWhere(
        '(course.title ILIKE :search OR course.description ILIKE :search OR course.tags::text ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`course.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [courses, total] = await queryBuilder.getManyAndCount();

    return {
      courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getCourseById(id) {
    const course = await this.courseRepository.findOne({
      where: { id, isActive: true },
      relations: ['instructor', 'category']
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    return course;
  }

  async updateCourse(id, updateData, userId) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor']
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is the instructor or admin
    if (course.instructorId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new AppError('Unauthorized to update this course', 403);
      }
    }

    // Update allowed fields
    const allowedFields = [
      'title', 'description', 'shortDescription', 'price', 'originalPrice',
      'level', 'thumbnail', 'images', 'videos', 'documents', 'curriculum',
      'duration', 'lessons', 'requirements', 'learningOutcomes', 'tags',
      'status', 'isFeatured'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        course[field] = updateData[field];
      }
    });

    // Set published date if status changes to published
    if (updateData.status === CourseStatus.PUBLISHED && course.status !== CourseStatus.PUBLISHED) {
      course.publishedAt = new Date();
    }

    return await this.courseRepository.save(course);
  }

  async deleteCourse(id, userId) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['instructor']
    });

    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is the instructor or admin
    if (course.instructorId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user || user.role !== 'admin') {
        throw new AppError('Unauthorized to delete this course', 403);
      }
    }

    // Soft delete by setting isActive to false
    course.isActive = false;
    await this.courseRepository.save(course);

    return { message: 'Course deleted successfully' };
  }

  async enrollInCourse(courseId, studentId) {
    // Check if course exists and is published
    const course = await this.courseRepository.findOne({
      where: { id: courseId, status: CourseStatus.PUBLISHED, isActive: true }
    });

    if (!course) {
      throw new AppError('Course not found or not available for enrollment', 404);
    }

    // Check if student exists
    const student = await this.userRepository.findOne({ where: { id: studentId } });
    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: { courseId, studentId }
    });

    if (existingEnrollment) {
      throw new AppError('Already enrolled in this course', 409);
    }

    // Create enrollment
    const enrollment = this.enrollmentRepository.create({
      courseId,
      studentId,
      status: EnrollmentStatus.ACTIVE,
      startedAt: new Date(),
      lastAccessedAt: new Date()
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    // Increment course enrollment count
    course.incrementEnrollments();
    await this.courseRepository.save(course);

    return savedEnrollment;
  }

  async getStudentEnrollments(studentId, filters = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = filters;

    const queryBuilder = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.course', 'course')
      .leftJoinAndSelect('course.instructor', 'instructor')
      .leftJoinAndSelect('course.category', 'category')
      .where('enrollment.studentId = :studentId', { studentId });

    if (status) {
      queryBuilder.andWhere('enrollment.status = :status', { status });
    }

    queryBuilder.orderBy(`enrollment.${sortBy}`, sortOrder);

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [enrollments, total] = await queryBuilder.getManyAndCount();

    return {
      enrollments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async updateEnrollmentProgress(enrollmentId, lessonIndex, totalLessons, studentId) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId, studentId },
      relations: ['course']
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    enrollment.updateProgress(lessonIndex, totalLessons);

    // Check if course is completed
    if (enrollment.progress >= 100) {
      enrollment.completeEnrollment();
    }

    return await this.enrollmentRepository.save(enrollment);
  }

  async markLessonComplete(enrollmentId, lessonId, studentId) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId, studentId }
    });

    if (!enrollment) {
      throw new AppError('Enrollment not found', 404);
    }

    enrollment.markLessonComplete(lessonId);
    return await this.enrollmentRepository.save(enrollment);
  }

  async getFeaturedCourses(limit = 10) {
    return await this.courseRepository.find({
      where: { 
        isActive: true, 
        status: CourseStatus.PUBLISHED,
        isFeatured: true
      },
      relations: ['instructor', 'category'],
      order: { rating: 'DESC', enrollments: 'DESC' },
      take: limit
    });
  }

  async getPopularCourses(limit = 10) {
    return await this.courseRepository.find({
      where: { 
        isActive: true, 
        status: CourseStatus.PUBLISHED
      },
      relations: ['instructor', 'category'],
      order: { enrollments: 'DESC', rating: 'DESC' },
      take: limit
    });
  }

  async getNewCourses(limit = 10) {
    return await this.courseRepository.find({
      where: { 
        isActive: true, 
        status: CourseStatus.PUBLISHED
      },
      relations: ['instructor', 'category'],
      order: { publishedAt: 'DESC' },
      take: limit
    });
  }

  async updateCourseRating(courseId, rating) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    course.updateRating(rating);
    return await this.courseRepository.save(course);
  }

  async getCourseStatistics() {
    const totalCourses = await this.courseRepository.count({
      where: { isActive: true }
    });

    const publishedCourses = await this.courseRepository.count({
      where: { isActive: true, status: CourseStatus.PUBLISHED }
    });

    const totalEnrollments = await this.enrollmentRepository.count();

    const coursesByLevel = await this.courseRepository
      .createQueryBuilder('course')
      .select('course.level', 'level')
      .addSelect('COUNT(*)', 'count')
      .where('course.isActive = :isActive', { isActive: true })
      .groupBy('course.level')
      .getRawMany();

    return {
      totalCourses,
      publishedCourses,
      totalEnrollments,
      coursesByLevel
    };
  }
}


