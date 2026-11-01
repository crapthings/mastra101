# 07 智能体：活动助手

本章示例使用 Node.js 24 或更高版本，默认 JavaScript。每节有独立入口；除明确说明的本地数据与文件外，模型调用通过 Vercel AI Gateway 完成。

## 准备

在本目录执行：

```bash
pnpm install
cp .env.example .env
```

将 Vercel AI Gateway 的密钥填入 `.env` 的 `AI_GATEWAY_API_KEY`，再运行所需示例。Windows 也可以在文件管理器中复制环境模板。不要提交或分享 `.env`。

## 先完成一个任务

你准备参加阅读分享会：周六 14:00 开始，13:30 开放入场，需要提前预约，地点尚未公布。你有预约编号 R001，需要核对报名状态，整理待办，再决定是否保存准备清单。

每节可以独立运行，不必搬运上一节的代码。第一次学习按教程顺序阅读；复习时按任务选择入口：

| 阶段 | 入口 | 交付与观察 |
| --- | --- | --- |
| 核对通知 | 01—03 | 区分已知安排、未知地点、个人预约状态；比较生成预算和展示偏好 |
| 查询报名 | 04—07 | 核对请求编号、工具状态、结构化对象与流式结束状态 |
| 处理异常 | 08—10 | 缺少编号、教学注入、输出持续不合格时能明确结束 |
| 确认操作 | 11—12 | 先审批再保存；组合工具仍需核对执行依据 |
| 综合交付 | 13—14 | 保留查询记录，预览清单，确认后写入文件 |

## 综合任务：查询 → 预览 → 确认保存

配置凭证后运行：

```bash
node --env-file=.env src/14-preparation.js 正常
node --env-file=.env src/14-preparation.js 未查到
node --env-file=.env src/14-preparation.js 失败
```

每次只运行一个场景。先查看工具证据与完整清单，再查看待审批工具。先试输入“拒绝”，重新运行后再输入“确认”。只有“确认”允许写入或覆盖 `preparation-draft.md`。清单由 `preparation.js` 根据实际查询返回值与固定教学通知生成，模型不能修改已展示的待保存内容。输入缺少有效查询或发生重复查询时不继续保存。

这个入口会创建 `preparation.db`，用于同一进程的审批暂停与恢复。模型负责选择查询工具和申请保存，实际运行可能失败或没有进入预期暂停；这种情况应检查记录，不能自动宣称完成。草稿文件不发送通知，也不创建预约。

| 场景 | 清单应保留什么 | 不应出现什么 |
| --- | --- | --- |
| 正常 | R001、已预约、教学来源、地点待确认 | 已创建预约、已发送提醒、编造的地点 |
| 未查到 | 未查到、核对编号与报名状态的待办 | 断言未预约或已预约 |
| 失败 | 查询失败、状态未确认、稍后重试 | 把查询失败改成未预约 |
| 拒绝保存 | 本次没有保存工具执行 | 仅凭旧文件存在宣称本次保存成功 |
| 确认保存 | 保存工具结果与文件内容对应预览 | 仅凭审批通过宣称文件写入成功 |

模型回答、工具执行、审批决定和文件写入分别核对。即使模型没有最终文字，也要查看工具记录；拒绝不会删除以前的文件。每节正文另有“输入、观察、完成标准”供逐项验收。

## 逐节运行

```bash
node --env-file=.env src/01-responsibility.js
node --env-file=.env src/02-model-settings.js 400
node --env-file=.env src/03-context.js 详细
node --env-file=.env src/04-tools.js 正常 auto
node --env-file=.env src/05-control.js 1
node --env-file=.env src/05-control.js 2
node --env-file=.env src/05-control.js 3
node --env-file=.env src/05-control.js 3 查完即停
node --env-file=.env src/06-structured.js 未查到
node --env-file=.env src/07-stream.js 失败
node --env-file=.env src/08-processors.js 缺少编号
node --env-file=.env src/09-guardrails.js 注入
node --env-file=.env src/10-recovery.js 强制拦截
node --env-file=.env src/11-approval.js
node --env-file=.env src/12-code-mode.js
node --env-file=.env src/13-review.js 正常
```

02 接收 64—1200 的输出 Token 预算，默认 400。04、06、07、13 的查询场景支持“正常”“未查到”“失败”，默认“正常”；04 还接受第二个参数 auto 或 none 控制工具选择。03 支持“简短”“详细”。

08 的“缺少编号”用于观察确定性输入拦截。09 的“注入”提供教学注入语句；检测器本身会调用模型，识别结果仍需核对，不保证必然拦截。

05 的步数范围为 1—3，默认 3；可选“查完即停”用于观察已有工具结果但可能没有最终文字的状态。10 的“强制拦截”让输出检查持续失败，观察有上限的处理器重试；该教学入口关闭默认错误处理器，保留显式模型重试与输出反馈重试。

`reservation.js` 提供共享的本地教学查询。它不访问真实报名系统，不创建或修改预约。

11 会在本目录创建 `approval.db` 保存暂停状态。输入“确认”后才写入或覆盖 `reminder-draft.json`；其他输入拒绝。该文件只是本地草稿，不发送通知，不创建真实提醒。示例演示同一进程中的批准或拒绝；数据库存在不等于已经提供了跨进程恢复界面。

12 使用 QuickJS 的 WebAssembly 执行环境，不使用 LocalSandbox，不需要安装原生 isolated-vm。模型生成的编排代码只桥接两个只读教学工具；工具仍由宿主程序执行。

## 版本与检查范围

依赖版本固定，锁文件随示例提供。Node.js 24 可以运行本项目使用的 JavaScript，以及只使用可擦除类型语法的 TypeScript；本章两种版本的执行逻辑相同。

示例用于观察模型请求、工具结果与最终交付物，不保证每次模型回答相同。数据和期望值是教学设定，不是预先记录的真实模型响应。运行大多数入口会调用模型并产生相应费用。
