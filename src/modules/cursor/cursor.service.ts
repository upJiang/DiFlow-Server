import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PluginCursorRulesEntity } from '../../auth/entities/plugin-cursor-rules.entity';
import { PluginCursorMcpsEntity } from '../../auth/entities/plugin-cursor-mcps.entity';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import { CreateMcpDto, UpdateMcpDto } from './dto/mcp.dto';

@Injectable()
export class CursorService {
  constructor(
    @InjectRepository(PluginCursorRulesEntity)
    private readonly ruleRepository: Repository<PluginCursorRulesEntity>,
    @InjectRepository(PluginCursorMcpsEntity)
    private readonly mcpRepository: Repository<PluginCursorMcpsEntity>,
  ) {}

  // 规则管理
  async getRulesByUserEmail(
    userEmail: string,
  ): Promise<PluginCursorRulesEntity[]> {
    return this.ruleRepository.find({
      where: { userEmail },
      order: { createdAt: 'DESC' },
    });
  }

  async createRule(
    userEmail: string,
    createRuleDto: CreateRuleDto,
  ): Promise<PluginCursorRulesEntity> {
    const rule = this.ruleRepository.create({
      userEmail,
      ruleName: createRuleDto.name,
      ruleContent: createRuleDto.content,
      isEnabled: createRuleDto.enabled ?? true,
      sortOrder: createRuleDto.order ?? 0,
    });
    return this.ruleRepository.save(rule);
  }

  async updateRule(
    id: number,
    userEmail: string,
    updateRuleDto: UpdateRuleDto,
  ): Promise<PluginCursorRulesEntity> {
    const updateData: Partial<PluginCursorRulesEntity> = {};
    if (updateRuleDto.name !== undefined)
      updateData.ruleName = updateRuleDto.name;
    if (updateRuleDto.content !== undefined)
      updateData.ruleContent = updateRuleDto.content;
    if (updateRuleDto.enabled !== undefined)
      updateData.isEnabled = updateRuleDto.enabled;
    if (updateRuleDto.order !== undefined)
      updateData.sortOrder = updateRuleDto.order;

    await this.ruleRepository.update({ id, userEmail }, updateData);
    return this.ruleRepository.findOne({ where: { id, userEmail } });
  }

  async deleteRule(id: number, userEmail: string): Promise<void> {
    await this.ruleRepository.delete({ id, userEmail });
  }

  // MCP 管理
  async getMcpsByUserEmail(
    userEmail: string,
  ): Promise<PluginCursorMcpsEntity[]> {
    return this.mcpRepository.find({
      where: { userEmail },
      order: { createdAt: 'DESC' },
    });
  }

  async createMcp(
    userEmail: string,
    createMcpDto: CreateMcpDto,
  ): Promise<PluginCursorMcpsEntity> {
    const mcp = this.mcpRepository.create({
      userEmail,
      serverName: createMcpDto.name,
      command: createMcpDto.command,
      args: createMcpDto.args ? JSON.parse(createMcpDto.args) : [],
      env: createMcpDto.env || {},
      isEnabled: createMcpDto.enabled ?? true,
      sortOrder: 0,
    });
    return this.mcpRepository.save(mcp);
  }

  async updateMcp(
    id: number,
    userEmail: string,
    updateMcpDto: UpdateMcpDto,
  ): Promise<PluginCursorMcpsEntity> {
    const updateData: Partial<PluginCursorMcpsEntity> = {};
    if (updateMcpDto.name !== undefined)
      updateData.serverName = updateMcpDto.name;
    if (updateMcpDto.command !== undefined)
      updateData.command = updateMcpDto.command;
    if (updateMcpDto.args !== undefined)
      updateData.args = JSON.parse(updateMcpDto.args);
    if (updateMcpDto.env !== undefined) updateData.env = updateMcpDto.env;
    if (updateMcpDto.enabled !== undefined)
      updateData.isEnabled = updateMcpDto.enabled;

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
  ): Promise<PluginCursorRulesEntity[]> {
    // 删除用户所有规则
    await this.ruleRepository.delete({ userEmail });

    // 批量创建新规则
    const ruleEntities = rules.map((rule) =>
      this.ruleRepository.create({
        userEmail,
        ruleName: rule.name,
        ruleContent: rule.content,
        isEnabled: rule.enabled ?? true,
        sortOrder: rule.order ?? 0,
      }),
    );

    return this.ruleRepository.save(ruleEntities);
  }

  async syncMcps(
    userEmail: string,
    mcps: CreateMcpDto[],
  ): Promise<PluginCursorMcpsEntity[]> {
    // 删除用户所有 MCP 配置
    await this.mcpRepository.delete({ userEmail });

    // 批量创建新 MCP 配置
    const mcpEntities = mcps.map((mcp) =>
      this.mcpRepository.create({
        userEmail,
        serverName: mcp.name,
        command: mcp.command,
        args: mcp.args ? JSON.parse(mcp.args) : [],
        env: mcp.env || {},
        isEnabled: mcp.enabled ?? true,
        sortOrder: 0,
      }),
    );

    return this.mcpRepository.save(mcpEntities);
  }
}
