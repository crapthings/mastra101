# 10 工作流：活动准备清单

Node.js >=24，默认 JavaScript。在本目录执行 pnpm install。

01—07 只使用本地教学数据，不需要模型密钥。08 会调用 Vercel 网关模型；将 .env.example 复制为 .env 后填写 AI_GATEWAY_API_KEY。

```bash
node src/01-workflow.js
node src/02-schemas.js 正常
node src/02-schemas.js 缺少标题
node src/02-schemas.js 错误人数
node src/03-sequential.js
node src/04-branching.js 完整
node src/04-branching.js 缺少地点
node src/05-parallel-foreach.js
node src/06-suspend-resume.js 开始
node src/06-suspend-resume.js 补充 南门
node src/06-suspend-resume.js 确认
node src/07-errors.js 暂时失败
node src/07-errors.js 持续失败
node src/07-errors.js 待补充
node --env-file=.env src/08-agents.js
```

06 需要在同一目录分三次运行。开始后记录 runId 到 06-pending.json，快照保存于 06-workflows.db；补充地点后再次暂停，展示待确认清单；输入“确认”命令后才写入或覆盖 06-confirmed.json。也可用“拒绝”替代“确认”，此时不会写入，已有旧文件也不会自动删除。每次开始都会创建新运行并覆盖教学指针文件，它不是多用户任务管理界面。

恢复需要相同数据库、流程定义及标识。重复确认已结束运行会被拒绝。实际应用需验证确认者身份及运行归属，不能直接信任客户端的 runId。工作流暂停恢复是从暂停步骤重新执行，并非从 JavaScript 语句中间继续，因此不要把不可重复的写入放在 suspend 之前。

07 用计数模拟一次查询暂时失败，retries: 1 允许初次执行后再试一次；持续失败时仍失败，待补充时通过 bail 提前交付业务结果。没有外部写入，不把示例计数当成可跨进程共享的状态。

08 用 Agent 组织草稿，用程序核对标题和地点；清单内容是否正确仍需对照原始材料。maxSteps 管 Agent 内部调用步骤，工作流步骤重试有独立预算。示例不发送通知，也不修改真实预约。

所有依赖和锁文件固定。不要提交 .env、数据库、指针或已确认清单。TS 版本与 JS 逻辑一致。
