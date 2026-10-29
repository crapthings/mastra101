# 可选 Mastra 实验项目

05「提示词」与 06「模态」正文为通用知识，不要求运行本项目。读者可使用自己熟悉的模型工具完成练习。本项目保留为可选的框架实现参考，默认模型、代码与旧旅行素材并不限定正文的方法。

通用教学素材可直接从正文下载。event-notes.txt、event-document.txt、event-notice.png、event-voice.txt 与路线演示用于 06；rule-record.txt 用于记录提示词规则的实际验证结果。以下是可选实现的使用说明。

可选的 JavaScript 实验项目，要求 Node.js >=24 和 pnpm。与 03 分开解压、运行，使用同一套 Vercel AI Gateway 凭证和模型配置。

Studio 入门先使用独立的“提示词实验助手”自由试模型和提示词，不依赖前面的项目。随后 05 切换到“出行资料助手”，使用 trip.txt 与 text-notes.txt 完成文字练习。06 继续使用同一目录中的图片、视频与教学转写稿，无需重新安装。

## 准备

进入解压后的 05-travel-lab-js 目录：

```sh
node --version
pnpm --version
pnpm install
cp .env.example .env
```

Windows 可通过文件管理器复制并重命名。编辑 .env，填写自己的 AI_GATEWAY_API_KEY。不要提交密钥。

## 打开 Studio

```sh
pnpm studio
```

终端显示服务就绪后，打开它打印的本地地址（默认 http://localhost:4111）。在 Agents 中选择“提示词实验助手”（标识 prompt-lab），先用一条会议通知试验输入。后面的系统提示词与材料核对练习再选择“出行资料助手”（标识 travel-materials）。Ctrl+C 停止服务。教程网站与本项目是不同的程序，不要在网站目录执行这些命令。

src/mastra/index.js 注册两个独立 Agent：src/mastra/agents/prompt-agent.js 用于自由实验；src/mastra/agents/travel-agent.js 用于后续资料核对。比较提示词时保持模型不变，在新会话中提交完整输入；比较模型时固定完整输入、通用指令与可比设置，仅更换主模型。Models 面板的临时调整不会自动写回源码，重启后会丢失。系统提示词一节会指导你修改此文件中的 instructions；比较系统提示词时固定用户消息，比较用户提示词时固定已选的 instructions，并保留每组配置与结果。本项目没有配置长期记忆、追踪存储或评分器，不能把界面中可见的功能当作已经接入的功能。

## 06：图像练习

在 Studio 的消息附件入口选择 materials/hotel-order.png，确认附件出现后，再附上提取要求一起发送。若所在版本没有附件入口，使用下面的等价脚本：

```sh
pnpm image
```

脚本读取真实 PNG 字节，再和问题一起发给同一个 Agent。本机路径不会自动变成模型能访问的图片。

## 06：文档理解

materials/document-excerpt.txt 是人工编写的分页教学摘录，保留标题、表格和跨页说明，不是 PDF 解析或 OCR 的真实结果。在 Studio 中发送完整摘录与核对要求，检查早餐信息的跨页依据，以及“酒店 15:00 起可办理入住”为什么不能等同于“旅客 15:00 到达”。本项目未接入 PDF 或 Word 解析服务。

## 06：文字与视频练习

materials/text-notes.txt 提供带条件句的出行说明，用来检查提取和摘要是否保留原意。

materials/route-demo.mp4 是六秒无声教学视频，由三张虚构指示画面组成，非实景拍摄。先在本地播放，再查看 materials/video-frames.png 中按 00:00、00:02、00:04 排列的对应画面。可以在 Studio 上传拼图并提出分析要求，或运行：

```sh
pnpm frames
```

src/video-frames.js 只发送画面拼图与时间说明，不上传 MP4，也不分析声音。画面顺序不能证明实际步行耗时，全程未出现台阶也不能仅凭这些画面确认。运行此命令会请求与其他练习相同的 Vercel 模型。

## 06：音频材料

materials/voice-transcript.txt 是作者编写的教学转写稿，不是实际语音识别结果。06 用它练习保留不确定语气、区分偏好和已确认事实，并与订单信息核对。本项目没有语音转写服务，也不把音频直接传给本章模型。真实录音要先通过支持的转写服务获得文字，并人工核对关键日期和人名。

## 比较方式

每组比较使用相同的材料与模型，并在新会话中提交完整输入。比较用户提示词时固定 Agent 配置；比较系统提示词时只更换 instructions，固定用户消息。纯文字结果只与同样文字材料的结果比较；加入图片或转写稿后，重新建立这组材料的基线。一次主要改变任务要求或示例中的一项，不预设改写一定更好。

## 维护规则

materials/rule-record.txt 是待填写的规则维护记录模板。保存实际输入和输出偏差，提出候选规则，再用原问题、不同情况和正常情况对照检查。记录有效范围与新的偏差后，决定保留、修改或删除。模型生成的提示词只能作为候选草稿，维护者负责审阅与验证；这份记录不需要发送给模型。

## 对照依据

- 订单：杭州、11 月 14 日入住、16 日离店、2 位成人、不含早餐。
- 车票尚未购买，不能给出已确认的车次或到达时间。
- “下午出发”和“晚一点回来”是偏好，不是已购车票。
- “好像含早”是不确定说法；与订单“不含早餐”存在差异，应指出并建议核实。

这些是材料核对依据，不是模型实际回答。Studio 对话及 image、frames 命令会产生真实模型调用费用。模型为 vercel/openai/gpt-6.1-sol，环境变量为 AI_GATEWAY_API_KEY。

参考：[Mastra Studio](https://mastra.ai/docs/studio/overview)、[模型输入能力](https://vercel.com/ai-gateway/models/gpt-6.1-sol)。
