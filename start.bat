@echo off
echo ========================================
echo   ShopEase - E-Commerce Application
echo ========================================
echo.

echo Starting Backend Server (Node.js/Mongo)...
cd backend-node
start cmd /k "node server.js"

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
