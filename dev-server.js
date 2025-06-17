#!/usr/bin/env node

const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// 配置
const SERVER_PORT = 3001; // 更新为新端口

/**
 * 检查端口是否被占用
 * @param {number} port 端口号
 * @returns {Promise<boolean>} 是否被占用
 */
async function isPortOccupied(port) {
  try {
    const { stdout } = await exec(`lsof -ti:${port}`);
    return stdout.trim().length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * 杀掉占用端口的进程
 * @param {number} port 端口号
 */
async function killPortProcess(port) {
  try {
    const { stdout } = await exec(`lsof -ti:${port}`);
    const pids = stdout
      .trim()
      .split('\n')
      .filter((pid) => pid);

    if (pids.length > 0) {
      console.log(
        `🔪 发现端口 ${SERVER_PORT} 被占用，正在杀掉进程: ${pids.join(', ')}`,
      );

      for (const pid of pids) {
        try {
          await exec(`kill -9 ${pid}`);
          console.log(`✅ 已杀掉进程 ${pid}`);
        } catch (error) {
          console.log(`⚠️  无法杀掉进程 ${pid}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    // 端口未被占用或其他错误，忽略
  }
}

/**
 * 启动服务器
 */
async function startServer() {
  console.log('🚀 启动 DIFlow Server...');
  console.log(`📁 工作目录: ${process.cwd()}`);

  const serverProcess = spawn('yarn', ['dev'], {
    stdio: 'inherit',
    shell: true,
  });

  return serverProcess;
}

/**
 * 检查服务健康状态
 * @param {string} url 检查的URL
 * @returns {Promise<boolean>} 是否健康
 */
async function checkHealth(url) {
  try {
    const { stdout } = await exec(
      `curl -s -o /dev/null -w "%{http_code}" ${url}`,
    );
    return stdout.trim() === '200';
  } catch (error) {
    return false;
  }
}

/**
 * 等待服务启动
 */
async function waitForServer() {
  console.log('🔍 等待 Server 启动...');

  for (let i = 1; i <= 10; i++) {
    console.log(`⏳ 检查 Server 状态... (${i}/10)`);

    const serverHealthy = await checkHealth(
      `http://localhost:${SERVER_PORT}/diflow/health`,
    );

    if (serverHealthy) {
      console.log(
        `✅ Server 健康检查通过: http://localhost:${SERVER_PORT}/diflow/health`,
      );
      console.log(
        `✅ Swagger 文档可访问: http://localhost:${SERVER_PORT}/diflow/api`,
      );
      console.log(`🌐 已在浏览器中打开 Swagger 文档`);

      // 在浏览器中打开 Swagger 文档
      try {
        await exec(`open http://localhost:${SERVER_PORT}/diflow/api`);
      } catch (error) {
        console.log(`⚠️  无法自动打开浏览器: ${error.message}`);
      }

      console.log(`🎉 DIFlow Server 启动完成!`);
      return;
    }

    if (i < 10) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.error('❌ Server 启动超时');
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 检查 DIFlow Server 开发环境...');

  // 检查并清理端口占用
  console.log(`🔍 检查端口 ${SERVER_PORT} 占用情况...`);
  if (await isPortOccupied(SERVER_PORT)) {
    await killPortProcess(SERVER_PORT);
  }

  try {
    const serverProcess = await startServer();

    // 等待服务启动
    await waitForServer();

    // 监听进程退出
    serverProcess.on('exit', (code) => {
      console.log(`⚠️  Server 进程退出，退出码: ${code}`);
      process.exit(code);
    });
  } catch (error) {
    console.error('❌ 启动失败:', error.message);
    process.exit(1);
  }
}

// 启动
main().catch(console.error);
