#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动生成 Markdown 文件索引脚本
功能：
1. 扫描 markdown 文件夹中的所有 .md 文件
2. 解析每个文件的元数据
3. 生成 index.json 文件

使用方法：
python generate_index.py
"""

import os
import re
import json
import subprocess
from datetime import datetime
from pathlib import Path
import hashlib

# 配置
MARKDOWN_DIR = Path("markdown")
INDEX_FILE = MARKDOWN_DIR / "index.json"

# 默认分类映射（根据文件名关键词）
DEFAULT_CATEGORIES = {
    "中标公告": ["中标公告", "中标公示", "公示", "公告"],
    "政策解读": ["政策", "解读", "法规", "法律", "条例"],
    "招标流程": ["流程", "指南", "操作", "教程"],
    "投标技巧": ["技巧", "注意", "方法", "策略"]
}


def parse_seo_meta(content, filename):
    """
    解析 Markdown 文件中的 SEO 元数据
    格式：<!-- title: xxx | keywords: xxx | description: xxx -->
    """
    lines = content.strip().split('\n')
    first_line = lines[0] if lines else ''
    
    # 默认值
    meta = {
        "title": filename.replace('.md', ''),
        "keywords": "招标代理,政府采购,工程招标,招投标服务,项目公告",
        "description": "",
        "category": ""
    }
    
    # 检查首行注释
    comment_match = re.match(r'^<!--\s*(.+?)\s*-->$', first_line)
    if comment_match:
        comment = comment_match.group(1)
        
        # 解析 title
        title_match = re.search(r'title:\s*([^|]+)', comment)
        if title_match:
            meta["title"] = title_match.group(1).strip()
        
        # 解析 keywords
        keywords_match = re.search(r'keywords:\s*([^|]+)', comment)
        if keywords_match:
            meta["keywords"] = keywords_match.group(1).strip()
        
        # 解析 description
        desc_match = re.search(r'description:\s*([^|]+)', comment)
        if desc_match:
            meta["description"] = desc_match.group(1).strip()
    
    # 自动推断分类
    filename_lower = filename.lower()
    for category, keywords in DEFAULT_CATEGORIES.items():
        if any(keyword in filename_lower for keyword in keywords):
            meta["category"] = category
            break
    
    # 如果没有分类，默认为"其他"
    if not meta["category"]:
        meta["category"] = "其他"
    
    return meta


def get_file_mtime(file_path):
    """
    获取文件的最后修改时间
    优先使用 Git 提交时间，否则使用文件系统时间戳
    """
    try:
        # 尝试使用 Git 获取最后修改时间
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%ct', str(file_path)],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0 and result.stdout.strip():
            timestamp = int(result.stdout.strip())
            return datetime.fromtimestamp(timestamp).isoformat() + 'Z'
    except (subprocess.TimeoutExpired, FileNotFoundError, ValueError):
        pass
    
    # 如果 Git 不可用，使用文件系统时间戳
    try:
        mtime = os.path.getmtime(file_path)
        return datetime.fromtimestamp(mtime).isoformat() + 'Z'
    except (OSError, ValueError):
        return datetime.now().isoformat() + 'Z'


def generate_excerpt(content, max_length=150):
    """
    从内容生成摘要
    """
    # 移除首行的 SEO 注释
    lines = content.split('\n')
    if lines and lines[0].startswith('<!--'):
        lines = lines[1:]
    content = '\n'.join(lines)
    
    # 移除 Markdown 标记
    text = re.sub(r'[#*_`~\[\]()<>]', '', content)
    text = re.sub(r'\s+', ' ', text).strip()
    
    if len(text) <= max_length:
        return text
    
    return text[:max_length] + '...'


def scan_markdown_files():
    """
    扫描 markdown 文件夹中的所有 .md 文件
    """
    if not MARKDOWN_DIR.exists():
        print(f"错误：{MARKDOWN_DIR} 文件夹不存在")
        return []
    
    markdown_files = list(MARKDOWN_DIR.glob("*.md"))
    # 排除 index.json 文件
    markdown_files = [f for f in markdown_files if f.name != "index.json"]
    
    print(f"找到 {len(markdown_files)} 个 Markdown 文件")
    return markdown_files


def generate_index():
    """
    生成 index.json 文件
    """
    print("开始生成 Markdown 索引...")
    
    # 扫描 Markdown 文件
    markdown_files = scan_markdown_files()
    
    if not markdown_files:
        print("警告：未找到 Markdown 文件")
        return
    
    # 生成文章列表
    articles = []
    for file_path in markdown_files:
        try:
            filename = file_path.name
            print(f"处理文件: {filename}")
            
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 解析元数据
            meta = parse_seo_meta(content, filename)
            
            # 生成摘要
            excerpt = generate_excerpt(content)
            
            # 如果没有 description，使用摘要
            if not meta["description"]:
                meta["description"] = excerpt
            
            # 获取最后修改时间
            date = get_file_mtime(file_path)
            
            # 生成文章条目
            article = {
                "filename": filename,
                "title": meta["title"],
                "excerpt": excerpt,
                "date": date,
                "category": meta["category"]
            }
            
            articles.append(article)
            
        except Exception as e:
            print(f"处理文件 {file_path} 时出错: {e}")
            continue
    
    # 按日期排序（最新的在前）
    articles.sort(key=lambda x: x["date"], reverse=True)
    
    # 生成索引数据
    index_data = {
        "version": "1.0",
        "lastUpdated": datetime.now().isoformat() + 'Z',
        "total": len(articles),
        "articles": articles
    }
    
    # 写入 index.json 文件
    try:
        with open(INDEX_FILE, 'w', encoding='utf-8') as f:
            json.dump(index_data, f, ensure_ascii=False, indent=2)
        
        print(f"\n✓ 成功生成 {INDEX_FILE}")
        print(f"  - 文章总数: {len(articles)}")
        print(f"  - 分类统计:")
        
        # 统计分类
        categories = {}
        for article in articles:
            cat = article["category"]
            categories[cat] = categories.get(cat, 0) + 1
        
        for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True):
            print(f"    - {cat}: {count}")
        
    except Exception as e:
        print(f"错误：无法写入 {INDEX_FILE}: {e}")


if __name__ == "__main__":
    generate_index()
