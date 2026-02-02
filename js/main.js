/**
 * ============================================
 * 招标代理网站核心脚本 - Vercel适配版
 * ============================================
 * 
 * 功能模块：
 * 1. Markdown文件加载与解析（解决404问题）
 * 2. 文章搜索功能
 * 3. 目录导航生成
 * 4. 移动端菜单
 * 5. 返回顶部
 * 6. 轮播图功能
 * 7. 百度SEO优化
 * 
 */

// ============================================
// 全局配置与状态
// ============================================

const APP_STATE = {
  articles: [],
  currentArticle: null,
  searchQuery: '',
  isMenuOpen: false,
  bannerIndex: 0,
  bannerInterval: null
};

// ============================================
// 初始化检查
// ============================================

// 检查 marked 库是否已加载
if (typeof marked === 'undefined') {
  console.error('错误：marked 库未加载，请检查 /js/marked.min.js 是否正确引入');
} else {
  console.log('✓ marked 库已正确加载');
  console.log('marked 对象的所有属性：', Object.keys(marked));
  console.log('marked.parse 类型：', typeof marked.parse);
  
  // 检查 parse 方法是否存在
  if (typeof marked.parse !== 'function') {
    console.error('错误：marked.parse 方法不存在');
    // 尝试其他可能的访问方式
    if (typeof marked.marked === 'object' && typeof marked.marked.parse === 'function') {
      console.log('尝试使用 marked.marked.parse');
    }
  }
}

// ============================================
// 工具函数
// ============================================

/**
 * 格式化日期
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/**
 * 生成URL友好的slug（支持中文）
 */
function generateSlug(text) {
  if (!text) return '';
  // 移除.md扩展名
  const name = text.replace(/\.md$/i, '');
  // URL编码中文，确保百度能正确抓取
  return encodeURIComponent(name);
}

/**
 * 从URL slug解码文件名
 */
function decodeSlug(slug) {
  if (!slug) return '';
  try {
    return decodeURIComponent(slug);
  } catch (e) {
    return slug;
  }
}

/**
 * 提取纯文本（去除HTML标签）
 */
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * 生成文章摘要（百度SEO优化：控制在100-150字）
 */
function generateExcerpt(content, maxLength = 150) {
  const text = stripHtml(content);
  // 移除多余空白
  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength).replace(/\s+$/g, '') + '...';
}

/**
 * 生成百度友好的描述（控制在80-120字）
 */
function generateBaiduDescription(content, maxLength = 120) {
  const text = stripHtml(content);
  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength).replace(/\s+$/g, '') + '...';
}

/**
 * 解析Markdown文件中的SEO元数据（百度专属TDK优化）
 * 格式：<!-- title: xxx | keywords: xxx | description: xxx -->
 */
function parseSeoMeta(markdown, filename) {
  // 默认SEO数据
  const defaultTitle = filename.replace(/\.md$/i, '');
  const meta = {
    title: defaultTitle,
    // 百度关键词：≤5个，融入招投标行业核心词
    keywords: '招标代理,政府采购,工程招标,招投标服务,项目公告',
    description: ''
  };
  
  // 检查首行注释
  const lines = markdown.trim().split('\n');
  const firstLine = lines[0] || '';
  const commentMatch = firstLine.match(/^<!--\s*(.+?)\s*-->$/);
  
  if (commentMatch) {
    const comment = commentMatch[1];
    
    // 解析title（百度：20-30个中文字符）
    const titleMatch = comment.match(/title:\s*([^|]+)/);
    if (titleMatch) {
      let title = titleMatch[1].trim();
      // 限制标题长度（百度搜索结果最优展示）
      if (title.length > 30) title = title.substring(0, 30);
      meta.title = title;
    }
    
    // 解析keywords（百度：≤5个）
    const keywordsMatch = comment.match(/keywords:\s*([^|]+)/);
    if (keywordsMatch) {
      let keywords = keywordsMatch[1].trim();
      // 限制关键词数量
      const keywordArr = keywords.split(/[,，]/).map(k => k.trim()).filter(k => k);
      if (keywordArr.length > 5) {
        keywords = keywordArr.slice(0, 5).join(',');
      }
      meta.keywords = keywords;
    }
    
    // 解析description（百度：80-120个中文字符）
    const descMatch = comment.match(/description:\s*([^|]+)/);
    if (descMatch) {
      let desc = descMatch[1].trim();
      // 限制描述长度
      if (desc.length > 120) desc = desc.substring(0, 120);
      meta.description = desc;
    }
  }
  
  // 如果没有描述，从正文提取（百度优化：前100字）
  if (!meta.description) {
    // 移除首行注释后的内容
    const contentLines = commentMatch ? lines.slice(1) : lines;
    const contentText = contentLines.join(' ').replace(/^#+\s*/gm, '').trim();
    meta.description = generateBaiduDescription(contentText, 100);
  }
  
  return meta;
}

/**
 * 生成百度友好的结构化数据（Schema.org JSON-LD格式）
 */
function generateBaiduSchema(type, data) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type
  };
  
  switch (type) {
    case 'Organization':
      return JSON.stringify({
        ...baseSchema,
        name: SITE_CONFIG.siteName,
        url: SITE_CONFIG.siteUrl,
        logo: SITE_CONFIG.siteUrl + SITE_CONFIG.logo,
        description: SITE_CONFIG.siteDescription,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: SITE_CONFIG.contact.phone,
          contactType: 'customer service',
          areaServed: 'CN',
          availableLanguage: 'Chinese'
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'CN',
          addressLocality: SITE_CONFIG.contact.address
        }
      });
      
    case 'Article':
      return JSON.stringify({
        ...baseSchema,
        headline: data.title,
        description: data.description,
        url: data.url,
        datePublished: data.date,
        dateModified: data.date,
        author: {
          '@type': 'Organization',
          name: SITE_CONFIG.siteName,
          url: SITE_CONFIG.siteUrl
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: SITE_CONFIG.siteUrl + SITE_CONFIG.logo
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        },
        keywords: data.keywords
      });
      
    case 'WebPage':
      return JSON.stringify({
        ...baseSchema,
        name: data.title || SITE_CONFIG.siteName,
        description: data.description || SITE_CONFIG.siteDescription,
        url: data.url || SITE_CONFIG.siteUrl,
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.siteName
        }
      });
      
    case 'BreadcrumbList':
      const itemList = data.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }));
      return JSON.stringify({
        ...baseSchema,
        itemListElement: itemList
      });
      
    case 'WebSite':
      return JSON.stringify({
        ...baseSchema,
        name: SITE_CONFIG.siteName,
        url: SITE_CONFIG.siteUrl,
        description: SITE_CONFIG.siteDescription,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: SITE_CONFIG.siteUrl + '/articles.html?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      });
      
    default:
      return JSON.stringify(baseSchema);
  }
}

// ============================================
// Markdown处理（修复404核心问题）
// ============================================

/**
 * 加载Markdown文件列表（从index.json）
 * 这是解决404问题的核心：预构建索引文件
 */
async function loadMarkdownList() {
  try {
    // 尝试从预构建的索引文件加载（Vercel适配）
    const response = await fetch('/markdown/index.json?t=' + Date.now());
    if (response.ok) {
      const data = await response.json();
      APP_STATE.articles = data.articles || [];
      return APP_STATE.articles;
    }
  } catch (e) {
    console.log('Index file not found, using fallback', e);
  }
  
  // 备用：返回空数组
  APP_STATE.articles = [];
  return APP_STATE.articles;
}

/**
 * 加载单个Markdown文件（支持中文文件名）
 * 核心修复：正确处理URL编码和文件路径
 */
async function loadMarkdownFile(filename) {
  try {
    // 容错处理：确保文件名有.md扩展名
    if (!filename.endsWith('.md')) {
      filename += '.md';
    }
    
    // URL编码处理（支持中文文件名）
    const encodedFilename = encodeURIComponent(filename);
    
    // 构建请求URL（添加时间戳避免缓存）
    const url = `/markdown/${encodedFilename}?t=${Date.now()}`;
    
    console.log('Loading markdown:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`File not found: ${filename} (status: ${response.status})`);
    }
    
    const content = await response.text();
    console.log('Content length:', content.length);
    
    // 检查内容是否有效（不是404页面）
    if (content.includes('<!DOCTYPE html>') && content.includes('404')) {
      throw new Error('Invalid markdown file');
    }
    
    // 检查 marked 是否已加载
    if (typeof marked === 'undefined' || !marked.parse) {
      console.error('Marked library not loaded');
      throw new Error('Marked library not loaded');
    }
    
    // 解析SEO元数据
    const meta = parseSeoMeta(content, filename);
    
    // 解析Markdown为HTML
    const htmlContent = marked.parse(content);
    
    // 生成百度友好的描述
    const excerpt = generateExcerpt(htmlContent);
    const description = meta.description || generateBaiduDescription(htmlContent, 100);
    
    return {
      filename,
      title: meta.title,
      keywords: meta.keywords,
      description: description,
      content: htmlContent,
      excerpt: excerpt,
      date: new Date().toISOString(), // 实际应从Git获取提交时间
      slug: generateSlug(filename.replace(/\.md$/i, ''))
    };
  } catch (error) {
    console.error('Error loading markdown:', error);
    return null;
  }
}

/**
 * 生成文章详情页URL（兼容所有静态服务器）
 * 格式：/post.html?file=文章标题.md
 */
function generateArticleUrl(filename) {
  // 使用query string格式，兼容所有静态服务器
  return `/post.html?file=${encodeURIComponent(filename)}`;
}

/**
 * 从URL解析文件名（支持中文）
 */
function parseArticleUrl(urlPath) {
  // 匹配 /article/xxx.html 格式
  const match = urlPath.match(/\/article\/(.+)\.html$/);
  if (match) {
    const slug = match[1];
    const decoded = decodeSlug(slug);
    return decoded + '.md';
  }
  return null;
}

/**
 * 渲染文章列表
 */
function renderArticleList(articles, container) {
  console.log('===== renderArticleList 开始执行 =====');
  console.log('容器元素:', container);
  console.log('文章列表:', articles);
  console.log('文章数量:', articles.length);
  
  if (!container) {
    console.error('错误：容器元素不存在');
    return;
  }
  
  if (articles.length === 0) {
    container.innerHTML = `
      <div class="search-empty">
        <div class="search-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="search-empty-title">暂无文章</h3>
        <p class="search-empty-desc">请稍后再试或添加Markdown文章文件</p>
      </div>
    `;
    return;
  }
  
  console.log('渲染文章列表，文章数量：', articles.length);
  
  container.innerHTML = articles.map((article) => {
    // 生成跳转链接到文章详情页
    const articleUrl = `/post.html?file=${encodeURIComponent(article.filename)}`;
    return `
    <article class="article-item">
      <div class="article-content">
        <h3 class="article-title">
          <a href="${articleUrl}" 
             class="article-link"
             title="${article.title}">${article.title}</a>
        </h3>
        <p class="article-excerpt">${article.excerpt || '暂无摘要'}</p>
        <div class="article-meta">
          <span class="article-meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            ${formatDate(article.date)}
          </span>
          ${article.category ? `<span class="article-meta-item article-category">${article.category}</span>` : ''}
        </div>
      </div>
      <time class="article-date" datetime="${article.date}">${formatDate(article.date)}</time>
    </article>
  `}).join('');
  
  // 移除事件委托，现在链接是普通的页面跳转
  console.log('文章列表渲染完成，共', articles.length, '篇文章');
}

// ============================================
// 搜索功能
// ============================================

/**
 * 搜索文章（支持标题和正文）
 */
function searchArticles(query, articles) {
  if (!query || !query.trim()) return articles;
  
  const lowerQuery = query.toLowerCase();
  return articles.filter(article => {
    const titleMatch = article.title && article.title.toLowerCase().includes(lowerQuery);
    const contentMatch = article.excerpt && article.excerpt.toLowerCase().includes(lowerQuery);
    return titleMatch || contentMatch;
  });
}

/**
 * 高亮搜索关键词
 */
function highlightSearch(text, query) {
  if (!query || !query.trim() || !text) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// ============================================
// 目录导航
// ============================================

/**
 * 生成文章目录（锚点导航）
 */
function generateToc(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  
  if (headings.length === 0) return '';
  
  let tocHtml = '<nav class="toc-nav" aria-label="文章目录"><div class="toc-title">目录导航</div><ul class="toc-list">';
  
  headings.forEach((heading, index) => {
    const level = heading.tagName.toLowerCase();
    const text = heading.textContent;
    const id = `section-${index}`;
    const levelClass = level === 'h3' ? 'toc-h3' : '';
    
    tocHtml += `<li class="toc-item"><a href="#${id}" class="toc-link ${levelClass}" data-target="${id}">${text}</a></li>`;
  });
  
  tocHtml += '</ul></nav>';
  return tocHtml;
}

/**
 * 为文章内容的标题添加锚点
 */
function addHeadingAnchors(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headings = doc.querySelectorAll('h2, h3');
  
  headings.forEach((heading, index) => {
    heading.id = `section-${index}`;
  });
  
  return doc.body.innerHTML;
}

/**
 * 目录滚动高亮
 */
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = document.querySelectorAll('[id^="section-"]');
  
  if (tocLinks.length === 0 || headings.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-target') === id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-100px 0px -70% 0px'
  });
  
  headings.forEach(heading => observer.observe(heading));
}

// ============================================
// 轮播图功能
// ============================================

/**
 * 初始化轮播图
 */
function initBanner() {
  const bannerContainer = document.querySelector('.banner-container');
  if (!bannerContainer) return;
  
  const slides = bannerContainer.querySelectorAll('.banner-slide');
  const prevBtn = bannerContainer.querySelector('.banner-prev');
  const nextBtn = bannerContainer.querySelector('.banner-next');
  const dots = bannerContainer.querySelectorAll('.banner-dot');
  
  if (slides.length === 0) return;
  
  const config = SITE_CONFIG.banner || {};
  const autoplay = config.autoplay !== false;
  const interval = config.interval || 5000;
  
  // 显示指定幻灯片
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    APP_STATE.bannerIndex = index;
  }
  
  // 下一张
  function nextSlide() {
    const next = (APP_STATE.bannerIndex + 1) % slides.length;
    showSlide(next);
  }
  
  // 上一张
  function prevSlide() {
    const prev = (APP_STATE.bannerIndex - 1 + slides.length) % slides.length;
    showSlide(prev);
  }
  
  // 自动播放
  function startAutoplay() {
    if (autoplay && slides.length > 1) {
      APP_STATE.bannerInterval = setInterval(nextSlide, interval);
    }
  }
  
  function stopAutoplay() {
    if (APP_STATE.bannerInterval) {
      clearInterval(APP_STATE.bannerInterval);
    }
  }
  
  // 事件绑定
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    });
  }
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showSlide(index);
      startAutoplay();
    });
  });
  
  // 鼠标悬停暂停
  bannerContainer.addEventListener('mouseenter', stopAutoplay);
  bannerContainer.addEventListener('mouseleave', startAutoplay);
  
  // 触摸滑动（移动端）
  let touchStartX = 0;
  let touchEndX = 0;
  
  bannerContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });
  
  bannerContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoplay();
  }, { passive: true });
  
  // 启动自动播放
  startAutoplay();
}

// ============================================
// UI交互
// ============================================

/**
 * 显示文章详情模态框
 */
async function showArticleModal(filename) {
  console.log('showArticleModal 被调用，文件名：', filename);
  
  const modal = document.getElementById('articleModal');
  const overlay = document.getElementById('articleModalOverlay');
  const titleEl = document.getElementById('articleModalTitle');
  const metaEl = document.getElementById('articleModalMeta');
  const textEl = document.getElementById('articleModalText');
  
  console.log('模态框元素检查：', {
    modal: !!modal,
    overlay: !!overlay,
    titleEl: !!titleEl,
    metaEl: !!metaEl,
    textEl: !!textEl
  });
  
  if (!modal || !titleEl || !metaEl || !textEl) return;
  
  // 检查 marked 库是否已加载
  console.log('检查 marked 库...');
  console.log('typeof marked:', typeof marked);
  console.log('typeof marked.parse:', typeof marked.parse);
  
  if (typeof marked === 'undefined' || !marked.parse) {
    console.error('marked 库未加载或 parse 方法不存在');
    titleEl.textContent = '加载失败';
    textEl.innerHTML = '<div class="error-message">Markdown 解析库未加载，请刷新页面重试。</div>';
    return;
  }
  
  console.log('marked 库检查通过');
  
  // 显示加载状态
  titleEl.textContent = '加载中...';
  metaEl.innerHTML = '';
  textEl.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p class="loading-text">正在加载文章内容...</p></div>';
  
  // 显示模态框
  console.log('添加 active 类到模态框');
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  console.log('模态框类名：', modal.className);
  console.log('模态框显示状态：', window.getComputedStyle(modal).display);
  
  try {
    console.log('开始加载文章文件:', filename);
    // 加载文章内容
    const article = await loadMarkdownFile(filename);
    
    console.log('文章加载结果:', article);
    
    if (!article) {
      console.error('loadMarkdownFile 返回 null');
      titleEl.textContent = '加载失败';
      textEl.innerHTML = '<div class="error-message">文章内容加载失败，请稍后重试。<br><small>请检查浏览器控制台查看详细错误信息。</small></div>';
      return;
    }
    
    console.log('开始更新模态框内容');
    // 更新模态框内容
    titleEl.textContent = article.title;
    
    // 更新元信息
    metaEl.innerHTML = `
      <span class="article-meta-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span class="article-date-text">${formatDate(article.date)}</span>
      </span>
      ${article.category ? `<span class="article-meta-item article-category">${article.category}</span>` : ''}
    `;
    
    // 更新文章内容
    textEl.innerHTML = addHeadingAnchors(article.content);
    
    console.log('模态框内容更新完成');
    
    // 生成目录（如果有标题）
    const tocHtml = generateToc(article.content);
    if (tocHtml) {
      console.log('生成目录');
      const tocContainer = document.createElement('div');
      tocContainer.className = 'article-modal-toc';
      tocContainer.innerHTML = tocHtml;
      textEl.insertBefore(tocContainer, textEl.firstChild);
      
      // 延迟初始化目录高亮
      setTimeout(() => initTocHighlight(), 100);
    }
    
  } catch (error) {
    console.error('Error loading article:', error);
    console.error('Error details:', error.message, error.stack);
    titleEl.textContent = '加载失败';
    textEl.innerHTML = `<div class="error-message">文章内容加载失败，请稍后重试。<br><small>错误信息：${error.message}</small></div>`;
  }
}

/**
 * 关闭文章详情模态框
 */
function closeArticleModal() {
  const modal = document.getElementById('articleModal');
  if (!modal) return;
  
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * 初始化文章模态框事件
 */
function initArticleModal() {
  const modal = document.getElementById('articleModal');
  const overlay = document.getElementById('articleModalOverlay');
  const closeBtn = document.getElementById('articleModalClose');
  
  // 关闭按钮点击
  closeBtn?.addEventListener('click', closeArticleModal);
  
  // 遮罩层点击关闭
  overlay?.addEventListener('click', closeArticleModal);
  
  // ESC键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticleModal();
    }
  });
}

/**
 * 移动端菜单切换
 */
function toggleMobileMenu() {
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.mobile-menu-btn');
  const overlay = document.querySelector('.nav-overlay');
  
  if (!nav || !btn) return;
  
  APP_STATE.isMenuOpen = !APP_STATE.isMenuOpen;
  nav.classList.toggle('active', APP_STATE.isMenuOpen);
  document.body.classList.toggle('menu-open', APP_STATE.isMenuOpen);
  
  if (overlay) {
    overlay.classList.toggle('active', APP_STATE.isMenuOpen);
  }
  
  // 汉堡菜单动画
  const spans = btn.querySelectorAll('span');
  if (APP_STATE.isMenuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

/**
 * 返回顶部按钮
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 初始化移动端菜单
 */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const overlay = document.querySelector('.nav-overlay');
  
  if (btn) {
    btn.addEventListener('click', toggleMobileMenu);
  }
  
  if (overlay) {
    overlay.addEventListener('click', toggleMobileMenu);
  }
}

// ============================================
// 百度SEO功能
// ============================================

/**
 * 更新页面TDK（百度优化版）
 * 标题：20-30个中文字符
 * 描述：80-120个中文字符
 */
function updatePageTdk(title, description, keywords) {
  // 更新标题（百度：控制在30字以内）
  const fullTitle = title 
    ? `${title} - ${SITE_CONFIG.siteName}`
    : SITE_CONFIG.siteName;
  document.title = fullTitle.length > 30 ? fullTitle.substring(0, 30) : fullTitle;
  
  // 更新description（百度：80-120字）
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    const desc = description.length > 120 ? description.substring(0, 120) : description;
    metaDesc.content = desc;
  }
  
  // 更新keywords（百度：≤5个）
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    // 限制关键词数量
    const keywordArr = keywords.split(/[,，]/).map(k => k.trim()).filter(k => k);
    if (keywordArr.length > 5) {
      metaKeywords.content = keywordArr.slice(0, 5).join(',');
    } else {
      metaKeywords.content = keywords;
    }
  }
  
  // 更新canonical标签（百度SEO）
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = window.location.href.split('?')[0];
}

/**
 * 添加百度结构化数据
 */
function addBaiduStructuredData(type, data) {
  let script = document.querySelector(`script[data-schema="${type}"]`);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', type);
    document.head.appendChild(script);
  }
  script.textContent = generateBaiduSchema(type, data);
}

/**
 * 更新面包屑导航结构化数据
 */
function updateBreadcrumbSchema(items) {
  addBaiduStructuredData('BreadcrumbList', { items });
}

// ============================================
// 页面初始化
// ============================================

/**
 * 初始化首页
 */
async function initHomePage() {
  console.log('===== initHomePage 开始执行 =====');
  await loadMarkdownList();
  
  // 渲染最新文章
  const latestContainer = document.querySelector('.latest-articles');
  if (latestContainer && APP_STATE.articles.length > 0) {
    const latestArticles = APP_STATE.articles.slice(0, SITE_CONFIG.homeArticlesCount || 5);
    renderArticleList(latestArticles, latestContainer);
  }
  
  // 初始化轮播图
  initBanner();
  
  // 移除模态框初始化，因为现在使用页面跳转
  // initArticleModal();
  
  // 更新SEO（百度优化）
  updatePageTdk(
    '',
    SITE_CONFIG.siteDescription,
    SITE_CONFIG.seoKeywords.join(', ')
  );
  
  // 添加结构化数据
  addBaiduStructuredData('Organization', {});
  addBaiduStructuredData('WebSite', {});
  
  // 面包屑
  updateBreadcrumbSchema([
    { name: '首页', url: SITE_CONFIG.siteUrl + '/' }
  ]);
}

/**
 * 初始化文章列表页
 */
async function initArticlesPage() {
  console.log('===== initArticlesPage 开始执行 =====');
  console.log('当前页面类型:', document.body.dataset.page);
  
  await loadMarkdownList();
  
  console.log('加载文章列表完成，文章数量:', APP_STATE.articles.length);
  
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';
  
  // 更新搜索框
  const searchInput = document.querySelector('.search-input');
  if (searchInput && query) {
    searchInput.value = query;
  }
  
  // 搜索并渲染
  const filteredArticles = searchArticles(query, APP_STATE.articles);
  const container = document.querySelector('.articles-list');
  
  if (container) {
    renderArticleList(filteredArticles, container);
    
    // 更新搜索结果标题
    const searchTitle = document.querySelector('.search-title');
    if (searchTitle) {
      if (query) {
        searchTitle.innerHTML = `搜索"<span class="search-keyword">${query}</span>"的结果`;
      } else {
        searchTitle.textContent = '全部文章';
      }
    }
    
    // 更新结果数量
    const searchCount = document.querySelector('.search-count');
    if (searchCount) {
      searchCount.textContent = `共 ${filteredArticles.length} 篇文章`;
    }
  }
  
  // 更新SEO（百度优化）
  const pageTitle = query ? `搜索：${query}` : '文章列表';
  const pageDesc = query 
    ? `关于"${query}"的招标代理相关文章搜索结果`
    : '浏览招标代理最新文章资讯，包括招标公告、政府采购政策、工程招标信息等内容。';
  
  updatePageTdk(
    pageTitle,
    pageDesc,
    SITE_CONFIG.seoKeywords.join(', ')
  );
  
  // 面包屑
  updateBreadcrumbSchema([
    { name: '首页', url: SITE_CONFIG.siteUrl + '/' },
    { name: query ? '搜索结果' : '文章列表', url: window.location.href }
  ]);
  
  // 移除模态框初始化，因为现在使用页面跳转
  // initArticleModal();
}

/**
 * 初始化文章详情页（修复404核心问题）
 */
async function initArticlePage() {
  // 从URL参数获取文件名（支持多种格式）
  const urlParams = new URLSearchParams(window.location.search);
  let filename = urlParams.get('file');
  
  // 兼容 /article/文章标题.html 格式的URL（Vercel路由）
  if (!filename) {
    const pathname = window.location.pathname;
    filename = parseArticleUrl(pathname);
  }
  
  // 容错处理：尝试从referrer获取
  if (!filename && document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      const referrerParams = new URLSearchParams(referrerUrl.search);
      filename = referrerParams.get('file');
    } catch (e) {
      console.log('Failed to parse referrer');
    }
  }
  
  if (!filename) {
    window.location.href = '/404.html';
    return;
  }
  
  // 加载文章
  const article = await loadMarkdownFile(filename);
  
  if (!article) {
    window.location.href = '/404.html';
    return;
  }
  
  APP_STATE.currentArticle = article;
  
  // 渲染文章标题
  const titleEl = document.querySelector('.article-detail-title');
  if (titleEl) titleEl.textContent = article.title;
  
  // 更新面包屑标题
  const breadcrumbTitle = document.querySelector('.article-breadcrumb-title');
  if (breadcrumbTitle) breadcrumbTitle.textContent = article.title;
  
  // 渲染文章元信息
  const metaEl = document.querySelector('.article-detail-meta');
  if (metaEl) {
    metaEl.innerHTML = `
      <span class="article-meta-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span class="article-date-text">${formatDate(article.date)}</span>
      </span>
    `;
  }
  
  // 渲染文章内容
  const contentEl = document.querySelector('.article-detail-content');
  if (contentEl) {
    contentEl.innerHTML = addHeadingAnchors(article.content);
  }
  
  // 生成目录
  const tocEl = document.querySelector('.article-toc');
  if (tocEl) {
    const tocHtml = generateToc(article.content);
    if (tocHtml) {
      tocEl.innerHTML = tocHtml;
      initTocHighlight();
    } else {
      tocEl.style.display = 'none';
    }
  }
  
  // 更新SEO（百度优化）
  updatePageTdk(
    article.title,
    article.description,
    article.keywords
  );
  
  // 添加百度结构化数据
  addBaiduStructuredData('Article', {
    title: article.title,
    description: article.description,
    url: `${SITE_CONFIG.siteUrl}${generateArticleUrl(filename)}`,
    date: article.date,
    keywords: article.keywords
  });
  
  // 面包屑
  updateBreadcrumbSchema([
    { name: '首页', url: SITE_CONFIG.siteUrl + '/' },
    { name: '文章列表', url: SITE_CONFIG.siteUrl + '/articles.html' },
    { name: article.title, url: window.location.href }
  ]);
  
  // 初始化文章阅读进度条
  initArticleReadingProgress();
}

/**
 * 初始化文章阅读进度条
 */
function initArticleReadingProgress() {
  const progressContainer = document.querySelector('.article-reading-progress');
  const progressBar = document.querySelector('.reading-progress-bar');
  
  if (!progressContainer || !progressBar) {
    console.log('文章阅读进度条元素未找到');
    return;
  }
  
  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 计算阅读进度百分比（排除顶部导航和底部区域）
    const headerHeight = 100; // 顶部区域高度
    const readableHeight = documentHeight - windowHeight - headerHeight;
    const progress = Math.min(100, Math.max(0, ((scrollTop - headerHeight) / readableHeight) * 100));
    
    progressBar.style.width = `${progress}%`;
  };
  
  // 使用 throttle 优化性能
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // 初始化进度
  updateProgress();
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-btn');
  
  if (!searchInput) return;
  
  const doSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/articles.html?q=${encodeURIComponent(query)}`;
    } else {
      window.location.href = '/articles.html';
    }
  };
  
  searchBtn?.addEventListener('click', doSearch);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  });
}

/**
 * 初始化关于我们页面
 */
function initAboutPage() {
  updatePageTdk(
    '关于我们',
    `了解${SITE_CONFIG.siteName}的专业服务与团队，15年行业经验，2000+成功项目。`,
    SITE_CONFIG.seoKeywords.join(', ')
  );
  
  addBaiduStructuredData('WebPage', {
    title: '关于我们',
    description: `了解${SITE_CONFIG.siteName}的专业服务与团队`
  });
  
  updateBreadcrumbSchema([
    { name: '首页', url: SITE_CONFIG.siteUrl + '/' },
    { name: '关于我们', url: SITE_CONFIG.siteUrl + '/about.html' }
  ]);
}

/**
 * 初始化联系方式页面
 */
function initContactPage() {
  updatePageTdk(
    '联系方式',
    `联系${SITE_CONFIG.siteName}获取专业招标代理服务，电话：${SITE_CONFIG.contact.phone}。`,
    SITE_CONFIG.seoKeywords.join(', ')
  );
  
  addBaiduStructuredData('WebPage', {
    title: '联系方式',
    description: `联系${SITE_CONFIG.siteName}获取专业招标代理服务`
  });
  
  updateBreadcrumbSchema([
    { name: '首页', url: SITE_CONFIG.siteUrl + '/' },
    { name: '联系方式', url: SITE_CONFIG.siteUrl + '/contact.html' }
  ]);
}

// ============================================
// 页面加载完成后初始化
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('===== DOMContentLoaded 事件触发 =====');
  console.log('页面类型:', document.body.dataset.page);
  
  // 页面加载动画
  document.body.classList.add('page-loading');
  setTimeout(() => {
    document.body.classList.remove('page-loading');
    document.body.classList.add('page-loaded');
  }, 100);
  
  // 初始化滚动动画
  initScrollAnimations();
  
  // 初始化滚动进度条
  initScrollProgress();
  
  // 初始化数字计数动画
  initCounterAnimation();
  
  // 初始化视差滚动效果
  initParallaxEffect();
  
  // 初始化粒子背景效果
  initParticleEffect();
  
  // 初始化通用功能
  initMobileMenu();
  initBackToTop();
  initSearch();
  
  // 根据页面类型初始化
  const pageType = document.body.dataset.page;
  console.log('pageType =', pageType);
  
  switch (pageType) {
    case 'home':
      console.log('调用 initHomePage');
      initHomePage();
      break;
    case 'articles':
      console.log('调用 initArticlesPage');
      initArticlesPage();
      break;
    case 'article':
      console.log('调用 initArticlePage');
      initArticlePage();
      break;
    case 'about':
      console.log('调用 initAboutPage');
      initAboutPage();
      break;
    case 'contact':
      console.log('调用 initContactPage');
      initContactPage();
      break;
    default:
      console.log('未知页面类型:', pageType);
  }
});

// ============================================
// 滚动动画功能
// ============================================

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
  // 获取所有需要动画的元素
  const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right, .animate-scale');
  
  if (animatedElements.length === 0) return;
  
  // 创建 Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 添加延迟，使动画更自然
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 50);
        
        // 动画完成后停止观察
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  });
  
  // 观察所有元素
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * 为元素添加滚动动画类
 */
function addScrollAnimation(selector, animationType = 'fade-up') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    element.classList.add(`animate-${animationType}`);
    element.style.animationDelay = `${index * 0.1}s`;
  });
}

// ============================================
// 数字计数动画
// ============================================

/**
 * 初始化数字计数动画
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  
  if (counters.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const count = parseInt(target.getAttribute('data-count'));
        animateCounter(target, count);
        observer.unobserve(target);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => observer.observe(counter));
}

/**
 * 数字计数动画函数
 */
function animateCounter(element, target) {
  const duration = 2000;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      element.textContent = element.getAttribute('data-count') + (element.textContent.includes('%') ? '%' : '+');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '+');
    }
  }, 16);
}

// ============================================
// 滚动进度条
// ============================================

/**
 * 初始化滚动进度条
 */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgress');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });
}

// ============================================
// 视差滚动效果
// ============================================

/**
 * 初始化视差滚动效果
 */
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll('.parallax');
  
  if (parallaxElements.length === 0) return;
  
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.getAttribute('data-speed')) || 0.5;
          const offset = scrollTop * speed;
          element.style.transform = `translateY(${offset}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ============================================
// 粒子背景效果
// ============================================

/**
 * 初始化粒子背景效果
 */
function initParticleEffect() {
  const particleContainer = document.getElementById('particle-container');
  
  if (!particleContainer) return;
  
  // 创建粒子
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // 随机大小
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // 随机动画延迟
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    
    particleContainer.appendChild(particle);
  }
}

// ============================================
// 全局函数导出（用于 onclick 事件）
// ============================================

// 将函数暴露到全局作用域，以便在 HTML 的 onclick 属性中使用
window.showArticleModal = showArticleModal;
window.closeArticleModal = closeArticleModal;

console.log('✓ 全局函数已导出：showArticleModal, closeArticleModal');
