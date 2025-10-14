import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';
import { ContentPage } from './ContentPage.js';

export const MediaType = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  ARCHIVE: 'archive',
};

export const MediaStatus = {
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed',
  DELETED: 'deleted',
};

@Entity('media_files')
@Index(['type', 'status'])
@Index(['uploadedById', 'createdAt'])
export class MediaFile {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 200 })
  filename;

  @Column({ type: 'varchar', length: 200 })
  originalName;

  @Column({ type: 'varchar', length: 100 })
  mimeType;

  @Column({ type: 'varchar', length: 50 })
  type;

  @Column({ type: 'varchar', length: 50, default: MediaStatus.UPLOADING })
  status;

  @Column({ type: 'bigint' })
  size; // File size in bytes

  @Column({ type: 'varchar', length: 500 })
  url; // File URL

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl; // Thumbnail URL for images/videos

  @Column({ type: 'varchar', length: 500, nullable: true })
  previewUrl; // Preview URL for videos

  @Column({ type: 'json', nullable: true })
  metadata; // File metadata (dimensions, duration, etc.)

  @Column({ type: 'varchar', length: 100, nullable: true })
  alt; // Alt text for images

  @Column({ type: 'text', nullable: true })
  description;

  @Column({ type: 'json', nullable: true })
  tags; // Array of tags

  @Column({ type: 'boolean', default: true })
  isPublic;

  @Column({ type: 'int', default: 0 })
  downloadCount;

  @Column({ type: 'int', default: 0 })
  viewCount;

  @Column({ type: 'timestamp', nullable: true })
  processedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.uploadedMedia)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy;

  @Column({ type: 'uuid' })
  uploadedById;

  @ManyToOne(() => ContentPage, contentPage => contentPage.mediaFiles, { nullable: true })
  @JoinColumn({ name: 'contentPageId' })
  contentPage;

  @Column({ type: 'uuid', nullable: true })
  contentPageId;

  // Methods
  markAsReady() {
    this.status = MediaStatus.READY;
    this.processedAt = new Date();
  }

  markAsFailed() {
    this.status = MediaStatus.FAILED;
  }

  markAsDeleted() {
    this.status = MediaStatus.DELETED;
  }

  incrementDownloads() {
    this.downloadCount += 1;
  }

  incrementViews() {
    this.viewCount += 1;
  }

  isReady() {
    return this.status === MediaStatus.READY;
  }

  isFailed() {
    return this.status === MediaStatus.FAILED;
  }

  isDeleted() {
    return this.status === MediaStatus.DELETED;
  }

  isImage() {
    return this.type === MediaType.IMAGE;
  }

  isVideo() {
    return this.type === MediaType.VIDEO;
  }

  isAudio() {
    return this.type === MediaType.AUDIO;
  }

  isDocument() {
    return this.type === MediaType.DOCUMENT;
  }

  getFormattedSize() {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  getFileExtension() {
    return this.originalName.split('.').pop().toLowerCase();
  }
}
