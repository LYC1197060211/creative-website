import type { SearchResult } from '@/types/chat'

export interface GLMMessage {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  name?: string
  tool_call_id?: string
}

export interface GLMChatRequest {
  model: string
  messages: GLMMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface GLMToolCall {
  id: string
  type: string
  function: {
    name: string
    arguments: string
  }
}

export interface GLMChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface GLMStreamResponse {
  id: string
  object: string
  created: number
  model: string
  choices: {
    index: number
    delta: {
      role?: string
      content?: string
      reasoning_content?: string
      tool_calls?: GLMToolCall[]
    }
    finish_reason?: string
  }[]
}

export interface GLMWebSearchResult {
  title: string
  content: string
  link: string
  media?: string
  icon?: string
  refer?: string
  publish_date?: string
}

export interface GLMWebSearchResponse {
  id: string
  created: number
  request_id: string
  search_intent?: {
    query: string
    intent: 'SEARCH_ALL' | 'SEARCH_NONE' | 'SEARCH_ALWAYS'
    keywords?: string
  }[]
  search_result?: GLMWebSearchResult[]
}

export class GLMService {
  private baseURL = 'https://open.bigmodel.cn/api/paas/v4'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private needsWebSearch(message: string): boolean {
    const searchKeywords = [
      '最新',
      '新闻',
      '今天',
      '昨天',
      '现在',
      '实时',
      '当前',
      '天气',
      '股市',
      '股票',
      '汇率',
      '价格',
      '行情',
      '资讯',
      '热点',
      '搜索',
      '查询',
      '找一下',
      '百度',
      '谷歌',
      '2024',
      '2025',
      '今年',
      '本月',
      '本周',
      '最近',
    ]

    return searchKeywords.some((keyword) => message.includes(keyword))
  }

  private async performWebSearch(query: string): Promise<GLMWebSearchResponse | null> {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return null
    }

    const payload = {
      search_query: trimmedQuery.slice(0, 70),
      search_engine: 'search_std',
      search_intent: true,
      count: 8,
      content_size: 'medium',
    }

    // When executed server-side (e.g., in tests) we can call大模型接口 directly.
    if (typeof window === 'undefined') {
      const response = await fetch(`${this.baseURL}/web_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Web search error: ${response.status} ${errorText}`)
      }

      return response.json()
    }

    const proxyResponse = await fetch('/api/web-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        apiKey: this.apiKey,
      }),
    })

    if (!proxyResponse.ok) {
      const errorText = await proxyResponse.text()
      throw new Error(`Web search proxy error: ${proxyResponse.status} ${errorText}`)
    }

    return proxyResponse.json()
  }

  private formatWebSearchResults(
    response: GLMWebSearchResponse | null
  ): { formattedText: string; structuredResults: SearchResult[] } | null {
    if (!response?.search_result?.length) {
      return null
    }

    const structuredResults: SearchResult[] = response.search_result.slice(0, 5).map((item) => ({
      title: item.title || '未命名结果',
      summary: item.content?.trim() || '（暂无摘要）',
      link: item.link,
      source: item.media || item.refer || '未知来源',
      publishedAt: item.publish_date,
    }))

    const formattedText = structuredResults
      .map((result, index) => {
        const publishedAt = result.publishedAt ? `（${result.publishedAt}）` : ''
        return `${index + 1}. ${result.title}${publishedAt}\n来源：${result.source}\n链接：${result.link}\n摘要：${result.summary}`
      })
      .join('\n\n')

    return { formattedText, structuredResults }
  }

  private isUsefulSentence(sentence: string): boolean {
    if (!sentence) {
      return false
    }

    const trimmed = sentence.trim()
    if (trimmed.length < 2 || trimmed.length > 120) {
      return false
    }

    const excludedKeywords = [
      '分析',
      '用户',
      '请求',
      '任务',
      '约束',
      '考虑',
      '应该',
      '可以',
      '模式',
      '选择',
      '选项',
      '核心',
      '关键',
      '步骤',
      '方案',
      '需要',
    ]

    return !excludedKeywords.some((keyword) => trimmed.includes(keyword))
  }

  private extractReplyFromReasoning(reasoningContent: string): string {
    if (reasoningContent.length < 50) {
      return reasoningContent
    }

    console.log('尝试从 reasoning_content 中提取可读回复')

    const quotedMatches = reasoningContent.match(/"([^"]{1,120})"/g)
    if (quotedMatches) {
      for (const match of quotedMatches) {
        const content = match.replace(/"/g, '').trim()
        if (this.isUsefulSentence(content)) {
          console.log('命中引号内容:', content)
          return content
        }
      }
    }

    const patterns = [
      /(?:最终回答|最终回复|最终选择|最佳选项)[：:]\s*"([^"]+)"/,
      /(?:最终回答|最终回复|最终选择|最佳选项)[：:]\s*([^\n]+)/,
      /(?:因此|所以|综上)[，,，]\s*"([^"]+)"/,
      /(?:因此|所以|综上)[，,，]\s*([^\n]+)/,
    ]

    for (const pattern of patterns) {
      const match = reasoningContent.match(pattern)
      if (match) {
        const content = (match[1] || match[0]).replace(/^[^"]*"/, '').replace(/"$/, '').trim()
        if (this.isUsefulSentence(content)) {
          console.log('命中模式内容:', content)
          return content
        }
      }
    }

    const sentences = reasoningContent.split(/[。！？!?\\n]+/)
    for (let i = sentences.length - 1; i >= 0; i--) {
      const sentence = sentences[i].trim()
      if (this.isUsefulSentence(sentence) && !/^[0-9]+[.)]/.test(sentence)) {
        console.log('命中末尾句子:', sentence)
        return sentence
      }
    }

    const fallback = reasoningContent.slice(-120).trim()
    console.log('使用尾部内容作为回复:', fallback)
    return fallback
  }

  async sendMessage(
    messages: GLMMessage[],
    onStream?: (content: string) => void,
    enableWebSearch: boolean = true,
    onSearchResults?: (results: { formattedText: string; structuredResults: SearchResult[] }) => void
  ): Promise<string> {
    try {
      console.log('开始调用 GLM Chat Interface')

      const lastMessage = messages[messages.length - 1]
      const shouldUseWebSearch = lastMessage?.role === 'user' &&
        (enableWebSearch || this.needsWebSearch(lastMessage.content))

      const enhancedMessages = [...messages]

      if (shouldUseWebSearch) {
        console.log('启用网络搜索功能')
        if (onStream) {
          onStream('（正在联网搜索最新信息，请稍候...）\n')
        }

        try {
          const searchResponse = await this.performWebSearch(lastMessage.content)
          const formattedResults = this.formatWebSearchResults(searchResponse)

          if (formattedResults) {
            const timestamp = new Date().toLocaleString()
            const formattedForUser = `🔎 网络搜索结果（${timestamp}）\n\n${formattedResults.formattedText}`

            if (onSearchResults) {
              onSearchResults({
                formattedText: formattedForUser,
                structuredResults: formattedResults.structuredResults,
              })
            }

            enhancedMessages.push({
              role: 'system',
              content: `以下是刚刚通过网络搜索获取的最新信息（${timestamp}）：\n${formattedResults.formattedText}\n请结合这些实时数据回答用户的问题，并在引用搜索内容时注明来源。`,
            })
          } else {
            console.log('网络搜索没有返回有效信息')
          }
        } catch (searchError) {
          console.error('网络搜索失败:', searchError)
          if (onStream) {
            onStream('（网络搜索失败，将基于已有知识继续回答。）\n')
          }
        }
      }

      const requestBody: GLMChatRequest = {
        model: 'glm-4.6',
        messages: enhancedMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      }

      console.log('请求体:', JSON.stringify(requestBody, null, 2))

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      })

      console.log('响应状态:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API 错误响应:', errorText)
        throw new Error(`GLM API Error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let fullReasoningContent = ''

      if (!reader) {
        throw new Error('No response body reader available')
      }

      let sseBuffer = ''
      let streamCompleted = false

      const processEventBlock = (block: string): boolean => {
        const lines = block.split('\n')

        for (const rawLine of lines) {
          const line = rawLine.trim()
          if (!line || !line.startsWith('data:')) {
            continue
          }

          const data = line.slice(line.indexOf(':') + 1).trim()
          if (!data) {
            continue
          }

          if (data === '[DONE]') {
            console.log('流式响应完成')
            return true
          }

          try {
            const parsed = JSON.parse(data) as GLMStreamResponse
            const content = parsed.choices[0]?.delta?.content
            const reasoning = parsed.choices[0]?.delta?.reasoning_content
            const toolCalls = parsed.choices[0]?.delta?.tool_calls

            if (content) {
              fullContent += content
              if (onStream) {
                onStream(fullContent)
              }
            }

            if (reasoning) {
              fullReasoningContent += reasoning
            }

            if (toolCalls && toolCalls.length > 0) {
              console.log('收到工具调用:', toolCalls)
            }
          } catch (parseError) {
            console.warn('解析流数据失败:', data, parseError)
          }
        }

        return false
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          sseBuffer += decoder.decode(value, { stream: true })
          const eventBlocks = sseBuffer.split('\n\n')
          sseBuffer = eventBlocks.pop() ?? ''

          for (const block of eventBlocks) {
            if (processEventBlock(block)) {
              streamCompleted = true
              break
            }
          }

          if (streamCompleted) {
            break
          }
        }
      } finally {
        reader.releaseLock()
      }

      if (!streamCompleted && sseBuffer.trim()) {
        streamCompleted = processEventBlock(sseBuffer)
      }

      if (!fullContent && fullReasoningContent) {
        const extracted = this.extractReplyFromReasoning(fullReasoningContent)
        if (onStream) {
          onStream(extracted)
        }
        return extracted
      }

      return fullContent
    } catch (error) {
      console.error('GLM API Error:', error)
      throw error
    }
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-4.6',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        }),
      })

      return response.ok
    } catch (error) {
      console.error('API Key validation error:', error)
      return false
    }
  }
}
