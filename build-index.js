/**
 * 自动生成 Markdown 文章索引
 * 
 * 使用方法：
 * - 本地开发：node build-index.js
 * - Vercel 构建：自动执行
 * - GitHub Actions：可配置为推送时自动执行
 * 
 * 功能：
 * - 自动扫描 markdown/ 目录
 * - 解析每个 .md 文件的 Front Matter（元数据）
 * - 生成 markdown/index.json
 */

const fs = require('fs');
const path = require('path');

// 配置
const MARKDOWN_DIR = path.join(__dirname, 'markdown');
const INDEX_FILE = path.join(__dirname, 'markdown', 'index.json');

// 支持的分类
const DEFAULT_CATEGORY = '招标信息';

// 默认元数据模板
const DEFAULT_METADATA = {
  title: '未命名文章',
  description: '',
  keywords: '',
  category: DEFAULT_CATEGORY,
  date: new Date().toISOString()
};

/**
 * 解析 Markdown 文件的 Front Matter
 * 支持格式：
 * 1. <!-- --> HTML 注释格式（优先）
 * 2. --- 包围的 YAML 格式
 * 3. 顶部的 key:value 格式
 */
function parseFrontMatter(content) {
  const lines = content.split('\n');
  const metadata = { ...DEFAULT_METADATA };
  
  // 优先尝试解析 HTML 注释格式 <!-- title: xxx description: yyy -->
  const commentMatch = content.match(/<!--[\s\S]*?-->/);
  if (commentMatch) {
    const commentContent = commentMatch[0]
      .replace(/<!--|-->|百度SEO|首行注释规范/g, '')
      .trim();
    const parsed = parseCommentMetadata(commentContent, metadata);
    if (parsed.title && parsed.title !== '文章标题（百度：20-30个中文字符）') {
      return parsed;
    }
  }
  
  // 尝试解析 YAML 格式（--- 包围）
  if (content.startsWith('---')) {
    const endMarker = content.indexOf('\n---', 3);
    if (endMarker !== -1) {
      const yamlContent = content.substring(3, endMarker);
      return parseYamlMetadata(yamlContent, metadata);
    }
  }
  
  // 尝试解析顶部的 key:value 格式（前5行）
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();
      
      if (key === 'title' || key === '标题') metadata.title = value;
      else if (key === 'description' || key === '描述') metadata.description = value;
      else if (key === 'keywords' || key === '关键词') metadata.keywords = value;
      else if (key === 'category' || key === '分类') metadata.category = value;
      else if (key === 'date' || key === '日期') metadata.date = value;
    }
  }
  
  return metadata;
}

/**
 * 解析 YAML 格式的元数据
 */
function parseYamlMetadata(yamlContent, metadata) {
  const lines = yamlContent.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim().toLowerCase();
      let value = line.substring(colonIndex + 1).trim();
      
      // 移除引号
      value = value.replace(/^['"]|['"]$/g, '');
      
      if (key === 'title') metadata.title = value;
      else if (key === 'description') metadata.description = value;
      else if (key === 'keywords') metadata.keywords = value;
      else if (key === 'category') metadata.category = value;
      else if (key === 'date') metadata.date = value;
    }
  }
  
  return metadata;
}

/**
 * 解析 HTML 注释格式的元数据
 * 支持格式：
 * 1. 多行格式：<!-- title: xxx description: yyy -->
 * 2. 单行格式：<!-- title: xxx | keywords: yyy | description: zzz -->
 */
function parseCommentMetadata(commentContent, metadata) {
  const lines = commentContent.split('\n');
  
  for (const line of lines) {
    // 支持单行格式，用 | 分隔多个字段
    const parts = line.split('|');
    
    for (const part of parts) {
      const colonIndex = part.indexOf(':');
      if (colonIndex !== -1) {
        const key = part.substring(0, colonIndex).trim().toLowerCase();
        let value = part.substring(colonIndex + 1).trim();
        
        // 移除引号
        value = value.replace(/^['"]|['"]$/g, '');
        
        if (key === 'title' || key === '标题') metadata.title = value;
        else if (key === 'description' || key === '描述') metadata.description = value;
        else if (key === 'keywords' || key === '关键词') metadata.keywords = value;
        else if (key === 'category' || key === '分类') metadata.category = value;
        else if (key === 'date' || key === '日期') metadata.date = value;
      }
    }
  }
  
  return metadata;
}

/**
 * 提取文章摘要（取前200字）
 */
function extractExcerpt(content, maxLength = 200) {
  // 移除 Front Matter（HTML注释和YAML）
  let text = content
    .replace(/<!--[\s\S]*?-->/g, '') // 移除HTML注释
    .replace(/^---[\s\S]*?---\n/gm, '') // 移除YAML
    // 移除 Markdown 标记
    .replace(/^#.*$/gm, '') // 移除标题
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/`{1,3}.*?`{1,3}/g, '') // 移除代码
    .replace(/\*\*.*?\*\*/g, '') // 移除加粗
    .replace(/\*.*?\*/g, '') // 移除斜体
    .replace(/^\s*[-*+]\s/gm, '') // 移除列表标记
    .replace(/^\s*\d+\.\s/gm, '') // 移除数字列表标记
    .replace(/\|.*\|/g, '') // 移除表格
    .replace(/：.*$/gm, '') // 移除中文冒号开头的行
    .replace(/\n\s*\n/g, '\n') // 合并多行空行
    .trim();
  
  // 截取前N个字符
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  
  return text;
}

/**
 * 扫描 Markdown 文件并生成索引
 */
function buildIndex() {
  console.log('🔍 开始扫描 Markdown 文件...');
  console.log('📁 目录:', MARKDOWN_DIR);
  
  // 检查目录是否存在
  if (!fs.existsSync(MARKDOWN_DIR)) {
    console.error('❌ Markdown 目录不存在:', MARKDOWN_DIR);
    return;
  }
  
  // 读取所有 .md 文件
  const files = fs.readdirSync(MARKDOWN_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .sort();
  
  console.log(`📄 找到 ${files.length} 个 Markdown 文件`);
  
  const articles = [];
  
  for (const file of files) {
    const filePath = path.join(MARKDOWN_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 解析元数据
    const metadata = parseFrontMatter(content);
    
    // 提取摘要
    const excerpt = extractExcerpt(content);
    
    // 构建文章对象
    const article = {
      filename: file,
      title: metadata.title,
      excerpt: excerpt,
      description: metadata.description,
      keywords: metadata.keywords,
      date: metadata.date,
      category: metadata.category
    };
    
    articles.push(article);
    console.log(`  ✓ ${file} - ${article.title}`);
  }
  
  // 生成索引文件
  const index = {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    total: articles.length,
    articles: articles
  };
  
  // 写入索引文件
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
  
  console.log('\n✅ 索引文件生成成功!');
  console.log('📝 文件路径:', INDEX_FILE);
  console.log(`📊 总计 ${articles.length} 篇文章`);
  console.log('⏰ 更新时间:', index.lastUpdated);
}

// 执行构建
buildIndex();

// 导出函数供其他模块使用
module.exports = { buildIndex };
