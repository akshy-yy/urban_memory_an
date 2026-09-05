@echo off
echo ==================================================
echo   Starting Urban Infrastructure Memory System
echo ==================================================

echo [0/3] Starting Docker Services (MySQL + ML-Service)...
docker-compose up -d --build

echo [1/3] Starting Spring Boot Backend API...
start cmd.exe /k "cd backend && mvnw spring-boot:run"

echo [2/3] Starting Official Portal (Frontend)...
start cmd.exe /k "cd frontend && npm run dev"

echo [3/3] Starting Citizen Portal...
start cmd.exe /k "cd citizen-portal && npm run dev -- --port 5174"

echo ==================================================
echo   All systems launching!
echo   - Backend: http://localhost:8080
echo   - Official Portal: http://localhost:5173
echo   - Citizen Portal: http://localhost:5174
echo ==================================================
pause
