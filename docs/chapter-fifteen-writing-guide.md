# 第十五章写作指南：外部连接

## 章目标

承接子智能体的任务分工，把工具或任务扩展到另一个系统。读者能选择 MCP、A2A、ACP 与 SDK Agent 的接口边界，并以 MCP 为主线完成发现、调用、读取、凭证、审批与服务提供的完整实践。

内部章、节、段落目标不进入正文；用活动通知与教学草稿串联，段落通过上一步剩下的问题推进。

## 节目标与段落推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 连接类型（Connections） | 按交换内容与运行归属区分四种连接 | 14 的任务拆分 → 外部能力需求 → 模型与能力两条连接 → 四种协议/适配 → MCP 小服务 |
| 外部工具（MCPClient） | 分清发现、直接执行与模型调用 | 协议与客户端 → 项目准备 → 发现/执行/回答 → 三种业务结果 → 传输方式 |
| 传输与回收（Transports & Lifecycle） | 管理客户端连接与自己拥有的服务 | stdio/HTTP → 回收责任 → 同一能力换传输 → 按连接层排查 |
| 资源与提示模板（Resources & Prompts） | 区分资料、模板与可执行工具 | 三类能力 → URI 读取 → 消息角色 → 程序读取结果与后续使用 |
| 凭证与范围（Authentication & Scope） | 区分凭证与数据范围并避免跨请求混用 | 模型与服务凭证 → 服务端映射 → 每请求客户端 → tools/toolsets → 写入审批 |
| 工具审批（Tool Approval） | 在 Agent 工具循环内审批并验证实际结果 | 认证与一次执行 → 客户端审批策略 → 暂停/恢复 → 读回数量 → 服务提供方 |
| 提供服务（MCPServer） | 从客户端使用回到服务端定义 | 工具与 MCPServer → 传输入口与注册 → 暴露范围 → 协议验证与部署分工 |
| 远程智能体（A2A） | 沿能力卡与远端任务状态判断交付 | 工具操作与远程任务 → Agent Card → 状态与 finishReason → 三条本地路径 → 接回委派 |
| 运行时适配（ACP & SDK Agents） | 确认接口背后的运行机制归属 | 相同方法名的不同循环 → ACP 进程 → SDK 配置 → 统一交接与追踪需求 |

## 重点边界

- 模型 API/网关与外部能力连接是不同路径。MCP 服务可以是普通程序，不要求运行 LLM。
- 工具发现不等于执行，工具结果不等于模型已经看到。示例先直接调用，再在审批环节接入 Agent。业务状态由工具自己约定，不冒充 MCP 标准状态。
- stdio 子进程与 HTTP 服务分别讨论回收责任；通信方式不等于执行隔离。
- MCP Resource 是 URI 标识的内容，不是 memory.resource 归属字段。MCP Prompt 返回消息，不自动成为系统指令。
- 模型密钥、MCP 服务凭证、用户授权与审批分别落实。固定 tools 与运行时 toolsets 的生命周期和范围需匹配请求。
- requireToolApproval 接在 Agent 工具循环里，直接调用 execute 不会自动经过该审批。服务端仍需验证权限；注解不能代替可信策略。
- 审批快照不保存外部子进程的内存。服务草稿只在当前进程中保留，不发送通知。
- 创建服务、注册 Mastra、提供传输监听与公网部署是不同阶段；本例只监听回环地址。
- A2A Agent Card 的 skills 不是 SKILL.md 文件技能；远端 Task failed 在固定版本可对应适配层 stop，必须读取 task.status.state。
- ACP 进程与 SDK Agent 保留自己的工具、凭证、会话和权限机制，不把统一 generate/stream 接口宣传成所有配置自动互通。

## 示例与版本

examples/15-connections 与 examples/15-connections-ts；Node.js >=24、pnpm 12。固定 @mastra/core 1.80.0、@mastra/mcp 2.6.0、@mastra/libsql 1.27.1、zod 4.6.7。四份辅助模块与七个入口，共十一个源文件。01 和 09 为概念小节，不为形式一致编造运行演示。

02—05、07、08 都无模型请求。06 使用 vercel/openai/gpt-6.1-sol 与前文 AI_GATEWAY_API_KEY；CLI 的“确认/拒绝”是明确的教学决定。公开教学 token 不是真实凭证。A2A 教学远端只实现能力卡和一次 message/send，等待分支不实现后续恢复。ACP 与原生 SDK 没有实际安装或运行。

pnpm-workspace.yaml 显式跳过不用的 esbuild 安装脚本。同步脚本扩展到 15，按项目是否存在该配置决定复制和打包；正文与 JS/TS 同步，旧下载包内容不变时保持原始 ZIP，避免时间戳造成无关改动。每份新下载包有十一个源码与六份元数据，不含实际 .env、数据库、依赖或运行产物。

## 图示

- 连接类型：Agent 的模型网关路径与 MCP 服务路径分开。
- 工具审批：写入请求先暂停，拒绝保持 0，批准后再跨服务执行边界并读回 1。
- 远程智能体：读取能力卡 → 提交任务 → 分别处理完成、等待和失败。

三张原生 SVG 按实际课程组件渲染并查看，核对文字、连接与边界。没有新增交互控件。

## 来源

- https://mastra.ai/docs/connections/overview
- https://mastra.ai/docs/connections/mcp
- https://mastra.ai/reference/tools/mcp-client
- https://mastra.ai/reference/tools/mcp-server
- https://mastra.ai/docs/connections/a2a
- https://mastra.ai/docs/connections/acp
- https://mastra.ai/docs/connections/sdk-agents

同时对照 mastra/packages/mcp/src/client 的配置、发现、工具包装与审批逻辑，server/server.ts 的 startStdio/startHTTP/close，及 core/src/a2a/a2a-agent.ts 的 Task 结果映射。服务注册使用实际 listMCPServers()，没有沿用源码注释中陈旧的 getMCPServers() 示例。

## 验证

在 Node.js 24 上执行十二组入口/参数组合。原始源码仅重写依赖定位并在 06 替换固定模型，保留真实 MCPClient、MCPServer、HTTP、stdio 子进程、审批与 A2AAgent 执行。主进程 fetch 限制为本机回环地址，临时目录保存证据与教学数据库。

- 02 三种编号：已确认返回南门，未查到与查询失败保留 null 与来源。
- 03 HTTP 与 stdio 返回相同通知。
- 04 真实列出/读取资源与模板，返回模板角色为 user。
- 05 甲乙分别取得南门/东门，不匹配 token 返回 401，错误没有伪装成空查询结果。
- 06 拒绝/确认都先暂停且数量为 0，恢复后分别为 0/1；固定模型各调用两次。
- 07 注册服务可从另一客户端发现并执行。
- 08 完成、等待、失败分别得到 completed、input-required、failed；等待映射 suspended，失败仍为 stop 且应用主动给出非零退出码。

独立临时项目使用完整锁文件完成全新安装，再执行 JS stdio 查询；TS 源文件使用同样依赖另行运行，验证 Node 24 下入口与子进程的 .ts 路径。没有发起付费模型请求，不把固定响应当成真实模型质量验证。


## 接入检查

当前目录 15 章、128 节的标题、节号、前后导航与 lazy 路由核对通过；14 末节正文和导航均引向 15。新章节 20 处 JS/TS 源码展示与示例一致，两份 ZIP 各 17 个文件，与源码及元数据逐字节一致，包含独立安装需要的 pnpm-workspace.yaml。

实际组件完成 256 份 JS/TS 课程片段渲染，新章节三张图独立查看；388 个源码文件完成语法转换，现有本地服务的 24 个新增模块响应正常。没有运行 pnpm dev/build/lint/test，没有提交或发布。以上不是整页浏览器交互验收，也未验证真实第三方服务或外部原生 SDK 的运行质量。


## 2026-10-30 章节 polish

通读九节正文、表格、重点、代码与本节检查，保留客户端到服务端再到远程任务的顺序。

- 将“资源与提示词”明确为“资源与提示模板”，强调返回的消息角色与资源正文应分别组织；将“服务发布”改为“提供服务”，区分本机接口与部署。
- 修正认证、权限、审批的分工：认证检查身份或凭证，权限决定访问范围，审批决定这一次是否获准执行。服务端权限与客户端审批的位置分别说明。
- 补充 MCP 结构化业务对象与协议内容的区别，不让本例 result.status 成为对所有服务的错误假设。
- A2A completed 改为远端报告的完成状态，继续核对产物；Task 状态与适配层 finishReason 分开。
- 将模拟 A2A 远端拆为 local-a2a.js，正文入口集中展示客户端调用；同时整理 HTTP 辅助代码的多行格式。
- 九道检查题均改成具体情境中的判断与排查；服务定义源码移到对应说明之后，减少单段代码堆叠。

本轮重跑 A2A 完成、等待、失败及 HTTP 传输路径，均通过；Node 24 下另行执行同步后的 TS A2A 入口与辅助文件。目录标题、128 节前后导航、20 处源码展示、两份各 17 文件的 ZIP 一致性及实际组件渲染复核通过。A2A 图的更新说明已渲染检查。没有付费模型请求，没有执行 pnpm dev/build/lint/test，尚未提交发布。
