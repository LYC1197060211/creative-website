// 测试GLM API的脚本
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testGLMAPI() {
  console.log('开始测试GLM API...');

  const requestBody = {
    model: 'glm-4.6',
    messages: [
      { role: 'user', content: '你好，请回复一个简短的问候语。' }
    ],
    stream: false,
    temperature: 0.7,
    max_tokens: 100
  };

  console.log('请求体:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API错误响应:', errorText);
      return;
    }

    const data = await response.json();
    console.log('API响应:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      console.log('AI回复:', data.choices[0].message.content);
    } else {
      console.log('没有收到回复内容');
    }

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testGLMAPI();