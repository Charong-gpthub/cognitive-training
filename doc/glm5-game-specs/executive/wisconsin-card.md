# 威斯康星卡片分类 (Wisconsin Card Sorting Test)

> **文档编号**: MOD-EXE-04
> **所属系统**: 执行功能系统
> **页面**: `wisconsin-card.html` | **脚本**: `wisconsin-card.js`

---

## 一、基础信息

| 属性 | 内容 |
|------|------|
| 中文名称 | 威斯康星卡片分类 |
| 英文名称 | Wisconsin Card Sorting Test (WCST) |
| 所属系统 | 执行功能系统 |
| 系统编号 | EXE-04 |

## 二、理论背景

### 2.1 历史起源

WCST由Berg于1948年开发，后由Grant和Berg进行标准化，是评估执行功能最常用的神经心理学测验之一。

### 2.2 理论基础

**核心概念**：
- 认知灵活性：根据反馈调整策略的能力
- 规则学习：从经验中学习分类规则
- 抑制：放弃旧规则的能力

---

## 三、游戏概述

### 3.1 任务描述

根据形状、颜色或数量对卡片进行分类。分类规则会不定期改变，需要通过反馈发现并适应新规则。

### 3.2 应用场景

- 神经心理学评估
- 前额叶功能评估
- 认知灵活性训练

---

## 四、游戏玩法说明

| 操作类型 | 具体方式 |
|----------|----------|
| 选择分类 | 点击下方卡片进行分类 |

---

## 五、游戏规则

- 根据当前规则分类卡片
- 获得正确/错误反馈
- 规则改变时需自行发现

---

## 六、参数设置

| 参数名称 | 默认值 |
|----------|--------|
| 卡片数量 | 4 |
| 规则改变次数 | 多次 |

---

## 七、评分体系

| 指标名称 | 说明 |
|----------|------|
| 正确率 | 分类正确比例 |
| 持续错误 | 坚持错误策略的错误数 |
| 分类完成数 | 成功完成的分类数 |

---

## 八、数据记录

```javascript
{
  "wcst_records": [{
    "timestamp": 1709012345678,
    "correctRate": 0.75,
    "perseverativeErrors": 12,
    "categoriesCompleted": 4,
    "score": 80
  }]
}
```

---

## 九、参考文献

1. Grant, D. A., & Berg, E. (1948). A behavioral analysis of degree of reinforcement and ease of shifting to new responses in a Weigl-type card-sorting problem. *Journal of Experimental Psychology*.

---

*文档版本: 1.0*
*最后更新: 2026-02-27*
