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
  async getRulesByUserId(userId: number): Promise<CursorRuleEntity[]> {
    return this.ruleRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createRule(
    userId: number,
    createRuleDto: CreateRuleDto,
  ): Promise<CursorRuleEntity> {
    const rule = this.ruleRepository.create({
      ...createRuleDto,
      userId,
    });
    return this.ruleRepository.save(rule);
  }

  async updateRule(
    id: number,
    userId: number,
    updateRuleDto: UpdateRuleDto,
  ): Promise<CursorRuleEntity> {
    await this.ruleRepository.update({ id, userId }, updateRuleDto);
    return this.ruleRepository.findOne({ where: { id, userId } });
  }

  async deleteRule(id: number, userId: number): Promise<void> {
    await this.ruleRepository.delete({ id, userId });
  }

  // MCP 管理
  async getMcpsByUserId(userId: number): Promise<CursorMcpEntity[]> {
    return this.mcpRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createMcp(
    userId: number,
    createMcpDto: CreateMcpDto,
  ): Promise<CursorMcpEntity> {
    const mcp = this.mcpRepository.create({
      ...createMcpDto,
      userId,
    });
    return this.mcpRepository.save(mcp);
  }

  async updateMcp(
    id: number,
    userId: number,
    updateMcpDto: UpdateMcpDto,
  ): Promise<CursorMcpEntity> {
    await this.mcpRepository.update({ id, userId }, updateMcpDto);
    return this.mcpRepository.findOne({ where: { id, userId } });
  }

  async deleteMcp(id: number, userId: number): Promise<void> {
    await this.mcpRepository.delete({ id, userId });
  }

  // 批量同步
  async syncRules(
    userId: number,
    rules: CreateRuleDto[],
  ): Promise<CursorRuleEntity[]> {
    // 删除用户所有规则
    await this.ruleRepository.delete({ userId });

    // 批量创建新规则
    const ruleEntities = rules.map((rule) =>
      this.ruleRepository.create({
        ...rule,
        userId,
      }),
    );

    return this.ruleRepository.save(ruleEntities);
  }

  async syncMcps(
    userId: number,
    mcps: CreateMcpDto[],
  ): Promise<CursorMcpEntity[]> {
    // 删除用户所有 MCP 配置
    await this.mcpRepository.delete({ userId });

    // 批量创建新 MCP 配置
    const mcpEntities = mcps.map((mcp) =>
      this.mcpRepository.create({
        ...mcp,
        userId,
      }),
    );

    return this.mcpRepository.save(mcpEntities);
  }
}
