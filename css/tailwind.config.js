/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./pages/*.html",
    "./js/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // 政务蓝主色
        'gov-blue': '#005EA5',
        'gov-blue-dark': '#004A82',
        'gov-blue-light': '#E8F4F8',
        // 浅灰背景
        'gov-gray': '#F5F7FA',
        'gov-gray-dark': '#E5E9EF',
        // 文字颜色
        'gov-text': '#333333',
        'gov-text-light': '#666666',
        'gov-text-lighter': '#999999',
        // 边框颜色
        'gov-border': '#E0E0E0',
      },
      fontFamily: {
        'sans': ['"Microsoft YaHei"', '"Source Han Sans"', '"Noto Sans SC"', 'sans-serif'],
      },
      fontSize: {
        'base': ['16px', { lineHeight: '1.7' }],
        'sm': ['14px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.7' }],
        'xl': ['20px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['30px', { lineHeight: '1.3' }],
      },
      borderRadius: {
        'gov': '4px',
      },
      boxShadow: {
        'gov': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'gov-hover': '0 2px 6px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
