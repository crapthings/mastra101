# 15 外部连接：从 MCP 工具到远程任务

Node.js >=24、pnpm 12，此包使用 TypeScript。先执行 pnpm install。所有服务只绑定回环地址或作为本机子进程运行，不对外发布。

```bash
node src/02-tools.ts reading
node src/02-tools.ts unknown
node src/02-tools.ts FAIL
node src/03-transports.ts
node src/04-resources.ts
node src/05-credentials.ts
node src/07-server.ts
node src/08-a2a.ts 完成
node src/08-a2a.ts 等待
node src/08-a2a.ts 失败
```

只有 06 需要模型凭证：把 .env.example 复制成 .env，填入前面使用的 AI_GATEWAY_API_KEY。模型请求沿用 vercel/openai/gpt-6.1-sol。

```bash
node --env-file=.env src/06-approval.ts 拒绝
node --env-file=.env src/06-approval.ts 确认
```

service.ts 提供固定教学通知、资源、提示模板与进程内草稿数组；stdio-server.ts 只负责协议入口，标准输出不打印普通日志。local-http.ts 提供可回收的临时 HTTP 监听；local-a2a.ts 提供三种受控远端任务状态。客户端先调用这些现成服务，07 再展开服务定义。

02 的 reading、unknown 与 FAIL 分别返回已确认、未查到、查询失败，是服务自己的业务状态。03 改用 Streamable HTTP，执行含义相同。04 读取资源与提示模板，不调用模型。

05 使用公开的 demo-reader-a、demo-reader-b 演示不同范围，demo-invalid 应得到 401。服务端依据已知映射选择资料；这不是完整认证系统，框架可能同时输出预期错误日志。真实 token 不应写进源码或提示词。

06 会创建 06-approval.db 保存暂停快照；每次启动会创建新的服务进程，草稿初始为 0。拒绝后应为 0，确认后应为 1。草稿只保留在当前服务内存，不发送通知。MCPClient 必须保留到本次恢复完成；直接调用工具 execute 不会自动经过 Agent 的执行前审批，需要应用自己落实授权。

07 注册 MCPServer 并用独立客户端访问临时 HTTP 入口。Mastra 使用显式的内存数据库，示例不演示跨进程恢复。08 调用 local-a2a.ts 提供的 A2A 0.3 教学远端，只演示能力卡与一次 message/send。完成、等待和失败分别检查 result.task 状态，failed 路径退出码为 1；finishReason: stop 不等于远程任务完成。等待分支不实现后续恢复服务。

01 与 09 聚焦连接类型和运行归属，没有额外入口。ACP 与 SDK Agent 本章只建立认识，不会安装或启动外部智能体程序。

pnpm-workspace.yaml 明确跳过本章未使用的 esbuild 安装脚本；示例直接由 Node 运行，不使用依赖中的打包 CLI。其他安装配置与锁文件随包提供。资料都是教学数据，不代表真实通知、预约记录或远程模型质量。

## 主线综合任务：读取通知 → 确认草稿

01—07 为 MCP 主线；08—09 为远程任务与运行时选读。完成主线后直接进入追踪与指标，无需安装其他智能体 SDK。

```bash
node src/10-connected-case.ts 甲 reading
node src/10-connected-case.ts 乙 reading
node src/10-connected-case.ts 甲 unknown
node src/10-connected-case.ts 甲 FAIL
node src/10-connected-case.ts 无效 reading
```

每次只运行一条命令。正常路径先显示当前 owner、地点、来源、已读资源和 user 角色模板，再展示完整草稿。先试拒绝，数量应为 0；重新运行并确认，数量应为 1。甲对应南门，乙对应东门。unknown 与 FAIL 保留不同业务状态，不进入保存；无效凭证返回发现错误与 401，退出码为 1。

该入口不请求模型。草稿由工具返回值确定性生成；程序直接 execute 前先取得终端中的明确确认，这属于应用侧执行检查，不经过 Agent 审批。需要观察框架审批暂停与恢复时使用 06。服务只绑定临时回环端口，客户端与监听都会回收；草稿仅在当前服务内存存在，结束后清空。
