import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { PluginUserEntity } from './entities/plugin-user.entity';
import { PluginCursorRulesEntity } from './entities/plugin-cursor-rules.entity';
import { PluginCursorMcpsEntity } from './entities/plugin-cursor-mcps.entity';

@Injectable()
export class PluginService {
  constructor(
    @InjectRepository(PluginUserEntity)
    private readonly pluginUserRepository: Repository<PluginUserEntity>,
    @InjectRepository(PluginCursorRulesEntity)
    private readonly pluginCursorRulesRepository: Repository<PluginCursorRulesEntity>,
    @InjectRepository(PluginCursorMcpsEntity)
    private readonly pluginCursorMcpsRepository: Repository<PluginCursorMcpsEntity>,
    private readonly jwtService: JwtService,
  ) {}

  // 用户认证和创建
  async authenticateUser(
    email: string,
    username?: string,
    cursorUserId?: string,
    avatar?: string,
  ) {
    let user = await this.pluginUserRepository.findOne({ where: { email } });

    if (!user) {
      user = this.pluginUserRepository.create({
        email,
        username,
        cursorUserId,
        avatar,
        isActive: true,
      });
      await this.pluginUserRepository.save(user);
    } else {
      // 更新用户信息
      if (username) user.username = username;
      if (cursorUserId) user.cursorUserId = cursorUserId;
      if (avatar) user.avatar = avatar;
      await this.pluginUserRepository.save(user);
    }

    // 生成JWT token
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
    };
  }

  // 验证token
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.pluginUserRepository.findOne({
        where: { email: payload.email },
      });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('用户不存在或已被禁用');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('无效的token');
    }
  }

  // 获取用户的Cursor规则
  async getUserRules(email: string) {
    return await this.pluginCursorRulesRepository.find({
      where: { userEmail: email },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  // 保存用户规则
  async saveUserRule(
    email: string,
    ruleName: string,
    ruleContent: string,
    sortOrder: number = 0,
  ) {
    const existingRule = await this.pluginCursorRulesRepository.findOne({
      where: { userEmail: email, ruleName },
    });

    if (existingRule) {
      existingRule.ruleContent = ruleContent;
      existingRule.sortOrder = sortOrder;
      return await this.pluginCursorRulesRepository.save(existingRule);
    } else {
      const newRule = this.pluginCursorRulesRepository.create({
        userEmail: email,
        ruleName,
        ruleContent,
        sortOrder,
        isEnabled: true,
      });
      return await this.pluginCursorRulesRepository.save(newRule);
    }
  }

  // 删除用户规则
  async deleteUserRule(email: string, ruleId: number) {
    const rule = await this.pluginCursorRulesRepository.findOne({
      where: { id: ruleId, userEmail: email },
    });
    if (rule) {
      await this.pluginCursorRulesRepository.remove(rule);
      return true;
    }
    return false;
  }

  // 获取用户的MCP服务器
  async getUserMcpServers(email: string) {
    return await this.pluginCursorMcpsRepository.find({
      where: { userEmail: email },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  // 保存MCP服务器
  async saveMcpServer(
    email: string,
    serverName: string,
    command: string,
    args: string[] = [],
    env: Record<string, string> = {},
    sortOrder: number = 0,
  ) {
    const existingServer = await this.pluginCursorMcpsRepository.findOne({
      where: { userEmail: email, serverName },
    });

    if (existingServer) {
      existingServer.command = command;
      existingServer.args = args;
      existingServer.env = env;
      existingServer.sortOrder = sortOrder;
      return await this.pluginCursorMcpsRepository.save(existingServer);
    } else {
      const newServer = this.pluginCursorMcpsRepository.create({
        userEmail: email,
        serverName,
        command,
        args,
        env,
        sortOrder,
        isEnabled: true,
      });
      return await this.pluginCursorMcpsRepository.save(newServer);
    }
  }

  // 删除MCP服务器
  async deleteMcpServer(email: string, serverId: number) {
    const server = await this.pluginCursorMcpsRepository.findOne({
      where: { id: serverId, userEmail: email },
    });
    if (server) {
      await this.pluginCursorMcpsRepository.remove(server);
      return true;
    }
    return false;
  }

  // 切换规则启用状态
  async toggleRuleStatus(email: string, ruleId: number) {
    const rule = await this.pluginCursorRulesRepository.findOne({
      where: { id: ruleId, userEmail: email },
    });
    if (rule) {
      rule.isEnabled = !rule.isEnabled;
      return await this.pluginCursorRulesRepository.save(rule);
    }
    return null;
  }

  // 切换MCP服务器启用状态
  async toggleMcpServerStatus(email: string, serverId: number) {
    const server = await this.pluginCursorMcpsRepository.findOne({
      where: { id: serverId, userEmail: email },
    });
    if (server) {
      server.isEnabled = !server.isEnabled;
      return await this.pluginCursorMcpsRepository.save(server);
    }
    return null;
  }
}
