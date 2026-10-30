# 11 技能：维护活动处理方法

Node.js >=24，此包使用 TypeScript。在本目录执行 pnpm install。

```bash
node src/01-skills.ts
node src/02-definition.ts
node --env-file=.env src/03-loading.ts
node src/04-skill-file.ts
node src/05-references.ts
node src/06-dynamic.ts
node --env-file=.env src/07-verification.ts
```

只有 03 和 07 发起模型请求，需把 .env.example 复制为 .env 并填写 AI_GATEWAY_API_KEY。模型统一为 vercel/openai/gpt-6.1-sol，运行会产生相应服务费用。其他入口只读取元数据、技能文件或校验结果。

materials/skills/activity-review 随包提供 SKILL.md、参考资料和模板。读取文件和列出技能不代表模型已经按规则执行；03、07 用步骤记录观察 skill 工具调用，再核对最终输出。技能里的步骤是给模型的方法说明，不等于第 10 章中程序必须执行的 Workflow Step。

脚本不修改真实预约、不发送通知。技能文件中的脚本链接也不会自动启动程序；执行环境在后续章节介绍。两种代码版本逻辑一致，依赖与锁文件固定。
