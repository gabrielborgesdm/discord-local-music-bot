@echo off
REM Discord Local Music Bot Launcher
REM This keeps the window open if there's an error

echo Starting Discord Music Bot...
echo.

bot.exe

REM If bot.exe exits with an error, pause to show the error
if errorlevel 1 (
    echo.
    echo ========================================
    echo Bot stopped with an error.
    echo Read the error message above.
    echo ========================================
    echo.
    pause
)
