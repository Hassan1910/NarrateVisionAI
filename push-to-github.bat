@echo off
echo NarrateVision GitHub Setup Tool
echo ==============================
echo.

REM Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Git is not installed. Please install Git from https://git-scm.com/downloads
    pause
    exit /b 1
)

REM Check if repository is already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit"
) else (
    echo Git repository already initialized.
)

REM Set the specific GitHub repository
echo.
echo Setting up GitHub repository: https://github.com/Hassan1910/NarrateVisionAI.git
echo.

REM Check if remote origin exists
git remote -v | findstr origin >nul
if %ERRORLEVEL% neq 0 (
    echo Adding GitHub remote...
    git remote add origin https://github.com/Hassan1910/NarrateVisionAI.git
    
    echo.
    echo Pushing to GitHub...
    git push -u origin main
) else (
    echo Removing existing GitHub remote...
    git remote remove origin
    
    echo Adding new GitHub remote...
    git remote add origin https://github.com/Hassan1910/NarrateVisionAI.git
    
    echo.
    echo Committing changes...
    git add .
    git commit -m "Update NarrateVision for GitHub deployment"
    
    echo Pushing to GitHub...
    git push -u origin main
)

echo.
echo GitHub setup completed!
echo.
echo Your code has been pushed to GitHub: https://github.com/Hassan1910/NarrateVisionAI.git
echo.
pause
