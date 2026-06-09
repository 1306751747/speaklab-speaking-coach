# SpeakLab AI 英语口语练习工具

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-E8B85B?style=for-the-badge&labelColor=6B4B34)
![React](https://img.shields.io/badge/React-18.3.1-F3D49A?style=for-the-badge&labelColor=7A5637)
![AI Feedback](https://img.shields.io/badge/AI%20Feedback-OpenAI%20Responses-C99B5C?style=for-the-badge&labelColor=6B4B34)
![Style](https://img.shields.io/badge/Visual-Warm%20Clay%20Garden-D9A441?style=for-the-badge&labelColor=7A5637)

SpeakLab 是一款面向中文学习者的 AI 英语口语练习工具。它不是单纯的口语打分器，而是一个“低压力开口练习 + 场景任务 + AI 反馈 + 课后复盘 + 表达资产沉淀”的英语口语训练工作台。

# 🎬 我的 Demo 视频（哔哩哔哩）：https://b23.tv/soiu6eB

# 🌐 在线体验（公网地址）
# https://speaklab-speaking-coach.netlify.app

项目包含两个核心体验：

- 互动首页：温暖粘土语言花园，白色英文单词在页面中漂浮，鼠标玻璃圆圈会让单词自然溶解。
- 口语练习页：中文界面的练习工作台，支持场景练习、自由对话、语音输入、表达脚手架、实时反馈和课后总结。

## 产品亮点

| 亮点 | 说明 | 解决的问题 |
| --- | --- | --- |
| 温暖粘土视觉系统 | 首页和练习页统一使用 warm clay / soft glass / claymorphism 风格 | 避免传统学习工具的压力感，让用户更愿意开口 |
| 场景任务化练习 | 面试、会议、点餐、旅行、校园、客服、社交等多类场景 | 用户知道要练什么，也知道怎么开始说 |
| 自由对话模式 | 用户可以不选固定任务，直接和 AI 用英语聊天 | 提供更高自由度，适合日常表达训练 |
| 中文表达脚手架 | 用户先输入中文想法，系统生成简单版、自然版、正式版英文 | 解决中文学习者“有想法但不会组织英文”的痛点 |
| 温柔纠错 | 先肯定表达，再指出一个关键问题，最后给推荐表达 | 降低被批评感，适合初中级学习者持续练习 |
| 课后总结与表达资产 | 保存推荐改写、常错表达和高分句型 | 让一次对话沉淀为可复习的长期价值 |

## 功能总览

### 1. 互动首页

- warm clay yellow 手工粘土背景
- 小花、小草、小叶子点缀
- 英文单词随机出现、慢速漂浮、自然淡出
- 鼠标跟随的 iOS 风格玻璃圆圈
- 单词进入圆圈后自然溶解
- 点击 `Start Communicating` 平滑进入口语练习工作台

### 2. 口语练习工作台

- 顶部欢迎区：今日任务、今日肯定语、练习次数、最近完成度
- 左侧选择区：练习模式、自由对话、场景分类
- 右侧主练习区：任务说明、必说点、可用句型、输入框、麦克风入口、实时反馈
- 页面可滚动，适配桌面和移动端视口

### 3. 场景练习

当前覆盖多类常用口语场景：

| 分类 | 场景 |
| --- | --- |
| 基础生活 | 日常聊天、自我介绍、问路、购物、餐厅点餐、酒店入住、机场出行、看病就医 |
| 学习工作 | 面试、会议、汇报、课堂讨论、邮件沟通、项目沟通、学术交流 |
| 社交表达 | 交朋友、兴趣爱好、情绪表达、表达观点、讲述经历、计划安排 |
| 旅行应急 | 旅行、交通、紧急求助、投诉沟通、客服 |

每个场景包含：

- 中文场景标题
- 练习目标
- 今日任务
- 必说 3 点
- 可用英文句型
- 场景关键词评分兜底
- 教练追问

### 4. 自由对话模式

自由对话不要求用户选择固定场景。用户可以随便输入想聊的话题，AI 会用简短自然的英文继续对话，并适当追问。

示例：

```text
用户：I am tired today.

AI：
I'm sorry to hear that. Maybe you had a long day.
What made you feel tired today?

中文提示：
你可以试着说说今天发生了什么。
```

### 5. AI 反馈与表达脚手架

项目提供两个服务端 API Route：

| API | 用途 |
| --- | --- |
| `/api/feedback` | 根据用户英文回答生成评分、温柔纠错、推荐改写、下一句追问和课后总结 |
| `/api/scaffold` | 根据用户中文想法生成简单版、自然版、正式版英文表达 |

如果没有配置 API Key，页面仍然可以运行，前端会使用本地规则反馈和本地表达模板兜底。配置 API Key 后，可以获得更完整的 AI 反馈。

## 本地运行方式

### 环境要求

- Node.js 18.17 或更高版本
- npm
- Chrome 或 Edge 浏览器，语音识别功能需要浏览器麦克风权限

### 1. 克隆项目

```bash
git clone https://github.com/1306751747/speaklab-speaking-coach.git
cd speaklab-speaking-coach
```

### 2. 安装依赖

```bash
npm install
```

### 3. 不接入 AI 的运行方式

如果只是预览页面、体验首页、场景切换、输入练习、语音识别和本地规则反馈，可以直接启动：

```bash
npm run dev
```

打开：

```text
http://localhost:3000
```

如果 3000 端口被占用，可以指定其他端口：

```bash
npm run dev -- -p 3010
```

然后打开：

```text
http://127.0.0.1:3010
```

### 4. 接入 AI 后的运行方式

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

Windows PowerShell 可以使用：

```powershell
Copy-Item .env.example .env.local
```

在 `.env.local` 中填写：

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

说明：

- `OPENAI_API_KEY` 只在服务端 API Route 中读取，不会暴露给浏览器。
- `OPENAI_MODEL` 可选，默认使用 `gpt-4o-mini`。
- 修改 `.env.local` 后需要重启开发服务。
- `.env.local` 不应提交到 GitHub。

启动项目：

```bash
npm run dev
```

打开页面后，进入口语练习页，提交英文回答或使用中文表达脚手架时，系统会优先请求 AI 接口；如果接口失败，会退回本地兜底反馈。

### 5. 生产构建

```bash
npm run build
npm run start
```

构建通过后，打开：

```text
http://localhost:3000
```

## API 使用说明

### `/api/feedback`

用于生成口语练习反馈。前端会在用户提交英文回答时调用。

请求体核心字段：

```json
{
  "answer": "I handled the project timeline and solved a communication problem.",
  "scenario": {
    "label": "面试",
    "title": "面试练习",
    "prompt": "请试着用英语说说你最近的进步和变化。",
    "goal": "练习清晰表达经历和成果。"
  },
  "localAnalysis": {
    "overall": 76
  }
}
```

返回内容包括：

- 综合分
- 流利度
- 语法
- 场景相关度
- 发音占位评分
- 温柔纠错
- 推荐改写
- 下一句追问
- 课后总结

### `/api/scaffold`

用于把中文想法转换为可开口练习的英文表达。

请求体核心字段：

```json
{
  "idea": "我想说自己负责了项目排期，也解决了一个沟通问题。",
  "scenario": {
    "label": "会议",
    "title": "会议练习",
    "prompt": "请用英语做一次简短进度汇报。",
    "goal": "练习清楚说明进展、问题和下一步。"
  }
}
```

返回内容包括：

- `simple`：简单版
- `natural`：自然版
- `formal`：正式版
- `practiceTip`：中文开口提示

## 项目结构

```text
src/app/page.jsx                      主页面、互动首页、口语练习工作台
src/app/globals.css                   全局样式、粘土视觉、响应式布局
src/app/api/feedback/route.js         AI 口语反馈接口
src/app/api/scaffold/route.js         中文表达脚手架接口
public/assets/clay-plasticine-bg.png  粘土背景纹理
docs/competitive-analysis.md          竞品分析报告
docs/PRD-SpeakLab.md                  产品需求文档 PRD
.env.example                          AI 环境变量示例
```

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 框架 | Next.js 14 |
| UI | React 18 |
| 动效 | Framer Motion |
| 语音输入 | Browser Web Speech API |
| AI 接口 | OpenAI-compatible Responses API |
| 本地存储 | localStorage |
| 视觉风格 | warm clay、soft glass、claymorphism |

## 评审演示建议

推荐按下面顺序演示：

1. 打开首页，展示 warm clay 语言花园氛围。
2. 移动鼠标，展示玻璃圆圈溶解英文单词。
3. 点击 `Start Communicating` 进入练习工作台。
4. 展示顶部今日任务和左侧模式选择。
5. 选择“面试”“旅行”等场景，展示必说点和可用句型。
6. 输入英文回答或点击麦克风练习。
7. 展示实时反馈、温柔纠错和课后总结。
8. 切换到“自由对话”，展示 AI 自然接话。
9. 输入中文想法，展示中文表达脚手架。
10. 展示表达资产库中的推荐改写、常错表达和高分句型。

## Demo 视频

请在上传公开视频后，将链接补充到这里：

```text
Demo 视频：待补充
```

建议上传到 bilibili、网盘或其他评委可访问的平台，并确保链接可以公开访问。

## 原创与依赖说明

本项目中的互动首页、口语练习工作台、场景练习、自由对话、温柔纠错、中文表达脚手架和表达资产库均为本仓库实现。

第三方依赖已在 `package.json` 中列明。

Browser Web Speech API 是浏览器运行时能力，不属于打包依赖。

如果后续更换 AI 模型、增加独立语音评测 API 或流式语音对话服务，需要继续在 README 和 PR 描述中补充：

- 服务商
- 模型名称
- SDK 或 API
- 成本与隐私说明
- 原创功能边界

## 相关文档

- [AI 英语口语训练竞品分析报告](docs/competitive-analysis.md)
- [SpeakLab 产品需求文档 PRD](docs/PRD-SpeakLab.md)
