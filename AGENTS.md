# AGENTS.md — AI 协作指南

> 给 Cursor / 其它 AI 助手阅读。**修改代码前请先读本文 + `docs/ARCHITECTURE.md`。**

## 项目是什么

**时光窗口（life-windows）**：单页 React 应用，用年龄交互展示「人生一次性决策窗口」的状态（开放 / 将关 / 已关 / 未来），数据为静态 JSON（40 条 `opportunities`）。

- 路径：`D:\Code\AI\life-windows`
- 无后端、无数据库
- 中文 UI

## 快速命令

```bash
cd D:\Code\AI\life-windows
npm install
npm run dev      # http://localhost:5173
npm run build    # 产出 dist/
```

## 文档索引

| 文件 | 用途 |
|------|------|
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | **技术架构**（状态机、飘散流程、组件职责）— 改逻辑必读 |
| [docs/MVP.md](./docs/MVP.md) | 产品范围、数据契约、伦理约束 |
| [README.md](./README.md) | 人类可读简介 |

## 核心概念（极易改错）

### 1. 双年龄：`previewAge` vs `committedAge`

| 变量 | 含义 | 何时更新 |
|------|------|----------|
| `previewAge` | 滑块拖动中的预览年龄 | `onChange` / `onAgePreview` |
| `committedAge` | 卡片状态计算基准 | 松手提交后；或无需飘散时立即 |

**拖动过程中卡片仍按 `committedAge` 显示**，不要在中途用 `previewAge` 重算列表（除非产品明确要求预览）。

### 2. 年龄提交：`tryCommitAge`

在 `App.tsx` → `handleAgeCommit`（滑块 `pointerup`、数字框 `blur`/`Enter`）。

- 对比 **`committedAge`（上次）→ `newAge`（本次松手）`**
- **不是**和 0 岁比，**不是**新年龄下「所有已关」条目

### 3. 「已关飘散」：`useDissolveSequence`

开启后，仅 **新变为 `closed`** 的条目进入飘散队列。

**三阶段（必须串行，不可跳步）：**

1. 松手 → 检测 `newlyClosed`
2. `phase === 'dissolving'` → 冻结网格布局，**逐个** `SoulDissolveWrapper` 动画
3. 队列全部完成 → `phase === 'rearranging'` → `applyCommittedAge` → 再 `idle` 并重排

**快照 `frozenItems` 必须用：**

```ts
filterVisible(prevItems, onlyActionable)
```

**禁止** `filterVisible(prevItems, false)` 在已开「仅可做」时误用，否则会把历史已关卡片重新塞进网格。

### 4. 「仅可做」`onlyActionable`

- 开启后：列表隐藏已关窗口；年龄变大松手后，**仅新关闭**条目逐个碎裂隐藏

## 目录与职责

```
src/
├── App.tsx                 # 布局分叉：lg 桌面网格 / 移动纵向 Section
├── types.ts                # Category, Opportunity, WindowStatus
├── data/opportunities.ts   # 40 条内容（改文案主要改这里）
├── utils/status.ts         # getWindowStatus, withStatus, overlapsRange
├── hooks/
│   └── useDissolveSequence.ts   # 飘散状态机（最复杂）
└── components/
    ├── Controls.tsx        # 滑块；preview + commit 分离
    ├── CardCanvas.tsx      # 桌面一屏小卡片网格
    ├── CompactCard.tsx     # 小卡片
    ├── SoulDissolveWrapper.tsx  # 魂飞魄散动画
    ├── Section.tsx / OpportunityCard.tsx  # 移动端列表
    ├── DetailOverlay.tsx   # 点击卡片右侧详情
    └── AgeHero.tsx         # 年龄展示条
```

## 响应式策略

- **`lg:` 及以上**：顶栏控制 + 左栏 `AgeHero` + `CardCanvas` 网格 + `DetailOverlay`
- **`< lg`**：Header + 纵向 `Section` 分区列表（无网格）

改 UI 时注意 **两套展示** 都要测。

## 状态计算（单一真相）

逻辑在 `src/utils/status.ts` 的 `getWindowStatus(age, window)`：

```
age < best[0]     → upcoming
best[0]..best[1] → open
best[1]..still[1] → closing
age > still[1]    → closed
```

`App` / `useDissolveSequence` 应用类别筛选、区间模式、飘散过滤；**不要**在组件里重复写一套状态判断。

## 修改检查清单

- [ ] 飘散是否仍对比 `committedAge → newAge`，且队列仅 `newlyClosed`
- [ ] 飘散快照是否 `filterVisible(..., onlyActionable)` 与松手前一致
- [ ] 飘散完成前是否 `layoutFrozen`（`CardCanvas` 不 `popLayout` 重排）
- [ ] `npm run build` 无 TS 错误
- [ ] 桌面 + 移动各测一次

## 不要做的事

- 不要加「人生评分」或排行榜
- 不要在没有请求时提交 git
- 不要改 `getWindowStatus` 语义却不更新文档
- 不要在飘散中途更新 `committedAge`（应等队列清空后在 `finishSequence`）

## 版本备忘

- **v0.1**：40 条数据 + 基础年龄滑块
- **当前实现**：Tailwind v4 + Framer Motion + 桌面卡片墙 + 已关飘散三阶段序列

产品细节边界见 `docs/MVP.md`。
