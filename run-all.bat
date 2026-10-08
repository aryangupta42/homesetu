@echo off
title HomeSetu - Full Stack Launcher
echo ========================================================
echo   HomeSetu: Starting Backend and Frontend
echo ========================================================
start cmd /k run-backend.bat
timeout /t 3 /nobreak >nul
start cmd /k run-frontend.bat
echo HomeSetu full stack services launched!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8088/api
pause
