@echo off
REM IremeCorner API Documentation Deployment Script for Windows

echo 🚀 Preparing IremeCorner API Documentation for Deployment...

REM Check if we're in the right directory
if not exist "swagger.json" (
    echo ❌ Error: swagger.json not found. Please run this script from the server directory.
    pause
    exit /b 1
)

REM Create deployment package
echo 📦 Creating deployment package...

REM Copy essential files
copy package-docs.json package.json
echo ✅ Package configuration ready

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
echo 📁 Files for deployment:
echo    - swagger-server.js (main server)
echo    - swagger.json (API documentation)
echo    - package.json (dependencies)
echo.
echo 🌐 Your documentation will be available at:
echo    - Interactive UI: https://your-domain.com/api-docs
echo    - JSON Schema: https://your-domain.com/swagger.json
echo    - Health Check: https://your-domain.com/health
echo.
echo 🚀 Ready to deploy to your preferred platform!
echo    See DEPLOYMENT_GUIDE.md for platform-specific instructions.

pause
