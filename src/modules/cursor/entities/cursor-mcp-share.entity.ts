import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Cursor MCP 分享配置实体
 */
@Entity('plugin_cursor_mcp_shares')
export class CursorMcpShareEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, comment: '分享ID（唯一标识符）' })
  shareId: string;

  @Column({ comment: '分享者邮箱' })
  @Index()
  creatorEmail: string;

  @Column({ comment: '分享标题' })
  title: string;

  @Column({ type: 'text', nullable: true, comment: '分享描述' })
  description: string;

  @Column({ type: 'longtext', comment: 'MCP配置JSON内容' })
  mcpConfig: string;

  @Column({ default: 0, comment: '使用次数' })
  usageCount: number;

  @Column({ default: true, comment: '是否启用分享' })
  enabled: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
