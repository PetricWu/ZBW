# 项目文件说明

本文档列出了项目中的所有重要文件及其用途。

---

## 📁 核心项目文件

### HTML 页面

| 文件 | 说明 | 路径 |
|-----|------|------|
| 首页 | 网站主页，展示轮播图、服务、最新文章等 | `/index.html` |
| 文章列表页 | 显示所有文章列表，支持搜索 | `/articles.html` |
| 文章详情页 | 单篇文章的详细内容展示 | `/post.html` |
| 关于我们 | 公司介绍页面 | `/about.html` |
| 联系方式 | 联系信息和表单页面 | `/contact.html` |
| 404页面 | 错误页面 | `/404.html` |

### CSS 样式

| 文件 | 说明 | 路径 |
|-----|------|------|
| 主样式 | 全局样式和组件样式 | `/css/style.css` |
| 轮播图样式 | 首页轮播图样式 | `/css/home-banner.css` |
| 手工动画样式 | 手工设计的动画效果 | `/css/banner-handmade.css` |
| 响应式样式 | 移动端适配样式 | `/css/responsive.css` |

### JavaScript 脚本

| 文件 | 说明 | 路径 |
|-----|------|------|
| 配置文件 | 网站配置和联系信息 | `/config.js` |
| 主脚本 | 核心功能逻辑 | `/js/main.js` |
| Marked 解析库 | Markdown 解析库 | `/js/marked.min.js` |
| 轮播图脚本 | 轮播图功能 | `/js/home-banner.js` |
| 咨询弹窗脚本 | 咨询表单弹窗 | `/js/consultation.js` |
| 动画脚本 | 页面动画效果 | `/js/handmade-animations.js` |

### 资源文件

| 文件夹 | 说明 | 路径 |
|-------|------|------|
| 图片资源 | Logo、轮播图、图标等 | `/images/` |
| 轮播图 | 首页轮播图（3张） | `/images/banner/` |
| 图标 | 页面图标 | `/images/icon/` |

### 文章系统

| 文件/文件夹 | 说明 | 路径 |
|-----------|------|------|
| Markdown 文件夹 | 存放所有文章 | `/markdown/` |
| 文章索引 | 文章列表索引文件 | `/markdown/index.json` |
| 索引生成脚本 | 生成文章索引的 Python 脚本 | `/generate_index.py` |

---

## 📋 部署配置文件

### Netlify 配置

| 文件 | 说明 |
|-----|------|
| `netlify.toml` | Netlify 部署配置文件 |

### GitHub Actions

| 文件 | 说明 | 路径 |
|-----|------|------|
| 自动更新索引 | 自动运行 generate_index.py | `/.github/workflows/update-index.yml` |

### Git 配置

| 文件 | 说明 |
|-----|------|
| `.gitignore` | Git 忽略文件配置 |

---

## 📚 文档文件

### 主要文档

| 文件 | 说明 |
|-----|------|
| `README.md` | 项目详细说明，包含 Netlify 和 Vercel 两种部署方式 |
| `QUICKSTART.md` | 5分钟快速部署指南（Netlify） |
| `NETLIFY_DEPLOYMENT_GUIDE.md` | Netlify 完整部署指南 |
| `DEPLOYMENT_CHECKLIST.md` | 部署完成后的检查清单 |

### 功能指南

| 文件 | 说明 |
|-----|------|
| `ARTICLE_SYSTEM_GUIDE.md` | 文章系统使用指南 |
| `MARKDOWN_UPDATE_GUIDE.md` | Markdown 更新指南 |

### 历史文档（可参考）

| 文件 | 说明 |
|-----|------|
| `DEPLOYMENT_GUIDE.md` | 旧版部署指南（Vercel） |
| `MARKDOWN_AUTO_UPDATE.md` | Markdown 自动更新说明 |

---

## 🔧 测试文件（可删除）

| 文件 | 说明 |
|-----|------|
| `test-article-loading.html` | 文章加载测试页面 |
| `test-fetch.js` | Fetch 功能测试脚本 |
| `markdown/测试文章.md` | 测试文章 |

---

## 📊 项目结构树

```
workspace/projects/
├── .github/
│   └── workflows/
│       └── update-index.yml          # GitHub Actions：自动更新文章索引
├── css/
│   ├── style.css                     # 主样式
│   ├── home-banner.css               # 轮播图样式
│   ├── banner-handmade.css           # 手工动画样式
│   └── responsive.css                # 响应式样式
├── js/
│   ├── main.js                       # 主脚本
│   ├── marked.min.js                 # Markdown 解析库
│   ├── home-banner.js                # 轮播图脚本
│   ├── consultation.js               # 咨询弹窗脚本
│   └── handmade-animations.js        # 动画脚本
├── images/
│   ├── banner/                       # 轮播图
│   │   ├── banner-1.jpg
│   │   ├── banner-2.jpg
│   │   └── banner-3.jpg
│   └── icon/                         # 图标
├── markdown/                         # 文章目录
│   ├── index.json                    # 文章索引
│   ├── 工程招标流程全解析.md
│   ├── 投标文件编制技巧与注意事项.md
│   ├── 电子招投标系统操作指南.md
│   ├── 城市轨道交通工程中标公告.md
│   ├── 智慧校园建设项目中标公示.md
│   ├── 某市医院建设项目中标公告.md
│   ├── 政府采购法最新修订解读.md
│   └── 测试文章.md                   # 测试文章（可删除）
├── .gitignore                        # Git 忽略配置
├── config.js                         # 网站配置
├── generate_index.py                 # 索引生成脚本
├── netlify.toml                      # Netlify 配置
├── index.html                        # 首页
├── articles.html                     # 文章列表页
├── post.html                         # 文章详情页
├── about.html                        # 关于我们
├── contact.html                      # 联系方式
├── 404.html                          # 404 页面
├── README.md                         # 主文档
├── QUICKSTART.md                     # 快速开始
├── NETLIFY_DEPLOYMENT_GUIDE.md       # Netlify 部署指南
├── DEPLOYMENT_CHECKLIST.md           # 部署检查清单
├── ARTICLE_SYSTEM_GUIDE.md           # 文章系统指南
└── PROJECT_FILES.md                  # 本文件
```

---

## 🎯 使用建议

### 首次部署

1. 阅读 `QUICKSTART.md` 快速开始
2. 完成部署后，使用 `DEPLOYMENT_CHECKLIST.md` 检查

### 日常维护

1. 发布文章：参考 `ARTICLE_SYSTEM_GUIDE.md`
2. 修改配置：编辑 `config.js`
3. 添加图片：放入 `images/` 文件夹

### 问题排查

1. 查看 `NETLIFY_DEPLOYMENT_GUIDE.md` 的常见问题部分
2. 检查 Netlify 部署日志
3. 查看 GitHub Issues

---

## 📝 文件维护建议

### 必须保留的文件

- 所有 `.html` 页面
- 所有 `.css` 和 `.js` 文件
- `config.js`
- `netlify.toml`
- `generate_index.py`
- `.gitignore`
- `markdown/index.json`

### 可选删除的文件

- `test-*.html` 和 `test-*.js`（测试文件）
- `markdown/测试文章.md`（测试文章）
- 旧版文档（如果有）

### 文档文件

建议保留所有文档文件，方便后续参考和维护。

---

## 🔒 安全提示

### 提交到 GitHub 前

1. 检查 `config.js` 中的敏感信息
2. 确保没有包含真实的 API 密钥或密码
3. 确认 `.gitignore` 已正确配置

### 生产环境

1. 修改 `config.js` 中的网站信息
2. 添加真实的联系信息
3. 配置百度统计或 Google Analytics
4. 启用 HTTPS（Netlify 默认启用）

---

## 📞 获取帮助

如有问题，请参考：

1. `README.md` - 完整项目说明
2. `NETLIFY_DEPLOYMENT_GUIDE.md` - 部署相关问题
3. `ARTICLE_SYSTEM_GUIDE.md` - 文章系统相关问题
4. Netlify 官方文档：https://docs.netlify.com/
5. GitHub Issues（如果有的话）

---

**文档版本**：v1.0
**最后更新**：2026年2月1日
