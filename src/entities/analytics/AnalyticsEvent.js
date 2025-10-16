import { EntitySchema } from 'typeorm';

export const AnalyticsEventType = {
  PAGE_VIEW: 'page_view',
  PRODUCT_VIEW: 'product_view',
  COURSE_VIEW: 'course_view',
  SEARCH: 'search',
  CLICK: 'click',
  CONVERSION: 'conversion',
  PURCHASE: 'purchase',
  ENROLLMENT: 'enrollment',
  DOWNLOAD: 'download',
  SHARE: 'share',
  LIKE: 'like',
  REVIEW: 'review',
};
export const AnalyticsCategory = {
  USER_BEHAVIOR: 'user_behavior',
  SALES: 'sales',
  CONTENT: 'content',
  ENGAGEMENT: 'engagement',
  PERFORMANCE: 'performance',
};

export const AnalyticsEventSchema = new EntitySchema({
  name: 'AnalyticsEvent',
  tableName: 'analytics_events',
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

export class AnalyticsEvent {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}

