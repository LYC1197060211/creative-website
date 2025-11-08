// 快速测试聊天功能
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

async function testChatQuick() {
  console.log('=== 快速测试聊天功能 ===')

  const requestBody = {
    model: 'glm-4.6',
    messages: [
      { role: 'user', content: '你好' }
    ],
    stream: false,
    temperature: 0.7,
    max_tokens: 100
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    })

    console.log('响应状态:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API错误:', errorText)
      return false
    }

    const data = await response.json()
    const message = data.choices[0]?.message

    console.log('有content:', !!message.content)
    console.log('有reasoning_content:', !!message.reasoning_content)

    let reply = ''
    if (message.content) {
      reply = message.content
      console.log('使用content:', reply.substring(0, 100) + '...')
    } else if (message.reasoning_content) {
      // 简单提取
      const quotedMatch = message.reasoning_content.match(/"([^"]{1,30})"/)
      if (quotedMatch) {
        reply = quotedMatch[1]
        console.log('提取的回复:', reply)
      } else {
        reply = message.reasoning_content.substring(0, 100) + '...'
        console.log('使用reasoning_content前100字符:', reply)
      }
    }

    console.log('✅ 聊天功能正常，回复:', reply)
    return true

  } catch (error) {
    console.error('❌ 测试失败:', error)
    return false
  }
}

testChatQuick()