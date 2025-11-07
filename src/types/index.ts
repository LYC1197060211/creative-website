export interface CreativeIdea {
  id: string
  title: string
  description: string
  tags: string[]
  category: string
  priority: 'low' | 'medium' | 'high'
  status: 'idea' | 'planning' | 'in-progress' | 'completed'
  techStack?: string[]
  estimatedTime?: string
  aiSuggestions?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  username: string
  email?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}