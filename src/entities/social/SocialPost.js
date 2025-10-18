import { EntitySchema } from 'typeorm';

export const PostType = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  PRODUCT_SHOWCASE: 'product_showcase',
  COURSE_ANNOUNCEMENT: 'course_announcement',
  TUTORIAL: 'tutorial',
  INSPIRATION: 'inspiration',
};
export const PostStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  HIDDEN: 'hidden',
};

export const SocialPostSchema = new EntitySchema({
  name: 'SocialPost',
  tableName: 'social_posts',
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

export class SocialPost {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}



