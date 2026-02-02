// ============================================
// 手工设计动画优化 - 消除机械感
// ============================================

// 随机延迟动画观察器
document.addEventListener('DOMContentLoaded', function() {
  // 获取所有需要动画的元素
  const animateElements = document.querySelectorAll('.animate-fade-up, .fade-in-stagger');

  if (animateElements.length === 0) return;

  // 为每个元素添加随机延迟
  animateElements.forEach((element, index) => {
    const randomDelay = Math.random() * 0.3 + (index * 0.08);
    element.style.animationDelay = `${randomDelay}s`;
  });

  // 使用Intersection Observer触发动画
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 添加随机小偏移
        const randomX = (Math.random() - 0.5) * 10;
        const randomY = (Math.random() - 0.5) * 10;

        entry.target.style.transform = `translate(${randomX}px, ${randomY}px)`;
        entry.target.classList.add('visible');

        // 动画完成后移除随机偏移
        setTimeout(() => {
          entry.target.style.transform = '';
        }, 800);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach(element => {
    observer.observe(element);
  });
});

// 随机微动效
function addRandomMicroAnimation() {
  // 为卡片添加随机的微小悬停效果
  const cards = document.querySelectorAll('.case-card, .testimonial-card, .faq-item, .team-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // 计算随机旋转角度
      const randomRotateX = (Math.random() - 0.5) * 2;
      const randomRotateY = (Math.random() - 0.5) * 2;

      card.style.transform = `
        perspective(1000px)
        rotateX(${randomRotateX}deg)
        rotateY(${randomRotateY}deg)
        translateY(-8px)
      `;
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = '';
    });
  });
}

// 鼠标跟随效果
function addMouseFollowEffect() {
  const decorativeElements = document.querySelectorAll('.organic-shape');

  decorativeElements.forEach(element => {
    document.addEventListener('mousemove', function(e) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / 50;
      const deltaY = (e.clientY - centerY) / 50;

      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  });
}

// 随机闪烁效果
function addRandomBlinkEffect() {
  const dots = document.querySelectorAll('.hand-dot');

  dots.forEach(dot => {
    setInterval(() => {
      if (Math.random() > 0.7) {
        dot.style.opacity = Math.random() * 0.5 + 0.5;
      }
    }, 2000);
  });
}

// 优化FAQ交互 - 添加随机弹性
function enhanceFAQInteraction() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');

      // 关闭其他FAQ时添加随机延迟
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          const randomDelay = Math.random() * 100 + 50;
          setTimeout(() => {
            otherItem.classList.remove('active');
            const icon = otherItem.querySelector('.faq-icon');
            if (icon) icon.style.transform = 'rotate(0deg)';
          }, randomDelay);
        }
      });

      // 切换当前FAQ
      if (!isActive) {
        item.classList.add('active');
        const icon = item.querySelector('.faq-icon');
        if (icon) {
          // 添加随机旋转角度
          const randomRotation = 180 + (Math.random() - 0.5) * 10;
          icon.style.transform = `rotate(${randomRotation}deg)`;
        }
      } else {
        item.classList.remove('active');
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}

// 优化表单交互 - 添加随机反馈
function enhanceFormInteraction() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      // 随机轻微缩放
      const randomScale = 1 + (Math.random() * 0.005);
      this.style.transform = `scale(${randomScale})`;
    });

    input.addEventListener('blur', function() {
      this.style.transform = '';
    });

    // 随机闪烁边框
    input.addEventListener('input', function() {
      if (Math.random() > 0.8) {
        this.style.borderColor = 'rgba(66, 165, 245, 0.6)';
        setTimeout(() => {
          this.style.borderColor = '';
        }, 200);
      }
    });
  });

  // 表单提交时添加随机延迟反馈
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.submit-btn');
      const originalText = submitBtn.querySelector('span').textContent;

      // 随机加载时间
      const randomLoadTime = Math.random() * 1000 + 800;

      submitBtn.querySelector('span').textContent = '提交中...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.8';

      setTimeout(() => {
        submitBtn.querySelector('span').textContent = '提交成功！';
        submitBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';

        setTimeout(() => {
          alert('感谢您的咨询！我们已收到您的信息，将在24小时内与您联系。');
          form.reset();

          submitBtn.querySelector('span').textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }, 800);
      }, randomLoadTime);
    });
  }
}

// 添加随机出现的装饰元素
function addRandomDecorations() {
  const sections = document.querySelectorAll('.success-cases-section, .testimonials-section, .team-section');

  sections.forEach(section => {
    const decoration = document.createElement('div');
    decoration.className = 'random-decoration';
    decoration.style.cssText = `
      position: absolute;
      width: ${Math.random() * 20 + 10}px;
      height: ${Math.random() * 20 + 10}px;
      background: rgba(21, 101, 192, ${Math.random() * 0.1 + 0.05});
      border-radius: ${Math.random() * 50 + 50}%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      pointer-events: none;
      opacity: 0;
      animation: randomFloat ${Math.random() * 5 + 5}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
    `;

    section.appendChild(decoration);
  });
}

// 添加随机浮动动画
const style = document.createElement('style');
style.textContent = `
  @keyframes randomFloat {
    0%, 100% {
      opacity: 0.3;
      transform: translate(0, 0) scale(1);
    }
    25% {
      opacity: 0.6;
      transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.1);
    }
    50% {
      opacity: 0.4;
      transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(0.95);
    }
    75% {
      opacity: 0.5;
      transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px) scale(1.05);
    }
  }
`;
document.head.appendChild(style);

// 初始化所有动画效果
addRandomMicroAnimation();
addMouseFollowEffect();
addRandomBlinkEffect();
enhanceFAQInteraction();
enhanceFormInteraction();
addRandomDecorations();

// 随机页面标题闪烁
function randomTitleBlink() {
  const title = document.title;

  setInterval(() => {
    if (Math.random() > 0.95) {
      document.title = '✨ ' + title;
      setTimeout(() => {
        document.title = title;
      }, 200);
    }
  }, 3000);
}

randomTitleBlink();

// 添加随机滚动进度条变化
function randomScrollProgress() {
  const scrollProgress = document.getElementById('scrollProgress');
  if (!scrollProgress) return;

  window.addEventListener('scroll', function() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;

    // 添加随机波动
    const randomFluctuation = (Math.random() - 0.5) * 2;
    const finalProgress = Math.min(100, Math.max(0, scrolled + randomFluctuation));

    scrollProgress.style.width = finalProgress + '%';
  });
}

randomScrollProgress();

// 添加按钮随机震动
function addButtonRandomShake() {
  const buttons = document.querySelectorAll('.banner-btn, .submit-btn');

  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      if (Math.random() > 0.7) {
        this.style.animation = 'shake 0.5s ease';
      }
    });

    button.addEventListener('animationend', function() {
      this.style.animation = '';
    });
  });
}

// 添加震动动画
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
`;
document.head.appendChild(shakeStyle);

addButtonRandomShake();
