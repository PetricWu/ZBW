# Netlify Functions 快速参考

这是一个快速参考指南，帮助你快速使用 Netlify Functions。

---

## 🚀 Functions 列表

### 1. 文章索引更新函数

**端点**：`/api/update-index`
**方法**：GET 或 POST
**用途**：自动扫描 markdown 文件并更新索引

**快速调用**：

```bash
# 浏览器访问
https://你的网站.netlify.app/api/update-index

# JavaScript
fetch('/api/update-index').then(r => r.json()).then(console.log);
```

---

### 2. 联系表单处理函数

**端点**：`/api/contact`
**方法**：POST
**用途**：处理联系表单提交

**快速调用**：

```javascript
fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '张三',
    email: 'zhangsan@example.com',
    message: '我想咨询...'
  })
}).then(r => r.json()).then(console.log);
```

---

## 📝 使用场景

### 场景1：上传新文章后更新索引

1. 在 GitHub 上传新的 `.md` 文件到 `markdown/` 文件夹
2. 推送到 GitHub，触发自动部署
3. 部署完成后，访问 `https://你的网站.netlify.app/api/update-index`
4. 刷新文章列表页，查看新文章

---

### 场景2：集成联系表单

在 HTML 表单中添加：

```html
<form onsubmit="handleSubmit(event)">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">提交</button>
</form>

<script>
async function handleSubmit(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  alert(result.message);
}
</script>
```

---

## ⚙️ 配置环境变量

在 Netlify 控制台配置：

| 变量名 | 说明 | 默认值 |
|-------|------|--------|
| `INDEX_FILE_PATH` | 文章索引文件路径 | `markdown/index.json` |
| `SAVE_FORM_DATA` | 是否保存表单数据 | `false` |
| `FORM_DATA_PATH` | 表单数据保存路径 | `form-submissions.json` |

---

## 🔍 调试技巧

### 查看函数日志

1. 进入 Netlify 控制台
2. 点击 `Functions` 标签
3. 选择对应的函数
4. 查看日志和调用记录

### 本地测试

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 启动本地开发服务器
netlify dev

# 测试函数
curl http://localhost:8888/api/update-index
```

---

## 📚 详细文档

- [Netlify Functions 完整指南](./NETLIFY_FUNCTIONS_GUIDE.md)

---

**最后更新**：2026年2月1日
