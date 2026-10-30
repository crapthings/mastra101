# 17 评估

默认 JavaScript；Node.js >=24，pnpm 12。

安装：`pnpm install --frozen-lockfile`。

- `node src/02-checks.js`：为两条保存的回答做关键词检查。
- `node src/03-scorer.js`：自定义评分器与无法评分。
- `node src/05-datasets.js`：加入数据集、修改审核标记、查询原版本并核对标记变化。
- `node src/06-batch.js`：实际工作流批量评估，打印逐条分数与平均值。
- `node src/07-gates.js`：failed、scored、passed 三种判定。
- `node src/08-live.js`：步骤后台评分，有限等待后查询存储结果。
- `node src/09-experiments.js`：固定数据版本，比较两个注册工作流。

模型评分单独运行：复制 `.env.example` 为 `.env`，填写 AI_GATEWAY_API_KEY，执行 `node --env-file=.env src/04-judge.js`。该入口请求 `vercel/openai/gpt-6.1-sol`，需要网关账号可访问此模型，调用有费用。其他入口不请求模型。

`src/samples.js` 保存南门、东门、入口未公布三种样本。`src/scorer.js` 比较状态、入口与来源；缺少参考资料时返回 notScorable。`src/lab.js` 注册两个固定工作流：baseline 在入口为空时补成南门，revised 保留待确认。它们用于理解评估 API，不展示模型生成质量。

共享实例使用内存 LibSQL；评分、数据集和实验结果会在进程退出后清空。每个脚本独立创建数据，不依赖之前脚本留下的状态。需要跨进程保存时配置文件或服务端存储。pnpm-workspace.yaml 跳过本章不用的 esbuild 安装脚本。

关键词出现、调用过工具、运行 success、实验 completed 都不能单独证明结果有依据。runEvals 的 gate 与 threshold 是评估判定；在线评分在后台执行，不能撤回业务操作。08 最长等待约五秒，只用于示范异步结果查询。

模型评审需要人工样本校准；调整评审提示或模型，会改变测量方式。样本 groundTruth 只供评分使用，不交给被测目标。生产样本应去除不需要的个人资料，并人工复核参考结果。
