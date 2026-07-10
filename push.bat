@echo off
echo =========================================
echo 🚀 Running Git Auto-Push
echo =========================================

git add .

:: Prompt the user for the commit message
set /p commitMsg="Enter your commit message: "

:: Use the input variable in the commit command
git commit -m "%commitMsg%"

git push

echo.
echo 🎉 Success! Your changes have been pushed to GitHub.
pause