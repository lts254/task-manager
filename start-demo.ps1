# 任务管理系统 - 启动脚本 (PowerShell)
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  任务管理系统 - 一键启动" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 设置 Node.js 路径
$nodePath = Join-Path $PSScriptRoot "node\node-v20.15.1-win-x64"
$env:PATH = "$nodePath;$env:PATH"

# 检查 Node.js
Write-Host "[1/4] 检查 Node.js..." -ForegroundColor Yellow
try {
    $version = node --version
    Write-Host "  ✓ Node.js $version" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js 未找到" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 检查后端依赖
Write-Host "[2/4] 检查后端依赖..." -ForegroundColor Yellow
$serverNodeModules = Join-Path $PSScriptRoot "server\node_modules"
if (-not (Test-Path $serverNodeModules)) {
    Write-Host "  ✗ 后端依赖未安装，正在安装..." -ForegroundColor Red
    Set-Location (Join-Path $PSScriptRoot "server")
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ 后端依赖安装失败" -ForegroundColor Red
        exit 1
    }
}
Write-Host "  ✓ 后端依赖已就绪" -ForegroundColor Green
Write-Host ""

# 检查前端依赖
Write-Host "[3/4] 检查前端依赖..." -ForegroundColor Yellow
$clientNodeModules = Join-Path $PSScriptRoot "client\node_modules"
if (-not (Test-Path $clientNodeModules)) {
    Write-Host "  ✗ 前端依赖未安装，正在安装..." -ForegroundColor Red
    Set-Location (Join-Path $PSScriptRoot "client")
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ 前端依赖安装失败" -ForegroundColor Red
        exit 1
    }
}
Write-Host "  ✓ 前端依赖已就绪" -ForegroundColor Green
Write-Host ""

# 启动服务
Write-Host "[4/4] 启动服务..." -ForegroundColor Yellow
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  启动服务中..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# 启动后端
$serverScript = Join-Path $PSScriptRoot "server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverScript'; `$env:PATH='$nodePath;' + `$env:PATH; npm start" -WindowStyle Normal
Write-Host "  ✓ 后端服务已启动（端口 3001）" -ForegroundColor Green

# 等待一下
Start-Sleep -Seconds 3

# 启动前端
$clientScript = Join-Path $PSScriptRoot "client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientScript'; `$env:PATH='$nodePath;' + `$env:PATH; npm run dev" -WindowStyle Normal
Write-Host "  ✓ 前端服务已启动（端口 5173）" -ForegroundColor Green

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "  🎉 Demo 启动成功！" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "访问地址：http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "测试账号（可选）：" -ForegroundColor Yellow
Write-Host "  用户名：test" -ForegroundColor Gray
Write-Host "  密码：test123" -ForegroundColor Gray
Write-Host ""
Write-Host "按任意键打开浏览器..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 打开浏览器
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "浏览器已打开！" -ForegroundColor Green
Write-Host ""
Write-Host "提示：不要关闭启动的命令行窗口" -ForegroundColor Yellow
Write-Host ""
Read-Host "按回车键退出"