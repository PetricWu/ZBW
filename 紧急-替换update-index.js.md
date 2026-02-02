# 🔴 紧急修复 - GitHub 上替换 update-index.js

## ⚠️ 当前问题

**错误**：
```json
{
  "success": false,
  "message": "无法找到 markdown 目录",
  "error": "更新文章索引失败"
}
```

**原因**：GitHub 上的 `update-index.js` 还是旧版本，没有多路径尝试代码。

---

## ✅ 立即修复（3步完成）

### Step 1: 打开 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 进入你的仓库
3. 导航到：`netlify/functions/update-index.js`

### Step 2: 完全替换文件内容

1. 点击编辑（铅笔图标）
2. **删除所有现有代码**
3. **粘贴以下完整代码**：

```javascript
/**
 * Netlify Function - 更新文章索引（修复版）
 *
 * 修复说明：
 * - 使用多路径尝试，自动适应不同的部署环境
 * - 添加详细的日志输出
 * - 增强错误处理
 */

const fs = require('fs');
const path = require('path');

// 默认分类映射
const DEFAULT_CATEGORIES = {
  "中标公告": ["中标公告", "中标公示", "公示", "公告"],
  "政策解读": ["政策", "解读", "法规", "法律", "条例"],
  "招标流程": ["流程", "指南", "操作", "教程"],
  "投标技巧": ["技巧", "注意", "方法", "策略"]
};

/**
 * 解析 Markdown 文件中的 SEO 元数据
 */
function parseSeoMeta(content, filename) {
  const lines = content.trim().split('\n');
  const firstLine = lines[0] || '';

  const meta = {
    title: filename.replace('.md', ''),
    keywords: "招标代理,政府采购,工程招标,招投标服务,项目公告",
    description: "",
    category: ""
  };

  const commentMatch = firstLine.match(/^<!--\s*(.+?)\s*-->$/);
  if (commentMatch) {
    const comment = commentMatch[1];

    const titleMatch = comment.match(/title:\s*([^|]+)/);
    if (titleMatch) {
      meta.title = titleMatch[1].trim();
    }

    const keywordsMatch = comment.match(/keywords:\s*([^|]+)/);
    if (keywordsMatch) {
      meta.keywords = keywordsMatch[1].trim();
    }

    const descMatch = comment.match(/description:\s*([^|]+)/);
    if (descMatch) {
      meta.description = descMatch[1].trim();
    }
  }

  const filenameLower = filename.toLowerCase();
  for (const [category, keywords] of Object.entries(DEFAULT_CATEGORIES)) {
    if (keywords.some(keyword => filenameLower.includes(keyword.toLowerCase()))) {
      meta.category = category;
      break;
    }
  }

  if (!meta.category) {
    meta.category = "其他";
  }

  return meta;
}

/**
 * 生成摘要
 */
function generateExcerpt(content, maxLength = 150) {
  let lines = content.split('\n');
  if (lines[0] && lines[0].startsWith('<!--')) {
    lines = lines.slice(1);
  }
  content = lines.join('\n');

  let text = content.replace(/[#*_`~\[\]()<>]/g, '');
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}

/**
 * 获取文件的最后修改时间
 */
function getFileMtime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return new Date(stats.mtime).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

/**
 * 扫描 Markdown 文件
 */
function scanMarkdownFiles(markdownDir) {
  if (!fs.existsSync(markdownDir)) {
    throw new Error(`Markdown 目录不存在: ${markdownDir}`);
  }

  const files = fs.readdirSync(markdownDir);
  const markdownFiles = files.filter(file =>
    file.endsWith('.md') && file !== 'index.json'
  );

  return markdownFiles.map(file => path.join(markdownDir, file));
}

/**
 * 主处理函数
 */
exports.handler = async (event, context) => {
  console.log('========================================');
  console.log('开始更新文章索引...');
  console.log('__dirname:', __dirname);
  console.log('========================================');

  try {
    // 尝试多个可能的路径
    const possiblePaths = [
      path.join(__dirname, 'markdown'),  // Functions 目录下的 markdown
      path.join(__dirname, '..', '..', 'markdown'),  // 项目根目录的 markdown
      path.join(__dirname, '..', 'markdown'),  // 上一级的 markdown
      'markdown',  // 相对路径
      '/var/task/markdown',  // Lambda 运行时路径
      path.join(process.cwd(), 'markdown'),  // 当前工作目录
      path.join(__dirname, '..', 'netlify', 'functions', 'markdown'),  // 备用路径
    ];

    let markdownDir = null;
    let testedPaths = [];

    for (const testPath of possiblePaths) {
      testedPaths.push(testPath);
      console.log(`尝试路径: ${testPath}`);

      try {
        const exists = fs.existsSync(testPath);
        console.log(`  - 路径存在: ${exists}`);

        if (exists) {
          markdownDir = testPath;
          console.log(`✓ 找到 markdown 目录: ${markdownDir}`);
          break;
        }
      } catch (error) {
        console.log(`  - 检测失败: ${error.message}`);
      }
    }

    if (!markdownDir) {
      console.error('========================================');
      console.error('❌ 无法找到 markdown 目录');
      console.error('尝试过的路径:');
      testedPaths.forEach(p => console.error(`  - ${p}`));
      console.error('========================================');
      throw new Error('无法找到 markdown 目录');
    }

    const indexFilePath = path.join(markdownDir, 'index.json');
    console.log('索引文件路径:', indexFilePath);

    // 列出 markdown 目录中的文件
    try {
      const files = fs.readdirSync(markdownDir);
      console.log(`Markdown 目录中的文件: ${files.length} 个`);
      files.forEach(f => console.log(`  - ${f}`));
    } catch (error) {
      console.log('无法列出文件:', error.message);
    }

    // 扫描 Markdown 文件
    const markdownFiles = scanMarkdownFiles(markdownDir);
    console.log(`找到 ${markdownFiles.length} 个 Markdown 文件`);

    if (markdownFiles.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: '未找到 Markdown 文件',
          articles: []
        })
      };
    }

    // 生成文章列表
    const articles = [];
    for (const filePath of markdownFiles) {
      try {
        const filename = path.basename(filePath);
        console.log(`处理文件: ${filename}`);

        const content = fs.readFileSync(filePath, 'utf-8');

        const meta = parseSeoMeta(content, filename);

        const excerpt = generateExcerpt(content);

        if (!meta.description) {
          meta.description = excerpt;
        }

        const date = getFileMtime(filePath);

        articles.push({
          filename: filename,
          title: meta.title,
          excerpt: excerpt,
          date: date,
          category: meta.category
        });

      } catch (error) {
        console.error(`处理文件 ${filePath} 时出错:`, error.message);
        continue;
      }
    }

    // 按日期排序
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 生成索引数据
    const indexData = {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      total: articles.length,
      articles: articles
    };

    // 写入 index.json 文件
    fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2), 'utf-8');

    // 统计分类
    const categories = {};
    articles.forEach(article => {
      const cat = article.category;
      categories[cat] = (categories[cat] || 0) + 1;
    });

    const categoryStats = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, count]) => `${cat}: ${count}`)
      .join(', ');

    console.log('========================================');
    console.log('✓ 成功生成索引文件');
    console.log(`  - 文章总数: ${articles.length}`);
    console.log(`  - 分类统计: ${categoryStats}`);
    console.log('========================================');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: `成功更新文章索引，共 ${articles.length} 篇文章`,
        data: {
          total: articles.length,
          lastUpdated: indexData.lastUpdated,
          categories: categories,
          articles: articles
        }
      })
    };

  } catch (error) {
    console.error('========================================');
    console.error('❌ 更新索引失败');
    console.error('错误:', error.message);
    console.error('堆栈:', error.stack);
    console.error('========================================');

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: error.message || '更新文章索引失败',
        error: '更新文章索引失败',
        debug: {
          error: error.message,
          __dirname: __dirname,
          cwd: process.cwd()
        }
      })
    };
  }
};
```

### Step 3: 提交更改

1. 填写提交信息：`fix: replace update-index.js with multi-path version`
2. 点击 `Commit changes`
3. **等待 Netlify 自动部署**（1-2分钟）

---

## 🔍 验证修复

部署完成后，访问：

```
https://earnest-figolla-70c546.netlify.app/api/update-index
```

**预期成功响应**：
```json
{
  "success": true,
  "message": "成功更新文章索引，共 8 篇文章",
  "data": {
    "total": 8,
    "lastUpdated": "2026-02-02T...",
    "categories": {...},
    "articles": [...]
  }
}
```

---

## 💡 如果还是失败

### 查看部署日志

1. 登录 [Netlify](https://app.netlify.com)
2. 找到你的网站
3. 点击 `Deploys`
4. 点击最新部署
5. 查看日志，应该看到：

```
========================================
开始更新文章索引...
__dirname: /var/task/...
========================================
尝试路径: /var/task/markdown
  - 路径存在: true
✓ 找到 markdown 目录: /var/task/markdown
Markdown 目录中的文件: 9 个
  - 城市轨道交通工程中标公告.md
  - ...
找到 8 个 Markdown 文件
...
```

### 手动触发部署

如果自动部署没有触发：

1. 在 Netlify 控制台
2. 点击 `Site settings`
3. 滚动到 `Build & deploy`
4. 点击 `Trigger deploy` → `Deploy site`

---

## 🎯 关键改进

新的代码包含：

1. **7个可能的路径** - 确保能找到 markdown 目录
2. **详细的日志输出** - 方便调试
3. **更好的错误处理** - 提供调试信息
4. **文件列表显示** - 确认找到文件

---

**立即操作**：在 GitHub 上替换 `update-index.js` 的全部内容，提交更改！
