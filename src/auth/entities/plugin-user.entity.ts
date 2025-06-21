import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('plugin_users')
export class PluginUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '用户邮箱，作为唯一标识' })
  email: string;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  // 关系字段 - 延迟导入以避免循环依赖
  @OneToMany('CursorRuleEntity', 'user')
  cursorRules: any[];

  @OneToMany('CursorMcpEntity', 'user')
  cursorMcps: any[];
}
