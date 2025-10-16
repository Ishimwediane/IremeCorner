import { EntitySchema } from 'typeorm';

export const SubmissionStatus = {
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RETURNED: 'returned',
};

export const AssignmentSubmissionSchema = new EntitySchema({
  name: 'AssignmentSubmission',
  tableName: 'assignment_submissions',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    submissionText: {
      type: 'text',
      nullable: true
    },
    attachments: {
      type: 'json',
      nullable: true
    },
    answers: {
      type: 'json',
      nullable: true
    },
    score: {
      type: 'int',
      nullable: true
    },
    feedback: {
      type: 'text',
      nullable: true
    },
    status: {
      type: 'enum',
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.SUBMITTED
    },
    gradedAt: {
      type: 'timestamp',
      nullable: true
    },
    gradedBy: {
      type: 'uuid',
      nullable: true
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    },
    assignmentId: {
      type: 'uuid'
    },
    studentId: {
      type: 'uuid'
    }
  },
  relations: {
    assignment: {
      target: 'Assignment',
      type: 'many-to-one',
      joinColumn: { name: 'assignmentId' }
    },
    student: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'studentId' }
    }
  }
});

export class AssignmentSubmission {
  constructor() {
    this.id = null;
    this.submissionText = null;
    this.attachments = null;
    this.answers = null;
    this.score = null;
    this.feedback = null;
    this.status = SubmissionStatus.SUBMITTED;
    this.gradedAt = null;
    this.gradedBy = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.assignmentId = null;
    this.studentId = null;
  }

  getGradePercentage() {
    if (!this.score || !this.assignment) return 0;
    return Math.round((this.score / this.assignment.maxPoints) * 100);
  }

  isGraded() {
    return this.status === SubmissionStatus.GRADED;
  }

  isLate() {
    if (!this.assignment) return false;
    return new Date(this.createdAt) > new Date(this.assignment.dueDate);
  }
}



