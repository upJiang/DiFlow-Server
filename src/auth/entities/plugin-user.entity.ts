import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('plugin_users')
export class PluginUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '用户邮箱，作为唯一标识' })
  email: string;

  @Column({ nullable: true, comment: '用户名' })
  username: string;

  @Column({ nullable: true, comment: 'Cursor用户ID' })
  cursorUserId: string;

  @Column({ type: 'text', nullable: true, comment: '用户头像' })
  avatar: string;

  @Column({ default: true, comment: '是否激活' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
