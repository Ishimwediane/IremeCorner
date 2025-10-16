import { AssignmentService } from '../../services/courses/assignmentService.js';
import { asyncHandler } from '../../middleware/error/errorHandler.js';

export class AssignmentController {
  constructor() {
    this.assignmentService = new AssignmentService();
  }

  // Get assignments for a course
  getCourseAssignments = asyncHandler(async (req, res) => {
    const assignments = await this.assignmentService.getCourseAssignments(req.params.courseId, req.user);
    
    res.json({
      success: true,
      data: assignments
    });
  });

  // Create assignment (Trainer/Admin only)
  createAssignment = asyncHandler(async (req, res) => {
    const assignment = await this.assignmentService.createAssignment(
      req.params.courseId,
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  });

  // Update assignment (Trainer/Admin only)
  updateAssignment = asyncHandler(async (req, res) => {
    const assignment = await this.assignmentService.updateAssignment(
      req.params.assignmentId,
      req.body,
      req.user
    );

    res.json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  });

  // Delete assignment (Trainer/Admin only)
  deleteAssignment = asyncHandler(async (req, res) => {
    await this.assignmentService.deleteAssignment(req.params.assignmentId, req.user);

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  });

  // Get assignment by ID
  getAssignmentById = asyncHandler(async (req, res) => {
    const assignment = await this.assignmentService.getAssignmentById(
      req.params.assignmentId,
      req.user
    );

    res.json({
      success: true,
      data: assignment
    });
  });

  // Submit assignment (Student)
  submitAssignment = asyncHandler(async (req, res) => {
    const submission = await this.assignmentService.submitAssignment(
      req.params.assignmentId,
      req.body,
      req.user
    );

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission
    });
  });

  // Get student's submissions for a course
  getMySubmissions = asyncHandler(async (req, res) => {
    const submissions = await this.assignmentService.getStudentSubmissions(
      req.params.courseId,
      req.user.id
    );

    res.json({
      success: true,
      data: submissions
    });
  });

  // Grade assignment (Trainer/Admin only)
  gradeAssignment = asyncHandler(async (req, res) => {
    const submission = await this.assignmentService.gradeSubmission(
      req.params.submissionId,
      req.body,
      req.user
    );

    res.json({
      success: true,
      message: 'Assignment graded successfully',
      data: submission
    });
  });

  // Get assignment analytics (Trainer/Admin only)
  getAssignmentAnalytics = asyncHandler(async (req, res) => {
    const analytics = await this.assignmentService.getAssignmentAnalytics(
      req.params.courseId,
      req.user
    );

    res.json({
      success: true,
      data: analytics
    });
  });
}




