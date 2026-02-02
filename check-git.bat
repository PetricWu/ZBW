@echo off
chcp 65001 >nul
echo ==========================================
echo Git 仓库诊断工具 (Windows 版本)
echo ==========================================
echo.

REM 检查是否是 Git 仓库
if not exist ".git" (
    echo ❌ 当前目录不是 Git 仓库
    echo.
    echo 请先初始化 Git 仓库：
    echo   git init
    echo.
    pause
    exit /b 1
)

echo ✅ 当前目录是 Git 仓库
echo.

REM 检查 Git 状态
echo 📊 Git 状态：
echo.
git status
echo.

REM 检查未跟踪的文件
echo 🔍 未跟踪的文件（前20个）：
git ls-files --others --exclude-standard | findstr /n "^" | findstr "^[1-9]" | findstr /v "^[2-9][0-9]" | findstr /v "^[1-9][0-9][0-9]" | more
echo.

REM 检查已修改的文件
echo 🔍 已修改的文件（前20个）：
git diff --name-only | findstr /n "^" | findstr "^[1-9]" | findstr /v "^[2-9][0-9]" | findstr /v "^[1-9][0-9][0-9]" | more
echo.

REM 检查暂存区的文件
echo 🔍 暂存区的文件（前20个）：
git diff --cached --name-only | findstr /n "^" | findstr "^[1-9]" | findstr /v "^[2-9][0-9]" | findstr /v "^[1-9][0-9][0-9]" | more
echo.

REM 检查关键文件是否存在
echo 🔍 关键文件检查：
echo.

if exist "css\style.css" (
    git ls-files | findstr /c:"css/style.css" >nul
    if %errorlevel%==0 (
        echo ✅ css/style.css - 已提交到 Git
    ) else (
        echo ⚠️  css/style.css - 文件存在但未提交到 Git
    )
) else (
    echo ❌ css/style.css - 文件不存在
)

if exist "images\logo.png" (
    git ls-files | findstr /c:"images/logo.png" >nul
    if %errorlevel%==0 (
        echo ✅ images/logo.png - 已提交到 Git
    ) else (
        echo ⚠️  images/logo.png - 文件存在但未提交到 Git
    )
) else if exist "images\logo.svg" (
    git ls-files | findstr /c:"images/logo.svg" >nul
    if %errorlevel%==0 (
        echo ✅ images/logo.svg - 已提交到 Git
    ) else (
        echo ⚠️  images/logo.svg - 文件存在但未提交到 Git
    )
) else (
    echo ❌ images/logo.png / logo.svg - 文件不存在
)

if exist "netlify.toml" (
    git ls-files | findstr /c:"netlify.toml" >nul
    if %errorlevel%==0 (
        echo ✅ netlify.toml - 已提交到 Git
    ) else (
        echo ⚠️  netlify.toml - 文件存在但未提交到 Git
    )
) else (
    echo ❌ netlify.toml - 文件不存在
)

echo.
echo ==========================================
echo 📁 所有已提交的 CSS 文件：
echo ==========================================
git ls-files | findstr "\.css$" | sort
echo.

echo ==========================================
echo 📁 所有已提交的图片文件：
echo ==========================================
git ls-files | findstr "\.png$ \.jpg$ \.jpeg$ \.gif$ \.svg$" | sort
echo.

echo ==========================================
echo 📦 文件统计：
echo ==========================================
for /f %%i in ('git ls-files ^| find /c /v ""') do set commit_count=%%i
for /f %%i in ('git ls-files --others --exclude-standard ^| find /c /v ""') do set untracked_count=%%i
for /f %%i in ('git diff --name-only ^| find /c /v ""') do set modified_count=%%i

echo 已提交文件总数：%commit_count%
echo 未跟踪文件数：%untracked_count%
echo 已修改文件数：%modified_count%
echo.

echo ==========================================
echo 💡 建议：
echo ==========================================
echo.
echo 如果有关键文件未提交，请执行：
echo   git add .
echo   git commit -m "add all files"
echo   git push
echo.

pause
