@echo off
REM Wove Development Environment Startup Script (Batch Version)
REM This script starts all services in the correct order

echo.
echo 🚀 Starting Wove Development Environment...
echo.

REM Step 1: Start Database Services
echo 📊 Starting database services...
docker-compose up -d postgres redis
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to start database services
    pause
    exit /b 1
)
echo ✅ Database services started
echo.

REM Wait a moment for databases to initialize
echo ⏳ Waiting for databases to initialize...
timeout /t 10 /nobreak >nul
echo.

REM Step 2: Start Backend API
echo 🔧 Starting backend API on port 3004...
start "Wove Backend API" cmd /k "cd /d "%~dp0backend\wove-api" && npm run start:local"
echo ✅ Backend API starting in new window
echo.

REM Wait a moment for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 15 /nobreak >nul
echo.

REM Step 3: Start Frontend
echo 🌐 Starting frontend on port 3003...
start "Wove Frontend" cmd /k "cd /d "%~dp0frontend\wove-web" && npm run dev"
echo ✅ Frontend starting in new window
echo.

REM Wait a moment for frontend to start
echo ⏳ Waiting for frontend to initialize...
timeout /t 10 /nobreak >nul
echo.

echo 🎉 Wove Development Environment Setup Complete!
echo.
echo 📋 Service Status:
echo    • Frontend:    http://localhost:3003
echo    • Backend API: http://localhost:3004
echo    • PostgreSQL:  localhost:5432
echo    • Redis:       localhost:6379
echo.
echo 💡 Tips:
echo    • Access the application at http://localhost:3003
echo    • API documentation available at http://localhost:3004/api
echo    • Use Ctrl+C in the terminal windows to stop individual services
echo    • Run 'docker-compose down' to stop database services
echo.
echo Press any key to exit...
pause >nul