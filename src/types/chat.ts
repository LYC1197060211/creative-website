export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  isStreaming?: boolean
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export type ChatMessageInput =
  Omit<ChatMessage, 'id' | 'timestamp'> &
  Partial<Pick<ChatMessage, 'id' | 'timestamp'>>

export interface GLMChatState {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoading: boolean
  apiKey: string
  currentMessage: string
  setCurrentSessionId: (id: string | null) => void
  createNewSession: () => string
  addMessage: (sessionId: string, message: ChatMessageInput) => string
  updateMessage: (sessionId: string, messageId: string, content: string) => void
  deleteMessage: (sessionId: string, messageId: string) => void
  deleteSession: (sessionId: string) => void
  updateSessionTitle: (sessionId: string, title: string) => void
  setCurrentMessage: (message: string) => void
  setIsLoading: (loading: boolean) => void
  setApiKey: (key: string) => void
  getSession: (sessionId: string) => ChatSession | undefined
  getCurrentSession: () => ChatSession | undefined
}
