import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { User } from '../auth/User.js';

export const FollowStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  BLOCKED: 'blocked',
};

@Entity('follows')
@Unique(['followerId', 'followingId'])
@Index(['followerId'])
@Index(['followingId'])
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ type: 'varchar', length: 50, default: FollowStatus.ACCEPTED })
  status;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relations
  @ManyToOne(() => User, user => user.following)
  @JoinColumn({ name: 'followerId' })
  follower;

  @Column({ type: 'uuid' })
  followerId;

  @ManyToOne(() => User, user => user.followers)
  @JoinColumn({ name: 'followingId' })
  following;

  @Column({ type: 'uuid' })
  followingId;

  // Methods
  accept() {
    this.status = FollowStatus.ACCEPTED;
    this.acceptedAt = new Date();
  }

  block() {
    this.status = FollowStatus.BLOCKED;
  }

  isAccepted() {
    return this.status === FollowStatus.ACCEPTED;
  }

  isBlocked() {
    return this.status === FollowStatus.BLOCKED;
  }

  isPending() {
    return this.status === FollowStatus.PENDING;
  }
}
