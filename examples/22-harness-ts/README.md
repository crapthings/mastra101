# 22 持续执行（Harness）

此包使用 TypeScript。要求 Node.js >= 24，在本目录执行命令。

```bash
pnpm install
cp .env.example .env
```

填入 `AI_GATEWAY_API_KEY`。生成与目标判定统一使用 `vercel/openai/gpt-6.1-sol`，实际运行会调用模型并产生费用。`data/` 保存本地演示数据库，不提交凭证和运行数据。

```bash
node --env-file=.env src/02-durable.ts
node --env-file=.env src/03-observe.ts
node --env-file=.env src/04-goals.ts
node --env-file=.env src/05-background.ts
node --env-file=.env src/06-schedules.ts
node --env-file=.env src/07-controller.ts
node --env-file=.env src/08-recovery.ts inspect
```

- 02：持久运行与运行标识；03：同进程、已完成运行的事件回放。默认内存缓存不保证跨进程回放。
- 04：持久线程目标、判定事件及预算。模型实际回答不固定，目标可能完成，也可能暂停。
- 05：后台只读任务、完成事件与 `untilIdle` 后续处理；半秒等待用于模拟读取。完整过程读取 `fullStream`。
- 06：启动 worker，创建工作日 9 点（Asia/Shanghai）计划，暂停周期触发，再手动运行一次并等待结果。退出前删除该演示计划。
- 07：创建会话、订阅事件、切换核查模式。模式名不等于权限控制。
- 08：默认仅查看活动记录，不会自动启动模型。

## 恢复演练

```bash
node --env-file=.env src/08-recovery.ts start
```

工具为只读操作，约等待 20 秒。可在另一终端执行 `inspect` 查看记录；在工具等待期间终止启动进程，之后从同一目录执行：

```bash
node --env-file=.env src/08-recovery.ts inspect
node --env-file=.env src/08-recovery.ts recover
```

应先确认旧进程已经停止。旧执行的认领在失效前可能导致 `skipped`，先核对原因再重试；不要强制接管仍在执行的任务。没有可恢复的检查点时，返回空记录不是故障恢复成功。`recover` 可能重复模型调用和工具调用，外部写操作必须另行去重。

08 显式持久化 `running` 快照，用于手动恢复。示例没有启用部署启动时的自动恢复，也没有配置跨副本共享 PubSub 或事件缓存。

## 验证范围

代码使用真实 Mastra API。维护时用固定的本地模型响应核对运行、回放、目标继续／暂停、后台任务、定时任务和会话行为；该检查不代表真实模型回答质量。实际供应商输出、生产分布式后端与故障策略需在自己的环境验收。
