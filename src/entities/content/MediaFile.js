import { EntitySchema } from 'typeorm';

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

export const MediaFileSchema = new EntitySchema({
  name: 'MediaFile',
  tableName: 'media_files',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    }
    // TODO: Add other column definitions
  },
  relations: {
    // TODO: Add relation definitions
  }
});

export class MediaFile {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
