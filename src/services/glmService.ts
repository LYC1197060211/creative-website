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
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-4',
          messages,
          stream: !!onStream,
          temperature: 0.7,
          max_tokens: 2000,
        } as GLMChatRequest),
      })

      if (!response.ok) {
        throw new Error(`GLM API Error: ${response.status} ${response.statusText}`)
      }

      if (onStream) {
        return this.handleStreamResponse(response, onStream)
      } else {
        const data = await response.json() as GLMChatResponse
        return data.choices[0]?.message?.content || ''
      }
    } catch (error) {
      console.error('GLM API Error:', error)
      throw error
    }
  }

  private async handleStreamResponse(
    response: Response,
    onStream: (content: string) => void
  ): Promise<string> {
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
            const data = line.slice(6)

            if (data === '[DONE]') {
              return fullContent
            }

            try {
              const parsed = JSON.parse(data) as GLMStreamResponse
              const content = parsed.choices[0]?.delta?.content

              if (content) {
                fullContent += content
                onStream(fullContent)
              }
            } catch (parseError) {
              console.warn('Failed to parse stream data:', data)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    return fullContent
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
          model: 'glm-4',
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 10,
        } as GLMChatRequest),
      })

      return response.ok
    } catch (error) {
      console.error('API Key validation error:', error)
      return false
    }
  }
}

// GLM服务实例
export const glmService = new GLMService(process.env.GLM_API_KEY || '')