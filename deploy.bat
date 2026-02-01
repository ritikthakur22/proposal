@echo off
:: Simple helper to push latest changes and trigger a Vercel deploy.
:: Usage:
::   1. Make sure you have already run `git remote add origin <your_repo_url>` once.
::   2. Make sure `vercel login` has been completed (CLI is authenticated).
::   3. Run this script from the project folder.

setlocal

echo.
echo === Romantic Proposal Site Deployment ===

:: Step 1: add/commit any pending changes
git status -sb
echo.
set /p COMMIT_MSG="Commit message (leave blank to skip commit): "
if not "%COMMIT_MSG%"=="" (
    echo.
    echo Adding all changes...
    git add .
    echo Committing with message: %COMMIT_MSG%
    git commit -m "%COMMIT_MSG%"
) else (
    echo Skipping commit step.
)

:: Step 2: push to origin/main
echo.
echo Pushing to origin main...
git push origin main
if errorlevel 1 (
    echo.
    echo Push failed. Please fix the issue above and re-run the script.
    exit /b 1
)

:: Step 3: trigger Vercel deployment
echo.
echo Deploying to Vercel...
vercel --confirm --prod
if errorlevel 1 (
    echo.
    echo Vercel deployment failed. Check the log above.
    exit /b 1
)

echo.
echo Deployment finished! The URL above is your live site.
endlocal
