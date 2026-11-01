# 22 持续执行（Harness）

此包使用 TypeScript。要求 Node.js >=24，在本目录运行命令。

```bash
pnpm install
cp .env.example .env
```

填写 `AI_GATEWAY_API_KEY`。模型与目标 judge 统一使用 `vercel/openai/gpt-6.1-sol`。实际调用会产生费用；通知存储、来源订阅和默认恢复查询不需要调用模型。`data/` 保存教学数据库，不提交凭证和运行数据。

```bash
node --env-file=.env src/02-durable.ts
node --env-file=.env src/03-observe.ts
node --env-file=.env src/04-thread-streams.ts
node --env-file=.env src/05-signals.ts
node --env-file=.env src/05-active-signals.ts
node --env-file=.env src/06-state-signals.ts
node --env-file=.env src/07-goals.ts
node --env-file=.env src/08-tasks.ts
node --env-file=.env src/09-background.ts
node --env-file=.env src/10-notifications.ts
node --env-file=.env src/11-providers.ts
node --env-file=.env src/12-schedules.ts
node --env-file=.env src/13-controller.ts
node --env-file=.env src/15-recovery.ts inspect
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

`assistant.ts` 创建助手与存储；`thread-runtime.ts` 为连续输入示例创建同一归属的线程，并提供串行教学使用的接收函数。真实界面应持续消费并按运行及消息标识合并，不能把该小函数当成并发会话管理器。

## 恢复演练

```bash
node --env-file=.env src/15-recovery.ts start
```

在工具约 20 秒的只读等待期间，可以从另一终端查看记录；终止启动进程后，从相同目录执行：

```bash
node --env-file=.env src/15-recovery.ts inspect
node --env-file=.env src/15-recovery.ts recover
```

先确认旧进程已经停止。认领尚未失效时，可能返回 `skipped`，应核对原因与重试时间，不强制接管。没有可用检查点的空结果，不代表恢复成功。

恢复可能重做模型、工具或子智能体调用。写操作应按稳定业务键去重，并核实外部结果。示例显式保存 `running` 快照用于手动恢复，没有配置自动恢复或共享事件后端。

## 版本与验证

示例继续固定正式依赖 core 1.80.0、memory 1.39.1、libsql 1.27.1。上游主分支文档也可能描述 alpha 中的新功能，未将非 Agent 后台任务所有者等新接口混入本章练习。

维护时使用本地固定模型响应与真实 Mastra 运行机制检查数据、状态和投递路径；这不代表真实供应商的回答质量、完整分布式部署或所有故障都已验证。

## 主线综合案例：APP-001 连续核查

先读 01—08 的运行、线程、输入、状态、目标和任务，再进入 16。09—15 为后台、通知、计划、控制器、协调与恢复选读。主线不要求把全部机制接入一个助手。

所有命令在同一目录串行执行：

```bash
node src/16-case.ts init
node src/16-case.ts inspect
node --env-file=.env src/16-case.ts review
node src/16-case.ts supplement
node src/16-case.ts inspect
node src/16-case.ts supplement
node --env-file=.env src/16-case.ts review
node src/16-case.ts inspect
```

只有 review 调用模型并产生费用；其余命令只创建、读取或保存教学状态。data/case-001.json 与 case-study.db 保留同一线程及材料。重复 init 不重置，重复 supplement 不增加同一批准的版本。不要同时运行多个案例命令，也不要只复制 JSON 而遗漏数据库。

第一轮金额 560 元、上限 500 元、无批准，程序判定为“待补批准”。supplement 读取 materials/case-approval.json 的虚构事先批准记录；代码检查申请编号、允许金额及批准早于住宿日期，不代表认证了真实审批人。补充后 revision 从 1 到 2，只保存状态，不请求模型。

第一次 report 的材料摘要与当前事实不一致时，inspect 显示 stale: true。重新 review 后应保持 threadId、得到新 runId，报告 revision=2，stale=false。报告位于 data/case-001-report.json，新报告替换旧报告；需要对比可先另存。程序结论最多到“材料齐全，待人工确认”，模型说明单独保留并标为待人工对照，未执行报销提交或通知。

缺少线程或归属不匹配会失败，不创建替代线程掩盖问题。本例验证跨进程读取已保存进度；生成中崩溃恢复另用 15，跨实例协调另读 14。模型可能生成错误说明或运行失败，不能用固定教学事实替代模型语义验收。
