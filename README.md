# Engineering Flow 官网

[Engineering Flow](https://github.com/yyqqCoding/engineering-flow-skills) 的双语产品站点。用 Astro 构建的纯静态站，介绍五个工作流、展示对照实验结果，并提供一段可交互的流程回放。

站点内容全部来自源仓库的已发布文档与测试记录，以提交快照的形式保存在本仓库，**运行时不依赖源仓库、也不调用任何 API**。

## 页面

| 路由 | 内容 |
| --- | --- |
| `/` | 语言入口页：按上次选择或浏览器语言跳转，并保留手动选择的链接 |
| `/[locale]` | 首页：Develop 生命周期与关键指标 |
| `/[locale]/workflows` | 工作流列表与衔接关系图 |
| `/[locale]/workflows/[slug]` | 单个工作流：核心思想、流程、关键机制、调用方式 |
| `/[locale]/playground` | 流程回放演示，含人工批准关卡 |
| `/[locale]/evidence` | 对照实验结果与流程成本 |
| `/[locale]/docs` 及其子页 | 完整文档：安装、快速开始、设计思想、设计原则、五个工作流详解、实验与验证、最佳实践 |

`locale` 取值为 `en` 与 `zh-CN`。两种语言使用同一套英文 slug，语言切换保持当前页面不变。

## 开发

要求 Node.js 22.12 及以上。

```bash
npm install      # 安装依赖
npm run dev      # 本地开发服务器
npm test         # 运行 test/ 下的 node:test 用例
npm run check    # Astro 与 TypeScript 诊断
npm run build    # 生成 dist/ 静态产物
npm run preview  # 预览最新构建
```

交付变更前请依次跑通 `npm test`、`npm run check` 和 `npm run build`。

## 目录结构

```
src/
  pages/[locale]/    语言化路由，slug 保持英文
  layouts/           页面外壳、主题、滚动揭示
  components/        可复用 UI（文档外壳、工作流标识、代码块等）
  data/              全部产品文案与内容快照
  lib/               与框架无关的逻辑，可直接单测
  styles/global.css  设计令牌与全局样式
test/                node:test 用例
docs/requirements/   需求记录
docs/UiImage/        UI 参考图
```

内容与呈现是分开的：`src/data/` 拥有全部文案，页面只负责结构与样式。

- `site.ts` — 界面文案、工作流定义、来源元数据
- `docs.ts` — 文档目录树与五个工作流的详解内容
- `engineering.ts` — 设计原则页
- `evidence.ts` — 验证结果页
- `playground.ts` — 演示用的固定快照

## 内容来源

当前快照对应源仓库 `yyqqCoding/engineering-flow-skills` 的 **v1.0.1**（commit `3a70929`），摘自其 `skills/*/SKILL.md`、`docs/behavior-spec.md`、`docs/product-design.md`、`docs/user-guide*.md` 与 `docs/benchmark-log.md`。

公开内容遵守两条约束：

- 不发布原始基准日志、本地路径、线程 ID、供应商与模型细节、stderr、提示词或 diff。
- 所有数字只描述上述版本，不做二次计算。

更新快照时，同步修改 `src/data/site.ts` 中的 `snapshotMeta`。

## 演示页说明

`/[locale]/playground` 是一段经过整理和脱敏的固定回放。它**不会运行智能体，也不会修改任何仓库**，所有交互只改变浏览器本地的展示状态。其中的人工批准关卡由 `src/lib/playground.mjs` 实现并有单元测试覆盖：未获批准时流程无法推进到实施步骤，自动播放到达关卡也会停下。

## 部署

`output: 'static'`，构建产物在 `dist/`，无运行时 API 与适配器，可直接部署到 Vercel 等静态托管平台。每条路由都能独立加载。

## 协作约定

分支规范、代码风格、测试要求与提交规范见 [`CLAUDE.md`](CLAUDE.md)。
