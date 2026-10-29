# Mastra Journey · WIP

一本从大语言模型基础逐步走向 Mastra 实际开发的中文交互学习书。

**当前为 WIP 公开预览版**：已整理 01—07 章，内容、示例和目录仍会持续调整，不是正式定稿。

- 在线阅读：https://crapthings.github.io/mastra101/
- 仓库：https://github.com/crapthings/mastra101
- 当前内容：大语言模型、框架体系、快速开始、核心组件、提示词、模态、智能体。
- 示例支持 JavaScript / TypeScript 切换，提供独立项目下载。

## 项目

使用 Node.js 24 或更高版本和 package.json 指定的 pnpm 版本。安装依赖后可按需运行 package.json 中的开发或构建命令。

站点使用 React、React Router 和 Vite，课程按路由动态加载。共享偏好由 Zustand 保存，中文资源位于 src/locales。

## 发布

main 分支更新后，GitHub Actions 自动构建并发布 GitHub Pages。PAGES_BASE_PATH 设置发布子路径，scripts/prepare-pages.js 为课程生成静态入口，支持直接打开或刷新章节链接。

本地的 mastra/ 是阅读上游源码时使用的参考副本，不属于本站发布内容。需要时可单独克隆 https://github.com/mastra-ai/mastra 到该目录。

## 示例与凭证

examples/ 下的项目有各自的 README 和环境变量模板。网站本身是静态教程，不需要模型密钥；读者在自己的环境中运行模型示例时，需要自行配置凭证，并承担相应服务费用。请勿提交 .env、数据库或运行产物。
