import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export const ContactMessageStatus = {
  NEW: 'new',
  READ: 'read',
  REPLIED: 'replied',
};

@Entity('contact_messages')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 100 })
  name;

  @Column({ type: 'varchar', length: 255 })
  email;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone;

  @Column({ type: 'varchar', length: 200, nullable: true })
  subject;

  @Column({ type: 'text' })
  message;

  @Column({ type: 'varchar', length: 20, default: ContactMessageStatus.NEW })
  status;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
