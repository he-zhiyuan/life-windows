# 时光窗口 · MVP 产品文档

> 版本：v0.2 | 更新：2026-05-21  
> 技术实现详见 [ARCHITECTURE.md](./ARCHITECTURE.md)，AI 协作见 [../AGENTS.md](../AGENTS.md)

## 1. 产品概述

### 1.1 一句话

**时光窗口** 是一张可交互的「人生一次性决策地图」：用户拖动年龄或选择区间，查看当前开放、即将关闭、已经错过的人生窗口，以及每条窗口的补救路径。

### 1.2 要解决的问题

- 很多人生选择**窗口只开一次**，但信息分散、事后才意识到。
- 用户需要的不只是「错过了什么」，而是 **「现在还能做什么」** 和 **「错过之后怎么走」**。

### 1.3 不做什么（MVP 边界）

| 不做 | 原因 |
|------|------|
| 用户账号 / 登录 | 验证核心价值优先 |
| 人生评分 / 排行榜 | 避免焦虑工具化 |
| AI 个性化建议 | 内容与交互先跑通 |
| 社区投稿 | 需审核机制，放 V2 |
| 多语言 | MVP 仅中文 |

---

## 2. 目标用户

| 用户 | 场景 |
|------|------|
| 18–25 岁 | 升学、选城市、第一份工作前的窗口预览 |
| 26–40 岁 | 对照「已关闭 / 仍可期」，减少无效焦虑 |
| 家长 / 教育者 | 用年龄区间模式讨论「如何帮孩子保留选项」 |

---

## 3. MVP 功能范围

### 3.1 必须有（P0）

1. **年龄滑块**（0–80 岁）+ 数字输入（**松手后提交**，拖动时仅预览）
2. **状态展示**（相对**已提交年龄** `committedAge`）
   - 当前开放 / 即将关闭 / 即将到来 / 已基本关闭
3. **类别筛选**（语言、教育、地域、健康、职业、关系、财务）
4. **「仅看仍可做」**：立即隐藏已关闭项（无动画）
5. **「已关飘散」**：仅**相较上次年龄新关闭**的窗口，逐个魂飞魄散后重排
6. **机会卡片**：标题、说明、补救路径；桌面为小卡片网格 + 详情抽屉
7. **页脚免责声明**

### 3.2 应该有（P1，已实现）

- 年龄区间探索模式（双端滑块）
- 本地存储上次年龄（`localStorage`：`life-windows-age`）
- 响应式：桌面卡片墙 + 移动纵向分区
- Tailwind + Framer Motion 动效

### 3.3 后续版本（P2+）

- 出生年份 → 年代标签
- 地域 / 路径切换（高考路线 vs 国际教育）
- 条目详情页（SEO）
- CMS 内容管理
- 专家审阅敏感条目（生育、健康）

---

## 4. 核心交互

### 4.0 年龄与飘散（实现要点）

```
拖动滑块 → 只更新 previewAge（Hero/数字）
松手 pointerup → handleAgeCommit(newAge)
        ↓
对比 committedAge（旧） vs newAge（新）
        ↓
新变为 closed 的条目 → 进入飘散队列（不是新年龄下全部已关）
        ↓
phase: dissolving → 逐个 SoulDissolve → rearranging → 更新 committedAge
```

详见 [ARCHITECTURE.md §3–§4](./ARCHITECTURE.md)。

### 4.1 静态浏览

```
已提交年龄 N
        ↓
对每条机会计算状态（getWindowStatus）
  - upcoming / open / closing / closed
        ↓
筛选 + 展示（桌面网格 / 移动分区）
```

### 4.1 窗口模型（数据契约）

每条「一次性机会」包含：

```typescript
interface Opportunity {
  id: string;
  title: string;
  category: Category;
  importance: 'critical' | 'high' | 'medium';
  description: string;
  window: {
    best: [number, number];   // 最佳窗口
    still: [number, number];  // 仍可期（含 best）
    closedAfter: number;      // 此年龄后基本关闭
  };
  alternatives: string[];     // 补救 / 替代路径
  note?: string;              // 个体差异说明
}
```

**状态判定规则：**

| 状态 | 条件 |
|------|------|
| upcoming | age < window.best[0] |
| open | window.best[0] ≤ age ≤ window.best[1] |
| closing | window.best[1] < age ≤ window.still[1] |
| closed | age > window.still[1]（或 age > closedAfter） |

### 4.2 情绪与伦理

- 文案避免「你的人生已经…」式审判
- 每条 closed 项**必须**展示 `alternatives`
- 敏感项（生育、语言关键期）附带 `note` 说明个体差异
- 固定免责声明：内容为经验区间，非医疗 / 法律 / 人生建议

---

## 5. 内容规划（MVP 数据集）

MVP 内置 **40 条** 机会，覆盖人生阶段：

| 阶段 | 年龄 | 条数（约） |
|------|------|-----------|
| 婴幼儿 | 0–6 | 6 |
| 儿童青少年 | 7–18 | 10 |
| 青年 | 19–30 | 12 |
| 中年 | 31–50 | 8 |
| 中老年 | 51+ | 4 |

类别分布：教育、语言、地域、健康、职业、关系、财务。

内容来源：常识性人生阶段 + 公开统计区间（如生育年龄），**非**个性化诊断。

---

## 6. 信息架构

### 桌面（lg+）

```
顶栏：标题 + Controls（年龄提交、筛选、飘散开关）
主体：AgeHero | CardCanvas（小卡片网格）→ DetailOverlay
```

### 移动（< lg）

```
Header → Controls → 按状态 Section 列表 → Footer
```

---

## 7. 技术方案

| 项 | 选型 |
|----|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 6 |
| 样式 | Tailwind CSS v4 |
| 动画 | Framer Motion |
| 数据 | `src/data/opportunities.ts` |
| 核心 Hook | `src/hooks/useDissolveSequence.ts` |

完整目录与数据流见 [ARCHITECTURE.md](./ARCHITECTURE.md)。

---

## 8. 视觉规范（简洁）

- 背景：浅灰白 `#f8f9fa`
- 主色：深灰文字 `#1a1a1a`，强调 `#2563eb`
- 状态色：开放 `#16a34a`、将关 `#d97706`、已关 `#9ca3af`、未来 `#64748b`
- 字体：系统栈 `-apple-system, "Segoe UI", "PingFang SC", sans-serif`
- 卡片：白底、细边框、小圆角、轻阴影
- 最大宽度：720px 居中

---

## 9. 验收标准

- [x] `npm install && npm run dev` 可启动，无 TS 错误
- [x] 拖动仅预览，松手后卡片状态才提交
- [x] 「已关飘散」仅新关闭条目，数量与提示一致
- [x] 飘散：全部消失后才重排
- [x] 切换类别筛选正确
- [x] 「仅看仍可做」与「已关飘散」互斥
- [x] 区间模式正常工作
- [x] 桌面网格 + 移动列表
- [x] localStorage 记住年龄

---

## 10. 里程碑

| 阶段 | 内容 | 时间 |
|------|------|------|
| **MVP v0.1** | 40 条数据 + 基础交互 | 已完成 |
| **v0.2**（当前） | 桌面卡片墙 + 飘散三阶段 + 双年龄提交 | 已完成 |
| v0.2 | 详情页、分享卡片 | +3 天 |
| v0.3 | CMS + 专家审阅流程 | +2 周 |
| v1.0 | 地域路径、用户故事 | +1 月 |

---

## 11. 风险与对策

| 风险 | 对策 |
|------|------|
| 被理解为「人生判决书」 | 强调补救路径；不做评分 |
| 敏感内容争议 | note + 免责；V2 专家审阅 |
| 数据不准确 | 标注「经验区间」；欢迎反馈纠错 |
| 焦虑传播 | 默认展示开放项；「仅看仍可做」 |

---

## 12. 本地运行

```bash
cd D:\Code\AI\life-windows
npm install
npm run dev
```

浏览器打开终端提示的本地地址（默认 http://localhost:5173）。

---

## 附录：40 条机会清单（索引）

见 `src/data/opportunities.ts`，按 id `op-001` … `op-040` 维护。
