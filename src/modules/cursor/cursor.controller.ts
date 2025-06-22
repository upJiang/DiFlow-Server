import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CursorService } from './cursor.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import {
  CreateMcpDto,
  UpdateMcpDto,
  ShareMcpConfigDto,
  AddMcpByShareIdDto,
  BatchUpdateMcpDto,
} from './dto/mcp.dto';

@Controller('cursor')
@ApiTags('Cursor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CursorController {
  constructor(private readonly cursorService: CursorService) {}

  // 规则相关接口
  @Get('rules')
  @ApiOperation({ summary: '获取用户规则列表' })
  @ApiResponse({ status: 200, description: '成功获取规则列表' })
  async getRules(@Request() req) {
    console.log('🔍 获取规则 - 用户邮箱:', req.user.email);
    const rules = await this.cursorService.getRulesByUserEmail(req.user.email);

    console.log('🔍 获取到的规则数据:', rules);

    return {
      code: 200,
      message: '获取规则列表成功',
      data: {
        rules: rules,
      },
    };
  }

  @Post('rules')
  @ApiOperation({ summary: '创建新规则' })
  @ApiResponse({ status: 201, description: '成功创建规则' })
  async createRule(@Request() req, @Body() createRuleDto: CreateRuleDto) {
    const rule = await this.cursorService.createRule(
      req.user.email,
      createRuleDto,
    );
    return {
      code: 201,
      message: '创建规则成功',
      data: rule,
    };
  }

  @Put('rules/:id')
  @ApiOperation({ summary: '更新规则' })
  @ApiResponse({ status: 200, description: '成功更新规则' })
  async updateRule(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    const rule = await this.cursorService.updateRule(
      id,
      req.user.email,
      updateRuleDto,
    );
    return {
      code: 200,
      message: '更新规则成功',
      data: rule,
    };
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: '删除规则' })
  @ApiResponse({ status: 200, description: '成功删除规则' })
  async deleteRule(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.cursorService.deleteRule(id, req.user.email);
    return {
      code: 200,
      message: '删除规则成功',
    };
  }

  // MCP 相关接口
  @Get('mcps')
  @ApiOperation({ summary: '获取用户 MCP 配置列表' })
  @ApiResponse({ status: 200, description: '成功获取 MCP 配置列表' })
  async getMcps(@Request() req) {
    console.log('🔍 获取MCP配置 - 用户邮箱:', req.user.email);
    const mcps = await this.cursorService.getMcpsByUserEmail(req.user.email);

    // 转换数据格式以匹配前端期望
    const formattedMcps = mcps.map((mcp) => ({
      id: mcp.id,
      serverName: mcp.name, // 使用name字段
      command: mcp.command,
      args: mcp.args ? JSON.parse(mcp.args) : [], // 解析JSON字符串
      env: {}, // 实体中没有env字段，返回空对象
      sortOrder: 0, // 实体中没有sortOrder字段，返回默认值
      isEnabled: mcp.enabled, // 使用enabled字段
      createdAt: mcp.createdAt,
      updatedAt: mcp.createdAt, // 实体中没有updatedAt，使用createdAt
    }));

    console.log('🔍 格式化后的MCP数据:', formattedMcps);

    return {
      code: 200,
      message: '获取 MCP 配置列表成功',
      data: {
        mcps: formattedMcps,
      },
    };
  }

  @Post('mcps')
  @ApiOperation({ summary: '创建新 MCP 配置' })
  @ApiResponse({ status: 201, description: '成功创建 MCP 配置' })
  async createMcp(@Request() req, @Body() createMcpDto: CreateMcpDto) {
    const mcp = await this.cursorService.createMcp(
      req.user.email,
      createMcpDto,
    );
    return {
      code: 201,
      message: '创建 MCP 配置成功',
      data: mcp,
    };
  }

  @Put('mcps/:id')
  @ApiOperation({ summary: '更新 MCP 配置' })
  @ApiResponse({ status: 200, description: '成功更新 MCP 配置' })
  async updateMcp(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMcpDto: UpdateMcpDto,
  ) {
    const mcp = await this.cursorService.updateMcp(
      id,
      req.user.email,
      updateMcpDto,
    );
    return {
      code: 200,
      message: '更新 MCP 配置成功',
      data: mcp,
    };
  }

  @Delete('mcps/:id')
  @ApiOperation({ summary: '删除 MCP 配置' })
  @ApiResponse({ status: 200, description: '成功删除 MCP 配置' })
  async deleteMcp(@Request() req, @Param('id', ParseIntPipe) id: number) {
    await this.cursorService.deleteMcp(id, req.user.email);
    return {
      code: 200,
      message: '删除 MCP 配置成功',
    };
  }

  // 新增：获取MCP配置的JSON格式
  @Get('mcps/json')
  @ApiOperation({ summary: '获取用户 MCP 配置 (JSON格式)' })
  @ApiResponse({ status: 200, description: '成功获取 MCP 配置 JSON' })
  async getMcpConfigJson(@Request() req) {
    console.log('🔍 获取MCP配置JSON - 用户邮箱:', req.user.email);
    const mcpConfig = await this.cursorService.getMcpConfigAsJson(
      req.user.email,
    );

    return {
      code: 200,
      message: '获取 MCP 配置 JSON 成功',
      data: {
        mcpConfig,
      },
    };
  }

  // 新增：批量更新MCP配置（直接编辑JSON）
  @Put('mcps/batch')
  @ApiOperation({ summary: '批量更新 MCP 配置 (JSON编辑)' })
  @ApiResponse({ status: 200, description: '成功批量更新 MCP 配置' })
  async batchUpdateMcpConfig(
    @Request() req,
    @Body() batchUpdateDto: BatchUpdateMcpDto,
  ) {
    console.log('🔍 批量更新MCP配置 - 用户邮箱:', req.user.email);
    const mcps = await this.cursorService.batchUpdateMcpConfig(
      req.user.email,
      batchUpdateDto,
    );

    return {
      code: 200,
      message: '批量更新 MCP 配置成功',
      data: {
        mcps,
        count: mcps.length,
      },
    };
  }

  // 新增：分享MCP配置
  @Post('mcps/share')
  @ApiOperation({ summary: '分享 MCP 配置' })
  @ApiResponse({ status: 201, description: '成功创建分享' })
  async shareMcpConfig(@Request() req, @Body() shareDto: ShareMcpConfigDto) {
    try {
      console.log('🔍 分享MCP配置 - 用户邮箱:', req.user.email);
      console.log('🔍 请求体:', shareDto);

      const share = await this.cursorService.shareMcpConfig(
        req.user.email,
        shareDto,
      );

      return {
        code: 201,
        message: '分享 MCP 配置成功',
        data: {
          shareId: share.shareId,
          title: share.title,
          description: share.description,
          createdAt: share.createdAt,
        },
      };
    } catch (error) {
      console.error('🔍 分享MCP配置失败:', error);
      return {
        code: 500,
        message: error.message || '分享配置失败',
        data: null,
      };
    }
  }

  // 新增：通过分享ID获取MCP配置
  @Get('mcps/share/:shareId')
  @ApiOperation({ summary: '通过分享ID获取 MCP 配置' })
  @ApiResponse({ status: 200, description: '成功获取分享的 MCP 配置' })
  async getMcpConfigByShareId(@Param('shareId') shareId: string) {
    try {
      console.log('🔍 通过分享ID获取MCP配置:', shareId);
      const share = await this.cursorService.getMcpConfigByShareId(shareId);

      return {
        code: 200,
        message: '获取分享配置成功',
        data: {
          shareId: share.shareId,
          title: share.title,
          description: share.description,
          mcpConfig: JSON.parse(share.mcpConfig),
          creatorEmail: share.creatorEmail,
          usageCount: share.usageCount,
          createdAt: share.createdAt,
        },
      };
    } catch (error) {
      console.error('🔍 获取分享配置失败:', error);
      return {
        code: 500,
        message: error.message || '获取分享配置失败',
        data: null,
      };
    }
  }

  // 新增：通过分享ID添加MCP配置
  @Post('mcps/add-by-share')
  @ApiOperation({ summary: '通过分享ID添加 MCP 配置' })
  @ApiResponse({ status: 201, description: '成功添加分享的 MCP 配置' })
  async addMcpByShareId(@Request() req, @Body() addDto: AddMcpByShareIdDto) {
    console.log(
      '🔍 通过分享ID添加MCP配置 - 用户邮箱:',
      req.user.email,
      '分享ID:',
      addDto.shareId,
    );
    const newMcps = await this.cursorService.addMcpByShareId(
      req.user.email,
      addDto,
    );

    return {
      code: 201,
      message: `成功添加 ${newMcps.length} 个新的 MCP 配置`,
      data: {
        addedMcps: newMcps,
        count: newMcps.length,
      },
    };
  }

  // 新增：获取用户的分享列表
  @Get('shares')
  @ApiOperation({ summary: '获取用户的分享列表' })
  @ApiResponse({ status: 200, description: '成功获取分享列表' })
  async getUserShares(@Request() req) {
    console.log('🔍 获取用户分享列表 - 用户邮箱:', req.user.email);
    const shares = await this.cursorService.getUserShares(req.user.email);

    return {
      code: 200,
      message: '获取分享列表成功',
      data: {
        shares: shares.map((share) => ({
          id: share.id,
          shareId: share.shareId,
          title: share.title,
          description: share.description,
          usageCount: share.usageCount,
          enabled: share.enabled,
          createdAt: share.createdAt,
          updatedAt: share.updatedAt,
        })),
      },
    };
  }

  // 新增：删除分享
  @Delete('shares/:shareId')
  @ApiOperation({ summary: '删除分享' })
  @ApiResponse({ status: 200, description: '成功删除分享' })
  async deleteShare(@Request() req, @Param('shareId') shareId: string) {
    console.log('🔍 删除分享 - 用户邮箱:', req.user.email, '分享ID:', shareId);
    await this.cursorService.deleteShare(shareId, req.user.email);

    return {
      code: 200,
      message: '删除分享成功',
    };
  }

  // 批量同步接口
  @Post('sync/rules')
  @ApiOperation({ summary: '批量同步规则' })
  @ApiResponse({ status: 200, description: '成功同步规则' })
  async syncRules(@Request() req, @Body() body: { rules: CreateRuleDto[] }) {
    try {
      console.log('🔍 同步规则 - 用户邮箱:', req.user.email);
      console.log('🔍 接收到的规则数据:', body);

      // 验证请求体格式
      if (!body || !Array.isArray(body.rules)) {
        return {
          code: 400,
          message: '请求格式错误：rules 必须是数组',
          data: null,
        };
      }

      // 转换前端数据格式为后端期望的格式
      const rulesData = body.rules.map((rule) => ({
        name: rule.name,
        content: rule.content,
        description: rule.description || '',
        type: rule.type || '',
        order: rule.order || 0,
        enabled: rule.enabled !== false, // 默认启用
      }));

      console.log('🔍 转换后的规则数据:', rulesData);

      const syncedRules = await this.cursorService.syncRules(
        req.user.email,
        rulesData,
      );

      return {
        code: 200,
        message: '同步规则成功',
        data: {
          success: true,
          message: '同步规则成功',
          rules: syncedRules,
        },
      };
    } catch (error) {
      console.error('🔍 同步规则失败:', error);
      return {
        code: 500,
        message: '同步规则失败',
        data: {
          success: false,
          message: error.message || '同步规则失败',
          error: error,
        },
      };
    }
  }

  @Post('sync/mcps')
  @ApiOperation({ summary: '批量同步 MCP 配置' })
  @ApiResponse({ status: 200, description: '成功同步 MCP 配置' })
  async syncMcps(@Request() req, @Body() body: { mcps: CreateMcpDto[] }) {
    try {
      console.log('🔍 同步MCP配置 - 用户邮箱:', req.user.email);
      console.log('🔍 接收到的MCP数据:', body);

      // 验证请求体格式
      if (!body || !Array.isArray(body.mcps)) {
        return {
          code: 400,
          message: '请求格式错误：mcps 必须是数组',
          data: null,
        };
      }

      // 转换前端数据格式为后端期望的格式
      const mcpsData = body.mcps.map((mcp) => ({
        name: mcp.name,
        command: mcp.command,
        args: mcp.args || [], // 保持数组格式
        env: mcp.env || {},
        description: mcp.description || '',
        enabled: mcp.enabled !== false,
      }));

      console.log('🔍 转换后的MCP数据:', mcpsData);

      const syncedMcps = await this.cursorService.syncMcps(
        req.user.email,
        mcpsData,
      );

      // 转换返回数据格式
      const formattedMcps = syncedMcps.map((mcp) => ({
        id: mcp.id,
        serverName: mcp.name, // 使用name字段
        command: mcp.command,
        args: mcp.args ? JSON.parse(mcp.args) : [], // 解析JSON字符串
        env: {}, // 实体中没有env字段，返回空对象
        sortOrder: 0, // 实体中没有sortOrder字段，返回默认值
        isEnabled: mcp.enabled, // 使用enabled字段
        createdAt: mcp.createdAt,
        updatedAt: mcp.createdAt, // 实体中没有updatedAt，使用createdAt
      }));

      return {
        code: 200,
        message: '同步 MCP 配置成功',
        data: {
          success: true,
          message: '同步 MCP 配置成功',
          mcps: formattedMcps,
        },
      };
    } catch (error) {
      console.error('🔍 同步MCP配置失败:', error);
      return {
        code: 500,
        message: '同步MCP配置失败',
        data: {
          success: false,
          message: error.message || '同步MCP配置失败',
          error: error,
        },
      };
    }
  }
}
