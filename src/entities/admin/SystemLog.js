import { EntitySchema } from 'typeorm';

export const SystemLogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};
export const SystemLogCategory = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATABASE: 'database',
  API: 'api',
  PAYMENT: 'payment',
  EMAIL: 'email',
  FILE_UPLOAD: 'file_upload',
  SYSTEM: 'system',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
};

export const SystemLogSchema = new EntitySchema({
  name: 'SystemLog',
  tableName: 'system_logs',
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

export class SystemLog {
  constructor() {
    this.id = null;
    // TODO: Initialize other properties
  }
}

