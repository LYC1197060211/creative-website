export interface Project {
  id: string
  title: string
  description: string
  content: string
  category: ProjectCategory
  tags: string[]
  status: ProjectStatus
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'web_development',
  MOBILE_APP = 'mobile_app',
  AI_ML = 'ai_ml',
  BLOCKCHAIN = 'blockchain',
  IOT = 'iot',
  GAME = 'game',
  OTHER = 'other'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export interface ProjectFilter {
  category?: ProjectCategory
  status?: ProjectStatus
  featured?: boolean
  search?: string
  tags?: string[]
}

export interface ProjectFormData {
  title: string
  description: string
  content: string
  category: ProjectCategory
  tags: string[]
  status: ProjectStatus
  technologies: string[]
  githubUrl?: string
  demoUrl?: string
  imageUrl?: string
  featured: boolean
}