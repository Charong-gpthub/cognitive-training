# 05 GLM5/GPT 总体文档（汇总整合版）

## 目标

本文件用于把 `glm5` 与 `gpt` 两个目录的汇总成果在 `doc/` 下形成单一可读总览，解决“源汇总未进入仓库文档中心”的问题。

## 已纳入 doc 的源汇总

1. `glm5/汇总/INDEX.md`  
   已镜像为：[source-glm5-summary-index.md](source-glm5-summary-index.md)
2. `gpt/汇总/GLM5_GPT_综合详细文档.md`  
   已镜像为：[source-gpt-glm5-comprehensive.md](source-gpt-glm5-comprehensive.md)

## 两套文档的统一基线

### A. 训练任务基线（来自 `glm5/汇总/INDEX.md`）

- 10 大认知系统
- 36 个训练模块
- 系统分布：ATT(5) / MEM(3) / REA(1) / SPA(1) / EXE(5) / DEC(5) / PRO(4) / PLA(3) / CRE(4) / SOC(5)

### B. 平台全量口径（来自 `gpt/汇总/GLM5_GPT_综合详细文档.md`）

- 40 项总体规模（核心训练 + 扩展 + 工具/辅助）
- 统一模板建议：`glm5` 深度模板 + `gpt` 快速迭代结构
- 统一枚举建议：`draft/review/stable`、`active/beta/planned`、L1/L2/L3 指标层

## 合并结论（执行口径）

1. 对“训练模块检索与展示”使用 36 模块基线。
2. 对“平台能力规划与交付”使用 40 项全量口径。
3. 文档维护顺序统一为：模块详述 -> 系统索引 -> 汇总索引 -> `doc/` 总体文档。

## 推荐阅读顺序

1. [source-glm5-summary-index.md](source-glm5-summary-index.md)  
   先看最新系统结构与模块分布。
2. [source-gpt-glm5-comprehensive.md](source-gpt-glm5-comprehensive.md)  
   再看融合策略、模板、口径与差异处理建议。
3. [01-unified-baseline.md](01-unified-baseline.md)  
   看当前执行基线。
4. [02-module-mapping-and-numbering.md](02-module-mapping-and-numbering.md)  
   看编号治理与映射。
5. [03-template-and-metrics-standard.md](03-template-and-metrics-standard.md)  
   看模板与指标规范。
6. [04-roadmap-and-quality-gates.md](04-roadmap-and-quality-gates.md)  
   看执行路线与发布门禁。

## 本次补齐说明

本次已将“两个源目录的核心汇总文档”纳入仓库 `doc/`，并建立总体文档入口。  
后续若 `glm5/汇总` 或 `gpt/汇总` 更新，应同步覆盖 `doc/source-*.md` 并更新本文件版本日期。

---

- 版本：`v1.0`
- 更新日期：`2026-02-27`
