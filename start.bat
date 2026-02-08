@echo off
echo ========================================
echo   ShopEase - E-Commerce Application
echo ========================================
echo.

echo Starting Backend Server...
cd backend
start cmd /k "go run cmd/server/main.go"

echo.
echo Starting Frontend Server...
cd ../frontend
start cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo.
echo   Backend: http://localhost:8080
echo   Frontend: http://localhost:5173
echo ========================================
echo.
pause
