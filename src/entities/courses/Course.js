import { EntitySchema } from 'typeorm';

export const CourseStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const CourseLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const CourseSchema = new EntitySchema({
  name: 'Course',
  tableName: 'courses',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    title: {
      type: 'varchar',
      length: 200
    },
    description: {
      type: 'text'
    },
    shortDescription: {
      type: 'text',
      nullable: true
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2
    },
    originalPrice: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true
    },
    status: {
      type: 'varchar',
      length: 50,
      default: CourseStatus.DRAFT
    },
    level: {
      type: 'varchar',
      length: 50,
      default: CourseLevel.BEGINNER
    },
    thumbnail: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    images: {
      type: 'json',
      nullable: true
    },
    videos: {
      type: 'json',
      nullable: true
    },
    documents: {
      type: 'json',
      nullable: true
    },
    curriculum: {
      type: 'json',
      nullable: true
    },
    duration: {
      type: 'int',
      default: 0
    },
    lessons: {
      type: 'int',
      default: 0
    },
    enrollments: {
      type: 'int',
      default: 0
    },
    rating: {
      type: 'decimal',
      precision: 3,
      scale: 2,
      default: 0
    },
    reviewCount: {
      type: 'int',
      default: 0
    },
    requirements: {
      type: 'json',
      nullable: true
    },
    learningOutcomes: {
      type: 'json',
      nullable: true
    },
    tags: {
      type: 'json',
      nullable: true
    },
    slug: {
      type: 'varchar',
      length: 200,
      nullable: true
    },
    isActive: {
      type: 'boolean',
      default: true
    },
    isFeatured: {
      type: 'boolean',
      default: false
    },
    publishedAt: {
      type: 'timestamp',
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
    instructorId: {
      type: 'uuid'
    },
    categoryId: {
      type: 'uuid'
    }
  },
  relations: {
    instructor: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'instructorId' }
    },
    category: {
      target: 'Category',
      type: 'many-to-one',
      joinColumn: { name: 'categoryId' }
    },
    courseEnrollments: {
      target: 'Enrollment',
      type: 'one-to-many',
      inverseSide: 'course'
    },
    assignments: {
      target: 'Assignment',
      type: 'one-to-many',
      inverseSide: 'course'
    },
    achievements: {
      target: 'Achievement',
      type: 'one-to-many',
      inverseSide: 'course'
    },
    certificates: {
      target: 'Certificate',
      type: 'one-to-many',
      inverseSide: 'course'
    },
    reviews: {
      target: 'Review',
      type: 'one-to-many',
      inverseSide: 'course'
    },
    wishlistItems: {
      target: 'WishlistItem',
      type: 'one-to-many',
      inverseSide: 'course'
    }
  }
});

export class Course {
  constructor() {
    this.id = null;
    this.title = '';
    this.description = '';
    this.shortDescription = null;
    this.price = 0;
    this.originalPrice = null;
    this.status = CourseStatus.DRAFT;
    this.level = CourseLevel.BEGINNER;
    this.thumbnail = null;
    this.images = null;
    this.videos = null;
    this.documents = null;
    this.curriculum = null;
    this.duration = 0;
    this.lessons = 0;
    this.enrollments = 0;
    this.rating = 0;
    this.reviewCount = 0;
    this.requirements = null;
    this.learningOutcomes = null;
    this.tags = null;
    this.slug = null;
    this.isActive = true;
    this.isFeatured = false;
    this.publishedAt = null;
    this.createdAt = null;
    this.updatedAt = null;
    this.instructorId = null;
    this.categoryId = null;
  }

  getDiscountPercentage() {
    if (this.originalPrice && this.originalPrice > this.price) {
      return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
  }

  updateRating(newRating) {
    const totalRating = (this.rating * this.reviewCount) + newRating;
    this.reviewCount += 1;
    this.rating = totalRating / this.reviewCount;
  }

  incrementEnrollments() {
    this.enrollments += 1;
  }

  getFormattedDuration() {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
  }
}
