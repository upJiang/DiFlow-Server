import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PluginUserEntity } from '../../../auth/entities/plugin-user.entity';

@Entity('plugin_cursor_rules')
export class CursorRuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户ID' })
  userId: number;

  @Column({ comment: '规则名称' })
  name: string;

  @Column({ type: 'text', comment: '规则内容' })
  content: string;

  @Column({ default: true, comment: '是否启用' })
  enabled: boolean;

  @Column({ default: 0, comment: '排序' })
  order: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => PluginUserEntity, (user) => user.cursorRules)
  @JoinColumn({ name: 'userId' })
  user: PluginUserEntity;
}
