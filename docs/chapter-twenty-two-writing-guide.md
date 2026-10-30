# 第二十二章写作指南：持续执行

## 章目标

承接 21 的有依据回答，让智能体围绕目标开展跨轮次、跨连接、异步和可被人干预的工作。读者应分清运行、线程、输入、状态、任务、事件和执行所有权，而不是把 Harness 理解成自动重复调用模型。

本轮更新参考仓库至 `95c11b953c`（2026-10-30）。上游 core 主分支为 1.81.0-alpha.1；示例继续固定正式依赖 core 1.80.0、memory 1.39.1、libsql 1.27.1、zod 4.6.7，按实际安装版本验证，不为文档中的 alpha 新接口升级全书。

## 节目标与推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 持续执行（Harness） | 理解长期任务需要的运行支撑 | 批量核查 → 继续的依据 → 输入/状态/任务/事件/控制 → 运行标识 |
| 持久运行（Durable Agents） | 建立可观察的运行 | 包装与注册 → runId → 收尾 → 默认内存缓存与恢复边界 |
| 观察与回放（Observe & Replay） | 回到原运行，不重复启动 | 回放 → detach/cleanup/abort → 空流不是成功 → 线程 |
| 线程订阅（Thread Streams） | 同一订阅跨多次运行 | run vs thread → 先订阅后发送 → history/status → 关闭订阅不取消 |
| 信号投递（Signals） | 区分当前递送、排队、保存与处理完成 | 用户/应用更新 → send/queue → accepted/persisted → 运行中补充 → 队列去留 |
| 状态信号（State Signals） | 维护有名字、有版本的当前上下文 | 事件 vs 当前值 → snapshot/delta → contents/value → cacheKey → 裁剪与刷新 |
| 目标与预算（Goals） | 用可检查标准决定继续或暂停 | 线程目标 → maxSteps/maxRuns → 只读验收 → 等人/预算暂停 → 剩余事项 |
| 任务清单（Task Tracking） | 维护待办，不把勾选当证据 | 目标 vs 清单 → provider/processor → 四工具 → 稳定 id → 真实批准 |
| 后台任务（Background Tasks） | 让慢操作完成并回流 | 管理器/工具资格 → disposition → untilIdle/fullStream → taskId/取消/恢复 → 事件 |
| 通知收件箱（Notifications） | 分开事件持久化、投递和处理 | 通知 vs 普通信号 → summary/payload → 策略 → 待处理合并 → 已读不等于办完 |
| 事件来源（Signal Providers） | 将来源订阅映射到线程 | 对象/归属/线程 → webhook/poll → notify → 匹配验证 → 订阅恢复与停止 |
| 定时任务（Schedules） | 明确时间触发与执行结局 | 时区 → 无线程/有线程 → worker → 手动触发 → onFinish 语义 → 尽力交付 |
| 会话控制（AgentController） | 由实时会话承接交互和接管 | 宿主/Session/Thread → 模式/事件 → steer/queue/abort → 工具与审批 → 存储边界 |
| 跨进程协调（PubSub & Leases） | 区分共享数据、通信和执行责任 | A/B 实例 → 三类机制 → 后端能力 → 交接成功 vs 执行结果 → 恢复 |
| 恢复与验收（Recovery） | 用检查点继续，用业务结果验收 | 保存 running → inspect/start/recover → 认领失效 → 启动恢复 → 重做/去重/交接 |

内部章、节和段落目标不进入正文。检查题围绕同一套制度核查，不要求读者记住每个 API，但要能判断当前状态与还缺的证据。

## 代码与内容边界

- Node.js >=24，默认 JS，TS 偏好继续由 Zustand 保存。生成和默认 judge 使用 vercel/openai/gpt-6.1-sol、AI_GATEWAY_API_KEY。
- JS/TS 各 17 份源码：14 个入口（含两种信号练习与恢复查询）、3 个共用模块；依赖、说明和 ZIP 同步。文件按新的学习顺序命名，移除旧 TS 入口，避免包内混入重复版本。
- Harness 是能力组合。没有建立统一总类，也不要求普通调用全部采用这些机制。
- DurableAgent 先完成 Mastra 收尾，再 cleanup/关闭数据库；默认回放仅在同进程保留窗口内。Thread Stream 是 AsyncIterable，不冒充 Web ReadableStream；同一订阅连续接收多个 runId。
- receiveTurn 只服务串行演示。真实 UI 持续消费、按 runId/消息 id 合并；history、可重放事件与运行结局分别处理，不声称有永久事件录像。
- send/queue 表达时机，ifActive/ifIdle 表达投递策略。accepted 是路由决定，persisted 是相应写入，运行和业务完成另查。只打印 action/runId，不整对象倾倒内部输出。
- 活动信号示例用门闩确认工具已开始，递送补充后释放工具，再处理排队消息。核对模型实际输入、两个 runId 与执行次数，不按任意延时推断状态。信号不取消或重做正在进行的工具。
- 状态信号需要现有线程。cacheKey/mode 去重，contents 给模型，value 给程序。delta 的解释依赖完整快照，生产方负责比较合并及裁剪后的刷新，不把普通 JSON 数据自动合并归给框架。
- Goals 的主循环 maxSteps、评审 goal.maxSteps、目标 maxRuns 分层；可提供只读验收工具，waiting 停止当前自动循环但目标仍 active，预算耗尽等情况才 paused；等待用户不能用继续生成代替真实决定。清单完成状态也不能代替外部证据。
- TaskSignalProvider 同时挂载工具与状态处理器。threadState 保存结构，tasks lane 提供上下文；任务清单不是后台队列或工作流。维护稳定 id，区分待办与业务完成口径。
- 后台工具资格由程序控制。fullStream 覆盖 untilIdle 续轮，聚合 text 仍是第一轮；taskId 查询、取消与恢复保留真实语义，不把持久记录等同于函数和 HTTP 连接原样复活。
- 通知例采用 persist，仅操作本地收件箱。相同待处理记录可按范围去重，非永久全局去重。summary/payload、pending/delivered/seen 和业务进度分开；收件箱工具只说明具体读写入口，示例不冒充真实外部事件系统。
- SignalProvider 示例直接接收已结构化事件，不开启 HTTP，不代替签名校验。匹配订阅后 notify，基类注册表仍为内存；stop 清理需由应用安排，不声称数据库自动恢复订阅。
- Schedules 启动 worker，暂停周期后手动触发，再等待无会话完成钩子，退出删除演示计划。有线程 onFinish 仅表示交接，漏触发不自动补发。
- Controller Session 与登录 Session 不同；模式、模型、工具权限、批准分别设置。临时授权和任意实时状态不自动跨重启恢复。
- 跨进程章节讲清 Storage/PubSub/Lease 与幂等的不同职责；本轮没有接分布式后端，不声称多机验证。源码中的非 Agent 后台任务所有者、pinToWorker 等 alpha 扩展不属于本阶段主线。
- createCodingAgent 是组合已讲过的 workspace/任务/重试等默认值的便捷入口，属于后续编码项目；本章不把业务核查切换成编码助手，也不虚构自动具备目标、存储或系统隔离。

## 图示

六图：连接/运行/记录、同一运行回放、线程跨运行订阅、目标判定与预算、外部事件到通知处理、跨进程通信/所有权/存储。状态信号与任务清单用字段和工具表说明，避免为每节重复画同样的箭头。

## 验证方法

使用真实 Mastra API，以本地固定 V2 模型替换远端生成和目标 judge，并拒绝意外网络请求。通知与 provider 例不需要模型；所有材料仍为教学制度。

验证线程两次运行、persist 后显式唤起、活动递送/排队/不重复工具、状态去重及后续上下文、任务余项、目标继续/预算暂停/等人、后台结果、计划完成和会话模式。另用独立进程在只读工具执行时终止，再检查 running 快照与恢复。

静态检查覆盖全书目录、前后节、动态路由、源码展示、TS 变体和 ZIP；SSR 与 SVG 预览不替代浏览器端到端。遵守不运行 pnpm dev/build/lint/test，本轮不提交或发布。

本轮结果：15 节、6 张图，全书 22 章 193 节。JS/TS 各 14 个入口通过真实 API 固定响应验证，每轮 23 次本地模型调用（其中 2 次目标 judge）；任务检查实际保留 1 项 pending，活动输入进入后续模型请求且只读工具执行一次。另测连续三次未通过后的 paused，以及 waitingForUser/shouldContinue 与 active 的组合。通知和来源例直接核对真实收件箱记录及匹配数量。

两种语言分别完成 SIGKILL 中断、running 快照发现、新进程恢复 success、恢复后无活动记录的检查。源码解析 630 份、十种高亮语法通过；386 份页面与 83 个 SVG 完成 SSR，22 的 30 个语言版本页面和六图另外复核。全书 320 处完整源码展示、36 个 ZIP 的 580 份包内文件与来源一致。新三图及更新后的目标图已查看；没有付费调用、分布式后端或真实浏览器端到端验证。

## 本轮润色

保留 15 节与六图，压缩长句和重复边界说明。用连续核查场景串起输入、状态、目标、异步反馈、人的控制与恢复；说明 resourceId/threadId/runId 的用途，将 state lane 统一表述为“状态通道”。会话控制中的 createCodingAgent 保留为简短的组合入口说明。

Goals 明确主助手 maxSteps、评审 goal.maxSteps、目标 maxRuns 三层限制，并保持 waiting 与 paused 的区别。检查题围绕“当前能确认什么、还缺什么证据、后续 Agent 能否使用”改写；恢复部分用业务键、操作证据和剩余事项收尾。

润色后正文统计 13,558 字符（含导语、检查题和段落正文，不含标题、表格与代码）。全书结构检查无异常；本章 JS/TS 共 30 份页面、六图完成 SSR，源码解析 630 份通过，320 处源码引用与 36 个 ZIP 的 580 份包内文件一致。此轮仅改正文、表格及图注，未改变运行代码，未重复模型调用或故障恢复实验，未运行 pnpm dev/build/lint/test，未提交发布。
