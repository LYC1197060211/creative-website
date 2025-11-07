# 创意管理系统

一个基于 Next.js 14 和 GLM-4.6 API 的个人创意收集、管理和优化平台。

## 功能特性

- 🧠 创意收集和管理
- 🤖 AI 智能优化建议
- 📊 创意分类和优先级管理
- 🎨 现代简约的用户界面
- 📱 响应式设计

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **UI组件**: Headless UI, Lucide React
- **AI集成**: GLM-4.6 API

## 开发环境

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 项目结构

```
src/
├── app/              # Next.js App Router
├── components/       # 可复用组件
│   ├── ui/          # 基础UI组件
│   ├── auth/        # 认证相关组件
│   ├── creative/    # 创意管理组件
│   └── ai/          # AI功能组件
├── lib/             # 工具函数和配置
├── types/           # TypeScript类型定义
└── hooks/           # 自定义React Hooks
```

## 开发计划

1. ✅ 项目基础架构搭建
2. 🔄 用户认证系统
3. ⏳ 创意管理功能
4. ⏳ AI功能集成
5. ⏳ 项目展示页面

## 贡献

这个项目主要用于个人使用和展示。

## 许可证

MIT