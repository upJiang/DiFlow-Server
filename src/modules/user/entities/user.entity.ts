import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CursorRuleEntity } from '../../cursor/entities/cursor-rule.entity';
import { CursorMcpEntity } from '../../cursor/entities/cursor-mcp.entity';

@Entity('plugin_users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '用户邮箱' })
  email: string;

  @Column({ nullable: true, comment: '用户名' })
  name: string;

  @Column({ nullable: true, comment: '头像' })
  avatar: string;

  @Column({ nullable: true, comment: 'Cursor 用户ID' })
  cursorUserId: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @OneToMany(() => CursorRuleEntity, (rule) => rule.user)
  cursorRules: CursorRuleEntity[];

  @OneToMany(() => CursorMcpEntity, (mcp) => mcp.user)
  cursorMcps: CursorMcpEntity[];
}
