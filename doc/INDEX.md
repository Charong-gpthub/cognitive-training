# GLM5/GPT 综合文档系列（2026-02-27）

## 编制依据

本系列文档基于以下两类来源整理：

1. 意见来源（融合建议）  
   `C:\Users\Administrator\Documents\trae_projects\20260226work001\gpt\汇总\GLM5_GPT_综合详细文档.md`
2. 最新资料来源（当前基线）  
   `C:\Users\Administrator\Documents\trae_projects\20260226work001\glm5\汇总\`  
   重点文件：`C:\Users\Administrator\Documents\trae_projects\20260226work001\glm5\汇总\INDEX.md`

## 阅读顺序

1. [01-unified-baseline.md](01-unified-baseline.md)  
   统一口径、系统规模、当前基线。
2. [02-module-mapping-and-numbering.md](02-module-mapping-and-numbering.md)  
   模块映射、编号策略、历史编号兼容。
3. [03-template-and-metrics-standard.md](03-template-and-metrics-standard.md)  
   模板、指标和数据记录的统一规范。
4. [04-roadmap-and-quality-gates.md](04-roadmap-and-quality-gates.md)  
   执行路线、发布门槛与检查清单。

## 当前统一结论（摘要）

1. 训练任务基线以 `glm5/汇总/INDEX.md` 为准：10 大系统、36 个训练模块。
2. 平台全量口径保留 40 项：在 36 个训练模块基础上，补充 2 个工具模块（UTI）和 2 个辅助评估模块（AUX）。
3. `GLM5_GPT_综合详细文档.md` 中提出的编号冲突意见，在最新 `glm5/汇总` 里已部分消解（CRE 与 SOC 已重排为连续编号）。
4. 统一维护顺序为：模块详述 -> 系统索引 -> 汇总索引 -> 本系列文档。

## 文档版本

- 版本：`v1.0`
- 生成日期：`2026-02-27`
- 适用范围：`20260226work001/glm5` 与 `20260226work001/gpt` 文档体系融合
