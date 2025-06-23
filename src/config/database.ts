import * as path from 'path';
import * as fs from 'fs';

// 配置加载函数
function loadConfig() {
  const config: any = {};

  // 尝试加载 .env 文件
  const envPath = path.join(__dirname, '../../.env');
  const envProdPath = path.join(__dirname, '../../.env.prod');

  let configContent = '';

  // 优先加载 .env，如果不存在则加载 .env.prod
  if (fs.existsSync(envPath)) {
    configContent = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(envProdPath)) {
    configContent = fs.readFileSync(envProdPath, 'utf8');
  }

  // 解析配置文件
  if (configContent) {
    const lines = configContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        config[key.trim()] = value.trim();
      }
    }
  }

  return config;
}

const config = loadConfig();

export const dbConfig = {
  host: config.DB_HOST || 'localhost',
  port: parseInt(config.DB_PORT) || 3306,
  user: config.DB_USER || 'diflow_user',
  password: config.DB_PASSWD || 'your_password_here',
  database: config.DB_DATABASE || 'diflow',
  multipleStatements: true,
};
