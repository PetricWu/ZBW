// FAQ展开收起功能
document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-icon');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // 关闭所有其他FAQ
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherIcon = otherItem.querySelector('.faq-icon');
        otherIcon.style.transform = 'rotate(0deg)';
      });

      // 切换当前FAQ状态
      if (!isActive) {
        item.classList.add('active');
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });
});

// 表单提交功能
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  // 获取表单数据
  const formData = new FormData(this);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    projectType: formData.get('projectType'),
    budget: formData.get('budget'),
    message: formData.get('message')
  };

  // 显示成功消息
  const submitBtn = this.querySelector('.submit-btn');
  const originalText = submitBtn.querySelector('span').textContent;

  submitBtn.querySelector('span').textContent = '提交成功！';
  submitBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';

  // 模拟提交延迟
  setTimeout(() => {
    alert('感谢您的咨询！我们已收到您的信息，将在24小时内与您联系。');
    this.reset();

    // 恢复按钮状态
    submitBtn.querySelector('span').textContent = originalText;
    submitBtn.style.background = '';
  }, 1000);
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 输入框聚焦动画
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.classList.add('focused');
  });

  input.addEventListener('blur', function() {
    this.parentElement.classList.remove('focused');
  });
});
