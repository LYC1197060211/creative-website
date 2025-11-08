// 完整调试聊天功能
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

// 模拟智能解析器
function extractReplyFromReasoning(reasoningContent) {
  if (reasoningContent.length < 50) {
    return reasoningContent
  }

  // 1. 首先尝试提取引号内容，但排除用户的原话
  const quotedMatches = reasoningContent.match(/"([^"]{1,30})"/g)
  if (quotedMatches) {
    for (const match of quotedMatches) {
      const content = match.replace(/"/g, '').trim()
      // 排除用户请求的常见内容
      if (content && content.length > 1 && content.length < 30 &&
          !content.includes('请') && !content.includes('简单回复') &&
          !content.includes('问候语') && !content.includes('你好，请')) {
        return content
      }
    }
  }

  // 2. 后备方案
  return reasoningContent.substring(Math.max(0, reasoningContent.length - 50))
}

async function testFullChatFlow() {
  console.log('=== 完整聊天流程测试 ===')

  // 1. 测试简单消息
  console.log('\n--- 测试1: 简单问候 ---')
  await testMessage('你好')

  // 2. 测试明确指令
  console.log('\n--- 测试2: 明确指令 ---')
  await testMessage('请直接回复：今天天气很好！')

  // 3. 测试问题
  console.log('\n--- 测试3: 问题 ---')
  await testMessage('1+1等于几？')

  // 4. 测试流式响应
  console.log('\n--- 测试4: 流式响应 ---')
  await testStreamMessage('你好，请简单回复')
}

async function testMessage(userMessage) {
  try {
    const requestBody = {
      model: 'glm-4.6',
      messages: [{ role: 'user', content: userMessage }],
      stream: false,
      temperature: 0.7,
      max_tokens: 500
    }

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const message = data.choices[0]?.message

    console.log('用户:', userMessage)
    console.log('有content:', !!message.content)
    console.log('有reasoning_content:', !!message.reasoning_content)

    let reply = ''
    if (message.content) {
      reply = message.content
      console.log('使用content:', reply.substring(0, 100))
    } else if (message.reasoning_content) {
      reply = extractReplyFromReasoning(message.reasoning_content)
      console.log('提取回复:', reply)
    }

    console.log('最终回复:', reply)
    return reply

  } catch (error) {
    console.error('❌ 错误:', error.message)
    return null
  }
}

async function testStreamMessage(userMessage) {
  try {
    const requestBody = {
      model: 'glm-4.6',
      messages: [{ role: 'user', content: userMessage }],
      stream: true,
      temperature: 0.7,
      max_tokens: 200
    }

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''
    let fullReasoningContent = ''
    let chunkCount = 0

    console.log('开始流式响应...')

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()

            if (data === '[DONE]') {
              console.log('流式响应结束')
              break
            }

            try {
              const parsed = JSON.parse(data)
              chunkCount++

              const content = parsed.choices[0]?.delta?.content
              const reasoningContent = parsed.choices[0]?.delta?.reasoning_content

              if (content) {
                fullContent += content
                console.log(`收到content (${chunkCount}):`, content)
              }

              if (reasoningContent) {
                fullReasoningContent += reasoningContent
                if (chunkCount <= 3) { // 只显示前几个reasoning内容
                  console.log(`收到reasoning_content (${chunkCount}):`, reasoningContent.substring(0, 50) + '...')
                }
              }
            } catch (parseError) {
              console.warn('解析失败:', parseError.message)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    console.log('最终结果:')
    console.log('- content长度:', fullContent.length)
    console.log('- reasoning_content长度:', fullReasoningContent.length)

    let finalReply = ''
    if (fullContent) {
      finalReply = fullContent
    } else if (fullReasoningContent) {
      finalReply = extractReplyFromReasoning(fullReasoningContent)
    }

    console.log('- 最终回复:', finalReply)
    return finalReply

  } catch (error) {
    console.error('❌ 流式测试错误:', error.message)
    return null
  }
}

testFullChatFlow()