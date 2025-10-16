import { EntitySchema } from 'typeorm';
import bcrypt from 'bcryptjs';

export const UserRole = {
  BUYER: 'buyer',
  ARTISAN: 'artisan',
  STUDENT: 'student',
  TRAINER: 'trainer',
  ADMIN: 'admin',
};

export const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    firstName: {
      type: 'varchar',
      length: 100
    },
    lastName: {
      type: 'varchar',
      length: 100
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true
    },
    password: {
      type: 'varchar',
      length: 255
    },
    phone: {
      type: 'varchar',
      length: 20,
      nullable: true
    },
    avatar: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    role: {
      type: 'enum',
      enum: Object.values(UserRole),
      default: UserRole.BUYER
    },
    isEmailVerified: {
      type: 'boolean',
      default: false
    },
    isActive: {
      type: 'boolean',
      default: true
    },
    bio: {
      type: 'varchar',
      length: 500,
      nullable: true
    },
    address: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    city: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    state: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    zipCode: {
      type: 'varchar',
      length: 20,
      nullable: true
    },
    country: {
      type: 'varchar',
      length: 100,
      nullable: true
    },
    website: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    socialMedia: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    rating: {
      type: 'decimal',
      precision: 5,
      scale: 2,
      default: 0
    },
    totalReviews: {
      type: 'int',
      default: 0
    },
    createdAt: {
      type: 'timestamp',
      createDate: true
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true
    }
  },
  relations: {
    products: {
      target: 'Product',
      type: 'one-to-many',
      inverseSide: 'artisan'
    },
    orders: {
      target: 'Order',
      type: 'one-to-many',
      inverseSide: 'buyer'
    },
    courses: {
      target: 'Course',
      type: 'one-to-many',
      inverseSide: 'instructor'
    },
    enrollments: {
      target: 'Enrollment',
      type: 'one-to-many',
      inverseSide: 'student'
    },
    assignmentSubmissions: {
      target: 'AssignmentSubmission',
      type: 'one-to-many',
      inverseSide: 'student'
    },
    certificates: {
      target: 'Certificate',
      type: 'one-to-many',
      inverseSide: 'student'
    },
    payments: {
      target: 'Payment',
      type: 'one-to-many',
      inverseSide: 'user'
    },
    notifications: {
      target: 'Notification',
      type: 'one-to-many',
      inverseSide: 'user'
    },
    reviews: {
      target: 'Review',
      type: 'one-to-many',
      inverseSide: 'reviewer'
    },
    receivedReviews: {
      target: 'Review',
      type: 'one-to-many',
      inverseSide: 'reviewedUser'
    },
    wishlistItems: {
      target: 'WishlistItem',
      type: 'one-to-many',
      inverseSide: 'user'
    }
  }
});

export class User {
  constructor() {
    this.id = null;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
    this.phone = null;
    this.avatar = null;
    this.role = UserRole.BUYER;
    this.isEmailVerified = false;
    this.isActive = true;
    this.bio = null;
    this.address = null;
    this.city = null;
    this.state = null;
    this.zipCode = null;
    this.country = null;
    this.website = null;
    this.socialMedia = null;
    this.rating = 0;
    this.totalReviews = 0;
    this.createdAt = null;
    this.updatedAt = null;
  }

  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
