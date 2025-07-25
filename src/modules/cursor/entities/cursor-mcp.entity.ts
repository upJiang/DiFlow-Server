import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PluginUserEntity } from '../../../auth/entities/plugin-user.entity';

/**
 * Cursor MCP 配置实体
 */
@Entity('plugin_cursor_mcps')
export class CursorMcpEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户邮箱' })
  userEmail: string;

  @Column({ comment: 'MCP 服务器名称' })
  name: string;

  @Column({
    comment: 'MCP 服务器名称（兼容字段）',
    nullable: true,
    default: null,
  })
  serverName: string;

  @Column({ comment: 'MCP 服务器命令' })
  command: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'MCP 服务器参数（JSON字符串）',
  })
  args: string;

  @Column({ nullable: true, comment: 'MCP 服务器描述' })
  description: string;

  @Column({ default: true, comment: '是否启用' })
  enabled: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @ManyToOne(() => PluginUserEntity, (user) => user.cursorMcps)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: PluginUserEntity;
}
