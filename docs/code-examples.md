# 代码示例的语言与高亮

## 读者交互

页头和 JS/TS 代码块提供同一组语言选项。首次访问默认 JavaScript；Zustand persist 只把 language 写入 localStorage 的 `mastra-journey-code-preferences` 键。切换路由或重新加载会沿用选择，异常语言值回到 JS。

第三章同时切换正文中的文件名、完整代码、package.json、启动方式和下载链接。JS 版由 Node.js >=24 直接运行，TS 版由 tsx 运行。两版模型均为 `vercel/openai/gpt-6.1-sol`，密钥均为 `AI_GATEWAY_API_KEY`。

localStorage 属于当前浏览器及站点；清除站点数据会清除偏好。它不是跨设备账户设置。

## 方案选择

采用 Shiki 4.5.0 的细粒度核心与 JavaScript 正则引擎。高亮模块在代码块挂载后动态加载；语言限定为 JavaScript、TypeScript、JSON、JSONL、YAML、XML、CSV、Bash、Markdown 和 Dockerfile，主题限定为 github-dark。未知语言及加载失败保留可读的纯文本。

使用 codeToTokens 将结果交给 React 渲染，不注入 HTML。词法颜色来自主题，其他布局继续使用 Tailwind。异步结果同时匹配源代码和语法，快速切换不会将旧高亮覆盖到新代码上。

react-markdown 负责 Markdown 解析与 React 元素生成，本身不是高亮器。当前章节已有独立提示框、图示和语言版本，暂不迁移为 Markdown；以后如采用 Markdown，可以让它的代码组件复用现有 CodeBlock，不需要更换高亮方案。

依据：[Shiki 细粒度加载](https://shiki.style/guide/bundles)、[JavaScript 正则引擎](https://shiki.style/guide/regex-engines)、[react-markdown](https://github.com/remarkjs/react-markdown)。

## 维护示例

- TypeScript 源文件：`examples/03-time-assistant`。
- JavaScript 对应版本：`examples/03-time-assistant-js`。
- 同步命令：`python3 scripts/sync-example-variants.py`。
- 脚本根据本例明确使用的 TS 语法生成 JS、课程 JS 覆盖数据及两个 ZIP；新增 TS 语法时必须检查转换规则和实际 JS 运行结果，不将它当成通用编译器。
- 两版依赖变化时，各自更新 pnpm 锁文件，再运行同步脚本；不得打包 `.env` 或 `node_modules`。
- 章节原始内容作为 TS 版本，`codeVariants.js` 仅覆盖存在差异的内容；两者仍随各自章节路由加载。

## 验证

已检查默认语言、持久化后恢复、损坏/无效存储回退，JS 与 TS 示例及下载包一致性，时区函数正常与失败结果，高亮后文本无损，以及 JSX/JS 语法。没有向模型发送请求。

当前浏览器连接不可用，本地未发现已运行的教程服务。遵守项目约定，未启动开发服务或运行构建／测试脚本；实际浏览器视觉和键盘操作仍待验证。

结构化输出示例还按需加载 JSONL、YAML、XML、CSV 语法，保留同一主题与正则引擎；不在入口加载全部语言。

20 的容器文件按需加载 Dockerfile 语法；JS/TS 切换同时更新 Docker 启动入口，保留 package.json 等非 JS 文件名。
