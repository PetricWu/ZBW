/**
 * GitHub API 配置文件
 * 用于从 GitHub 仓库读取 markdown 文件
 */

// GitHub 仓库配置
const GITHUB_CONFIG = {
  // GitHub 仓库信息
  owner: 'your-username',  // 替换为你的 GitHub 用户名
  repo: 'your-repo',        // 替换为你的仓库名称
  branch: 'main',           // 仓库分支名

  // Markdown 文件所在的文件夹路径
  markdownFolder: 'markdown',  // 在仓库中的文件夹路径

  // GitHub API 配置
  apiUrl: 'https://api.github.com',

  // 是否使用 GitHub Token（推荐）
  // 如果仓库是公开的，可以不使用 token
  // 如果仓库是私有的，或者避免 API 速率限制，建议使用 token
  token: ''  // 替换为你的 GitHub Personal Access Token
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GITHUB_CONFIG;
}
