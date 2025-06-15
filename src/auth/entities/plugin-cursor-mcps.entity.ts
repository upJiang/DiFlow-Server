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

@Entity('plugin_cursor_mcps')
export class PluginCursorMcpsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户邮箱' })
  userEmail: string;

  @Column({ comment: 'MCP服务器名称' })
  serverName: string;

  @Column({ comment: 'MCP服务器命令' })
  command: string;

  @Column({ type: 'json', nullable: true, comment: 'MCP服务器参数' })
  args: string[];

  @Column({ type: 'json', nullable: true, comment: '环境变量' })
  env: Record<string, string>;

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
