#!/bin/bash

echo "=========================================="
echo "Git 仓库诊断工具"
echo "=========================================="
echo ""

# 检查是否是 Git 仓库
if [ ! -d ".git" ]; then
    echo "❌ 当前目录不是 Git 仓库"
    echo ""
    echo "请先初始化 Git 仓库："
    echo "  git init"
    echo ""
    exit 1
fi

echo "✅ 当前目录是 Git 仓库"
echo ""

# 检查 Git 状态
echo "📊 Git 状态："
echo ""
git status
echo ""

# 检查未跟踪的文件
echo "🔍 未跟踪的文件："
git ls-files --others --exclude-standard | head -20
echo ""

# 检查已修改的文件
echo "🔍 已修改的文件："
git diff --name-only | head -20
echo ""

# 检查暂存区的文件
echo "🔍 暂存区的文件："
git diff --cached --name-only | head -20
echo ""

# 检查关键文件是否存在
echo "🔍 关键文件检查："
echo ""

if [ -f "css/style.css" ]; then
    if git ls-files | grep -q "css/style.css"; then
        echo "✅ css/style.css - 已提交到 Git"
    else
        echo "⚠️  css/style.css - 文件存在但未提交到 Git"
    fi
else
    echo "❌ css/style.css - 文件不存在"
fi

if [ -f "images/logo.png" ]; then
    if git ls-files | grep -q "images/logo.png"; then
        echo "✅ images/logo.png - 已提交到 Git"
    else
        echo "⚠️  images/logo.png - 文件存在但未提交到 Git"
    fi
elif [ -f "images/logo.svg" ]; then
    if git ls-files | grep -q "images/logo.svg"; then
        echo "✅ images/logo.svg - 已提交到 Git"
    else
        echo "⚠️  images/logo.svg - 文件存在但未提交到 Git"
    fi
else
    echo "❌ images/logo.png / logo.svg - 文件不存在"
fi

if [ -f "netlify.toml" ]; then
    if git ls-files | grep -q "netlify.toml"; then
        echo "✅ netlify.toml - 已提交到 Git"
    else
        echo "⚠️  netlify.toml - 文件存在但未提交到 Git"
    fi
else
    echo "❌ netlify.toml - 文件不存在"
fi

echo ""
echo "=========================================="
echo "📁 所有已提交的 CSS 文件："
echo "=========================================="
git ls-files | grep "\.css$" | sort
echo ""

echo "=========================================="
echo "📁 所有已提交的图片文件："
echo "=========================================="
git ls-files | grep -E "\.(png|jpg|jpeg|gif|svg)$" | sort
echo ""

echo "=========================================="
echo "📦 文件统计："
echo "=========================================="
echo "已提交文件总数：$(git ls-files | wc -l)"
echo "未跟踪文件数：$(git ls-files --others --exclude-standard | wc -l)"
echo "已修改文件数：$(git diff --name-only | wc -l)"
echo ""

echo "=========================================="
echo "💡 建议："
echo "=========================================="
echo ""
echo "如果有关键文件未提交，请执行："
echo "  git add ."
echo "  git commit -m 'add all files'"
echo "  git push"
echo ""
