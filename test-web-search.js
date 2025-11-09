// 简易脚本：模拟前端的“联网搜索 + GLM 回复”链路
const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x'
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'

async function performWebSearch(query) {
  const payload = {
    search_query: query.slice(0, 70),
    search_engine: 'search_std',
    search_intent: true,
    count: 8,
    content_size: 'medium',
  }

  const response = await fetch(`${BASE_URL}/web_search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Web search error: ${response.status} ${errorText}`)
  }

  return response.json()
}

function formatSearchResults(response) {
  if (!response?.search_result?.length) {
    return ''
  }

  return response.search_result.slice(0, 5).map((item, index) => {
    const publishedAt = item.publish_date ? `（${item.publish_date}）` : ''
    const source = item.media || item.refer || '未知来源'
    const summary = item.content?.trim() || '（暂无摘要）'

    return `${index + 1}. ${item.title || '未命名结果'}${publishedAt}\n来源：${source}\n链接：${item.link}\n摘要：${summary}`
  }).join('\n\n')
}

async function callChat(messages) {
  const requestBody = {
    model: 'glm-4.6',
    messages,
    stream: false,
    temperature: 0.7,
    max_tokens: 2000,
  }

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Chat API error: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message
}

async function testMessage(userMessage, enableWebSearch) {
  console.log('\n==============================')
  console.log('用户输入:', userMessage)
  console.log('是否强制联网搜索:', enableWebSearch)

  const messages = [{ role: 'user', content: userMessage }]

  if (enableWebSearch) {
    try {
      console.log('正在调用 Web Search API ...')
      const searchResponse = await performWebSearch(userMessage)
      const formatted = formatSearchResults(searchResponse)

      if (formatted) {
        const timestamp = new Date().toLocaleString()
        messages.push({
          role: 'system',
          content: `以下是联网搜索获取的最新信息（${timestamp}）：\n${formatted}\n请基于这些内容回答用户问题，并在引用时注明来源。`,
        })
      } else {
        console.log('Web Search 未返回有效结果')
      }
    } catch (error) {
      console.error('Web Search 调用失败:', error.message)
    }
  }

  const reply = await callChat(messages)

  console.log('是否包含 content:', !!reply?.content)
  console.log('是否包含 reasoning_content:', !!reply?.reasoning_content)

  if (reply?.content) {
    console.log('模型回复内容（前 400 字）:\n', reply.content.slice(0, 400))
  } else if (reply?.reasoning_content) {
    console.log('仅返回 reasoning_content，前 400 字:\n', reply.reasoning_content.slice(0, 400))
  } else {
    console.log('模型未返回可展示的文本。')
  }
}

async function main() {
  console.log('=== 连网检索链路自检 ===')
  await testMessage('请联网搜索最新的关于KPL的消息', true)
  await testMessage('今天的最新新闻有什么？', true)
  await testMessage('北京今天的天气怎么样？', true)
  await testMessage('你好，请介绍一下你自己', false)
}

main().catch((error) => {
  console.error('测试脚本执行失败:', error)
})
