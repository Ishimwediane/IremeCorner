import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { User } from '../auth/User.js';
import { SocialPost } from './SocialPost.js';

export const LikeType = {
  POST: 'post',
  COMMENT: 'comment',
  PRODUCT: 'product',
  COURSE: 'course',
};

@Entity('likes')
@Unique(['userId', 'targetId', 'targetType'])
@Index(['targetId', 'targetType'])
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50 })
  targetType; // post, comment, product, course

  @Column({ type: 'uuid' })
  targetId;

  @CreateDateColumn()
  createdAt;

  // Relations
  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'userId' })
  user;

  @Column({ type: 'uuid' })
  userId;

  // For post likes
  @ManyToOne(() => SocialPost, post => post.likes, { nullable: true })
  @JoinColumn({ name: 'postId' })
  post;

  @Column({ type: 'uuid', nullable: true })
  postId;

  // Methods
  isPostLike() {
    return this.targetType === LikeType.POST;
  }

  isCommentLike() {
    return this.targetType === LikeType.COMMENT;
  }

  isProductLike() {
    return this.targetType === LikeType.PRODUCT;
  }

  isCourseLike() {
    return this.targetType === LikeType.COURSE;
  }
}
