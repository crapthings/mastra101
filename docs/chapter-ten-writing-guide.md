# 第十章写作指南：工作流

## 章目标

承接 Agent、记忆与存储，让读者用程序组织活动准备任务的必要步骤，理解输入输出、流程状态与业务结果的区别，能按 runId 从暂停点恢复，并判断何时交给 Agent。

以活动资料与准备清单串联八节，每节有独立入口，段落通过当前需求引出下一项机制。输入输出约定与实际校验分别说明，内部学习目标只留在本文件。

## 节目标与段落推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 工作流与步骤（Workflow & Step） | 从程序步骤定义运行 | 顺序动机 → Step/Workflow → commit/createRun/start → 状态与结果 → 交接 |
| 输入输出约定（Input & Output Schemas） | 把约定落实为校验 | 字段含义 → Schema 与校验 → 三条路径 → 结构与事实 |
| 顺序执行（Sequential Execution） | 让依赖关系随数据交接 | 顺序 → map → inputData 与前序结果 → 运行状态 → 分支 |
| 条件分支（Branching） | 按条件处理业务路径 | 资料缺口 → 全部匹配条件 → 步骤键与统一产物 → 业务结果 |
| 并行与遍历（Parallel & Foreach） | 区分不同工作与逐项处理 | 并行 → 数组遍历 → 形状与合并 → 并发及失败边界 → 等待 |
| 暂停与恢复（Suspend & Resume） | 恢复同一次持久化运行 | suspend 数据 → 重进步骤 → 快照与标识 → 三个进程 → 决定与写入 → 失败 |
| 结果与错误处理（Results & Error Handling） | 定位状态并限制重新执行 | 运行状态 → 重试层次 → 三条路径与 bail → 外部操作 → Agent |
| 智能体与工作流（Agents & Workflows） | 把语言能力放进流程边界 | 职责 → 结构化交接 → 事实核对 → 分工 → 可重复检查 |

## 核心边界

工作流 Step 是业务阶段，Agent step 是模型调用层次，一个工作流步骤可包含完整 Agent 运行。工作流 id、注册键与 runId 分别用于定义、实例引用与某次执行；示例 getWorkflow('activity') 使用注册键。

then 连接依赖，map 明确字段转换。inputData 是上一个执行节点的输出，getInitData/getStepResult 和 state/setState 在顺序小节交代作用；共享运行状态不冒充跨会话记忆。

branch 执行全部匹配条件，本例用互斥条件实现二选一；parallel 的结果按步骤 id 分组；foreach 处理数组元素，后续接收结果数组，并显式配置 concurrency: 2。

resume 重进暂停步骤，拒绝 false 是有效决定。写入放在确认后，恢复前核对状态与暂停步骤，防止错阶段命令和结束后重复确认。不能把快照宣传成外部操作的自动回滚或幂等保证。

成功状态与业务完成分开：bail 在固定依赖下返回 success，业务结果可以仍是待补充。步骤 retries、workflow retryConfig、Agent maxSteps 与模型层重试各有作用范围。

## 示例与资源

examples/10-workflows 和 examples/10-workflows-ts；Node.js >=24；@mastra/core 1.80.0、@mastra/libsql 1.27.1、zod 4.6.7，包含锁文件。01—07 是本地教学数据，08 才调用 vercel/openai/gpt-6.1-sol；凭证沿用 AI_GATEWAY_API_KEY。

06 分进程执行“开始”“补充 南门”“确认/拒绝”，数据库保存快照，06-pending.json 只保存当前教学运行指针，批准才写入或覆盖 06-confirmed.json。拒绝不删除旧文件，不把单用户指针当成真实多用户运行管理。真实应用需核实用户身份与 runId 归属。

08 使用 Agent.generate 的 structuredOutput，并对关键事实再检查；Agent 作为步骤、.agent() 简写等其他写法留给文档，不在首版重复演示。Run.start 不接收通用 abortSignal，本例在步内组合工作流取消信号与模型超时，不宣传未生效的入口选项。

scripts/sync-workflow-examples.py 同步源文件、完整代码块、JS/TS 变体和下载包。仅打包 src、README、package/lock、.gitignore 与 .env.example，不含密钥、数据库、指针或最终清单。

## 图示

- 顺序与字段交接：normalize → map → 清单 → 待确认交付。
- 分支：两个互斥条件与按步骤 id 输出后归一化。
- parallel 与 foreach：不同工作合并为数组，再逐项同样处理；两项活动、一项等待示意并发上限。
- 暂停恢复：同一 runId，先补充资料再确认，批准与拒绝分开。

原生 SVG 与 i18next 资源随课程路由加载。四张图已经渲染并核对布局，分支文字从连线旁移开，避免遮挡。

## 来源与验证

- https://mastra.ai/docs/workflows/overview
- https://mastra.ai/docs/workflows/control-flow
- https://mastra.ai/docs/workflows/suspend-and-resume
- https://mastra.ai/docs/workflows/snapshots
- https://mastra.ai/docs/workflows/error-handling
- https://mastra.ai/docs/workflows/agents-and-tools

同时对照当前源码的默认执行引擎、schema 校验入口、重试循环及 createWorkflowStateReader。没有按文档中的 !approved 判定是否等待，以免把 false 当作未回答；本例明确判定 resumeData 是否存在。

本地验证禁止 fetch，实际执行 01—07 原始入口：正常结果、输入校验抛错、步骤产物校验失败、互斥分支、parallel/foreach 数量与顺序均符合正文。06 用独立 Node 进程从缺地点恢复到待确认，再批准保存；检查两次暂停与最终 runId 相同、错误阶段命令失败、重复确认失败，另一轮拒绝保留旧文件且不覆盖。07 验证暂时失败两次后成功、持续失败两次后失败，以及 bail 一次提前结束不运行 finalize。

08 使用固定模型响应运行原始步骤：正常返回待用户确认；地点被改写时 review 步骤失败；空清单时 draft 步骤失败。没有发起真实模型请求，不把固定响应当作远程模型质量验证。

未启动 dev，未执行 pnpm build/lint/test。当前工作保留本地，未提交发布。
