import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('diflow/api')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  // 用户认证接口
  @Post('auth')
  async authenticateUser(
    @Body()
    body: {
      email: string;
      username?: string;
      cursorUserId?: string;
      avatar?: string;
    },
  ) {
    const { email, username, cursorUserId, avatar } = body;
    return await this.pluginService.authenticateUser(
      email,
      username,
      cursorUserId,
      avatar,
    );
  }

  // 获取用户信息
  @Get('user/:email')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Param('email') email: string) {
    const rules = await this.pluginService.getUserRules(email);
    const mcpServers = await this.pluginService.getUserMcpServers(email);
    return {
      email,
      rules,
      mcpServers,
    };
  }

  // 获取用户规则
  @Get('user/:email/rules')
  @UseGuards(JwtAuthGuard)
  async getUserRules(@Param('email') email: string) {
    return await this.pluginService.getUserRules(email);
  }

  // 保存用户规则
  @Put('user/:email/rules')
  @UseGuards(JwtAuthGuard)
  async saveUserRules(
    @Param('email') email: string,
    @Body()
    body: {
      rules: Array<{
        ruleName: string;
        ruleContent: string;
        sortOrder?: number;
      }>;
    },
  ) {
    const { rules } = body;
    const results = [];

    for (const rule of rules) {
      const result = await this.pluginService.saveUserRule(
        email,
        rule.ruleName,
        rule.ruleContent,
        rule.sortOrder || 0,
      );
      results.push(result);
    }

    return { success: true, data: results };
  }

  // 删除用户规则
  @Delete('user/:email/rules/:ruleId')
  @UseGuards(JwtAuthGuard)
  async deleteUserRule(
    @Param('email') email: string,
    @Param('ruleId') ruleId: number,
  ) {
    const success = await this.pluginService.deleteUserRule(email, ruleId);
    return { success };
  }

  // 获取MCP服务器
  @Get('user/:email/mcps')
  @UseGuards(JwtAuthGuard)
  async getMcpServers(@Param('email') email: string) {
    return await this.pluginService.getUserMcpServers(email);
  }

  // 保存MCP服务器
  @Put('user/:email/mcps')
  @UseGuards(JwtAuthGuard)
  async saveMcpServers(
    @Param('email') email: string,
    @Body()
    body: {
      mcps: Array<{
        serverName: string;
        command: string;
        args?: string[];
        env?: Record<string, string>;
        sortOrder?: number;
      }>;
    },
  ) {
    const { mcps } = body;
    const results = [];

    for (const mcp of mcps) {
      const result = await this.pluginService.saveMcpServer(
        email,
        mcp.serverName,
        mcp.command,
        mcp.args || [],
        mcp.env || {},
        mcp.sortOrder || 0,
      );
      results.push(result);
    }

    return { success: true, data: results };
  }

  // 删除MCP服务器
  @Delete('user/:email/mcps/:serverId')
  @UseGuards(JwtAuthGuard)
  async deleteMcpServer(
    @Param('email') email: string,
    @Param('serverId') serverId: number,
  ) {
    const success = await this.pluginService.deleteMcpServer(email, serverId);
    return { success };
  }

  // 切换规则状态
  @Put('user/:email/rules/:ruleId/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleRuleStatus(
    @Param('email') email: string,
    @Param('ruleId') ruleId: number,
  ) {
    const rule = await this.pluginService.toggleRuleStatus(email, ruleId);
    return { success: !!rule, data: rule };
  }

  // 切换MCP服务器状态
  @Put('user/:email/mcps/:serverId/toggle')
  @UseGuards(JwtAuthGuard)
  async toggleMcpServerStatus(
    @Param('email') email: string,
    @Param('serverId') serverId: number,
  ) {
    const server = await this.pluginService.toggleMcpServerStatus(
      email,
      serverId,
    );
    return { success: !!server, data: server };
  }
}
