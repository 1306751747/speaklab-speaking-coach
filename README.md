# SpeakLab 产品说明文档

SpeakLab 是一款面向中文学习者的 AI 英语口语练习工具。产品目标不是简单做一个打分器，而是帮助用户在低压力、可持续的练习环境中开口表达、获得反馈、积累表达资产，并逐步提升真实场景下的英语沟通能力。

项目当前包含一个 warm clay / cartoon clay 风格的互动首页，以及一个中文界面的英语口语练习工作台。首页负责营造温暖的语言花园入口，练习页负责承接口语训练、自由对话、AI 反馈和课后复盘。

## 一、产品定位

**产品名称：** SpeakLab AI English Speaking Coach

**目标用户：**

- 想提升英语口语但不敢开口的中文学习者
- 需要练习面试、会议、点餐、旅行等真实场景表达的用户
- 希望通过 AI 获得温柔纠错、表达改写和持续复盘的学习者

**核心价值：**

- 降低开口压力
- 提供明确练习任务
- 支持自由英语聊天
- 给出可执行的语法和表达反馈
- 将一次练习沉淀为可复习的表达资产

## 二、核心功能

### 1. 互动首页

首页采用温暖粘土黄色、手工橡皮泥质感和小花小草装饰，营造“语言花园入口”的感觉。

主要交互：

- 白色英文单词在页面中缓慢浮动
- 鼠标跟随的 iOS 风格玻璃圆圈
- 单词进入圆圈后自然溶解
- 中心玻璃卡片 `Start Communicating`
- 点击后平滑进入口语练习工作台

### 2. 口语练习工作台

练习页重构为清晰的工作台结构：

- 顶部：欢迎语、今日任务、今日肯定语、练习次数和最近完成度
- 左侧：练习模式和场景选择
- 右侧：主练习区、输入/语音入口、实时反馈和课后总结

页面保持 warm clay / soft glass / claymorphism 风格，与首页属于同一套视觉系统。

### 3. 场景练习

当前支持多类常用口语练习场景。

基础生活类：

- 日常聊天
- 自我介绍
- 问路
- 购物
- 餐厅点餐
- 酒店入住
- 机场出行
- 看病就医

学习工作类：

- 面试
- 会议
- 汇报
- 课堂讨论
- 邮件沟通
- 项目沟通
- 学术交流

社交表达类：

- 交朋友
- 兴趣爱好
- 情绪表达
- 表达观点
- 讲述经历
- 计划安排

旅行应急类：

- 旅行
- 交通
- 紧急求助
- 投诉沟通
- 客服

每个场景都包含：

- 中文场景标题
- 练习目标
- 今日任务
- 必说 3 点
- 可用英文句型
- 场景关键词评分兜底
- 对应教练追问

### 4. 自由对话模式

除了固定场景练习，SpeakLab 还提供“自由对话”模式。

自由对话特点：

- 不需要选择固定场景
- 用户可以随便输入任何想聊的话题
- AI 用简短自然的英文接话
- AI 会适当追问，帮助用户继续表达
- 反馈更偏向自然度、流利度、语法和表达清晰度
- 不会像作文批改一样频繁打断用户

自由对话示例：

```text
用户：I am tired today.

AI：
I'm sorry to hear that. Maybe you had a long day.
What made you feel tired today?

中文提示：
你可以试着说说今天发生了什么。
```

### 5. 中文表达脚手架

用户可以先输入中文想法，例如：

```text
我想说自己负责了项目排期，也解决了一个沟通问题。
```

系统会生成三种英文表达：

- 简单版
- 自然版
- 正式版

用户可以一键将其中一句放入回答输入框，再进行口语练习。

这个功能主要解决中文学习者“有想法但不知道怎么组织英文”的痛点。

### 6. 实时反馈与温柔纠错

用户提交英文回答后，系统会先给出本地规则反馈，再尝试请求 AI 生成结构化反馈。

反馈内容包括：

- 综合分
- 流利度
- 语法
- 语境 / 自然度
- 表达清晰度
- 温柔纠错
- 推荐改写
- 下一句教练追问
- 课后总结

温柔纠错结构：

```text
你已经表达清楚了。

原句：I am agree with this idea.
建议：I agree with this idea.
原因：agree 本身是动词，不需要 am。
```

### 7. 表达资产库

每次练习后，系统会把有价值的表达沉淀到表达资产库中。

当前支持保存：

- 推荐改写
- 常错表达
- 高分句型

表达资产使用浏览器 `localStorage` 保存，便于用户复习和后续练习。

## 三、AI 接入说明

SpeakLab 通过服务端 API Route 接入 AI，不会把 API Key 暴露给浏览器。

当前 AI 相关接口：

- `/api/feedback`：生成评分、温柔纠错、推荐改写、下一句追问和课后总结
- `/api/scaffold`：根据中文想法生成简单版、自然版、正式版英文表达

创建 `.env.local`：

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

说明：

- `OPENAI_API_KEY` 是服务端环境变量，不应提交到 GitHub
- `OPENAI_MODEL` 可选，默认使用 `gpt-4o-mini`
- 如果没有配置 API Key，项目仍可运行，会使用本地规则反馈和本地表达模板兜底

## 四、技术栈

- Next.js 14
- React 18
- Framer Motion
- CSS clay texture / glassmorphism / claymorphism
- Browser Web Speech API
- OpenAI-compatible Responses API
- localStorage 本地表达资产存储

依赖详见：

```text
package.json
```

## 五、本地运行

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm run dev
```

打开页面：

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

麦克风功能建议使用 Chrome 或 Edge，并允许浏览器麦克风权限。

## 六、项目结构

```text
src/app/page.jsx                  主页面、首页交互、口语练习工作台
src/app/globals.css               全局样式、粘土视觉、响应式布局
src/app/api/feedback/route.js     AI 口语反馈接口
src/app/api/scaffold/route.js     中文表达脚手架接口
public/assets/clay-plasticine-bg.png  粘土背景纹理
docs/competitive-analysis.md      竞品分析报告
docs/demo-script.md               Demo 讲解脚本
docs/review-submission-checklist.md 评审提交检查清单
```

## 七、演示建议

推荐 Demo 流程：

1. 打开首页，展示 warm clay 语言花园氛围
2. 移动鼠标，展示玻璃圆圈溶解英文单词
3. 点击 `Start Communicating` 进入练习工作台
4. 展示顶部今日任务和左侧模式选择
5. 选择一个场景，例如“面试”或“旅行”
6. 展示必说点和可用句型
7. 输入英文回答或点击麦克风练习
8. 展示实时反馈、温柔纠错和课后总结
9. 切换到“自由对话”，展示 AI 自然接话
10. 展示中文表达脚手架和表达资产库

## 八、Demo 视频

请在上传公开视频后，将链接补充到这里：

```text
Demo 视频：待补充
```

建议上传到 bilibili、网盘或其他评委可访问的平台。

## 九、原创与依赖说明

本项目中的互动首页、口语练习工作台、场景练习、自由对话、温柔纠错、中文脚手架和表达资产库均为本仓库实现。

第三方依赖已在 `package.json` 中列明。

Browser Web Speech API 是浏览器运行时能力，不属于打包依赖。

如果后续更换 AI 模型、增加语音评测 API 或流式语音对话服务，需要在 README 和 PR 描述中继续补充：

- 服务商
- 模型名称
- SDK 或 API
- 成本与隐私说明
- 原创功能边界

## 十、相关文档

- [AI 英语口语训练竞品分析报告](docs/competitive-analysis.md)
- [Demo 讲解脚本](docs/demo-script.md)
- [评审提交检查清单](docs/review-submission-checklist.md)
