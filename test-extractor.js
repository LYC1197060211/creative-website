// 测试智能解析器
// 复制GLMService中的解析逻辑来测试

function extractReplyFromReasoning(reasoningContent) {
  // 如果reasoning_content太短，直接返回
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

  // 4. 如果都没有找到，返回最后一句（清理后）
  const lastSentence = sentences[sentences.length - 2] // 倒数第二句，避免空字符串
  if (lastSentence && lastSentence.trim().length > 0) {
    const cleaned = lastSentence.trim().replace(/[**\*]/g, '')
    console.log('使用最后一句:', cleaned)
    return cleaned
  }

  // 5. 最后的后备方案
  console.log('使用后备方案')
  return reasoningContent.substring(Math.max(0, reasoningContent.length - 50))
}

// 测试样本
const testCases = [
  {
    name: '包含引号的回复',
    content: `1. 分析用户请求
用户说"你好"，请简单回复。
2. 最佳回复是"你好！"
这是一个友好的问候。`
  },
  {
    name: '包含结论的回复',
    content: `经过分析，用户想要一个简单的问候。
因此：你好！
这个回答简洁明了。`
  },
  {
    name: '包含多个选项的回复',
    content: `考虑了多种回复方式：
- "你好！"
- "您好！"
- "嗨！"
选择："你好！"`
  },
  {
    name: '简单的推理过程',
    content: `用户说你好，我也应该回复你好。
回答：你好！`
  },
  {
    name: '长篇推理的最后一句',
    content: `这是一个复杂的推理过程...
经过深入思考，我认为最合适的回复是：
你好！`
  },
  {
    name: '实际GLM-4.6输出样本',
    content: `1. **分析用户请求：**
    *   **核心任务：** "你好，请简单回复一个问候语。"
    *   **关键词：**
        *   "你好" (Hello) - 用户以一个问候语开始。
        *   "简单" (simple) - 这是一个关键约束。
        *   "问候语" (greeting) - 需要返回一个问候语。
    *   **意图：** 用户想要一个简单、直接的问候语回应。

2. **综合分析：**
    *   用户明确要求一个"简单"的问候语
    *   最直接、最合适的回应就是"你好！"
    *   这与用户的问候语相匹配，礼貌且直接

3. **最终决定：**
    回复："你好！"`
  }
]

console.log('=== 测试智能解析器 ===')

testCases.forEach((testCase, index) => {
  console.log(`\n--- 测试 ${index + 1}: ${testCase.name} ---`)
  const extracted = extractReplyFromReasoning(testCase.content)
  console.log('提取结果:', extracted)
})