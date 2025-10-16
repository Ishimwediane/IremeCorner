import { AppDataSource } from '../../config/database.js';
import { Assignment } from '../../entities/courses/Assignment.js';
import { AssignmentSubmission } from '../../entities/courses/AssignmentSubmission.js';
import { Course } from '../../entities/courses/Course.js';
import { Enrollment } from '../../entities/courses/Enrollment.js';
import { AppError } from '../../utils/AppError.js';

export class AssignmentService {
  constructor() {
    this.assignmentRepository = AppDataSource.getRepository(Assignment);
    this.submissionRepository = AppDataSource.getRepository(AssignmentSubmission);
    this.courseRepository = AppDataSource.getRepository(Course);
    this.enrollmentRepository = AppDataSource.getRepository(Enrollment);
  }

  async getCourseAssignments(courseId, user) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check permissions
    if (user.role === 'trainer' && course.instructorId !== user.id) {
      throw new AppError('You can only view assignments for your own courses', 403);
    }

    const assignments = await this.assignmentRepository.find({
      where: { courseId },
      relations: ['submissions'],
      order: { createdAt: 'DESC' }
    });

    return assignments;
  }

  async createAssignment(courseId, assignmentData, user) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check permissions
    if (user.role !== 'admin' && course.instructorId !== user.id) {
      throw new AppError('You can only add assignments to your own courses', 403);
    }

    const assignment = this.assignmentRepository.create({
      ...assignmentData,
      courseId
    });

    return await this.assignmentRepository.save(assignment);
  }

  async updateAssignment(assignmentId, updateData, user) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['course']
    });

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check permissions
    if (user.role !== 'admin' && assignment.course.instructorId !== user.id) {
      throw new AppError('You can only update assignments for your own courses', 403);
    }

    Object.assign(assignment, updateData);
    return await this.assignmentRepository.save(assignment);
  }

  async deleteAssignment(assignmentId, user) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['course']
    });

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check permissions
    if (user.role !== 'admin' && assignment.course.instructorId !== user.id) {
      throw new AppError('You can only delete assignments for your own courses', 403);
    }

    await this.assignmentRepository.remove(assignment);
  }

  async getAssignmentById(assignmentId, user) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['course', 'submissions']
    });

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check permissions
    if (user.role === 'trainer' && assignment.course.instructorId !== user.id) {
      throw new AppError('You can only view assignments for your own courses', 403);
    }

    return assignment;
  }

  async submitAssignment(assignmentId, submissionData, user) {
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
      relations: ['course']
    });

    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check if user is enrolled in the course
    const enrollment = await this.enrollmentRepository.findOne({
      where: { 
        courseId: assignment.courseId,
        studentId: user.id 
      }
    });

    if (!enrollment) {
      throw new AppError('You must be enrolled in this course to submit assignments', 403);
    }

    // Check if already submitted
    const existingSubmission = await this.submissionRepository.findOne({
      where: { 
        assignmentId,
        studentId: user.id 
      }
    });

    if (existingSubmission) {
      throw new AppError('You have already submitted this assignment', 400);
    }

    let score = null;
    if (assignment.type === 'quiz' && submissionData.answers) {
      score = this.calculateQuizScore(assignment.questions, submissionData.answers);
    }

    const submission = this.submissionRepository.create({
      ...submissionData,
      assignmentId,
      studentId: user.id,
      score
    });

    return await this.submissionRepository.save(submission);
  }

  async getStudentSubmissions(courseId, studentId) {
    const assignments = await this.assignmentRepository.find({
      where: { courseId }
    });

    const assignmentIds = assignments.map(a => a.id);
    
    const submissions = await this.submissionRepository.find({
      where: { 
        assignmentId: { $in: assignmentIds },
        studentId 
      },
      relations: ['assignment']
    });

    return submissions;
  }

  async gradeSubmission(submissionId, gradeData, user) {
    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['assignment', 'assignment.course']
    });

    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Check permissions
    if (user.role !== 'admin' && submission.assignment.course.instructorId !== user.id) {
      throw new AppError('You can only grade submissions for your own courses', 403);
    }

    submission.score = gradeData.score;
    submission.feedback = gradeData.feedback;
    submission.gradedBy = user.id;
    submission.gradedAt = new Date();
    submission.status = 'graded';

    return await this.submissionRepository.save(submission);
  }

  async getAssignmentAnalytics(courseId, user) {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check permissions
    if (user.role !== 'admin' && course.instructorId !== user.id) {
      throw new AppError('You can only view analytics for your own courses', 403);
    }

    const assignments = await this.assignmentRepository.find({
      where: { courseId },
      relations: ['submissions']
    });

    const analytics = assignments.map(assignment => {
      const submissions = assignment.submissions || [];
      const gradedSubmissions = submissions.filter(s => s.score !== null);
      
      const averageScore = gradedSubmissions.length > 0
        ? Math.round(gradedSubmissions.reduce((sum, s) => sum + s.score, 0) / gradedSubmissions.length)
        : 0;

      return {
        assignmentId: assignment.id,
        title: assignment.title,
        type: assignment.type,
        maxPoints: assignment.maxPoints,
        dueDate: assignment.dueDate,
        totalSubmissions: submissions.length,
        gradedSubmissions: gradedSubmissions.length,
        averageScore,
        submissionRate: submissions.length > 0 ? Math.round((submissions.length / submissions.length) * 100) : 0
      };
    });

    return analytics;
  }

  calculateQuizScore(questions, answers) {
    if (!questions || !answers) return 0;
    
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / questions.length) * 100);
  }
}




