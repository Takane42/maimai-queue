@echo off
REM Test script to manually trigger the daily queue completion
REM Usage: test-daily-completion.bat [BASE_URL]

set BASE_URL=%1
if "%BASE_URL%"=="" set BASE_URL=http://localhost:3000

echo Testing daily queue completion at %BASE_URL%...

curl -s -X POST "%BASE_URL%/api/cron/complete-daily" -H "Content-Type: application/json"

echo.
echo Test completed.
