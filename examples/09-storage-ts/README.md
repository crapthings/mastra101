# 09 存储：活动助手的数据落点

使用 Node.js >=24，此包使用 TypeScript。在本目录执行 pnpm install。

本章全部示例只操作本地教学数据库，不调用聊天模型或嵌入服务，也不需要密钥。02 中的 Agent 模型配置沿用 vercel/openai/gpt-6.1-sol，但脚本仅通过记忆 API 创建记录，不发起生成请求。

```bash
node src/01-persistence.ts 写入
node src/01-persistence.ts 读取
node src/02-scope.ts
node src/03-domains.ts
node src/04-adapter.ts
node src/05-vector-index.ts
node src/06-composite.ts
node src/07-retention.ts
```

01 的两次运行必须使用相同工作目录和数据库文件。04 打印绝对路径；其他示例使用相对路径，数据库放在执行命令的工作目录。每节使用不同文件；02、03、05、06、07 的教学记录使用新标识，可以重复核对。

05 使用固定的三维向量演示接口和原消息标识关联，不代表真实中文语义嵌入。06 使用两个本地文件演示领域路由，迁移到其他数据库前仍要检查领域支持、连接配置和已有数据。

07 会删除本节专用 07-retention.db 中超过 30 天的消息。只对本节教学文件运行；它不清空会话、资源、向量或其他后端数据。retention 配置不会自动安排执行，prune 返回 done=false 时还需后续维护调用。删除行也不代表数据库文件立即变小。

依赖版本与锁文件固定。不要提交 .db 文件或真实连接凭证。TS 版本与 JS 逻辑一致，Node.js 24 可直接执行这里使用的语法。
