# Nerakolo

> 栖息与地球某处。仿佛无处不在，却又无影无踪。

Nerakolo 个人主页，记录编程、音乐与生活兴趣，也连接散落在各处的创作与朋友。当前版本以灰调手绘插画、手写签名和留白构成页面，使用 React + Vite 构建。

[个人网站](https://www.nerakolo.cc/) · [设计说明](docs/design-notes.md) · [内容调研](docs/website-research.md)

## 页面与交互

- **个人介绍**：首屏签名、关于我，以及编程、AI 应用、Minecraft 和音乐等兴趣方向。
- **对外连接**：GitHub、Gitee、邮件联系、邮箱复制与友情链接。
- **明暗主题**：默认跟随系统，手动切换后在本地保存偏好。
- **响应式导航**：滚动时收起的顶部导航、当前段落指示，以及移动端菜单。
- **阅读体验**：锚点跳转、段落入场动效、支持拖动和键盘操作的悬浮滚动条。
- **无障碍支持**：跳过导航链接、焦点提示、减少动态效果适配，以及高对比色模式下的原生滚动条回退。

## 技术栈

| 用途 | 技术 |
| --- | --- |
| 页面与组件 | React 19、JavaScript、原生 CSS |
| 开发与构建 | Vite 8、`@vitejs/plugin-react` |
| 代码检查 | Oxlint |
| 图标 | Lucide React |
| 字体 | Manrope Variable、Noto Sans SC Variable，通过 Fontsource 本地打包 |

仓库还保留了旧版 Three.js 雕塑组件 `src/components/Sculpture.jsx` 及相关依赖，当前首页未引用该组件。

## 本地开发

需要 **Node.js 20.19+（20.x）或 22.12+**，以及 npm。

在项目根目录执行：

```sh
npm ci
npm run dev
```

打开终端输出的本地地址，默认是 `http://localhost:5173`；端口被占用时以实际输出为准。当前项目不需要配置环境变量、数据库或后端服务。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm ci` | 按 `package-lock.json` 安装依赖 |
| `npm run dev` | 启动开发服务器，支持热更新 |
| `npm run lint` | 使用 Oxlint 检查代码 |
| `npm run build` | 构建生产资源，输出到 `dist/` |
| `npm run preview` | 在本地预览已生成的生产构建 |

## 目录结构

```text
.
|-- docs/
|   |-- design-notes.md        # 当前视觉方向、交互说明与素材对应关系
|   `-- website-research.md    # 原站内容与历史设计参考
|-- public/
|   |-- art/                   # 人物插画、场景图和中英文签名
|   |-- images/                # 其他图片素材
|   |-- favicon.svg            # 支持明暗外观的浏览器图标
|   |-- favicon.ico            # 浏览器图标后备
|   `-- apple-touch-icon.png   # Apple 主屏幕图标
|-- src/
|   |-- components/            # 悬浮滚动条及保留的雕塑组件
|   |-- App.jsx                # 页面内容、导航、主题与交互
|   |-- App.css                # 主页面布局与样式
|   |-- Connections.css        # 链接区与友链区样式
|   |-- index.css              # 字体、主题变量与全局样式
|   `-- main.jsx               # React 挂载入口
|-- index.html                 # 页面标题、元信息、图标与初始主题
|-- vite.config.js             # Vite 构建配置
`-- package.json               # 依赖与 npm 脚本
```

## 内容与样式维护

| 要修改的内容 | 位置 |
| --- | --- |
| 个人介绍、导航、社交链接、友链、邮箱和备案信息 | `src/App.jsx` |
| 主题色、字体、页面宽度与全局间距 | `src/index.css` |
| 首屏、关于区、导航和页脚布局 | `src/App.css` |
| 书桌链接区与屋顶友链区布局 | `src/Connections.css` |
| 页面标题、描述、Open Graph 元信息和图标引用 | `index.html` |
| 插画与签名 | `public/art/` |

更换插画时同步检查 `src/App.jsx` 中的图片路径、替代文本和宽高属性。素材来源及当前使用情况见[设计说明](docs/design-notes.md#用户素材)。

## 构建与部署

```sh
npm run lint
npm run build
npm run preview
```

预览地址默认是 `http://localhost:4173`，以终端输出为准。`preview` 用于本地检查构建结果，正式部署时将 **`dist/` 目录的内容**发布到静态托管服务即可。

部署时注意：

- 当前配置面向域名根路径，例如 `https://example.com/`。若部署到子路径，需要同时调整 Vite 的 `base` 和源码中以 `/art/` 等开头的资源引用。
- 正式站点使用 HTTPS，确保邮箱复制所用的 Clipboard API 可用；本地 `localhost` 开发通常也可使用。
- 当前页面通过 `#about`、`#links`、`#friends` 进行站内导航，没有独立的 `/design` 页面。

## 相关文档

- [设计说明](docs/design-notes.md)：当前灰调手绘风格、响应式布局、交互细节与素材清单。
- [官网内容调研](docs/website-research.md)：原站的文字、链接和历史视觉参考；其中的旧版设计描述不代表当前实现。
