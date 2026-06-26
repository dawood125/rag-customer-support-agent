@echo off
cd /d "D:\Website development\Node js data\Project Build Myself\ai-support-saas\backend"
if exist server_check.log del server_check.log
start /b "" cmd /c "npx ts-node-dev --transpile-only --no-respawn src/index.ts > server_check.log 2>&1"
timeout /t 10 /nobreak >nul
type server_check.log