# 🎉 GitHub Actions 自动更新 - 完整指南

## 📋 方案概述

**使用 GitHub Actions 自动更新文章索引**：
1. 上传新 markdown 文件到 GitHub
2. GitHub Actions 自动检测变化
3. 自动运行 `generate_index.py` 生成索引
4. 自动提交更新后的 `index.json`
5. Netlify 自动检测并部署
6. 网站自动更新文章列表

**完全自动化，无需手动操作！**

---

## 🚀 快速开始（3步部署）

### Step 1: 下载并解压压缩包

```bash
# 下载
wget tender-website.tar.gz
# 或使用其他方式下载

# 解压
tar -xzf tender-website.tar.gz
cd tender-website
```

### Step 2: 推送到 GitHub

```bash
# 初始化 Git（如果还没有）
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 添加远程仓库（替换为你的仓库地址）
git remote add origin <你的GitHub仓库地址>

# 推送到 GitHub
git push -u origin main
```

### Step 3: 查看部署状态

1. 登录 [GitHub](https://github.com)
2. 进入你的仓库
3. 点击 `Actions` 标签
4. 查看工作流运行状态

**GitHub Actions 会自动运行！**

---

## 📊 工作流程

```
1. 你上传新的 .md 文件到 markdown/
   ↓
2. git push 到 GitHub
   ↓
3. GitHub Actions 检测到 markdown/ 变化
   ↓
4. 自动运行 generate_index.py
   ↓
5. 更新 markdown/index.json
   ↓
6. 自动提交更新
   ↓
7. Netlify 检测到变化
   ↓
8. 自动部署网站
   ↓
9. 网站自动显示新文章
```

---

## 🎯 使用方法

### 方法 A：添加新文章（自动更新）

```bash
# 1. 创建新的 markdown 文件
vim markdown/新文章.md

# 2. 提交到 GitHub
git add markdown/新文章.md
git commit -m "add: 新文章"
git push

# 完成！GitHub Actions 会自动处理后续步骤
```

### 方法 B：更新现有文章（自动更新）

```bash
# 1. 编辑文章
vim markdown/某文章.md

# 2. 提交到 GitHub
git add markdown/某文章.md
git commit -m "update: 更新某文章"
git push

# 完成！索引自动更新
```

### 方法 C：手动触发更新

如果需要强制更新索引：

1. 登录 GitHub
2. 进入你的仓库
3. 点击 `Actions` 标签
4. 选择 `Update Article Index`
5. 点击 `Run workflow` → `Run workflow`

---

## 📁 文件结构

```
tender-website/
├── .github/
│   └── workflows/
│       └── update-index.yml    ← GitHub Actions 工作流
├── markdown/
│   ├── *.md (8个文件)          ← 你的文章
│   └── index.json              ← 自动生成的索引
├── generate_index.py           ← 生成索引的脚本
├── netlify.toml                ← Netlify 配置（已移除 Functions）
├── index.html                  ← 网站首页
├── articles.html               ← 文章列表页
├── post.html                   ← 文章详情页
├── css/                        ← 样式文件
├── js/                         ← 脚本文件
└── images/                     ← 图片文件
```

---

## 🔍 工作流详情

### update-index.yml 工作流

**触发条件**：
- 自动：当 `markdown/*.md` 文件发生变化
- 手动：在 GitHub Actions 页面手动触发

**执行步骤**：
1. 检出代码
2. 设置 Python 环境（3.11）
3. 运行 `generate_index.py`
4. 检查 `index.json` 是否变化
5. 如果有变化，自动提交
6. 触发 Netlify 部署

**运行时间**：约 30-60 秒

---

## ✅ 验证部署

### 检查 GitHub Actions

1. 登录 GitHub
2. 进入你的仓库
3. 点击 `Actions` 标签
4. 查看工作流状态

**成功的标志**：
- ✅ 绿色勾号
- "Run generate_index.py" 步骤成功
- "Commit and push changes" 步骤成功

### 检查 Netlify 部署

1. 登录 [Netlify](https://app.netlify.com)
2. 找到你的网站
3. 点击 `Deploys` 标签
4. 查看最新部署

**成功的标志**：
- ✅ 状态为 `Published`
- ✅ 构建时间约 1-2 分钟

### 检查网站

访问：
```
https://你的网站.netlify.app/articles.html
```

**成功的标志**：
- ✅ 新文章显示在列表中
- ✅ 文章排序正确（最新的在前）

---

## 💡 常见问题

### Q1: GitHub Actions 没有自动运行？

**可能原因**：
1. 文件名不匹配：工作流只检测 `markdown/*.md`
2. 分支不对：工作流只检测 `main` 分支
3. 文件未提交：文件还在本地，没有推送到 GitHub

**解决方法**：
```bash
# 确保文件在正确的位置
ls markdown/*.md

# 确保在 main 分支
git branch
git checkout main

# 提交并推送
git add markdown/*.md
git commit -m "update: 文章"
git push
```

### Q2: 索引没有更新？

**检查步骤**：

1. 检查 GitHub Actions 是否运行
2. 查看工作流日志
3. 检查 `markdown/index.json` 是否更新
4. 检查 Netlify 是否部署

**手动触发**：
在 GitHub Actions 页面手动触发工作流。

### Q3: 如何查看工作流日志？

1. 登录 GitHub
2. 进入你的仓库
3. 点击 `Actions` 标签
4. 点击具体的工作流运行
5. 查看详细日志

### Q4: 工作流失败了怎么办？

**检查错误**：
1. 查看工作流日志
2. 查看失败的具体步骤
3. 查看错误信息

**常见错误**：
- `generate_index.py` 执行失败：检查 Python 代码
- 提交失败：检查权限设置
- 推送失败：检查仓库权限

---

## 🎯 优势对比

| 特性 | 之前（Functions） | 现在（GitHub Actions） |
|------|-------------------|----------------------|
| 可靠性 | ❌ 文件系统隔离 | ✅ 完全可靠 |
| 自动化 | ❌ 需要手动触发 | ✅ 完全自动 |
| 性能 | ❌ 运行时调用 | ✅ 预生成文件 |
| 成本 | ❌ 有限制 | ✅ 完全免费 |
| 维护 | ❌ 复杂 | ✅ 简单 |
| 可见性 | ❌ 日志难以查看 | ✅ 日志清晰可见 |

---

## 📊 性能对比

### Functions 方案
```
用户访问 → 调用 API → 运行时生成 → 返回结果
延迟：1-3秒
成本：按次计费
```

### GitHub Actions 方案
```
用户访问 → 直接读取静态文件
延迟：< 100ms
成本：完全免费
```

---

## 🔧 配置说明

### GitHub Actions 工作流

**文件位置**：`.github/workflows/update-index.yml`

**关键配置**：
```yaml
# 触发条件
on:
  push:
    paths:
      - 'markdown/*.md'  # 只检测 markdown 文件

# 权限
permissions:
  contents: write  # 允许提交代码
```

### Netlify 配置

**文件位置**：`netlify.toml`

**关键变化**：
- ❌ 删除了 Functions 重定向
- ✅ 保留了缓存设置
- ✅ 保留了安全头设置

---

## 🚀 高级用法

### 自定义触发条件

修改 `.github/workflows/update-index.yml`：

```yaml
# 检测更多文件变化
on:
  push:
    paths:
      - 'markdown/*.md'
      - 'generate_index.py'  # 脚本更新也触发
```

### 添加通知

修改工作流，添加 Slack/邮件通知：

```yaml
- name: Send notification
  if: success()
  run: |
    # 发送通知的代码
```

### 定时更新

添加定时任务：

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # 每天午夜运行
```

---

## 📝 工作流程示例

### 添加新文章的完整流程

```bash
# 1. 创建新文章
cat > markdown/新文章.md << EOF
<!-- title:新文章标题 | keywords:关键词 | description:文章描述 -->

# 新文章标题

文章内容...

EOF

# 2. 提交到 GitHub
git add markdown/新文章.md
git commit -m "add: 新文章"
git push

# 3. 等待 30-60 秒
# GitHub Actions 自动运行

# 4. 等待 1-2 分钟
# Netlify 自动部署

# 5. 访问网站
# 新文章已自动显示
```

---

## 🎉 总结

### 核心优势

✅ **完全自动化** - 无需手动生成索引
✅ **性能更好** - 静态文件，秒级加载
✅ **成本更低** - 完全免费，无限制
✅ **更可靠** - 不依赖运行时环境
✅ **更简单** - 易于维护和扩展

### 使用流程

1. 上传文章 → Git Push
2. 自动更新 → GitHub Actions
3. 自动部署 → Netlify
4. 网站更新 → 完成

---

## 📞 需要帮助？

### 检查清单

- [ ] GitHub Actions 工作流文件存在
- [ ] `generate_index.py` 存在
- [ ] 推送到 main 分支
- [ ] 文件在 `markdown/` 目录
- [ ] 文件名是 `.md` 结尾

### 调试技巧

1. 查看 GitHub Actions 日志
2. 检查工作流是否运行
3. 验证 `index.json` 是否更新
4. 查看浏览器控制台错误

---

**版本**: v4.0 - GitHub Actions 版
**日期**: 2026年2月2日
**状态**: 完全可用 ✅

---

**🎉 按照本指南操作，3分钟完成部署，完全自动化！**
