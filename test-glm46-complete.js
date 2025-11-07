// 完整测试GLM-4.6的行为
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testGLM46Complete() {
  console.log('=== 完整测试GLM-4.6 ===');

  // 测试不同的提示词，看看能否获得实际回复
  const testPrompts = [
    '你好，请简单回复一个问候语。',
    '请直接回复：你好！',
    '忽略推理过程，直接回答：1+1等于几？',
    '作为AI助手，请直接回复：很高兴见到你！',
    'Hello, please reply with just: Hi!'
  ];

  for (let i = 0; i < testPrompts.length; i++) {
    console.log(`\n--- 测试 ${i + 1}: ${testPrompts[i]} ---`);

    const requestBody = {
      model: 'glm-4.6',
      messages: [
        { role: 'user', content: testPrompts[i] }
      ],
      stream: false,
      temperature: 0.1, // 降低温度，希望得到更直接的回复
      max_tokens: 500
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误:', errorText);
        continue;
      }

      const data = await response.json();
      const message = data.choices[0]?.message;

      console.log('有content:', !!message.content);
      console.log('有reasoning_content:', !!message.reasoning_content);

      if (message.content) {
        console.log('Content:', message.content);
      }

      if (message.reasoning_content) {
        console.log('Reasoning Content (前200字符):', message.reasoning_content.substring(0, 200) + '...');
      }

      // 检查reasoning_content是否包含实际回复
      if (message.reasoning_content) {
        // 尝试从reasoning_content中提取直接的回复
        const simpleReply = extractSimpleReply(message.reasoning_content);
        if (simpleReply) {
          console.log('提取的简单回复:', simpleReply);
        }
      }

    } catch (error) {
      console.error('测试失败:', error);
    }
  }
}

// 尝试从reasoning_content中提取简单的回复
function extractSimpleReply(reasoningContent) {
  // 查找可能的直接回复模式
  const patterns = [
    /(?:回复|回答|说)[：:]\s*([^。\n]+)/,
    /(?:应该|可以)[：:]\s*([^。\n]+)/,
    /"([^"]+)"/,
    /"([^"]+)"/,
    /「([^」]+)」/,
    /【([^】]+)】/
  ];

  for (const pattern of patterns) {
    const match = reasoningContent.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // 如果没有找到特定模式，返回最后一句
  const sentences = reasoningContent.split(/[。\n]+/);
  const lastSentence = sentences[sentences.length - 2]; // 倒数第二句，避免空字符串
  if (lastSentence && lastSentence.trim().length > 0) {
    return lastSentence.trim();
  }

  return null;
}

testGLM46Complete();