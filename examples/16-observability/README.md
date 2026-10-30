# 16 追踪与指标

默认 JavaScript；Node.js >=24，pnpm 12。

安装：`pnpm install --frozen-lockfile`。

除 02 外，入口都是不请求模型的固定工作流实验：

- `node src/01-tracing.js`：配置后查询完整追踪。
- `node src/03-context.js`：关联业务请求与运行。
- `node src/04-outcomes.js`：正常、资料缺失、异常三种结果。
- `node src/05-logs.js`：查询当前追踪中的日志。
- `node src/06-capture.js`：检查输入输出隐藏与字段脱敏。
- `node src/07-metrics.js`：查询真实自动指标的 count、avg、max。
- `node src/08-diagnosis.js`：从耗时样本回到执行树与日志。

智能体示例：复制 `.env.example` 为 `.env`，填写 AI_GATEWAY_API_KEY，然后执行 `node --env-file=.env src/02-spans.js`。它请求 `vercel/openai/gpt-6.1-sol`，需要网关账号可访问该模型，实际调用有费用。

`src/lab.js` 提供共享配置：LibSQL 存应用状态，DuckDB 的 observability 域存追踪、日志与指标。均为内存数据库；退出即清空，适合独立实验。需要持久化时自行改成文件路径，并考虑权限与保留周期。没有注册外部遥测导出器。

每次查询前等待 flush；finally 调用 Mastra.shutdown，让导出先完成，再关闭组合存储。不要在异步导出仍运行时提前关数据库。

04 的 error 模式预期会输出模拟错误，但脚本继续对比三种结果。工作流已存 span 的 outcome 可能为空，应结合 attributes.status、endedAt 和 error；success 不保证业务资料齐全。

观测 logging.level 显式设为 info，否则默认 warn 会过滤教学中的 info。隐藏追踪输入输出不覆盖独立日志；SensitiveDataFilter 按字段处理，不保证识别自由文本敏感信息。所有元数据均为虚构资料。

07、08 只有三个样本，未实现生产分页或大规模诊断。人工等待只用于验证采集与查询，不是模型性能测评。count 统计匹配指标记录，费用估算不等于账单。
