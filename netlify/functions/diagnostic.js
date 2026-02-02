/**
 * 诊断版本 - 列出所有目录和文件
 */

const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  console.log('========================================');
  console.log('诊断工具');
  console.log('__dirname:', __dirname);
  console.log('cwd:', process.cwd());
  console.log('========================================');

  try {
    const results = {
      __dirname: __dirname,
      cwd: process.cwd(),
      scanned: []
    };

    // 扫描各个可能的目录
    const dirsToScan = [
      '/',
      '/var',
      '/var/task',
      process.cwd(),
      __dirname,
      path.join(__dirname, '..'),
      path.join(__dirname, '..', '..'),
    ];

    for (const dir of dirsToScan) {
      try {
        if (fs.existsSync(dir)) {
          const files = fs.readdirSync(dir);
          results.scanned.push({
            path: dir,
            exists: true,
            files: files,
            hasMarkdown: files.some(f => f === 'markdown')
          });
        } else {
          results.scanned.push({
            path: dir,
            exists: false,
            files: []
          });
        }
      } catch (error) {
        results.scanned.push({
          path: dir,
          exists: false,
          error: error.message
        });
      }
    }

    // 尝试查找所有 markdown 相关的路径
    const allFiles = [];
    function scanDirRecursive(dir, depth = 0) {
      if (depth > 3) return;
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          try {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              allFiles.push({ path: fullPath, type: 'dir' });
              scanDirRecursive(fullPath, depth + 1);
            } else if (file.endsWith('.md')) {
              allFiles.push({ path: fullPath, type: 'file' });
            }
          } catch (e) {
            // 忽略错误
          }
        }
      } catch (error) {
        // 忽略错误
      }
    }

    scanDirRecursive('/var/task', 0);

    results.allMarkdownFiles = allFiles.filter(f => f.type === 'file');
    results.allDirectories = allFiles.filter(f => f.type === 'dir').map(f => f.path);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      })
    };
  }
};
