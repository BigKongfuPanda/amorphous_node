/**
 * pm2 的配置文件
 * 启动开发环境 pm2 start ecosystem.config.js --env development
 * 启动生产环境 pm2 start ecosystem.config.js --env production
 */

module.exports = {
  apps: [
    {
      name: "amorphous_node",
      script: "./app.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
