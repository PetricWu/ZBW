// 测试 fetch 功能
async function testFetch() {
  try {
    console.log('开始测试...');
    const response = await fetch('/markdown/index.json?t=' + Date.now());
    console.log('Response:', response);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data:', data);
    console.log('Articles count:', data.articles ? data.articles.length : 0);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testFetch();
