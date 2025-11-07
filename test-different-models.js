// 测试不同GLM模型的响应
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testModel(modelName) {
  console.log(`\n=== 测试模型: ${modelName} ===`);

  const requestBody = {
    model: modelName,
    messages: [
      { role: 'user', content: '你好，请简单回复一个问候语。' }
    ],
    stream: false,
    temperature: 0.7,
    max_tokens: 100
  };

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
      return null;
    }

    const data = await response.json();
    console.log('完整响应:', JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0) {
      const choice = data.choices[0];
      console.log('消息:', choice.message);
      console.log('有content:', !!choice.message.content);
      console.log('有reasoning_content:', !!choice.message.reasoning_content);

      return {
        model: modelName,
        content: choice.message.content,
        reasoning_content: choice.message.reasoning_content
      };
    }
  } catch (error) {
    console.error('测试失败:', error);
  }

  return null;
}

async function testAllModels() {
  const models = [
    'glm-4.6',
    'glm-4',
    'glm-4-flash',
    'glm-4-long',
    'glm-3-turbo'
  ];

  const results = [];

  for (const model of models) {
    const result = await testModel(model);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n=== 测试总结 ===');
  for (const result of results) {
    console.log(`\n模型: ${result.model}`);
    console.log(`content长度: ${result.content ? result.content.length : 0}`);
    console.log(`reasoning_content长度: ${result.reasoning_content ? result.reasoning_content.length : 0}`);
    if (result.content) {
      console.log(`content内容: "${result.content}"`);
    }
    if (result.reasoning_content) {
      console.log(`reasoning_content前100字符: "${result.reasoning_content.substring(0, 100)}..."`);
    }
  }
}

testAllModels();