@echo off
echo NarrateVision GitHub and Vercel Deployment Tool
echo =============================================
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
    echo Would you like to push to GitHub now? (Y/N)
    set /p PUSH_NOW="Push now? "
    if /i "%PUSH_NOW%"=="Y" (
        echo Pushing to GitHub...
        git push -u origin master
    )
) else (
    echo GitHub remote already configured.

    echo.
    echo Would you like to commit and push changes to GitHub? (Y/N)
    set /p COMMIT_PUSH="Commit and push? "
    if /i "%COMMIT_PUSH%"=="Y" (
        set /p COMMIT_MSG="Enter commit message [Update NarrateVision]: "
        if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update NarrateVision

        echo Committing changes...
        git add .
        git commit -m "%COMMIT_MSG%"

        echo Pushing to GitHub...
        git push
    )
)

echo.
echo GitHub setup completed!
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Vercel CLI is not installed. Installing...
    npm install -g vercel
)

echo.
echo Would you like to deploy to Vercel now? (Y/N)
set /p DEPLOY_NOW="Deploy to Vercel? "
if /i "%DEPLOY_NOW%"=="Y" (
    echo Running Vercel deployment...
    vercel --prod
    echo Deployment process completed!
) else (
    echo Skipping Vercel deployment.
)

echo.
echo All tasks completed!
pause
