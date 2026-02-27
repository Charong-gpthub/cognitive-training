# 返回按钮统一规范（游戏页面）

## 1. 目标

统一所有游戏页面“返回主页”入口，消除命名和位置不一致问题，降低用户学习成本。

## 2. 文案规范

- 统一文案：`返回主页`
- 禁止使用：`返回`、`返回大厅` 等变体

## 3. 结构规范

- 标准结构（通用）：

```html
<a href="index.html" class="back-btn">
  <span aria-hidden="true">←</span>
  <span>返回主页</span>
</a>
```

- 旧版页面（仅 `header` 结构）使用：

```html
<header class="with-back-link">
  <a href="index.html" class="back-btn page-header-back">
    <span aria-hidden="true">←</span>
    <span>返回主页</span>
  </a>
  ...
</header>
```

## 4. 位置规范

- `game-header` 页面：按钮位于页头左侧首位。
- `header.with-back-link` 页面：按钮固定为页头左上角（移动端回落为页头内首行）。

## 5. 样式规范

- 统一使用 `style.css` 中 `.back-btn`。
- 禁止页面内联样式定义返回按钮位置和视觉。

## 6. 验收清单

- 所有游戏页均存在 `href="index.html"` 的返回入口。
- 返回入口文案均为 `返回主页`。
- 不再出现 `btn secondary + inline style` 的旧写法作为顶部返回按钮。
- 移动端/桌面端位置一致符合本规范。
