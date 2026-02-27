# 认知能力训练平台综合详细文档（GLM5 + GPT）

> 文档版本: 1.0  
> 生成日期: 2026-02-27  
> 汇总范围: `glm5` + `gpt`  
> 存放位置: `gpt/汇总/GLM5_GPT_综合详细文档.md`  
> 编码要求: UTF-8（无 BOM，延续现有文档编码风格）

---

## 1. 汇总目标与来源

本文件用于将 `glm5` 与 `gpt` 两套文档体系合并为一份可直接使用的“总规范 + 总目录 + 总口径”文档，覆盖：

1. 平台总体架构与模块全景。
2. 理论体系与参考文献主线。
3. 模块文档写作规范（模板、评分、数据、状态）。
4. 全量模块清单（共享核心 + 扩展模块）。
5. 差异项与统一建议（编号冲突、命名冲突、结构冲突）。

主要来源文件：

| 来源目录 | 关键文件 |
|---|---|
| `glm5` | `INDEX.md`、`TEMPLATE.md`、`APPENDIX.md`、`APPENDIX_ENUMS.md`、`GAMES_SUMMARY.md`、`modules/*/*.md`、`theory/REFERENCE_LIBRARY.md` |
| `gpt` | `INDEX.md`、`TEMPLATE.md`、`APPENDIX_ENUMS.md`、`GAMES_SUMMARY.md`、`game_test_summary.md`、`modules/*/*.md`、`theory/*.md`、`theory/REFERENCE_LIBRARY.md` |

---

## 2. 平台统一概况

### 2.1 产品定位

认知能力训练平台是以认知心理学与神经科学范式为基础的任务化训练系统，覆盖注意力、工作记忆、执行功能、决策、概率偏误、规划、创造力、社会认知等方向，并提供测试工具与训练报告。

### 2.2 技术栈（来自 `glm5/INDEX.md`）

| 技术层 | 说明 |
|---|---|
| 前端 | HTML5 / CSS3 / JavaScript (ES6+) |
| 可视化 | D3.js v7（复杂可视化） |
| 本地存储 | LocalStorage |
| 桌面支持 | Electron（可选） |

### 2.3 模块规模（合并后）

| 口径 | 数量 | 说明 |
|---|---|---|
| 共享核心模块 | 35 | `glm5` 与 `gpt` 均覆盖 |
| `glm5` 扩展模块 | 5 | 仅 `glm5` 存在 |
| 合并总模块 | 40 | 去重后总量 |
| 主要认知系统 | 10 | 注意力至社会认知 |
| 工具/辅助系统 | 2 | 工具（Tools）+ 辅助评估（Auxiliary） |

---

## 3. 文档体系整合

### 3.1 两套模板定位

| 模板 | 定位 | 优点 | 局限 |
|---|---|---|---|
| `glm5/TEMPLATE.md` | 完整叙述模板 | 理论、规则、参数、评分、数据、技术、训练建议完整 | 填写成本较高 |
| `gpt/TEMPLATE.md` | 讨论版快速模板 | 结构轻、便于快速迭代 | 深度不足，需后续补充 |

### 3.2 推荐统一模板（合并结论）

建议采用“`glm5` 深度结构 + `gpt` 实现线索”的统一模板，保留以下必填块：

1. 元信息（文档编号、系统、页面、脚本、状态）。
2. 训练目的与能力标签。
3. 理论出处与关键文献。
4. 玩法流程与关键规则。
5. 参数总览（默认值、范围、生效时机）。
6. 评分体系（L1/L2/L3，先字段后阈值）。
7. 数据记录（会话级 + 题目级 + 无效会话规则）。
8. 技术实现线索（函数、关键常量、异常分支）。
9. 训练建议与禁忌。
10. 版本日志与参考文献。

### 3.3 状态与成熟度统一口径

来自 `APPENDIX_ENUMS.md`（两套一致）：

| 类别 | 值 |
|---|---|
| 文档状态 | `draft` / `review` / `stable` |
| 任务成熟度 | `active` / `beta` / `planned` |
| 指标层级 | `L1` 原始指标 / `L2` 会话指标 / `L3` 趋势指标 |
| 评级标签 | `S` / `A` / `B` / `C` / `D` |

---

## 4. 理论体系整合（`gpt/theory` + 参考库）

| 理论文件 | 适用系统 | 核心观点（合并摘要） | 代表文献 |
|---|---|---|---|
| `theory/attention-theory.md` | 注意力系统 | 目标选择、干扰抑制、持续警觉构成核心 | Posner & Petersen (1990), Treisman & Gelade (1980) |
| `theory/working-memory-theory.md` | 工作记忆系统 | 保持与更新受容量和干扰控制限制 | Baddeley & Hitch (1974), Cowan (2001) |
| `theory/fluid-intelligence-theory.md` | 推理系统 | 在新情境中归纳规则，不依赖先验知识 | Raven (1938), Carpenter et al. (1990) |
| `theory/spatial-cognition-theory.md` | 空间认知系统 | 心理旋转与空间变换能力与视空间记忆耦合 | Shepard & Metzler (1971), Vandenberg & Kuse (1978) |
| `theory/executive-function-theory.md` | 执行功能系统 | 抑制、切换、更新、监控构成执行核心 | Miyake et al. (2000), Diamond (2013) |
| `theory/decision-theory.md` | 决策与风险 | 决策由收益函数、风险偏好、学习策略共同决定 | Kahneman & Tversky (1979), Bechara et al. (1994) |
| `theory/probability-theory.md` | 概率与偏误 | 启发式偏差普遍存在，训练目标是校正偏误 | Tversky & Kahneman (1974), Gigerenzer & Hoffrage (1995) |
| `theory/problem-solving-theory.md` | 规划与求解 | 依赖状态空间搜索、子目标分解、约束维护 | Newell & Simon (1972), Shallice (1982) |
| `theory/creativity-theory.md` | 创造力系统 | 发散生成与聚合整合需分层评估 | Guilford (1967), Mednick (1962) |
| `theory/social-cognition-theory.md` | 社会认知与元认知 | 他人心理推断 + 置信度校准共同构成核心 | Baron-Cohen et al. (1985), Lichtenstein et al. (1982) |
| `theory/cognitive-theory.md` | 工具与反馈 | 工具模块用于可用性与反馈闭环，不直接定义认知成绩 | Nielsen (1994), Locke & Latham (2002) |

说明：

1. `glm5/theory/REFERENCE_LIBRARY.md` 与 `gpt/theory/REFERENCE_LIBRARY.md` 高度重叠，`gpt` 版本新增了 `Koriat (2012)`、`Simmonds et al. (2008)` 等条目，建议以 `gpt` 版本为主并吸收 `glm5` 重复项的命名一致性。
2. 理论文件当前多为 `draft`，后续需补 DOI、证据等级与争议说明。

---

## 5. 指标、参数与数据口径整合

### 5.1 通用参数类型

来自 `glm5/APPENDIX.md`：

| 类型 | 示例 |
|---|---|
| `INT` | `gridSize`, `totalRounds`, `nLevel` |
| `FLOAT` | `speed` |
| `BOOL` | 高级模式开关 |
| `ENUM` | `difficulty`, `mode` |
| `ARRAY` | 刺激序列、回合数据 |

### 5.2 通用核心指标

| 指标ID | 含义 | 方向 |
|---|---|---|
| `accuracy` | 正确率 | ↑ |
| `reactionTime` | 反应时 | ↓ |
| `completionTime` | 完成时长 | ↓ |
| `errorCount` | 错误数 | ↓ |
| `score` | 综合得分 | ↑ |
| `memorySpan` | 广度/跨度类能力 | ↑ |

### 5.3 存储键规范

| 结构 | 例子 |
|---|---|
| 偏好 | `[module]_preferences` |
| 记录 | `[module]_records` |
| 统计 | `[module]_stats` |
| 全局 | `lastVisit`, `visitCount`, `totalTrainingTime` |

推荐统一记录结构：

```javascript
{
  "module_records": [
    {
      "timestamp": 1709012345678,
      "parameters": {},
      "metrics": {},
      "status": "completed"
    }
  ]
}
```

---

## 6. 全量模块清单（合并后 40 项）

### 6.1 共享核心模块（35 项，`glm5` + `gpt` 均存在）

#### A. 注意力系统（ATT，5）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| ATT-01 | 舒尔特方格 | 专注稳定性/视觉搜索 | `schulte.html` |
| ATT-02 | Flanker 专注 | 选择性注意 | `flanker.html` |
| ATT-03 | 斯特鲁普测试 | 抑制控制 | `stroop.html` |
| ATT-04 | 中科院注意力训练 | 视觉广度 | `focus.html` |
| ATT-05 | 持续表现任务（CPT） | 警觉性/持续注意 | `cpt.html` |

#### B. 工作记忆系统（MEM，3）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| MEM-01 | N-Back | 工作记忆更新 | `nback.html` |
| MEM-02 | 科西方块 | 空间工作记忆 | `corsi.html` |
| MEM-03 | 数字广度 | 短时记忆容量 | `digit-span.html` |

#### C. 推理系统（REA，1）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| REA-01 | 瑞文推理 | 抽象逻辑/模式推理 | `raven.html` |

#### D. 空间认知系统（SPA，1）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| SPA-01 | 心理旋转 | 空间想象/旋转速度 | `mental-rotation.html` |

#### E. 执行功能系统（EXE，5）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| EXE-01 | 任务切换 | 认知灵活性 | `task-switching.html` |
| EXE-02 | Go/No-Go | 冲动抑制 | `go-no-go.html` |
| EXE-03 | 停止信号任务 | 反应抑制 | `stop-signal.html` |
| EXE-04 | 威斯康星卡片分类 | 规则转换/策略更新 | `wisconsin-card.html` |
| EXE-05 | 反转学习任务 | 适应性学习 | `reversal-learning.html` |

#### F. 决策与风险系统（DEC，5）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| DEC-01 | 爱荷华赌博任务 | 情感决策/长期收益权衡 | `iowa-gambling.html` |
| DEC-02 | 最后通牒博弈 | 公平决策 | `ultimatum-game.html` |
| DEC-03 | 信任博弈 | 社会互惠/信任形成 | `trust-game.html` |
| DEC-04 | 囚徒困境 | 合作与背叛策略 | `prisoner-dilemma.html` |
| DEC-05 | 气球风险任务（BART） | 风险承担 | `balloon-risk.html` |

#### G. 概率与偏误系统（PRO，4）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| PRO-01 | 蒙提霍尔问题 | 条件概率 | `monty-hall.html` |
| PRO-02 | 基率忽略任务 | 统计直觉 | `base-rate.html` |
| PRO-03 | 赌徒谬误任务 | 随机性认知 | `gambler-fallacy.html` |
| PRO-04 | 贝叶斯更新任务 | 信念修正/证据整合 | `bayes-update.html` |

#### H. 规划与求解系统（PLA，3）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| PLA-01 | 河内塔 | 递归规划 | `hanoi.html` |
| PLA-02 | 伦敦塔 | 前瞻规划 | `london-tower.html` |
| PLA-03 | 八/十五数码问题 | 状态搜索/路径规划 | `sliding-puzzle.html` |

#### I. 创造力系统（CRE，3）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| CRE-01 | 替代用途测验 | 发散思维 | `alternative-uses.html` |
| CRE-02 | 远距离联想测验 | 聚合思维 | `remote-associates.html` |
| CRE-03 | 托兰斯创造力测验 | 图形创造/原创表达 | `torrance-creative.html` |

#### J. 社会认知与元认知系统（SOC，3）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| SOC-01 | 萨莉-安妮任务 | 心理理论（错误信念） | `sally-anne.html` |
| SOC-02 | 眼神读心测验 | 情绪识别/共情推断 | `eyes-reading.html` |
| SOC-03 | 置信度判断任务 | 元认知监控/校准 | `confidence-judgment.html` |

#### K. 工具系统（TOOLS/UTI，2）

| 编号 | 模块 | 核心能力 | 页面 |
|---|---|---|---|
| UTI-01 / TOOLS-01 | 麦克风测试 | 设备可用性检测 | `mic-test.html` |
| UTI-02 / TOOLS-02 | 每日训练报告 | 训练结果汇总反馈 | `report.html` |

### 6.2 `glm5` 独有扩展模块（5 项）

| 来源编号 | 模块 | 所属系统 | 页面 | 说明 |
|---|---|---|---|---|
| CRE-03（冲突） | 创造性写作测验 | 创造力 | `creative-writing.html` | 与“托兰斯”存在 `CRE-03` 编号冲突 |
| SOC-01（冲突） | 心理理论任务（ToM） | 社会认知 | `theory-of-mind.html` | 与“萨莉-安妮”存在 `SOC-01` 冲突 |
| SOC-02（冲突） | 错误意识任务 | 社会认知 | `error-awareness.html` | 与“眼神读心”存在 `SOC-02` 冲突 |
| AUX-01 | 注意力测试 | 辅助评估 | `attention-test.html` | `gpt` 目录暂无对应模块 |
| AUX-02 | 认知能力综合测试 | 辅助评估 | `cognitive-assessment.html` | `gpt` 目录暂无对应模块 |

---

## 7. 差异项与统一建议

### 7.1 结构差异

| 项目 | `glm5` | `gpt` | 建议 |
|---|---|---|---|
| 主索引深度 | 高（全平台详细总览） | 低（入口型） | 以 `glm5/INDEX.md` 作为主结构基底 |
| 模块详述风格 | 叙述完整 | 实现线索充足 | 合并为“叙述 + 代码线索”双层结构 |
| 理论文档 | 参考库为主 | 理论分文件齐全 | 以 `gpt/theory/*.md` 为主，引用 `REFERENCE_LIBRARY` |
| 枚举附录 | 详细 | 精简 | 合并保留详细版，兼容精简口径 |

### 7.2 编号冲突

1. 创造力系统：`CRE-03` 同时出现“托兰斯创造力测验”和“创造性写作测验”。
2. 社会系统：`SOC-01`、`SOC-02` 在两套模块定义中对应不同任务。
3. 辅助系统命名：`AUX` 与 `TOOLS/UTI` 并行存在。

建议统一方式：

1. 共享核心模块保持当前编号（与 `gpt` 对齐）。
2. `glm5` 扩展模块采用扩展号段（如 `CRE-X01`, `SOC-X01`, `AUX-01/02` 保留）。
3. 在总索引新增“核心集/扩展集”标签，避免误判覆盖状态。

### 7.3 口径统一优先级

1. 先统一编号与系统边界。
2. 再统一评分字段与阈值定义。
3. 最后统一常模、DOI 与证据等级。

---

## 8. 推荐维护流程（后续）

1. 新增/修改模块时，先更新模块详述，再更新系统索引，最后更新本总文档。
2. 任何评分字段变更，必须同步更新 `APPENDIX_ENUMS.md` 与对应模块的“评分体系”章节。
3. 理论引用新增时，同时补 `theory/REFERENCE_LIBRARY.md`，并标注证据等级（建议 E1/E2/E3）。
4. 发布前执行三项检查：编号唯一性、链接有效性、状态一致性。

---

## 9. 快速入口（相对本文件）

- `gpt` 主入口: [../INDEX.md](../INDEX.md)
- `gpt` 主索引: [../GAMES_SUMMARY.md](../GAMES_SUMMARY.md)
- `glm5` 主索引: [../../glm5/INDEX.md](../../glm5/INDEX.md)
- `gpt` 理论库: [../theory/REFERENCE_LIBRARY.md](../theory/REFERENCE_LIBRARY.md)
- `glm5` 理论库: [../../glm5/theory/REFERENCE_LIBRARY.md](../../glm5/theory/REFERENCE_LIBRARY.md)
- `gpt` 模板: [../TEMPLATE.md](../TEMPLATE.md)
- `glm5` 模板: [../../glm5/TEMPLATE.md](../../glm5/TEMPLATE.md)

---

*文档说明：本文件仅新增于 `gpt/汇总`，未改动任何旧文件。*
