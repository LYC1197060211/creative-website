// 用户表类型
export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

// 创意表类型
export interface Idea {
  id: string
  user_id: string
  title: string
  description: string
  tags: string[]
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'idea' | 'planning' | 'in-progress' | 'completed'
  tech_stack?: string[]
  ai_suggestions?: string
  created_at: string
  updated_at: string
}

// 项目表类型
export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  status: 'draft' | 'in-progress' | 'completed' | 'published'
  technologies: string[]
  github_url?: string
  demo_url?: string
  image_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}

// 模板表类型
export interface Template {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimated_time: string
  prerequisites: string[]
  learning_objectives: string[]
  rating: number
  review_count: number
  usage_count: number
  featured: boolean
  author: string
  created_at: string
  updated_at: string
}

// 聊天会话表类型
export interface ChatSession {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

// 聊天消息表类型
export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

// 数据库表名映射
export const DatabaseTables = {
  USERS: 'users',
  IDEAS: 'ideas',
  PROJECTS: 'projects',
  TEMPLATES: 'templates',
  CHAT_SESSIONS: 'chat_sessions',
  CHAT_MESSAGES: 'chat_messages'
} as const