# 🎯 任务管理系统 - Demo 完整包

## 📦 文件清单

```
任务管理系统/
├── README.md              # 项目说明文档
├── DEMO.md               # Demo 演示指南
├── start-demo.bat        # Windows 一键启动脚本
├── start-demo.ps1        # PowerShell 启动脚本
├── client/               # 前端代码
├── server/               # 后端代码
└── node/                 # Node.js 便携版
```

---

## 🚀 快速启动方式

### 方式一：一键启动（推荐）

**Windows 用户：**
```
双击运行 start-demo.bat
```

**PowerShell 用户：**
```
右键 → 使用 PowerShell 运行 start-demo.ps1
```

### 方式二：手动启动

```bash
# 终端 1 - 后端
cd server
npm start

# 终端 2 - 前端
cd client
npm run dev
```

---

## 📋 完整功能演示

### 1. 用户认证
- ✅ 注册新账号
- ✅ 登录现有账号
- ✅ JWT Token 认证
- ✅ 密码 bcrypt 加密

### 2. 任务管理
- ✅ 创建任务（标题、描述、优先级、截止日期）
- ✅ 编辑任务
- ✅ 删除任务
- ✅ 查看任务详情

### 3. 看板功能
- ✅ 三列布局：待办 → 进行中 → 已完成
- ✅ 拖拽任务卡片切换状态
- ✅ 状态自动更新

### 4. 搜索筛选
- ✅ 关键词搜索
- ✅ 按状态筛选

---

## 🔧 技术栈详解

| 技术 | 用途 | 优势 |
|-----|------|------|
| **Vue 3** | 前端框架 | Composition API、更好的 TypeScript 支持 |
| **Element Plus** | UI 组件库 | 美观、易用、组件丰富 |
| **Vite** | 构建工具 | 快速热更新、开发体验好 |
| **vue-draggable** | 拖拽库 | 流畅的拖拽交互 |
| **Express.js** | 后端框架 | 轻量、灵活、生态丰富 |
| **sql.js** | 数据库 | SQLite WebAssembly，无需独立数据库服务 |
| **JWT** | 认证 | 无状态认证、跨域友好 |
| **bcryptjs** | 密码加密 | 安全的密码哈希 |

---

## 🎬 推荐演示流程

### 步骤 1：启动服务
双击 `start-demo.bat`，等待前后端启动完成

### 步骤 2：访问应用
打开浏览器访问 http://localhost:5173

### 步骤 3：演示注册/登录
1. 点击"注册"
2. 填写用户名和密码
3. 登录进入主界面

### 步骤 4：演示任务创建
1. 点击"新建任务"
2. 填写任务信息（标题、描述、优先级、截止日期）
3. 点击确定保存

### 步骤 5：演示拖拽功能
1. 将任务卡片从"待办"拖到"进行中"
2. 再拖到"已完成"
3. 展示状态自动更新

### 步骤 6：演示搜索筛选
1. 在搜索框输入关键词
2. 使用状态筛选器查看特定状态的任务

### 步骤 7：技术亮点说明
- sql.js 无数据库部署
- JWT Token 认证
- vue-draggable 拖拽实现
- RESTful API 设计

---

## 📊 接口文档

### 健康检查
```
GET /api/health
响应：{ "status": "ok", "timestamp": 1234567890 }
```

### 用户注册
```
POST /api/register
Body: { "username": "demo", "password": "demo123" }
响应：{ "success": true, "userId": 1 }
```

### 用户登录
```
POST /api/login
Body: { "username": "demo", "password": "demo123" }
响应：{ "success": true, "token": "...", "userId": 1, "username": "demo" }
```

### 获取任务列表
```
GET /api/tasks?status=todo&search=keyword
Headers: Authorization: Bearer <token>
响应：[ { "id": 1, "title": "...", ... }, ... ]
```

### 创建任务
```
POST /api/tasks
Headers: Authorization: Bearer <token>
Body: { "title": "任务", "description": "...", "priority": "high", "due_date": "2024-01-01" }
响应：{ "id": 1, "title": "任务", ... }
```

### 更新任务
```
PUT /api/tasks/:id
Headers: Authorization: Bearer <token>
Body: { "title": "修改后", "status": "in_progress", ... }
响应：{ "id": 1, ... }
```

### 删除任务
```
DELETE /api/tasks/:id
Headers: Authorization: Bearer <token>
响应：{ "success": true }
```

---

## 💡 技术亮点总结

### 1. 无数据库部署
使用 sql.js 将 SQLite 编译为 WebAssembly，数据保存在浏览器本地，无需用户安装 MySQL/PostgreSQL。

### 2. 前后端分离
RESTful API 设计，前端通过 Axios 调用后端接口，职责清晰。

### 3. JWT 无状态认证
Token 7天有效期，密码 bcrypt 加密，确保安全。

### 4. 用户数据隔离
通过 JWT 中间件验证，确保用户只能访问自己的任务数据。

### 5. 流畅的拖拽交互
vue-draggable 封装 Sortable.js，提供平滑的拖拽体验。

### 6. 一键启动脚本
提供 start-demo.bat/ps1 脚本，自动检查依赖并启动服务。

---

## ⚠️ 注意事项

1. **不要关闭** 启动的命令行窗口
2. 数据保存在 `server/task-manager.db`
3. 确保端口 3001 和 5173 未被占用
4. 推荐使用 Chrome/Edge 浏览器

---

## 📝 测试账号

| 用户名 | 密码 | 说明 |
|-------|------|------|
| test | test123 | 预设测试账号 |

---

## 🎯 项目信息

- **项目名称**：任务看板管理系统
- **代码量**：前端 ~800行，后端 ~300行
- **开发周期**：3-5天
- **适用场景**：全栈开发比赛、项目演示、学习参考

---

## 📞 常见问题

**Q：启动失败怎么办？**
A：检查 Node.js 版本 >= 18，端口是否被占用，查看控制台错误信息。

**Q：数据会丢失吗？**
A：不会，数据保存在 `server/task-manager.db` 文件中。

**Q：可以在其他电脑上运行吗？**
A：可以，项目包含 Node.js 便携版，无需额外安装。

---

## 🎉 准备完成！

现在你可以：
1. 双击 `start-demo.bat` 启动 Demo
2. 访问 http://localhost:5173 开始演示
3. 按照上面的演示流程展示功能

祝你在字节AI全栈挑战赛中取得好成绩！🚀