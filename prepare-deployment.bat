@echo off
REM IremeCorner API Documentation Deployment Preparation Script

echo 🚀 Preparing IremeCorner API Documentation for Deployment...

REM Check if we're in the right directory
if not exist "swagger.json" (
    echo ❌ Error: swagger.json not found. Please run this script from the server directory.
    pause
    exit /b 1
)

REM Ensure package.json exists
if not exist "package.json" (
    echo 📦 Creating package.json...
    copy package-docs.json package.json
)

REM Install dependencies
echo 📥 Installing dependencies...
npm install --only=production

REM Test the server
echo 🧪 Testing documentation server...
start /b node swagger-server.js
timeout /t 3 /nobreak >nul

REM Check if server started successfully
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server test successful
    taskkill /f /im node.exe >nul 2>&1
) else (
    echo ❌ Server test failed
    taskkill /f /im node.exe >nul 2>&1
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment package ready!
echo.
echo 📁 Essential files:
echo    ✅ swagger-server.js
echo    ✅ swagger.json
echo    ✅ package.json
echo.
echo 🌐 After deployment, your docs will be at:
echo    📚 Interactive UI: https://your-app.onrender.com/api-docs
echo    📄 JSON Schema: https://your-app.onrender.com/swagger.json
echo    🔍 Health Check: https://your-app.onrender.com/health
echo.
echo 🚀 Ready for Render.com deployment!
echo    Make sure to set Root Directory to 'server' in Render dashboard

pause
