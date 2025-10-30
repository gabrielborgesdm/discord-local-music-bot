@echo off
REM Discord Local Music Bot Launcher
REM Standalone - no installation required!

echo Starting Discord Music Bot...
echo.

bot.exe

REM If bot exits with an error, pause to show the error
if errorlevel 1 (
    echo.
    echo ========================================
    echo Bot stopped with an error.
    echo Read the error message above.
    echo ========================================
    echo.
    pause
)
