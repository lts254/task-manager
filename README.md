# 任务管理系统

## 项目简介

这是一个基于 Vue 3 + Node.js + SQLite 的全栈任务管理系统，支持用户注册/登录、任务创建、任务状态管理、任务搜索等功能。

适用于 **字节AI全栈挑战赛** 等技术竞赛项目提交。

## 🚀 Demo 快速启动

### Windows 用户（推荐）
双击运行 `start-demo.bat` 即可自动启动前后端！

### PowerShell 用户
右键运行 `start-demo.ps1`

### 手动启动
```bash
# 终端 1 - 后端
cd server
npm start

# 终端 2 - 前端
cd client
npm run dev
```

详细 Demo 演示步骤请查看：[DEMO.md](./DEMO.md)

## 技术栈

- **前端**：Vue 3 + Vite + Element Plus + Vue Router + vue-draggable
- **后端**：Node.js + Express + sql.js
- **数据库**：SQLite WebAssembly（无需额外安装数据库）
- **认证**：JWT + bcryptjs

## 项目功能

- ✅ 用户注册/登录（密码加密）
- ✅ JWT 身份认证
- ✅ 任务创建/编辑/删除
- ✅ 任务状态管理（待办/进行中/已完成）
- ✅ 任务优先级（低/中/高）
- ✅ 任务截止日期
- ✅ 任务搜索
- ✅ 任务状态筛选
- ✅ 拖拽改变任务状态

## 快速开始

### 1. 安装依赖

```bash
# 后端
cd server
npm install

# 前端
cd ../client
npm install
```

### 2. 启动项目

```bash
# 启动后端（终端1）
cd server
npm start

# 启动前端（终端2）
cd ../client
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:5173

**测试账号**（可选）：
- 用户名：`test`
- 密码：`test123`

## 项目结构

```
task-manager/
├── client/              # 前端
│   ├── src/
│   │   ├── views/      # 页面组件
│   │   ├── router/     # 路由
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/             # 后端
│   ├── src/
│   │   └── index.js   # 主程序
│   ├── task-manager.db # SQLite 数据库（自动创建）
│   └── package.json
├── node/               # Node.js 便携版
├── start-demo.bat      # Windows 一键启动
├── start-demo.ps1      # PowerShell 启动
├── README.md
└── DEMO.md             # Demo 演示指南
```

## API 接口说明

### 认证接口

- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录

### 任务接口

- `GET /api/tasks` - 获取任务列表
- `POST /api/tasks` - 创建任务
- `PUT /api/tasks/:id` - 更新任务
- `DELETE /api/tasks/:id` - 删除任务

### 健康检查

- `GET /api/health` - 服务健康检查

## 使用说明

1. 首次使用请先注册账户
2. 登录后进入任务管理界面
3. 点击"新建任务"创建任务
4. 点击任务卡片可以编辑
5. 可以拖拽任务卡片到不同状态列
6. 可以使用搜索框和筛选器查找任务

## 技术亮点

1. **无数据库部署**：使用 sql.js 将 SQLite 编译为 WebAssembly，数据保存在浏览器本地
2. **前后端分离**：RESTful API 设计，前端通过 Axios 调用后端接口
3. **用户数据隔离**：JWT 中间件验证，确保用户只能访问自己的任务
4. **拖拽交互**：vue-draggable 实现流畅的卡片拖拽排序
5. **一键启动**：提供 start-demo.bat/ps1 脚本，自动安装依赖并启动服务
