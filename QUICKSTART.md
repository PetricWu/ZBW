# 快速开始指南

> **5分钟部署你的招标代理网站到 Netlify**

---

## 🎯 准备工作

- GitHub 账号（免费注册：[github.com](https://github.com)）
- Netlify 账号（免费注册：[netlify.com](https://netlify.com)）

---

## 📤 第一步：推送到 GitHub（2分钟）

### 1.1 创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - **Repository name**: `tender-website`（或自定义）
   - **Public**: 勾选
4. 点击 `Create repository`

### 1.2 上传文件

**方式 A：网页上传（推荐新手）**

1. 在新仓库页面，点击 `uploading an existing file`
2. 将项目所有文件拖入上传区
3. 填写提交信息：`初始版本`
4. 点击 `Commit changes`

**方式 B：Git 命令上传**

```bash
# 进入项目目录
cd /workspace/projects

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "初始版本"

# 关联远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/tender-website.git

# 推送
git push -u origin main
```

---

## 🚀 第二步：部署到 Netlify（3分钟）

### 2.1 连接 GitHub

1. 访问 [https://app.netlify.com](https://app.netlify.com)
2. 使用 GitHub 账号登录
3. 点击 `Add new site` → `Import an existing project`
4. 选择 `GitHub`

### 2.2 授权并选择仓库

1. 点击 `Configure Netlify on GitHub`
2. 选择 `tender-website` 仓库
3. 点击 `Install`

### 2.3 配置构建设置

- **Build command**: 留空
- **Publish directory**: `.`（点）
- 点击 `Deploy site`

### 2.4 等待部署完成

- 约 30-60 秒后部署完成
- 得到域名：`https://xxx.netlify.app`
- 点击访问你的网站！

---

## 🎉 第三步：配置自定义域名（可选）

### 3.1 添加域名

1. 进入 Netlify 站点设置 → `Domain management`
2. 点击 `Add custom domain`
3. 输入你的域名（如：`www.yourdomain.com`）

### 3.2 配置 DNS

1. 按照提示配置 DNS 记录（通常是 CNAME）
2. 等待 DNS 生效（几分钟到几小时）

### 3.3 启用 HTTPS

1. 在 `Domain management` 中点击 `HTTPS`
2. 点击 `Enable HTTPS`

---

## 📝 发布新文章

### 方式一：网页上传

1. 在 GitHub 仓库进入 `markdown` 文件夹
2. 点击 `Add file` → `Upload files`
3. 上传 `.md` 文件
4. 提交更改

### 方式二：Git 命令

```bash
# 添加新文章到 markdown 文件夹
cp 新文章.md markdown/

# 更新索引（在项目根目录）
python generate_index.py

# 提交并推送
git add markdown/index.json markdown/新文章.md
git commit -m "添加新文章"
git push
```

### 方式三：使用 Netlify Functions（推荐）

**更新文章索引**：

1. 在 GitHub 上传新的 `.md` 文件到 `markdown/` 文件夹
2. 推送到 GitHub，触发自动部署
3. 部署完成后，在浏览器访问：
   ```
   https://你的网站.netlify.app/api/update-index
   ```
4. 等待几秒，索引自动更新
5. 刷新文章列表页，查看新文章

**JavaScript 调用**：

```javascript
// 更新文章索引
fetch('/api/update-index')
  .then(response => response.json())
  .then(result => {
    console.log(result);
    if (result.success) {
      alert('文章索引更新成功！');
    }
  });
```

**注意**：Netlify Functions 会自动读取 `markdown/` 目录中的所有 `.md` 文件，并生成 `index.json`。无需手动运行 Python 脚本。

---

## ⚙️ 修改网站信息

编辑 `config.js` 文件：

```javascript
const SITE_CONFIG = {
  siteName: "你的公司名称",
  siteDescription: "你的网站描述",

  contact: {
    companyName: "你的公司全称",
    address: "你的地址",
    phone: "你的电话",
    email: "你的邮箱"
  }
};
```

修改后提交到 GitHub，自动更新。

---

## 🔍 常见问题

**Q: 部署后页面无法访问？**

A: 检查以下几点：
1. GitHub 仓库是否已创建
2. Netlify 是否已成功连接 GitHub
3. 查看部署日志是否有错误

**Q: 图片无法显示？**

A: 确保 `images/` 文件夹已推送到 GitHub。

**Q: 文章列表不更新？**

A: 运行 `python generate_index.py` 更新索引，然后提交 `markdown/index.json` 文件。

**Q: 如何撤销部署？**

A: 在 Netlify 控制台的 `Deploys` 标签，选择要回退的版本，点击 `Publish deploy`。

---

## 📚 更多文档

- [完整部署指南](./NETLIFY_DEPLOYMENT_GUIDE.md)
- [Netlify Functions 指南](./NETLIFY_FUNCTIONS_GUIDE.md) ⭐ 新增
- [文章系统指南](./ARTICLE_SYSTEM_GUIDE.md)
- [详细 README](./README.md)

---

## 🎊 完成！

你的网站现在已部署到 Netlify，支持从 GitHub 自动更新。

**下一步**：
1. [配置自定义域名](https://docs.netlify.com/domains-https/custom-domains/)
2. [设置百度统计](https://tongji.baidu.com)
3. [添加更多文章](./ARTICLE_SYSTEM_GUIDE.md)

祝使用愉快！🚀
