export interface Template {
  id: string
  title: string
  description: string
  content: string
  category: TemplateCategory
  tags: string[]
  difficulty: TemplateDifficulty
  estimatedTime: string
  prerequisites: string[]
  learningObjectives: string[]
  resources: TemplateResource[]
  rating: number
  reviewCount: number
  usageCount: number
  featured: boolean
  author: string
  createdAt: string
  updatedAt: string
}

export enum TemplateCategory {
  WEB_DEVELOPMENT = 'web_development',
  MOBILE_APP = 'mobile_app',
  AI_ML = 'ai_ml',
  BLOCKCHAIN = 'blockchain',
  IOT = 'iot',
  GAME = 'game',
  DATA_SCIENCE = 'data_science',
  CLOUD_COMPUTING = 'cloud_computing',
  DEVOPS = 'devops',
  UI_UX = 'ui_ux',
  OTHER = 'other'
}

export enum TemplateDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface TemplateResource {
  id: string
  title: string
  type: ResourceType
  url?: string
  content?: string
  description?: string
}

export enum ResourceType {
  DOCUMENTATION = 'documentation',
  VIDEO = 'video',
  ARTICLE = 'article',
  CODE_EXAMPLE = 'code_example',
  TOOL = 'tool',
  BOOK = 'book',
  COURSE = 'course'
}

export interface TemplateFilter {
  category?: TemplateCategory
  difficulty?: TemplateDifficulty
  featured?: boolean
  minRating?: number
  search?: string
  tags?: string[]
  author?: string
}

export interface TemplateFormData {
  title: string
  description: string
  content: string
  category: TemplateCategory
  tags: string[]
  difficulty: TemplateDifficulty
  estimatedTime: string
  prerequisites: string[]
  learningObjectives: string[]
  resources: TemplateResource[]
  featured: boolean
  author: string
}

export interface TemplateReview {
  id: string
  templateId: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}