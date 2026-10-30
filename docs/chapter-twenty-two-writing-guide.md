# 第二十二章写作指南：持续执行

## 章目标

承接 21 中有依据的一次回答，把视角移到多轮、跨连接、异步和重启后的任务。让开发者能选择所需 Harness 能力，区分运行、观察、目标、后台任务、定时触发与交互会话，并以业务结果验收恢复。

## 节目标与段落推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 持续执行（Harness） | 将 Harness 理解为运行支撑能力组合 | RAG 有依据 → 批量核查与等待 → 能力选择 → 继续的条件 → 连接、运行、结果 |
| 持久运行（Durable Agents） | 建立可识别运行，辨别连接中断与进程故障 | runId → 包装 Agent → 注册与存储 → 收尾 → 默认缓存与恢复边界 |
| 观察与回放（Observe & Replay） | 订阅原运行，避免重复执行 | 重连 → 回放验证 → detach/cleanup/abort → 空流不是成功 → 判定目标 |
| 目标与预算（Goals） | 依据完成条件继续，并在预算内停止 | 候选缺项 → 线程目标与 judge → maxSteps/maxRuns → done/paused → 更新不自动运行 |
| 后台任务（Background Tasks） | 等结果真正返回并被消费 | 慢调用 → 管理器与工具资格 → 三种 disposition → untilIdle/fullStream → 失败出口 |
| 定时任务（Schedules） | 区分到点、发布和完成 | 明天再做 → 时区/上下文 → worker → 暂停与手动执行 → 完成钩子 → 尽力交付 |
| 会话控制（AgentController） | 分清共享宿主、实时会话和持久线程 | 协作需求 → Controller/Session/Thread → 模式 → 补充/改向/停止 → 存储边界 |
| 恢复与验收（Recovery） | 根据检查点继续，以业务结果验收 | 三种连续性 → 保存 running → inspect/start/recover → 执行认领 → 自动恢复启动入口 → 去重与验收 |

内部章、节和段落目标不进入正文。每节检查沿用制度核查，要求判断哪个阶段完成、哪个条件欠缺，避免仅考 API 名称。

## 实现边界

- Node.js >=24；core 1.80.0、memory 1.39.1、libsql 1.27.1、zod 4.6.7。生成和默认目标 judge 统一 vercel/openai/gpt-6.1-sol、AI_GATEWAY_API_KEY。
- 22-harness / 22-harness-ts：一个公共助手文件、七个独立入口；含完整代码、依赖锁、配置、README 和 ZIP。数据留在忽略的 data/，不附真实凭证、依赖和数据库。
- Harness 是能力组合，不虚构统一 Harness 总类，不要求每个请求都经过 Controller 或 DurableAgent。
- 显式 createDurableAgent 包装并注册。脚本等待 mastra.shutdown() 完成后再清理运行、关闭数据库，避免先移除运行注册信息导致收尾写入已关闭存储。
- 03 只证明同一进程已完成运行的缓存回放。默认内存 PubSub/cache 不具有跨副本保证；detach 是离开观察，cleanup 清理运行及缓存，abort 请求取消；runId 不授予访问权限。
- Goals 需要存储、线程、记忆和可解析 judge；不是每步都判定。maxRuns 是目标判定预算，不等于工具次数。增加预算及 status 不自动启动执行；程序规则和真实授权仍要单独检查。
- 后台管理器与工具资格同时配置；_background 不能提升资格。fullStream 才覆盖 untilIdle 后续轮次；text 等聚合属性仍是首轮。存储记录不保证任意函数和外部操作原样复活。
- 定时入口显式 startWorkers()；创建后暂停周期，手动 run 并等待无线程 onFinish。run 返回触发凭据，有线程 onFinish 仅表示交接。退出删除演示计划，不误启动长期巡检；生产保持服务与相应消费能力。
- Schedules 尽力发布，漏触发不自动补发；补跑要核对业务日期与已完成记录。
- Controller 单例共享，Session 独立。模式改变指令与工具可见性，不代替授权，不自动切换模型；存储不保存所有 session.state/临时授权/活动运行。
- 恢复例显式持久化 running，默认 inspect 不调用模型。start 为只读慢工具留窗口，recoverActiveRuns 从同文件、同 Agent 标识恢复。claim 尚未失效时 skipped 不是成功；不强制接管活动运行。
- auto 配置与启动恢复都需到位；自建入口显式 recoverAllDurableAgents。缓存、传输、检查点和外部业务记录各有职责，恢复可能重做模型/工具/子智能体委派，写操作按稳定业务键去重。
- Signals 仅为计划交接与交互控制作必要说明，后续深入；不在本章展开 channels、编码代理或 RAG 参数。

## 图示与验证

三张 SVG：连接/运行/记录的职责，原运行事件回放，目标判定与预算分支。重要结论用绿底；易误用边界用红底，避免每段都强调。

使用本地固定 V2 模型替换远端生成和 judge，拒绝意外网络请求。真实 Agent、DurableAgent、Memory、LibSQLStore、后台管理器、Schedules worker、AgentController 都照常执行。验证 API、事件与状态，不代表供应商输出质量，不发起付费模型验证。

JS/TS 七入口均跑通：12 次本地模型调用（含 2 次目标 judge），目标第一轮未达标后继续、第二轮 done；另测连续三次未达标后 paused。后台任务有 started/completed 与后续消费；计划手动触发后收到真实 succeeded 完成钩子；会话模式切换后继续使用原线程。

恢复另用独立子进程：工具执行期间 SIGKILL，inspect 发现 running 快照，执行认领失效后新进程 recover 返回 success，再次 inspect 无活动运行。验证环境缩短认领有效期及只读等待时间，正文保留默认行为，不给读者改变租约的建议。

检查全书路由与前后节关系、JS/TS 16 处源码引用及两份 ZIP；602 个源码解析、10 个高亮语法、372 份页面与 80 个图示 SSR。三张新 SVG 渲染检查；SSR 不能替代浏览器端到端。遵守不运行 pnpm dev/build/lint/test，不提交发布。
