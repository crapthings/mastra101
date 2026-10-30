# 第二十一章写作指南：检索增强生成

## 章目标

承接 20 的可持续服务，补上根据组织资料回答的能力。围绕虚构团队差旅制度，让读者将资料准备、分片、Embedding、索引、范围检索、重排、生成引用与评估分开观察，再接为实际流程。自然引向后续 Harness，但本轮只完成 21。

## 节目标与段落推进

| 节 | 节目标 | 段落推进 |
| --- | --- | --- |
| 检索链路（RAG） | 区分准备与查询，明确不是训练权重 | 20 服务已运行 → 企业资料需求 → 入库/查询两段 → 团队/版本/条件混淆 → 原文 |
| 文档准备（MDocument） | 先核对可读内容与来源 | 原文 vs 文件名 → PDF/Office 抽取衔接 06 → metadata → 下载/离线 → 处理权限与分片 |
| 分片策略（Chunking） | 保留完整含义与来源 | 数值和条件断开 → recursive/maxSize/overlap → 标题结构 → 实际比较 → 稳定 id 与更新 |
| 向量表示（Embedding） | 使用兼容空间并验证返回映射 | 同义表达 → 相似不等于支持 → 文档/问题一致 → Vercel → 数量/顺序/维数 → 索引 |
| 索引管理（Vector Store） | 实际保存、更新与删除 | 向量/原文映射 → LibSQLVector → createIndex/upsert → 同 id 数量 → 删除旧段 → 更新范围 |
| 检索范围（Retrieval & Filters） | 根据可信范围检索候选 | teamId/active → 授权职责 → topK/score → 三团队 → 先范围后下游 → 重排 |
| 候选重排（Reranking） | 明确候选重排范围和混合评分 | 检索候选 → 条件完整 → rerank 权重/details → 调用数量 → 去重/上下文 |
| 依据与引用（Grounding & Citations） | 区分引用编号有效与内容支持 | 原文/来源成对 → untrusted text → structuredOutput → 资料不足 → 编号检查 → 来源表 → 后续 Agent |
| 检索评估（Retrieval Evaluation） | 分开测召回、范围和生成 | 必要文档 → docId 去重 → 小样本比例/指标定义 → 按失败层定位 → 版本回归 → Harness |

内部目标不进入正文，段落引出下一问题。检查题使用相同差旅材料，要求区分范围、条件与证据，不只背参数。

## 实现与边界

- Node.js >=24；core 1.80.0、rag 2.7.1、libsql 1.27.1、zod 4.6.7，pnpm 12.4.1。
- 十三个源码文件：五模块、八入口；六份元数据；五份 Markdown 和一份目录材料。JS/TS 与下载同步，退出后关闭内存向量库。
- 02/03 离线；04—09 使用真实 Vercel API 代码。Embedding 使用原生 fetch + /v1/embeddings，以 openai/text-embedding-3-small 为网关内 model 标识；生成/重排沿用 vercel/openai/gpt-6.1-sol 和 AI_GATEWAY_API_KEY。
- 选择直接 HTTP 明确接口边界，不将当前 Embedding Router 只支持的字符串格式与生成 Router 前缀混用。不是更换供应商，也未引入第二套凭证。
- 准备材料是虚构制度，包含甲团队旧/新住宿、交通、提交说明和乙团队住宿。active 是维护状态，不宣称自动识别最新版本或有效时间。
- Markdown 标题分片保留 section。递归比较参数仅演示边界，字符长度不是 Token，带标题策略不推定 maxSize 生效。
- 返回索引校验数量、顺序、维数与有限数值。入库与问题使用同一函数配置，维数从结果取得；固定验证维数不能声称为真实模型默认维数。
- LibSQLVector 真正入库/query/upsert/delete，重复 id 不增数量；写新 id 不自动清除旧 id，版本切换需管理。
- 查询限定 teamId 与 active；脚本范围固定，实际鉴权来自 19。过滤条件不承担认证，候选在发送重排模型前已限定。
- rerank 调用 MastraAgentRelevanceScorer，逐候选付费调用是实际行为。权重 semantic=.7/vector=.3/position=0，输出 details；不把混合分数作统一置信度或阈值。
- 候选文本须在 metadata.text；重排不增加候选集合。不存在统一“有结果即可回答”或默认拒答相似度阈值。
- answerQuestion 返回结构化状态/文字/片段引用，checkCitations 只检验范围与状态约定。实际支持关系仍需原文和评估；空范围直接资料不足，后续 Agent 应保留状态。
- 文档级三个问题命中比例只展示链路，不等同整体 Recall@K 或模型语义效果。重切、换模型与制度换版需要回归。

## 图示与验证

三图：文档准备/查询共享索引；授权范围在重排/生成前生效；编号检查与语义支持分别核对。

使用真实 MDocument、LibSQLVector、rerank 与 Agent 的固定响应验证；仅拦截 Embedding HTTP 返回受控小维向量，用 V2 固定模型替换远端生成。验证 API/数据映射、范围、入库数量和引用约束，不作为真实语义召回、重排质量或答案真实性证据。不得发起付费验证请求。

检查 JS/TS 本地材料、代码引用和 ZIP 与来源一致，路由与前后节衔接。页面 SSR 和 SVG 不替代浏览器端到端。遵守不运行 pnpm dev/build/lint/test，不提交发布。

本轮 polish：资料不足时允许引用当前候选中说明缺项的条款，不把“资料不足必须无引用”误写成通用要求。可回答仍必须引用，所有编号均限定当前候选，回答文字不能为空。

最终复核：JS/TS 八入口以真实 MDocument/LibSQLVector/rerank/Agent API 完成固定响应验证，均正常退出；分别拦截 15 次向量请求和 9 次模型调用，没有远端付费调用。验证同 id upsert 数量不增、删除数量减少、团队/有效状态过滤、重排字段与引用映射；补测错位/缺失/维数不一致向量、401、非法引用、空回答及资料不足带合法引用。此结果只证明链路和约束，不证明真实语义质量。

目录 21 章 178 节，26 处新 JS/TS 源码引用匹配；575 个源码解析、10 种高亮语法、356 份页面与 77 个图示 SSR 通过。三张新 SVG 已检查，JS/TS ZIP 各 25 个文件逐字一致，没有真实 .env、依赖或数据库。
