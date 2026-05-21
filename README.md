# 时光窗口 · Life Windows

人生一次性决策的时间窗口地图。拖动年龄，查看开放、将关与已过的窗口；可选「已关飘散」观看错过的窗口魂飞魄散。

## 快速开始

```bash
cd D:\Code\AI\life-windows
npm install
npm run dev
```

浏览器打开 http://localhost:5173

```bash
npm run build    # 生产构建
npm run preview  # 预览 dist
```

## 文档（给人类和 AI）

| 文档 | 说明 |
|------|------|
| [**AGENTS.md**](./AGENTS.md) | **AI 助手必读**：核心概念、易错点、改代码检查清单 |
| [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) | 技术架构：状态机、飘散流程、组件职责 |
| [**docs/MVP.md**](./docs/MVP.md) | 产品范围、数据契约、伦理与里程碑 |

> 如果你是 Cursor / Copilot 等 AI：**请先读 `AGENTS.md`，改逻辑前再读 `docs/ARCHITECTURE.md`。**

## 技术栈

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 + Framer Motion + Lucide
- 静态数据，无后端

## 主要功能

- 年龄滑块 0–80（松手后生效；拖动时仅预览）
- 桌面：一屏小卡片网格，点击查看详情
- 移动：按状态分区的纵向列表
- 类别筛选、区间探索、「仅看仍可做」、「已关飘散」

## 项目结构（简）

```
src/
├── App.tsx
├── data/opportunities.ts   # 40 条窗口数据
├── hooks/useDissolveSequence.ts
├── utils/status.ts
└── components/
```

详见 [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)。
