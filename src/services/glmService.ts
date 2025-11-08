export interface GLMMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface GLMChatRequest {
  model: string
  messages: GLMMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
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
    }
    finish_reason?: string
  }[]
}

export class GLMService {
  private baseURL = 'https://open.bigmodel.cn/api/paas/v4'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  // 智能提取reasoning_content中的实际回复
  private extractReplyFromReasoning(reasoningContent: string): string {
    // 如果reasoning_content太短，直接返回
    if (reasoningContent.length < 50) {
      return reasoningContent
    }

    console.log('开始解析reasoning_content...')

    // 1. 首先尝试提取引号内容，但排除用户的原话和分析性内容
    const quotedMatches = reasoningContent.match(/"([^"]{1,50})"/g)
    if (quotedMatches) {
      for (const match of quotedMatches) {
        const content = match.replace(/"/g, '').trim()
        console.log('找到引号内容:', content)
        // 排除用户请求和分析性内容
        if (content && content.length > 1 && content.length < 50 &&
            !content.includes('请') && !content.includes('简单回复') &&
            !content.includes('问候语') && !content.includes('你好，请') &&
            !content.includes('分析') && !content.includes('用户') &&
            !content.includes('请求') && !content.includes('任务') &&
            !content.includes('核心') && !content.includes('关键词')) {
          return content
        }
      }
    }

    // 2. 尝试特定模式匹配
    const specificPatterns = [
      /(?:回复|回答|选择)[：:]\s*"([^"]{1,50})"/,
      /(?:回复|回答|选择)[：:]\s*([^\n]{1,50})/,
      /(?:因此|所以|最终)[：:]\s*"([^"]{1,50})"/,
      /(?:因此|所以|最终)[：:]\s*([^\n]{1,50})/,
      /(?:决定是|最佳选项)[：:]\s*"([^"]{1,50})"/,
      /(?:决定是|最佳选项)[：:]\s*([^\n]{1,50})/,
    ]

    for (const pattern of specificPatterns) {
      const match = reasoningContent.match(pattern)
      if (match) {
        const content = (match[1] || match[0]).trim().replace(/[。！？]/g, '')
        console.log('找到模式匹配:', content)
        if (content && content.length > 1 && content.length < 50 &&
            !content.includes('分析') && !content.includes('用户') &&
            !content.includes('请求') && !content.includes('任务')) {
          return content
        }
      }
    }

    // 3. 尝试找简短的、有意义的句子
    const sentences = reasoningContent.split(/[。！？\n]+/)
    for (let i = sentences.length - 1; i >= 0; i--) {
      const sentence = sentences[i].trim()
      if (sentence.length > 3 && sentence.length < 50 &&
          !sentence.includes('**') && !sentence.includes('*') &&
          !sentence.includes('分析') && !sentence.includes('用户') &&
          !sentence.includes('请求') && !sentence.includes('核心') &&
          !sentence.includes('任务') && !sentence.includes('关键词') &&
          !sentence.includes('约束') && !sentence.includes('模式') &&
          !sentence.includes('选择') && !sentence.includes('选项') &&
          !sentence.includes('考虑') && !sentence.includes('需要') &&
          !sentence.includes('应该') && !sentence.includes('可以') &&
          !sentence.match(/^[0-9]+[\.\)]\s*/)) { // 排除编号列表
        console.log('找到合适句子:', sentence)
        return sentence
      }
    }

    // 4. 如果都没有找到，尝试简单清理并返回最后有意义的内容
    for (let i = sentences.length - 1; i >= 0; i--) {
      const sentence = sentences[i].trim()
      if (sentence.length > 5) {
        const cleaned = sentence.replace(/[**\*]/g, '').trim()
        if (cleaned.length < 100) {
          console.log('使用清理后的句子:', cleaned)
          return cleaned
        }
      }
    }

    // 5. 最后的后备方案
    console.log('使用后备方案')
    return reasoningContent.substring(Math.max(0, reasoningContent.length - 100))
  }

  async sendMessage(
    messages: GLMMessage[],
    onStream?: (content: string) => void
  ): Promise<string> {
    try {
      console.log('开始发送GLM API请求')

      const requestBody = {
        model: 'glm-4.6',
        messages,
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
        console.error('API错误响应:', errorText)
        throw new Error(`GLM API Error: ${response.status} ${response.statusText}`)
      }

      // 流式响应处理
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let fullReasoningContent = ''

      if (!reader) {
        throw new Error('No response body reader available')
      }

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
                console.log('流式响应完成')

                // 如果没有content但有reasoning_content，尝试提取实际回复
                if (!fullContent && fullReasoningContent) {
                  const extractedReply = this.extractReplyFromReasoning(fullReasoningContent)
                  console.log('从reasoning_content提取的回复:', extractedReply)

                  if (onStream) {
                    onStream(extractedReply)
                  }
                  return extractedReply
                }

                return fullContent
              }

              try {
                const parsed = JSON.parse(data) as GLMStreamResponse
                const content = parsed.choices[0]?.delta?.content
                const reasoningContent = parsed.choices[0]?.delta?.reasoning_content

                if (content) {
                  fullContent += content
                  console.log('收到content:', content)
                  if (onStream) {
                    onStream(fullContent)
                  }
                }

                if (reasoningContent) {
                  fullReasoningContent += reasoningContent
                  console.log('收到reasoning_content:', reasoningContent.substring(0, 50) + (reasoningContent.length > 50 ? '...' : ''))
                }
              } catch (parseError) {
                console.warn('解析流数据失败:', data, '错误:', parseError.message)
                // 尝试修复常见的JSON问题
                try {
                  const fixedData = data.replace(/\\n/g, '\\\\n').replace(/\\"/g, '\\\\"')
                  const parsed = JSON.parse(fixedData) as GLMStreamResponse
                  const reasoningContent = parsed.choices[0]?.delta?.reasoning_content
                  if (reasoningContent) {
                    fullReasoningContent += reasoningContent
                    console.log('修复后收到reasoning_content:', reasoningContent.substring(0, 50) + '...')
                  }
                } catch (secondError) {
                  console.warn('修复后仍然解析失败')
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      // 响应结束后的最终处理
      if (!fullContent && fullReasoningContent) {
        const extractedReply = this.extractReplyFromReasoning(fullReasoningContent)
        console.log('从reasoning_content提取的回复:', extractedReply)

        if (onStream) {
          onStream(extractedReply)
        }
        return extractedReply
      }

      console.log('最终响应内容:', fullContent)
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