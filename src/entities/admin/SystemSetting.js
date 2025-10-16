import { EntitySchema } from 'typeorm';

export const SystemSettingType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  EMAIL: 'email',
  URL: 'url',
  PASSWORD: 'password',
};
export const SystemSettingCategory = {
  GENERAL: 'general',
  EMAIL: 'email',
  PAYMENT: 'payment',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  FEATURES: 'features',
  INTEGRATION: 'integration',
  MAINTENANCE: 'maintenance',
};

export const SystemSettingSchema = new EntitySchema({
  name: 'SystemSetting',
  tableName: 'system_settings',
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

export class SystemSetting {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}
