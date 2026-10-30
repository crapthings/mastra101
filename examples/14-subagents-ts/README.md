# 14 子智能体：委派活动核对与提醒

Node.js >=24，此包使用 TypeScript。先 pnpm install，将 .env.example 复制成 .env，填写前面使用的 AI_GATEWAY_API_KEY。

02 只列出配置，不调用模型。其余入口会通过 vercel/openai/gpt-6.1-sol 发起真实请求，父子调用均计入模型开销。

```bash
node --env-file=.env src/01-subagents.ts
node src/02-description.ts
node --env-file=.env src/03-context.ts
node --env-file=.env src/04-results.ts 默认
node --env-file=.env src/04-results.ts 完整
node --env-file=.env src/05-hooks.ts 允许
node --env-file=.env src/05-hooks.ts 拒绝
node --env-file=.env src/05-hooks.ts 钩子错误
node --env-file=.env src/06-budgets.ts 1
node --env-file=.env src/06-budgets.ts 2
node --env-file=.env src/06-budgets.ts 覆盖
node --env-file=.env src/06-budgets.ts 取消
node --env-file=.env src/07-memory.ts
node --env-file=.env src/08-verification.ts 正常
node --env-file=.env src/08-verification.ts 缺少地点
node --env-file=.env src/08-verification.ts 委派失败
```

所有通知与查询结果都是教学资料，没有接入真实预约服务或发送通知。shared.ts 保存共同资料与最小 Agent 工厂；每节从独立入口观察一种机制。

01 与 07 的委派选择由模型决定，需核对实际调用记录。03 同时重建委派提示与过滤历史，避免把两条内容路线混淆；RequestContext 只使用字符串，浅复制不等于深复制嵌套对象。04 默认只把子结果文本交给父模型，应用仍可检查嵌套工具数据。

05 显式采用 hookErrorStrategy: throw。06 固定查询与回答路径，取消模式仅用于观察信号传播；退出、超时不会撤销外部动作。父子步数分别计算，不是总请求或费用上限。

07 向 07-memory.db 写入本轮主会话与独立子会话，关闭工作记忆与语义召回；可见上下文与持久保存消息应分别核对。08 记录核对与文案两阶段是否返回完整文本，缺少任一阶段以非零退出码提示；文本的事实质量仍需与通知核对。委派失败不表示原文没有活动信息。

示例不保证模型一定选择预期工具或生成固定措辞。先检查委派对象、任务、子结果与父回答，再判断完成情况。真正必须持久化、按业务顺序执行的任务，仍使用工作流与相应授权检查。
