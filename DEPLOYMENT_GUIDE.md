# 华诚招标代理网站 - 完整部署包

## 📦 压缩包内容

本压缩包包含完整的招标代理网站项目，可以直接部署到 Vercel、Netlify 或任何静态网站托管服务。

## 🚀 快速开始

### 方式一：直接部署到 Vercel

1. **解压文件**
   ```bash
   tar -xzf huacheng-tender-site.tar.gz
   cd huacheng-tender-site
   ```

2. **上传到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **部署到 Vercel**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Deploy"

### 方式二：本地运行

1. **解压文件**
   ```bash
   tar -xzf huacheng-tender-site.tar.gz
   cd huacheng-tender-site
   ```

2. **启动服务器**
   ```bash
   # 使用 Python（推荐）
   python3 -m http.server 5000

   # 或使用 Node.js
   npx http-server -p 5000
   ```

3. **访问网站**
   - 打开浏览器访问：http://localhost:5000

## 📁 项目结构

```
.
├── .coze                          # 项目配置文件
├── index.html                     # 首页
├── articles.html                  # 文章列表页
├── about.html                     # 关于我们
├── contact.html                   # 联系方式
├── post.html                      # 文章详情页
├── 404.html                       # 404 错误页
├── generate_index.py              # Markdown 索引生成脚本
├── MARKDOWN_AUTO_UPDATE.md        # 自动更新使用说明
├── README.md                      # 项目说明
├── config.js                      # 配置文件
├── vercel.json                    # Vercel 部署配置
├── css/                           # 样式文件
│   ├── style.css
│   └── tailwind.config.js
├── js/                            # JavaScript 文件
│   ├── main.js
│   └── marked.min.js
├── images/                        # 图片资源
│   ├── logo.png
│   ├── favicon.png
│   ├── apple-touch-icon.png
│   ├── og-image.png
│   └── banner/
│       ├── banner-1.jpg
│       ├── banner-2.jpg
│       └── banner-3.jpg
├── markdown/                      # Markdown 文章
│   ├── index.json                 # 自动生成的文章索引
│   └── *.md                       # Markdown 文章文件
├── assets/                        # 资源文件
└── seo/                           # SEO 相关文件
    ├── robots.txt
    └── sitemap-template.xml
```

## 📝 如何更新文章

### 自动更新（推荐）

1. 在 `markdown/` 文件夹中添加或更新 Markdown 文件
2. 文件格式：
   ```markdown
   <!-- title: 文章标题 | keywords: 关键词1,关键词2 | description: 文章描述 -->

   # 文章标题

   文章内容...
   ```
3. 保存文件后，运行以下命令更新索引：
   ```bash
   python3 generate_index.py
   ```
4. 刷新网页即可看到更新

### 手动更新

直接编辑 `markdown/index.json` 文件，添加文章信息。

## 🔧 配置说明

### config.js

编辑 `config.js` 文件修改网站配置：

```javascript
const SITE_CONFIG = {
  siteName: '华诚招标代理',
  siteUrl: 'https://your-domain.com',
  siteDescription: '专业招标代理服务机构',
  contact: {
    phone: '400-888-6666',
    email: 'contact@huacheng-tender.com',
    address: '北京市朝阳区建国路88号'
  }
};
```

### vercel.json

如果部署到 Vercel，请修改 `vercel.json` 中的域名配置：

```json
{
  "routes": [
    {
      "src": "/(.*)",
      "headers": {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block"
      }
    }
  ]
}
```

## 🎨 自定义样式

### 修改配色方案

编辑 `css/style.css` 文件，搜索并替换以下颜色变量：

```css
/* 主色调 */
--primary-color: #3b82f6;  /* 蓝色 */

/* 辅助色 */
--secondary-color: #10b981;  /* 绿色 */

/* 强调色 */
--accent-color: #f59e0b;  /* 橙色 */
```

### 修改 Logo

1. 替换 `images/logo.png` 为你的 Logo 文件
2. 确保 Logo 文件名为 `logo.png`
3. 建议尺寸：200x60 像素，PNG 格式

## 📊 SEO 优化

网站已内置百度 SEO 优化，包括：

- ✅ 结构化数据（Schema.org JSON-LD）
- ✅ Open Graph 标签
- ✅ 百度专用元数据
- ✅ 移动端适配
- ✅ 站点地图模板
- ✅ robots.txt

### 生成站点地图

1. 编辑 `seo/sitemap-template.xml`
2. 替换 `https://your-site.vercel.app` 为你的域名
3. 将文件重命名为 `sitemap.xml` 并复制到网站根目录

## 🚦 部署检查清单

部署前请检查：

- [ ] 已更新 `config.js` 中的网站配置
- [ ] 已替换 `images/logo.png` 为你的 Logo
- [ ] 已更新所有联系方式
- [ ] 已添加所有 Markdown 文章
- [ ] 已运行 `python3 generate_index.py` 生成索引
- [ ] 已测试本地服务器，确保网站正常运行
- [ ] 已配置自定义域名（可选）
- [ ] 已设置百度统计（可选）

## 🔐 安全建议

1. **HTTPS**：确保使用 HTTPS 访问
2. **CDN**：考虑使用 CDN 加速静态资源
3. **备份**：定期备份 `markdown/` 文件夹
4. **更新**：及时更新依赖库

## 📧 技术支持

如有问题，请查看：

- `MARKDOWN_AUTO_UPDATE.md` - 自动更新详细说明
- `README.md` - 项目说明
- `/app/work/logs/bypass/dev.log` - 开发日志

## 📄 许可证

本项目为华诚招标代理有限公司所有。

---

**版本**：1.0.0
**更新日期**：2024年2月1日
**压缩包大小**：315K
