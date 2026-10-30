# 22 持续执行（Harness）

默认 JavaScript。要求 Node.js >=24，在本目录运行命令。

```bash
pnpm install
cp .env.example .env
```

填写 `AI_GATEWAY_API_KEY`。模型与目标 judge 统一使用 `vercel/openai/gpt-6.1-sol`。实际调用会产生费用；通知存储、来源订阅和默认恢复查询不需要调用模型。`data/` 保存教学数据库，不提交凭证和运行数据。

```bash
node --env-file=.env src/02-durable.js
node --env-file=.env src/03-observe.js
node --env-file=.env src/04-thread-streams.js
node --env-file=.env src/05-signals.js
node --env-file=.env src/05-active-signals.js
node --env-file=.env src/06-state-signals.js
node --env-file=.env src/07-goals.js
node --env-file=.env src/08-tasks.js
node --env-file=.env src/09-background.js
node --env-file=.env src/10-notifications.js
node --env-file=.env src/11-providers.js
node --env-file=.env src/12-schedules.js
node --env-file=.env src/13-controller.js
node --env-file=.env src/15-recovery.js inspect
```

- 02／03：一次持久运行与同进程缓存回放；默认内存缓存不能保证跨进程回放。
- 04：一个线程订阅连续接收两次运行，按 `runId` 区分结果。
- 05：只保存更新，等待用户显式提问；05-active：工具实际开始后递送补充材料，再处理排队消息，核对工具没有被重复执行。
- 06：完整状态快照、相同 `cacheKey` 去重和后续上下文。`contents` 给模型，`value` 给程序。
- 07：目标判定、反馈与预算。真实结果可能完成或暂停，不要求固定回答。
- 08：`TaskSignalProvider` 注册任务工具与状态处理器；保留未取得批准的事项，检查工具结果。
- 09：只读后台任务与 `untilIdle` 后续处理，完整过程消费 `fullStream`。
- 10：`persist` 策略保存通知收件箱，相同范围内的待处理事件按 `dedupeKey` 合并；不请求模型。
- 11：`SignalProvider` 将匹配外部对象的教学事件转为通知；直接调用处理方法，不启动 HTTP，也不代替 Webhook 签名校验。基类订阅表在内存中，实际重启需要恢复订阅。
- 12：启动 worker，创建工作日早上 9 点（Asia/Shanghai）计划，暂停周期，手动触发一次并等待完成；退出删除演示计划。
- 13：会话订阅与模式切换，不把模式名当成权限。
- 15：默认 `inspect` 只查看活动记录。跨进程协调一节说明共享存储、PubSub 与租约，这个包没有模拟多副本部署。

`assistant.js` 创建助手与存储；`thread-runtime.js` 为连续输入示例创建同一归属的线程，并提供串行教学使用的接收函数。真实界面应持续消费并按运行及消息标识合并，不能把该小函数当成并发会话管理器。

## 恢复演练

```bash
node --env-file=.env src/15-recovery.js start
```

在工具约 20 秒的只读等待期间，可以从另一终端查看记录；终止启动进程后，从相同目录执行：

```bash
node --env-file=.env src/15-recovery.js inspect
node --env-file=.env src/15-recovery.js recover
```

先确认旧进程已经停止。认领尚未失效时，可能返回 `skipped`，应核对原因与重试时间，不强制接管。没有可用检查点的空结果，不代表恢复成功。

恢复可能重做模型、工具或子智能体调用。写操作应按稳定业务键去重，并核实外部结果。示例显式保存 `running` 快照用于手动恢复，没有配置自动恢复或共享事件后端。

## 版本与验证

示例继续固定正式依赖 core 1.80.0、memory 1.39.1、libsql 1.27.1。上游主分支文档也可能描述 alpha 中的新功能，未将非 Agent 后台任务所有者等新接口混入本章练习。

维护时使用本地固定模型响应与真实 Mastra 运行机制检查数据、状态和投递路径；这不代表真实供应商的回答质量、完整分布式部署或所有故障都已验证。
