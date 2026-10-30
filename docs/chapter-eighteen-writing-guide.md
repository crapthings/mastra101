# 第十八章写作指南：服务接口

## 章目标

承接 17 的结果质量检查，将通知能力接到真实 HTTP 调用。读者能分清注册、服务初始化、监听、SDK 调用、请求级上下文、流式事件、工作流状态、自定义路由、中间件与取消的职责。身份与权限自然引向 19，不在本章构建认证系统。

## 节目标与段落推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 服务配置（MastraServer） | 接通注册能力到 HTTP 监听 | 17 已验证能力 → 跨进程需求 → 实例/适配器/监听 → 下载 → OpenAPI → 内置路由 |
| 内置路由（API Routes） | 分清目录、创建运行与业务结果 | 注册能力 → 路径方法参数 → key/id → 200/404 → 业务状态 → SDK |
| 客户端（MastraClient） | 理解 SDK 代理仍经 HTTP | baseUrl → 客户端/服务端 → 密钥 → 资源调用/404 → 重试/CORS → 请求数据 |
| 请求上下文（RequestContext） | 按来源区分业务输入、请求标识与身份 | 业务输入/调用背景 → 服务端生成标识 → 客户端覆盖实验 → 非鉴权 → 生成响应 |
| 流式响应（Streaming） | 按协议读取并保留完成状态 | 整包/事件 → 模型在服务端 → processDataStream/onChunk → text/error/finish → 业务判断 → Workflow |
| 工作流接口（Workflow API） | 用同一 runId 启动与查询 | createRun → startAsync → runById → 客户端/Core 同名差异 → resume → 保存与持续执行 |
| 自定义路由（registerApiRoute） | 提供有输入约定的业务接口 | 框架入口/业务入口 → 实例与上下文 → JSON/Zod → null 与空字符串 → 状态/交付 → 路径覆盖 |
| 中间件（Middleware） | 解释 next 前后与覆盖范围 | 前置处理 → await next → 提前返回 → 实际标识核对 → 框架差异/公共路由/CORS → 断开 |
| 请求取消（Cancellation） | 验证取消链路及业务结果 | 客户端停止等待 → signal 下传 → 实际 started/cancelled/finished → 499 → 已完成副作用 → 身份权限 |

章、节、段落目标仅留在指南。检查题从现有通知流程判断实际发生了什么，不背接口配置。

## 实现与边界

- Node.js >=24，core 1.80.0、hono adapter 1.7.22、client-js 1.57.0、libsql 1.27.1、hono 4.13.13、@hono/node-server 1.19.11、zod 4.6.7。
- 选择与 adapter 的 WebSocket 传递依赖兼容的 node-server 1.x，pnpm peers check 无冲突；未启用 WebSocket 功能。
- 十二个源文件（九入口、三个模块）、六元数据，JS/TS + ZIP 同步。每入口自行启动并关闭回环 HTTP 端口，无 pnpm dev。
- 仅 05 请求 vercel/openai/gpt-6.1-sol，凭证 AI_GATEWAY_API_KEY 留在服务端。其余注册模型但不调用，固定工作流避免付费验证。
- adapter.init 不等于监听；未启动后台 workers，不宣称具备调度、长任务持久恢复或文件发现能力。
- OpenAPI 显式开启，最终路径是 prefix + openapiPath，即 /api/openapi.json；不把全部实现的路径数量写成固定值。
- Agent 与工作流目录返回形态不同；Workflow details 的字段 name 而非 id。输出只打印必要字段。
- 服务端中间件覆盖 requestId，不将客户端上下文视为可信身份。请求头演示值使用 ASCII，正文中文仍为主要说明语言。
- SDK 客户端 startAsync 等待结果，start 为后台发起，Core start 是另一约定。工作流保存状态不等于运行永远继续。
- registerApiRoute 的路径在根目录；业务校验 JSON + Zod，null 为业务缺失、空字符串为输入不符合约定。
- stream.processDataStream 使用当前 onChunk，非旧版 onTextPart；读取 text-delta payload.text，检查 error/finish。收到 finish 不等于内容有依据。
- 用户中间件不保证覆盖 framework public 路由；Hono 签名不推广到所有适配器。Node 请求通过不宣称完成浏览器 CORS 验证。
- 取消等待通过真正 HTTP 断开传给 c.req.raw.signal 和 Node timers/promises。现场 state 是实验内存观测，499 为自定义约定；不宣称撤销副作用。
- 关闭实验服务前先等本次请求结束或取消，再 close 监听和 mastra.shutdown。生产优雅停止需另安排在途任务策略。

## 图示

客户端/HTTP/适配器到能力；流式文字、错误与结束分支；客户端取消到请求信号、下游响应和现场检查。延续现有 SVG 组件与中文图文风格。

## 验证要求

真实 TCP 回环 HTTP 验证健康/OpenAPI、目录/404、SDK、请求标识覆盖、工作流启动和状态读回、有效/缺失/非法输入、中间件响应头一致、客户端与服务端取消。

05 替换本地 V2 流式模型，保留 HTTP 服务、适配器、SDK 和事件解析，阻断非回环 fetch。验证不证明实际网关访问、模型生成质量、代理缓冲或浏览器 CORS 行为。

不运行 pnpm build/lint/test，不启动 dev；检查路由与内容一致性、源码解析、页面 SSR、SVG 与下载。全部工作留本地，不推送发布。

## 实际复核记录

中间件响应头放到 await next 之后，确认自定义路由的最终响应保留 X-Request-Id，并与工作流结果一致；提前设置的响应头在该适配路径会被替换，未沿用只看配置推定成功的做法。

八个无模型入口在 JS/TS 两种版本使用 Node 24 通过真实回环 TCP 请求验证，含资源错误、上下文覆盖、运行读回、输入校验与服务端实际取消。流式入口以本地 V2 固定响应保留完整 HTTP/SDK/事件路径，未调用付费模型。

目录共 18 章 154 节，22 份正文源码引用匹配，487 个源码解析、9 种高亮语法加载通过；308 份页面、69 个图示 SSR 通过，三张新增 SVG 已检查。每个下载包 17 个文件与磁盘一致，不包含 node_modules、真实 .env 或数据库。

## 本轮 polish

- 明确 HTTP response.status、响应体 status、result.status 三层含义，并将对照表与检查题统一到这些读取位置。
- 区分适配器 init、HTTP 框架 serve 及 CLI server.host/port 的配置路径；精简重复的部署与内存提醒。
- 请求上下文说明一次运行可能对应创建、启动、查询等多个 HTTP 请求，用 runId 关联运行，用 requestId 定位调用。
- 修正“重新 createRun 必然新建任务”的笼统说法：传入已有 runId 可取得原运行；06 加入实际演示。
- 说明流式传输可以与工作流配合，区分网络分块与协议事件；图示明确收到文字后也可能错误或中断。
- 取消处理独立为 cancellation-route 模块，在取消小节展示，业务路由小节集中解释 JSON 与 Zod 校验；行为保持一致。
- 重新组织九道检查题，聚焦运行关联、实际交付、覆盖路径与重试前的证据。

本轮复核：JS/TS 八个无模型入口均通过真实 HTTP 验证，含原 runId 重新取得运行与取消模块拆分后的服务端状态；489 个源码解析、24 份正文源码引用、308 页 SSR 与 69 张图示通过。修改后的流式 SVG 已查看，每份 ZIP 更新为 18 个文件并与磁盘一致。

退出复核：本机会话代理会让取消后的请求连接持续存活。仅在验证子进程中移除代理并直连回环地址，JS/TS 的八入口断言均通过且进程正常退出（退出码 0）；未为验证环境修改示例传输逻辑。
