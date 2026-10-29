# 旅行时间助手

教程 03 的完整练习项目。要求 Node.js ≥ 24，使用 pnpm。所有模型调用统一经过 Vercel AI Gateway，模型为 `vercel/openai/gpt-6.1-sol`。

## 1. 准备项目

进入解压后的 `03-time-assistant` 文件夹，再执行：

```sh
node --version
pnpm --version
pnpm install
cp .env.example .env
```

Windows 用户也可以在文件管理器中复制 `.env.example`，将副本命名为 `.env`。

编辑 `.env`，将占位文字替换为自己的 `AI_GATEWAY_API_KEY`。凭证是 Vercel AI Gateway API Key，不是 OpenAI 直连密钥，也不是通用的 Vercel 账户访问令牌。参见 [Vercel 认证说明](https://vercel.com/docs/ai-gateway/authentication-and-byok)。不要提交 `.env`。

下载包已包含最终代码，不需要先复制教程中的每个代码块。教程中的 JS／TS 切换会改变展示的代码和下载链接，不会改动已下载的本地项目；选定一种版本完成本章即可。下面按阶段运行。

## 2. 确认模型接入

```sh
pnpm basic
```

这一版没有工具。收到模型响应，说明调用路径已接通；即使它回答了某个时间，也不能据此证明查询过时钟。

## 3. 单独检查时间函数

```sh
pnpm clock Asia/Tokyo
pnpm clock Asia/Shanghai
pnpm clock Invalid/Zone
```

这些命令只读取本机时钟，不请求模型，不需要密钥或网络。正常时区应返回 `ok: true`，无效时区应返回 `ok: false`，且不包含伪造的 `localTime`。这里的 `ok` 是本例定义的结果字段；返回 `ok: false` 表示查询失败，不等于程序抛出异常。

`capturedAt` 是 UTC 取样时刻，`localTime` 是同一时刻在指定时区的显示。准确性依赖运行环境的系统时钟。城市名称不能替代时区标识。

## 4. 运行带工具的版本

```sh
pnpm start Asia/Tokyo
```

依次核对 `toolCalls` 中的参数、`toolResults` 中的结果和最终回答。模型返回答案时可能已经过去几秒，应对照取样时刻判断是否一致。

## 5. 检查其他输入和失败路径

```sh
pnpm start Asia/Shanghai
pnpm start Invalid/Zone
```

- 正常时区：工具确实被调用，参数与输入一致，返回 `ok: true`，回答与结果一致。
- 无效时区：模型没有擅自替换参数，工具返回 `ok: false`，回答说明失败，不编造时间。
- 没有工具记录或最终文本：本次不能认定完成查询，应检查实际执行记录。

`maxSteps: 3` 限制顺序模型调用步数，不等于三个工具或三秒超时，也不保证最终回答一定生成。示例另设置了 60 秒终止信号。

## 文件对应

| 文件 | 作用 |
| --- | --- |
| `src/config.ts` | 检查示例需要的网关密钥 |
| `src/basic.ts` | 没有工具的最小调用 |
| `src/tools/read-time.ts` | 读取系统时钟并转换时区 |
| `src/clock.ts` | 不经过模型，直接检查时间函数 |
| `src/tools/time-tool.ts` | 工具说明、输入输出结构和执行函数 |
| `src/agents/time-agent.ts` | 带工具的 Agent |
| `src/run.ts` | 运行入口和每步的实际调用记录 |

## 运行范围

`basic` 和 `start` 会发起真实模型请求并使用账户额度。它们通过 `--env-file=.env` 加载环境变量；`.env` 缺失可能在脚本启动前就报错。本项目不保存会话或跨次调用的记忆。

Mastra 支持其他供应商，本章先保持一条固定路径。切换服务时，需要同步修改两个 Agent 的 `model`、`config.ts` 的凭证检查和 `.env` 的变量名，再验证模型的工具调用行为。仅添加另一份密钥不会自动切换服务。
