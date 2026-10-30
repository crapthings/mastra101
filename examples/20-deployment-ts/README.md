# 20 部署与运行

此包使用 TypeScript；Node.js >=24，pnpm 12。安装：`pnpm install --frozen-lockfile`。

先运行完整本地验证：`node src/verify.ts`。验证创建临时凭证与目录，启动独立子进程，检查配置拒绝、健康响应、未认证拒绝、待确认业务结果、运行中的请求排空、重启后运行和追踪读回。结束后回收进程与临时目录，不请求模型。

实际启动：复制 `.env.example` 为 `.env`，填写 API_AUTH_TOKEN、DATA_DIR，再运行 `node --env-file=.env src/main.ts`。令牌至少 32 字符，使用随机值。启动成功打印 service.ready、地址与 APP_VERSION，不打印凭证。

固定工作流没有模型请求。已注册的通知助手使用 vercel/openai/gpt-6.1-sol，调用它时需要服务端的 AI_GATEWAY_API_KEY，会产生实际调用费用。

模块职责：config.ts 校验环境；application.ts 组合 LibSQL、DuckDB、认证、Agent、Workflow 与观测；runtime.ts 接入 HTTP、显式启动 Workers 并实现关闭；main.ts 安装信号入口；verify.ts 运行实际回归。

公开探针 /health/live 与 /health/ready 只返回有限状态。内置 /api/* 需要 Bearer API_AUTH_TOKEN，/api/auth/* 中的框架公共入口按框架约定处理。就绪标记表示本例初始化完成，不是所有依赖的持续实时探测。

DATA_DIR 保存 application.db 与 observability.duckdb。本例为单进程本地文件部署，不将共享 DuckDB 文件当作多副本方案。敏感资料采集策略参照 16；字符串长度限制不代替脱敏。

SHUTDOWN_MS 分别约束 HTTP 排空与 Mastra 任务收尾；两阶段各自有预算，并非整个进程退出的统一总超时。超过 HTTP 预算关闭连接后，业务结果仍需核对。SIGTERM/SIGINT 关闭过程可重复调用，先撤下就绪、停止接单，后完成导出与存储关闭。

Docker：`docker build -t mastra-notice:local .`。启动时注入环境，并用数据卷挂载 /app/data，覆盖 HOST=0.0.0.0、DATA_DIR=/app/data；可参考正文命令。镜像中安装目标平台依赖，以 node 用户运行，不复制本地 node_modules 或 .env。

Workers 使用默认进程内模式。分布式运行需要兼容存储与共享 PubSub；本例未配置分布式队列、调度任务、外部执行平台或自动故障恢复。运行历史持久化不等于所有在途操作自动恢复。
