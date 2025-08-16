@echo off
REM Windows Task Scheduler Setup for Study Reminders
REM Run this script as Administrator

echo Setting up Windows Task Scheduler for Study Reminders...
echo.

REM Get current directory
set SCRIPT_DIR=%~dp0
set PROJECT_DIR=%SCRIPT_DIR%..
set NODE_PATH=node
set SCRIPT_PATH=%SCRIPT_DIR%cron-study-reminders.js

echo Project Directory: %PROJECT_DIR%
echo Script Path: %SCRIPT_PATH%
echo.

REM Check if node is available
%NODE_PATH% --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found in PATH
    echo Please install Node.js or add it to your PATH
    pause
    exit /b 1
)

echo Node.js found: 
%NODE_PATH% --version

REM Create the scheduled task
echo.
echo Creating scheduled task 'Vibed-to-Cracked-Study-Reminders'...

schtasks /create ^
    /tn "Vibed-to-Cracked-Study-Reminders" ^
    /tr "cmd /c cd /d \"%PROJECT_DIR%\" && %NODE_PATH% \"%SCRIPT_PATH%\"" ^
    /sc minute ^
    /mo 30 ^
    /f ^
    /ru "NT AUTHORITY\SYSTEM"

if errorlevel 1 (
    echo.
    echo ERROR: Failed to create scheduled task
    echo Make sure you're running as Administrator
    pause
    exit /b 1
)

echo.
echo ✅ Scheduled task created successfully!
echo.
echo Task Details:
echo - Name: Vibed-to-Cracked-Study-Reminders
echo - Schedule: Every 30 minutes
echo - Action: Run study reminders cron job (respects individual user times)
echo.
echo To modify the schedule, use Task Scheduler GUI or run:
echo schtasks /change /tn "Vibed-to-Cracked-Study-Reminders" /st NEW_TIME
echo.
echo To delete the task:
echo schtasks /delete /tn "Vibed-to-Cracked-Study-Reminders" /f
echo.

REM Test the task (optional)
set /p test_now="Do you want to test the task now? (y/n): "
if /i "%test_now%"=="y" (
    echo.
    echo Testing the task...
    schtasks /run /tn "Vibed-to-Cracked-Study-Reminders"
    echo Task triggered. Check the logs for results.
)

echo.
echo Setup complete!
pause