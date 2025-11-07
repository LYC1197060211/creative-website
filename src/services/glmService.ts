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

      // 简化的流式响应处理
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

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
                return fullContent
              }

              try {
                const parsed = JSON.parse(data) as GLMStreamResponse
                const content = parsed.choices[0]?.delta?.content

                if (content) {
                  fullContent += content
                  console.log('收到内容:', content)
                  console.log('累积内容:', fullContent)
                  if (onStream) {
                    onStream(fullContent)
                  }
                }
              } catch (parseError) {
                console.warn('解析流数据失败:', data)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
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