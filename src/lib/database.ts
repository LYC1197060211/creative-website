import { supabase } from './supabase'
import { supabaseAdmin } from './supabaseAdmin'
import { DatabaseTables, User, Idea, Project, Template, ChatSession, ChatMessage } from '@/types/database'

// 用户相关操作
export const userService = {
  // 创建用户
  async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from(DatabaseTables.USERS)
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data as User
  },

  // 获取用户
  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from(DatabaseTables.USERS)
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as User | null
  },

  // 更新用户
  async updateUser(userId: string, userData: Partial<User>) {
    const { data, error } = await supabase
      .from(DatabaseTables.USERS)
      .update(userData)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data as User
  }
}

// 创意相关操作
export const ideaService = {
  // 创建创意
  async createIdea(ideaData: Partial<Idea>) {
    const { data, error } = await supabase
      .from(DatabaseTables.IDEAS)
      .insert(ideaData)
      .select()
      .single()

    if (error) throw error
    return data as Idea
  },

  // 获取用户的所有创意
  async getUserIdeas(userId: string) {
    const { data, error } = await supabase
      .from(DatabaseTables.IDEAS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Idea[]
  },

  // 更新创意
  async updateIdea(ideaId: string, ideaData: Partial<Idea>) {
    const { data, error } = await supabase
      .from(DatabaseTables.IDEAS)
      .update(ideaData)
      .eq('id', ideaId)
      .select()
      .single()

    if (error) throw error
    return data as Idea
  },

  // 删除创意
  async deleteIdea(ideaId: string) {
    const { error } = await supabase
      .from(DatabaseTables.IDEAS)
      .delete()
      .eq('id', ideaId)

    if (error) throw error
    return true
  }
}

// 项目相关操作
export const projectService = {
  // 创建项目
  async createProject(projectData: Partial<Project>) {
    const { data, error } = await supabase
      .from(DatabaseTables.PROJECTS)
      .insert(projectData)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  // 获取用户的所有项目
  async getUserProjects(userId: string) {
    const { data, error } = await supabase
      .from(DatabaseTables.PROJECTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  },

  // 获取精选项目
  async getFeaturedProjects() {
    const { data, error } = await supabase
      .from(DatabaseTables.PROJECTS)
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  },

  // 更新项目
  async updateProject(projectId: string, projectData: Partial<Project>) {
    const { data, error } = await supabase
      .from(DatabaseTables.PROJECTS)
      .update(projectData)
      .eq('id', projectId)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  // 删除项目
  async deleteProject(projectId: string) {
    const { error } = await supabase
      .from(DatabaseTables.PROJECTS)
      .delete()
      .eq('id', projectId)

    if (error) throw error
    return true
  }
}

// 模板相关操作
export const templateService = {
  // 创建模板
  async createTemplate(templateData: Partial<Template>) {
    const { data, error } = await supabase
      .from(DatabaseTables.TEMPLATES)
      .insert(templateData)
      .select()
      .single()

    if (error) throw error
    return data as Template
  },

  // 获取所有模板
  async getAllTemplates() {
    const { data, error } = await supabase
      .from(DatabaseTables.TEMPLATES)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Template[]
  },

  // 获取精选模板
  async getFeaturedTemplates() {
    const { data, error } = await supabase
      .from(DatabaseTables.TEMPLATES)
      .select('*')
      .eq('featured', true)
      .order('rating', { ascending: false })

    if (error) throw error
    return data as Template[]
  },

  // 按分类获取模板
  async getTemplatesByCategory(category: string) {
    const { data, error } = await supabase
      .from(DatabaseTables.TEMPLATES)
      .select('*')
      .eq('category', category)
      .order('rating', { ascending: false })

    if (error) throw error
    return data as Template[]
  },

  // 更新模板评分
  async updateTemplateRating(templateId: string, rating: number) {
    // 使用管理客户端执行此操作
    const { data, error } = await supabaseAdmin.rpc('update_template_rating', {
      template_id: templateId,
      new_rating: rating
    })

    if (error) throw error
    return data
  }
}

// 聊天相关操作
export const chatService = {
  // 创建聊天会话
  async createSession(sessionData: Partial<ChatSession>) {
    const { data, error } = await supabase
      .from(DatabaseTables.CHAT_SESSIONS)
      .insert(sessionData)
      .select()
      .single()

    if (error) throw error
    return data as ChatSession
  },

  // 获取用户的聊天会话
  async getUserSessions(userId: string) {
    const { data, error } = await supabase
      .from(DatabaseTables.CHAT_SESSIONS)
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data as ChatSession[]
  },

  // 删除聊天会话
  async deleteSession(sessionId: string) {
    const { error } = await supabase
      .from(DatabaseTables.CHAT_SESSIONS)
      .delete()
      .eq('id', sessionId)

    if (error) throw error
    return true
  },

  // 添加消息
  async addMessage(messageData: Partial<ChatMessage>) {
    const { data, error } = await supabase
      .from(DatabaseTables.CHAT_MESSAGES)
      .insert(messageData)
      .select()
      .single()

    if (error) throw error
    return data as ChatMessage
  },

  // 获取会话消息
  async getSessionMessages(sessionId: string) {
    const { data, error } = await supabase
      .from(DatabaseTables.CHAT_MESSAGES)
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as ChatMessage[]
  }
}