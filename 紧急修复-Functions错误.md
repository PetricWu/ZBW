# 🔴 紧急修复指南 - Functions 500 错误

## 🚨 当前问题

**错误信息**：
```json
{
  "success": false,
  "message": "Markdown 目录不存在: markdown",
  "error": "更新文章索引失败"
}
```

**症状**：
- `/api/update-index` 返回 500 错误
- Functions 无法找到 markdown 文件

---

## 🎯 立即修复（5分钟）

### 方案 A：手动在 GitHub 上修复（最快）⭐

#### Step 1: 在 GitHub 上编辑 `update-index.js`

1. 登录 [GitHub](https://github.com)
2. 进入你的仓库
3. 点击 `netlify` 文件夹
4. 点击 `functions` 文件夹
5. 点击 `update-index.js`
6. 点击编辑（铅笔图标）

#### Step 2: 找到并替换这段代码

**找到**（大约在第 135-145 行）：
```javascript
exports.handler = async (event, context) => {
  console.log('开始更新文章索引...');

  try {
    // 使用相对路径（Netlify Functions 运行时路径）
    const markdownDir = path.join(__dirname, 'markdown');
    const indexFilePath = path.join(markdownDir, 'index.json');

    console.log('Markdown 目录:', markdownDir);
    console.log('索引文件路径:', indexFilePath);

    // 扫描 Markdown 文件
    const markdownFiles = scanMarkdownFiles(markdownDir);
```

**替换为**：
```javascript
exports.handler = async (event, context) => {
  console.log('开始更新文章索引...');
  console.log('__dirname:', __dirname);

  try {
    // 尝试多个可能的路径
    const possiblePaths = [
      path.join(__dirname, 'markdown'),  // Functions 目录下的 markdown
      path.join(__dirname, '..', '..', 'markdown'),  // 项目根目录的 markdown
      'markdown',  // 相对路径
      '/var/task/markdown',  // Lambda 运行时路径
    ];

    let markdownDir = null;
    for (const testPath of possiblePaths) {
      console.log('尝试路径:', testPath);
      if (fs.existsSync(testPath)) {
        markdownDir = testPath;
        console.log('找到 markdown 目录:', markdownDir);
        break;
      }
    }

    if (!markdownDir) {
      console.error('无法找到 markdown 目录，尝试过的路径:', possiblePaths);
      throw new Error('无法找到 markdown 目录');
    }

    const indexFilePath = path.join(markdownDir, 'index.json');

    console.log('索引文件路径:', indexFilePath);

    // 扫描 Markdown 文件
    const markdownFiles = scanMarkdownFiles(markdownDir);
```

#### Step 3: 提交更改

1. 填写提交信息：`fix: update update-index.js to try multiple paths`
2. 点击 `Commit changes`
3. 等待 Netlify 自动部署（1-2分钟）

#### Step 4: 验证修复

访问：
```
https://你的网站.netlify.app/api/update-index
```

应该看到成功响应。

---

### 方案 B：使用修复后的压缩包

#### Step 1: 下载最新压缩包

下载 `tender-website.tar.gz`

#### Step 2: 只上传更新后的文件

从压缩包中提取以下文件，上传到 GitHub：

```
netlify/functions/update-index.js
```

#### Step 3: 在 GitHub 上提交

1. 在 GitHub 上打开 `netlify/functions/update-index.js`
2. 粘贴新的代码
3. 提交更改

#### Step 4: 等待部署并验证

---

## 🔍 如何验证修复

### 1. 使用测试工具

访问：
```
https://你的网站.netlify.app/test-functions.html
```

点击"测试 update-index API"按钮。

### 2. 直接访问 API

访问：
```
https://你的网站.netlify.app/api/update-index
```

**成功的响应**：
```json
{
  "success": true,
  "message": "成功更新文章索引，共 8 篇文章",
  "data": {
    "total": 8,
    "lastUpdated": "2026-02-02T...",
    "categories": {
      "政策解读": 2,
      "招标流程": 2,
      "中标公告": 2,
      "投标技巧": 1,
      "其他": 1
    },
    "articles": [...]
  }
}
```

---

## 💡 为什么之前的修复没有生效？

### 可能的原因

1. **代码没有更新**：用户上传的压缩包还是旧版本
2. **缓存问题**：Netlify 没有重新部署，使用了旧代码
3. **路径问题**：之前的代码只尝试了一个路径，如果该路径不存在就会失败

### 新的解决方案

新的代码会**尝试多个路径**：
- `netlify/functions/markdown/`
- `markdown/` (项目根目录)
- `相对路径`
- `Lambda 运行时路径`

找到第一个存在的路径就使用它。

---

## 📊 Functions 405 错误说明

**错误**：
```
/api/contact - 405 Method Not Allowed
```

**说明**：
- 这是**正常现象**，不是错误
- `/api/contact` API 只接受 POST 请求
- 使用 GET 请求访问会返回 405

**测试方法**：
```bash
# 正确的 POST 请求
curl -X POST \
  https://你的网站.netlify.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"测试","email":"test@example.com","message":"测试消息"}'
```

---

## 🚀 完整修复流程

### Step 1: 在 GitHub 上编辑 update-index.js

按照"方案 A"的步骤操作

### Step 2: 等待部署

Netlify 会自动检测到更改并重新部署（1-2分钟）

### Step 3: 验证修复

访问 `/api/update-index` 检查是否成功

### Step 4: 测试其他功能

- 访问文章列表页：`/articles.html`
- 测试联系表单：`/contact.html`
- 使用测试工具：`/test-functions.html`

---

## 📞 还是有问题？

### 检查清单

- [ ] 确认 update-index.js 已经更新到最新版本
- [ ] 确认 Netlify 已经部署（查看 Netlify 控制台的部署日志）
- [ ] 清除浏览器缓存（Ctrl+Shift+Delete）
- [ ] 使用无痕模式访问

### 查看部署日志

1. 登录 [Netlify](https://app.netlify.com)
2. 找到你的网站
3. 点击 `Deploys`
4. 点击最新的部署
5. 查看 `Build log` 和 `Functions log`

### 检查 Functions 日志

在部署日志中，查找 Functions 相关的日志输出：

```
Starting Netlify Functions
开始更新文章索引...
__dirname: /var/task/...
尝试路径: /var/task/markdown
找到 markdown 目录: /var/task/markdown
```

---

## 🎉 预期结果

修复后：

| 功能 | 状态 |
|------|------|
| `/api/update-index` | ✅ 返回成功 |
| `/api/contact` (POST) | ✅ 正常工作 |
| `/api/contact` (GET) | ✅ 返回 405 (正常) |
| 文章列表 | ✅ 正常加载 |
| 文章详情 | ✅ 正常显示 |

---

## 📚 相关文档

- **test-functions.html** - Functions 测试工具
- **Functions错误修复.md** - 详细修复文档
- **README-FINAL.md** - 最终说明文档

---

**版本**: v3.7 - 紧急修复
**日期**: 2026年2月2日
**状态**: 已修复，等待部署

---

**立即操作**：在 GitHub 上编辑 `netlify/functions/update-index.js`，替换代码，提交更改！
