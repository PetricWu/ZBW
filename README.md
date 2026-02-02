# 华诚招标代理网站 - 支持Netlify/Vercel部署

> **零基础操作指南**：本教程语言通俗，无专业术语，看完即会，无需任何开发基础。
>
> **部署方式**：支持 Netlify（推荐）和 Vercel 两种部署方式，任选其一即可。

---

## 📋 目录

1. [项目简介](#项目简介)
2. [准备工作](#准备工作)
3. [第一步：上传源码到GitHub](#第一步上传源码到github)
4. [第二步：选择部署方式](#第二步选择部署方式)
   - [方案一：Netlify部署（推荐新手）](#方案一netlify部署推荐新手)
   - [方案二：Vercel部署](#方案二vercel部署)
5. [第三步：发布文章（实时更新）](#第三步发布文章实时更新)
6. [Netlify Functions 使用（推荐）](#netlify-functions-使用推荐)
7. [百度SEO配置指南](#百度seo配置指南)
8. [配置文件说明](#配置文件说明)
9. [素材替换方法](#素材替换方法)
9. [常见问题](#常见问题)

---

## 项目简介

这是一个专为招标代理行业设计的纯静态网站，具有以下特点：

- ✅ **单仓库管理**：源码和文章都在同一个GitHub仓库
- ✅ **自动部署**：推送代码到GitHub，Netlify/Vercel自动构建部署
- ✅ **多平台支持**：支持 Netlify（推荐）和 Vercel 两种部署方式
- ✅ **Netlify Functions**：支持无服务器函数，自动更新文章索引、处理表单提交 ⭐
- ✅ **百度SEO深度优化**：专为百度搜索引擎优化的TDK、结构化数据、站点地图
- ✅ **手工设计质感**：拒绝AI模板化，呈现自然专业质感
- ✅ **轻量技术栈**：HTML+CSS+原生JS，无需复杂框架
- ✅ **零维护成本**：纯静态部署，无服务器维护

---

## 准备工作

在开始之前，请准备以下内容：

| 项目 | 说明 | 获取方式 |
|-----|------|---------|
| GitHub账号 | 代码托管平台 | [github.com](https://github.com) 免费注册 |
| Vercel账号 | 网站部署平台 | [vercel.com](https://vercel.com) 免费注册 |
| 网站LOGO | 建议200x60像素 | 自行设计或委托设计 |
| 轮播图 | 建议1200x450像素，3张 | 自行设计或委托设计 |
| 机构联系信息 | 地址、电话、邮箱等 | 准备真实信息 |

---

## 第一步：上传源码到GitHub

GitHub是全球最大的代码托管平台，我们将把网站源码上传到GitHub进行管理。

### 方法一：网页端上传（推荐新手）

**Step 1：创建新仓库**

1. 登录 [GitHub](https://github.com)
2. 点击右上角 `+` 号，选择 `New repository`
3. 填写仓库信息：
   - **Repository name**：`tender-agent-website`（可自定义）
   - **Description**：`招标代理公司官网`
   - **Public**：选择公开（免费）
   - **Add a README**：不勾选
4. 点击 `Create repository` 创建仓库

**Step 2：上传文件**

1. 在新创建的仓库页面，点击 `uploading an existing file` 链接
2. 将本文件夹内的所有文件和文件夹拖入上传区域：
   - `css/` 文件夹
   - `js/` 文件夹
   - `images/` 文件夹（包含banner和icon子文件夹）
   - `markdown/` 文件夹
   - `seo/` 文件夹
   - `config.js`
   - `vercel.json`
   - `index.html`
   - `articles.html`
   - `article.html`
   - `about.html`
   - `contact.html`
   - `404.html`
3. 在 `Commit changes` 区域填写：
   - **Commit message**：`初始上传`
4. 点击 `Commit changes` 完成上传

### 方法二：Git命令上传（适合有Git基础的用户）

```bash
# 1. 进入项目文件夹
cd tender-agent-website

# 2. 初始化Git仓库
git init

# 3. 添加所有文件
git add .

# 4. 提交文件
git commit -m "初始上传"

# 5. 关联远程仓库（将YOUR_USERNAME替换为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/tender-agent-website.git

# 6. 推送到GitHub
git push -u origin main
```

**✅ 完成标志**：在GitHub仓库页面能看到所有上传的文件

---

## 第二步：选择部署方式

本项目支持 **Netlify** 和 **Vercel** 两种部署方式，任选其一即可：

| 特性 | Netlify | Vercel |
|-----|---------|--------|
| 难度 | ⭐ 超简单 | ⭐⭐ 简单 |
| 速度 | ⚡ 快 | ⚡⚡ 超快 |
| 配置 | 零配置 | 简单配置 |
| 推荐人群 | 新手首选 | 开发者 |

### 方案一：Netlify部署（推荐新手）

Netlify 是最简单的静态网站托管平台，支持一键部署，无需任何配置。

#### 关联GitHub仓库

**Step 1：登录Netlify**

1. 访问 [https://app.netlify.com](https://app.netlify.com)
2. 点击 `Sign up` 注册账号（建议用GitHub账号登录）

**Step 2：创建站点**

1. 登录后，点击 `Add new site` → `Import an existing project`
2. 选择 `GitHub`
3. 授权 Netlify 访问你的 GitHub 仓库（点击 `Configure Netlify on GitHub`）
4. 选择你的 `tender-agent-website` 仓库，点击 `Install`
5. 配置构建设置：
   - **Build command**: 留空（静态HTML无需构建）
   - **Publish directory**: `.`（项目根目录）
6. 点击 `Deploy site`

**Step 3：等待部署完成**

- 部署过程约需30秒-1分钟
- 部署成功后，Netlify会分配一个域名，如：`https://random-name.netlify.app`
- 点击域名即可访问你的网站

**Step 4：配置自定义域名（可选）**

1. 在Netlify项目设置中，点击 `Domain management` → `Add custom domain`
2. 输入你的域名（例如：`www.yourdomain.com`）
3. 按照提示配置DNS解析（通常是CNAME记录）
4. 等待DNS生效（通常需要几分钟到几小时）

**✅ 完成标志**：通过Netlify分配的域名能正常访问网站

---

### 方案二：Vercel部署

Vercel是专业的静态网站托管平台，与GitHub配合可实现自动部署。

#### 关联GitHub仓库

**Step 1：登录Vercel**

1. 访问 [vercel.com](https://vercel.com)
2. 点击 `Sign Up` 注册账号（建议用GitHub账号登录）

**Step 2：导入项目**

1. 登录后，点击 `Add New...` → `Project`
2. 在 `Import Git Repository` 区域，找到 `tender-agent-website`，点击 `Import`
3. 配置项目：
   - **Project Name**：`tender-agent-website`（可自定义）
   - **Framework Preset**：选择 `Other`（纯静态网站）
   - **Root Directory**：`./`（根目录）
   - **Build Command**：留空（纯静态网站无需构建）
   - **Output Directory**：`./`（根目录）
4. 点击 `Deploy` 开始部署

**Step 3：等待部署完成**

- 部署过程约需1-2分钟
- 部署成功后，Vercel会分配一个域名，如：`https://tender-agent-website.vercel.app`
- 点击域名即可访问你的网站

**Step 4：配置自定义域名（可选）**

1. 在Vercel项目设置中，点击 `Settings` → `Domains`
2. 点击 `Add` 添加你的域名
3. 按照提示配置DNS解析

**✅ 完成标志**：通过Vercel分配的域名能正常访问网站

---

## 第三步：发布文章（实时更新）

这是网站的核心功能：修改Markdown文件并推送到GitHub，网站自动更新。

### Markdown文件命名规范

- 文件名即文章标题，支持中文
- 文件扩展名必须是 `.md`
- 示例：`政府采购法最新修订解读.md`

### 百度SEO首行注释规范（推荐）

在Markdown文件的第一行添加注释，可自定义SEO信息：

```markdown
<!-- title: 文章标题 | keywords: 关键词1,关键词2 | description: 文章描述 -->
```

**百度SEO字符数要求：**
- **title**：20-30个中文字符（百度搜索结果最优展示）
- **keywords**：≤5个关键词（用逗号分隔）
- **description**：80-120个中文字符

**示例：**

```markdown
<!-- title: 政府采购法最新修订解读 | keywords: 政府采购法,政策解读,招标代理 | description: 深入解读政府采购法最新修订内容，了解对招标代理行业的影响及企业应对策略。 -->

# 政府采购法最新修订解读

正文内容...
```

**不添加注释时**，系统会自动：
- 标题：使用文件名（去掉.md）
- 关键词：使用网站配置的默认关键词
- 描述：使用正文前100字

### 发布新文章

**方法一：网页端操作（推荐新手）**

1. 登录GitHub，进入你的仓库
2. 点击进入 `markdown` 文件夹
3. 点击 `Add file` → `Upload files`
4. 拖入或选择你的 `.md` 文件
5. 填写提交信息：`添加新文章：XXX`
6. 点击 `Commit changes`

**方法二：Git命令操作**

```bash
# 1. 进入项目文件夹
cd tender-agent-website

# 2. 将新文章放入markdown文件夹
# （把你的.md文件复制到markdown文件夹）

# 3. 添加新文件
git add markdown/你的文章.md

# 4. 提交
git commit -m "添加新文章：文章标题"

# 5. 推送到GitHub
git push
```

### 修改文章

1. 在GitHub仓库中进入 `markdown` 文件夹
2. 点击要修改的 `.md` 文件
3. 点击右上角的编辑按钮（铅笔图标）
4. 修改内容
5. 填写提交信息：`修改文章：XXX`
6. 点击 `Commit changes`

### 删除文章

1. 在GitHub仓库中进入 `markdown` 文件夹
2. 点击要删除的 `.md` 文件
3. 点击右上角的删除按钮（垃圾桶图标）
4. 填写提交信息：`删除文章：XXX`
5. 点击 `Commit changes`

**✅ 更新机制**：
- 推送到GitHub后，Netlify/Vercel会自动检测变化
- 约30秒-2分钟后，网站自动更新
- 无需手动操作任何后台

---

## Netlify Functions 使用（推荐）

Netlify Functions 是项目的核心功能之一，提供无服务器函数支持，无需配置服务器即可运行后端代码。

### 什么是 Netlify Functions

Netlify Functions 允许你在 Netlify 平台上运行后端代码，具有以下优势：

- ✅ **无服务器**：无需配置和管理服务器
- ✅ **自动扩展**：按需自动扩展
- ✅ **成本低**：按使用量计费
- ✅ **无缝集成**：与 Netlify 无缝集成

### 可用的 Functions

项目内置了两个 Functions：

#### 1. 文章索引更新函数（`update-index`）

**功能**：
- 自动扫描 `markdown/` 目录中的所有 `.md` 文件
- 解析每个文件的元数据（标题、关键词、描述）
- 自动生成/更新 `markdown/index.json` 索引文件
- 自动分类统计

**调用方式**：

**方法1：浏览器访问**
```
https://你的网站.netlify.app/api/update-index
```

**方法2：JavaScript 调用**
```javascript
fetch('/api/update-index')
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('索引更新成功，共', result.data.total, '篇文章');
    }
  });
```

**使用场景**：
- 上传新的 Markdown 文件后，更新文章索引
- 无需手动运行 Python 脚本
- 实时同步文章列表

#### 2. 联系表单处理函数（`contact`）

**功能**：
- 接收并验证联系表单数据
- 可选：发送邮件通知
- 可选：保存表单数据到文件
- 返回提交结果

**调用方式**：

**JavaScript 调用**
```javascript
const formData = {
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  company: '某某公司',
  message: '我想咨询招标代理服务...'
};

fetch('/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
})
.then(response => response.json())
.then(result => {
  if (result.success) {
    alert(result.message);
  }
});
```

### 如何使用 Functions

**步骤1：确保 Functions 已部署**

Netlify 会自动部署 Functions，无需额外配置。部署成功后，Functions 即可使用。

**步骤2：配置环境变量（可选）**

在 Netlify 控制台配置环境变量：

1. 进入站点设置 → `Environment variables`
2. 添加以下变量（可选）：

| 变量名 | 说明 | 默认值 |
|-------|------|--------|
| `INDEX_FILE_PATH` | 文章索引文件路径 | `markdown/index.json` |
| `SAVE_FORM_DATA` | 是否保存表单数据 | `false` |
| `FORM_DATA_PATH` | 表单数据保存路径 | `form-submissions.json` |

**步骤3：调用 Functions**

使用浏览器、JavaScript 或 curl 调用 Functions。

### Functions 配置

Functions 配置在 `netlify.toml` 中：

```toml
[build]
  [build.functions]
    directory = "netlify/functions"
    node_bundler = "esbuild"

# API 重定向
[[redirects]]
  from = "/api/update-index"
  to = "/.netlify/functions/update-index"

[[redirects]]
  from = "/api/contact"
  to = "/.netlify/functions/contact"
```

### 详细文档

查看 [Netlify Functions 指南](./NETLIFY_FUNCTIONS_GUIDE.md) 了解更多详情。

---

## 百度SEO配置指南

### 1. 百度资源平台验证

为了让百度更好地收录你的网站，需要在百度资源平台验证网站所有权。

**方法一：HTML标签验证（推荐，最简单）**

1. 登录 [百度资源平台](https://ziyuan.baidu.com)
2. 点击 `用户中心` → `站点管理` → `添加网站`
3. 输入你的网站地址，如：`https://your-site.vercel.app`
4. 选择验证方式：`HTML标签验证`
5. 复制验证代码中的 `content` 值（如：`abcDEF123ghiJKL`）
6. 打开 `config.js`，粘贴到 `verification.baidu` 字段
7. 推送到GitHub，等待Vercel更新
8. 返回百度资源平台，点击 `完成验证`

**方法二：CNAME验证**

1. 选择验证方式：`CNAME验证`
2. 复制验证字符串（如：`verify_abc123.yourdomain.com`）
3. 在你的域名DNS管理后台添加CNAME记录
4. 等待DNS生效后，点击 `完成验证`

**方法三：TXT记录验证**

1. 选择验证方式：`TXT记录验证`
2. 复制验证字符串
3. 在你的域名DNS管理后台添加TXT记录
4. 等待DNS生效后，点击 `完成验证`

### 2. 百度统计配置

1. 登录 [百度统计](https://tongji.baidu.com)
2. 点击 `新增网站`
3. 输入网站域名，获取统计代码
4. 复制代码中 `hm.js?` 后面的ID（如：`abc123def456`）
5. 打开 `config.js`，粘贴到 `analytics.baidu` 字段
6. 推送到GitHub，等待Vercel更新

### 3. 提交网站地图

1. 在百度资源平台，进入你的网站
2. 点击 `资源提交` → `Sitemap`
3. 输入sitemap地址：`https://your-site.vercel.app/sitemap.xml`
4. 点击 `提交`

### 4. 百度SEO优化自查清单

| 检查项 | 要求 | 状态 |
|-------|------|------|
| 百度资源平台验证 | 已完成 | ☐ |
| 百度统计配置 | 已完成 | ☐ |
| 网站地图提交 | 已完成 | ☐ |
| 每篇文章有TDK | 标题20-30字，描述80-120字 | ☐ |
| 图片有alt属性 | 所有图片都有中文alt | ☐ |
| URL层级≤3级 | 文章URL格式：/article/标题.html | ☐ |
| 移动端适配 | 响应式设计，无单独移动域名 | ☐ |

---

## 配置文件说明

`config.js` 是网站的核心配置文件，修改以下配置即可自定义网站。

### 基础信息配置

```javascript
const SITE_CONFIG = {
  // 网站名称（百度搜索结果展示）
  siteName: "华诚招标代理",
  
  // 网站描述（百度搜索摘要，控制在80-120字）
  siteDescription: "华诚招标代理是专业招标代理服务机构...",
  
  // 网站URL（部署后修改为实际域名）
  siteUrl: "https://your-site.vercel.app",
  
  // LOGO配置
  logo: "/images/logo.png",
  logoAlt: "华诚招标代理-专业招标代理服务机构"
};
```

### 联系信息配置

```javascript
contact: {
  companyName: "华诚招标代理有限公司",
  address: "北京市朝阳区建国路88号SOHO现代城A座1206室",
  phone: "400-888-6666",
  email: "contact@huacheng-tender.com"
}
```

### 百度SEO关键词配置

```javascript
// 核心关键词，用于全站SEO（≤5个）
seoKeywords: [
  "招标代理",
  "政府采购",
  "工程招标",
  "招投标服务",
  "项目公告"
]
```

### 百度统计配置

```javascript
analytics: {
  // 百度统计ID（将YOUR_BAIDU_ID替换为实际ID）
  baidu: "YOUR_BAIDU_ID",
  
  // 谷歌分析跟踪ID（可选）
  google: ""
}
```

### 百度资源平台验证配置

```javascript
verification: {
  // HTML标签验证代码（推荐）
  baidu: "YOUR_BAIDU_VERIFICATION_CODE",
  
  // CNAME验证值（可选）
  baiduCname: "",
  
  // TXT验证值（可选）
  baiduTxt: ""
}
```

### 轮播图配置

```javascript
banner: {
  // 是否自动播放
  autoplay: true,
  
  // 轮播间隔（毫秒）
  interval: 5000,
  
  // 轮播图数据
  slides: [
    {
      image: "/images/banner/banner-1.jpg",
      alt: "华诚招标代理-专业政府采购招标代理服务",
      title: "专业招标代理服务",
      subtitle: "政府采购 · 工程招标 · 项目咨询"
    }
  ]
}
```

---

## 素材替换方法

### 替换LOGO

1. 准备LOGO图片，建议尺寸：200x60像素
2. 将图片命名为 `logo.png`
3. 替换 `images/logo.png` 文件
4. 推送到GitHub

### 替换轮播图

1. 准备轮播图，建议尺寸：1200x450像素
2. 将图片命名为 `banner-1.jpg`、`banner-2.jpg`、`banner-3.jpg`
3. 替换 `images/banner/` 文件夹内的图片
4. 推送到GitHub

### 替换网站图标

1. 准备图标，建议尺寸：32x32或64x64像素
2. 将图片命名为 `favicon.png`
3. 替换 `images/favicon.png` 文件
4. 推送到GitHub

### 替换Open Graph图片

1. 准备图片，建议尺寸：1200x630像素
2. 将图片命名为 `og-image.png`
3. 替换 `images/og-image.png` 文件
4. 推送到GitHub

---

## 常见问题

### Q1：网站部署后显示404怎么办？

**可能原因和解决方法：**

1. **文件未正确上传**
   - 检查GitHub仓库中是否有 `index.html` 文件
   - 确保文件在根目录，不是在子文件夹中

2. **Vercel配置问题**
   - 检查 `vercel.json` 文件是否正确上传
   - 重新部署网站

3. **路径问题**
   - 检查所有链接是否以 `/` 开头
   - 确保 `vercel.json` 中的路由配置正确

### Q2：文章发布后没有显示怎么办？

**排查步骤：**

1. 检查文件扩展名是否为 `.md`
2. 检查文件是否在 `markdown` 文件夹中
3. 检查 `markdown/index.json` 是否包含该文章
4. 清除浏览器缓存后刷新
5. 检查Vercel部署日志是否有错误

### Q3：如何修改网站配色？

1. 打开 `css/style.css`
2. 找到 `:root` 部分的CSS变量
3. 修改颜色值：
   ```css
   :root {
     --gov-blue: #005EA5;  /* 主色调 */
     --gov-gray: #F5F7FA;  /* 背景色 */
   }
   ```
4. 推送到GitHub

### Q4：如何添加新页面？

1. 复制一个现有HTML文件（如 `about.html`）
2. 重命名为新页面名称（如 `service.html`）
3. 修改页面内容和标题
4. 在导航栏中添加链接
5. 推送到GitHub

### Q5：如何备份网站？

由于所有文件都在GitHub上，GitHub本身就是最好的备份：

1. 定期将GitHub仓库下载到本地备份
2. 或使用Git命令克隆到本地：
   ```bash
   git clone https://github.com/YOUR_USERNAME/tender-agent-website.git
   ```

### Q6：百度不收录怎么办？

1. **检查robots.txt**：确保允许百度爬虫访问
2. **提交sitemap**：在百度资源平台提交网站地图
3. **主动推送**：使用百度资源平台的主动推送功能
4. **增加外链**：在其他网站添加指向你网站的链接
5. **保持更新**：定期发布新文章，保持网站活跃

---

## 相关文档

本项目包含详细的文档，帮助您快速上手：

| 文档 | 说明 |
|-----|------|
| [QUICKSTART.md](./QUICKSTART.md) | 5分钟快速开始指南 |
| [NETLIFY_DEPLOYMENT_GUIDE.md](./NETLIFY_DEPLOYMENT_GUIDE.md) | Netlify 详细部署指南 |
| [NETLIFY_FUNCTIONS_GUIDE.md](./NETLIFY_FUNCTIONS_GUIDE.md) | Netlify Functions 使用指南 ⭐ |
| [ARTICLE_SYSTEM_GUIDE.md](./ARTICLE_SYSTEM_GUIDE.md) | 文章系统使用指南 |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | 部署检查清单 |
| [PROJECT_FILES.md](./PROJECT_FILES.md) | 项目文件说明 |

---

## 技术支持

如遇到无法解决的问题，可以通过以下方式获取帮助：

1. **查看Vercel文档**：[vercel.com/docs](https://vercel.com/docs)
2. **查看GitHub文档**：[docs.github.com](https://docs.github.com)
3. **百度资源平台帮助**：[ziyuan.baidu.com](https://ziyuan.baidu.com)

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 3.0 | 2024-02-01 | 添加 Netlify Functions 支持（文章索引更新、表单处理） |
| 2.0 | 2024-02-01 | Vercel适配+百度SEO深度优化+轮播图+线稿插图 |
| 1.0 | 2024-01-01 | 初始版本发布 |

---

**祝您的招标代理事业蒸蒸日上！**
