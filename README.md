# Vue 3 语法学习平台

一个基于 Vue 3、Vite 和 Ant Design Vue 的交互式学习平台，专注于 Vue 3 核心 API、API 速查、Vite 配置和 AI Agent 开发内容。

## 主要功能

- Vue 3 语法与 API 教程
- API 快速检索与示例
- Vite 配置指南与实践
- AI Agent 开发专题
- 主题切换支持（暗黑/明亮）
- 左侧导航菜单、知识点进度标记
- 可交互运行的代码示例和练习

## 技术栈

- Vue 3
- Vite
- Vue Router
- Ant Design Vue
- Tailwind CSS
- highlight.js

## 项目结构

- `index.html` - 应用入口页面
- `src/main.js` - Vue 应用启动文件
- `src/App.vue` - 全局布局与主题提供器
- `src/router/index.js` - 前端路由定义
- `src/components/` - 公共组件和页面组件
- `src/composables/useTheme.js` - 主题管理组合式函数
- `src/data/` - 学习内容和配置数据
- `src/utils/sandbox.js` - 代码沙箱相关工具

## 路由页面

- `/` - Vue 3 教程页面
- `/api` - API 速查页面
- `/vite` - Vite 配置页面
- `/agent` - AI Agent 开发页面

## 运行方式

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

打包构建：

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## 说明

该项目以学习与演示为目标，适合作为 Vue 3 初学者快速了解现代前端开发流程、组件组织和交互式教程页面的参考模板。