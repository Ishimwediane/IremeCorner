import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';
import { SocialPost } from './SocialPost.js';

export const CommentStatus = {
  ACTIVE: 'active',
  HIDDEN: 'hidden',
  DELETED: 'deleted',
};

@Entity('comments')
@Index(['postId', 'createdAt'])
@Index(['authorId', 'createdAt'])
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'text' })
  content;

  @Column({ type: 'varchar', length: 50, default: CommentStatus.ACTIVE })
  status;

  @Column({ type: 'int', default: 0 })
  likesCount;

  @Column({ type: 'int', default: 0 })
  repliesCount;

  @Column({ type: 'json', nullable: true })
  metadata; // Additional comment data

  @Column({ type: 'boolean', default: false })
  isEdited;

  @Column({ type: 'timestamp', nullable: true })
  editedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'authorId' })
  author;

  @Column({ type: 'uuid' })
  authorId;

  @ManyToOne(() => SocialPost, post => post.comments)
  @JoinColumn({ name: 'postId' })
  post;

  @Column({ type: 'uuid' })
  postId;

  @ManyToOne(() => Comment, comment => comment.replies, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent;

  @Column({ type: 'uuid', nullable: true })
  parentId;

  // Methods
  hide() {
    this.status = CommentStatus.HIDDEN;
  }

  delete() {
    this.status = CommentStatus.DELETED;
  }

  edit(newContent) {
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = new Date();
  }

  incrementLikes() {
    this.likesCount += 1;
  }

  decrementLikes() {
    this.likesCount = Math.max(0, this.likesCount - 1);
  }

  incrementReplies() {
    this.repliesCount += 1;
  }

  decrementReplies() {
    this.repliesCount = Math.max(0, this.repliesCount - 1);
  }

  isActive() {
    return this.status === CommentStatus.ACTIVE;
  }

  isReply() {
    return this.parentId !== null;
  }

  isTopLevel() {
    return this.parentId === null;
  }
}
