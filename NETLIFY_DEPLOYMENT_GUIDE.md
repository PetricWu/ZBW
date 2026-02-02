# Netlify 自动部署指南

本指南将帮助您将招标代理网站部署到 Netlify，并实现从 GitHub 自动部署。

## 📋 前置要求

- GitHub 账号
- Netlify 账号（[https://www.netlify.com](https://www.netlify.com)）
- 已安装 Git
- 项目的完整代码

---

## 🚀 部署步骤

### 方式一：通过 Netlify 网站部署（推荐新手）

#### 第一步：推送代码到 GitHub

1. **初始化 Git 仓库**（如果还没有）
```bash
cd /workspace/projects
git init
```

2. **添加所有文件**
```bash
git add .
```

3. **创建首次提交**
```bash
git commit -m "feat: 初始版本 - 招标代理网站"
```

4. **创建 GitHub 仓库**
   - 访问 [https://github.com/new](https://github.com/new)
   - 创建新仓库（例如：`tender-website`）
   - 不要初始化 README 或 .gitignore（我们已经有了）

5. **关联远程仓库并推送**
```bash
git remote add origin https://github.com/你的用户名/tender-website.git
git branch -M main
git push -u origin main
```

#### 第二步：在 Netlify 创建站点

1. **登录 Netlify**
   - 访问 [https://app.netlify.com](https://app.netlify.com)
   - 使用 GitHub 账号登录

2. **创建新站点**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "GitHub"

3. **授权 Netlify 访问 GitHub**
   - 点击 "Configure Netlify on GitHub"
   - 选择要部署的仓库（`tender-website`）
   - 点击 "Install"

4. **配置构建设置**
   - **Build command**: 留空（静态HTML无需构建）
   - **Publish directory**: `.`（项目根目录）
   - 点击 "Deploy site"

5. **等待部署完成**
   - Netlify 会自动构建和部署您的站点
   - 部署完成后，您会得到一个随机域名（如：`https://random-name.netlify.app`）

#### 第三步：配置自定义域名（可选）

1. **设置域名**
   - 进入 Site settings → Domain management
   - 点击 "Add custom domain"
   - 输入您的域名（例如：`www.yourdomain.com`）

2. **配置 DNS**
   - 按照 Netlify 提供的说明配置 DNS 记录
   - 通常需要添加 CNAME 记录指向 `your-site-name.netlify.app`

3. **启用 HTTPS**
   - 在 Domain management 中点击 "HTTPS" 标签
   - 点击 "Enable HTTPS"（免费 Let's Encrypt 证书）

---

### 方式二：使用 Netlify CLI（推荐开发者）

#### 第一步：安装 Netlify CLI

```bash
npm install -g netlify-cli
```

#### 第二步：登录 Netlify

```bash
netlify login
```

#### 第三步：初始化部署

```bash
cd /workspace/projects
netlify init
```

按照提示操作：
1. 选择 "Create & configure a new site"
2. 选择团队
3. 站点名称（留空自动生成）
4. 选择部署命令：`npm run build`（留空）
5. 发布目录：`.`（项目根目录）

#### 第四步：部署

```bash
netlify deploy --prod
```

---

## 🔄 自动部署配置

### 启用 GitHub 集成

Netlify 会自动检测 GitHub 仓库的推送，实现自动部署：

1. **自动触发条件**
   - 推送到 `main` 分支
   - 推送到 `master` 分支
   - 创建 Pull Request

2. **部署流程**
   ```
   GitHub Push → Netlify Webhook → 自动构建 → 自动部署
   ```

3. **查看部署历史**
   - 在 Netlify 控制台 → Deploys 标签
   - 可以查看所有部署历史和状态

### 配置分支部署（可选）

如果需要在多个分支测试：

1. 进入 Site settings → Build & deploy → Branches
2. 添加分支（如：`develop`、`staging`）
3. 每个分支会生成独立的预览链接

---

## 📝 文章系统部署说明

### 重要：关于文章索引更新

由于 Netlify 是静态网站托管平台，无法直接运行 Python 脚本，因此需要采用以下方案：

#### 方案一：预生成索引（推荐）

**工作流程**：
1. 在本地添加新的 Markdown 文件到 `markdown/` 目录
2. 在本地运行 `python generate_index.py` 更新 `index.json`
3. 将更新后的文件提交到 GitHub
4. Netlify 自动部署，包含最新的文章列表

**优点**：
- 简单直接，无需额外配置
- 部署速度快
- 适合偶尔更新文章的场景

#### 方案二：使用 Netlify Functions（高级）

如果需要在线更新文章，可以使用 Netlify Functions：

1. 创建 `netlify/functions/generate-index.py`
2. 配置环境变量
3. 通过 API 触发索引更新

**此方案需要额外开发工作，建议使用方案一。**

---

## ⚙️ 配置文件说明

### netlify.toml

项目根目录的 `netlify.toml` 文件已包含以下配置：

- **发布目录**：`.`
- **构建命令**：留空（静态HTML）
- **重定向规则**：SPA 路由支持
- **HTTP 头**：安全头设置
- **缓存策略**：优化资源加载
- **性能优化**：自动压缩和优化

### .gitignore

已配置 `.gitignore` 文件，排除以下内容：
- 系统文件（`.DS_Store`、`Thumbs.db`）
- 编辑器配置（`.vscode`、`.idea`）
- 依赖目录（`node_modules`）
- Python 缓存（`__pycache__`）
- 日志文件（`*.log`）
- 临时文件（`*.tmp`）

---

## 🎯 SEO 和性能优化

### 已配置的优化项

1. **HTTP 安全头**
   - X-Frame-Options
   - X-XSS-Protection
   - X-Content-Type-Options
   - Referrer-Policy

2. **缓存策略**
   - 图片：1年
   - CSS/JS：1天

3. **自动优化**
   - CSS 压缩和合并
   - JS 压缩和合并
   - 图片压缩

4. **SEO 优化**
   - 百度 SEO 元数据
   - 结构化数据
   - Open Graph

---

## 🔍 部署后检查清单

部署完成后，请检查以下项目：

- [ ] 首页能正常访问
- [ ] 所有页面链接正常
- [ ] 图片资源能正常加载
- [ ] 文章列表能正常显示
- [ ] 文章详情页能正常跳转
- [ ] 移动端显示正常
- [ ] 表单提交功能正常（如果有）
- [ ] 搜索功能正常（如果有）
- [ ] HTTPS 证书正常
- [ ] 自定义域名正常（如果有）

---

## 📊 监控和分析

### Netlify 内置功能

1. **部署日志**
   - 查看构建和部署日志
   - 排查部署问题

2. **函数日志**
   - 如果使用 Netlify Functions

3. **表单处理**
   - Netlify 表单提交记录

### 第三方分析

可以集成以下分析工具：

1. **百度统计**
   - 编辑 `config.js`
   - 设置 `analytics.baidu` 为您的统计 ID

2. **Google Analytics**
   - 编辑 `config.js`
   - 设置 `analytics.google` 为您的跟踪 ID

---

## 🐛 常见问题

### Q: 部署后页面显示 404？

A: 检查以下内容：
1. 文件路径是否正确
2. 大小写是否一致（Linux 区分大小写）
3. 检查 Netlify 部署日志

### Q: 图片无法加载？

A: 检查以下内容：
1. 图片文件是否已提交到 Git
2. 图片路径是否正确（区分大小写）
3. 检查浏览器控制台错误

### Q: 文章列表不更新？

A: 按照以下步骤操作：
1. 在本地运行 `python generate_index.py`
2. 将更新后的 `markdown/index.json` 提交到 Git
3. 推送到 GitHub 触发自动部署

### Q: 如何撤销部署？

A:
1. 进入 Netlify 控制台 → Deploys
2. 找到要回退的部署
3. 点击 "Publish deploy" 重新发布旧版本

### Q: 如何设置环境变量？

A:
1. 进入 Site settings → Environment variables
2. 点击 "Add variable"
3. 添加所需的环境变量

---

## 📚 相关资源

- [Netlify 官方文档](https://docs.netlify.com/)
- [Netlify 与 GitHub 集成](https://docs.netlify.com/site-deploys/create-deploys/#deploy-with-git)
- [Netlify 配置文件](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## 💡 最佳实践

1. **使用语义化提交信息**
   - `feat: 添加新功能`
   - `fix: 修复问题`
   - `docs: 更新文档`
   - `style: 代码格式调整`

2. **定期更新依赖**
   - 定期检查并更新依赖包
   - 测试更新后的兼容性

3. **监控部署状态**
   - 设置 Slack/Email 通知
   - 及时处理部署失败

4. **备份重要数据**
   - 定期备份 Markdown 文件
   - 保留 `index.json` 的历史版本

5. **性能优化**
   - 定期检查 Lighthouse 分数
   - 优化图片和资源加载

---

## 🎉 完成！

您的网站现在已部署到 Netlify，并支持从 GitHub 自动部署。每次推送代码到 GitHub，Netlify 都会自动构建和部署您的站点。

**下一步**：
1. 配置自定义域名
2. 设置分析工具（百度统计、Google Analytics）
3. 添加 SEO 优化
4. 设置监控和通知

祝您使用愉快！🚀
