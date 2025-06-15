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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';
import { CreateMcpDto, UpdateMcpDto } from './dto/mcp.dto';

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
    const rules = await this.cursorService.getRulesByUserId(req.user.id);
    return {
      code: 200,
      message: '获取规则列表成功',
      data: rules,
    };
  }

  @Post('rules')
  @ApiOperation({ summary: '创建新规则' })
  @ApiResponse({ status: 201, description: '成功创建规则' })
  async createRule(@Request() req, @Body() createRuleDto: CreateRuleDto) {
    const rule = await this.cursorService.createRule(
      req.user.id,
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
      req.user.id,
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
    await this.cursorService.deleteRule(id, req.user.id);
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
    const mcps = await this.cursorService.getMcpsByUserId(req.user.id);
    return {
      code: 200,
      message: '获取 MCP 配置列表成功',
      data: mcps,
    };
  }

  @Post('mcps')
  @ApiOperation({ summary: '创建新 MCP 配置' })
  @ApiResponse({ status: 201, description: '成功创建 MCP 配置' })
  async createMcp(@Request() req, @Body() createMcpDto: CreateMcpDto) {
    const mcp = await this.cursorService.createMcp(req.user.id, createMcpDto);
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
      req.user.id,
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
    await this.cursorService.deleteMcp(id, req.user.id);
    return {
      code: 200,
      message: '删除 MCP 配置成功',
    };
  }

  // 批量同步接口
  @Post('sync/rules')
  @ApiOperation({ summary: '批量同步规则' })
  @ApiResponse({ status: 200, description: '成功同步规则' })
  async syncRules(@Request() req, @Body() rules: CreateRuleDto[]) {
    const syncedRules = await this.cursorService.syncRules(req.user.id, rules);
    return {
      code: 200,
      message: '同步规则成功',
      data: syncedRules,
    };
  }

  @Post('sync/mcps')
  @ApiOperation({ summary: '批量同步 MCP 配置' })
  @ApiResponse({ status: 200, description: '成功同步 MCP 配置' })
  async syncMcps(@Request() req, @Body() mcps: CreateMcpDto[]) {
    const syncedMcps = await this.cursorService.syncMcps(req.user.id, mcps);
    return {
      code: 200,
      message: '同步 MCP 配置成功',
      data: syncedMcps,
    };
  }
}
