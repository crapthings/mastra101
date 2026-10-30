# 12 工作区：活动资料与产物

Node.js >=24，此包使用 TypeScript。执行 pnpm install 后逐节运行，不需要模型密钥。

```bash
node src/01-workspace.ts
node src/02-paths.ts
node src/03-read-write.ts
node src/04-search.ts
node src/05-skills-directory.ts
node src/06-resource-scope.ts
node src/07-artifacts.ts 写入
node src/07-artifacts.ts 读取
```

所有文件写入命令工作目录下的 lab/ 对应小节。07 的两个命令应在同一目录执行；本地文件保留跨进程，destroy 不自动删除它们。只读配置约束相应文件接口，不是宿主进程的操作系统权限隔离。

04 显式更新索引，演示文件与索引需要保持同步；BM25 是词项检索，不保证理解任意中文同义表达。05 不发起模型调用，通过实际技能内容验证共享与同名覆盖。06 的用户标识由应用白名单确定，不代替真实身份认证。

工作区没有配置 Sandbox，不运行用户提供的命令。文件读写、技能共享、数据库中的 Memory、Workflow 快照分别有自己的范围与生命周期。两种代码版本逻辑相同，依赖与锁文件固定。
