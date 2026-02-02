/**
 * Netlify Function - 更新文章索引（根目录版本）
 *
 * 说明：
 * - markdown 文件在根目录的 markdown/ 文件夹
 * - 完整路径：/var/task/markdown
 * - Functions 路径：/var/task/netlify/functions
 */

const fs = require('fs');
const path = require('path');

// 默认分类映射
const DEFAULT_CATEGORIES = {
  "中标公告": ["中标公告", "中标公示", "公示", "公告"],
  "政策解读": ["政策", "解读", "法规", "法律", "条例"],
  "招标流程": ["流程", "指南", "操作", "教程"],
  "投标技巧": ["技巧", "注意", "方法", "策略"]
};

/**
 * 解析 Markdown 文件中的 SEO 元数据
 */
function parseSeoMeta(content, filename) {
  const lines = content.trim().split('\n');
  const firstLine = lines[0] || '';

  const meta = {
    title: filename.replace('.md', ''),
    keywords: "招标代理,政府采购,工程招标,招投标服务,项目公告",
    description: "",
    category: ""
  };

  const commentMatch = firstLine.match(/^<!--\s*(.+?)\s*-->$/);
  if (commentMatch) {
    const comment = commentMatch[1];

    const titleMatch = comment.match(/title:\s*([^|]+)/);
    if (titleMatch) {
      meta.title = titleMatch[1].trim();
    }

    const keywordsMatch = comment.match(/keywords:\s*([^|]+)/);
    if (keywordsMatch) {
      meta.keywords = keywordsMatch[1].trim();
    }

    const descMatch = comment.match(/description:\s*([^|]+)/);
    if (descMatch) {
      meta.description = descMatch[1].trim();
    }
  }

  const filenameLower = filename.toLowerCase();
  for (const [category, keywords] of Object.entries(DEFAULT_CATEGORIES)) {
    if (keywords.some(keyword => filenameLower.includes(keyword.toLowerCase()))) {
      meta.category = category;
      break;
    }
  }

  if (!meta.category) {
    meta.category = "其他";
  }

  return meta;
}

/**
 * 生成摘要
 */
function generateExcerpt(content, maxLength = 150) {
  let lines = content.split('\n');
  if (lines[0] && lines[0].startsWith('<!--')) {
    lines = lines.slice(1);
  }
  content = lines.join('\n');

  let text = content.replace(/[#*_`~\[\]()<>]/g, '');
  text = text.replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}

/**
 * 获取文件的最后修改时间
 */
function getFileMtime(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return new Date(stats.mtime).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

/**
 * 扫描 Markdown 文件
 */
function scanMarkdownFiles(markdownDir) {
  if (!fs.existsSync(markdownDir)) {
    throw new Error(`Markdown 目录不存在: ${markdownDir}`);
  }

  const files = fs.readdirSync(markdownDir);
  const markdownFiles = files.filter(file =>
    file.endsWith('.md') && file !== 'index.json'
  );

  return markdownFiles.map(file => path.join(markdownDir, file));
}

/**
 * 主处理函数
 */
exports.handler = async (event, context) => {
  console.log('========================================');
  console.log('开始更新文章索引...');
  console.log('__dirname:', __dirname);
  console.log('cwd:', process.cwd());
  console.log('========================================');

  try {
    // 根据实际情况，markdown 在根目录下
    // cwd: /var/task
    // markdown 应该在: /var/task/markdown

    const cwd = process.cwd();
    const possiblePaths = [
      // 优先尝试：当前工作目录 + markdown
      path.join(cwd, 'markdown'),
      // 备选：functions 目录 + markdown (如果构建脚本复制了)
      path.join(__dirname, 'markdown'),
      // 备选：从 functions 回到根目录
      path.join(__dirname, '..', '..', 'markdown'),
      // 备选：上一级目录 + markdown
      path.join(__dirname, '..', 'markdown'),
      // 绝对路径（Netlify Lambda）
      '/var/task/markdown',
    ];

    let markdownDir = null;
    let testedPaths = [];

    console.log('开始查找 markdown 目录...');

    for (const testPath of possiblePaths) {
      testedPaths.push(testPath);
      console.log(`尝试: ${testPath}`);

      try {
        const exists = fs.existsSync(testPath);
        console.log(`  结果: ${exists ? '✓ 找到' : '✗ 不存在'}`);

        if (exists) {
          // 列出文件确认
          const files = fs.readdirSync(testPath);
          console.log(`  文件: ${files.length} 个`, files.slice(0, 5));

          markdownDir = testPath;
          console.log(`✓ 成功: 使用 ${markdownDir}`);
          break;
        }
      } catch (error) {
        console.log(`  错误: ${error.message}`);
      }
    }

    if (!markdownDir) {
      console.error('========================================');
      console.error('❌ 未找到 markdown 目录');
      console.error('尝试的路径:');
      testedPaths.forEach(p => console.error(`  - ${p}`));
      console.error('========================================');
      throw new Error('无法找到 markdown 目录');
    }

    const indexFilePath = path.join(markdownDir, 'index.json');
    console.log('索引文件:', indexFilePath);

    // 扫描 Markdown 文件
    const markdownFiles = scanMarkdownFiles(markdownDir);
    console.log(`找到 ${markdownFiles.length} 个 Markdown 文件`);

    if (markdownFiles.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: '未找到 Markdown 文件',
          articles: []
        })
      };
    }

    // 生成文章列表
    const articles = [];
    for (const filePath of markdownFiles) {
      try {
        const filename = path.basename(filePath);
        console.log(`  处理: ${filename}`);

        const content = fs.readFileSync(filePath, 'utf-8');
        const meta = parseSeoMeta(content, filename);
        const excerpt = generateExcerpt(content);

        if (!meta.description) {
          meta.description = excerpt;
        }

        const date = getFileMtime(filePath);

        articles.push({
          filename: filename,
          title: meta.title,
          excerpt: excerpt,
          date: date,
          category: meta.category
        });

      } catch (error) {
        console.error(`  失败: ${error.message}`);
        continue;
      }
    }

    // 按日期排序
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 生成索引数据
    const indexData = {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      total: articles.length,
      articles: articles
    };

    // 写入 index.json 文件
    fs.writeFileSync(indexFilePath, JSON.stringify(indexData, null, 2), 'utf-8');

    // 统计分类
    const categories = {};
    articles.forEach(article => {
      const cat = article.category;
      categories[cat] = (categories[cat] || 0) + 1;
    });

    console.log('========================================');
    console.log('✓ 成功');
    console.log(`  文章: ${articles.length}`);
    console.log(`  索引: ${indexFilePath}`);
    console.log('========================================');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: `成功更新文章索引，共 ${articles.length} 篇文章`,
        data: {
          total: articles.length,
          lastUpdated: indexData.lastUpdated,
          categories: categories,
          articles: articles,
          debug: {
            markdownDir: markdownDir,
            indexFile: indexFilePath
          }
        }
      })
    };

  } catch (error) {
    console.error('========================================');
    console.error('❌ 错误');
    console.error('信息:', error.message);
    console.error('堆栈:', error.stack);
    console.error('========================================');

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: error.message || '更新文章索引失败',
        error: '更新文章索引失败',
        debug: {
          error: error.message,
          __dirname: __dirname,
          cwd: process.cwd()
        }
      })
    };
  }
};
