# 08 记忆：活动助手

Node.ts >=24，此包使用 TypeScript。先在本目录执行 pnpm install，将 .env.example 复制为 .env，填写 AI_GATEWAY_API_KEY。

## 逐节运行

```bash
node --env-file=.env src/01-memory.ts
node src/02-threads.ts
node --env-file=.env src/03-history.ts 2
node --env-file=.env src/03-history.ts 8
node --env-file=.env src/04-working-memory.ts
node --env-file=.env src/05-semantic-recall.ts
node --env-file=.env src/06-context.ts
node --env-file=.env src/07-observational.ts
node --env-file=.env src/08-persistence.ts 写入
node --env-file=.env src/08-persistence.ts 读取
node src/09-review.ts
```

01、03、04、06—08 会调用聊天模型；05 仅调用嵌入模型，也会产生费用。02、09 只操作本地教学数据库。主聊天模型和观察模型使用 vercel/openai/gpt-6.1-sol，嵌入模型通过同一 Vercel 网关接 openai/text-embedding-3-small。

每节使用不同的数据库文件。除 08 持久化示例外，每次运行生成新的资源和会话标识，避免旧历史干扰。08 必须在同一目录运行两次命令，使用相同数据库文件与标识；可重复写入，会追加历史。

04 中工作记忆是否更新要核对实际存储，不能假定模型一定调用了更新工具。06 和 07 的短对话用于跑通配置，通常不会达到裁剪或观察阈值。要验证长对话行为，需准备超过阈值的材料并检查实际模型输入和额外观察调用。07 显式关闭异步缓冲便于理解；这不是面向所有生产任务的推荐配置。

09 用显式 API 修正教学偏好，再删除本次会话，展示消息历史与资源偏好的生命周期不同。它不是完整的“忘记用户”实现：真实应用还要处理资源数据、向量、观察记录及其他副本。所有例子都不连接真实报名系统。

依赖版本与锁文件固定。示例中的 .db 只保存在本地，不应提交。两种语言的逻辑一致，模型输出不是固定答案。数据库里保留了资料，也不代表模型每次都能完整使用。
