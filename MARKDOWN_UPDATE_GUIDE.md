# Markdown 文章更新指南

## 问题说明

网站依赖于 `markdown/index.json` 文件来展示文章列表。当你上传新的 `.md` 文件到 `markdown/` 目录后，需要重新生成 `index.json` 文件，否则新文章不会显示在网站上。

## 解决方案

### 方案一：自动构建（推荐）

Vercel 已配置自动构建，每次推送代码时会自动运行 `node build-index.js` 生成索引。

**使用步骤：**
1. 将新的 `.md` 文件添加到 `markdown/` 目录
2. 确保 Markdown 文件格式正确（见下方格式要求）
3. 提交并推送到 GitHub
4. Vercel 自动触发构建，几分钟后新文章就会显示

### 方案二：手动生成索引

如果需要手动更新索引，可以运行以下命令：

```bash
node build-index.js
```

### 方案三：本地预览

本地开发时，运行以下命令启动服务器：

```bash
# 先生成索引
node build-index.js

# 启动服务器
python -m http.server 5000
```

访问 http://localhost:5000 查看效果。

---

## Markdown 文件格式要求

### 标准格式（推荐）

在 Markdown 文件开头添加 Front Matter（元数据），格式如下：

```markdown
<!-- title: 文章标题 | keywords: 关键词1,关键词2,关键词3 | description: 文章描述 -->

# 文章主标题（可选，如果没写 title，将使用第一个 # 标题）

文章内容...
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题，百度SEO建议20-30个中文字符 |
| `description` | 是 | 文章描述，百度SEO建议80-120个中文字符 |
| `keywords` | 否 | 关键词，百度SEO建议≤5个，用逗号分隔 |
| `category` | 否 | 文章分类，默认为"招标信息" |
| `date` | 否 | 发布日期，默认为当前时间 |

### 示例文件

```markdown
<!-- title: 2024年政府采购新政策解读 | keywords: 政府采购,政策解读,招标代理 | description: 详细解读2024年政府采购新政策变化，包括采购方式、流程优化、监管要求等内容。 -->

# 2024年政府采购新政策解读

## 政策背景

随着招投标市场的不断发展...

## 主要变化

1. 采购方式优化
2. 流程简化
3. 监管加强
```

---

## 常见问题

### Q1: 上传新文件后，网站看不到新文章？

**A:** 检查以下几点：
1. 文件是否放在 `markdown/` 目录下
2. 文件扩展名是否为 `.md`
3. Front Matter 格式是否正确
4. Vercel 是否已完成部署（检查 Vercel 仪表板）
5. 尝试强制刷新浏览器（Ctrl+F5）

### Q2: 文章标题显示错误？

**A:** 确保在 `<!-- -->` 注释中正确填写 `title` 字段。如果没有 `title`，系统会使用第一个 `#` 标题。

### Q3: 如何修改文章顺序？

**A:** 修改文件名，按字母顺序排序，或者手动编辑 `markdown/index.json` 文件中的 `articles` 数组顺序。

### Q4: 如何删除文章？

**A:** 删除对应的 `.md` 文件，然后重新运行 `node build-index.js` 生成索引。

### Q5: 支持中文文件名吗？

**A:** 支持！但建议使用英文或拼音文件名，避免编码问题。例如：
- ✅ `zhengfu-caigou-2024.md`
- ❌ `2024年政府采购.md`

---

## 技术细节

### build-index.js 功能

1. 自动扫描 `markdown/` 目录下所有 `.md` 文件
2. 解析每个文件的 Front Matter（元数据）
3. 提取文章摘要（前200字）
4. 生成 `markdown/index.json` 索引文件

### Vercel 构建配置

`vercel.json` 已配置：

```json
{
  "buildCommand": "node build-index.js"
}
```

每次部署时自动执行构建脚本。

---

## 目录结构

```
project/
├── markdown/              # Markdown 文件目录
│   ├── index.json        # 自动生成的索引文件
│   ├── article1.md       # 文章文件
│   ├── article2.md       # 文章文件
│   └── ...
├── build-index.js        # 索引生成脚本
├── vercel.json          # Vercel 配置
└── ...
```

---

## 联系支持

如果遇到问题，请检查：
1. 浏览器控制台是否有错误
2. Vercel 部署日志
3. 文件格式是否符合要求

---

**最后更新：** 2026-02-01
