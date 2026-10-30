# 13 沙箱：执行活动处理代码

Node.js >=24，此包使用 TypeScript。先执行 pnpm install。全部入口只运行本章固定教学代码，无需模型密钥。

```bash
node src/01-runtime.ts
node src/02-command-results.ts 成功
node src/02-command-results.ts 失败
node src/03-environment.ts 正常
node src/03-environment.ts 缺少依赖
node src/04-code-artifact.ts
node src/05-processes.ts
node src/06-isolation.ts
node src/07-lifecycle.ts
```

01—05、07 的 LocalSandbox 默认直接使用应用宿主权限。工作目录是 lab/ 下的对应小节目录，不是自动启用的操作系统隔离。不要把这些固定教学命令替换成不可信输入后仍当成安全环境。

06 显式检测并配置 macOS Seatbelt 或 Linux Bubblewrap，禁用网络，并用临时的 127.0.0.1 教学端点观察连接结果。没有原生后端或启动失败时会明确报告，不静默降级。该检查只验证一个网络场景，不能证明所有文件、依赖或进程都已按预期隔离。原生策略有平台差异：固定版本 macOS 默认配置允许文件读取并开放临时目录写入，不能将其描述为只可访问工作目录。

05 显式停止后台进程并等待退出，finally 再回收环境。不要让后台进程随示例遗留。07 使用应用归属作为缓存键，演示同一用户复用与不同用户分开；resolver 返回的环境由应用显式销毁和清缓存。身份核实仍由真实应用实现。

LocalSandbox.destroy 不自动删除普通教学文件；远程沙箱停止后的文件保留取决于提供方与挂载配置。工作区文件接口与命令执行位置也不会仅凭文件名自动同步。脚本统计固定数据的期望值是有效人数 2、剩余名额 18，不代表已经处理真实报名数据。

两种语言执行逻辑一致，锁定依赖版本，不额外安装脚本依赖或拉取远程代码。
