// 详细测试GLM API响应结构的脚本
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testDetailedResponse() {
  console.log('=== 详细测试GLM API响应结构 ===');

  const requestBody = {
    model: 'glm-4.6',
    messages: [
      { role: 'user', content: '你好，请简单回复一个问候语。' }
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
    let fullReasoningContent = '';
    let chunkCount = 0;

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
              console.log('\n=== 流式响应完成 ===');
              console.log('最终content:', fullContent);
              console.log('最终reasoning_content:', fullReasoningContent);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              chunkCount++;

              if (chunkCount <= 5 || chunkCount % 10 === 0) {
                console.log(`\n--- 数据块 ${chunkCount} ---`);
                console.log('完整响应:', JSON.stringify(parsed, null, 2));
              }

              const delta = parsed.choices[0]?.delta;
              if (delta) {
                const content = delta.content || '';
                const reasoningContent = delta.reasoning_content || '';

                if (content) {
                  fullContent += content;
                  console.log(`收到content: "${content}"`);
                }

                if (reasoningContent) {
                  fullReasoningContent += reasoningContent;
                  console.log(`收到reasoning_content: "${reasoningContent}"`);
                }
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

    console.log('\n=== 最终总结 ===');
    console.log('总数据块数:', chunkCount);
    console.log('content总长度:', fullContent.length);
    console.log('reasoning_content总长度:', fullReasoningContent.length);
    console.log('content内容:', JSON.stringify(fullContent));
    console.log('reasoning_content内容:', JSON.stringify(fullReasoningContent));

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testDetailedResponse();