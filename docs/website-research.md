# Nerakolo 官网内容调研

调研日期：2026-09-05。

来源：实际访问 [官网首页](https://www.nerakolo.cc/) 和 [Design 页面](https://www.nerakolo.cc/design)，并查看首页视觉布局。本文记录当时可见内容，未继续访问外部社交站点或友情链接目标网站。

## 后续使用原则

- 用户要求记住网站内容，作为后续开发的内容基础。
- 用户明确说明：Design 可以改动。现有配色、字体、布局、组件和动效仅供参考，不是固定设计约束。
- 下文的页面顺序是现站结构记录，不代表新版必须沿用。
- 本次仅整理调研与清理项目模板，尚未确定新版设计方案。

## 网站身份与首屏

- 名称：Nerakolo。
- 浏览器标题：Nerakolo · 栖息与地球某处。
- 定位：个人网站，展示个人介绍、技术方向、兴趣及对外链接。
- 首屏主文案（保留原文中的“与”）：

> 栖息与地球某处
> 仿佛无处不在
> 却又无影无踪

首屏核心方向标签：CODE、VIBE CODING、AI APPLICATIONS。

首屏有多语言欢迎语；页面可访问文本包含以下四种语言，截图时可见西班牙语：

- 中文：你好，我是 Nerakolo，欢迎来到我的网站。
- 日文：こんにちは、Nerakoloです、私のウェブサイトへようこそ。
- 英文：Hello, I'm Nerakolo. Welcome to my website.
- 西班牙文：Hola, soy Nerakolo. Bienvenido a mi sitio web.

首屏上方还有盲文形式的旁注：

> ⠎⠓⠁ ⠼⠉⠁⠲⠼⠃⠉⠚⠙ ⠝ · ⠥⠞⠉⠐⠼⠚⠓ · ⠑⠎⠞⠲ ⠼⠃⠚⠃⠃

## 首页结构与内容

顶部为 Nerakolo 品牌名称，导航包括关于、链接、友链和 Design。前三项对应首页锚点，Design 指向 `/design`。

页面顺序：首屏介绍 → 关于（02 / 04）→ 链接（03 / 04）→ 友情链接（04 / 04）→ 页脚。

### 关于

主文案：

> 写代码，听音乐，把热爱做成美好的事物。

介绍正文：

> 我把一些细小的感受留在这里：夜晚、秩序、沉默、远处的光，以及那些说不清名字的时刻。如果你来到这里，也许不需要立刻理解我。只要短暂停留，就已经足够。

兴趣与方向：Frontend、Backend、Minecraft Server、Vocaloid、Anime、Music。

### 社交链接

| 名称 | 地址 |
| --- | --- |
| GitHub | https://github.com/Nerakolox |
| Gitee | https://gitee.com/Nerakolo |
| Email | nerakolo@outlook.com（mailto:nerakolo@outlook.com） |

### 友情链接

| 条目 | 介绍 | 链接 |
| --- | --- | --- |
| OWN / Feedra | 我自己的独立站 | https://www.feedra.org/ |
| Axolotland Gaming club | 朋友们的游戏俱乐部 | https://axogc.net/ |
| 申请友链 | 发邮件告诉我你的名字、网址和一句话介绍。 | mailto:nerakolo@outlook.com?subject=友链申请 |

游戏俱乐部的页面显示域名为 `www.axogc.net`，链接目标为 `axogc.net/`。

### 页脚

- 版权：© 2026 Nerakolo. All rights reserved.
- 备案号：蜀ICP备2024095824号-2。
- 备案链接：https://beian.miit.gov.cn/。

## 现有设计参考（可调整）

Design 页面标题为“冰蓝与藏青”，标识为“DESIGN SYSTEM · WINTER PALETTE”。页面将其描述为冬季制服风，清冷、克制、温和。

首页截图观察：奶白背景，大字号中文衬线标题，藏青正文和冰蓝强调色，较多留白，顶部细分隔线，小型胶囊标签，首屏底部有 SCROLL 提示。第三行主标题采用冰蓝色及倾斜处理。

### 色板

| 分组 | 名称 | 色值 |
| --- | --- | --- |
| 主色 | Ice Light | #A8D8F0 |
| 主色 | Ice | #6BB8E8 |
| 主色 | Sky | #4FA3D8 |
| 藏青 | Navy Deep | #1E3A5F |
| 藏青 | Navy | #2C4A6F |
| 藏青 | Navy Slate | #3D5A7E |
| 中性 | Cream | #F5F0E8 |
| 中性 | Ivory | #FEFBF5 |
| 中性 | Cool Gray | #E8EAED |
| 点缀 | Plaid | #5C7A9E |
| 点缀 | Winter White | #F8FCFF |
| 点缀 | Frost | #D4E8F5 |

Design 页面说明：主色用于强调、链接与聚焦；藏青用于标题、正文及高对比元素；中性色用于背景与留白；点缀色用于分隔线、边框及细节。

### 字体

| 用途 | 字体 |
| --- | --- |
| 标题 | DM Serif Display / Noto Serif SC |
| 正文 | Inter / Noto Sans SC |
| 旁注 | JetBrains Mono |

### 组件与渐变

以下是 Design 页自身的说明，本次未逐项测试交互：

- 色块：点击复制色值。
- 按钮：藏青实底用于主要动作，描边用于次要动作。
- 标签：圆角药丸形状与霜色描边，悬停上浮并填充。
- 链接行：通栏排列，悬停时渐变扫过，箭头前移。
- 渐变展示：冰川 ICE FLOW、深海 NAVY DEPTH、霜夜 FROST TO NIGHT、冬日晨光 WINTER LIGHT。

以上设计信息保留为现站参考，新版可重新选择视觉方向。
