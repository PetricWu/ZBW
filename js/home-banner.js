/**
 * 首页轮播图控制脚本
 * Home Banner Controller
 */

class HomeBanner {
  constructor() {
    this.slides = document.querySelectorAll('.banner-slide-item');
    this.prevBtn = document.getElementById('bannerPrev');
    this.nextBtn = document.getElementById('bannerNext');
    this.dots = document.querySelectorAll('.banner-dot');
    
    this.currentIndex = 0;
    this.isAnimating = false;
    this.autoplayInterval = 5000;
    this.autoplayTimer = null;
    
    this.init();
  }
  
  init() {
    if (this.slides.length === 0) {
      console.warn('HomeBanner: No slides found');
      return;
    }
    
    // 绑定事件
    this.bindEvents();
    
    // 开始自动播放
    this.startAutoplay();
    
    console.log('HomeBanner initialized with', this.slides.length, 'slides');
  }
  
  bindEvents() {
    // 上一张按钮
    this.prevBtn?.addEventListener('click', () => {
      this.prev();
      this.resetAutoplay();
    });
    
    // 下一张按钮
    this.nextBtn?.addEventListener('click', () => {
      this.next();
      this.resetAutoplay();
    });
    
    // 指示器按钮
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goTo(index);
        this.resetAutoplay();
      });
    });
    
    // 鼠标悬停暂停
    const banner = document.getElementById('homeBanner');
    if (banner) {
      banner.addEventListener('mouseenter', () => {
        this.pauseAutoplay();
      });
      
      banner.addEventListener('mouseleave', () => {
        this.startAutoplay();
      });
    }
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
        this.resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        this.next();
        this.resetAutoplay();
      }
    });
    
    // 触摸滑动支持
    this.initTouchSupport();
  }
  
  initTouchSupport() {
    const banner = document.getElementById('homeBanner');
    if (!banner) return;
    
    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;
    
    banner.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    banner.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const distance = endX - startX;
      
      if (Math.abs(distance) > minSwipeDistance) {
        if (distance > 0) {
          this.prev();
        } else {
          this.next();
        }
        this.resetAutoplay();
      }
    }, { passive: true });
  }
  
  goTo(index) {
    if (index < 0) {
      index = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      index = 0;
    }
    
    // 移除当前活动状态
    this.slides[this.currentIndex].classList.remove('active');
    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.remove('active');
    }
    
    // 更新索引
    this.currentIndex = index;
    
    // 添加新的活动状态
    this.slides[this.currentIndex].classList.add('active');
    if (this.dots[this.currentIndex]) {
      this.dots[this.currentIndex].classList.add('active');
    }
  }
  
  next() {
    this.goTo(this.currentIndex + 1);
  }
  
  prev() {
    this.goTo(this.currentIndex - 1);
  }
  
  startAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
    
    this.autoplayTimer = setInterval(() => {
      this.next();
    }, this.autoplayInterval);
  }
  
  pauseAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
  
  resetAutoplay() {
    this.startAutoplay();
  }
  
  destroy() {
    this.pauseAutoplay();
    this.prevBtn?.removeEventListener('click', this.prev);
    this.nextBtn?.removeEventListener('click', this.next);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  window.homeBanner = new HomeBanner();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomeBanner;
}
