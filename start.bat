@echo off
setlocal enabledelayedexpansion

title Urban Memory AN - Master Starter

echo ===================================================
echo   URBAN MEMORY AN - STARTING ALL SERVICES
echo ===================================================
echo.

:: Check Java setup for Spring Boot
if exist "C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.2\jbr" (
    set "JAVA_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2026.1.2\jbr"
    set "PATH=!JAVA_HOME!\bin;!PATH!"
)

:: Project Root Directory
set "ROOT_DIR=%~dp0"

echo Starting Backend Service (Spring Boot)...
start "Backend - Spring Boot (Port 8080)" cmd /k "cd /d "%ROOT_DIR%backend" && mvnw.cmd spring-boot:run"

echo Starting Official Government Portal...
start "Frontend - Official Gov Portal (Port 5173)" cmd /k "cd /d "%ROOT_DIR%frontend" && npm run dev"

echo Starting Public Citizen Portal...
start "Frontend - Public Citizen Portal (Port 5174)" cmd /k "cd /d "%ROOT_DIR%citizen-portal" && npm run dev -- --port 5174"

echo.
echo ===================================================
echo PROJECT STARTED SUCCESSFULLY
echo.
echo Backend (Spring Boot):
echo http://localhost:8080
echo.
echo Official Government Portal:
echo http://localhost:5173
echo.
echo Public Citizen Portal:
echo http://localhost:5174
echo ===================================================
echo.
echo Keep the opened terminal windows running.
echo.
pause
