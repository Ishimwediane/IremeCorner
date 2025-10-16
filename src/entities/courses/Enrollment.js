import { EntitySchema } from 'typeorm';

export const EnrollmentStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  PAUSED: 'paused',
  CANCELLED: 'cancelled',
};

export const EnrollmentSchema = new EntitySchema({
  name: 'Enrollment',
  tableName: 'enrollments',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    status: {
      type: 'varchar',
      length: 50,
      default: EnrollmentStatus.ACTIVE
    },
    progress: {
      type: 'int',
      default: 0
    },
    currentLesson: {
      type: 'int',
      default: 0
    },
    startedAt: {
      type: 'timestamp',
      nullable: true
    },
    completedAt: {
      type: 'timestamp',
      nullable: true
    },
    lastAccessedAt: {
      type: 'timestamp',
      nullable: true
    },
    completedLessons: {
      type: 'json',
      nullable: true
    },
    quizScores: {
      type: 'json',
      nullable: true
    },
    finalGrade: {
      type: 'decimal',
      precision: 5,
      scale: 2,
      nullable: true
    },
    certificateUrl: {
      type: 'text',
      nullable: true
    },
    certificateIssued: {
      type: 'boolean',
      default: false
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    },
    studentId: {
      type: 'uuid'
    },
    courseId: {
      type: 'uuid'
    }
  },
  relations: {
    student: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'studentId' }
    },
    course: {
      target: 'Course',
      type: 'many-to-one',
      joinColumn: { name: 'courseId' }
    }
  }
});

export class Enrollment {
  constructor() {
    this.id = null;
    this.status = EnrollmentStatus.ACTIVE;
    this.progress = 0;
    this.currentLesson = 0;
    this.startedAt = null;
    this.completedAt = null;
    this.lastAccessedAt = null;
    this.completedLessons = null;
    this.quizScores = null;
    this.finalGrade = null;
    this.certificateUrl = null;
    this.certificateIssued = false;
    this.createdAt = null;
    this.updatedAt = null;
    this.studentId = null;
    this.courseId = null;
  }

  updateProgress(lessonIndex, totalLessons) {
    this.currentLesson = lessonIndex;
    this.progress = Math.round((lessonIndex / totalLessons) * 100);
    this.lastAccessedAt = new Date();
  }

  markLessonComplete(lessonId) {
    if (!this.completedLessons) {
      this.completedLessons = [];
    }
    if (!this.completedLessons.includes(lessonId)) {
      this.completedLessons.push(lessonId);
    }
  }

  isLessonComplete(lessonId) {
    return this.completedLessons && this.completedLessons.includes(lessonId);
  }

  completeEnrollment() {
    this.status = EnrollmentStatus.COMPLETED;
    this.progress = 100;
    this.completedAt = new Date();
  }

  canReceiveCertificate() {
    return this.status === EnrollmentStatus.COMPLETED && 
           this.progress === 100 && 
           (!this.finalGrade || this.finalGrade >= 70);
  }
}

