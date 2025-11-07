import { CreativeIdea } from '@/types'

interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface AIResponse {
  success: boolean
  data?: string
  error?: string
}

// GLM-4.6 API配置
const GLM_API_KEY = '1c5924b0c4e347cc83aeeb2f34e226d9.zYlHtR5n8T8e6nF4'
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

class AIService {
  private async callGLMAPI(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const response = await fetch(GLM_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'glm-4',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || 'API返回错误')
      }

      return {
        success: true,
        data: data.choices?.[0]?.message?.content || '抱歉，AI响应为空'
      }
    } catch (error) {
      console.error('GLM API调用错误:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  // 优化创意内容
  async optimizeIdea(idea: Partial<CreativeIdea>): Promise<AIResponse> {
    const systemPrompt = `你是一个专业的创意顾问和技术专家。请帮助用户优化他们的创意想法，提供具体可行的建议。

你的任务：
1. 分析创意的可行性和价值
2. 提供改进建议和优化方向
3. 推荐合适的技术栈和实现方案
4. 给出具体的下一步行动建议

请用中文回复，内容要具体、实用、可操作。`

    const userPrompt = `请帮我优化这个创意：

标题：${idea.title || '未命名'}
描述：${idea.description || '暂无描述'}
分类：${idea.category || '未分类'}
当前状态：${idea.status || '想法'}
优先级：${idea.priority || '中等'}
标签：${idea.tags?.join(', ') || '无'}
技术栈：${idea.techStack?.join(', ') || '未确定'}
预计时间：${idea.estimatedTime || '未估算'}

请提供详细的优化建议，包括：
1. 创意价值评估
2. 实现可行性分析
3. 技术方案建议
4. 具体实施步骤
5. 潜在风险和应对策略

请确保建议具体、实用，能够直接指导实施。`

    return this.callGLMAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  // 技术栈推荐
  async recommendTechStack(description: string, category: string): Promise<AIResponse> {
    const systemPrompt = `你是一个经验丰富的技术架构师。根据用户描述的创意，推荐最适合的技术栈。

推荐时要考虑：
1. 技术的成熟度和稳定性
2. 学习曲线和开发效率
3. 社区支持和生态系统
4. 性能和扩展性
5. 成本和维护便利性

请推荐3-5个技术选项，并说明推荐理由。`

    const userPrompt = `请为以下创意推荐技术栈：

创意描述：${description}
项目分类：${category}

请推荐：
1. 前端技术栈（如果适用）
2. 后端技术栈（如果适用）
3. 数据库选择
4. 部署和运维方案
5. 第三方服务建议

每个推荐都要说明理由和适用场景。`

    return this.callGLMAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  // 生成创意扩展内容
  async expandIdea(briefIdea: string): Promise<AIResponse> {
    const systemPrompt = `你是一个创意专家。帮助用户将简短的创意想法扩展为详细的项目规划。

扩展内容要包括：
1. 项目的核心价值和目标用户
2. 主要功能模块设计
3. 技术实现难点分析
4. 商业模式或价值点
5. 竞争优势分析
6. 发展规划和里程碑

请用结构化的方式回复，内容要具体、可操作。`

    const userPrompt = `请帮我扩展这个创意想法：

${briefIdea}

请将其扩展为一个完整的项目规划，包括详细的功能描述、技术方案和实施计划。`

    return this.callGLMAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  // 文档内容分析和优化建议
  async analyzeDocument(content: string, documentType: string): Promise<AIResponse> {
    const systemPrompt = `你是一个文档分析和优化专家。分析用户提供的文档内容，提供改进建议。

分析内容包括：
1. 文档结构和逻辑清晰度
2. 内容完整性和准确性
3. 语言表达和可读性
4. 专业术语使用是否恰当
5. 缺失的重要信息

请提供具体的修改建议和优化方案。`

    const userPrompt = `请分析以下${documentType}文档：

${content}

请提供详细的分析报告和改进建议。`

    return this.callGLMAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }

  // 项目实施计划生成
  async generateImplementationPlan(idea: Partial<CreativeIdea>): Promise<AIResponse> {
    const systemPrompt = `你是一个项目管理专家。为用户的创意生成详细的实施计划。

计划要包括：
1. 项目阶段划分和时间安排
2. 每个阶段的具体任务
3. 关键里程碑和交付物
4. 资源需求和风险评估
5. 质量控制措施

请制定现实可行的计划，考虑各种可能的风险因素。`

    const userPrompt = `请为以下创意生成详细的实施计划：

项目名称：${idea.title}
项目描述：${idea.description}
技术栈：${idea.techStack?.join(', ') || '未确定'}
预计时间：${idea.estimatedTime || '未确定'}

请生成一个分阶段的实施计划，包括时间安排、具体任务和里程碑。`

    return this.callGLMAPI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ])
  }
}

export const aiService = new AIService()