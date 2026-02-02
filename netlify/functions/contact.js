/**
 * Netlify Function - 联系表单处理
 * 
 * 功能：
 * - 接收并处理联系表单提交
 * - 发送邮件通知（可选，需要配置邮件服务）
 * - 将表单数据保存到文件（可选）
 * - 返回提交结果
 * 
 * 调用方式：
 * - POST /.netlify/functions/contact
 * 
 * 环境变量（可选）：
 * - EMAIL_TO: 接收邮箱地址
 * - EMAIL_FROM: 发送邮箱地址
 * - SAVE_FORM_DATA: 是否保存表单数据到文件（true/false）
 * - FORM_DATA_PATH: 表单数据保存路径（默认：form-submissions.json）
 */

const fs = require('fs');
const path = require('path');

/**
 * 验证表单数据
 */
function validateFormData(data) {
  const errors = [];

  // 必填字段
  const requiredFields = ['name', 'email', 'message'];
  requiredFields.forEach(field => {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`${field} 是必填字段`);
    }
  });

  // 邮箱格式验证
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('邮箱格式不正确');
  }

  // 电话格式验证（可选）
  if (data.phone && !/^[\d\s\-\+\(\)]+$/.test(data.phone)) {
    errors.push('电话格式不正确');
  }

  return errors;
}

/**
 * 保存表单数据到文件
 */
function saveFormData(data, filePath) {
  try {
    let submissions = [];
    
    // 如果文件存在，读取现有数据
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      try {
        submissions = JSON.parse(content);
      } catch (error) {
        console.error('解析表单数据文件失败:', error);
        submissions = [];
      }
    }

    // 添加新提交
    submissions.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: data
    });

    // 保存到文件
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf-8');
    
    return true;
  } catch (error) {
    console.error('保存表单数据失败:', error);
    return false;
  }
}

/**
 * 主处理函数
 */
exports.handler = async (event, context) => {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'POST'
      },
      body: JSON.stringify({
        success: false,
        message: '只允许 POST 请求'
      })
    };
  }

  console.log('收到联系表单提交...');

  try {
    // 解析请求体
    let formData;
    try {
      formData = JSON.parse(event.body);
    } catch (error) {
      // 如果不是 JSON，尝试解析表单数据
      const params = new URLSearchParams(event.body);
      formData = {};
      params.forEach((value, key) => {
        formData[key] = value;
      });
    }

    console.log('表单数据:', JSON.stringify(formData, null, 2));

    // 验证表单数据
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: '表单数据验证失败',
          errors: errors
        })
      };
    }

    // 清理和标准化数据
    const cleanedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone ? formData.phone.trim() : '',
      company: formData.company ? formData.company.trim() : '',
      message: formData.message.trim(),
      timestamp: new Date().toISOString()
    };

    // 保存表单数据到文件（如果启用）
    const saveFormDataEnabled = process.env.SAVE_FORM_DATA === 'true';
    if (saveFormDataEnabled) {
      const formFilePath = process.env.FORM_DATA_PATH || 'form-submissions.json';
      const saved = saveFormData(cleanedData, formFilePath);
      if (saved) {
        console.log(`表单数据已保存到 ${formFilePath}`);
      } else {
        console.warn('保存表单数据失败');
      }
    }

    // 这里可以添加发送邮件的逻辑
    // 示例：使用 Netlify Forms 或第三方邮件服务
    if (process.env.EMAIL_TO) {
      console.log(`邮件通知功能已配置，将发送到: ${process.env.EMAIL_TO}`);
      // TODO: 集成邮件发送功能
    }

    console.log('✓ 表单提交成功');

    // 返回成功响应
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: '表单提交成功！我们会尽快与您联系。',
        data: {
          timestamp: cleanedData.timestamp
        }
      })
    };

  } catch (error) {
    console.error('处理表单提交失败:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: '服务器错误，请稍后重试',
        error: error.message
      })
    };
  }
};
