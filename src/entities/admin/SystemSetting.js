import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../auth/User.js';

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

@Entity('system_settings')
@Index(['key'])
@Index(['category'])
export class SystemSetting {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100, unique: true })
  key; // Setting key (e.g., 'site_name', 'email_enabled')

  @Column({ type: 'varchar', length: 200 })
  name; // Human-readable name

  @Column({ type: 'text', nullable: true })
  description; // Setting description

  @Column({ type: 'varchar', length: 50 })
  type;

  @Column({ type: 'varchar', length: 50 })
  category;

  @Column({ type: 'text', nullable: true })
  value; // Setting value

  @Column({ type: 'text', nullable: true })
  defaultValue; // Default value

  @Column({ type: 'json', nullable: true })
  options; // Available options for select/radio settings

  @Column({ type: 'boolean', default: true })
  isPublic; // Whether setting is visible to non-admins

  @Column({ type: 'boolean', default: false })
  isRequired; // Whether setting is required

  @Column({ type: 'boolean', default: true })
  isActive;

  @Column({ type: 'int', default: 0 })
  sortOrder; // Display order

  @Column({ type: 'json', nullable: true })
  validation; // Validation rules

  @Column({ type: 'timestamp', nullable: true })
  lastModifiedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.modifiedSettings, { nullable: true })
  @JoinColumn({ name: 'lastModifiedById' })
  lastModifiedBy;

  @Column({ type: 'uuid', nullable: true })
  lastModifiedById;

  // Methods
  updateValue(newValue, modifiedBy) {
    this.value = newValue;
    this.lastModifiedAt = new Date();
    this.lastModifiedById = modifiedBy;
  }

  resetToDefault() {
    this.value = this.defaultValue;
    this.lastModifiedAt = new Date();
  }

  isString() {
    return this.type === SystemSettingType.STRING;
  }

  isNumber() {
    return this.type === SystemSettingType.NUMBER;
  }

  isBoolean() {
    return this.type === SystemSettingType.BOOLEAN;
  }

  isJson() {
    return this.type === SystemSettingType.JSON;
  }

  isEmail() {
    return this.type === SystemSettingType.EMAIL;
  }

  isUrl() {
    return this.type === SystemSettingType.URL;
  }

  isPassword() {
    return this.type === SystemSettingType.PASSWORD;
  }

  getTypedValue() {
    switch (this.type) {
      case SystemSettingType.NUMBER:
        return parseFloat(this.value) || 0;
      case SystemSettingType.BOOLEAN:
        return this.value === 'true';
      case SystemSettingType.JSON:
        try {
          return JSON.parse(this.value);
        } catch {
          return null;
        }
      default:
        return this.value;
    }
  }

  setTypedValue(value) {
    switch (this.type) {
      case SystemSettingType.NUMBER:
        this.value = value.toString();
        break;
      case SystemSettingType.BOOLEAN:
        this.value = value ? 'true' : 'false';
        break;
      case SystemSettingType.JSON:
        this.value = JSON.stringify(value);
        break;
      default:
        this.value = value;
    }
  }
}
