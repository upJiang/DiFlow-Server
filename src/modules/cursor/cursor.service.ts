import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursorRuleEntity } from './entities/cursor-rule.entity';
import { CursorMcpEntity } from './entities/cursor-mcp.entity';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import { CreateMcpDto, UpdateMcpDto } from './dto/mcp.dto';

@Injectable()
export class CursorService {
  constructor(
    @InjectRepository(CursorRuleEntity)
    private readonly ruleRepository: Repository<CursorRuleEntity>,
    @InjectRepository(CursorMcpEntity)
    private readonly mcpRepository: Repository<CursorMcpEntity>,
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
}
