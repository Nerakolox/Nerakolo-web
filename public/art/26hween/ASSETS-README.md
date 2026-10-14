# 瑞士风格拆信素材

将 `public/art/26hween/` 中的三张 PNG 放到项目同名目录。

| 文件 | 用途 | 规格 |
| --- | --- | --- |
| envelope-closed.png | 闭合信封 | 1024 × 1024，RGBA 真透明 |
| envelope-open.png | 打开信封，石墨黑火漆分为上下两半 | 1024 × 1024，RGBA 真透明 |
| seal.png | 独立完整火漆，供裂开瞬间动画使用 | 1024 × 1024，RGBA 真透明 |

两张信封已统一主体位置与尺寸，信封主体大致落在 x=128–896、y=408–832；打开版上方留给展开封盖。两张必须使用同一画布框和相同 CSS 尺寸，不要分别自动裁切透明边缘。图像细节并非逐像素一致，建议配合短暂的淡入淡出或遮罩过渡；未在实际页面中验收动画。

独立 seal.png 比信封上的火漆更大，使用时需要缩放。信纸交由 CSS 实现；不包含 paper.png。未修改站点代码或 demo.json。

## 设计更新

按用户要求移除全部万圣节元素。采用克制的瑞士设计语言：暖白纸、石墨黑、精确折线与留白。无南瓜、蝙蝠、橙色光效、旧纸污渍。main.png 保持不变。

## 生成方式与最终提示词要点

使用内置 imagegen，旧图仅作构图参考，重新设计材质、配色与火漆。开封状态在新版闭合图基础上编辑，独立火漆同样使用新版闭合图为参考。

**共通提示词规格**：premium contemporary Swiss International Typographic Style stationery; restrained warm-white ivory and graphite palette; fine uncoated paper fibers; crisp precise geometric folds; neutral soft diffuse studio illumination; subtle internal contact shading; genuinely transparent background. No people, hands, text, letters, watermark, Halloween motifs, orange/amber light, vintage distress, exterior cast shadows or scenery.

**envelope-closed.png**：正对横向信封封口面，近正交，暖象牙白厚纸、精确折线、干净边缘；三角封盖由上缘向下闭合，封盖尖端朝下。小型石墨黑火漆位于封盖尖端，低调缎面反光，浅浮雕 2×2 方块网格，无文字或节日装饰。

**envelope-open.png**：保留新版闭合图的纸张、色彩、主体比例、相机与照明，顶部三角封盖向上翻开，露出浅色内侧和中性灰口袋阴影；不露出信纸。一枚黑色火漆断成互补上下半圆，上片保留两个小方块，下片保留另外两个小方块。

**seal.png**：同款完整石墨黑圆形火漆，浅浮雕 2×2 网格、细窄凸起边缘、轻微有机轮廓与低调高光，正交居中，隔离于透明画布。

生成后使用 ImageMagick 统一尺寸、画布与透明输出，并检查 PNG 尺寸及 alpha。没有额外生成信纸或修改 main.png。
