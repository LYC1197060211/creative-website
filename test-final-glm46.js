// 最终测试GLM-4.6与智能解析器
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

// 复制解析器逻辑
function extractReplyFromReasoning(reasoningContent) {
  if (reasoningContent.length < 50) {
    return reasoningContent
  }

  console.log('开始解析reasoning_content...')

  // 1. 首先尝试提取引号内容，但排除用户的原话
  const quotedMatches = reasoningContent.match(/"([^"]{1,30})"/g)
  if (quotedMatches) {
    for (const match of quotedMatches) {
      const content = match.replace(/"/g, '').trim()
      console.log('找到引号内容:', content)
      // 排除用户请求的常见内容
      if (content && content.length > 1 && content.length < 30 &&
          !content.includes('请') && !content.includes('简单回复') &&
          !content.includes('问候语') && !content.includes('你好，请')) {
        return content
      }
    }
  }

  // 2. 尝试特定模式匹配
  const specificPatterns = [
    /(?:回复|回答|选择)[：:]\s*([^\n]{1,30})/,
    /(?:因此|所以|最终)[：:]\s*([^\n]{1,30})/,
    /(?:决定是|最佳选项)[：:]\s*([^\n]{1,30})/,
  ]

  for (const pattern of specificPatterns) {
    const match = reasoningContent.match(pattern)
    if (match && match[1]) {
      const content = match[1].trim().replace(/[。！？]/g, '')
      console.log('找到模式匹配:', content)
      if (content && content.length > 1 && content.length < 30) {
        return content
      }
    }
  }

  // 3. 尝试找简短的句子
  const sentences = reasoningContent.split(/[。！？\n]+/)
  for (let i = sentences.length - 1; i >= 0; i--) {
    const sentence = sentences[i].trim()
    if (sentence.length > 2 && sentence.length < 30 &&
        !sentence.includes('**') && !sentence.includes('分析') &&
        !sentence.includes('用户') && !sentence.includes('请求') &&
        !sentence.includes('核心') && !sentence.includes('任务')) {
      console.log('找到合适句子:', sentence)
      return sentence
    }
  }

  // 4. 最后的后备方案
  console.log('使用后备方案')
  return reasoningContent.substring(Math.max(0, reasoningContent.length - 50))
}

async function testFinalGLM46() {
  console.log('=== 最终测试GLM-4.6智能解析 ===')

  const testMessages = [
    '你好',
    '请直接回复：很高兴见到你！',
    '今天天气怎么样？',
    '1+1等于几？'
  ]

  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i]
    console.log(`\n--- 测试 ${i + 1}: "${message}" ---`)

    const requestBody = {
      model: 'glm-4.6',
      messages: [
        { role: 'user', content: message }
      ],
      stream: false,
      temperature: 0.7,
      max_tokens: 500
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

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API错误:', errorText)
        continue
      }

      const data = await response.json()
      const msg = data.choices[0]?.message

      console.log('有content:', !!msg.content)
      console.log('有reasoning_content:', !!msg.reasoning_content)

      let finalReply = ''

      if (msg.content) {
        finalReply = msg.content
        console.log('直接使用content:', finalReply)
      } else if (msg.reasoning_content) {
        finalReply = extractReplyFromReasoning(msg.reasoning_content)
        console.log('从reasoning_content提取:', finalReply)
      }

      console.log('✅ 最终回复:', finalReply)

    } catch (error) {
      console.error('测试失败:', error)
    }
  }
}

testFinalGLM46();