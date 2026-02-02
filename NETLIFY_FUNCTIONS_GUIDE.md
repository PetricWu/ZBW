# Netlify Functions 使用指南

本文档详细介绍了项目中使用的 Netlify Functions 及其使用方法。

---

## 📋 目录

1. [什么是 Netlify Functions](#什么是-netlify-functions)
2. [Functions 列表](#functions-列表)
3. [快速开始](#快速开始)
4. [详细使用说明](#详细使用说明)
5. [配置说明](#配置说明)
6. [常见问题](#常见问题)

---

## 什么是 Netlify Functions

Netlify Functions 是 Netlify 提供的无服务器函数（Serverless Functions）功能，允许你在 Netlify 平台上运行后端代码，而无需配置和管理服务器。

**优势**：
- ✅ 无需配置服务器
- ✅ 按需计费，成本低
- ✅ 自动扩展
- ✅ 与 Netlify 无缝集成
- ✅ 支持 Node.js 和 Go

---

## Functions 列表

### 1. 文章索引更新函数

**函数名称**：`update-index`

**功能**：
- 扫描 `markdown/` 目录中的所有 `.md` 文件
- 解析每个文件的元数据（标题、关键词、描述）
- 生成/更新 `markdown/index.json` 索引文件
- 自动分类统计

**API 端点**：
- 直接调用：`/.netlify/functions/update-index`
- 重定向调用：`/api/update-index`（推荐）

**请求方法**：`GET` 或 `POST`

**返回示例**：
```json
{
  "success": true,
  "message": "成功更新文章索引，共 8 篇文章",
  "data": {
    "total": 8,
    "lastUpdated": "2026-02-01T22:40:00.000Z",
    "categories": {
      "中标公告": 3,
      "招标流程": 2,
      "其他": 1,
      "投标技巧": 1,
      "政策解读": 1
    },
    "articles": [...]
  }
}
```

**使用场景**：
- 上传新的 Markdown 文件后，更新文章索引
- 定期同步文章列表
- 批量更新文章元数据

---

### 2. 联系表单处理函数

**函数名称**：`contact`

**功能**：
- 接收并验证联系表单数据
- 可选：发送邮件通知
- 可选：保存表单数据到文件
- 返回提交结果

**API 端点**：
- 直接调用：`/.netlify/functions/contact`
- 重定向调用：`/api/contact`（推荐）

**请求方法**：`POST`

**请求参数**：
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "13800138000",
  "company": "某某公司",
  "message": "我想咨询招标代理服务..."
}
```

**字段说明**：
- `name`：姓名（必填）
- `email`：邮箱（必填，格式验证）
- `phone`：电话（可选）
- `company`：公司名称（可选）
- `message`：留言内容（必填）

**返回示例**：
```json
{
  "success": true,
  "message": "表单提交成功！我们会尽快与您联系。",
  "data": {
    "timestamp": "2026-02-01T22:40:00.000Z"
  }
}
```

**使用场景**：
- 处理联系表单提交
- 发送邮件通知
- 收集客户信息

---

## 快速开始

### 方式一：通过浏览器访问（测试）

**更新文章索引**：
1. 在浏览器中访问：`https://你的网站.netlify.app/api/update-index`
2. 查看返回的 JSON 结果

**提交表单**：
1. 使用 Postman 或类似工具
2. 发送 POST 请求到：`https://你的网站.netlify.app/api/contact`
3. 添加请求体（JSON 格式）

---

### 方式二：通过 JavaScript 调用

**更新文章索引**：
```javascript
// 方式1：使用 fetch
async function updateArticleIndex() {
  const response = await fetch('/api/update-index', {
    method: 'GET'
  });
  const result = await response.json();
  console.log(result);
  
  if (result.success) {
    alert('文章索引更新成功！');
  }
}

// 方式2：使用 fetch（POST）
async function updateArticleIndexPost() {
  const response = await fetch('/api/update-index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const result = await response.json();
  console.log(result);
}
```

**提交表单**：
```javascript
async function submitContactForm(formData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  console.log(result);
  
  if (result.success) {
    alert(result.message);
  } else {
    alert('提交失败：' + result.message);
  }
}

// 使用示例
const formData = {
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  company: '某某公司',
  message: '我想咨询招标代理服务...'
};

submitContactForm(formData);
```

---

## 详细使用说明

### 1. 配置环境变量

在 Netlify 控制台配置环境变量：

1. 进入你的站点设置
2. 点击 `Site settings` → `Environment variables`
3. 添加以下变量（可选）：

| 变量名 | 说明 | 默认值 | 示例 |
|-------|------|--------|------|
| `INDEX_FILE_PATH` | 文章索引文件路径 | `markdown/index.json` | `markdown/index.json` |
| `SAVE_FORM_DATA` | 是否保存表单数据 | `false` | `true` |
| `FORM_DATA_PATH` | 表单数据保存路径 | `form-submissions.json` | `form-submissions.json` |
| `EMAIL_TO` | 接收邮箱地址（邮件通知） | 未设置 | `contact@example.com` |
| `EMAIL_FROM` | 发送邮箱地址（邮件通知） | 未设置 | `noreply@example.com` |

---

### 2. 上传新文章后更新索引

**工作流程**：

1. **上传新的 Markdown 文件**
   - 在 GitHub 仓库的 `markdown/` 文件夹上传新文章
   - 推送到 GitHub

2. **触发索引更新**
   ```bash
   # 方法1：通过浏览器
   访问：https://你的网站.netlify.app/api/update-index
   
   # 方法2：通过 curl
   curl -X GET https://你的网站.netlify.app/api/update-index
   
   # 方法3：通过 JavaScript
   fetch('/api/update-index').then(r => r.json()).then(console.log);
   ```

3. **验证更新**
   - 访问文章列表页，检查是否显示新文章
   - 查看 `markdown/index.json` 文件内容

---

### 3. 集成联系表单

**步骤1：在 HTML 中创建表单**

```html
<form id="contactForm" onsubmit="handleSubmit(event)">
  <div class="form-group">
    <label for="name">姓名 *</label>
    <input type="text" id="name" name="name" required>
  </div>
  
  <div class="form-group">
    <label for="email">邮箱 *</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <div class="form-group">
    <label for="phone">电话</label>
    <input type="tel" id="phone" name="phone">
  </div>
  
  <div class="form-group">
    <label for="company">公司</label>
    <input type="text" id="company" name="company">
  </div>
  
  <div class="form-group">
    <label for="message">留言内容 *</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  
  <button type="submit">提交</button>
</form>

<div id="formResult" style="display: none;"></div>
```

**步骤2：添加 JavaScript 处理逻辑**

```javascript
async function handleSubmit(event) {
  event.preventDefault();
  
  // 获取表单数据
  const form = event.target;
  const formData = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    company: form.company.value,
    message: form.message.value
  };
  
  // 显示加载状态
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = '提交中...';
  
  try {
    // 提交表单
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    // 显示结果
    const resultDiv = document.getElementById('formResult');
    resultDiv.style.display = 'block';
    
    if (result.success) {
      resultDiv.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
      form.reset();
    } else {
      resultDiv.innerHTML = `<div class="alert alert-error">${result.message}</div>`;
    }
    
  } catch (error) {
    console.error('提交失败:', error);
    const resultDiv = document.getElementById('formResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div class="alert alert-error">提交失败，请稍后重试</div>';
  } finally {
    // 恢复按钮状态
    submitButton.disabled = false;
    submitButton.textContent = '提交';
  }
}
```

---

## 配置说明

### netlify.toml 配置

项目已预配置 Netlify Functions，相关配置在 `netlify.toml` 中：

```toml
[build]
  # Functions 目录
  [build.functions]
    directory = "netlify/functions"
    node_bundler = "esbuild"

# 环境变量
[context.production.environment]
  INDEX_FILE_PATH = "markdown/index.json"
  SAVE_FORM_DATA = "true"
  FORM_DATA_PATH = "form-submissions.json"

# API 重定向
[[redirects]]
  from = "/api/update-index"
  to = "/.netlify/functions/update-index"
  status = 200

[[redirects]]
  from = "/api/contact"
  to = "/.netlify/functions/contact"
  status = 200
```

### Functions 目录结构

```
netlify/
└── functions/
    ├── update-index.js    # 文章索引更新函数
    └── contact.js         # 联系表单处理函数
```

---

## 常见问题

### Q: Functions 未生效怎么办？

**A**: 检查以下几点：
1. 确保 `netlify/functions/` 目录存在
2. 确保函数文件名正确
3. 检查 `netlify.toml` 中的 `build.functions.directory` 配置
4. 查看部署日志是否有错误

### Q: 如何查看 Functions 日志？

**A**:
1. 进入 Netlify 控制台
2. 点击 `Functions` 标签
3. 选择对应的函数
4. 查看日志和调用记录

### Q: Functions 的执行时间限制是多少？

**A**:
- 免费计划：10 秒
- Pro 计划：60 秒
- Enterprise 计划：900 秒

### Q: 如何限制 Functions 的访问？

**A**:
1. 在函数中添加身份验证逻辑
2. 使用 Netlify Identity 或 JWT 验证
3. 使用 API Key 或 Token

### Q: Functions 如何调试？

**A**:
1. 使用 `console.log()` 输出日志
2. 在 Netlify 控制台查看 Functions 日志
3. 使用 Netlify CLI 本地测试：`netlify dev`
4. 使用 `netlify functions:invoke` 测试函数

### Q: 如何在本地测试 Functions？

**A**:
1. 安装 Netlify CLI：`npm install -g netlify-cli`
2. 在项目根目录运行：`netlify dev`
3. 访问 `http://localhost:8888/api/update-index`

---

## 高级功能

### 添加自定义函数

1. 在 `netlify/functions/` 目录创建新的 JS 文件
2. 导出 `handler` 函数
3. 部署后自动生效

**示例**：

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello, Netlify Functions!'
    })
  };
};
```

访问：`/.netlify/functions/hello`

---

### 集成第三方服务

**示例：集成 SendGrid 发送邮件**

1. 安装依赖：`npm install @sendgrid/mail`
2. 在函数中使用：

```javascript
const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to: 'recipient@example.com',
    from: 'sender@example.com',
    subject: '发送测试',
    text: '这是一封测试邮件'
  };
  
  await sgMail.send(msg);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

---

## 性能优化

1. **缓存结果**
   - 对于不常变化的数据，使用缓存
   - 可以使用 Netlify Functions 的缓存功能

2. **异步处理**
   - 对于耗时操作，使用异步处理
   - 返回任务 ID，稍后查询结果

3. **减少依赖**
   - 只安装必要的 npm 包
   - 减小函数体积，加快启动速度

4. **错误处理**
   - 添加完善的错误处理
   - 返回有意义的错误信息

---

## 安全建议

1. **输入验证**
   - 始终验证用户输入
   - 防止 SQL 注入、XSS 攻击

2. **环境变量**
   - 不要在代码中硬编码敏感信息
   - 使用环境变量存储密钥和密码

3. **速率限制**
   - 限制 API 调用频率
   - 防止滥用和 DDoS 攻击

4. **身份验证**
   - 对敏感函数添加身份验证
   - 使用 Netlify Identity 或 OAuth

---

## 相关资源

- [Netlify Functions 文档](https://docs.netlify.com/functions/overview/)
- [Netlify Functions API](https://docs.netlify.com/functions/create/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

---

**文档版本**：v1.0
**最后更新**：2026年2月1日
