import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PluginUserEntity } from '../../../auth/entities/plugin-user.entity';

@Entity('plugin_cursor_rules')
export class CursorRuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户邮箱' })
  userEmail: string;

  @Column({ comment: '规则名称' })
  name: string;

  @Column({ comment: '规则名称（兼容字段）', nullable: true, default: null })
  ruleName: string;

  @Column({ type: 'text', comment: '规则内容' })
  content: string;

  @Column({
    type: 'text',
    comment: '规则内容（兼容字段）',
    nullable: true,
    default: null,
  })
  ruleContent: string;

  @Column({ default: true, comment: '是否启用' })
  enabled: boolean;

  @Column({ default: 0, comment: '排序' })
  order: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @ManyToOne(() => PluginUserEntity, (user) => user.cursorRules)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: PluginUserEntity;
}
