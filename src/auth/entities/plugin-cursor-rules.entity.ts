import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PluginUserEntity } from './plugin-user.entity';

@Entity('plugin_cursor_rules')
export class PluginCursorRulesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户邮箱' })
  userEmail: string;

  @Column({ comment: '规则名称' })
  ruleName: string;

  @Column({ type: 'text', comment: '规则内容' })
  ruleContent: string;

  @Column({ default: true, comment: '是否启用' })
  isEnabled: boolean;

  @Column({ type: 'int', default: 0, comment: '排序顺序' })
  sortOrder: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @ManyToOne(() => PluginUserEntity)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: PluginUserEntity;
}
