import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';

export const ContentType = {
  ARTICLE: 'article',
  BLOG_POST: 'blog_post',
  NEWS: 'news',
  TUTORIAL: 'tutorial',
  FAQ: 'faq',
  POLICY: 'policy',
  TERMS: 'terms',
  HELP: 'help',
  ANNOUNCEMENT: 'announcement',
};

export const ContentStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  SCHEDULED: 'scheduled',
};

export const ContentVisibility = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  MEMBERS_ONLY: 'members_only',
  ADMIN_ONLY: 'admin_only',
};

@Entity('content_pages')
@Index(['slug'])
@Index(['status', 'publishedAt'])
@Index(['type', 'status'])
export class ContentPage {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  title;

  @Column({ type: 'varchar', length: 200, unique: true })
  slug; // URL-friendly title

  @Column({ type: 'text' })
  content;

  @Column({ type: 'text', nullable: true })
  excerpt; // Short description

  @Column({ type: 'varchar', length: 50 })
  type;

  @Column({ type: 'varchar', length: 50, default: ContentStatus.DRAFT })
  status;

  @Column({ type: 'varchar', length: 50, default: ContentVisibility.PUBLIC })
  visibility;

  @Column({ type: 'varchar', length: 500, nullable: true })
  featuredImage;

  @Column({ type: 'json', nullable: true })
  images; // Additional images

  @Column({ type: 'json', nullable: true })
  tags; // Array of tags

  @Column({ type: 'json', nullable: true })
  categories; // Array of categories

  @Column({ type: 'varchar', length: 200, nullable: true })
  metaTitle; // SEO meta title

  @Column({ type: 'text', nullable: true })
  metaDescription; // SEO meta description

  @Column({ type: 'json', nullable: true })
  metaKeywords; // SEO meta keywords

  @Column({ type: 'int', default: 0 })
  viewsCount;

  @Column({ type: 'int', default: 0 })
  likesCount;

  @Column({ type: 'int', default: 0 })
  sharesCount;

  @Column({ type: 'int', default: 0 })
  commentsCount;

  @Column({ type: 'boolean', default: false })
  isFeatured;

  @Column({ type: 'boolean', default: false })
  allowComments;

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'json', nullable: true })
  metadata; // Additional content data

  @Column({ type: 'timestamp', nullable: true })
  publishedAt;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt;

  @Column({ type: 'timestamp', nullable: true })
  lastModifiedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.contentPages)
  @JoinColumn({ name: 'authorId' })
  author;

  @Column({ type: 'uuid' })
  authorId;

  // Methods
  publish() {
    this.status = ContentStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  schedule(scheduledAt) {
    this.status = ContentStatus.SCHEDULED;
    this.scheduledAt = scheduledAt;
  }

  archive() {
    this.status = ContentStatus.ARCHIVED;
  }

  draft() {
    this.status = ContentStatus.DRAFT;
  }

  incrementViews() {
    this.viewsCount += 1;
  }

  incrementLikes() {
    this.likesCount += 1;
  }

  decrementLikes() {
    this.likesCount = Math.max(0, this.likesCount - 1);
  }

  incrementShares() {
    this.sharesCount += 1;
  }

  incrementComments() {
    this.commentsCount += 1;
  }

  decrementComments() {
    this.commentsCount = Math.max(0, this.commentsCount - 1);
  }

  isPublished() {
    return this.status === ContentStatus.PUBLISHED;
  }

  isScheduled() {
    return this.status === ContentStatus.SCHEDULED;
  }

  isDraft() {
    return this.status === ContentStatus.DRAFT;
  }

  isArchived() {
    return this.status === ContentStatus.ARCHIVED;
  }

  isPublic() {
    return this.visibility === ContentVisibility.PUBLIC;
  }

  isPrivate() {
    return this.visibility === ContentVisibility.PRIVATE;
  }

  isMembersOnly() {
    return this.visibility === ContentVisibility.MEMBERS_ONLY;
  }

  isAdminOnly() {
    return this.visibility === ContentVisibility.ADMIN_ONLY;
  }

  getUrl() {
    return `/content/${this.slug}`;
  }

  getReadingTime() {
    // Estimate reading time based on word count
    const wordsPerMinute = 200;
    const wordCount = this.content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
