import { EntitySchema } from 'typeorm';

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

export const ContentPageSchema = new EntitySchema({
  name: 'ContentPage',
  tableName: 'content_pages',
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

export class ContentPage {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
