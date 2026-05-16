@echo off
chcp 65001 >nul
echo ====================================
echo   任务管理系统 - 一键启动
echo ====================================
echo.

REM 设置 Node.js 路径
set PATH=%~dp0node\node-v20.15.1-win-x64;%PATH%
echo [1/4] 检查 Node.js...
node --version
if errorlevel 1 (
    echo ✗ Node.js 未找到，正在解压...
    powershell -Command "Expand-Archive -Path '%~dp0node.zip' -DestinationPath '%~dp0node' -Force"
)
echo ✓ Node.js 已就绪
echo.

echo [2/4] 检查后端依赖...
if not exist "%~dp0server\node_modules" (
    echo ✗ 后端依赖未安装，正在安装...
    cd /d "%~dp0server"
    call npm install
    if errorlevel 1 (
        echo ✗ 后端依赖安装失败
        pause
        exit /b 1
    )
)
echo ✓ 后端依赖已就绪
echo.

echo [3/4] 检查前端依赖...
if not exist "%~dp0client\node_modules" (
    echo ✗ 前端依赖未安装，正在安装...
    cd /d "%~dp0client"
    call npm install
    if errorlevel 1 (
        echo ✗ 前端依赖安装失败
        pause
        exit /b 1
    )
)
echo ✓ 前端依赖已就绪
echo.

echo [4/4] 启动服务...
echo.
echo ====================================
echo   启动服务中...
echo ====================================
echo.

REM 启动后端
start "任务管理系统-后端" cmd /k "cd /d %~dp0server && npm start"
echo ✓ 后端服务已启动（端口 3001）

REM 等待一下，启动前端
timeout /t 3 >nul

REM 启动前端
start "任务管理系统-前端" cmd /k "cd /d %~dp0client && npm run dev"
echo ✓ 前端服务已启动（端口 5173）

echo.
echo ====================================
echo   🎉 Demo 启动成功！
echo ====================================
echo.
echo 访问地址：http://localhost:5173
echo.
echo 测试账号（可选）：
echo   用户名：test
echo   密码：test123
echo.
echo 按任意键打开浏览器...
pause >nul

REM 打开浏览器
start http://localhost:5173

echo.
echo 浏览器已打开！
echo.
echo 提示：不要关闭启动的命令行窗口
echo.
pause