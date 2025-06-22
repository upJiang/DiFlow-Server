import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursorRuleEntity } from './entities/cursor-rule.entity';
import { CursorMcpEntity } from './entities/cursor-mcp.entity';
import { CursorMcpShareEntity } from './entities/cursor-mcp-share.entity';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import {
  CreateMcpDto,
  UpdateMcpDto,
  ShareMcpConfigDto,
  AddMcpByShareIdDto,
  BatchUpdateMcpDto,
} from './dto/mcp.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CursorService {
  constructor(
    @InjectRepository(CursorRuleEntity)
    private readonly ruleRepository: Repository<CursorRuleEntity>,
    @InjectRepository(CursorMcpEntity)
    private readonly mcpRepository: Repository<CursorMcpEntity>,
    @InjectRepository(CursorMcpShareEntity)
    private readonly mcpShareRepository: Repository<CursorMcpShareEntity>,
  ) {}

  // 规则管理
  async getRulesByUserEmail(userEmail: string): Promise<CursorRuleEntity[]> {
    return this.ruleRepository.find({
      where: { userEmail },
      order: { createdAt: 'DESC' },
    });
  }

  async createRule(
    userEmail: string,
    createRuleDto: CreateRuleDto,
  ): Promise<CursorRuleEntity> {
    const rule = this.ruleRepository.create({
      userEmail,
      name: createRuleDto.name,
      content: createRuleDto.content,
      enabled: createRuleDto.enabled ?? true,
      order: createRuleDto.order ?? 0,
    });
    return this.ruleRepository.save(rule);
  }

  async updateRule(
    id: number,
    userEmail: string,
    updateRuleDto: UpdateRuleDto,
  ): Promise<CursorRuleEntity> {
    const updateData: Partial<CursorRuleEntity> = {};
    if (updateRuleDto.name !== undefined) updateData.name = updateRuleDto.name;
    if (updateRuleDto.content !== undefined)
      updateData.content = updateRuleDto.content;
    if (updateRuleDto.enabled !== undefined)
      updateData.enabled = updateRuleDto.enabled;
    if (updateRuleDto.order !== undefined)
      updateData.order = updateRuleDto.order;

    await this.ruleRepository.update({ id, userEmail }, updateData);
    return this.ruleRepository.findOne({ where: { id, userEmail } });
  }

  async deleteRule(id: number, userEmail: string): Promise<void> {
    await this.ruleRepository.delete({ id, userEmail });
  }

  // MCP 管理
  async getMcpsByUserEmail(userEmail: string): Promise<CursorMcpEntity[]> {
    return this.mcpRepository.find({
      where: { userEmail },
      order: { createdAt: 'DESC' },
    });
  }

  async createMcp(
    userEmail: string,
    createMcpDto: CreateMcpDto,
  ): Promise<CursorMcpEntity> {
    const mcp = this.mcpRepository.create({
      userEmail,
      name: createMcpDto.name,
      command: createMcpDto.command,
      args: JSON.stringify(createMcpDto.args || []),
      description: createMcpDto.description,
      enabled: createMcpDto.enabled ?? true,
    });
    return this.mcpRepository.save(mcp);
  }

  async updateMcp(
    id: number,
    userEmail: string,
    updateMcpDto: UpdateMcpDto,
  ): Promise<CursorMcpEntity> {
    const updateData: Partial<CursorMcpEntity> = {};
    if (updateMcpDto.name !== undefined) updateData.name = updateMcpDto.name;
    if (updateMcpDto.command !== undefined)
      updateData.command = updateMcpDto.command;
    if (updateMcpDto.args !== undefined)
      updateData.args = JSON.stringify(updateMcpDto.args);
    if (updateMcpDto.description !== undefined)
      updateData.description = updateMcpDto.description;
    if (updateMcpDto.enabled !== undefined)
      updateData.enabled = updateMcpDto.enabled;

    await this.mcpRepository.update({ id, userEmail }, updateData);
    return this.mcpRepository.findOne({ where: { id, userEmail } });
  }

  async deleteMcp(id: number, userEmail: string): Promise<void> {
    await this.mcpRepository.delete({ id, userEmail });
  }

  // 批量同步
  async syncRules(
    userEmail: string,
    rules: CreateRuleDto[],
  ): Promise<CursorRuleEntity[]> {
    try {
      console.log('🔍 开始同步规则 - 用户邮箱:', userEmail);
      console.log('🔍 规则数据:', rules);

      // 删除用户所有规则
      console.log('🔍 删除用户现有规则...');
      await this.ruleRepository.delete({ userEmail });

      // 如果没有新规则，直接返回空数组
      if (!rules || rules.length === 0) {
        console.log('🔍 无新规则，返回空数组');
        return [];
      }

      // 批量创建新规则
      console.log('🔍 创建新规则...');
      const ruleEntities = rules.map((rule) => {
        console.log('🔍 处理规则:', rule);
        return this.ruleRepository.create({
          userEmail,
          name: rule.name,
          ruleName: rule.name, // 兼容字段
          content: rule.content,
          ruleContent: rule.content, // 兼容字段
          enabled: rule.enabled ?? true,
          order: rule.order ?? 0,
        });
      });

      console.log('🔍 准备保存规则实体:', ruleEntities);
      const savedRules = await this.ruleRepository.save(ruleEntities);
      console.log('🔍 规则保存成功:', savedRules);

      return savedRules;
    } catch (error) {
      console.error('🔍 同步规则失败:', error);
      throw error;
    }
  }

  async syncMcps(
    userEmail: string,
    mcps: CreateMcpDto[],
  ): Promise<CursorMcpEntity[]> {
    try {
      console.log('🔍 开始同步MCP - 用户邮箱:', userEmail);
      console.log('🔍 MCP数据:', mcps);

      // 删除用户所有 MCP 配置
      await this.mcpRepository.delete({ userEmail });

      // 如果没有新MCP配置，直接返回空数组
      if (!mcps || mcps.length === 0) {
        console.log('🔍 无新MCP配置，返回空数组');
        return [];
      }

      // 批量创建新 MCP 配置
      const mcpEntities = mcps.map((mcp) =>
        this.mcpRepository.create({
          userEmail,
          name: mcp.name,
          serverName: mcp.name, // 兼容字段
          command: mcp.command,
          args: JSON.stringify(mcp.args || []),
          description: mcp.description,
          enabled: mcp.enabled ?? true,
        }),
      );

      const savedMcps = await this.mcpRepository.save(mcpEntities);
      console.log('🔍 MCP保存成功:', savedMcps);

      return savedMcps;
    } catch (error) {
      console.error('🔍 同步MCP失败:', error);
      throw error;
    }
  }

  /**
   * 批量更新用户的MCP配置（直接编辑JSON）
   */
  async batchUpdateMcpConfig(
    userEmail: string,
    batchUpdateDto: BatchUpdateMcpDto,
  ): Promise<CursorMcpEntity[]> {
    try {
      console.log('🔍 开始批量更新MCP配置 - 用户邮箱:', userEmail);
      console.log('🔍 新的MCP配置:', batchUpdateDto.mcpConfig);

      // 删除用户所有现有的MCP配置
      await this.mcpRepository.delete({ userEmail });

      const mcpEntities: CursorMcpEntity[] = [];

      // 遍历新的MCP配置并创建实体
      for (const [name, config] of Object.entries(batchUpdateDto.mcpConfig)) {
        if (config && typeof config === 'object') {
          const mcpEntity = this.mcpRepository.create({
            userEmail,
            name,
            serverName: name,
            command: config.command || '',
            args: JSON.stringify(config.args || []),
            description: config.description || '',
            enabled: config.enabled !== false,
          });
          mcpEntities.push(mcpEntity);
        }
      }

      // 批量保存
      const savedMcps = await this.mcpRepository.save(mcpEntities);
      console.log('🔍 MCP配置批量更新成功:', savedMcps.length, '个配置');

      return savedMcps;
    } catch (error) {
      console.error('🔍 批量更新MCP配置失败:', error);
      throw error;
    }
  }

  /**
   * 清理无效的MCP配置（空键名或无效配置）
   */
  async cleanupInvalidMcpConfigs(userEmail: string): Promise<number> {
    try {
      console.log('🔍 开始清理无效MCP配置 - 用户邮箱:', userEmail);

      // 查找并删除无效的配置项
      const result = await this.mcpRepository
        .createQueryBuilder()
        .delete()
        .from(CursorMcpEntity)
        .where('userEmail = :userEmail', { userEmail })
        .andWhere(
          '(name IS NULL OR name = "" OR TRIM(name) = "" OR command IS NULL OR command = "")',
        )
        .execute();

      const deletedCount = result.affected || 0;
      console.log('🔍 清理完成，删除了', deletedCount, '个无效配置');

      return deletedCount;
    } catch (error) {
      console.error('🔍 清理无效MCP配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户的MCP配置（JSON格式）
   */
  async getMcpConfigAsJson(userEmail: string): Promise<Record<string, any>> {
    try {
      // 先清理无效的配置
      await this.cleanupInvalidMcpConfigs(userEmail);

      const mcps = await this.getMcpsByUserEmail(userEmail);
      const mcpConfig: Record<string, any> = {};

      for (const mcp of mcps) {
        // 跳过无效的配置项（空键名或无效配置）
        if (!mcp.name || mcp.name.trim() === '' || !mcp.command) {
          console.warn('跳过无效的MCP配置:', {
            id: mcp.id,
            name: mcp.name,
            command: mcp.command,
          });
          continue;
        }

        const config: any = {
          command: mcp.command,
        };

        // 解析参数
        if (mcp.args) {
          try {
            const args = JSON.parse(mcp.args);
            if (Array.isArray(args) && args.length > 0) {
              config.args = args;
            }
          } catch (e) {
            console.warn('解析MCP参数失败:', e);
          }
        }

        // 添加描述
        if (mcp.description) {
          config.description = mcp.description;
        }

        // 添加启用状态
        if (mcp.enabled !== undefined) {
          config.enabled = mcp.enabled;
        }

        mcpConfig[mcp.name.trim()] = config;
      }

      console.log('🔍 生成的MCP配置JSON:', mcpConfig);
      return mcpConfig;
    } catch (error) {
      console.error('🔍 获取MCP配置JSON失败:', error);
      throw error;
    }
  }

  /**
   * 分享MCP配置
   */
  async shareMcpConfig(
    userEmail: string,
    shareDto: ShareMcpConfigDto,
  ): Promise<CursorMcpShareEntity> {
    try {
      console.log('🔍 开始分享MCP配置 - 用户邮箱:', userEmail);
      console.log('🔍 分享数据:', shareDto);

      // 如果没有提供配置，则使用当前用户的配置
      let mcpConfigToShare = shareDto.mcpConfig;
      if (!mcpConfigToShare || Object.keys(mcpConfigToShare).length === 0) {
        console.log('🔍 未提供配置，使用当前用户配置');
        mcpConfigToShare = await this.getMcpConfigAsJson(userEmail);
      }

      // 验证配置不为空
      if (!mcpConfigToShare || Object.keys(mcpConfigToShare).length === 0) {
        throw new Error('没有可分享的MCP配置');
      }

      // 生成唯一的分享ID
      const shareId = uuidv4().replace(/-/g, '').substring(0, 16);

      console.log('🔍 准备保存分享配置:', {
        shareId,
        title: shareDto.title,
        description: shareDto.description,
        configKeys: Object.keys(mcpConfigToShare),
      });

      const shareEntity = this.mcpShareRepository.create({
        shareId,
        creatorEmail: userEmail,
        title: shareDto.title || 'MCP配置分享',
        description: shareDto.description || '用户分享的MCP配置',
        mcpConfig: JSON.stringify(mcpConfigToShare),
        usageCount: 0,
        enabled: true,
      });

      const savedShare = await this.mcpShareRepository.save(shareEntity);
      console.log('🔍 MCP配置分享成功，分享ID:', shareId);

      return savedShare;
    } catch (error) {
      console.error('🔍 分享MCP配置失败:', error);
      throw new Error(`分享配置失败: ${error.message || error}`);
    }
  }

  /**
   * 通过分享ID获取MCP配置
   */
  async getMcpConfigByShareId(shareId: string): Promise<CursorMcpShareEntity> {
    try {
      console.log('🔍 通过分享ID获取MCP配置:', shareId);

      const shareEntity = await this.mcpShareRepository.findOne({
        where: { shareId, enabled: true },
      });

      if (!shareEntity) {
        throw new Error('分享配置不存在或已失效');
      }

      // 增加使用次数
      await this.mcpShareRepository.update(shareEntity.id, {
        usageCount: shareEntity.usageCount + 1,
      });

      console.log('🔍 获取分享配置成功');
      return shareEntity;
    } catch (error) {
      console.error('🔍 获取分享配置失败:', error);
      throw error;
    }
  }

  /**
   * 通过分享ID添加MCP配置到用户配置中
   */
  async addMcpByShareId(
    userEmail: string,
    addDto: AddMcpByShareIdDto,
  ): Promise<CursorMcpEntity[]> {
    try {
      console.log(
        '🔍 通过分享ID添加MCP配置 - 用户邮箱:',
        userEmail,
        '分享ID:',
        addDto.shareId,
      );

      // 获取分享的配置
      const shareEntity = await this.getMcpConfigByShareId(addDto.shareId);
      const sharedMcpConfig = JSON.parse(shareEntity.mcpConfig);

      // 获取用户现有的MCP配置
      const existingMcps = await this.getMcpsByUserEmail(userEmail);
      const existingNames = new Set(existingMcps.map((mcp) => mcp.name));

      const newMcpEntities: CursorMcpEntity[] = [];

      // 遍历分享的配置，只添加不存在的配置
      for (const [name, config] of Object.entries(sharedMcpConfig)) {
        if (!existingNames.has(name) && config && typeof config === 'object') {
          const mcpEntity = this.mcpRepository.create({
            userEmail,
            name,
            serverName: name,
            command: (config as any).command || '',
            args: JSON.stringify((config as any).args || []),
            description: (config as any).description || '',
            enabled: (config as any).enabled !== false,
          });
          newMcpEntities.push(mcpEntity);
        }
      }

      // 批量保存新的配置
      const savedMcps = await this.mcpRepository.save(newMcpEntities);
      console.log('🔍 成功添加', savedMcps.length, '个新的MCP配置');

      return savedMcps;
    } catch (error) {
      console.error('🔍 通过分享ID添加MCP配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户的分享列表
   */
  async getUserShares(userEmail: string): Promise<CursorMcpShareEntity[]> {
    try {
      return await this.mcpShareRepository.find({
        where: { creatorEmail: userEmail },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      console.error('🔍 获取用户分享列表失败:', error);
      throw error;
    }
  }

  /**
   * 删除分享
   */
  async deleteShare(shareId: string, userEmail: string): Promise<void> {
    try {
      await this.mcpShareRepository.delete({
        shareId,
        creatorEmail: userEmail,
      });
      console.log('🔍 删除分享成功:', shareId);
    } catch (error) {
      console.error('🔍 删除分享失败:', error);
      throw error;
    }
  }
}
