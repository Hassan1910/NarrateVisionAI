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

REM Check if remote origin exists
git remote -v | findstr origin >nul
if %ERRORLEVEL% neq 0 (
    echo.
    echo No GitHub remote found. Let's set up GitHub...
    echo.
    set /p GITHUB_USERNAME="Enter your GitHub username: "
    set /p REPO_NAME="Enter repository name [narratevision]: "

    if "%REPO_NAME%"=="" set REPO_NAME=narratevision

    echo.
    echo Setting up GitHub repository...
    echo.
    echo 1. Go to https://github.com/new
    echo 2. Create a new repository named '%REPO_NAME%'
    echo 3. Do NOT initialize with README, .gitignore, or license
    echo 4. Come back here when done
    echo.
    pause

    echo Adding GitHub remote...
    git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git

    echo.
    echo Pushing to GitHub...
    git push -u origin main
) else (
    echo GitHub remote already configured.

    echo.
    echo Committing changes...
    git add .
    git commit -m "Update NarrateVision for Vercel deployment"

    echo Pushing to GitHub...
    git push
)

echo.
echo GitHub setup completed!
echo.
echo Your code has been pushed to GitHub.
echo.
echo Next steps:
echo 1. Go to https://vercel.com/new to create a new Vercel project
echo 2. Import your GitHub repository
echo 3. Configure environment variables in Vercel
echo 4. Deploy your project
echo.
echo For more details, see GITHUB_DEPLOYMENT.md and GITHUB_ACTIONS.md
echo.
pause
