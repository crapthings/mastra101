# 第八章写作指南：记忆

## 章目标

在 07 单次运行的基础上，让活动助手接上后续对话；开发者能区分存储、取回、当前模型输入与最终回答，按需要选择不同记忆方式，并核对更正与删除的范围。

每节围绕现实活动资料展开，英文用于对照 Mastra 的概念和接口。内部目标留在本文件，正文通过资料缺口自然推进。

## 节目标与段落推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 记忆配置（Memory） | 两轮对话为何需要记忆 | 输入缺口 → 存储与上下文 → 配置 → 两次调用 → 标识 |
| 会话与归属（Threads & Resources） | 会话与归属 | 同人多活动 → 标识对应 → 本地分组 → 访问边界 → 历史窗口 |
| 消息历史（Message History） | 保存与加载范围 | 资料离开窗口 → 对照 2/8 → 新消息与 recall → 当前资料 |
| 工作记忆（Working Memory） | 维护当前资料 | 长期偏好 → 模板与范围 → 更新工具与核对 → 更正 → 找旧消息 |
| 语义召回（Semantic Recall） | 从往事中找候选 | 不同措辞 → 存储/向量/嵌入 → 网关配置 → 新旧事实 → 预算 |
| 上下文管理（Context Management） | 本次输入怎样取舍 | 存储与窗口 → Token 预算 → 保护内容与验证 → 整理记录 |
| 观察记忆（Observational Memory） | 压缩长对话 | 历史增长 → Observer/Reflector → 配置 → 触发证据 → 持久化 |
| 跨进程对话（Cross-process Conversations） | 进程结束后接续 | 对象与数据库 → 两个进程 → 同一标识与授权 → 信息更新 |
| 记忆核对（Memory Verification） | 记忆生命周期 | 原文与当前资料 → API 更正 → 删除范围 → 路径清单 → 存储体系 |

## 内容边界

RequestContext 的临时应用配置由 07 引出，不将其称为记忆。Memory 把内容加入模型上下文，不修改权重。消息历史按会话；工作记忆明确 thread/resource 范围；语义召回找候选而不证明正确；观察记忆压缩对话但可能遗漏和误写。

先通过 lastMessages 理解历史范围，再讲 messageHistory.maxTokens，避免把消息条数当成 Token 或轮数。不把打开观察记忆与已经触发观察混为一谈。工作流、多智能体、部署和企业数据删除系统留给后续；本章仍交代归属核实和实际启用记忆的生命周期。

## 示例与资源

examples/08-memory 与 examples/08-memory-ts：Node.js >=24，依赖固定为 @mastra/core 1.80.0、@mastra/memory 1.39.1、@mastra/libsql 1.27.1。01—09 各自独立入口，各用一个本地数据库。除持久化例子外使用随机资源和会话标识，避免重复运行时旧信息干扰。

聊天与观察模型为 vercel/openai/gpt-6.1-sol，嵌入模型为同一 Vercel 网关的 openai/text-embedding-3-small。固定版本的嵌入构造器不解析聊天模型的三段字符串，使用 providerId/modelId/url/apiKey 对象经兼容接口配置。每项额外模型调用在正文和 README 中交代，不新增另一供应商的凭证流程。

02、09 仅操作本地存储。06、07 的短例子只跑通配置，不宣称达到裁剪或观察阈值；验证长对话机制须准备足够内容并检查实际调用。07 关闭异步缓冲便于解释，不推荐所有生产项目照抄这个取值。

scripts/sync-memory-examples.py 同步 JS/TS、正文代码块和 ZIP。ZIP 仅包含源文件、README、package/lock、.gitignore、.env.example；不含密钥、数据库和 node_modules。

## 图示

- 历史窗口：同一份四条历史在 lastMessages 为 2/8 时进入本次请求的范围，当前新问题另行加入。
- 语义召回：保存时嵌入建索引，提问时嵌入查询，再取回候选原文。

- 记忆参与下一次请求：存储 → 选择 → 与提示词、新消息组装 → 模型回答 → 保存新消息。
- 会话与归属：同一 resource 的两个 thread 与资源偏好，另一 resource 独立。
- 观察过程：待处理对话 → Observer → 观察记录；Reflector 在观察增长后整理记录；后续输入使用观察与尚未整理消息。

五张图沿用原生 SVG 和 i18next 资源，随对应课程路由加载。已以实际 React 组件渲染检查文字、箭头与回路布局。

## 来源与验证

以当前 Mastra 记忆文档及本地 Memory、工作记忆工具、ModelRouterEmbeddingModel 与历史配置源码为依据：

- https://mastra.ai/docs/memory/overview
- https://mastra.ai/docs/memory/message-history
- https://mastra.ai/docs/memory/working-memory
- https://mastra.ai/docs/memory/semantic-recall
- https://mastra.ai/docs/memory/observational-memory
- https://vercel.com/docs/ai-gateway/sdks-and-apis

固定依赖下用本地模型替身运行 01—09：同一会话第二次模型输入包含历史；lastMessages 为 2/8 时，最后的问题分别看不到/看得到早期入口，原消息仍在存储；工作记忆工具实际写入偏好后，新会话得到同一资源的偏好；固定嵌入完成索引保存与跨会话召回；观察记忆配置在短对话中正常使用。

额外用超长历史验证 Token 预算移出旧资料，系统提示词与当前问题保留、存储原文仍在；两个独立 Node 进程分别写入/读取同一数据库，后者模型输入包含前者保存的东门资料。02 的归属列表及 09 的更正、历史保留、会话删除与资源偏好存留都直接查存储确认。

这些验证没有发起真实聊天、嵌入或观察请求，不当作远程模型质量或长对话压缩质量的证明。未启动 dev，也未运行 pnpm build/lint/test。

最终一致性检查：全书 75 节目录、标题、懒加载路由及前后导航正确；08 的 9 节 JS/TS 文案、代码、命令、五个图示挂载和两个各 14 文件的 ZIP 一致。139 个课程、图示、示例与路由相关源文件通过语法解析。未提交或发布到远端。

本轮 polish 收紧存储/加载/使用的证据链，展开 4000/1000 预算参数的含义，并把观察示例检查分为触发证据与内容质量。更正存储命中不能直接证明回答依据，明确核对清单和脚本覆盖范围；新增历史窗口与语义召回图，已渲染检查文字及连线布局。

后续顺序调整为 09 存储，再进入工作流。08 首节直接配置文件存储确保记忆示例可运行；09 深入配置层级、数据领域、适配器与生命周期，不将存储配置延迟成尚未满足的前置条件。
