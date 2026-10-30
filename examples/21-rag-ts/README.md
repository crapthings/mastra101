# 21 检索增强生成

此包使用 TypeScript；Node.js >=24，pnpm 12。

安装：`pnpm install --frozen-lockfile`。

离线入口：

- `node src/02-documents.ts`：读取五份教学文档，核对团队、版本与有效状态。
- `node src/03-chunking.ts`：比较递归分片与 Markdown 标题分片。

复制 `.env.example` 为 `.env`，填写 AI_GATEWAY_API_KEY 后运行以下入口，会产生真实接口调用：

- `node --env-file=.env src/04-embedding.ts`：Vercel Embedding API 返回向量，核对尺寸。
- `node --env-file=.env src/05-index.ts`：实际 LibSQLVector 入库、重复 upsert 与删除计数。
- `node --env-file=.env src/06-retrieval.ts`：同一问题分别按三个团队范围检索。
- `node --env-file=.env src/07-reranking.ts`：使用 Mastra rerank 对当前候选评分与重排。
- `node --env-file=.env src/08-grounding.ts`：生成带片段引用的回答，解析对应来源；无候选时返回资料不足。
- `node --env-file=.env src/09-evaluation.ts`：三个问题的必要文档命中与范围检查。

Embedding 直接请求 Vercel 的 https://ai-gateway.vercel.sh/v1/embeddings，model 为 openai/text-embedding-3-small。重排与回答通过 Mastra 使用 vercel/openai/gpt-6.1-sol。生成模型与向量模型有不同职责，均使用同一个网关环境变量。

所有制度都是教程编写的虚构资料，不用于任何公司的实际报销决策。materials/catalog.json 显式维护归属、版本和 active；模型不会自动判断哪一版生效。teamId 在本地脚本中固定，生产请求应从认证身份确定，不接受普通用户随意选择其他团队。

documents.ts 读取材料并生成带来源的片段；embedding.ts 校验批量结果；index.ts 实际建库、入库与检索；ranking.ts 调用内置重排；answer.ts 校验结构与引用编号。

每个入口独立创建内存索引，结束后关闭。04—09 会重复请求所需向量；实际服务通常复用持久索引和已有向量。重复运行也会重复产生对应费用。重排可能逐候选调用模型，先控制候选数量。

引用校验只检查编号属于本次候选及状态约定，不证明模型对原文的解释正确。检索分数、重排混合分数和三个样本命中比例也不等于回答可信概率。用真实模型评估时还需检验条件遗漏、资料不足、更新与范围等情形。
