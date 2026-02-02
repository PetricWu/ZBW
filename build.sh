#!/bin/bash

# Netlify 构建脚本
# 在部署前准备所有必要的文件

echo "=========================================="
echo "Netlify 部署前构建"
echo "=========================================="

# 1. 确保 netlify/functions/markdown 目录存在
echo "📁 创建 netlify/functions/markdown 目录..."
mkdir -p netlify/functions/markdown

# 2. 复制所有 markdown 文件到 Functions 目录
echo "📋 复制 markdown 文件到 Functions 目录..."
if [ -d "markdown" ]; then
    cp markdown/*.md netlify/functions/markdown/ 2>/dev/null || true
    cp markdown/index.json netlify/functions/markdown/ 2>/dev/null || true
    echo "✅ Markdown 文件已复制"
else
    echo "⚠️  markdown 目录不存在"
fi

# 3. 统计文件数量
markdown_count=$(find netlify/functions/markdown -name "*.md" | wc -l)
echo "📊 已复制 $markdown_count 个 markdown 文件"

# 4. 显示完成的文件列表
echo ""
echo "📁 Functions 目录中的 markdown 文件："
ls -la netlify/functions/markdown/ | grep ".md$" || echo "  (无文件)"

echo ""
echo "=========================================="
echo "构建完成 ✅"
echo "=========================================="
