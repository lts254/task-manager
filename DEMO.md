# 🎯 任务管理系统 - Demo 演示指南

## 快速启动

### Windows 用户
双击运行 `start-demo.bat` 即可自动启动前后端！

### 手动启动
```bash
# 终端 1 - 后端
cd server
npm start

# 终端 2 - 前端
cd client
npm run dev
```

---

## 📝 Demo 演示步骤

### 1. 访问应用
打开浏览器访问：http://localhost:5173

---

### 2. 用户注册/登录
- 点击 **"注册"** 创建新账号
- 或者使用测试账号：
  - 用户名：`test`
  - 密码：`test123`

---

### 3. 功能演示

#### ✅ 任务看板
- 三列布局：**待办** → **进行中** → **已完成**
- 可以查看不同状态的任务

#### ✅ 创建任务
- 点击 **"新建任务"** 按钮
- 填写任务信息：
  - 标题
  - 描述
  - 优先级（高/中/低）
  - 截止日期
- 点击 **"确定"** 保存

#### ✅ 编辑任务
- 点击任务卡片打开编辑面板
- 修改任务信息后保存

#### ✅ 拖拽任务
- 将任务卡片从一列拖拽到另一列
- 状态会自动更新

#### ✅ 搜索筛选
- 使用搜索框按关键词查找任务
- 使用筛选器按状态查看

#### ✅ 删除任务
- 点击任务卡片上的删除按钮

---

## 🔧 API 测试

### 健康检查
```bash
curl http://localhost:3001/api/health
```

### 用户注册
```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"demo123\"}"
```

### 用户登录
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"demo123\"}"
```

---

## 📊 技术亮点展示

| 功能 | 技术实现 | 说明 |
|-----|---------|------|
| **用户认证** | JWT + bcryptjs | Token 7天有效期 |
| **数据存储** | sql.js | SQLite WebAssembly |
| **拖拽交互** | vue-draggable | 流畅的卡片排序 |
| **UI 框架** | Element Plus | 美观的组件库 |
| **构建工具** | Vite | 快速的开发体验 |

---

## 💡 演示提示

1. **首次使用**：先注册账号再登录
2. **测试数据**：登录后会看到一些预设任务
3. **端口说明**：
   - 后端：http://localhost:3001
   - 前端：http://localhost:5173

---

## 🎬 推荐演示流程

1. 打开浏览器访问 http://localhost:5173
2. 展示注册/登录功能
3. 创建几个不同优先级的任务
4. 演示拖拽切换任务状态
5. 展示搜索和筛选功能
6. 说明技术亮点

---

## ⚠️ 注意事项

- 不要关闭启动的命令行窗口
- 数据保存在 `server/task-manager.db`
- 刷新页面不会丢失数据

---

## 📞 技术支持

如有问题，请检查：
- Node.js 版本 >= 18
- 端口 3001 和 5173 是否被占用
- 浏览器控制台是否有错误信息