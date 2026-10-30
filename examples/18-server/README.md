# 18 服务接口

默认 JavaScript；Node.js >=24，pnpm 12。

安装：`pnpm install --frozen-lockfile`。

各入口独立启动 127.0.0.1 空闲端口的 HTTP 服务，完成调用后自动关闭，无需另起开发服务器：

- `node src/01-server.js`：健康接口与 OpenAPI。
- `node src/02-routes.js`：目录、未知资源与创建运行。
- `node src/03-client.js`：MastraClient 读取资源、处理 404。
- `node src/04-context.js`：中间件重新设置请求标识。
- `node src/06-workflows.js`：创建、执行、读回状态，并按原 runId 重新取得运行。
- `node src/07-custom.js`：自定义业务路由、有效/null/空字符串输入。
- `node src/08-middleware.js`：核对响应头与业务结果中的 requestId。
- `node src/09-cancellation.js`：客户端取消后核对服务端等待是否停止。

模型流式入口：复制 `.env.example` 为 `.env`，填写 AI_GATEWAY_API_KEY，再执行 `node --env-file=.env src/05-streaming.js`。请求模型为 `vercel/openai/gpt-6.1-sol`，需要账号有相应访问权限，实际调用有费用。其他入口不请求模型。

`src/lab.js` 注册能力、上下文中间件与 Hono 适配器，再启动 Node HTTP 监听。`src/routes.js` 注册业务路由，`src/cancellation-route.js` 单独演示取消信号传递。内置 API 前缀为 /api，OpenAPI 在 /api/openapi.json，自定义路由在 /health、/notice-preview、/slow-preview。

本地实验未配置登录或对外授权，只监听回环地址。接口可调用与谁有权调用是后续不同问题。本章不会把服务部署到公网。

LibSQL 使用内存数据库，服务关闭后记录清空。createRun 只建立运行；客户端 startAsync 等待执行结果，start 返回后再查询。长任务跨进程继续执行需另有运行机制。

请求标识由服务端中间件重新生成，调用方传入的上下文和请求头不作为认证。Node 脚本验证 HTTP，不替代浏览器 CORS、Cookie 与响应头暴露测试。

流式响应按 text-delta、error、finish 事件处理；协议结束不替代业务依据检查。取消示例把请求信号传入支持取消的计时器；它只证明等待被取消，不证明已经完成的写入被撤销。499 是示例内部约定，断开的客户端未必收到响应。

finally 先等待本实验在途请求结束或取消，再关闭监听，调用 Mastra.shutdown 回收实例。pnpm-workspace.yaml 跳过不需要的 esbuild 安装脚本。
