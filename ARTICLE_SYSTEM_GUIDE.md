# 文章系统使用指南

## 概述

本项目的文章系统支持通过 Markdown 文件动态加载和显示文章内容。文章列表会自动从 `markdown/` 目录中加载，并支持文章详情页的展示。

## 工作流程

1. **上传 Markdown 文件**：将新的 Markdown 文件放入 `markdown/` 目录
2. **生成索引文件**：运行 `generate_index.py` 脚本生成/更新 `index.json`
3. **前端自动加载**：前端页面会自动从 `index.json` 加载文章列表
4. **文章详情展示**：用户点击文章标题，跳转到文章详情页

## 使用步骤

### 1. 创建 Markdown 文件

在 `markdown/` 目录中创建新的 Markdown 文件（例如：`新文章.md`）。

文件格式示例：

```markdown
<!-- title: 文章标题 | keywords: 关键词1,关键词2 | description: 文章描述 -->

# 文章标题

文章内容...

## 二级标题

更多内容...
```

**SEO 元数据说明**：
- `title`：文章标题（百度：20-30个中文字符）
- `keywords`：关键词（百度：≤5个，用逗号分隔）
- `description`：文章描述（百度：80-120个中文字符）

### 2. 生成索引文件

在项目根目录运行：

```bash
python generate_index.py
```

该脚本会：
- 扫描 `markdown/` 目录中的所有 `.md` 文件
- 解析每个文件的元数据
- 生成/更新 `markdown/index.json` 文件

**注意**：每次添加新的 Markdown 文件后，都需要运行此脚本来更新索引。

### 3. 刷新前端页面

刷新浏览器页面，文章列表会自动更新并显示新上传的文章。

## 文件结构

```
workspace/projects/
├── markdown/                    # Markdown 文件目录
│   ├── index.json              # 文章索引文件（由 generate_index.py 生成）
│   ├── 文章1.md                # Markdown 文件
│   ├── 文章2.md
│   └── ...
├── generate_index.py           # 索引生成脚本
├── index.html                  # 首页（显示最新文章列表）
├── post.html                   # 文章详情页
├── articles.html               # 文章列表页
└── js/
    └── main.js                 # 核心脚本（处理文章加载和渲染）
```

## 配置说明

在 `config.js` 中可以配置：

```javascript
const SITE_CONFIG = {
  // 首页显示最新文章数量
  homeArticlesCount: 5,

  // 文章列表每页显示数量
  articlesPerPage: 10,

  // 摘要长度（字符数）
  excerptLength: 150,

  // 是否启用文章摘要自动生成
  autoGenerateExcerpt: true
};
```

## 常见问题

### Q: 上传了新文章，但文章列表没有更新？

A: 需要运行 `python generate_index.py` 来更新 `index.json` 文件。

### Q: 文章点击后跳转到 404 页面？

A: 检查以下内容：
1. Markdown 文件名是否正确（包括扩展名 `.md`）
2. 文件是否存在于 `markdown/` 目录中
3. `index.json` 中是否包含该文章的信息

### Q: 文章内容显示为"加载中..."？

A: 检查以下内容：
1. 检查浏览器控制台是否有错误信息
2. 确保 `marked.min.js` 已正确加载
3. 确保 Markdown 文件内容格式正确

### Q: 如何修改文章列表的排序？

A: 默认按日期排序（最新的在前）。如需修改排序方式，可以编辑 `generate_index.py` 脚本中的排序逻辑。

## 技术细节

### 索引文件格式（index.json）

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-01T22:20:33.191874Z",
  "total": 8,
  "articles": [
    {
      "filename": "文章1.md",
      "title": "文章标题",
      "excerpt": "文章摘要...",
      "date": "2026-02-01T22:20:33.191874Z",
      "category": "分类名称"
    }
  ]
}
```

### 文章详情页 URL 格式

```
/post.html?file=文章1.md
```

文件名会自动进行 URL 编码，支持中文文件名。

## 维护建议

1. **定期更新索引**：每次添加新文章后，记得运行 `generate_index.py`
2. **SEO 优化**：在 Markdown 文件首行添加 SEO 元数据（title、keywords、description）
3. **分类管理**：通过文件名关键词自动分类，可以在 `generate_index.py` 中调整分类规则
4. **备份索引**：建议将 `index.json` 纳入版本控制

## 测试验证

项目包含一篇测试文章（`markdown/测试文章.md`），可以用来验证文章系统是否正常工作。

验证步骤：
1. 访问首页，查看文章列表是否包含"测试文章标题"
2. 点击文章标题，跳转到文章详情页
3. 验证文章内容是否正确渲染

## 支持与反馈

如有问题，请检查：
1. 浏览器控制台日志（F12）
2. 服务器日志（`/app/work/logs/bypass/`）
3. 确保所有依赖文件已正确加载
