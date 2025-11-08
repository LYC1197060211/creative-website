// 测试GLM-4.6网络搜索功能
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testWebSearch() {
  console.log('=== 测试GLM-4.6网络搜索功能 ===\n');

  // 测试1: 需要网络搜索的查询
  console.log('--- 测试1: 查询最新新闻 ---');
  await testMessage('今天的最新新闻有什么？', true);

  console.log('\n--- 测试2: 查询天气信息 ---');
  await testMessage('北京今天的天气怎么样？', true);

  console.log('\n--- 测试3: 普通对话（不需要网络搜索） ---');
  await testMessage('你好，请介绍一下自己', false);
}

async function testMessage(userMessage, expectWebSearch) {
  try {
    const requestBody = {
      model: 'glm-4.6',
      messages: [{ role: 'user', content: userMessage }],
      stream: false,
      temperature: 0.7,
      max_tokens: 500,
      tools: expectWebSearch ? [{
        type: 'function',
        function: {
          name: 'web_search',
          description: '搜索互联网获取最新信息',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: '搜索查询词'
              }
            },
            required: ['query']
          },
          max_uses: 8
        }
      }] : undefined
    };

    console.log('用户消息:', userMessage);
    console.log('启用网络搜索:', !!expectWebSearch);

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API错误:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    const message = data.choices[0]?.message;

    console.log('有content:', !!message.content);
    console.log('有reasoning_content:', !!message.reasoning_content);
    console.log('有tool_calls:', !!message.tool_calls);

    if (message.tool_calls && message.tool_calls.length > 0) {
      console.log('✅ 检测到工具调用:');
      message.tool_calls.forEach((toolCall, index) => {
        console.log(`  工具${index + 1}:`, toolCall.function.name);
        try {
          const args = JSON.parse(toolCall.function.arguments);
          console.log(`  参数:`, args);
        } catch (e) {
          console.log(`  参数解析失败:`, toolCall.function.arguments);
        }
      });
    }

    let reply = '';
    if (message.content) {
      reply = message.content;
    } else if (message.reasoning_content) {
      // 简单提取
      const quotedMatch = message.reasoning_content.match(/"([^"]{1,100})"/);
      if (quotedMatch) {
        reply = quotedMatch[1];
      } else {
        reply = message.reasoning_content.substring(0, 200) + '...';
      }
    }

    console.log('AI回复:', reply.substring(0, 200) + (reply.length > 200 ? '...' : ''));
    console.log('✅ 测试成功\n');

    return true;

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    return false;
  }
}

testWebSearch();