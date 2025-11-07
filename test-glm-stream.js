// 测试GLM API流式响应的脚本
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testGLMStream() {
  console.log('开始测试GLM API流式响应...');

  const requestBody = {
    model: 'glm-4.6',
    messages: [
      { role: 'user', content: '你好，请回复一个简短的问候语。' }
    ],
    stream: true,
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

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();

            if (data === '[DONE]') {
              console.log('流式响应完成');
              break;
            }

            try {
              const parsed = JSON.parse(data);
              console.log('收到数据:', JSON.stringify(parsed, null, 2));

              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                fullContent += content;
                console.log('累积内容:', fullContent);
              }
            } catch (parseError) {
              console.warn('解析流数据失败:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log('最终内容:', fullContent);

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testGLMStream();